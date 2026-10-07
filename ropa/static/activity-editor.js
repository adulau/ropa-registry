/* Schema-driven editing; the existing JSON endpoint remains the save contract. */
(() => {
  "use strict";
  const form = document.getElementById("activity-editor");
  if (!form) return;
  const schema = JSON.parse(document.getElementById("activity-schema").textContent);
  const raw = document.getElementById("payload-json");
  const editor = document.getElementById("form-editor");
  const rawPanel = document.getElementById("json-editor-panel");
  const error = document.getElementById("editor-error");
  const formButton = document.getElementById("show-form");
  const jsonButton = document.getElementById("show-json");
  let model;
  let mode = "json";
  let nextId = 0;
  const numberPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  const exactNumbersSupported = typeof JSON.rawJSON === "function" && typeof JSON.isRawJSON === "function"
    && JSON.parse("0", (key, value, context) => context && context.source === "0") === true;
  const exactNumber = value => typeof JSON.isRawJSON === "function" && JSON.isRawJSON(value);
  const numberText = value => exactNumber(value) ? value.rawJSON : String(value);
  function parseJSON(text) {
    if (!exactNumbersSupported) {
      throw new Error("Update your browser to use the form editor safely, or continue with the JSON editor.");
    }
    // The reviver source retains each original numeric token before any rounding.
    // rawJSON makes stringify emit that token directly, including inside extra fields.
    return JSON.parse(text, (key, value, context) => typeof value === "number" ? JSON.rawJSON(context.source) : value);
  }
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value) && !exactNumber(value);
  const fieldLabels = new Map([["id", "ID"], ["id_old", "Old ID"], ["special_catgories", "Special Categories"]]);
  const label = key => fieldLabels.get(String(key))
    || String(key).replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const button = (text, action) => {
    const element = node("button", text);
    element.type = "button";
    element.addEventListener("click", action);
    return element;
  };
  const put = (parent, key, value) => Object.defineProperty(parent, key, {
    value, enumerable: true, configurable: true, writable: true,
  });
  const properties = definition => {
    const entries = Object.entries(definition.properties || {}).filter(([, child]) => object(child));
    if (definition === schema) {
      const priority = ["id", "name"];
      const rank = key => priority.includes(key) ? priority.indexOf(key) : priority.length;
      entries.sort(([a], [b]) => rank(a) - rank(b));
    }
    return entries;
  };
  function defaultValue(definition) {
    if (own(definition, "default")) return structuredClone(definition.default);
    if (definition.enum) return definition.enum[0];
    if (definition.type === "array") return [];
    if (definition.type === "object") {
      const value = {};
      for (const [key, child] of properties(definition)) {
        if (Array.isArray(definition.required) && definition.required.includes(key) || child.required === true) {
          put(value, key, defaultValue(child));
        }
      }
      return value;
    }
    if (definition.type === "boolean") return false;
    if (["number", "integer"].includes(definition.type)) return 0;
    return "";
  }
  function matches(value, type) {
    if (type === "object") return object(value);
    if (type === "array") return Array.isArray(value);
    if (type === "number" && exactNumber(value)) return true;
    if (type === "integer") return Number.isInteger(exactNumber(value) ? Number(value.rawJSON) : value);
    return typeof value === type;
  }
  function showError(message) {
    error.textContent = message;
    error.hidden = !message;
  }
  function validFields(except = null) {
    for (const input of editor.querySelectorAll("input,select,textarea")) {
      if (except && except.contains(input)) continue;
      if (!input.checkValidity()) {
        showError("Fix the highlighted field before saving or switching editors.");
        for (let section = input.parentElement; section && section !== editor; section = section.parentElement) {
          if (section.tagName === "DETAILS") section.open = true;
        }
        input.reportValidity();
        input.focus();
        return false;
      }
    }
    return true;
  }
  function redraw() {
    const openPaths = new Set([...editor.querySelectorAll("details[open]")].map(el => el.dataset.path));
    const initialized = editor.hasChildNodes();
    editor.replaceChildren();
    renderObject(editor, model, schema, []);
    if (initialized) {
      for (const section of editor.querySelectorAll("details")) section.open = openPaths.has(section.dataset.path);
    }
  }
  function focusField(path) {
    const added = [...editor.querySelectorAll("[data-field-path]")].find(el => el.dataset.fieldPath === JSON.stringify(path));
    if (!added) return;
    const section = added.querySelector(":scope > details");
    if (section) section.open = true;
    const input = added.querySelector("input,select,textarea");
    if (input) input.focus();
  }
  function renderObject(container, value, definition, path) {
    const known = new Set();
    for (const [key, child] of properties(definition)) {
      known.add(key);
      const required = Array.isArray(definition.required) && definition.required.includes(key) || child.required === true;
      renderField(container, value, key, child, [...path, key], required);
    }
    const extra = Object.keys(value).filter(key => !known.has(key));
    if (extra.length) {
      const section = node("details", undefined, "editor-section");
      section.dataset.path = JSON.stringify([...path, "$extra"]);
      section.append(node("summary", "Additional fields"));
      const body = node("div", undefined, "editor-section-body");
      body.append(node("p", "These extra fields are preserved and can be edited individually as JSON.", "hint"));
      for (const key of extra) renderField(body, value, key, {}, [...path, key], false);
      section.append(body);
      container.append(section);
    }
  }
  function renderField(container, parent, key, definition, path, required) {
    const present = own(parent, key);
    const value = parent[key];
    const title = Array.isArray(parent) ? `Item ${Number(key) + 1}` : label(key);
    const composite = ["object", "array"].includes(definition.type);
    const wrapper = node("div", undefined, composite ? "editor-field editor-composite" : "editor-field");
    wrapper.dataset.fieldPath = JSON.stringify(path);
    const header = node("div", undefined, "editor-field-head");
    const id = `activity-field-${++nextId}`;
    const caption = node("label", title);
    if (!composite) caption.htmlFor = id;
    header.append(caption);
    if (required) header.append(node("span", "Required", "badge"));
    const remove = button(Array.isArray(parent) ? "Remove item" : "Remove field", () => {
      if (!validFields(wrapper)) return;
      if (Array.isArray(parent)) parent.splice(Number(key), 1);
      else delete parent[key];
      redraw();
    });
    remove.setAttribute("aria-label", `${remove.textContent}: ${title}`);
    remove.hidden = !present;
    header.append(remove);
    wrapper.append(header);
    if (definition.description) wrapper.append(node("p", definition.description, "hint editor-description"));
    const set = newValue => {
      put(parent, key, newValue);
      remove.hidden = false;
    };
    if (composite && !present) {
      wrapper.append(button(`Add ${title}`, () => {
        if (!validFields()) return;
        set(defaultValue(definition));
        redraw();
        focusField(path);
      }));
    } else if (composite && matches(value, definition.type)) {
      caption.removeAttribute("for");
      const section = node("details", undefined, "editor-section");
      section.dataset.path = JSON.stringify(path);
      section.open = path.length === 1;
      section.append(node("summary", definition.type === "array" ? `${title} (${value.length})` : title));
      const body = node("div", undefined, "editor-section-body");
      if (definition.type === "object") renderObject(body, value, definition, path);
      else {
        value.forEach((item, index) => renderField(body, value, index, definition.items || {}, [...path, index], false));
        body.append(button(`Add item to ${title}`, () => {
          if (!validFields()) return;
          value.push(defaultValue(definition.items || {}));
          redraw();
          focusField([...path, value.length - 1]);
        }));
        if (!value.length) body.prepend(node("p", "No items yet.", "hint"));
      }
      wrapper.append(section);
      section.append(body);
    } else {
      let input;
      if (!definition.type || present && !matches(value, definition.type)) {
        input = node("textarea");
        input.className = "editor-json-value";
        input.rows = 4;
        input.value = JSON.stringify(value, null, 2);
        wrapper.append(node("p", definition.type
          ? `This existing value is not a ${definition.type}. Correct it as JSON or replace it to use the form control.`
          : "JSON value", "hint"));
        input.addEventListener("input", () => {
          try {
            set(parseJSON(input.value));
            input.setCustomValidity("");
          } catch {
            input.setCustomValidity("Enter a valid JSON value.");
          }
        });
        if (definition.type) wrapper.append(button(`Replace with ${definition.type}`, () => {
          if (!validFields(wrapper)) return;
          set(defaultValue(definition));
          redraw();
        }));
      } else if (definition.enum) {
        input = node("select");
        if (!present) input.append(new Option("Not set", ""));
        definition.enum.forEach((choice, index) => input.append(new Option(String(choice), String(index))));
        const index = definition.enum.findIndex(choice => choice === value);
        if (present && index < 0) input.append(new Option(`Current value: ${value} (outside the listed choices)`, "legacy"));
        input.value = present ? index < 0 ? "legacy" : String(index) : "";
        const selectedText = node("p", present ? String(value) : "", "hint editor-enum-value");
        wrapper.append(selectedText);
        input.addEventListener("change", () => {
          if (input.value === "") { delete parent[key]; remove.hidden = true; selectedText.textContent = ""; }
          else {
            set(input.value === "legacy" ? value : definition.enum[Number(input.value)]);
            selectedText.textContent = String(parent[key]);
          }
        });
      } else if (definition.type === "boolean") {
        input = node("select");
        if (!present) input.append(new Option("Not set", ""));
        input.append(new Option("Yes", "true"), new Option("No", "false"));
        input.value = present ? String(value) : "";
        input.addEventListener("change", () => {
          if (input.value === "") { delete parent[key]; remove.hidden = true; }
          else set(input.value === "true");
        });
      } else if (["number", "integer"].includes(definition.type)) {
        input = node("input");
        input.type = "text";
        input.inputMode = "decimal";
        input.value = present ? numberText(value) : "";
        input.addEventListener("input", () => {
          if (!input.value) {
            delete parent[key]; remove.hidden = true; input.setCustomValidity("");
          } else if (numberPattern.test(input.value)) {
            set(JSON.rawJSON(input.value));
            input.setCustomValidity("");
          } else input.setCustomValidity("Enter a number, such as 42, -0.5 or 1e3.");
        });
      } else {
        input = node("textarea");
        input.rows = key === "name" ? 1 : 2;
        input.value = present ? value : "";
        input.addEventListener("input", () => set(input.value));
      }
      input.id = id;
      input.dataset.editorInput = "true";
      input.setAttribute("aria-label", title);
      wrapper.append(input);
    }
    container.append(wrapper);
  }
  function selectMode(nextMode) {
    if (nextMode === "form") {
      try {
        const parsed = parseJSON(raw.value);
        if (!object(parsed)) throw new Error("The processing activity must be a JSON object.");
        model = parsed;
        redraw();
      } catch (exception) {
        showError(`Unable to open the form: ${exception.message}`);
        raw.focus();
        return;
      }
    } else if (mode === "form") {
      if (!validFields()) return;
      raw.value = JSON.stringify(model, null, 2);
    }
    mode = nextMode;
    editor.hidden = mode !== "form";
    rawPanel.hidden = mode !== "json";
    for (const input of editor.querySelectorAll("input,select,textarea")) input.disabled = mode !== "form";
    formButton.setAttribute("aria-pressed", String(mode === "form"));
    jsonButton.setAttribute("aria-pressed", String(mode === "json"));
    showError("");
  }
  formButton.addEventListener("click", () => { if (mode !== "form") selectMode("form"); });
  jsonButton.addEventListener("click", () => { if (mode !== "json") selectMode("json"); });
  form.addEventListener("submit", event => {
    if (mode === "form") {
      if (!validFields()) { event.preventDefault(); return; }
      raw.value = JSON.stringify(model, null, 2);
    }
  });
  form.addEventListener("invalid", event => {
    if (!editor.contains(event.target)) return;
    showError("Fix the highlighted field before saving or switching editors.");
    for (let section = event.target.parentElement; section && section !== editor; section = section.parentElement) {
      if (section.tagName === "DETAILS") section.open = true;
    }
  }, true);
  document.querySelector(".editor-switch").hidden = false;
  selectMode("form");
})();
