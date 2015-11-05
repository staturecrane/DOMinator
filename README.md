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
        
let buttonDiv = dominator.addChildren(dominator.create('div'), buttons);

let text = dominator.create('h1', 'up: {{up}} --- down: {{down}}');

let component = [dominator.addChildren(dominator.create('div'), [text, buttonDiv])];

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
