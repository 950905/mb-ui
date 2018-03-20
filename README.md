# mb-ui

> a vue ui-framework with typescript

## demo page
```
npm i
npm run dev
```

## Installation
``` npm
npm i vue-mb-ui
```
## Usage
### es6 module
``` js
import Vue from 'vue'
import MbUi from 'vue-mb-ui'
import 'vue-mb-ui/lib/index.css'
Vue.use(MbUi)
```
or
``` js
import Vue from 'vue'
import { Ripple, Dialogs } from 'vue-mb-ui'
import 'vue-mb-ui/ripple/index.css'
import 'vue-mb-ui/dialogs/index.css'
Vue.use(Ripple)
Vue.use(Dialogs)
```
### cdn
html
``` html
...
<link rel="stylesheet" href="https://unpkg.com/vue-mb-ui/lib/index.css">
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-mb-ui/lib/index.js"></script>
...
```
js
```js
Vue.use(MbUI.default)
// or
Vue.use(MbUI.Button)
```
