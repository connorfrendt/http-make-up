const request = require('supertest');
const app = require('../lib/app');

describe('colors', () => {
  const createColor = (name, hex, rgb, __v, _id) => {
    return request(app)
      .post('/colors')
      .send({ 
        name,
        hex,
        rgb,
        __v,
        _id
      })
      .then(res => res.body);
  };
  
  it('can create a new color', () => {
    return request(app)
      .post('/tweets')
      .send({
        name: 'red',
        hex: '#FF0000',
        rgb: 'rgb(255, 0, 0)',
        __v: 0,
        _id: 'SOME_ID'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'red',
          hex: '#FF0000',
          rgb: 'rgb(255, 0, 0)',
          __v: 0,
          _id: expect.any(String)
        });
      });
  });

  it('can get a list of colors', () => {
    return Promise.all(['red', 'white', 'blue'].map(createColor))
      .then(() => {
        return request(app)
          .get('/colors');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('gets a color by id', () => {
    return createColor('maroon')
      .then(color => {
        return Promise.all([
          Promise.resolve(color._id),
          request(app)
            .get(`/color/${color._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          name: 'maroon',
          hex: '#800000',
          rgb: 'rgb(128, 0, 0)',
          __v: 0,
          _id: 'SOME_ID'
        });
      });
  });

  it('deletes a color by id', () => {
    return createColor('blue')
      .then(color => {
        return request(app)
          .delete(`/colors/${color._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });
  });
});