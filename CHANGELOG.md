# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2018-03-20

### Added

* Added styled-components and rewrote the styling of the component in JS
* New `theme` prop available to merge custom styles with the default theme
* Added tests for the component
* Added prettier for consistency
* Add pre-commit checks for linting and testing

### Changed

* Replaced ESlint with XO

### Removed

* Removed `contentStyles` and `triggerStyles` props in favour of theme prop.
