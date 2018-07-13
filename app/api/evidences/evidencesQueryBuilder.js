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
    sort: [{probability: {order: 'desc'}}],
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
        let isEvidenceMatch = {bool: {should: []}};
        if (filters.isEvidence.values.includes('null')) {
          isEvidenceMatch.bool.should.push({bool: {must_not: {exists: {field: 'isEvidence'}}}});
        }
        isEvidenceMatch.bool.should.push({terms: {isEvidence: filters.isEvidence.values.filter((v) => v !== 'null')}});
        baseQuery.query.bool.filter.push(isEvidenceMatch);
        delete filters.isEvidence;
      }

      if (filters.probability) {
        const rangeFilter = {bool: {should: []}};
        filters.probability.values.forEach((value) => {
          const filter = {
            range: {
              probability: {
                gte: Number.parseFloat(value.split('-')[0]),
                lt: Number.parseFloat(value.split('-')[1])
              }
            }
          };
          rangeFilter.bool.should.push(filter);
        });
        baseQuery.query.bool.filter.push(rangeFilter);
        delete filters.probability;
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
