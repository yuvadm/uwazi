import evidences from './evidences';
import searchEvidences from './searchEvidences';
import MLAPI from './MLAPI';
import needsAuthorization from '../auth/authMiddleware';

export default (app) => {
  app.post('/api/evidences', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.save(req.body, req.user, req.language)
    .then(response => {
      MLAPI.train(req.body);
      return res.json(response);
    })
    .catch(res.error);
  });

  app.get('/api/evidences/suggestions', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.getSuggestions(req.query._id, req.language)
    .then(response => res.json(response))
    .catch(res.error);
  });

  //
  app.get('/api/evidences/search', (req, res) => {
    return searchEvidences.search(req.query)
    .then(response => res.json(response))
    .catch(res.error);
  });
  //

  app.get('/api/evidences', (req, res) => {
    let query = req.query;
    query.language = req.language;
    evidences.get(query)
    .then(response => res.json(response))
    .catch(res.error);
  });
};
