# NoShitJS

A functional and reactive Javascript library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

```javascript

import { noShit } from './noshit.js';

let Component = new noShit;

Component
    .createTextElement('h1', 'this is some text')
    .createTextElement('h2', 'this is some smaller text')
    .append('div')
        .appendNth('div')
            .appendNth('span')
                .appendNth('h1', 'this is a child of ^span')
    .append('span')
        .appendNth('h1', 'this is child of ^span')
    .renderHTML();
    
```
