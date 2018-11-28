const parseChannel = require('./modules/parseChannel');
const KafkaClient = require('../tg-chan-kafka');
const ProcessMessages = require('./modules/processMessages');

new KafkaClient().then( kafkaClient => {
  kafkaClient.producer.then( kafkaProducer => {
    const processMessages = ProcessMessages( kafkaProducer );

    kafkaClient.subscribe(['newChannelWithId', 'updateNewMessage', 'updateNewMessages'],( message ) => {
      switch( message.topic ){
        case 'newChannelWithId':
          const channelUsername = JSON.parse( message.value ).username;

          parseChannel('https://t.me/' + channelUsername).then( channelData => {
            channelData.username = channelUsername;

            kafkaProducer.send([{
              topic: 'newChannelWebData',
              messages: JSON.stringify( channelData )
            }], () => {} );
          } );
          break;
        case 'updateNewMessages':
          processMessages( JSON.parse( message.value ) );
          break;
        case 'updateNewMessage':
          processMessages([JSON.parse( message.value ).message]);
          break;
      }

    } );
  } );
} );
