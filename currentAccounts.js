const request = require('superagent')
const config = require('./config')
const bitcoindRpc = require('./bitcoindRpc')

const currentAccounts = {}

// get all addresses I care about


function initializeWatchedAddresses(){
    request
        .get(config.brainLocation + 'members')
        .end( (err, res)=> {
            if (err || res.body.err){
                return console.log('unable to get members, braindead')
            }
            res.body.forEach( member => checkInitial(member.address) )
        })
}


function checkInitial(address){
    if (!address) return console.log('address required')
    bitcoindRpc.getBalance(address, (err, balance)=> {
        if (err) return console.log('getbalance response:', err);
        console.log('', address, balance)
        currentAccounts[address] = balance
    })
}

// checkInitial('n2ywqjRRTdb9pfmRkDjag96TozUhBgvwww')
initializeWatchedAddresses()

module.exports = currentAccounts
