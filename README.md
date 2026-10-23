# Elm & Fern

Sample shop that new Maintainer Pro workspaces open as the default app. Plain HTML, CSS, and JavaScript — nothing to install.

Open `public/index.html` in a browser. When this folder is attached in Maintainer Pro, the bridge serves it.

The shop is finished on purpose. Three numbered prompts sit at the top. Hover a number to see the part of the page it changes, then click to copy the message and paste it into the chat.

## Where to edit

| Change | Where |
| --- | --- |
| Name, tagline, announcement, address, hours | `public/app.js` — `shop` |
| Plants and prices | `public/app.js` — `plants` |
| The three prompts at the top | `public/app.js` — `hooks` |
| Colors, including the dark palette | `public/styles.css` — `:root` |

Ideas on the page copy themselves. Paste one into the Maintainer Pro chat.

## License

MIT. See [LICENSE](LICENSE).
