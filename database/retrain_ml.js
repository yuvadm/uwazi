/* eslint-disable camelcase, no-console */
import mongoose from 'mongoose';
import P from 'bluebird';

import MLAPI from '../app/api/evidences/MLAPI';
import evidences from '../app/api/evidences/evidencesModel';

let evidencesTrained = 0;
let spinner = ['|', '/', '-', '\\'];
let pos = 0;

function retrain() {
  return evidences.get()
  .then((evidencesResult) => {
    return P.resolve(evidencesResult).map((evidence) => {
      process.stdout.write(`Traingin Models with evidences... ${spinner[pos]} - ${evidencesTrained} trained\r`);
      evidencesTrained += 1;
      pos += 1;
      if (pos > 3) {
        pos = 0;
      }
      return MLAPI.train(evidence);
    }, {concurrency: 1});
  });
}


const start = Date.now();
retrain()
.then(() => {
  const end = Date.now();
  process.stdout.write(`Trainin Models with evidences... - ${evidencesTrained} trained\r\n`);
  process.stdout.write(`Done, took ${(end - start) / 1000} seconds\n`);
  mongoose.disconnect();
});
