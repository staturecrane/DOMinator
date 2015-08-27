"use strict";

function retrieveLastChild(elements, childLevel){
    let child = elements[elements.length-1];
    if (!!child.children.length > 0 && childLevel > -1){
        child = child.children[childLevel];
    }
    if (child.nodeName === "#text"){
        child = child.parentNode;
    }
    return child;
}

function findChildNodes(child){
    if (child.childNodes.length > 0){
        return findChildNodes(child.lastChild);
    }
    if (child.nodeName === "#text"){
        child = child.parentNode;
    }
    return child;
}

class shitConstructor {
    
    constructor(){
        this.elements = [];
        this.childLevel = -1;
        this.store = new Map();
        this.storeCallbacks = new Map();
        this.rendered = void 0;
    }
    
}

class noShit extends shitConstructor {
    constructor (){
        super();
    }
    
    replaceTextWithStore(text, update = void 0, subscribeArr = []){
        let subscribe = subscribeArr;
        let regMatch = /{{{{(.*?)}}}}/;
        if (!update){
            if (!text.match(regMatch)){
                return {subscribe: subscribe, text: text}
            }
            let store = regMatch.exec(text)[1];
            subscribe.push(store);
            let newText = text.replace(regMatch, this.getStore(store));
            return this.replaceTextWithStore(newText, void 0, subscribe);
        }
        else {
            if (!text.match(regMatch)){
                return text;
            }
            let store = regMatch.exec(text)[1];
            let newText = text.replace(regMatch, this.getStore(store));
            return this.replaceTextWithStore(newText, true);
        }
       
    }
    
    createNode(node, text = void 0, options = void 0){
        let subscribe = {};
        let id = void 0;
        let subscription = void 0;
        let opt = '';
        let events = [];
        if (!!options){
            for (let x in options){
                let optionsX = options[x];
                if (x === "onclick"){
                    events.push({
                       event: x,
                       func: optionsX
                    });
                    continue;
                }
                else if (typeof optionsX === 'function' && !!optionsX().store){
                    subscription = true;
                    if (subscribe[optionsX().store]){
                        subscribe[optionsX().store].push({attribute: x, func: optionsX().func});
                    }
                    else {
                        subscribe[optionsX().store] = [{attribute: x, func: optionsX().func}];
                    }
                    opt += (x + '=' + '"' + optionsX.call(this,arguments).func.call(this, arguments) + '"' + ' ');
                }
                else {
                    opt += (x + '=' + '"' + optionsX + '"' + ' ');    
                }
            }    
        }
        let n;
        if (!!options){
            n = '<' + node + ' ' + opt + '>';
        }
        else {
            n = '<' + node + '>';
        }
        let div = document.createElement('div');
        if (!!text){
            let regMatch = /{{{{(.*?)}}}}/;
            let oldText = text;
            if (regMatch.test(text)){
                subscription = true;
                let textObj = this.replaceTextWithStore(text);
                let newText = textObj.text;
                let textSub = {attribute: 'textContent', oldText: oldText};
                if (!!textObj.subscribe){
                    textObj.subscribe.forEach(function(store){
                        if (subscribe[store]){
                            subscribe[store].push(textSub);
                        }
                        else {
                            subscribe[store] = [textSub];
                        } 
                });   
                }
                n += newText;
            }
            else {
                n += text;   
            }
        }
        n += '</' + node + '>';
        div.innerHTML = n;
        var el = div.firstChild;
        if (subscription){
            let dataID = !el.id ? Math.random().toString() : el.id;
            el.id = dataID;
            for (let i in subscribe){
                if (this.store.has(i)){
                    if (this.storeCallbacks.has(i)){
                        let or = this.storeCallbacks.get(i);
                        or.set(dataID, subscribe[i]);
                        this.storeCallbacks.set(subscribe[i], or);
                    }
                    else {
                        let newMap = new Map();
                        newMap.set(dataID, subscribe[i]);
                        this.storeCallbacks.set(i, newMap);
                    }
                }
            }
        }
        events.forEach(function(item){
           el.addEventListener('click', item.func); 
        
        });
        return el;
    }
    
    create(node, text = void 0, options = void 0){
        this.elements
            .push(this.createNode(node,text,options));
        return this;
    }
    
    append(node, text = void 0, options = void 0, childLevel = this.childLevel){
        retrieveLastChild(this.elements, childLevel)
            .appendChild(this.createNode(node,text,options));
        return this;
    }

    appendNth(node, text = void 0, options = void 0){
        this.childLevel += 1;
        let child = this.elements[this.elements.length-1].lastChild;
        findChildNodes(child)
            .appendChild(this.createNode(node,text,options));
        return this;
    }
    
    retreat(){
        this.childLevel -= 1
        return this;
    }
    
    renderHTML(component = document.body){
        this.elements.forEach(function(els){
            component.appendChild(els); 
        });
        return this;
    }
    
    doShit(...args){
        let that = this;
        args.forEach(function(func){
           func.call(that, arguments); 
        });
        return this;
    }

//store logic
    
    setStore(name, value){
        this.store.set(name, value);
        return this;
    }
    
    subscribe(store, func){
        if (typeof store !== 'string'){
            throw 'Component.subscribe() takes a string as its first parameter';
        }
        return function(){
            let obj = {
                store: store,
                func: func
            };
            return obj;
        };
    }
    
    subscribeText(store){
        return '{{{{' + store + '}}}}';
    }
    
    updateStore(name, value){
        let that = this;
        if (typeof value === 'function'){
            return function(){
                that.store.set(name, value.call(that, arguments));
                that.emitChange(name);
            };
        }
        return function (){
            that.store.set(name, value);
            that.emitChange(name);  
        };
    }
    
    emitChange(storeName){
        let that = this;
        if (this.storeCallbacks.has(storeName)){
            var temp = this.storeCallbacks.get(storeName);
            temp.forEach(function(item, i){
                let node = document.getElementById(i);
                item.forEach(function(attObj){
                    let attr= attObj.attribute;
                    if (attr === "textContent"){
                        node.innerHTML = that.replaceTextWithStore(attObj.oldText, true);
                    }
                    else {
                        node.setAttribute(attr, attObj.func.call(that, arguments));
                    }
                });
            });
        } 
    }
    
    getStore(store){
        return this.store.get(store);
    }

}

export { noShit };