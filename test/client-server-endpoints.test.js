'use strict';

var testPort = 5003;
var testURL = `http://localhost:${testPort}`;

const endpoint = require('..');
const {ClientEndpoint, ServerEndpoint} = endpoint;

describe('client and server endpoints:', function() {
  this.timeout(2000);
  let client = null;
  let server = null;
  let clientSpaced = null;
  let serverSpaced = null;
  let areReady = () => {};

  before(() => {
    client = new ClientEndpoint(testURL);
    const se = new ServerEndpoint(testPort);
    server = se.createNamespace();
    serverSpaced = se.createNamespace('space');
    clientSpaced = new ClientEndpoint(`${testURL}/space`);

    // for misc testing
    server.onrequest('test', 'ack');
    server.onrequest('squared', number => {
      return number * number;
    });

    clientSpaced.onmessage('made-connection', () => {
      areReady();
    }, true);

    serverSpaced.onconnection(postToClient => {
      postToClient('made-connection');
      areReady();
    });
  });

  afterEach(() => {
    client.clear();
    server.clear();
  });

  after(() => {
    client = null;
    server = null;
  });

  // let hasConnected = false;
  it('client and server can run onconnection callbacks', done => {
    areReady = () => {
      // still, it's the right idea to call the clear()s.
      done();
    };
  });

  it('server can push messages to client', done => {
    const testMessage = 'yo yo yo';
    client.onmessage('test', data => {
      data.should.equal(testMessage);
      done();
    });
    server.pushMessage('test', testMessage);
  });

  it('client can post messages to server', done => {
    const testMessage = 'sup?';
    server.onmessage('test', msg => {
      msg.should.equal(testMessage);
      done();
    });
    client.postMessage('test', testMessage);
  });

  it('client can request info from server', done => {
    const correctResponse = 'ack'; // set on server endpoint above
    client.request('test').then(response => {
      response.should.equal(correctResponse);
      done();
    });
  });

  it('server can do things with requested info', done => {
    client.request('squared', 4).should.eventually.equal(16).notify(done);
  });

  it('server can execute function on request from client', done => {
    const response = 'test response';
    server.onrequest('function-test', () => response);
    client.request('function-test').should.eventually.equal(response).notify(done);
  });

  it('server responds null on server errors to requests', done => {
    server.onrequest('error-function-test', () => {
      throw new Error();
    });
    client.request('error-function-test').should.eventually.equal(null).notify(done);
  });

  it('server and client can namespace messages from client', done => {
    const value = 'oh my gosh!';
    serverSpaced.onmessage('test', val => {
      val.should.equal(value);
      done();
    });
    clientSpaced.postMessage('test', value);
  });

  it('server and client can namespace messages from server', done => {
    const value = {
      thing: ['that part']
    };
    clientSpaced.onmessage('whaaaa', val => {
      val.should.deep.equal(value);
      done();
    });
    serverSpaced.pushMessage('whaaaa', value);
  });

  it('server should keep track of the number of connections', () => {
    serverSpaced.connections.length.should.equal(1);
  });
});
