const {configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

// Setup enzyme's react adapter
configure({adapter: new Adapter()});

var error = console.error.bind(console);
console.error = function(message){
  if (message.match('/api/i18n/systemKeys')) {
    return;
  }
  error(message);
};

jasmine.createSpyObj = (name, methodNames) => {
  if (Array.isArray(name)) {
    methodNames = name;
  }

  let obj = {};

  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jasmine.createSpy(methodNames[i]);
  }

  return obj;
};

//console.error = () => { }
