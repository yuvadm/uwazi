import moment from 'moment';

export default {
  prepareMetadata(doc, templates, thesauris) {
    const template = templates.find(t => t._id === doc.template);

    if (!template || !thesauris.length) {
      return Object.assign({}, doc, { metadata: [], documentType: '' });
    }

    const metadata = template.properties.map((property) => {
      let value = doc.metadata[property.name];
      if (property.type === 'select' && value) {
        const thesauri = thesauris.find(t => t._id === property.content).values.find(v => v.id.toString() === value.toString());

        value = '';
        if (thesauri) {
          value = thesauri.label;
        }
      }

      if (property.type === 'date' && value) {
        value = moment(value, 'X').format('MMM DD, YYYY');
      }

      return { label: property.label, value };
    });

    return Object.assign({}, doc, { metadata, documentType: template.name });
  }
};
