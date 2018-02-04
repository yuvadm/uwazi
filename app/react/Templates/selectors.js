import {createSelector} from 'reselect';

const templatesState = (state) => state.templates;

const getAllPropertyNames = createSelector(
  state => templatesState(state),
  templates => {
    let values = {};

    templates.forEach((template) => {
      template.get('properties').forEach((property) => {
        values[property.get('_id')] = property.get('label');
      });
    });

    return values;
  });

const get = createSelector(
  state => templatesState(state),
  templates => templates
);

export {
  getAllPropertyNames,
  get
};
