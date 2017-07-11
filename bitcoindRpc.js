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
        (err, res, resHeaders)=>{
            if (err) return callback(err);
            callback(null)
    })
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
//
// getBalance('n2ywqjRRTdb9pfmRkDjag96TozUhBgvwww', (err, balance)=> {
//     console.log({balance})
// })

module.exports = {
    getBalance,
    watchAddress,
}
