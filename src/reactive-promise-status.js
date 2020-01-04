import {Enum} from 'enumify-fork';

export default class ReactivePromiseStatus {
    constructor(promise = null) {
        this.promise = promise;
    }

    set promise(promise) {
        this.data = null;
        this.error = null;
        this.status = ReactivePromiseStatus.Status.noPromise;
        this._promise = null;
        if (promise) {
            this._promise = promise;
            this.status = ReactivePromiseStatus.Status.pending;
            promise.then(data => {
                if (this._promise === promise) {
                    this.data = data;
                    this.status = ReactivePromiseStatus.Status.resolved;
                }
            }, error => {
                if (this._promise === promise) {
                    this.error = error;
                    this.status = ReactivePromiseStatus.Status.rejected;
                }
            })
        }
    }

    get promise() {
        return this._promise;
    }
}

ReactivePromiseStatus.Status = class extends Enum {
};
ReactivePromiseStatus.Status.initEnum(['noPromise', 'pending', 'resolved', 'rejected']);