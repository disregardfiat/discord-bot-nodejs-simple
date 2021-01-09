const { Client, RichEmbed } = require('discord.js');
const { token } = require('./config')
const fetch = require('node-fetch')

const client = new Client();

client.on('ready', () => {
    console.log('Bot Now connected!');
    console.log('Logged In as', client.user.tag)
    client.user.setStatus('dnd'); // online, idle, invisible, dnd

    console.log('Bot status: ', client.user.presence.status);

    // Bot sending a Message to a text channel called test
    const testChannel = client.channels.find(x => x.name === 'test')
    console.log(testChannel)
        // client.channels.find(c => c.name === 'test').send('Hello Server!')

});

// Bot listenning messages
client.on('message', msg => {
    /*
    console.log(msg.content)
    if (msg.content === 'ping') {
        msg.reply('pong')
    }

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
                msg.channel.send(`@${msg.content.split(' ')[1]} has ${parseFloat(result.balance/1000).toFixed(3).commafy()} DLUX and ${parseFloat(result.poweredUp/1000).toFixed(3).commafy()} Powered Up`)
            })
            .catch(e => { console.log(e) })
    }

    if (msg.content.startsWith('!dluxrunners')) {
        fetch(`https://token.dlux.io/runners`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let msg = ``
                for (account in result.runners) {
                    msg += '@' + account + '\n'
                }
                msg.channel.send(msg)
            })
            .catch(e => { console.log(e) })
    }
    if (msg.content.startsWith('!dluxhive')) {
        fetch(`https://token.dlux.io/stats`)
            .then(r => {
                return r.json()
            })
            .then(result => {
                let msg = `DLUX is currently worth ${result.HiveVWMA.rate.toFixed(3)} HIVE, and ${result.HbdVWMA.rate.toFixed(3)} HIVE on the DEX}`
                msg.channel.send(msg)
            })
            .catch(e => { console.log(e) })
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