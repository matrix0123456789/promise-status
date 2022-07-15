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
        let symbol = Symbol();
        obj.promise = Promise.resolve(symbol);
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        assert.equal(obj.data, symbol);
        obj.promise = new Promise(() => {
        });
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.pending);
        assert.equal(obj.data, null);
    });
    it('multi pending2', async () => {
        const obj = new ReactivePromiseStatus(null, true);
        let symbol = Symbol();
        obj.promise = Promise.resolve(symbol);
        await wait();
        assert.equal(obj.status, ReactivePromiseStatus.Status.resolved);
        assert.equal(obj.data, symbol);
        obj.promise = new Promise(() => {
        });
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
describe('be promise itself', () => {
    it('then', async () => {
        let result = null;
        const obj = new ReactivePromiseStatus();
        obj.then(x => result = x)
        await wait();
        assert.equal(result, null);
        obj.promise = Promise.resolve(123);
        await wait();
        assert.equal(result, 123);
    });
    it('await', async () => {
        const obj = new ReactivePromiseStatus(Promise.resolve(123));
        assert.equal(await obj, 123);
    });
    it('timeout', async () => {
        let result = null;
        let startTime = new Date();
        const obj = new ReactivePromiseStatus(new Promise(r => setTimeout(() => r(222), 100)));
        obj.then(x => result = x)
        assert.equal(result, null);
        await wait();
        assert.equal(result, null);
        let res = await obj
        assert.equal(res, 222);
        assert(new Date() - startTime >= 100);
    });
    it('chain', async () => {
        const obj = new ReactivePromiseStatus(new Promise(r=>setTimeout(()=>r(1), 0)));
        const res = await obj.then(x => x * 10).then(x => x * 2).then(x => x * 3)
        await wait();
        const res2 = await obj.then(x => x * 10).then(x => x * 2).then(x => x * 3)
        assert.equal(res, 60);
        assert.equal(res2, 60);
    });
});