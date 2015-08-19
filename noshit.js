"use strict";

class shitConstructor {
    
    constructor(){
        this.elements = [];
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
    
    append(node, text = void 0){
        this.elements[this.elements.length-1]
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
        let child = this.elements[this.elements.length-1].lastChild;
        findChildNodes(child)
            .appendChild(this.createText(node,text));
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

export { noShit };