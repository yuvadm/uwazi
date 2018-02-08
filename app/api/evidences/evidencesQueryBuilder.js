/* eslint-disable camelcase */
export default function () {
  let baseQuery = {
    _source: {},
    from: 0,
    size: 30,
    query: {
      bool: {
        must: [],
        must_not: [],
        filter: []
      }
    },
    sort: [],
    aggregations: {}
  };

  return {
    query() {
      return baseQuery;
    },

    language(language) {
      let match = {term: {language: language}};
      baseQuery.query.bool.filter.push(match);
      return this;
    },

    filter(filters) {
      if (filters.isEvidence) {
        baseQuery.query.bool.filter.push({terms: {isEvidence: filters.isEvidence.values}});
        delete filters.isEvidence;
      }

      Object.keys(filters).forEach((property) => {
        filters[property].values.forEach((value) => {
          let valueMatch = {};
          valueMatch['value.raw'] = value;
          baseQuery.query.bool.filter.push({term: valueMatch});
          baseQuery.query.bool.filter.push({term: {property}});
        });
      });
      return this;
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
