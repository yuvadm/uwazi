import {createSelector} from 'reselect';

const thesaurisState = (state) => state.thesauris;

const getAllThesaurisLabels = createSelector(
  state => thesaurisState(state),
  thesauris => {
    let values = {};
    thesauris.forEach((thesauri) => {
      thesauri.get('values').forEach((value) => {
        values[value.get('id')] = value.get('label');
      });
    });

    return values;
  }
);

const get = createSelector(
  state => thesaurisState(state),
  thesauris => thesauris
);

export {
  getAllThesaurisLabels,
  get
};
