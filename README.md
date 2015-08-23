# NoShitJS

A functional and reactive Javascript library which will eventually allow you to create components, render HTML, update and navigate the DOM all in a single functional chain. 

#Current Use

Import noShit, create new instance

```javascript

import { noShit } from './noshit.js';

let Component = new noShit;

```
**Component.create(tag, text, attributesObject)** creates an element on the body (or whatever node you pass into renderHTML), and takes a tag (div, h1, p, etc ...), text (if making a text node), and an object which defines any HTML attributes you would like on the element. Your options are rendered as HTML as you write them, so all standard rules apply.

**Component.append(tag, text, attributesObject)** adds a sister child to the current element, while **Component.appendNth(tag, text, attributesObject)** creates a child on the current element. **Component.retreat()** backs up one element level. This allows you to nest elements in any heirarchy, child-parent relationship you like.

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
        .append('li', 'this should be fairly self-explanatory')
        .append('li', 'still pretty self-explanatory')
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
**Component.doShit(...functions)** can be executed anywhere within the chain and simply takes functions of your choosing. ***this*** is bound to the scope of the component and returns the component just like everything else. 

#Store

NoShitJS comes with a (soon-to-be) reactive store. *Component.addStore(storeName, value)* creates a store which holds any value you like, while *Component.getStore(storeName)* return the current value of the store. (*Note*: *Component.getStore()* does not return the component and therefore cannot be chained. Look for *Component.subscribe*, coming soon).

```javascript

Component
    .addStore('far', 'and away')
    .doShit(
        function(){
            console.log(this.getStore('far'));
            this.addStore('away', 'and far');
        }, 
        function(){
            console.log(this.getStore('away'));
    })
```
