import instanceModel from 'api/odm';
import settings from 'api/settings/settings';

import translationsModel from './translationsModel.js';

const model = instanceModel(translationsModel);

function prepareContexts(contexts) {
  return contexts.map(context => ({
      ...context,
      type: context.id === 'System' || context.id === 'Filters' || context.id === 'Menu' ? 'Uwazi UI' : context.type,
      values: context.values ? context.values.reduce((values, value) => ({ ...values, [value.key]: value.value }), {}) : {}
  }));
}

function processContextValues(context) {
  let values;
  if (context.values && !Array.isArray(context.values)) {
    values = [];
    Object.keys(context.values).forEach((key) => {
      values.push({ key, value: context.values[key] });
    });
  }

  return { ...context, values: values || context.values };
}

function update(translation) {
  return model.getById(translation._id)
  .then((currentTranslationData) => {
    currentTranslationData.contexts.forEach((context) => {
      const isPresentInTheComingData = translation.contexts.find(_context => _context.id === context.id);
      if (!isPresentInTheComingData) {
        translation.contexts.push(context);
      }
    });

    return model.save({ ...translation, contexts: translation.contexts.map(processContextValues) });
  });
}

export default {
  prepareContexts,
  get() {
    return model.get()
    .then(response => response.map(translation => ({ ...translation, contexts: prepareContexts(translation.contexts) })));
  },

  save(translation) {
    if (translation._id) {
      return update(translation);
    }

    return model.save({ ...translation, contexts: translation.contexts && translation.contexts.map(processContextValues) });
  },

  addEntry(contextId, key, defaultValue) {
    return model.get()
    .then(result => Promise.all(result.map((translation) => {
      const context = translation.contexts.find(ctx => ctx.id === contextId);
      if (!context) {
        return Promise.resolve();
      }
      context.values = context.values || [];
      context.values.push({ key, value: defaultValue });
      return this.save(translation);
    })))
    .then(() => 'ok');
  },

  addContext(id, contextName, values, type) {
    const translatedValues = [];
    Object.keys(values).forEach((key) => {
      translatedValues.push({ key, value: values[key] });
    });
    return model.get()
    .then(result => Promise.all(result.map((translation) => {
      translation.contexts.push({ id, label: contextName, values: translatedValues, type });
      return this.save(translation);
    })))
    .then(() => 'ok');
  },

  deleteContext(id) {
    return model.get()
    .then(result => Promise.all(result.map(translation => model.save({ ...translation, contexts: translation.contexts.filter(tr => tr.id !== id) }))))
    .then(() => 'ok');
  },

  processSystemKeys(keys) {
    return model.get()
    .then((languages) => {
      let existingKeys = languages[0].contexts.find(c => c.label === 'System').values;
      const newKeys = keys.map(k => k.key);
      const keysToAdd = [];
      keys.forEach((key) => {
        if (!existingKeys.find(k => key.key === k.key)) {
          keysToAdd.push({ key: key.key, value: key.label || key.key });
        }
      });

      languages.forEach((language) => {
        let system = language.contexts.find(c => c.label === 'System');
        if (!system) {
          system = {
            id: 'System',
            label: 'System',
            values: keys.map(k => ({ key: k.key, value: k.label || k.key }))
          };
          language.contexts.unshift(system);
        }
        existingKeys = system.values;
        const valuesWithRemovedValues = existingKeys.filter(i => newKeys.includes(i.key));
        system.values = valuesWithRemovedValues.concat(keysToAdd);
      });

      return model.save(languages);
    });
  },

  updateContext(id, newContextName, keyNamesChanges, deletedProperties, values) {
    const translatedValues = [];
    Object.keys(values).forEach((key) => {
      translatedValues.push({ key, value: values[key] });
    });

    return Promise.all([model.get(), settings.get()])
    .then(([translations, siteSettings]) => {
      const defaultLanguage = siteSettings.languages.find(lang => lang.default).key;
      return Promise.all(translations.map((translation) => {
        const context = translation.contexts.find(tr => tr.id.toString() === id.toString());
        if (!context) {
          translation.contexts.push({ id, label: newContextName, values: translatedValues });
          return this.save(translation);
        }

        context.values = context.values || [];
        context.values = context.values.filter(v => !deletedProperties.includes(v.key));

        Object.keys(keyNamesChanges).forEach((originalKey) => {
          const newKey = keyNamesChanges[originalKey];
          const value = context.values.find(v => v.key === originalKey);
          if (value) {
            value.key = newKey;

            if (translation.locale === defaultLanguage) {
              value.value = newKey;
            }
          }
          if (!value) {
            context.values.push({ key: newKey, value: values[newKey] });
          }
        });

        Object.keys(values).forEach((key) => {
          if (!context.values.find(v => v.key === key)) {
            context.values.push({ key, value: values[key] });
          }
        });

        context.label = newContextName;

        return this.save(translation);
      }));
    })
    .then(() => 'ok');
  },

  async addLanguage(language) {
    const [lanuageTranslationAlreadyExists] = await model.get({ locale: language });
    if (lanuageTranslationAlreadyExists) {
      return Promise.resolve();
    }

    const { languages } = await settings.get();

    const [defaultTranslation] = await model.get({ locale: languages.find(l => l.default).key });

    return model.save({
      ...defaultTranslation,
      _id: null,
      locale: language,
      contexts: defaultTranslation.contexts.map(({ _id, ...context }) => context)
    });
  },

  async removeLanguage(language) {
    return model.delete({ locale: language });
  }
};
