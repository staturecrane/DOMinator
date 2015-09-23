# DOMinator v.01

A reacitve Javascript templating library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

Import Dominator, create new instance

```javascript

import {DOMinator} from './dominator.js'

let component = new DOMinator;

component
    .create('div', void 0, {
        'class': 'no-class',
        'id' : Math.random().toString()
    })
    // append finds the current childLevel of the your DOM tree and adds 
    // children to to that branch, defaulting to the main node branches
    // and only going deeper once appendNth has been called 
    .append('span')
        // appendNth finds the deepest child node of the branch you're working on
        // and adds a child to that branch. appendNth can only be used following
        // the create and append methods.
        .appendNth('div')
            .appendNth('article')
                .appendNth('h1', 'this is a child of the article', {
                    'class': 'red-text'
                })
                // retreat allows you to move back the childLevel so you may append children
                // to previous branches
                .retreat()
            .append('h2', 'this is a child of the div')
.returnHTML();
```
