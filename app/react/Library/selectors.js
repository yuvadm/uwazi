import {createSelector} from 'reselect';

const libraryState = (state, storeKey = 'library') => state[storeKey];

const getLibraryDocuments = createSelector(
  (state, storeKey) => libraryState(state, storeKey).documents,
  docs => docs
);

const getSelectedDocuments = createSelector(
  (state, storeKey) => libraryState(state, storeKey).ui.get('selectedDocuments'),
  docs => docs
);

export {
  getLibraryDocuments,
  getSelectedDocuments
};
