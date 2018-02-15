'use strict';

const fetch = require('node-fetch');
const _ = require('lodash');

class Utils {
  /**
   * Sets up the skeleton for the routeInformation POST request body that will be sent to the Mountebank server to set up the imposter
   * @param  {Object} options     The set of options to configure the imposter
   * @param  {String} options.mountebankHost     The name of the network host or ip address of the Mountebank server (defaults to 127.0.0.1)
   * @param  {Number} options.mountebankPort     The port number on which the Mountebank server is to listen on (defaults to 2525)
   * @param  {Number} options.imposterPort     The port number on which this particular Imposter is to listen on
   * @param  {String} options.protocol     The protocol that the imposter is to listen on. Options are http, https, tcp, and smtp (defaults to http)
   * @return {Object }         Returns an instance of the Imposter class
   */
  constructor(options) {
    if (!_.isObject(options)) {
      throw new TypeError('options must be a Object');
    }
    if (options.protocol == null) {
      options.protocol = 'http';
    }
    if (options.mountebankHost == null) {
      options.mountebankHost = process.env.MOUNTEBANK_HOST || '127.0.0.1'
    }
    if (options.mountebankPort == null) {
      options.mountebankPort = process.env.MOUNTEBANK_PORT || 2525;
    }
    /* This is the JSON representation of our available routes. This will be formatted similarly to swagger. This is NOT the body of our Imposter POST request */
    this.ImposterInformation = {
      'mountebankPort': options.mountebankPort,
      'mountebankHost': options.mountebankHost,
      'protocol': options.protocol,
      'routeInformation': {}
    };
  }

  /** ASYNC-METHOD
   * deletes all imposters
   * mountebank will return details on the deleted imposters upon a successful delete request
   * @return {Promise}    we return a resolved promise containing the contents of the deleted imposters
   */
  deleteImposters() {
    // make DELETE request to the mountebank server (through fetch)...
    return fetch(`http://${this.ImposterInformation.mountebankHost}:${this.ImposterInformation.mountebankPort}/imposters`, {
      method: 'delete'
    })
      .then(function (response) { // retrieve the text body from the response
        return response.text();
      })
      .then(function (body) {
        return body; // Return resolved promise containing text body from response
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }
}

module.exports = Utils;
