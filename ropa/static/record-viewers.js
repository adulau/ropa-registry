import { VtJson, VtMarkdown } from './vendor/vitrine/viewers.js';

for (const [name, component] of [['vt-json', VtJson], ['vt-markdown', VtMarkdown]]) {
  if (!customElements.get(name)) customElements.define(name, component);
}

// Keep server-rendered text available until a viewer has rendered successfully.
// A failed module load, disabled JavaScript or a viewer error keeps that fallback.
for (const wrapper of document.querySelectorAll('[data-record-viewer]')) {
  const source = wrapper.querySelector('.viewer-source');
  const kind = wrapper.dataset.recordViewer;
  const viewer = document.createElement(`vt-${kind}`);
  let failed = false;
  viewer.hidden = true;
  viewer.setAttribute('variant', 'full');
  viewer.setAttribute('theme', 'light');
  viewer.setAttribute('label', kind === 'json' ? 'activity.json' : 'activity.md');
  viewer.setAttribute('max-height', '640px');
  if (kind === 'markdown') viewer.setAttribute('images', 'block');
  viewer.addEventListener('vt-ready', () => {
    if (failed) return;
    source.hidden = true;
    viewer.hidden = false;
  });
  viewer.addEventListener('vt-error', () => {
    failed = true;
    source.hidden = false;
    viewer.hidden = true;
  });
  // Pass strings directly so large JSON numbers never pass through JSON.parse.
  viewer.content = source.textContent;
  wrapper.append(viewer);
}
