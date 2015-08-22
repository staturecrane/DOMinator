# NoShitJS

A functional and reactive Javascript library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

```javascript

import { noShit } from './noshit.js';

let Component = new noShit;

Component
    .createTextElement('h1', 'this is some text')
        .append('h4', 'this is a child of the ^h1')
    .createTextElement('h2', 'this is some smaller text')
        .append('span') //this is a child of the ^h2
            .appendNth('div') //this is a child of the ^span
                .appendNth('span', 'this is inside the div ^') 
                .retreat() //backing up one level
            .append('h4', 'this is a sister of the ^div')
            .retreat() //backing up again
        .append('p', 'this is a sister of the ^span')
        .append('span')
            .appendNth('h1', 'this is a child of the ^span')
            .retreat()
    .createTextElement('h6', 'this is a child of document.body')
.renderHTML();
    
```
