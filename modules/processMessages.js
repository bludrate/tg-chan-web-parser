const parsePost = require('./parsePost');

const queue = [];
let processing = false;

function processMessage( message, kafkaProducer ) {
  return parsePost( message.link, message.content ).then( postWebData => {
    postWebData.chatId = message.chat_id;
    postWebData.messageId = message.id;

    kafkaProducer.send([{
      topic: 'postWebData',
      messages: JSON.stringify( postWebData )
    }], () => {} );

    return postWebData;
  } ).catch( error => {
    //just catch
  } );
}

async function startProcessing( kafkaProducer ) {
  if ( !processing ) {
    processing = true;

    while( queue.length ) {
      const message = queue[0];

      await processMessage( message, kafkaProducer ).catch( error => {
        if ( error !== 'No web data' ) {
          console.log( error );
        }
      } );

      queue.splice(0,1);

      console.log( queue.length );
    }

    processing = false;
  }
}

module.exports = ( kafkaProducer ) => {
  return ( messages ) => {
    Array.prototype.push.apply( queue, messages );

    startProcessing( kafkaProducer );
  };
};
