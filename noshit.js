"use strict";

class shitConstructor {
    
    constructor(){
        this.elements = [];
        this.childLevel = -1;
        this.store = new Map();
    }
    
}

class noShit extends shitConstructor {
    constructor (){
        super();
    }
    
    createNode(node, text = void 0, options = void 0){
        let opt = '';
        if (!!options){
            for (let x in options){
                opt += (x + '=' + '"' + options[x] + '"' + ' ');
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
            n += text;
        }
        n += '</' + node + '>';
        div.innerHTML = n;
        var el = div.firstChild;
        return el;
        
    }
    
    create(node, text = void 0, options = void 0){
        this.elements
            .push(this.createNode(node,text,options));
        return this;
    }
    
    retrieveLastChild(childLevel){
        let child = this.elements[this.elements.length-1];
        if (!!child.children.length > 0 && this.childLevel > -1){
            child = child.children[childLevel];
        }
        if (child.nodeName === "#text"){
            child = child.parentNode;
        }
        return child;
    }
    
    append(node, text = void 0, options = void 0, childLevel = this.childLevel){
        this.retrieveLastChild(childLevel)
            .appendChild(this.createNode(node,text,options));
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
    
    addStore(name, value){
        this.store.set(name, value);
        return this;
    }
    
    subscribeStore(atrribute, store){
        let child = this.retrieveLastChild(this.childLevel);
    }
    
    updateStore(name, value, callback=this.emitChange){
        this.store.add(name, value);
        callback();
        return this;
    }
    
    getStore(store){
        return this.store.get(store);
    }
}

export { noShit };