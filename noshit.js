"use strict";

function createNode(node, text = void 0, options = void 0){
    let subscribe = {};
    let opt = '';
    if (!!options){
        for (let x in options){
            let optionsX = options[x];
            if (typeof optionsX === 'function' && !!optionsX().store){
                if (subscribe[optionsX().store]){
                    subscribe[optionsX().store].push({attribute: x, func: optionsX().func});
                }
                else {
                    subscribe[optionsX().store] = [{attribute: x, func: optionsX().func}]
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
        if (typeof text === 'function' && !!text().store){
            text = text.call(this,arguments).func.call(this,arguments);
        }
        n += text;
    }
    n += '</' + node + '>';
    div.innerHTML = n;
    var el = div.firstChild;
    return el;
}

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

class shitConstructor {
    
    constructor(){
        this.elements = [];
        this.childLevel = -1;
        this.store = new Map();
        this.storeCallbacks = new Map();
    }
    
}

class noShit extends shitConstructor {
    constructor (){
        super();
    }
    
    create(node, text = void 0, options = void 0){
        this.elements
            .push(createNode(node,text,options));
        return this;
    }
    
    append(node, text = void 0, options = void 0, childLevel = this.childLevel){
        retrieveLastChild(this.elements, childLevel)
            .appendChild(createNode(node,text,options));
        return this;
    }

    appendNth(node, text = void 0, options = void 0){
        function findChildNodes(child){
            if (child.childNodes.length > 0){
                return findChildNodes(child.lastChild);
            }
            if (child.nodeName === "#text"){
                child = child.parentNode;
            }
            return child;
        }
        this.childLevel += 1;
        let child = this.elements[this.elements.length-1].lastChild;
        findChildNodes(child)
            .appendChild(createNode(node,text,options));
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
        return function(){
            let obj = {
                store: store,
                func: func
            };
            return obj;
        };
    }
    
    updateStore(name, value, callback=this.emitChange){
        this.store.set(name, value);
        callback();
        return this;
    }
    
    getStore(store){
        return this.store.get(store);
    }

}

export { noShit };