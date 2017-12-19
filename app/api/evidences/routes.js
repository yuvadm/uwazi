import evidences from './evidences';
import needsAuthorization from '../auth/authMiddleware';

export default (app) => {
  app.post('/api/evidences', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.save(req.body, req.user, req.language)
    .then(response => res.json(response))
    .catch(res.error);
  });

  app.delete('/api/entities', needsAuthorization(['admin', 'editor']), (req, res) => {
    evidences.delete(req.query)
    .then(response => res.json(response))
    .catch(res.error);
  });
};
