import { actions } from 'app/BasicReducer';
import { t, Translate } from 'app/I18N';
import { store } from './store';
import socket from './socket';

socket.on('templateChange', (template) => {
  store.dispatch(actions.update('templates', template));
});
socket.on('templateDelete', (template) => {
  store.dispatch(actions.remove('templates', { _id: template.id }));
});

socket.on('updateSettings', (settings) => {
  store.dispatch(actions.set('settings/collection', settings));
});

socket.on('thesauriChange', (thesauri) => {
  store.dispatch(actions.update('thesauris', thesauri));
});
socket.on('thesauriDelete', (thesauri) => {
  store.dispatch(actions.remove('thesauris', { _id: thesauri.id }));
});

socket.on('translationsChange', (translations) => {
  store.dispatch(actions.update('translations', translations));
  t.resetCachedTranslation();
  Translate.resetCachedTranslation();
});
