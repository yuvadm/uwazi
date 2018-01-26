import Immutable, {fromJS} from 'immutable';
import {mapStateToProps} from '../DocumentsList';
import DocumentSortSelector from '../DocumentSortSelector';
import Documents from '../Documents';

describe('Library DocumentsList container', () => {
  let documents = Immutable.fromJS({rows: [
    {title: 'Document one', _id: '1'},
    {title: 'Document two', _id: '2'},
    {title: 'Document three', _id: '3'}
  ], totalRows: 3});

  describe('maped state', () => {
    it('should contain the documents, library filters and search options', () => {
      const filters = fromJS({documentTypes: []});

      let store = {
        library: {
          documents,
          filters,
          ui: fromJS({filtersPanel: 'panel', selectedDocuments: ['selected']}),
          search: {sort: 'sortProperty'}
        },
        user: fromJS({_id: 'uid'})
      };

      let state = mapStateToProps(store, {storeKey: 'library'});
      expect(state).toEqual({
        documents: documents,
        DocumentsListSort: DocumentSortSelector,
        List: Documents
      });
    });
  });
});
