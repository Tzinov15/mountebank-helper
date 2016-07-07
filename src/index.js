'use strict';

const mb = require('mountebank');
const tcpPortUsed = require('tcp-port-used');

exports.Imposter = require('./imposter');

exports.startMbServer = function (port) {
  return tcpPortUsed.check(port, '127.0.0.1')
  .then( function(inUse) {
    if (inUse == true) {
      return Promise.resolve(`Port ${port} is already in use!`);
    }
    if (inUse == false) {
      return mb.create({
        port           : port,
        pidfile        : './mb.pid',
        logfile        : './mb.log',
        loglevel       : 'error',
        mock           : true,
        allowInjection : true,
      });
    }
  }, function(error) {
    console.log('error from tcpPortUsed.check:');
    console.log(error);
    return Promise.reject(error);
  }
)
};
