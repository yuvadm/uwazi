//import backend from 'fetch-mock';
import {MLAPIURL} from '../../config/config.js';
import request from 'shared/JSONRequest';
import api from '../MLAPI';

describe('MLAPI', () => {
  describe('train()', () => {
    fit('should post data passed', (done) => {
      spyOn(request, 'post').and.returnValue(Promise.resolve('response'));
      const data = {data: 'test'};
      api.train(data)
      .then((response) => {
        expect(response).toBe('response');
        expect(request.post).toHaveBeenCalledWith(MLAPIURL + 'classification/train', data);
        done();
      })
      .catch(done.fail);
    });
  });
});
