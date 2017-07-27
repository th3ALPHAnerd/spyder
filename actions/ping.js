'use strict';

/**
 * @param Horseman horseman
 * @param string url
 */
module.exports = (horseman, url) => {

  if (!url || typeof url !== 'string') {
    throw 'You must specify a url to ping';
  } else {
    console.log(`Pinging url: ${url}`);
  }

  horseman
    .open(url)
    .status()
    .then((statusCode) => {

      if (Number(statusCode) >= 400) {
        throw `Page failed with status: ${statusCode}`;
      } else {
        console.log(`Status code returned: ${statusCode}`);
      }
    }).catch((err) => console.log(`Error: ${err}`))
    .close();
};
