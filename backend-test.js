const request = require('supertest');
const app = require('./app');

jest.setTimeout(10000);

describe('GET / ', () => {
  test('Should retrieve correct maximum with year and number.', async () => {
    await new Promise((r) => setTimeout(r, 2000));  // Minimum amount of time to fetch data.
    const maximum = {'1880-2020': {'2016': 0.99}};
    const response = await request(app).get('/minran/1880/maxran/2020/maximum');
    expect(response.body).toEqual(maximum);
    expect(response.statusCode).toBe(200);
  });
  
  test('Should retrieve correct minimum with year and number.', async () => {
    const minimum = {'1880-2020': {'1904': -0.45}};
    const response = await request(app).get('/minran/1880/maxran/2020/minimum');
    expect(response.body).toEqual(minimum);
    expect(response.statusCode).toBe(200);
  });
  
  test('Should retrieve correct average number.', async () => {
    const response = await request(app).get('/minran/1880/maxran/2020/average');
    const average = {'1880-2020': 0.06564285714285707};
    expect(response.body).toEqual(average);
    expect(response.statusCode).toBe(200);
  });
});
