# Descrption

This class is designet to be used with Vue.js

You provide promise to it, and it gives you property `status`, which informs you if promise is `pending` (data are still loading), `resolved` (data loaded successfully) of `rejected` (some error). `data` and `error` contains variables provided by `resolve and `reject` respectively.

But what is the difference between this and standard `.then().catch()`? Answer is, that you can use this properties directly in vue template (for example in v-if) or computed properties, and your html will be rerendered automatically.

# Example

```vue
<template>
    <div>
        <button @click="load(1)" :class="{active:active===1}">Show first article</button>
        <button @click="load(2)" :class="{active:active===1}">Show second article</button>
        <p v-if="content.status === Status.pending">Loading...</p>
        <p v-else-if="content.status === Status.resolved">{{content.data}}</p>
        <p v-else-if="content.status === Status.rejected">Error while loading article</p>
    </div>
</template>
<script>
import PromiseStatus from 'promise-status';

export default {
    data(){
        return {content:new PromiseStatus(), active:null, Status:PromiseStatus.Status}
    },
    methods:{
        load(id){
            this.active=id;
            this.content.promise = fetch(`/article/${id}`).then(response=>response.json());
        }
    }
};
</script>
<style>
    button.active{
        color:red;
    }
</style>
```

Note, that I created one object of type `PromiseStatus`, and in `load` method I changed its property `promise`. That is because if you set `content` as null and try to check `content.state` you will get exception. That's why there is 4th status `noPromise`