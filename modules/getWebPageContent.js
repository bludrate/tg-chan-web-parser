const request = require('request');
const cheerio = require('cheerio');

module.exports = ( url ) => {
  return new Promise( ( resolve, reject ) => {
    request( url, ( error, response, body ) => {
      if ( error ) {
        reject( error );
      } else {
        resolve( cheerio.load( body ) );
      }
    } );
  } );
}
