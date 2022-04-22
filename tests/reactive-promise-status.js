const fc = require('fast-check');
const assert = require('assert');
import ReactivePromiseStatus from '../src/reactive-promise-status';

require("@babel/polyfill");

function wait() {
    return new Promise((r) => setTimeout(r, 0));
}

describe('construct', () => {
    it('none', async () => {
        const obj = new ReactivePromiseStatus();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.noPromise);
    });
    it('pending', async () => {
        const obj = new ReactivePromiseStatus(new Promise(() => {
        }));
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.pending);
    });
    it('resolved', async () => {
        const obj = new ReactivePromiseStatus(Promise.resolve());
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
    });
    it('rejected', async () => {
        const obj = new ReactivePromiseStatus(Promise.reject(new Error()));
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.rejected);
    });
});

describe('changedPromise', () => {
    it('none', async () => {
        const obj = new ReactivePromiseStatus();
        obj.promise = null;
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.noPromise);
    });
    it('pending', async () => {
        const obj = new ReactivePromiseStatus();
        obj.promise = new Promise(() => {
        });
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.pending);
    });
    it('resolved', async () => {
        const obj = new ReactivePromiseStatus();
        obj.promise = Promise.resolve();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
    });
    it('rejected', async () => {
        const obj = new ReactivePromiseStatus();
        obj.promise = Promise.reject();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.rejected);
    });
    it('multi', async () => {
        const obj = new ReactivePromiseStatus();
        obj.promise = Promise.resolve();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        obj.promise = Promise.reject();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.rejected);
    });
    it('multi pending', async () => {
        const obj = new ReactivePromiseStatus();
        let symbol=Symbol();
        obj.promise = Promise.resolve(symbol);
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        assert.equal(obj.data, symbol);
        obj.promise = new Promise(()=>{});
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.pending);
        assert.equal(obj.data, null);
    });
    it('multi pending2', async () => {
        const obj = new ReactivePromiseStatus(null, true);
        let symbol=Symbol();
        obj.promise = Promise.resolve(symbol);
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        assert.equal(obj.data, symbol);
        obj.promise = new Promise(()=>{});
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        assert.equal(obj.data, symbol);
    });
});
describe('data and error', () => {
    it('none', async () => {
        const obj = new ReactivePromiseStatus();
        await wait();
        assert.equal(obj.data, null);
        assert.equal(obj.error, null);
    });
    it('pending', async () => {
        const obj = new ReactivePromiseStatus(new Promise(() => {
        }));
        await wait();
        assert.equal(obj.data, null);
        assert.equal(obj.error, null);
    });
    it('resolved', async () => {
        let sampleData = Symbol();
        const obj = new ReactivePromiseStatus(Promise.resolve(sampleData));
        await wait();
        assert.equal(obj.data, sampleData);
        assert.equal(obj.error, null);
    });
    it('rejected', async () => {
        let sampleError = new Error();
        const obj = new ReactivePromiseStatus(Promise.reject(sampleError));
        await wait();
        assert.equal(obj.data, null);
        assert.equal(obj.error, sampleError);
    });
});
it('enum', () => {
    assert.equal(ReactivePromiseStatus.Status.resolved, ReactivePromiseStatus.Status.resolved);
    assert.notEqual(ReactivePromiseStatus.Status.rejected, ReactivePromiseStatus.Status.resolved);
});
describe('changing', () => {
    it('1', async () => {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        let obj = new ReactivePromiseStatus(promise);
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.pending);
        resolve();
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        reject(new Error());
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
    });
});