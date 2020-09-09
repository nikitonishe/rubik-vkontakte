# rubik-facebook
Vkontakte's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-vkontakte
```

### yarn
```bash
yarn add rubik-vkontakte
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Vkontakte = require('rubik-vkontakte');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const facebook = new Vkontakte();

app.add([ config, vkontakte ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`vkontakte.js` config in configs volume may contain the host and token.

If you do not specify a host, then `https://graph.facebook.com/` will be used by default.

If you don't specify a token, you will need to pass it.
```js
...
const response = await app.get('vkontakte').groups.addCallbackServer();
...
```

```js
...
const response = await app.get('vkontakte').groups.deleteCallbackServer();
...
```

You may need the host option if for some reason Vkontakte host is not available from your server
and you want to configure a proxy server.


For example:
`config/vkontakte.js`
```js
module.exports = {
  host: 'https://my.vkontakte.proxy.example.com/'
};
```

## Extensions
Vkontakte kubik doesn't has any extension.
