# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

### Added
### Changed
### Fixed
### Deprecated


## [3.0.0]

### Added
- mapping iterator creator, allowing for a mapper which maps all record properties into a type/shape

### Changed
- updated all dependencies
- BREAKING: Updated to `template-literal-table` v4 for the table parsing, which supports a bunch of table style tweaks that may break depending on your usage (unlikely)
- There are now four formats in which the library is available: CommonJS, ES Modules, IIFE (browser) and TypeScript


## [2.0.0] - 2021-01-01

### Changed
- The package was rewritten to Typescript, this means the import/require mechanics have changed

### Added
- Following the template-literal-each functionality, added: `empty` and `create` functions


## [1.0.2 - 1.0.8] - 2020-09-06

### Changed
- depedency maintenance

## [1.0.1] - 2018-12-24

### Fixed
- package.json repository links


## [1.0.0] - 2018-12-24
- Initial release

[unreleased]: https://github.com/rspieker/template-literal-each/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/rspieker/template-literal-each/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/rspieker/template-literal-each/compare/v1.0.8...v2.0.0
[1.0.2 - 1.0.8]: https://github.com/rspieker/template-literal-each/compare/v1.0.1...v1.0.8
[1.0.1]: https://github.com/rspieker/template-literal-each/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/rspieker/template-literal-each/releases/tag/v1.0.0