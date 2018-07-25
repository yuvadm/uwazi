const MLAPIPORT = process.env.PORT ? process.env.PORT - 1000 : 4000;
const MLAPIURL = `http://localhost:${MLAPIPORT}/`;

export default {
  MLAPIURL: MLAPIURL
};
