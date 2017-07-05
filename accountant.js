const config = require('./config')
const request = require('superagent')
const bitcoindZmq = require('./bitcoindZmq')
const bitcoinRpc = require('./bitcoindRpc')

var currentAccounts = {}

// get all addresses I care about
request
    .get(config.brainLocation + 'members')
    .end( (err, res)=> {
        if (err || res.body.err){
            return console.log('unable to get members, braindead')
        }
        res.body.forEach( initCurrent )
        bitcoinRpc.initializeRescan( err => {
            console.log('rescan returned', err)
        })
    })


// check on new blocks
bitcoindZmq.hashblockStream.onValue( checkForPayments )

// get all the balances for those addresses.
// on the payment check compare old
// should issue member new addresses here too
// bitcoindZmq.hashblockStream.onValue( checkForPayments )

function initCurrent(member){
    if (!member.address) return console.log('address required')
    bitcoinRpc.watchAddress(member.address, (err, balance)=> {
        if (err) return console.log('importaddress response to:',member.address, err.code);
        console.log('now getting balance')
        bitcoinRpc.getBalance(member.address, (err, balance)=> {
            if (err) return console.log('getbalance response:', err);
            console.log('', member.address, balance)
            currentAccounts[member.address] = balance
        })
    })
}

function checkForPayments(){
    console.log("checking for payments.")
    for (var addr in currentAccounts) {
        bitcoinRpc.getBalance(addr, (err, balance)=> {
            if (err) return console.log('getbalance response:', err);

            if (currentAccounts[addr] !== balance){
                console.log('payment received!')
            } else {
                console.log('no change')
            }

        })
    }
}
