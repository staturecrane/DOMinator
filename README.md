# DOMinator v.02

A reacitve Javascript templating library which allows you to create components and subscribe to a reactive store. 

#DEMO: A Basic Counter App

Import Dominator, create new instance

```javascript

import {Store, Dominator} from './dominator.js';

const store = new Store;

store.setStore('up', 0);

store.setStore('down', 0);

store.setStore('spanClass', 'red');

let component = new Dominator(store);

component
    .create('div')
        //Dominator allows you to subsribe to as many stores as you like
        .append('h1', 'Up: {{up}} --- Down: {{down}}', {
            class: '{{spanClass}}'
        })
        .append('button', 'Count Up', {
            onclick: onUpClick
        })
        .append('button', 'Count Down', {
            onclick: onDownClick
        })
        .append('button', 'Turn Blue', {
            onclick: changeColor
        })
.setHTML(document.body);

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
