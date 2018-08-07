export default {
  delta: 3,

  name: 'divide_fullText_pages',

  description: 'divide full text by pages and store the number of pages',

  up(db) {
    process.stdout.write(`${this.name}...\r\n`);
    return new Promise((resolve, reject) => {
      const cursor = db.collection('entities').find();
      let index = 1;
      cursor.on('data', (entity) => {
        cursor.pause();
        if (!entity.fullText) {
          process.stdout.write(`processed -> ${index}\r`);
          index += 1;
          cursor.resume();
          return;
        }

        const pages = entity.fullText.split('\f').slice(0, -1);
        const fullText = pages.reduce((memo, pageText, pageIndex) => Object.assign(memo, { [pageIndex + 1]: pageText }), {});

        db.collection('entities').findOneAndUpdate(entity, { $set: { fullText, numPages: pages.length } }, () => {
          process.stdout.write(`processed -> ${index}\r`);
          index += 1;
          cursor.resume();
        });
      });

      cursor.on('err', reject);
      cursor.on('end', () => {
        process.stdout.write(`processed -> ${index}\r\n`);
        resolve();
      });
    });
  }
};
