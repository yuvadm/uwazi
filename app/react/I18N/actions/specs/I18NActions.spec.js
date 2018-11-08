import { actions as formActions } from 'react-redux-form';
import { store } from 'app/store';
import Immutable from 'immutable';
import SettingsAPI from 'app/Settings/SettingsAPI';
import I18NApi from '../../I18NApi';
import { actions as basicActions } from 'app/BasicReducer';
import * as actions from '../I18NActions';

describe('I18NActions', () => {
  const dispatch = jasmine.createSpy('dispatch');
  const translations = Immutable.fromJS([
    { locale: 'en', contexts: [{ id: 'System', values: { Search: 'Search' } }] },
    { locale: 'es', contexts: [{ id: 'System', values: { Search: 'Buscar' } }] }
  ]);

  describe('inlineEditTranslation', () => {
    it('should dispatch an OPEN_INLINE_EDIT_FORM action with context and key given', () => {
      spyOn(formActions, 'load');
      spyOn(store, 'getState').and.returnValue({ translations });
      actions.inlineEditTranslation('System', 'Search')(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'OPEN_INLINE_EDIT_FORM', context: 'System', key: 'Search' });
      expect(formActions.load).toHaveBeenCalledWith('inlineEditModel', { en: 'Search', es: 'Buscar' });
    });
  });

  describe('closeInlineEditTranslation', () => {
    it('should dispatch an CLOSE_INLINE_EDIT_FORM action', () => {
      spyOn(formActions, 'reset');
      actions.closeInlineEditTranslation()(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_INLINE_EDIT_FORM' });
      expect(formActions.reset).toHaveBeenCalledWith('inlineEditModel');
    });
  });

  describe('toggleInlineEdit', () => {
    it('should dispatch an TOGGLE_INLINE_EDIT action', () => {
      expect(actions.toggleInlineEdit()).toEqual({ type: 'TOGGLE_INLINE_EDIT' });
    });
  });

  describe('saveTranslations', () => {
    it('should request the I18NApi to save each translation', (done) => {
      spyOn(I18NApi, 'save').and.returnValue(Promise.resolve());
      const translation = [{ _id: 1 }, { _id: 2 }];
      actions.saveTranslations(translation)(dispatch);
      expect(I18NApi.save).toHaveBeenCalledWith({ _id: 1 });
      expect(I18NApi.save).toHaveBeenCalledWith({ _id: 2 });
      done();
    });
  });

  describe('editTranslations', () => {
    it('should load the translation in to the translations form', (done) => {
      spyOn(formActions, 'load').and.returnValue(() => {});
      const translation = [{ _id: 1 }, { _id: 2 }];
      actions.editTranslations(translation)(dispatch);
      expect(formActions.load).toHaveBeenCalledWith('translationsForm', translation);
      done();
    });
  });

  describe('resetForm', () => {
    it('should load the translation in to the translations form', (done) => {
      spyOn(formActions, 'reset').and.returnValue(() => {});
      actions.resetForm()(dispatch);
      expect(formActions.reset).toHaveBeenCalledWith('translationsForm');
      done();
    });
  });

  describe('addLanguage', () => {
    it('should request the I18NApi to add a language', (done) => {
      spyOn(I18NApi, 'addLanguage').and.returnValue(Promise.resolve());
      spyOn(SettingsAPI, 'get').and.returnValue(Promise.resolve({ collection: 'updated settings' }));
      spyOn(basicActions, 'set');
      actions.addLanguage({ label: 'Español', key: 'es' })(dispatch).then(() => {
        expect(I18NApi.addLanguage).toHaveBeenCalledWith({ label: 'Español', key: 'es' });
        expect(SettingsAPI.get).toHaveBeenCalled();
        expect(basicActions.set).toHaveBeenCalledWith('settings/collection', 'updated settings');
        done();
      });
    });
  });

  describe('deleteLanguage', () => {
    it('should request the I18NApi to add a language', (done) => {
      spyOn(I18NApi, 'deleteLanguage').and.returnValue(Promise.resolve());
      spyOn(SettingsAPI, 'get').and.returnValue(Promise.resolve({ collection: 'updated settings' }));
      spyOn(basicActions, 'set');
      actions.deleteLanguage('es')(dispatch).then(() => {
        expect(I18NApi.deleteLanguage).toHaveBeenCalledWith('es');
        expect(SettingsAPI.get).toHaveBeenCalled();
        expect(basicActions.set).toHaveBeenCalledWith('settings/collection', 'updated settings');
        done();
      });
    });
  });

  describe('setDefaultLanguage', () => {
    it('should request the I18NApi to add a language', (done) => {
      spyOn(I18NApi, 'setDefaultLanguage').and.returnValue(Promise.resolve());
      actions.setDefaultLanguage('es')(dispatch).then(() => {
        expect(I18NApi.setDefaultLanguage).toHaveBeenCalledWith('es');
        done();
      });
    });
  });
});
