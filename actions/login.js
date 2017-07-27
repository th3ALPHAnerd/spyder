'use strict';

/**
 * @param Horseman horseman
 * @param string username
 * @param string password
 */
module.exports = (horseman, username, password) => {

  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  if (!username || !password) {
    throw 'You must specify login credentials.';
  }

  horseman
    .viewport(3200,1800)
    .open('https://pclaim.fairfax.ihost.com/ibm/laborclaim/lchome.nsf/wMyClaims?OpenView')
    .userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36')
    // Clear cookies from previous runs
    .cookies([])
    // .html().then((html) => console.log(html))

    // .status()
    // .then((statusCode) => {
    //   console.log(`HTTP status code: ${statusCode}`);
    //   if (Number(statusCode) >= 400) {
    //     throw `Page failed with status: ${statusCode}`;
    //   }
    // })

    // Login form
    .type('input[name="Username"]', username)
    .type('input[name="Password"]', password)
    .click('input[name="ibm-sign-in"]')

    .waitForNextPage()
    // .wait(3000)

    .evaluate(() => {

      $ = window.$ || window.jQuery;
      const fullHtml = $('body').html();
      return !fullHtml.match(/You provided an invalid username or password. Please sign in again/);
    }).then((isLoggedIn) => {
      if (!isLoggedIn) { throw 'Login failed'; }
    })

    .cookies().then((cookies) => console.log('Cookies: ', cookies))
    .text('h1').then((text) => console.log(`Header of the page: ${text}`))

    .close();
};
