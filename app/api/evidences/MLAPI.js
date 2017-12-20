import {MLAPIURL} from '../config/config.js';
import request from 'shared/JSONRequest';

export default {
  getSuggestions: (url, data) => {
  },

  train: (data) => {
    return request.post(MLAPIURL + 'classification/train', data);
  }
};
