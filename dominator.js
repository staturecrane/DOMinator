const events = {
    'onclick': 'click',
    'onchange': 'change',
    'onsubmit': 'submit',
    'onkeyup' : 'keyup'
};

function router(routes){
    let url = location.hash.slice(1) || '/';
    let callback = routes[url];
    callback();
}

function createNode(node, text = void 0, options = void 0){
    let n = {};
    n.node = node;
    if (!!text){
        n.text = text;
    }
    if (!!options){
        n.options = options;
    }
    return n;
}

function mergeNodes(parent, child){
    let node = parent;
    node.children ? node.children.push(child) : node.children = [child];
    return node;
}

function addManyChildren(parent, children){
    let node = parent;
    let length = children.length;
    for (let x = 0; x < length; x++){
        node.children ? node.children.push(children[x]) : node.children = [children[x]];
    }
    return node;
}

function createManyNodes(node, childrenArr){
    let newArr = [];
    let length = childrenArr.length;
    for (let x = 0; x < length; x++){
        newArr.push(createNode(node, childrenArr[x][0], childrenArr[x][1] ? childrenArr[x][1] : void 0));
    }
    return newArr;
}

function registerStoreCallbacks(store, func, callbackStore){
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

function callMountFuncs(funcs){
    funcs.forEach((item)=>{
        item.call(this, arguments);
    });
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

function addComponentHTML(elements, storeGrab, node){
    let length = elements.length;
    for (let x = 0; x < length; x++){
        node.appendChild(createHyperText(elements[x], storeGrab));
    }
}

function createHyperText(obj, storeFunc){
    let regMatch = /{{(.*?)}}/;
    let node = document.createElement(obj.node);
    // for purposes of updating, every element needs an id, so we ensure that
    // it does
    let id = !obj.options ? Math.random() : !obj.options.id ? Math.random() : obj.options.id;
    let text = obj.text || '';
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
    node.textContent = text;
    // build string from options object
    if (!obj.options){
        node.id = id;
    }
    if (!!obj.options){
        if (!obj.options.id){
            node.id = id;
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
            let attribute;
            if (x === 'class'){
                attribute = 'className';
            }
            else {
                attribute = x;
            }
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
                node[attribute] = obj.options[x];
            }
            else {
                node[attribute] = obj.options[x];
            }
        }
    }
    if (!!obj.children){
        // traverse tree and wrap all nested child arrays between tags
        for (let n = 0; n < obj.children.length; n++){
            node.appendChild(createHyperText(obj.children[n], storeFunc));
        }
        return node;
    }
    return node;
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
    
}

class Dominator {
    constructor(store){
        let that = this;
        this.eventCallbacks = new Map();
        this.storeGrab = {
            getStore: !store ? null : store.getSubscription(),
            storeSet: !store ? null : store.callbackLogger(),
            eventCallbacks: that.eventCallbacks,
        }
        this.mounted = [];
    }

    create (node, text = void 0, options = void 0){
        return createNode(node, text, options);
    }
    
    createMany(node, childrenArr){
        return createManyNodes(node, childrenArr);
    }
    
    addChildren(parent, children){
        return addManyChildren(parent, children);
    }
    
    addChild(parent, child){
        return mergeNodes(parent, child);
    }
    
    didMount(...args){
        args.forEach((item)=>this.mounted.push(item));
        return this;
    }
    
    setHTML(elements, node, callbacks = void 0){
        node.innerHTML = '';
        addComponentHTML(elements, this.storeGrab, node);
        addCallbackEvents(this.eventCallbacks);
        if (callbacks){
            callMountFuncs(callbacks);
        }
    }
}

export {Store, Dominator, Router};