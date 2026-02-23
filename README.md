# Void

[![License](https://img.shields.io/github/license/imjustprism/Void?style=flat-square)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributing-guide-blue?style=flat-square)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/imjustprism/Void?style=flat-square)](https://github.com/imjustprism/Void/stargazers)

A modification for [Grok](https://grok.com), inspired by [Vencord](https://github.com/Vendicated/Vencord).

## Installation

### Userscript

(ITS CURRENTLY BROKEN! USE EXTENSION INSTEAD)

1. Install a userscript manager ([Violentmonkey](https://violentmonkey.github.io/), [Tampermonkey](https://www.tampermonkey.net/), etc.)
2. Build Void (see [Building from Source](#building-from-source))
3. Load `dist/Void.user.js` into your userscript manager

### Browser Extension

1. Build with `bun run build:ext`
2. Load the `dist/` folder as an unpacked extension in your browser

## Building from Source

```sh
git clone https://github.com/imjustprism/Void.git
cd Void
bun install
bun run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=imjustprism/Void&type=Date)](https://star-history.com/#imjustprism/Void&Date)

## Disclaimer

Grok is a trademark of xAI Corp. and is solely mentioned for the sake of descriptivity. Mention of it does not imply any affiliation with or endorsement by xAI Corp.

## License

[GPL-3.0-or-later](LICENSE)
