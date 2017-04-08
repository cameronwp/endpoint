'use strict';

const Pubsub = require('@marvin-dss/pubsub');

/**
 * Connection callback.
 * @callback connectionCallback
 * @param {string} sID Socket ID.
 */

/**
 * Changed connction callback.
 * @callback changeCallback
 * @param {number} count Number of connections
 */

/**
 * Message response callback.
 * @callback messageResponse
 * @param {any} response
 */

/**
 * Base class for handling socket.io connections.
 * @class Endpoint
 */
function Endpoint() {
  var self = this;
  const subscriptions = {};
  const ps = new Pubsub();
  this._publish = ps.publish;
  this._subscribe = ps.subscribe;
  this.active = false;
  this.connections = [];

  /**
   * Publishes a new connection.
   * @function _newConnection
   * @memberof Endpoint
   * @param {string} sID socket ID
   * @returns this
   */
  this._newConnection = sId => {
    self.connections.push(sId || 'unknown');
    self.active = true;
    self._publish('change', {count: self.connections.length});
    return this;
  };

  /**
   * Records a lost connection.
   * @function _lostConnection
   * @memberof Endpoint
   * @param {string} sID socket ID
   * @returns this
   */
  this._lostConnection = sId => {
    const index = this.connections.indexOf(sId);
    this.connections.splice(index, 1);
    if (this.connections.length === 0) {
      this.active = false;
    }

    self._publish('change', {count: self.connections.length});

    return this;
  };

  /**
   * Subscribe an action to perform when a message is received.
   * @function onmessage
   * @memberof Endpoint
   * @param {string} type
   * @param {messageResponse}
   * @param {boolean} [historical=false] Whether or not to call the listener if this message has been received before this listener was set.
   * @returns {subscription}
   */
  this.onmessage = (type, cb, historical = false) => {
    return self._subscribe(type, cb, historical);
  };

  /**
   * Subscribe an action to perform when the connection changes.
   * @function onchange
   * @memberof Endpoint
   * @param {changeCallback}
   * @returns {subscription}
   */
  this.onchange = cb => {
    return self._subscribe('change', cb);
  };

  /**
   * Remove all subscriptions to connection events.
   * @function clear
   * @memberof Endpoint
   */
  this.clear = ps.clear;
}

module.exports = Endpoint;
