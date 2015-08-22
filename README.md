# NoShitJS

A functional and reactive Javascript library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

Import noShit, create new instance

```javascript

import { noShit } from './noshit.js';

let Component = new noShit;

```
Component.create creates an element on the body (or whatever node you pass into renderHTML), and takes a tag(div, h1, p, etc ...), optional text, and an options object, which defines any HTML attributes you would like on the element.

Component.append adds a child to the element, and Component.appendNth creates a child on the child. Component.retreat backs up one child level. This allows you to nest your elements in any heirarchy you like.

```javascript

Component
    .create('div', void 0, {
        'class': 'container'
    })
        .append('h1', 'I am a child of a div', {
            'class': 'row notFruit'
        })
        .append('h2', 'I am also a child of the div', {
            'class': 'fruit col-sm-12'
        })
    .create('span')
        .append('p', 'this is paragraph, child of ^span')
    .create('input', 'this is an input', {
        'type':'text',
        'placeholder':'this is a placeholder'
    })
    .create('ul')
        .append('li', 'this should be fairly explanatory')
        .append('li', 'still pretty explanatory')
    .create('div')
        .append('span')
            .appendNth('h1', 'I am a child of the ^span')
            .retreat()
        .append('h1', 'I am a sister of the ^span')
    .create('div')
        .append('div')
            .appendNth('article')
                .appendNth('h4', 'I am child of ^article')
                .retreat()
            .retreat()
        .append('p', 'I am a child of the ^div')
.renderHTML();
    
```
