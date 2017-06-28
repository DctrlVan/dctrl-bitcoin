const Kefir = require('kefir')
const bitcoin = require('bitcoinjs-lib')
const bitcoind = require('bitcoin')

// all config options are optional
const client = new bitcoind.Client({
  host: 'localhost',
  port: 8332,
  user: 'bitcoin',
  pass: 'local321'
});

client.cmd('getbalance', '*', 6, function(err, balance, resHeaders){
  if (err) return console.log(err);
  console.log('Balance:', balance);
});


var blkEmitter, txEmitter
const blkStream = Kefir.stream( e => {
    blockEmitter = e
}).log('block party!')

const txStream = Kefir.stream( e => {
    txEmitter = e
})
.onValue( tx => {
    let id = tx.getId()
    console.log({id})
})
const sock = require('zmq').socket('sub')
// sock.subscribe("hashblock");
// sock.subscribe("hashtx");
sock.subscribe("rawblock");
sock.subscribe("rawtx");

sock.on('message', function(topic, message) {
    switch ( topic.toString('utf8') ) {
        case 'rawblock':
            const blk = bitcoin.Block.fromBuffer(message)
            blockEmitter.emit(blk)
            break
        case 'rawtx':
            const tx = bitcoin.Transaction.fromBuffer(message)
            txEmitter.emit(tx)
            break
        case 'hashtx':
            console.log('in hashtx handler')
            break
        case 'hashblock':
            console.log('in hashblock handler')
            break
    }
})

sock.on('connect', function(fd, ep) {console.log('connect, endpoint:', ep);});

sock.connect('tcp://127.0.0.1:28332');

function handleBlock(block){
    console.log('in rawblock handler')
    block.transactions.forEach( tx => {
        console.log(tx)
        tx.outs.forEach( output => {
            console.log({
              output: output.toString('utf8')})

        })
    })
}

function handleTx(tx){
    console.log('handling tx')

}

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
