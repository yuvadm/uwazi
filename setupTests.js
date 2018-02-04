const {configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

// Setup enzyme's react adapter
configure({adapter: new Adapter()});

jasmine.createSpyObj = (name, methodNames) => {
  if (Array.isArray(name)) {
    methodNames = name;
  }

  let obj = {};

  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn();
  }

  return obj;
};

//console.error = () => { }
