const config = require('./config')
const request = require('superagent')
const bitcoindZmq = require('./bitcoindZmq')
const bitcoindRpc = require('./bitcoindRpc')
const price = require('./price')

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
                // update the state of this address
                let balanceNow = parseFloat(balance)
                let balanceInitial = parseFloat(currentAccounts[addr])
                currentAccounts[addr] = balance // really need to stop address reuse...

                // do not think this is safe math but converting to cad
                let btcAmount = balanceNow - balanceInitial

                calculateCadAmount(btcAmount, (err, cadAmount)=>{
                    if (err){
                        return console.log('unable to get price should retry')
                    }
                    console.log({btcAmount, cadAmount})
                    recordPayment(cadAmount, addr)
                })
            } else {
                console.log('no change')
            }

        })
    }
}

function calculateCadAmount(btcAmount, callback){
    price.getCadPrice((err, lastPriceCadBtc)=> {
          // retry code maybe
          let cadAmount = btcAmount * lastPriceCadBtc
          callback(err, cadAmount)
    })
}

function recordPayment(amount, address){
    request
        .post(config.brainLocation + 'members')
        .send({
            action: {
                type: "member-paid",
                address,
                amount,
                "cash?": false,
                notes: "bitcoind"
            }
        })
        .end((err, res)=> {
            console.log({err,res:res.body})
        })
}
