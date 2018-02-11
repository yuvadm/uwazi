import {MLAPIURL} from '../../config/config.js';
import request from 'shared/JSONRequest';
import api from '../MLAPI';

describe('MLAPI', () => {
  describe('train()', () => {
    it('should post data passed', (done) => {
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

  describe('retrainModel()', () => {
    it('should post data passed', (done) => {
      spyOn(request, 'post').and.returnValue(Promise.resolve('response'));
      const data = {data: 'test'};
      api.retrainModel(data)
      .then((response) => {
        expect(response).toBe('response');
        expect(request.post).toHaveBeenCalledWith(MLAPIURL + 'classification/retrain', data);
        done();
      })
      .catch(done.fail);
    });
  });
});
