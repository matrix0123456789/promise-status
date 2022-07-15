import {Enum} from 'enumify-fork';

export default class ReactivePromiseStatus {
    constructor(promise = null, keepOld = false) {
        this.promise = promise;
        this.keepOld = keepOld;
        this._onResolve = [];
        this._onReject = [];
    }

    set promise(promise) {
        if (!this.keepOld) {
            this.data = null;
            this.error = null;
            this.status = ReactivePromiseStatus.Status.noPromise;
        }
        this._promise = null;
        if (promise) {
            this._promise = promise;
            if (!this.keepOld) {
                this.status = ReactivePromiseStatus.Status.pending;
            }
            promise.then(data => {
                if (this._promise === promise) {
                    this.data = data;
                    this.status = ReactivePromiseStatus.Status.resolved;
                    while (this._onResolve.length) {
                        this._onResolve.pop()(data)
                    }
                    this._onReject = [];
                }
            }, error => {
                if (this._promise === promise) {
                    this.error = error;
                    this.status = ReactivePromiseStatus.Status.rejected;
                    while (this._onReject.length) {
                        this._onReject.pop()(error)
                    }
                    this._onResolve = [];
                }
            })
        }
    }

    get promise() {
        return this._promise;
    }

    then(onResolve, onReject) {
        return new Promise(async (res, rej) => {
            if (this.status == ReactivePromiseStatus.Status.resolved) {
                if (onResolve) {
                    try {
                        let data2 = await onResolve(this.data)
                        res(data2)
                    } catch (ex) {
                        rej(ex)
                    }
                } else
                    res(this.data)
            } else if (this.status == ReactivePromiseStatus.Status.rejected) {
                if (onReject) {
                    try {
                        let data2 = await onReject(this.error)
                        res(data2)
                    } catch (ex) {
                        rej(ex)
                    }
                } else
                    rej(this.error)
            } else {
                if (onResolve)
                    this._onResolve.push(async data => {
                        try {
                            let data2 = await onResolve(this.data)
                            res(data2)
                        } catch (ex) {
                            rej(ex)
                        }
                    })
                else
                    this._onReject.push(rej)
                if (onReject)
                    this._onReject.push(async error => {
                        try {
                            let data2 = await onReject(this.error)
                            res(data2)
                        } catch (ex) {
                            rej(ex)
                        }
                    })
                else
                    this._onReject.push(rej)
            }
        });
    }
}

ReactivePromiseStatus.Status = class extends Enum {
};
ReactivePromiseStatus.Status.initEnum(['noPromise', 'pending', 'resolved', 'rejected']);