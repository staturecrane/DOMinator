const events = {
    'onclick': 'click',
    'onchange': 'change'
};

function router(routes){
    let url = location.hash.slice(1) || '/';
    let callback = routes[url];
    callback();
}

function registerStoreCallbacks(store, func, callbackStore){
    callbackStore.set('test', 'test');
    if (callbackStore.has(store)){
        let callbacks = callbackStore.get(store);
        if (callbacks.has('custom_callbacks')){
            let customCallbacks = callbacks.get('custom_callbacks');
            customCallbacks.push(func);
            callbacks.set('custom_callbacks', customCallbacks);
        }
        else{
            let customCallbacks = [func];
            callbacks.set('custom_callbacks', customCallbacks);
        }
    }
    else {
        let newCallbacks = new Map();
        newCallbacks.set('custom_callbacks', [func]);
        callbackStore.set(store, newCallbacks);
    };
}

function addCallbackEvents(callbackMap){
    callbackMap.forEach(function(event, id){
       for(let x in event){
            let node = document.getElementById(id);
            if (!!node){
                node.addEventListener(x, event[x]);
            }
       }
    });
}

function replaceTextWithStore(text, func, update = void 0, subscribeArr = []){
    let subscribe = subscribeArr;
    let regMatch = /{{(.*?)}}/;
    if (!update){
        if (!text.match(regMatch)){
            return {subscribe: subscribe, text: text}
        }
        let store = regMatch.exec(text)[1];
        subscribe.push(store);
        let newText = text.replace(regMatch, func.getStore(store));
        return replaceTextWithStore(newText, func, void 0, subscribe);
    }
    else {
        if (!text.match(regMatch)){
            return text;
        }
        let store = regMatch.exec(text)[1];
        let newText = text.replace(regMatch, func.getStore(store));
        return replaceTextWithStore(newText, func, true);
    }
       
}

function createHTML(els, storeFunc){
    let newArr = [];
    let length = els.length;
    for (let x = 0; x < length; x++){
        newArr.push(createHyperText(els[x], storeFunc));
    }
    return flattenArray(newArr, storeFunc);
}

function flattenArray(arr, storeFunc){
    let string = '';
    for (let x = 0; x < arr.length; x++){
        if (Array.isArray(arr[x])){
            string += flattenArray(arr[x]);
        }
        else{
            string += arr[x];
        }
    }
    return string;
}

function createHyperText(obj, storeFunc){
    let options = '';
    let regMatch = /{{(.*?)}}/;
    // for purposes of updating, every element needs an id, so we ensure that
    // it does
    let id = !obj.options ? Math.random() : !obj.options.id ? Math.random() : obj.options.id;
    let text = obj.text || '';
    let store = storeFunc.getStore();
    let callbacks = storeFunc.storeSet();
    let eventCallbacks = storeFunc.eventCallbacks;
    if (!!text){
        let oldText = text;
        if (!!regMatch.test(text)){
            let textObject = replaceTextWithStore(text, storeFunc);
            text = textObject.text;
            let subscription = textObject.subscribe;
            for (var x = 0; x < subscription.length; x++){
                if (callbacks.has(subscription[x])){
                    let storeMap = callbacks.get(subscription[x]);
                    if (storeMap.has(id)){
                        let newObj = storeMap.get(id);
                        newObj.textContent = oldText;
                        storeMap.set(id, newObj);
                        callbacks.set(subscription[x], storeMap);
                    }
                    else {
                        let newMap = new Map();
                        newMap.set(id, {textContent: oldText});
                        callbacks.set(subscription[x], newMap);
                    }
                }
                else{
                    let newCallbacksMap = new Map();
                    newCallbacksMap.set(id, {textContent: oldText});
                    callbacks.set(subscription[x], newCallbacksMap);
                }
            }
        }
    }
    // build string from options object
    if (!obj.options){
        options += ('id=' + id + ' ');
    }
    if (!!obj.options){
        if (!obj.options.id){
            options += ('id=' + id + ' ');
        }
        for (let x in obj.options){
            if (!!events[x]){
                if (eventCallbacks.has(id)){
                    let callbacksObj = eventCallbacks.get(id);
                    callbacksObj[events[x]] = obj.options[x];
                    continue;
                }
                else{
                    let callbacksObj = {};
                    callbacksObj[events[x]] = obj.options[x];
                    eventCallbacks.set(id, callbacksObj);
                    continue;
                }
            }
            let attribute = x;
            if (regMatch.test(obj.options[x])){
                // save the non-converted text, then run through replaceStore
                let oldText = obj.options[x];
                let attObject = replaceTextWithStore(obj.options[x], storeFunc);
                let subscription = attObject.subscribe;
                for (let y = 0; y < subscription.length; y++){
                    if (callbacks.has(subscription[y])){
                        let storeMap = callbacks.get(subscription[y]);
                        if (storeMap.has(id)){
                            let newObj = storeMap.get(id);
                            newObj[attribute] = oldText;
                            storeMap.set(id, newObj);
                            callbacks.set(subscription[y], storeMap);
                        }
                        else {
                            let newMap = new Map();
                            let newObj = {};
                            newObj[attribute] = oldText;
                            newMap.set(id, newObj);
                            callbacks.set(subscription[y], newMap);
                        }
                    }
                    else{
                        let newCallbacksMap = new Map();
                        let newAttObj = {};
                        newAttObj[attribute] = oldText;
                        newCallbacksMap.set(id, newAttObj);
                        callbacks.set(subscription[y], newCallbacksMap);
                    }
                }
                options += (x + '=' + attObject.text + ' ');
            }
            else {
                options += (x + '=' + obj.options[x] + ' ');
            }
        }
    }
    // build open tag
    let open = !options ? ['<' + obj.node + '>' + text] : ['<' + obj.node + ' ' + options.trim() + '>' + text];
    // build closed tag
    let closed = ['</' + obj.node + '>'];
    if (!!obj.children){
        let arr = [];
        // traverse tree and wrap all nested child arrays between tags
        for (let n = 0; n < obj.children.length; n++){
            arr.push(createHyperText(obj.children[n], storeFunc));
        }
        return [open, arr, closed];
    }
    return [open, closed];
}

class Router {
    constructor(){
        this.routes = {};
    }
    
    addRoute(path, callback){
        this.routes[path] = callback;
    }
    
    run(){
        let that = this;
        window.onhashchange = function(){
            router(that.routes)};
        window.addEventListener('load', function(){
            router(that.routes);
        });
    }
}

class Store {
    
    constructor(){
        this.store = new Map();
        this.storeCallbacks = new Map();
    }
    
    setStore(name, value){
        let that = this;
        this.store.set(name, value);
        if (this.storeCallbacks.has(name)){
            let callbacks = this.storeCallbacks.get(name);
            callbacks.forEach(function(obj, id){
                if (id === 'custom_callbacks'){
                    obj.forEach((item)=>item.call(this, arguments));
                }
                else{
                    for (let x in obj){
                        let newText = replaceTextWithStore(obj[x], that, true);
                        let node = document.getElementById(id);
                        if (!!node){
                            if (x === 'textContent'){
                                node.textContent = newText;
                            }
                            else{
                                node.setAttribute(x, newText);
                            }    
                        }
                    }   
                }
            });
        }
    }
    
    getStore(name){
        return this.store.get(name);
    }
    
    getSubscription(){
        let that = this;
        return function(name){
            return that.getStore(name);
        };
    }
    
    callbackLogger(){
        let that = this;
        return function(){
            return that.storeCallbacks;
        };
    }
    
    registerCallback(store, func){
        let that = this;
        registerStoreCallbacks(store, func, that.storeCallbacks);
    }
    
    subscribe(storename){
        return '{{' + storename + '}}';
    }
    
    testCallbackMap(){
        console.log(this.storeCallbacks);
    }
    
}

class Dominator {
    constructor(store){
        let that = this;
        this.elements = [];
        this.childLevel = 0;
        this.eventCallbacks = new Map();
        this.storeGrab = {
            getStore: !store ? null : store.getSubscription(),
            storeSet: !store ? null : store.callbackLogger(),
            eventCallbacks: that.eventCallbacks,
        }
    }
    
    createNode(node, text = void 0, options = void 0){
        let n = {};
        n.node = node;
        // these checks are probably unnecessary if you have default args
        if (!!text){
            n.text = text;
        }
        if (!!options){
            n.options = options;
        }
        return n;
    }
    
    create(node, text = void 0, options = void 0){
        let n = this.createNode(node, text, options);
        this.elements.push(n);
        return this;
    }
    
    // append finds the current childLevel of the your DOM tree and adds 
    // children to to that branch, defaulting to the main node branches
    // and only going deeper once appendNth has been called 
    append(node, text = void 0, options = void 0, count = this.childLevel, 
        parent = this.elements[this.elements.length-1]){
            if (this.childLevel === 0){
                let child = this.createNode(node, text, options);
                let parent = this.elements[this.elements.length-1];
                if (!!parent.children){
                    parent.children.push(child);
                }
                else{
                    parent.children = [child];
                }
                return this;            
            }
            if (count === 0){
                let child = this.createNode(node, text, options);
                if(!!parent.children){
                    parent.children.push(child);
                }
                else{
                    parent.children = [child];
                }
                return this;
            }
            count -= 1;
            return this.append(node, text, options, count, parent.children[parent.children.length-1]);
    }
    // appendNth finds the deepest child node of the branch you're working on
    // and adds a child to that branch. appendNth can only be used following
    // the create and append methods.
    appendNth(node, text = void 0, options = void 0, 
        element = this.elements[this.elements.length-1].children[this.elements[this.elements.length-1].children.length-1]){
        if (!element.children){
            element.children = [this.createNode(node,text,options)];
            this.childLevel += 1;
            return this;
        } 
        return this.appendNth(node, text, options, element.children[element.children.length-1]);
    }
    
    // retreat allows you to move back the childLevel so you may append children
    // to previous branches
    retreat(){
        this.childLevel -= 1;
        return this;
    }
    
    do(...args){
        for (let x = 0; x < args.length; x++){
            args[x].call(this, arguments);
        }
        return this;
    }
    
    setHTML(node){
        node.innerHTML = createHTML(this.elements, this.storeGrab);
        addCallbackEvents(this.eventCallbacks);
    }

    
    returnHTML(){
        return createHTML(this.elements);
    }
}

export {Store, Dominator, Router};