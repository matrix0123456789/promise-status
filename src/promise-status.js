const {Enum} = require('enumify-fork');

class PromiseStatus {
    constructor(promise = null) {
        this.promise = promise;
    }

    set promise(promise) {
        this.data = null;
        this.error = null;
        this.status = PromiseStatus.Status.noPromise;
        this._promise = null;
        if (promise) {
            this._promise = promise;
            this.status = PromiseStatus.Status.pending;
            promise.then(data => {
                if (this._promise === promise) {
                    this.data = data;
                    this.status = PromiseStatus.Status.resolved;
                }
            }, error => {
                if (this._promise === promise) {
                    this.error = error;
                    this.status = PromiseStatus.Status.resolved;
                }
            })
        }
    }

    get promise() {
        return this._promise;
    }
}

PromiseStatus.Status = class extends Enum {
};
PromiseStatus.Status.initEnum(['noPromise', 'pending', 'resolved', 'rejected']);
module.exports = {default: PromiseStatus};