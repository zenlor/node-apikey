# Simple API KEY auth middleware

[![npm](http://img.shields.io/npm/l/apikey.svg?style=flat-square)](https://www.npmjs.org/package/apikey)
[![Build Status](http://img.shields.io/travis/aliem/node-apikey.svg?style=flat-square)](https://travis-ci.org/aliem/node-apikey)
[![code climate](http://img.shields.io/codeclimate/github/aliem/node-apikey.svg?style=flat-square)](https://codeclimate.com/github/aliem/node-apikey)

Simple middleware to authenticate requests using an API Key, supports:

- Basic Auth: `http://apikey:@example.com/`
- custom headers
	- `x-apikey`
	- `x-api-key`
	- `apikey`
- query strings
	- `api-key`
	- `apikey`
	- `api`

Currently works only on Express.


## Example

Express Server:

```js
var app = require('express')();

app.use(require('apikey')(auth, 'my realm'));

function auth (key, fn) {
  if ('test' === key)
    fn(null, { id: '1', name: 'John Dorian'})
  else
    fn(null, null)
}

app.get('/' function (req,res) {
  res.send('I can be reached only using an authorised api key.')
})
```


Without authentication: `❯❯❯ curl -vv localhost:3000`

```
> GET / HTTP/1.1
> User-Agent: curl/7.37.1
> Host: localhost:3000
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< X-Powered-By: Express
< WWW-Authenticate: Basic realm="my realm"
< Date: Tue, 09 Sep 2014 09:22:49 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
< 
Unauthorized
```

With password authentication `❯❯❯ curl -vv test:@localhost:3000`

```
> GET / HTTP/1.1
> Authorization: Basic dGVzdDo=
> User-Agent: curl/7.37.1
> Host: localhost:3000
> Accept: */*
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 2
< ETag: W/"2-2044517703"
< Date: Tue, 09 Sep 2014 09:22:55 GMT
< Connection: keep-alive
< 
ok
```

### Example using Koa.js

```js
var app = require('koa')()

app.use(require('apikey/koa')(auth, 'my realm'))

// auth function should be a thunk or a promise
function auth (key) {
  return function (fn) {
    if ('test' === key)
      fn(null, { id: '1', name: 'John Dorian'})
    else
      fn(null, null)
  }
}

app.use('/' function *() {
  this.body = this.user
})
```

## License

MIT
