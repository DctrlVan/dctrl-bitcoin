
var zmq = require('zmq')
  , sock = zmq.socket('sub');

sock.subscribe("hashblock");
sock.subscribe("hashtx");
sock.subscribe("rawblock");
sock.subscribe("rawtx");

sock.on('message', function(topic, message) {
    switch ( topic.toString('utf8') ) {
        case 'rawtx':
            console.log('in rawtx handler')
            break
        case 'hashtx':
            console.log('in hashtx handler')
            break
        case 'rawblock':
            console.log('in rawblock handler')
            break
        case 'hashblock':
            console.log('in hashblock handler')
            break
    }
})

sock.on('connect', function(fd, ep) {console.log('connect, endpoint:', ep);});

sock.connect('tcp://127.0.0.1:28332');

//
// // subber.js
// var zmq = require('zeromq')
//   , sock = zmq.socket('sub');
//
//
//
// sock.connect('tcp://192.168.0.109:28332');
// sock.subscribe("hashblock");
// sock.subscribe("hashtx");
// sock.subscribe("rawblock");
// sock.subscribe("rawtx");
//
// sock.on('message', function(topic, message) {
//   console.log('received a message related to:', topic, 'containing message:', message);
// });
