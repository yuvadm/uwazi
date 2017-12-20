import evidences from './evidences';
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
    return evidences.getSuggestions(req.query._id)
    .then(response => res.json(response))
    .catch(res.error);
  });

  app.delete('/api/entities', needsAuthorization(['admin', 'editor']), (req, res) => {
    evidences.delete(req.query)
    .then(response => res.json(response))
    .catch(res.error);
  });
};
