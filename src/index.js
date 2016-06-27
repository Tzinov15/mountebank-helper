'use strict';

const mb = require('mountebank');

exports.Imposter = require('./imposter');
exports.startMbServer = function (port) {
  const mbCreateResult = mb.create({
    port           : port,
    pidfile        : './mb.pid',
    logfile        : './mb.log',
    loglevel       : 'error',
    mock           : true,
    allowInjection : true,
  });
  return mbCreateResult;
}

