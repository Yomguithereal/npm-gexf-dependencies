# npm-gexf-dependencies

Basic tool for converting the results of npm ls --json into a gexf file.

## Installation

```bash
# Globally or not, whatever
npm install -g git+https://github.com/Yomguithereal/npm-gexf-dependencies
```

## Usage

```bash
# Every deps
npm ls --json | npm-gexf-dependencies > deps.gexf

# Filtering dev deps
npm ls --json --production | npm-gexf-dependencies > deps.gexf

# Only dev deps
npm ls --json --dev | npm-gexf-dependencies > deps.gexf
```

## Commands

```bash
# Build the ES6 sources
npm run build

# Basic test
npm run test
```
