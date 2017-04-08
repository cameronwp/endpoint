'use strict';

const app = require('express')();
const server = require('http').Server(app);
const socketio = require('socket.io');
const Endpoint = require('./Endpoint');

/**
 * Connection callback. Use socket.emit('message', data) to send data to client.
 * @callback socketCallback
 * @param {socket} socket connection to client.
 */

/**
 * Wraps a namespaced socket.io server.
 * @class Namespace
 * @extends {Endpoint}
 */
class Namespace extends Endpoint {
  constructor(name, io) {
    super();

    const self = this;

    this._requests = [];

    this.namespace = null;
    name ? this.namespace = io.of(`/${name}`) : this.namespace = io;

    this.namespace.on('connection', socket => {
      const sId = socket.id;
      // FYI, can get hostname with socket.handshake.headers.host;
      self._newConnection(sId);

      // You can subscribe to 'connect' and pass a message to a specific
      // client onconnection
      self._publish('connection', msg => {
        socket.emit.call(socket, 'message', msg);
      });

      socket.on('disconnect', () => {
        self._lostConnection(sId);
      });
      // acknowledges message receipt
      socket.on('message', (msg, cb = () => {}) => {
        self._publish(msg.type, msg.data);
        cb();
      });
      socket.on('request', (req, cb = () => {}) => {
        let request = null;
        let response = null;

        const {type, key} = req;

        try {
          request = this._requests.find(r => r.type === type);
        } catch (e) {
          request = null;
        }

        if (request) {
          switch (typeof request.response) {
            case 'function':
              try {
                response = request.response(key);
              } catch (e) {
                response = null;
              }

              break;
            case 'string':
              response = request.response;
              break;
            case 'number':
              response = request.response;
              break;
            case 'object':
              // could look for a Promise here too
              // if (request.response instanceof Promise)
              response = request.response;
              break;
            default:
              break;
          }
        }

        cb(response);
      });
    });
  }

  /**
   * Set onconnection handler when new clients join.
   * @param {socketCallback} cb
   */
  onconnection(cb) {
    this._subscribe('connection', cb);
  }

 /**
  * Generic message sender. Difficult to promisify because it's sent to many listeners.
  * @param {string} type
  * @param {any} data
  * @returns this
  */
  pushMessage(type, data = '') {
    const msg = {};
    msg.type = type;
    msg.data = data;
    this.namespace.emit('message', msg);
    return this;
  }

  /**
   * Sets up request handlers.
   * @param {string} type
   * @param {any} response If string or number, this method adds a handler to respond to client requests of type with the response of response. If response is a function, response is called when the request of type is received.
   */
  onrequest(type, response) {
    this._requests.push({type, response});
  }

  clear() {
    super.clear();
    this._requests = [];
  }
}

/**
 * A factory for creating namespaced socket.io servers.
 * @param {Socket} io Socket.io server. Probably received from SocketServer.
 * @class ServerEndpoint
 */
class ServerEndpoint {
  constructor(port) {
    this._io = socketio(server);
    server.listen(port);
    return this;
  }

  /**
   * Create handlers for communications. Must create a namespace before ServerEndpoint is usable!
   * @param {string} [name]
   * @returns {Namespace}
   */
  createNamespace(name) {
    const io = this._io;
    return new Namespace(name, io);
  }
}

module.exports = ServerEndpoint;
