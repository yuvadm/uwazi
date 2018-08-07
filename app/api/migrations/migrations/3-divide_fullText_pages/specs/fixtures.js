import db from 'api/utils/testing_db';

export default {
  entities: [
    { title: 'test_doc', fullText: 'first page\fsecond page\fthird page\f' },
    { title: 'test_doc2', fullText: 'first page\fsecond page\fthird page\ffourth page\f' }
  ],
};
