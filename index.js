const { Client, RichEmbed } = require('discord.js');
const { token, coin, coinapi, coinlogo} = require('./config')
const fetch = require('node-fetch')
var ram = {
    tickHive: 0.1234,
    tickHbd: 0.1234,
    bh: {},
    bd: {},
    sh: {},
    sd: {}
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
                if (result.poweredUp){ 
                    reply += `:flashlight: ${parseFloat(result.poweredUp/1000).toFixed(3).commafy()} Powered ${coin.toUpperCase()}\n`
                    if(Object.keys(result.up).length){
                        reply += `\t:+1: ${parseFloat(100*result.up.power/result.up.max).toFixed(2)}% Vote Power\n`
                    } else {
                        reply += `\t:+1: 100.00% Vote Power\n`
                    }
                    if(Object.keys(result.down).length){
                        reply += `\t  :-1: ${parseFloat(100*result.down.power/result.down.max).toFixed(2)}% Vote Power\n`
                    } else {
                        reply += `\t  :-1: 100.00% Downvote Power\n`
                    }
                }
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
    if (msg.content.startsWith(`!${coin}new`)) {
        fetch(`${coinapi}/new?a=5`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                console.log(result)
                let embed = {
                    "title": `Newest ${coin.toUpperCase} Content`,
                    "description": `In Chronologic Order:`,
                    "url": "https://dlux.io",
                    "color": 16174111,
                    "footer": {
                        "icon_url": coinlogo,
                        "text": "${coin} to the :first_quarter_moon_with_face:"
                    },
                    "author": {
                        "name": "Robotolux",
                        "icon_url": coinlogo
                    },
                    "fields": [
                    ]
                }
                let P = []
                for(i in result){
                    P.push(fetch("https://api.hive.blog", {
                        body: `{"jsonrpc":"2.0", "method":"condenser_api.get_content", "params":["${result[i].author}", "${result[i].permlink}"], "id":1}`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST"
                        }))
                }
                Promise.all(P).then(res =>
            Promise.all(res.map(res => res.json()))
        )
                .then(content =>{
                    console.log(content)
                    console.log(content[0])
                    for (i in content){
                        embed.fields.push({
                            name: `[${content[i].title}](https://peakd.com/@${content[i].author}/${content[i].permlink})`,
                            value: `By @${content[i].author}`,
                            inline: false,
                        })
                    }
                    msg.channel.send({embed})
                })
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
                let ms = `Availible commands:\n!${coin}dexhelp -Detailed DEX Help\n!${coin}govhelp -Detailed Governance Help\n!${coin}send [from] [to] [qty] - Send ${coin.toUpperCase()} \`!${coin}send myaccount theiraccount 1000.000\`\n!${coin}nodes -Nodes in Control:closed_lock_with_key: and Consensus:eye: \n!${coin}ico -ICO Round Info\n!${coin}hive -price\n!${coin} [hiveaccount] -hiveaccount balances\n!${coin}stats\n!${coin}feed [3-20]`
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
                ram.bh[msg.author] = []
                for (item in result.markets.hive.buyOrders) {
                    console.log(item)
                    i++
                    ram.bh[msg.author].push(item)
                    ms += `  ${i}: ${parseFloat(result.markets.hive.buyOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.markets.hive.buyOrders[item].hive / 1000).toFixed(3)} HIVE. Fee ${parseFloat(result.markets.hive.buyOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexbuyhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order.`
                } else {
                    ms = `There are no open buy orders at this time\nSend \`!${coin}dexnewbuyhive [price] [qty] [account]\` to buy qty ${coin.toUpperCase()} @price`
                }
                ms += `\nLast trade price ${result.markets.hive.tick}/HIVE`
                const embed = {
  "title": `Sell ${coin.toUpperCase} to Buy HIVE`,
  "description": `Last trade price ${result.markets.hive.tick}/HIVE`,
  "url": "https://discordapp.com",
  "color": 16174111,
  "footer": {
    "icon_url": coinlogo,
    "text": "${coin} to the :first_quarter_moon_with_face:"
  },
  "author": {
    "name": "DEX Tech",
    "icon_url": coinlogo
  },
  "fields": [
  ]
};
//msg.channel.send(ms, { embed })
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
                    console.log(item)
                    ram.bd[msg.author].push(item)
                    ms += `  ${i}: ${parseFloat(result.hbd.buyOrders[item].amount / 1000).toFixed(3)} ${coin.toUpperCase()} listed for ${parseFloat(result.hbd.buyOrders[item].hbd / 1000).toFixed(3)} HBD. Fee ${parseFloat(result.hbd.buyOrders[item].fee / 1000).toFixed(3)} ${coin.toUpperCase()}\n`
                }
                if (i) {
                    ms += `\nSend \`!${coin}dexbuyhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order`
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
                    ms += `\nSend \`!${coin}dexsellhive [Order (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order.`
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
                    ms += `\nSend \`!${coin}dexsellhbd [Order # (probably 1)] [hiveaccount]\` to recieve a HiveSigner Link to purchase order.`
                } else {
                    ms = `There are no open sell orders at this time\nSend \`!${coin}dexnewsellhbd [price] [qty] [account]\` to sell qty ${coin.toUpperCase()} @price`
                }

                ms += `\nLast trade price ${result.markets.hbd.tick}/HBD`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith(`!${coin}dexbuyhive`)) { //!${coin}dexbuy[pair] [number] [account]
        let opts = {
            pair: 'hive',
            type: 'bh'
        }
        buy(msg, opts)
    }
    if (msg.content.startsWith(`!${coin}dexbuyhbd`)) { //!${coin}dexbuy[pair] [number] [account]
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
    //`!${coin}send [from] [to] [qty] `
    if (msg.content.startsWith(`!${coin}send`)) {
        let qty = parseInt(parseFloat(msg.content.split(' ')[3]) * 1000),
            to = msg.content.split(' ')[2],
            from = msg.content.split(' ')[1].toLowerCase(),
            params = {
                "required_auths": [from],
                "required_posting_auths": 0,
                "id": `${coin}_send`
            }
        checkAccount(to)
        .then(rto=> {
            fetch(`${coinapi}/@${from}`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = ''
                if (result.balance >= qty) {
                    let amount = qty
                    params.json = JSON.stringify({
                                 to,
                                 amount
                             })
                    const embed = {
  "title": `@${from}'s Send Link`,
  "description": `HiveSigner Link for @${from} to Send ${parseFloat(amount/1000).toFixed(3)} ${coin.toUpperCase()} to @${to}`,
  "url": `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}`,
  "footer": {
    "icon_url": "https://cdn.discordapp.com/attachments/534553113433210902/850461330405589032/dlux-hive-logo.png",
    "text": `${coin.toUpperCase()} to the 🌛`
  }
}
msg.channel.send({embed})
                    //ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else {
                    ms = `You have ${parseFloat(result.balance/1000).toFixed(3).commafy()} ${coin.toUpperCase()} availible to send`
                    msg.channel.send(ms)
                }
            })
            .catch(e => { console.log(e) })
        })
        .catch(e=>{
            msg.channel.send(`@${to} is not a valid Hive account`)
        })
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
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else if (per && qty <= 100 && qty > 0) {
                    let q = parseInt(parseFloat(msg.content.split(' ')[2]) * 1000)
                    let amount = parseInt(result.balance * (q / 100000))
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else {
                    ms = `You have ${parseFloat(result.balance/1000).toFixed(3).commafy()} ${coin.toUpperCase()} availible to lock`
                }
                msg.channel.send(ms)
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
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else if (per && qty <= 100 && qty > 0) {
                    let q = parseInt(parseFloat(msg.content.split(' ')[2]) * 1000)
                    let amount = parseInt(result.gov * (q / 100000))
                    params.json = JSON.stringify({
                        amount
                    })
                    ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 60-75 Seconds for Confirmation`
                } else {
                    ms = `You have ${parseFloat(result.gov/1000).toFixed(3).commafy()} ${coin.toUpperCase()} availible to unlock`
                }
                msg.channel.send(ms)
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
                            qty = resAccount.balance /1000
                        } else {
                            qty = parseFloat(qty)
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
            contractID = ram[opts.type][msg.author][tx -1] //ram.bh[msg.author]
        console.log({ tx, resAccount, contractID, ram, opts, dex }, ram[opts.type][msg.author], dex[opts.pair].buyOrders[ram[opts.type][msg.author][0]] )
        let ms = ''
            // Do checks to give a good link
        var params = {
            "required_auths": [account],
            "required_posting_auths": [],
            "id": `${coin}_dex_buy`,
            "json": JSON.stringify({
                contract: contractID,
                for: dex[opts.pair].buyOrders[contractID].from,
                dlux: `${parseFloat(dex[opts.pair].buyOrders[contractID].amount / 1000).toFixed(3)}%20${coin.toUpperCase()}`
            })
        }
        ms = `https://hivesigner.com/sign/custom-json?authority=active&required_auths=%5B%22${params.required_auths}%22%5D&required_posting_auths=%5B%5D&id=${params.id}&json=${params.json}\nExpect 3-5 Minutes for reciept of ${opts.pair.toUpperCase()}`

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
            escrowTimer = {},
            now = new Date()
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
            to = getAgent(jsons[0].queue, contract.amount),
            agent = getAgent(jsons[0].queue, contract.amount, to),
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
                    [`${coin}`]: qty,
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
            contractID = ram[`${opts.type}`][msg.author][parseInt(tx) - 1],
            contract = dex[opts.pair].sellOrders[contractID],
            escrowTimer = {},
            now = new Date()
        escrowTimer.ratifyIn = now.setHours(now.getHours() + 1);
        escrowTimer.ratifyUTC = new Date(escrowTimer.ratifyIn);
        escrowTimer.ratifyString = escrowTimer.ratifyUTC.toISOString().slice(0, -5);
        escrowTimer.expiryIn = now.setHours(now.getHours() + 1 + 1);
        escrowTimer.expiryUTC = new Date(escrowTimer.expiryIn);
        escrowTimer.expiryString = escrowTimer.expiryUTC.toISOString().slice(0, -5);
        let ms = '',
            to = getAgent(jsons[0].queue, contract.amount, account),
            agent = getAgent(jsons[0].queue, contract.amount, account, to),
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
                contract: contractID,
                for: contract.from
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

function getAgent(q, coin, self, optFirst) { //literally queue
    if(!optFirst){a='a'}//assure logic in checks
    let pool = []
    for (i in q) {
        if (coin / 2 < q[i].g && i != a && i != self) { //.g is gov balance
            pool.push(i)
        }
    }
    if (pool.length) {
        return pool[parseInt(Math.random() * pool.length)]
    } else {
        return 'er' //longer returns may result in namespace collision
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