const getWebPageContent = require('./getWebPageContent');

module.exports = ( url ) => {
  return getWebPageContent( url ).then( $ => {
    const members = parseInt( $('.tgme_page_extra').text().replace(/ /g, '') );
    return {
      title: $('.tgme_page_title').text().replace(/\n/g, '').trim(),
      members: members,
      info: $('.tgme_page_description').html(),
      avatar: $('.tgme_page_photo_image').attr('src')
    };
  } );
}
