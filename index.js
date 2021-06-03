const { Client, RichEmbed } = require('discord.js');
const { token, coin, coinapi } = require('./config')
const fetch = require('node-fetch')
var ram = {
    tickHive: 0.1234,
    tickHbd: 0.1234
}

const client = new Client();

client.on('ready', () => {
    console.log('Bot Now connected!');
    console.log('Logged In as', client.user.tag)
    client.user.setStatus('online'); // online, idle, invisible, dnd

    console.log('Bot status: ', client.user.presence.status);

    // Bot sending a Message to a text channel called test
    const testChannel = client.channels.find(x => x.name === 'test')
    console.log(testChannel)
        // client.channels.find(c => c.name === 'test').send('Hello Server!')

});

// Bot listenning messages
client.on('message', msg => {

    console.log(msg.content)
    if (msg.content === 'ping') {
        msg.reply('pong')
    }
    /*
        if (msg.content === 'hello') {
            msg.channel.send(`Hello ${msg.author}`);
        }

        if (msg.content.includes('!test')) {
            msg.channel.send('Glad you are testing');
        }

        if (msg.content === '!fazt') {
            msg.channel.send('https://youtube.com/fazttech');
            msg.channel.send('https://youtube.com/faztcode');
        }

        if (msg.content === '!pretty') {
            const embed = new RichEmbed()
                // .setTitle('A pretty message')
                // .setColor(0xFF0000)
                // .setDescription('Hello', msg.author);
                .addField('Something One', 'Some content', true)
                .addField('Something Two', 'Some content Two', true)
                .addField('Something Three', 'Some content Three', false)
                .setAuthor('Fazt', 'https://pngimage.net/wp-content/uploads/2018/05/code-logo-png-4.png');
            msg.channel.send(embed);
        }
    */
    // Deleting 100 messages
    if (msg.content.split(' ')[0] == `!${coin}`) {
        fetch(`${coinapi}/@${msg.content.split(' ')[1]}`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let reply = `@${msg.content.split(' ')[1]} ${coin.toUpperCase()} balances:\n`
                reply += `:money_with_wings: ${parseFloat(result.balance/1000).toFixed(3).commafy()} ${coin.toUpperCase()}\n`
                if (result.poweredUp) reply += `:flashlight: ${parseFloat(result.poweredUp/1000).toFixed(3).commafy()} Powered ${coin.toUpperCase()}\n`
                if (Object.keys(result.contracts)) {
                    var sum = 0
                    for (c in result.contracts) {
                        sum += result.contracts[c].amount
                    }
                    if (sum) reply += `:currency_exchange: ${parseFloat(sum/1000).toFixed(3).commafy()} ${coin.toUpperCase()} in open orders.\n`
                }
                if (result.gov) reply += `:classical_building: ${parseFloat(result.gov/1000).toFixed(3).commafy()} ${coin.toUpperCase()}G\n`
                if (result.heldCollateral) reply += `:chart_with_upwards_trend: ${parseFloat(result.heldCollateral/1000).toFixed(3).commafy()} ${coin.toUpperCase()}G held as collateral and earning :man_office_worker:`
                msg.channel.send(reply)
            })
            .catch(e => { console.log(e) })
    }

    if (msg.content.startsWith(`!${coin}runners`)) {
        fetch(`${coinapi}/runners`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Nodes in control:\n`
                for (account in result.runners) {
                    ms += '@' + account + '\n'
                }
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}check`)) {
        fetch(`${coinapi}/coin`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `${result.check}\n`
                for (account in result.info) {
                    ms += `\t${account}: ${result.info[account]}\n`
                }
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}stats`)) {
        fetch(`${coinapi}/`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `:bar_chart:Stats:\n`
                for (key in result.stats) {
                    if (typeof result.stats[key] == 'number' || typeof result.stats[key] == 'string') {
                        ms += `${key}: ${result.stats[key]}\n`
                    } else {
                        ms += `${key}:\n`
                        for (item in result.stats[key]) {
                            ms += `\t${item}: ${result.stats[key][item]}\n`
                        }
                    }
                }
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}nodes`)) {
        var urls = [`${coinapi}/runners`, `${coinapi}/queue`] //datasources
        let promises = urls.map(u => fetch(u))
        Promise.all(promises).then(res =>
            Promise.all(res.map(res => res.json()))
        ).then(jsons => {
            let result = jsons[1]
            let result2 = jsons[0]
            let ms = `Nodes in Consensus:\n`
            for (account in result.queue) {
                let icon = ':eye:'
                if (result2.runners.hasOwnProperty(account)) icon = ':closed_lock_with_key:'
                ms += `${icon} @${account}\n`
            }
            msg.channel.send(ms)

        }).catch(e => { console.log(e) })

    }
    if (msg.content.startsWith(`!${coin}hive`)) {
        fetch(`${coinapi}/stats`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `:chart:${coin.toUpperCase()} is currently worth ${parseFloat(result.stats.HiveVWMA.rate).toFixed(3)} HIVE, and ${parseFloat(result.stats.HbdVWMA.rate).toFixed(3)} HBD on the DEX`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}ico`)) {
        fetch(`${coinapi}/@ri`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `There's ${parseFloat(result.balance/1000).toFixed(3).commafy()} ${coin.toUpperCase()} for sell at 1.000 HIVE.`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}feed`)) {
        fetch(`${coinapi}/feed`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ops = []
                let items = 0
                for (item in result.feed) {
                    const block = item.split(':')[0]
                    if (result.feed[item].split('|')[1] != ' Report processed') {
                        ops[items] = `${block}|${result.feed[item]}`
                        items++
                    }
                }
                let ms = ``
                let past = parseInt(msg.content.split(' ')[1]) + 1
                if (!past) past = 20
                if (typeof past != 'number') past = 20
                if (past > 20) past = 20
                if (past < 4) past = 4
                for (i = ops.length - 1; i > ops.length - past; i--) {
                    ms += `${ops[i]}\n`
                }
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}help`)) {
        fetch(`${coinapi}/@ri`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Availible commands:\n!${coin}dexhelp -Detailed DEX Help\n!${coin}govhelp -Detailed Governance Help\n!${coin}nodes -Nodes in Control:closed_lock_with_key: and Consensus:eye: \n!${coin}ico -ICO Round Info\n!${coin}hive -price\n!${coin} [hiveaccount] -hiveaccount balances\n!${coin}stats\n!${coin}feed [3-20]`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }

    if (msg.content.startsWith(`!${coin}dexhelp`)) {
        let ms = `Availible commands:\n!${coin}dexprice -Price in Pair\n!${coin}dexbuybook[pair] -Highest buy orders for pair \n!${coin}dexbuy[pair] [number] [account]-Generate Hive Signer Link to Buy Order #\n!${coin}dexnewbuy[pair] [price] [qty] [account]-Generate Hive Signer Link to Create New Buy Order\n!${coin}dexsellbook[pair] -Lowest sell orders for pair \n!${coin}dexsell[pair] [number] [account]-Generate Hive Signer Link to Sell Order #\n!${coin}dexnewsell[pair] [price] [qty] [account]-Generate Hive Signer Link to Create New Sell Order\n`
        msg.channel.send(ms)
    }
    if (msg.content.startsWith(`!${coin}govhelp`)) {
        let ms = `Availible commands:\n\`!${coin}govup [account] [qty] [Opt \`%\` to select % of liquid tokens to stake. qty in ${coin.toUpperCase()}]\`\n   -Stake Tokens in Governance to provide collateral to operate the DEX, and Consensus\n\`!${coin}govdown [account] [qty] [\`%\` Percent of Staked tokens to unstake] \`\n   -Unstake Tokens, 4 week unstaking period\n `
        msg.channel.send(ms)
    }
    if (msg.content.startsWith(`!${coin}dexbuybookhive`)) {
        fetch(`${coinapi}/dex`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Open HIVE for ${coin.toUpperCase()} Buy Orders:\n`,
                    i = 0
                ram.bh[msg.author] = [0]
                for (item in result.markets.hive.buyOrders) {
                    i++
                    ram.bh[msg.author].push(item)
                    ms += `  ${i}: ${parseFloat(result.markets.hive.buyOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.markets.hive.buyOrders[item].hive / 1000).toFixed(3)} HIVE. Fee ${parseFloat(result.markets.hive.buyOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexnewbuyhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order`
                } else {
                    ms = `There are no open buy orders at this time\nSend \`!${coin}dexnewbuyhive [price] [qty] [account]\` to buy qty ${coin.toUpperCase()} @price`
                }
                ms += `\nLast trade price ${result.markets.hive.tick}/HIVE`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}dexbuybookhbd`)) {
        fetch(`${coinapi}/dex`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Open HBD for ${coin.toUpperCase()} Buy Orders:\n`,
                    i = 0
                ram.bd[msg.author] = []
                for (item in result.hbd.buyOrders) {
                    i++
                    ram.bd[msg.author].push(item)
                    ms += `  ${i}: ${parseFloat(result.hbd.buyOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.hbd.buyOrders[item].hbd / 1000).toFixed(3)} HBD. Fee ${parseFloat(result.hbd.buyOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexnewbuyhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order`
                } else {
                    ms = `There are no open buy orders at this time\nSend \`!${coin}dexnewbuyhbd [price] [qty] [account]\` to buy qty ${coin.toUpperCase()} @price`
                }

                ms += `\nLast trade price ${result.markets.hbd.tick}/HBD`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}dexsellbookhive`)) {
        fetch(`${coinapi}/dex`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Open ${coin.toUpperCase()} for HIVE Sell Orders:\n`,
                    i = 0
                ram.sh[msg.author] = []
                for (item in result.markets.hive.sellOrders) {
                    i++
                    ram.sh[msg.author].push(item)
                    ms += `${i}: ${parseFloat(result.markets.hive.sellOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.markets.hive.sellOrders[item].hive / 1000).toFixed(3)} HIVE. Fee ${parseFloat(result.markets.hive.sellOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexnewsellhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order.`
                } else {
                    ms = `There are no open sell orders at this time\nSend \`!${coin}dexnewsellhive [price] [qty] [account]\` to sell qty ${coin.toUpperCase()} @price`
                }

                ms += `\nLast trade price ${result.markets.hive.tick}/HIVE`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}dexsellbookhbd`)) {
        fetch(`${coinapi}/dex`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Open ${coin.toUpperCase()} for HBD Sell Orders:\n`,
                    i = 0
                ram.sd[msg.author] = []
                for (item in result.hbd.sellOrders) {
                    i++
                    ram.sd[msg.author].push(item)
                    ms += `${i}: ${parseFloat(result.hbd.sellOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.hbd.sellOrders[item].hbd / 1000).toFixed(3)} HBD. Fee ${parseFloat(result.hbd.sellOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexnewsellhbd [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order.`
                } else {
                    ms = `There are no open sell orders at this time\nSend \`!${coin}dexnewsellhbd [price] [qty] [account]\` to sell qty ${coin.toUpperCase()} @price`
                }

                ms += `\nLast trade price ${result.markets.hbd.tick}/HBD`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`${coin}dexbuyhive`)) { //!${coin}dexbuy[pair] [number] [account]
        let opts = {
            pair: 'hive',
            type: 'bh'
        }
        buy(msg, opts)
    }
    if (msg.content.startsWith(`${coin}dexbuyhbd`)) { //!${coin}dexbuy[pair] [number] [account]
        let opts = {
            pair: 'hbd',
            type: 'bd'
        }
        buy(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexnewbuyhive`)) { //!${coin}dexnewbuy[pair] [price] [qty] [account]
        let opts = {
            pair: 'hive',
            type: 'bh'
        }
        newBuy(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexnewbuyhbd`)) { //!${coin}dexnewbuy[pair] [price] [qty] [account]
        let opts = {
            pair: 'hbd',
            type: 'bd'
        }
        newBuy(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexsellhive`)) { //!${coin}dexsell[pair] [number] [account]
        let opts = {
            pair: 'hive',
            type: 'sh'
        }
        sell(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexsellhbd`)) { //!${coin}dexsell[pair] [number] [account]
        let opts = {
            pair: 'hbd',
            type: 'sd'
        }
        sell(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexnewsellhive`)) { //!${coin}dexnewsellhive [price] [qty] [account]
        let opts = {
            pair: 'hive'
        }
        newSell(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexnewsellhbd`)) { //!${coin}dexnewsellhbd [price] [qty] [account]
        let opts = {
            pair: 'hbd'
        }
        newSell(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexprice`)) {
        fetch(`${coinapi}/dex`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Last Trades:\nHIVE: ${result.markets.hive.tick} ${coin.toUpperCase()}/HIVE\nHBD: ${result.markets.hbd.tick} ${coin.toUpperCase()}/HBD`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    //`!${coin}govup [account] [qty] [\`%\`
    if (msg.content.startsWith(`!${coin}govup`)) {
        let qty = msg.content.split(' ')[2],
            per = msg.content.split(' ')[3],
            account = msg.content.split(' ')[1].toLowerCase(),
            params = {
                "required_auths": [account],
                "required_posting_auths": 0,
                "id": `${coin}_gov_up`
            }
        if (per === '%') {
            per = true
        } else {
            per = false
        }
        fetch(`${coinapi}/@${account}`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = ''
                if (result.balance >= parseInt(parseFloat(qty) * 1000) && !per) {
                    let amount = parseInt(parseFloat(qty) * 1000)
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=${params.required_auths}&required_posting_auths=${params.required_posting_auths}&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else if (per && qty <= 100 && qty > 0) {
                    let q = parseInt(parseFloat(msg.content.split(' ')[2]) * 1000)
                    let amount = parseInt(result.balance * (q / 100000))
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=${params.required_auths}&required_posting_auths=${params.required_posting_auths}&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else {
                    ms = `You have ${parseFloat(result.balance/1000).toFixed(3).commafy()} ${coin.toUpperCase()} availible to lock`
                }
                msg.channel.send(reply)
            })
            .catch(e => { console.log(e) })
    }
    //`!${coin}govdown [account] [qty] [\`%\`
    if (msg.content.startsWith(`!${coin}govdown`)) {
        let qty = msg.content.split(' ')[2],
            per = msg.content.split(' ')[3],
            account = msg.content.split(' ')[1].toLowerCase(),
            params = {
                "required_auths": [account],
                "required_posting_auths": 0,
                "id": `${coin}_gov_down`
            }
        if (per === '%') {
            per = true
        } else {
            per = false
        }
        fetch(`${coinapi}/@${account}`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = ''
                if (result.gov >= parseInt(parseFloat(qty) * 1000) && !per) {
                    let amount = parseInt(parseFloat(qty) * 1000)
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=${params.required_auths}&required_posting_auths=${params.required_posting_auths}&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else if (per && qty <= 100 && qty > 0) {
                    let q = parseInt(parseFloat(msg.content.split(' ')[2]) * 1000)
                    let amount = parseInt(result.gov * (q / 100000))
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=${params.required_auths}&required_posting_auths=${params.required_posting_auths}&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else {
                    ms = `You have ${parseFloat(result.gov/1000).toFixed(3).commafy()} ${coin.toUpperCase()} availible to unlock`
                }
                msg.channel.send(reply)
            })
            .catch(e => { console.log(e) })
    }
});

client.login(token);


function checkAccount(name) {
    return new Promise((r, e) => {
        fetch("https://anyx.io", {
                body: ` {\
        "jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_accounts\", \"params\":[[\"${name}\"]], \"id\":1}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            .then(r => { return r.json() })
            .then(re => {
                if (re.result.length) r(re.result[0])
                else { e('No account by that name') }
            })
            .catch(re => { e(re) })
    })
}

function newSell(msg, opts) {
    let qty = parseFloat(msg.content.split(' ')[2]),
        price = msg.content.split(' ')[1],
        account = msg.content.split(' ')[3].toLowerCase(),
        hours = msg.content.split(' ')[4]
    checkAccount(account)
        .then(resCheckAccount => {
            console.log({ resCheckAccount })
            fetch(`${coinapi}/@${account}`)
                .then(r => {
                    return r.json()
                })
                .then(resAccount => {
                    console.log({ resAccount })
                    let ms = ''
                        // Do checks to give a good link
                    if (parseFloat(qty) > 0.0) {
                        if ((qty * 1000) > resAccount.balance) {
                            qty = resAccount.balance
                        } else {
                            qty = parseInt(qty * 1000)
                        }
                        if (parseFloat(price) > 0.0) {
                            if (hours >= 1) {
                                if (hours > 60) {
                                    hours = 60
                                } else {
                                    hours = parseInt(hours)
                                }
                            } else {
                                hours = 60
                            }
                            price = parseFloat(price).toFixed(4)
                            var dlux = parseInt(parseFloat(qty) * 1000),
                                amount = parseInt(parseFloat(qty) * parseFloat(price) * 1000),
                                params = {
                                    "required_auths": [account],
                                    "required_posting_auths": 0,
                                    "id": `${coin}_dex_${opts.pair}_sell`,
                                    "json": JSON.stringify({
                                        [coin]: dlux,
                                        [opts.pair]: amount,
                                        hours
                                    })
                                }
                            ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`

                        } else {
                            ms = `Price is ${price}\nUse \`!${coin}dexnewsell${pair} [price] [qty] [account]\`\n\`!${coin}dexnewsell${pair} ${ram.tick} ${(resAccount.balance/1000).toFixed(3)} ${account}\``
                        }
                    } else {
                        ms = `Quantity is ${qty} -[qty]\nYour balance is ${(resAccount.balance/1000).toFixed(3)}\nUse \`!${coin}dexnewsell${opts.pair}pair [price] [qty] [account]\`\n\`!${coin}dexnewsell${opts.pair} 0.1234 ${(resAccount.balance/1000).toFixed(3)} yourhiveaccount\``
                    }
                    msg.channel.send(ms)
                })
                .catch(e => {
                    let ms = `Error on Account Check:Unknown`
                    msg.channel.send(ms)
                })
        })
        .catch(e => { console.log(e) })
}

function sell(msg, opts) {
    let tx = parseInt(msg.content.split(' ')[1]) || 1,
        account = msg.content.split(' ')[2].toLowerCase(),
        urls = [`${coinapi}/dex`, `${coinapi}/@${account}`], //datasources
        promises = urls.map(u => fetch(u))
    Promise.all(promises).then(res =>
        Promise.all(res.map(res => res.json()))
    ).then(jsons => {
        let dex = jsons[0].markets,
            resAccount = jsons[1],
            contract = ram[`${opts.type}`][msg.author][tx].split(':')[1]
        console.log({ resAccount })
        let ms = ''
            // Do checks to give a good link
        var params = {
            "required_auths": [account],
            "required_posting_auths": 0,
            "id": `${coin}_dex_sell`,
            "json": JSON.stringify({
                contract,
                for: receiver, //attn
                dlux: u //attn
            })
        }
        ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`

        msg.channel.send(ms)
    }).catch(e => { console.log(e) })
}

function newBuy(msg, opts) { //!${coin}dexnewbuy[pair] [price] [qty] [account]
    let price = parseFloat(msg.content.split(' ')[1]).toFixed(6),
        account = msg.content.split(' ')[3].toLowerCase(),
        qty = parseInt(parseFloat(msg.content.split(' ')[2]) * 1000),
        urls = [`${coinapi}/dex`, `${coinapi}/@${account}`], //datasources
        promises = urls.map(u => fetch(u))
    Promise.all(promises).then(res =>
        Promise.all(res.map(res => res.json()))
    ).then(jsons => {
        let dex = jsons[0].markets,
            resAccount = jsons[1],
            contract = {
                amount: qty,
                hbd: "0.000",
                hive: "0.000"
            },
            escrowTimer = {}
        escrowTimer.ratifyIn = now.setHours(now.getHours() + 1);
        escrowTimer.ratifyUTC = new Date(escrowTimer.ratifyIn);
        escrowTimer.ratifyString = escrowTimer.ratifyUTC.toISOString().slice(0, -5);
        escrowTimer.expiryIn = now.setHours(now.getHours() + 1 + 60);
        escrowTimer.expiryUTC = new Date(escrowTimer.expiryIn);
        escrowTimer.expiryString = escrowTimer.expiryUTC.toISOString().slice(0, -5);
        if (opts.pair == 'hive') {
            contract.hive = parseFloat(qty * 1000 * parseFloat(price)).toFixed(3)
        } else {
            contract.hbd = parseFloat(qty * 1000 * parseFloat(price)).toFixed(3)
        }
        console.log({ resAccount })
        let ms = '',
            to = getAgent(dex.queue, contract.amount),
            agent = getAgent(dex.queue, contract.amount, to),
            id = parseInt(Math.random() * 1000000)
        var params = {
            from: account,
            to,
            agent,
            id,
            hbd: parseFloat(contract.hbd / 1000).toFixed(3),
            hive: parseFloat(contract.hive / 1000).toFixed(3),
            rat: escrowTimer.ratifyString,
            exp: escrowTimer.expiryString,
            json: JSON.stringify({
                dextx: {
                    dlux: qty,
                    hours: 60
                }
            })
        }
        if (params.to == 'er' || params.agent == 'er') {
            ms = 'No availible nodes have enough collateral to make this swap.'
        } else {
            ms = `https://hivesigner.com/sign/escrow-transfer?from=${params.from}&to=${params.to}&agent=${params.agent}&escrow_id=${params.id}&hbd_amount=${params.hbd}%20HBD&hive_amount=${params.hive}%20HIVE&fee=0.000%20HIVE&ratification_deadline=${params.rat}&escrow_expiration=${params.exp}&json_meta=${params.json}
\nExpect 3-4 Minutes for Confirmation`
        }
        msg.channel.send(ms)
    }).catch(e => { console.log(e) })
}

function buy(msg, opts) {
    let tx = parseInt(msg.content.split(' ')[1]) || 1,
        account = msg.content.split(' ')[2].toLowerCase(),
        urls = [`${coinapi}/dex`, `${coinapi}/@${account}`], //datasources
        promises = urls.map(u => fetch(u))
    Promise.all(promises).then(res =>
        Promise.all(res.map(res => res.json()))
    ).then(jsons => {
        let dex = jsons[0].markets,
            resAccount = jsons[1],
            contract = ram[`${opts.type}`][msg.author][tx.split(':')[1]],
            escrowTimer = {}
        escrowTimer.ratifyIn = now.setHours(now.getHours() + 1);
        escrowTimer.ratifyUTC = new Date(escrowTimer.ratifyIn);
        escrowTimer.ratifyString = escrowTimer.ratifyUTC.toISOString().slice(0, -5);
        escrowTimer.expiryIn = now.setHours(now.getHours() + 1 + until);
        escrowTimer.expiryUTC = new Date(escrowTimer.expiryIn);
        escrowTimer.expiryString = escrowTimer.expiryUTC.toISOString().slice(0, -5);
        console.log({ resAccount })
        let ms = '',
            to = getAgent(dex.queue, contract.amount),
            agent = getAgent(dex.queue, contract.amount, to),
            id = parseInt(Math.random() * 1000000),
            dexsel = ''
        var params = {
            from: account,
            to,
            agent,
            id,
            hbd: parseFloat(contract.hbd / 1000).toFixed(3),
            hive: parseFloat(contract.hive / 1000).toFixed(3),
            rat: escrowTimer.ratifyString,
            exp: escrowTimer.expiryString,
            json: JSON.stringify({
                contract,
                for: dex[opts.pair].sellOrders[contract].from
            })
        }
        if (params.to == 'er' || params.agent == 'er') {
            ms = 'No availible nodes have enough collateral to make this swap.'
        } else {
            ms = `https://hivesigner.com/sign/escrow-transfer?from=${params.from}&to=${params.to}&agent=${params.agent}&escrow_id=${params.id}&hbd_amount=${params.hbd}%20HBD&hive_amount=${params.hive}%20HIVE&fee=0.000%20HIVE&ratification_deadline=${params.rat}&escrow_expiration=${params.exp}&json_meta=${params.json}
\nExpect 3-4 Minutes for Confirmation`
        }
        msg.channel.send(ms)
    }).catch(e => { console.log(e) })
}

function getAgent(q, c, a) {
    let p = []
    for (i in q) {
        if (c / 2 < q[i].g && i != a) {
            p.push(i)
        }
    }
    if (p.length) {
        return p[parseInt(Math.random() * p.length)]
    } else {
        return 'er'
    }
}

String.prototype.commafy = function() {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};

Number.prototype.commafy = function() {
    return String(this).commafy();
};

/*
https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${user}%22%5D&required_posting_auths=%5B%5D&id=someid&json=${encodeURIComponent(json)}&redirect_uri=https://ecency.com/
https://hivesigner.com/sign/escrow-transfer?from=${user}&to=${user}&agent=${user}&escrow_id=${rand}&hbd_amount=0.000%20HBD&hive_amount=0.000%20HIVE&fee=0.000%20HIVE&ratification_deadline=2018-04-25T19%3A08%3A45&escrow_expiration=2018-04-26T19%3A08%3A45&json_meta={%22terms%22:%22test%22}

*/