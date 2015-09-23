function createHTML(els){
    let newArr = [];
    let length = els.length;
    for (let x = 0; x < length; x++){
        newArr.push(createHyperText(els[x]));
    }
    return flattenArray(newArr);
}

function flattenArray(arr){
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

function createHyperText(obj){
    let options = '';
    let text = obj.text || ''; 
    // build string from options object
    if (!!obj.options){
        for (let x in obj.options){
            options += (x + '=' + obj.options[x] + ' ');
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
            arr.push(createHyperText(obj.children[n]));
        }
        return [open, arr, closed];
    }
    return [open, closed];
}

class Store {
    
    constructor(){
        this.store = new Map();
        this.storeCallbacks = new Map();
    }
    
    setStore(name, value){
        this.store.set(name, value);
        this.emitChange(name);
    }
    
    getStore(name, value){
        return this.store.get(name, value);
    }
    
    subscribe(name, func){
        this.storeCallbacks.set(name, func);
    }
    
    emitChange(name){
        if (this.storeCallbacks.get(name)){
            let func = this.storeCallbacks.get(name);
            func.call(this, arguments);
        }
    }
    
}

class DOMinator {
    constructor(){
        this.elements = [];
        this.childLevel = 0;
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
    
    dangerouslyRenderHTML(node){
        node.innerHTML = createHTML(this.elements);
    }
    
    returnHTML(){
        return createHTML(this.elements);
    }
}

export {Store, DOMinator};