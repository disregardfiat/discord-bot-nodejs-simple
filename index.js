const { Client, RichEmbed } = require('discord.js');
const { token } = require('./config')
const fetch = require('node-fetch')
const { momma_jokes } = require('./momma')

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
    if (msg.content.split(' ')[0] == '!dlux') {
        fetch(`https://token.dlux.io/@${msg.content.split(' ')[1]}`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let reply = `@${msg.content.split(' ')[1]} DLUX balances:\n`
                reply += `:money_with_wings: ${parseFloat(result.balance/1000).toFixed(3).commafy()} DLUX\n`
                if (result.poweredUp) reply += `:flashlight: ${parseFloat(result.poweredUp/1000).toFixed(3).commafy()} Powered DLUX\n`
                if (Object.keys(result.contracts)) {
                    var sum = 0
                    for (c in result.contracts) {
                        sum += result.contracts[c].amount
                    }
                    if (sum) reply += `:currency_exchange: ${parseFloat(sum/1000).toFixed(3).commafy()} DLUX in open orders.\n`
                }
                if (result.gov) reply += `:classical_building: ${parseFloat(result.gov/1000).toFixed(3).commafy()} DLUXG\n`
                if (result.heldCollateral) reply += `:chart_with_upwards_trend: ${parseFloat(result.heldCollateral/1000).toFixed(3).commafy()} DLUXG held as collateral and earning :man_office_worker:`
                msg.channel.send(reply)
            })
            .catch(e => { console.log(e) })
    }

    if (msg.content.startsWith('!dluxrunners')) {
        fetch(`https://token.dlux.io/runners`)
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
    if (msg.content.startsWith('!dluxcheck')) {
        fetch(`https://token.dlux.io/coin`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `${result.check}`
                for (account in result.info) {
                    ms += `\t${account}: ${result.info[account]}\n`
                }
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith('!dluxstats')) {
        fetch(`https://token.dlux.io/`)
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
    if (msg.content.startsWith('!dluxnodes')) {
        var urls = [`https://token.dlux.io/runners`, 'https://token.dlux.io/queue'] //datasources
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
    if (msg.content.startsWith('!dluxhive')) {
        fetch(`https://token.dlux.io/stats`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `:chart:DLUX is currently worth ${parseFloat(result.stats.HiveVWMA.rate).toFixed(3)} HIVE, and ${parseFloat(result.stats.HbdVWMA.rate).toFixed(3)} HBD on the DEX`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith('!dluxico')) {
        fetch(`https://token.dlux.io/@ri`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `There's ${parseFloat(result.balance/1000).toFixed(3).commafy()} DLUX for sell at 1.000 HIVE.`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith('!dluxfeed')) {
        fetch(`https://token.dlux.io/feed`)
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
    if (msg.content.startsWith('!dluxhelp')) {
        fetch(`https://token.dlux.io/@ri`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let ms = `Availible commands:\n!dluxnodes -Nodes in Control:closed_lock_with_key: and Consensus:eye: \n!dluxico -ICO Round Info\n!dluxhive -price\n!dlux [hiveaccount] -hiveaccount balances\n!dluxstats\n!dluxfeed [3-20]`
                msg.channel.send(ms)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith('!dluxdiss')) {
        console.log(msg)
        let ms,
            mja = momma_jokes.split('\n'),
            mj = mja[parseInt((Math.random() * mja.length))]
        if (msg.content.split(' ')[1]) {
            ms = mj.replace('DiscordUser', msg.content.split(' ')[1] + "'s")
        } else {
            ms = mj.replace('DiscordUser', msg.author.username + "'s")
        }
        msg.channel.send(ms)
    }
});

client.login(token);

String.prototype.commafy = function() {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};

Number.prototype.commafy = function() {
    return String(this).commafy();
};