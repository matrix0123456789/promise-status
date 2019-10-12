const PromiseStatus =require('../src/promise-status').default;
const fc = require('fast-check');
const assert = require('assert');

describe('promise-status', () => {
    describe('min', () => {

        it('construct', () => {
            const promise1=new Promise(()=>{});
            const obj=new PromiseStatus();
            assert.equal(obj.promise, null);
            assert.equal(obj.data, null);
            assert.equal(obj.error, null);
            assert.equal(obj.status, PromiseStatus.Status.noPromise);
            obj.promise=promise1;
            assert.equal(obj.promise, promise1);
            assert.equal(obj.data, null);
            assert.equal(obj.error, null);
            assert.equal(obj.status, PromiseStatus.Status.pending);

            const promise2=new Promise(()=>{});
            const obj2=new PromiseStatus(promise2);
            assert.equal(obj2.promise, promise2);
            assert.equal(obj2.data, null);
            assert.equal(obj2.error, null);
            assert.equal(obj2.status, PromiseStatus.Status.pending);
        });
        it('changing', () => {
            const promise1=Promise.resolve(5);
            const promise2=Promise.reject('error');
            const obj=new PromiseStatus(promise1);
            assert.equal(obj.promise, promise1);
            assert.equal(obj.data, 5);
            assert.equal(obj.error, null);
            assert.equal(obj.status, PromiseStatus.Status.resolved);
            obj.promise=promise2;
            assert.equal(obj.promise, promise2);
            assert.equal(obj.data, null);
            assert.equal(obj.error, 'error');
            assert.equal(obj.status, PromiseStatus.Status.rejected);
        });
    });
});

