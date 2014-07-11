
simple middleware to authorize the use of an URL.

usage:

    var app = require('express')();

    app.use(require('apikey')(auth, 'my realm'));

    function auth (key, fn) {
      ver error = null;
      fn(error, key === 'test')
    }

    app.get('/' function (req,res) {
      res.send('I can be reached only using an authorised api key.')
    })

## License

MIT
