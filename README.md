# NoShitJS

A functional and reactive Javascript library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

```javascript

import { noShit } from './noshit.js';

let Component = new noShit;

Component
    .create('div', void 0, {
        'class': 'container'
    })
        .append('h1', 'I am a child of a div', {
            'class': 'notFruit'
        })
        .append('h2', 'I am also a child of the div', {
            'class': 'fruit'
        })
    .create('span')
        .append('p', 'this is paragraph, child of ^span')
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
