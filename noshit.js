"use strict";

class shitConstructor {
    
    constructor(){
        this.elements = [];
        this.childLevel = -1;
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
                opt += (x + '=' + options[x] + ' ');
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
        console.log(el);
        return el;
        
    }
    
    create(node, text = void 0, options = void 0){
        this.elements
            .push(this.createNode(node,text,options));
        return this;
    }
    
    append(node, text = void 0, options = void 0, childLevel = this.childLevel){
        let child = this.elements[this.elements.length-1];
        console.log()
        if (!!child.children.length > 0 && this.childLevel > -1){
            child = child.children[childLevel];
        }
        if (child.nodeName === "#text"){
            child = child.parentNode;
        }
        child
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
    
    renderHTML(component = void 0){
        if (!component){
            this.elements.forEach(function(els){
                document.body.appendChild(els); 
            });
            return this;
        }
        component.elements.forEach(function(els){
            document.body.appendChild(els);
        });
        return this;
    }
}

class shitStore extends noShit{
    constructor(){
        super();
        this.store = new Map();
    }
    
    emitChange(className, store){
        document.getElementsByClassName(className).value = this.store.get(store);
    }
    
    add(name, value){
        this.store.set(name, value);
        return this;
    }
    
    update(name, value, callback=this.emitChange){
        this.add(name, value);
        callback();
        return this;
    }
}

export { noShit, shitStore };