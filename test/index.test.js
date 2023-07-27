// userRoutes.test.js
const request = require('supertest');
const app = require('../server');

describe('User Routes', () => {
  it('should register a new user and return a user ID', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({
        age: 30,
        email: 'johns.doe@example.com',
        username: 'john_doe',
      })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'User data updated successfully.');
    expect(response.body).toHaveProperty('userId');
  });

  it('should update user information for an existing user', async () => {
    const response = await request(app)
      .put('/api/user/john_doe')
      .send({
        age: 32,
        email: 'johns.doe@example.com',
        username: 'John Doe',
      })
      .expect(200);

    expect(response.body).toEqual({"message": "User data updated successfully.", "userid": "john_doe"});
  });

  it('should not register a new user if required fields are missing', async () => {
    await request(app)
      .post('/api/user')
      .send({
        age: 30,
        email: 'johns.doe@example.com',
      })
      .expect(400);
  });

  it('should not register a new user with an existing username', async () => {
    await request(app)
      .post('/api/user')
      .send({
        age: 30,
        email: 'johns.doe@example.com',
        username: 'John Doe',
      })
      .expect(409);
  });

  it('should retrieve game progress for an existing user', async () => {
    const response = await request(app).get('/api/user/john_doe').expect(200);

    expect(response.body).toHaveProperty('age', 30);
    expect(response.body).toHaveProperty('email', 'johns.doe@example.com');
  });
});
