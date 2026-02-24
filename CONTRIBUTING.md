# Contributing to Void

Void is a community project and we welcome contributions!

## Writing Plugins

The main way to contribute is by writing plugins.

Before starting, please:

- Check existing [pull requests](https://github.com/imjustprism/Void/pulls) to make sure someone isn't already working on the same thing
- Check [issues](https://github.com/imjustprism/Void/issues) for existing requests or rejected ideas

### Plugin Rules

- No raw DOM manipulation — use patches and React
- No plugins that just hide UI elements — use CSS for that
- No plugins that spam Grok's API

## Other Ways to Contribute

- Fix bugs, typos, or improve existing code
- Propose new features or plugin APIs

## Development Setup

Prerequisites: [Bun](https://bun.sh/) >= 1.0

```sh
git clone https://github.com/imjustprism/Void.git
cd Void
bun install
bun run build
```

## Code Style

We use [ESLint](https://eslint.org/) for linting and [Stylelint](https://stylelint.io/) for CSS. All source files need the license header.

Before committing, make sure the following all pass:

```sh
bun run lint:fix
bun run lint:styles:fix
bun run tsc
bun run build
```

## Pull Requests

- Fork the repo and branch off `dev`
- Make sure everything builds and lints cleanly
- Open a PR against `dev`
