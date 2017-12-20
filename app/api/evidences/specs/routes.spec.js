import evidencesRoutes from '../routes.js';
import instrumentRoutes from '../../utils/instrumentRoutes';
import evidences from '../evidences';
import MLAPI from '../MLAPI';
import {catchErrors} from 'api/utils/jasmineHelpers';

fdescribe('evidences routes', () => {
  let routes;

  beforeEach(() => {
    routes = instrumentRoutes(evidencesRoutes);
  });

  describe('POST', () => {
    let req;
    beforeEach(() => {
      req = {
        body: {evidence: {text: 'evidence text'}},
        user: {username: 'admin'},
        language: 'lang',
        io: {sockets: {emit: () => {}}}
      };
      spyOn(MLAPI, 'train');
    });

    it('should need authorization', () => {
      expect(routes.post('/api/evidences', req)).toNeedAuthorization();
    });

    it('should create a new evidence', (done) => {
      spyOn(evidences, 'save').and.returnValue(new Promise((resolve) => resolve('document')));

      routes.post('/api/evidences', req)
      .then((result) => {
        expect(result).toBe('document');
        expect(evidences.save).toHaveBeenCalledWith(req.body, req.user, req.language);
        done();
      })
      .catch(catchErrors);
    });

    it('should call the train MLapi endpoint with the evidence', (done) => {
      spyOn(evidences, 'save').and.returnValue(new Promise((resolve) => resolve('document')));

      routes.post('/api/evidences', req)
      .then((result) => {
        expect(result).toBe('document');
        expect(MLAPI.train).toHaveBeenCalledWith(req.body);
        done();
      })
      .catch(catchErrors);
    });
  });
});
