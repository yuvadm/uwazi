import evidencesAPI from '../evidencesAPI';
import {APIURL} from 'app/config.js';
import backend from 'fetch-mock';
import api from 'app/utils/api';

describe('evidencesAPI', () => {
  let arrayResponse = [{entities: 'array'}];

  beforeEach(() => {
    backend.restore();
    backend
    .get(APIURL + 'evidences?document=docId', {body: JSON.stringify(arrayResponse)})
    //.get(APIURL + 'evidences/search?filters=filter', {body: JSON.stringify(arrayResponse)})
    .get(APIURL + 'evidences/suggestions?_id=docId', {body: JSON.stringify(arrayResponse)})
    .delete(APIURL + 'evidences?_id=id', {body: JSON.stringify({backednResponse: 'testdelete'})})
    .post(APIURL + 'evidences', {body: JSON.stringify({backednResponse: 'test'})});
  });

  afterEach(() => backend.restore());

  describe('filter()', () => {
    it('should cleanup the filters "_" names and search evidences', (done) => {
      spyOn(api, 'get').and.returnValue(Promise.resolve({json: 'response'}));
      let data = {filters: {filter1: 'filter1', _filter2: 'filter2', _filter3: 'filter3'}};
      evidencesAPI.search(data)
      .then((response) => {
        expect(api.get).toHaveBeenCalledWith(
          'evidences/search',
          {filters: {filter1: 'filter1', filter2: 'filter2', filter3: 'filter3'}}
        );
        expect(response).toEqual('response');
        done();
      })
      .catch(done.fail);
    });
  });

  describe('save()', () => {
    it('should post the evidence data to /evidences', (done) => {
      let data = {name: 'evidence name'};
      evidencesAPI.save(data)
      .then((response) => {
        expect(JSON.parse(backend.lastOptions(APIURL + 'evidences').body)).toEqual(data);
        expect(response).toEqual({backednResponse: 'test'});
        done();
      })
      .catch(done.fail);
    });
  });

  describe('getSuggestions()', () => {
    it('should request evidences', (done) => {
      evidencesAPI.getSuggestions('docId')
      .then((response) => {
        expect(response).toEqual(arrayResponse);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('get()', () => {
    it('should request evidences', (done) => {
      evidencesAPI.get('docId')
      .then((response) => {
        expect(response).toEqual(arrayResponse);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('delete()', () => {
    it('should delete the evidence', (done) => {
      let evidence = {_id: 'id'};
      evidencesAPI.delete(evidence)
      .then((response) => {
        expect(response).toEqual({backednResponse: 'testdelete'});
        done();
      })
      .catch(done.fail);
    });
  });
});
