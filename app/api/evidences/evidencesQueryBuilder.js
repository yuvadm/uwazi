/* eslint-disable camelcase */
export default function () {
  let baseQuery = {
    _source: {
      //include: [
        //'title', 'icon', 'processed', 'creationDate', 'template',
        //'metadata', 'type', 'sharedId', 'toc', 'attachments',
        //'language', 'file', 'uploaded', 'published'
      //]
    },
    from: 0,
    size: 30,
    query: {
      bool: {
        must: [],
        must_not: [],
        filter: []
      }
    },
    sort: []
    //aggregations: {
      //all: {
        //global: {},
        //aggregations: {
          //types: {
            //terms: {
              //field: 'template.raw',
              //missing: 'missing',
              //size: 9999
            //},
            //aggregations: {
              //filtered: {
                //filter: {
                  //bool: {
                    //must: [{match: {published: true}}]
                  //}
                //}
              //}
            //}
          //}
        //}
      //}
    //}
  };

  //const aggregations = baseQuery.aggregations.all.aggregations;

  return {
    query() {
      return baseQuery;
    },

    language(language) {
      let match = {term: {language: language}};
      baseQuery.query.bool.filter.push(match);
      //aggregations.types.aggregations.filtered.filter.bool.must.push(match);
      return this;
    },

    filter(filters = []) {
      Object.keys(filters).forEach((property) => {
        const match = this.filterProperty(filters, property);
        baseQuery.query.bool.filter.push(match);
          //baseQuery.aggregations.all.aggregations.types.aggregations.filtered.filter.bool.must.push(match);
      });
      return this;
    },

    filterProperty(filters, property) {
      const filter = filters[property];
      const values = filter.values;
      let match = {terms: {}};
      match.terms[`${property}.raw`] = values;

      if (filter.and) {
        match = {bool: {must: []}};
        match.bool.must = values.map((value) => {
          let m = {term: {}};
          m.term[`${property}.raw`] = value;
          return m;
        });
      }

      return match;
    },

    from(from) {
      baseQuery.from = from;
      return this;
    },

    limit(size) {
      baseQuery.size = size;
      return this;
    }
  };
}
