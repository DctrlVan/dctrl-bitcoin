const bitcoind = require('bitcoin')

// all config options are optional
const client = new bitcoind.Client({
  host: 'localhost',
  port: 8332,
  user: 'bitcoin',
  pass: 'local321'
})

function watchAddress(address, callback){
    console.log({address})
    client.cmd(
        'importaddress',
        address,
        'test',
        true,
        (err, balance, resHeaders)=>{
            if (err) return callback(err);
            console.log({balance})
            callback(null)
    })
}


function initializeRescan(callback){
    // client.cmd(
    //     'importaddress',
    //     '35qn9wBprnrWkbtzTikcF454uMte2trWR2',
    //     'test',
    //     true,
    //     (err, balance, resHeaders)=>{
    //         if (err) return callback(err);
    //         callback(null)
    // })
}

function getBalance(address, callback){
    console.log({address})
    client.cmd(
        'getreceivedbyaddress',
        address,
        (err, balance, resHeaders)=>{
            if (err) return callback(err);
            callback(null, balance)
    })
}

module.exports = {
    getBalance,
    watchAddress,
    initializeRescan,
}
