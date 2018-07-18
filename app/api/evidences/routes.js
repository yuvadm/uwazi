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

  app.post('/api/evidences/retrainModel', needsAuthorization(['admin', 'editor']), (req, res) => {
    return evidences.retrainModel(req.body.property, req.body.value)
    .then(response => {
      return res.json(response);
    })
    .catch(res.error);
  });

  app.get('/api/evidences/suggestions', needsAuthorization(['admin', 'editor']), (req, res) => {
    if (req.query.property) {
      return evidences.getSuggestionsForOneValue(req.query.property, req.query.value, req.language, req.query.limit)
      .then(response => res.json(response))
      .catch(res.error);
    }
    return evidences.getSuggestions(req.query._id, req.language)
    .then(response => res.json(response))
    .catch(res.error);
  });

  //
  app.get('/api/evidences/search', (req, res) => {
    let filters = {};
    if (req.query.filters) {
      filters = JSON.parse(req.query.filters);
    }
    return searchEvidences.search(filters, req.query.limit)
    .then(response => res.json(response))
    .catch(res.error);
  });
  //

  app.delete('/api/evidences/suggestions', needsAuthorization(['admin', 'editor']), (req, res) => {
    evidences.deleteSuggestions()
    .then(response => res.json(response))
    .catch(res.error);
  });

  app.get('/api/evidences/resetdocs', needsAuthorization(['admin', 'editor']), (req, res) => {
    evidences.resetDocEvidencesFlags()
    .then(response => res.json(response))
    .catch(res.error);
  });

  app.get('/api/evidences', (req, res) => {
    let query = req.query;
    query.language = req.language;
    evidences.get(query)
    .then(response => res.json(response))
    .catch(res.error);
  });
};
