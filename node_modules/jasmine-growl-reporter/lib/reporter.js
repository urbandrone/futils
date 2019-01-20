exports.inject = function(deps) {

  deps = deps || {};
  var growl = deps.growl || require('growl'),
      path = require('path');

  function GrowlReporter() {
  }

  GrowlReporter.prototype.jasmineStarted = function() {
    this.startedAt = new Date();
    this.counts = {
      failed: 0,
      pending: 0,
      total: 0
    };
  };

  GrowlReporter.prototype.specStarted = function() {
    this.counts.total++;
  };

  GrowlReporter.prototype.specDone = function(spec) {
    switch (spec.status) {
      case 'pending':
        this.counts.pending++;
        break;
      case 'failed':
        this.counts.failed++;
        break;
    }
  };

  GrowlReporter.prototype.jasmineDone = function() {

    growl(growlMessage(this.counts), {
      name: growlName,
      title: growlTitle(this.counts, this.startedAt),
      image: growlImage(this.counts)
    });
  };

  var growlName = 'Jasmine',
      resDir = path.resolve(__dirname, '../res');

  var growlTitle = function(counts, startedAt) {

    var title = passed(counts) ? 'PASSED' : 'FAILED';
    title += ' in ' + ((new Date().getTime() - startedAt.getTime()) / 1000) + 's';

    return title;
  };

  var growlMessage = function(counts) {

    var description = counts.total + ' tests';

    if (counts.total) {
      description += ', ' + counts.failed + ' failed';
    }

    if (counts.pending) {
      description += ', ' + counts.pending + ' pending';
    }

    return description;
  };

  var growlImage = function(counts) {
    if (passed(counts)) {
      return path.join(resDir, 'passed.png');
    } else {
      return path.join(resDir, 'failed.png');
    }
  };

  var passed = function(counts) {
    return !counts.failed;
  };

  return GrowlReporter;
};
