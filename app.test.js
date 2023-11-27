// app.test.js
const request = require('supertest');
const app = require('./server/app');

if (app && app.close) {
  app.close();
}

const testPort = 8080;

afterAll(() => {
  app.close();
});

describe('GET /', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /login', () => {
  it('should authenticate user and redirect to /home on successful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'user1',
        password: 'password1',
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/home');
  });

  it('should handle invalid login and redirect to / with flash message', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'invalid_username',
        password: 'invalid_password',
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    expect(response.header['set-cookie']).toBeDefined();
  });
});

describe('GET /home', () => {
  it('should render home page for authenticated user', async () => {
    const response = await request(app)
      .get('/home')
      .set('Cookie', [`connect.sid=someSessionId`])

    expect(response.statusCode).toBe(200);
  });

  it('should render unauthorized page for non-authenticated user', async () => {
    const response = await request(app)
      .get('/home');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('401 Unauthorized');
    expect(response.text).toContain('Silakan <a href="/">login</a> terlebih dahulu.');
  });
});

