# Jasmine Growl Reporter

[![NPM version](https://badge.fury.io/js/jasmine-growl-reporter.svg)](http://badge.fury.io/js/jasmine-growl-reporter)
[![Dependency Status](https://gemnasium.com/AlphaHydrae/jasmine-growl-reporter.svg)](https://gemnasium.com/AlphaHydrae/jasmine-growl-reporter)
[![Build Status](https://travis-ci.org/AlphaHydrae/jasmine-growl-reporter.svg?branch=master)](https://travis-ci.org/AlphaHydrae/jasmine-growl-reporter)

Growl notifications when running your Jasmine specs.

![jasmine-growl-reporter passed tests](https://raw.github.com/AlphaHydrae/jasmine-growl-reporter/master/res/screenshot-passed.png)
![jasmine-growl-reporter failed tests](https://raw.github.com/AlphaHydrae/jasmine-growl-reporter/master/res/screenshot-failed.png)

This reporter is included with [jasmine-node](https://github.com/mhevery/jasmine-node) and [grunt-jasmine-node](https://github.com/jasmine-contrib/grunt-jasmine-node).

See [node-growl](https://github.com/visionmedia/node-growl) for platform-specific installation instructions.

## Compatibility

* `v0.2.*` and higher are compatible with Jasmine 2.0 reporters
* `v0.0.*` are compatible with Jasmine 1.3 reporters

## OS X Notification Center

Due to how the OS X Notification Center and [terminal-notifier](https://github.com/alloy/terminal-notifier) work,
passed and failed icons cannot currently be shown when forwarding Growl notifications to the notification center:

![jasmine-growl-reporter notification center](https://raw.github.com/AlphaHydrae/jasmine-growl-reporter/master/res/screenshot-notification-center.png)

## Meta

* **Author:** [Simon Oulevay (Alpha Hydrae)](https://github.com/AlphaHydrae)
* **License:** MIT (see [LICENSE.txt](https://raw.github.com/AlphaHydrae/jasmine-growl-reporter/master/LICENSE.txt))
* **Icons:** [Free Must Have Icons from VisualPharm](http://www.visualpharm.com/must_have_icon_set/)

### Contributors

* [Michael Kebe](https://github.com/michaelkebe) (show passed and failed icons)
