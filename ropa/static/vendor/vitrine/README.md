# Vitrine viewers

Self-hosted JSON and Markdown components from
[ecrou-exact/vitrine](https://github.com/ecrou-exact/vitrine), pinned to
`7c379edba7ffb89abcae01b0806f20ed43dbc627` (upstream version `0.0.0`).
`viewers.js` contains only the two components and their shared dependencies.
`light.css` is the unmodified upstream light theme, also used by the host page.
License texts are included in `LICENSE` and `THIRD_PARTY_NOTICES.md`.

The checked-in assets need no Node.js, npm or CDN at application runtime.
Viewers use the ten built-in highlighting languages and the built-in themes;
optional language, syntax-theme and chart downloads are not enabled.
Source is available at the pinned upstream commit. No upstream source changes
are made; the build only selects the components and bundles their raw CSS.

To reproduce the assets with Node.js 20 or newer:

```bash
git clone https://github.com/ecrou-exact/vitrine.git /tmp/ropa-vitrine
git -C /tmp/ropa-vitrine checkout 7c379edba7ffb89abcae01b0806f20ed43dbc627
npm --prefix /tmp/ropa-vitrine ci --cache /tmp/ropa-vitrine-npm-cache --no-audit --no-fund
node scripts/vendor-vitrine.mjs /tmp/ropa-vitrine
(cd ropa/static/vendor/vitrine && sha256sum --check SHA256SUMS)
```

When updating, change the pinned revision in the build script and this file,
review upstream dependencies and notices, rebuild, and run the browser tests.
