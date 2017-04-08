'use strict';

const io = require('socket.io-client');
const Endpoint = require('./Endpoint');

/**
 * Exposes a wrapper around a socket.io client connection to a server.
 * @param {string} location
 * @class ClientEndpoint
 * @extends {Endpoint}
 */
class ClientEndpoint extends Endpoint {
  constructor(location) {
    super();
    // this._socket is likely a namespaced socket
    this._socket = io.connect(location);
    this._socket.on('connect', this._newConnection);
    this._socket.on('disconnect', this._lostConnection);
    // acknowledges message receipt
    this._socket.on('message', (msg, cb = () => {}) => {
      this._publish(msg.type, msg.data);
      cb();
    });
    this._socket.on('packet', packet => {
      this._publish('packet', packet);
    });
  }

  /**
   * Post a message to the server. Resolves when the message is acknowledged. Nothing is sent to the acknowledgement.
   * @param  {string} type Type of message to send to the server.
   * @param  {*} [data] Contents of the message.
   * @return {Promise} Promise that resolves when the server acknowledges the message.
   */
  postMessage(type, data = '') {
    const socket = this._socket;
    return new Promise(resolve => {
      const msg = {};
      msg.type = type;
      msg.data = data;
      socket.emit('message', msg, resolve);
    });
  }

  /**
   * Send a request. Returns a promise that resolves to the response.
   * @param  {string} type Info you are requesting.
   * @param  {string} [key] nconf style key
   * @return {Promise} Promise that receives the response.
   */
  request(type, key) {
    const socket = this._socket;
    const msg = {type, key};
    return new Promise(resolve => {
      socket.emit('request', msg, resolve);
    });
  }
}

module.exports = ClientEndpoint;
