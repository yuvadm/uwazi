import evidencesAPI from '../evidencesAPI';
import {APIURL} from 'app/config.js';
import backend from 'fetch-mock';

describe('evidencesAPI', () => {
  let arrayResponse = [{entities: 'array'}];
  //let singleResponse = [{entities: 'single'}];

  beforeEach(() => {
    backend.restore();
    backend
    .get(APIURL + 'evidences?_id=docId', {body: JSON.stringify({rows: arrayResponse})})
    .delete(APIURL + 'evidences?_id=id', {body: JSON.stringify({backednResponse: 'testdelete'})})
    .post(APIURL + 'evidences', {body: JSON.stringify({backednResponse: 'test'})});
  });

  afterEach(() => backend.restore());

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
