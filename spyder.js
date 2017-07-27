'use-strict';

const Horseman = require('node-horseman');
const commander = require('commander');
const prompt = require('prompt');
const validUrl = require('valid-url');
const fs = require('fs');

const PHANTOM_BIN = './node_modules/phantomjs-prebuilt/bin/phantomjs';
const ACTIONS = [];

commander.version('1.0.0')
  .option('-x --action [string]', 'The action to perform.')
  .option('-u --url [string]', 'Url used by certain actions')
  .option('-n --username [string]', 'username for log in')
  .option('-p --password [string]', 'Password for log in')
  .parse(process.argv);

/**
 *
 */
let initHorseman = () => {

  const options = {
    phantomPath: PHANTOM_BIN,
    cookiesFile: './cookie-jar',
    loadImages: true,
    injectJquery: true,
    webSecurity: true,
    ignoreSSLErrors: true
  };

  const horseman = new Horseman(options);
  horseman.on('consoleMessage', (message) => console.log(`Horseman log: ${message}`));
  horseman.on('error', (error) => console.log(`Horseman error: ${error}`));

  return horseman;
};


/**
 *
 */
const main = () => {

  if (!commander.action) {
    throw `An action must be specified. Supported actions include: ${ACTIONS.join(', ')}`;
  } else if (ACTIONS.indexOf(commander.action) < 0) {
    throw `Invalid action specified. Supported actions include: ${ACTIONS.join(', ')}`;
  } else {
    console.log(`Performing action: ${commander.action}`);
  }

  const executeAction = require('./actions/' + commander.action) , horsemanInstance = initHorseman();

  prompt.start();
  prompt.override = commander;

switch (commander.action) {

  case 'ping':
      prompt.get([{
        name: 'url',
        description: 'Enter a URL',
        required: true,
        conform: (value) => validUrl.isWebUri(value)
      }], (err, result) => executeAction(horsemanInstance, result.url));
      break;

  case 'login':
    prompt.get([{
        name: 'username',
        description: 'Enter PCLAIM username',
        required: true
      }, {
        name: 'password',
        description: 'Enter PCLAIM password',
        // hidden: true,
        required: true
    }], (err, result) =>  executeAction(horsemanInstance, result.username, result.password));
    break;

  default:
    horsemanInstance.close();
    throw `Invalid action specified. Supported actions include: ${ACTIONS.join(', ')}`;
  }
};


/**
 *
 */
 (() => {

  fs.readdir('./actions', (err, files) => {

    files.forEach((filename) => ACTIONS.push(filename.split('.')[0]));
    main();
  });
 })();
