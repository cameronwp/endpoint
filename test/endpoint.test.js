'use strict';

const endpoint = require('..');
const Endpoint = endpoint.Endpoint;

describe('Endpoint constructor:', () => {

  it('exposes on"event" methods', () => {
    const endpoint = new Endpoint();
    endpoint.onmessage.should.be.a('function');
    endpoint.onchange.should.be.a('function');
  });

  it('tracks client socket ids', () => {
    const endpoint = new Endpoint();
    const dummyId = 1234;
    endpoint._newConnection(dummyId);
    endpoint.connections.length.should.equal(1);
    endpoint.connections[0].should.equal(dummyId);
    endpoint.active.should.equal(true);
    endpoint._lostConnection(dummyId);
    endpoint.connections.length.should.equal(0);
    endpoint.active.should.equal(false);
  });

  it('can subscribe to and publish events', done => {
    const endpoint = new Endpoint();
    var input = 'hello';
    endpoint._subscribe('test', msg => {
      msg.should.equal(input);
      done();
    });
    endpoint._publish('test', input);
  });

  it('can clear subscriptions', done => {
    const endpoint = new Endpoint();
    let called = 0;
    endpoint._subscribe('thing', () => { called += 1; });
    endpoint._publish('thing', 'test');
    called.should.equal(1);
    endpoint.clear();
    endpoint._publish('thing', 'test');
    // makes the assumption that any subscriber would have been called < 50ms later. feels like a safe assumption.
    setTimeout(() => {
      called.should.equal(1);
      done();
    }, 50);
  });

  it('can clear one subscription', done => {
    const endpoint = new Endpoint();
    let called = 0;
    const topic = 'test';
    const sub = endpoint._subscribe(topic, () => {
      called += 1;
    });

    sub.remove();

    endpoint._subscribe(topic, () => {
      called += 1;
      called.should.equal(1);
      done();
    });
    endpoint._publish(topic);
  });

  it('can generate a change when a client connects', done => {
    const endpoint = new Endpoint();
    const testSID = '123456';

    endpoint.onchange(change => {
      change.count.should.equal(endpoint.connections.length);
      endpoint.active.should.equal(true);
      done();
    });
    endpoint._newConnection(testSID);
  });

  it('can generate a change when a client disconnects', done => {
    const endpoint = new Endpoint();
    const testSID = '123456';

    endpoint._newConnection(testSID);
    endpoint.onchange(change => {
      change.count.should.equal(endpoint.connections.length);
      endpoint.active.should.equal(false);
      done();
    });
    endpoint._lostConnection(testSID);
  });
});
