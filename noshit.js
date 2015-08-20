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
    
    createText(node, text = void 0){
        let n = document.createElement(node);
        if (!!text){
            let p = document.createTextNode(text);
            n.appendChild(p);
        }
        return n;
    }
    
    createTextElement(node, text = void 0){
        this.elements
            .push(this.createText(node,text));
        return this;
    }
    
    append(node, text = void 0, childLevel = this.childLevel){
        let child = this.elements[this.elements.length-1];
        if (!!child.children.length > 0 && this.childLevel > -1){
            child = child.children[childLevel];
        }
        child
            .appendChild(this.createText(node,text));
        return this;
    }
    

    appendNth(node, text = void 0){
        function findChildNodes(child){
            if (child.childNodes.length > 0){
                return findChildNodes(child.lastChild);
            }
            return child;
        }
        this.childLevel += 1;
        let child = this.elements[this.elements.length-1].lastChild;
        findChildNodes(child)
            .appendChild(this.createText(node,text));
        return this;
    }
    
    retreat(){
        this.childLevel -= 1
        return this;
    }
    
    renderHTML(component = void 0){
        console.log(this.elements);
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