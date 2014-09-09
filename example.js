
var app = require('express')();
app.use(function (req, res, next) {
  console.log(req.headers)
  next()
})
app.use(require('./index')(auth, 'my realm'));

function auth (key, fn) {
  fn(null, key === 'test')
}

app.get('/', function (req,res) {
  res.status(200)
  res.send('ok');
});

app.listen(3000)
