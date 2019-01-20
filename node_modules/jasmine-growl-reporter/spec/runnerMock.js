var _ = require('lodash');

var RunnerMock = function(reporter) {
  this.reporter = reporter;
};

_.extend(RunnerMock.prototype, {

  suite: function(callback) {
    this.reporter.jasmineStarted();
    callback.apply(this);
    this.reporter.jasmineDone();
  },

  passTest: function() {
    this.reporter.specStarted();
    this.reporter.specDone({ status: 'passed' });
  },

  failTest: function() {
    this.reporter.specStarted();
    this.reporter.specDone({ status: 'failed' });
  },

  skipTest: function() {
    this.reporter.specStarted();
    this.reporter.specDone({ status: 'pending' });
  }
});

module.exports = RunnerMock;
