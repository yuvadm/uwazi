import templates from 'api/templates';
import entities from 'api/entities';
import thesauris from 'api/thesauris/thesauris.js';
import MLAPI from 'api/evidences/MLAPI.js';

thesauris.dictionaries()
.then((dictionaries) => {
  return Promise.all([
    dictionaries,
    templates.get({properties: {$elemMatch: {content: {$in: dictionaries.map((v) => v.id)}}}})
  ]);
})
.then(([dictionaries, templates]) => {
  const allSelectrPropertyNames = templates.reduce((names, template) => {
    const templateNames = template.properties.filter((p) => p.type === 'multiselect').map((p) => p.name);
    return names.concat(templateNames);
  }, []);

  let dictionaryValues = dictionaries.reduce((values, dictionary) => {
    return values.concat(dictionary.values.map((v) => v.id));
  }, []);

  let entitiesQuery = {type: 'document', $or: []};
  allSelectrPropertyNames.forEach((name) => {
    const condition = {};
    condition['metadata.' + name] = {$in: dictionaryValues};
    entitiesQuery.$or.push(condition);
  });

  return Promise.all([
    allSelectrPropertyNames,
    dictionaryValues,
    entities.get(entitiesQuery, '+fullText')
  ]);
})
.then(([allSelectrPropertyNames, dictionaryValues, docs]) => {
  let result = {};
  dictionaryValues.forEach((value) => {
    docs.forEach((doc) => {
      allSelectrPropertyNames.forEach((name) => {
        if (doc.metadata[name].includes(value)) {
          if (!result[value]) {
            result[value] = [];
          }
          if (result[value].length < 2) {
            result[value].push({id: doc._id, text: doc.fullText, title: doc.title});
          }
        }
      });
    });
  });

  //console.log(result);

  return MLAPI.setUp({data: result});
})
.then((response) => {
  console.log(response);
})
.catch((e) => {
  console.log(e);
});
