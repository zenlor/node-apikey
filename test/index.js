
// Test Application
var app = require('express')();
app.use(require('..')(auth, 'my realm'));

function auth (key, fn) {
  fn(null, key === 'test')
}
app.get('/', function (req,res) {
  res.send('ok');
});

var request = require('supertest')(app);

describe('Basic Auth', function () {

  it('should fail with wrong user', function (done) {
    request
    .get('/')
    .auth('fail', 'asd')
    .expect(401)
    .end(done)
  })

  it('should authenticate with the right user', function (done) {
    request
    .get('/')
    .auth('test')
    .expect(200)
    .end(done)
  })
})

describe('Headers', function () {
  it('should accept X-APIKEY', function (done) {
    request
    .get('/')
    .set('X-APIKEY', 'test')
    .expect(200)
    .end(done)
  })

  it('should accept APIKEY', function (done) {
    request
    .get('/')
    .set('APIKEY', 'test')
    .expect(200)
    .end(done)
  })

  it('should accept X-Api-Key', function (done) {
    request
    .get('/')
    .set('X-Api-Key', 'test')
    .expect(200)
    .end(done)
  })
})
