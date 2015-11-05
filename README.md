# DOMinator v.03

A reactive Javascript templating library with virtual DOM and built-in store

#DEMO: A Basic Counter App

```javascript

import {Store, Dominator} from './dominator.js';

const store = new Store;

let dominator = new Dominator(store);

store.setStore('up', 0);

store.setStore('down', 0);

store.setStore('spanClass', 'red');

let buttons = dominator.createMany('button', [
    ['count up', {
        onclick: onUpClick
    }],
    ['count down', {
        onclick: onDownClick
    }]
]);
        
let component = [dominator.addChild(dominator.create('div'), 
    dominator.addChildren(dominator.create('div'),
        [dominator.create('h1', 'up: {{up}} --- down: {{down}}'), 
            ...buttons]))];

dominator.setHTML(component, document.body);

function changeColor(){
    store.setStore('spanClass', 'blue');
}

function onUpClick(){
    let count = store.getStore('up');
    count += 1;
    store.setStore('up', count);
}

function onDownClick(){
    let count = store.getStore('down');
    count -= 1;
    store.setStore('down', count);
}

```
#So How the Hell Does It Work?

Dominator is a reactive templating library that combines imperative and functional methods to build a DOM-like object and render it onto the page. Nodes subscribe to a Map-based store for reactive updates.

##Dominator.create(tag, text**(optional)**, attributeObject**(optional)**)
takes any valid html tag, optional text, and an optional attributes object in the form of {attribute: value, ...} and returns a DOM-like object

##Dominator.createMany(tag, [ [text, attributeObject], ...]**(optional)**)
takes any valid HTML tag, along with an array of parameter arrays, returns array of DOM-like objects

##Dominator.addChild(parent, child)
returns merged DOM-like object

##Dominator.addChildren(parent, [children])
returns merged DOM-like object

##Dominator.setHTML(component, node)
takes an array of DOM-like objects and renders them as children onto given node
