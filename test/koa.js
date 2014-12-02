var koa = require('koa');
var supertest = require('supertest');
var middleware = require('../koa');
var app = koa();

app.use(middleware(function (key) {
  return function (fn) {
    process.nextTick(function () {
      if ('good' === key)
        fn(null, { id: key, name: 'Oggy Iggix' });
      else
        fn(null, false);
    });
  };
}));

app.use(function * () {
  this.body = this.user;
});

var request = supertest(app.listen());

describe('Basic Auth', function () {
  it('should authenticate a good user', function (done) {
    request.get('/')
    .auth('good', '')
    .expect(200)
    .expect({ id: 'good', name: 'Oggy Iggix' })
    .end(done);
  });

  it('should authenticate a good user', function (done) {
    request.get('/')
    .auth('bad', '')
    .expect(401)
    .end(done);
  });
});

describe('Header Auth', function () {
  it('should authenticate a good user', function (done) {
    request.get('/')
    .set('x-apikey', 'good')
    .expect(200)
    .expect({ id: 'good', name: 'Oggy Iggix' })
    .end(done);
  });

  it('should authenticate a good user', function (done) {
    request.get('/')
    .set('x-api-key', 'bad')
    .expect(401)
    .end(done);
  });
});

describe('Query string', function () {
  it('should authenticate a good user', function (done) {
    request.get('/?apikey=good')
    .expect(200)
    .expect({ id: 'good', name: 'Oggy Iggix' })
    .end(done);
  });

  it('should authenticate a good user', function (done) {
    request.get('/?apiKey=bad')
    .expect(401)
    .end(done);
  });
});

describe('Without authetication', function () {
  it('should reject requests', function (done) {
    request.get('/')
    .expect(401)
    .end(done);
  });
});
