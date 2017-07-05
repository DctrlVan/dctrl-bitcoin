const config = require('./config')
const request = require('superagent')
const bitcoindZmq = require('./bitcoindZmq')
const bitcoindRpc = require('./bitcoindRpc')

const currentAccounts = require('./currentAccounts')

// check on new blocks
bitcoindZmq.hashblockStream.onValue( checkForPayments )
// bitcoindZmq.rawtxStream.log('test')

// get all the balances for those addresses.
// on the payment check compare old
// should issue member new addresses here too
// bitcoindZmq.hashblockStream.onValue( checkForPayments )

function checkForPayments(){
    console.log("checking for payments.")
    for (var addr in currentAccounts) {
        bitcoindRpc.getBalance(addr, (err, balance)=> {
            if (err) return console.log('getbalance response:', err);

            if (currentAccounts[addr] !== balance){
                let now = parseFloat(balance)
                let before = parseFloat(currentAccounts[addr])

                let amount = now - before
                console.log({now, before, amount})
                currentAccounts[addr] = balance
                console.log('payment received!', {amount})
                recordPayment(amount, addr)

            } else {
                console.log('no change')
            }

        })
    }
}

function recordPayment(amount, address){
    console.log(amount, address)
    request
        .post(config.brainLocation + 'members')
        .send({
            action: {
                type: "member-paid",
                address,
                amount: amount.toString(),
                "cash?": false,
                notes: "bitcoind"
            }
        })
        .end((err, res)=> {
            console.log({err,res:res.body})
        })
}
