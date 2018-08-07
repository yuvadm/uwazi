import { combineReducers } from 'redux';
import { modelReducer, formReducer } from 'react-redux-form';

import { manageAttachmentsReducer } from 'app/Attachments';
import createReducer from 'app/BasicReducer';

import references from './referencesReducer';
import uiState from './uiReducer';

export default combineReducers({
  doc: manageAttachmentsReducer(createReducer('viewer/doc', {})),
  rawText: createReducer('viewer/rawText', ''),
  targetDoc: createReducer('viewer/targetDoc', {}),
  targetDocReferences: createReducer('viewer/targetDocReferences', []),
  references,
  uiState,
  relationTypes: createReducer('viewer/relationTypes', []),
  tocForm: modelReducer('documentViewer.tocForm', []),
  tocFormState: formReducer('documentViewer.tocForm'),
  tocBeingEdited: createReducer('documentViewer/tocBeingEdited', false),
  sidepanel: combineReducers({
    metadata: modelReducer('documentViewer.sidepanel.metadata'),
    metadataForm: formReducer('documentViewer.sidepanel.metadata'),
    snippets: createReducer('documentViewer.sidepanel.snippets', []),
    tab: createReducer('viewer.sidepanel.tab', '')
  })
});
