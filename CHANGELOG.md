<!-- deno-fmt-ignore-file -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2021-11-25
### Added
- SocialNetwork transformer.
- SearchParams transformer.
- SearchEngine transformer.
- Limit transformer.
- Campaign transformer.
- OrganicTraffic report.
- Limit argument to `read` (10000 by default).
- Transformers and reporters are exported from `mod.ts`.

### Changed
- Simplified transformers. They are not longer generators, just plain functions.

## 0.1.0 - 2021-11-07
First version

[0.2.0]: https://github.com/oscarotero/analogger/compare/v0.1.0...v0.2.0
