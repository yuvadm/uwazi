import instrumentRoutes from '../instrumentRoutes.js';

describe('routesMock', () => {
  let route;

  function middleware1() {}
  function middleware2() {}
  function testMethod(method, done, URL = '/test/route', expected = { response: method }, req) {
    route[method](URL, req)
    .then((response) => {
      expect(response).toEqual(expected);
      done();
    })
    .catch(done.fail);
  }

  let testingRoute = (app) => {
    app.get('/routeWith/middleware', middleware1, middleware2, (req, res) => {
      res.json({ response: 'middleware route' });
    });

    app.post('/routeWith/middleware', middleware1, middleware2, (req, res) => {
      res.json({ response: 'middleware route' });
    });

    app.delete('/routeWith/middleware', middleware1, middleware2, (req, res) => {
      res.json({ response: 'middleware route' });
    });

    app.get('/test/route', (req, res) => { res.json({ response: 'get' }); });
    app.delete('/test/route', (req, res) => { res.json({ response: 'delete' }); });
    app.post('/test/route', (req, res) => { res.json({ response: 'post' }); });
    app.get('/overriden/redirect', (req, res) => { res.redirect('newUrl'); });
    app.get('/overriden/donwload', (req, res) => { res.download('file'); });
    app.get('/overriden/sendFile', (req, res) => { res.sendFile('file'); });
  };

  beforeEach(() => {
    route = instrumentRoutes(testingRoute);
  });

  it('should execute get routes in a promise way', (done) => {
    testMethod('get', done);
  });

  it('should execute delete routes in a promise way', (done) => {
    testMethod('delete', done);
  });

  it('should execute post routes in a promise way', (done) => {
    testMethod('post', done);
  });

  describe('res alternate methods', () => {
    it('should allow testing res.redirect as a pormise', (done) => {
      testMethod('get', done, '/overriden/redirect', 'newUrl');
    });

    it('should allow testing res.download as a pormise', (done) => {
      testMethod('get', done, '/overriden/donwload', 'file');
    });

    it('should allow testing res.sendFile as a pormise', (done) => {
      testMethod('get', done, '/overriden/sendFile', 'file');
    });
  });

  describe('when using middlewares on a route', () => {
    it('should execute the route function correctly', (done) => {
      testMethod('get', done, '/routeWith/middleware', { response: 'middleware route' });
    });

    it('should attach the middlewares to the returned promise', () => {
      expect(route.get('/routeWith/middleware').middlewares).toEqual([middleware1, middleware2]);
      expect(route.post('/routeWith/middleware').middlewares).toEqual([middleware1, middleware2]);
      expect(route.delete('/routeWith/middleware').middlewares).toEqual([middleware1, middleware2]);
    });
  });

  it('should pass req to the route function', (done) => {
    testingRoute = (app) => {
      app.get('/test/route', (req, res) => {
        res.json(req);
      });
    };
    route = instrumentRoutes(testingRoute);

    testMethod('get', done, '/test/route', { request: 'request' }, { request: 'request' });
  });

  it('should put the status in the response', (done) => {
    testingRoute = (app) => {
      app.get('/test/route', (req, res) => {
        res.status(404);
        res.json({ response: 'get' });
      });
    };

    route = instrumentRoutes(testingRoute);

    route.get('/test/route', { request: 'request' })
    .then((response) => {
      expect(response.status).toBe(404);
      done();
    })
    .catch(done.fail);
  });

  describe('when routepath do not match', () => {
    it('should throw an error', () => {
      expect(route.get.bind(route, '/unexistent/route')).toThrow(new Error('Route GET /unexistent/route is not defined'));
    });
  });

  describe('when route function is not defined', () => {
    beforeEach(() => {
      testingRoute = (app) => {
        app.get('/test/route');
      };
      route = instrumentRoutes(testingRoute);
    });

    it('should throw an error', (done) => {
      route.get('/test/route')
      .catch((error) => {
        expect(error).toEqual(new Error('route function has not been defined !'));
        done();
      });
    });
  });
});
