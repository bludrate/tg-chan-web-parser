const getWebPageContent = require('./getWebPageContent');

function getUrlFromBackground( elem ) {
  return elem
    .attr('style')
    .match(/background\-image\:url\(\'(.*)\'\)/)[1];
}

const needToRequest = [
  'messageAnimation',
  'messagePhoto',
  'messageSticker',
  'messageVideo',
  'messageVideoNote',
  'messageVoiceNote',
  'messageContact'
];

function getUrl( url ) {
  if ( url.indexOf( '?' ) >= 0 ) {
    url+= '&embed=1';

    if ( url.indexOf('single&') ) {
      url = url.replace('single', 'single=1');
    }

    return url;
  }

  return url + '?embed=1'
}

module.exports = ( url, message ) => {
  return new Promise( ( resolve, reject ) => {
    const type = message._;
    if ( needToRequest.indexOf( type ) === -1 ) {
      reject('No web data');
    } else {
      getWebPageContent( getUrl( url ) ).then( $ => {
        const res = {};
        switch( type ) {
          case 'messageContact':
            res.contactName = $('.tgme_widget_message_contact_name').text();
            res.contactPhone = $('.tgme_widget_message_contact_phone').text();
            res.contactAvatarUrl = $('.tgme_widget_message_contact_wrap img').attr('src');
            break;
          case 'messageAnimation':
            res.animationThumb = getUrlFromBackground( $('.tgme_widget_message_video_thumb') )
            res.animationUrl = $('.tgme_widget_message_video').attr('src');
            break;
          case 'messagePhoto':
            res.photoUrl = getUrlFromBackground( $('.tgme_widget_message_photo_wrap') );
            break;
          case 'messageSticker':
            res.stickerUrl = getUrlFromBackground( $('.tgme_widget_message_sticker') );
            break;
          case 'messageVideo':
            res.videoThumb = getUrlFromBackground( $('.tgme_widget_message_video_thumb') );
            res.videoUrl = $('.tgme_widget_message_video').attr('src');
            break;
          case 'messageVideoNote':
            res.videoThumb = getUrlFromBackground( $('.tgme_widget_message_roundvideo_thumb') );
            res.videoUrl = $('.tgme_widget_message_roundvideo').attr('src');
            break;
          case 'messageVoiceNote':
            res.voiceUrl =  $('.tgme_widget_message_voice').attr('src');
            break;
          // case 'messageText':
          //   const wp = message.content.web_page;
          //   if ( wp ) {
          //
          //     switch( wp.type ) {
          //       case ''
          //     }
          //   }
          //   break;
        }
        resolve( res );
      } ).catch( error => {
        console.log( error, message, url );
        reject( error );
      } );
    }
  } );
}
