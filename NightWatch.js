/**
 * Project Name: NIGHTWATCH
 * Project Description: A Discord Bot made to interact with and Moderate your FiveM Server.
 * Project Developer: Toxic Dev || Discord: ☣ Tσxιƈ Dҽʋ ☣#7308 || Link: https://discord.gg/MbjZ7xc
 * 
 * COPYRIGHTS and Disclaimer *
 * Any and all Copyrights or Credits must be left in place.
 * 
 * DO NOT EDIT THIS IF YOU DONT KNOW WHAT YOURE DOING
 */

const { Discord, Client, Collection, MessageEmbed } = require ('discord.js');
const { readdirSync } = require('fs')
const client = new Client({
    disableMentions: 'everyone',
    unknownCommandResponse: true
});
const config = require('./src/config/config.json')
const supports = require('./src/local/supported.json')
const activityUp = require('./src/functions/actUpdater.js')

require(`./src/local/${config.language}.json`)

if (config.language == "en") {
    let language = "en"
    console.log(`[${config.shortname}] Language set to english!`)
} else if (config.language == "dan") {
    let language = "dan"
    console.log(`[${config.shortname}] Sproget er indstillet til dansk`)
} else if (config.language == "swe") {
    let language = "swe"
    console.log(`[${config.shortname}] Språk inställt till svenska`)
} else if (config.langauge == "fr") {
    let language = "fr"
    console.log(`[${config.shortname}] Langue définie en français`)
} else if (config.langauge == "de") {
    console.log(`[${config.shortname}]  Sprache auf deutsch gesetzt`)
}
let language = require(`./src/local/${config.language}`)

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
    require(`./src/handlers/${handler}`)(client)
});

client.categories = readdirSync ('./src/commands/');

// ON READY EVENT (TELLS THE BOT WHAT TO DO ON LOAD)
client.on('ready', async() => {
    
    let attemptCheck = require ('./src/functions/checkVersion.js')

    console.log(`\u001b[31m`, `------------[ ${config.shortname} | ${language.madeby} ]------------`)

    console.log(`\u001b[32 m`, `[${config.shortname}] ${language.firstlog} | ${client.users.size} users, ${client.channels.size} channels`)

    console.log(`\u001b[32 m`, `[${config.shortname}] ${language.secondlog} | https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)

    console.log(`\u001b[32 m`, `[${config.shortname}] ${language.thirdlog}`)

    console.log(`\u001b[31m`, `------------[ ${config.shortname} | ${language.madeby} ]------------`)

    if (config.playersActivity === true) {

        console.log('Polling for players online every 10 seconds')

        setInterval(() => {
            activityUp.updateStatus(client, config, language)
        }, 10000)
    } else {

        client.user.setActivity(`${config.activity}`, {
            type: 'LISTENING'
        })
    }
})

// REMOVE GUILD MEMBER EVENT (USER LEFT THE SERVER)
client.on('guildMemberRemove', member => {

    const channeltosend = member.guild.channels.find(chan => chan.name === `${config.joinchannel}`)

    let tagl = member.user.tag

    let leaveMessage = new MessageEmbed()
        leaveMessage.setColor(`RED`)
        leaveMessage.setDescription(`**${tagl}** ${language.justleft}`)

    channeltosend.send(leaveMessage)
});

// NEW GUILD MEMBER EVENT (NEW USER JOINED THE SERVER)
client.on('guildMemberAdd', member => {

    if (config.autorole === 'true') {

        const loggingChannel = config.logchannel;

        const autoRole = config.autoroleid

        let find = member.guild.roles.cache.get(`${autoRole}`)

        if (!autoRole) return console.error(`${language.autorolenotfound}`);

        if (!member.guild.me.hasPermission("ADMINISTRATOR")) return console.error(`${language.botnoperms}`)

        if (member.roles.has(autorole)) return console.log(`${member.user.username} has role ${config.autorole}, no roles changed!`)

        member.addRole(autoRole).catch(console.error);

        let roleName = member.guild.roles.cache.get(`${autoRole}`)

        member.send(`${member.guild.name} ${language.autoroledm} **${roleName.name}**`)
    } else {
        return;
    }
})

// MESSAGE EVENT (USED TO READ COMMANDS IN THE COMMANDS FOLDER)
client.on("message", function(message) {

    if (message.author.bot) return;

    if (!message.guild) return;

    if (!message.content.startsWith(`${config.prefix1}` || `${config.devprefix}`)) return;

    if (!message.member) message.member = message.guild.fetchMember(message)

    const args = message.content.slice(`${config.prefix1.length}`).trim().split(/ +/g);

    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return message.reply(`Use ${config.prefix1}cmds or ${config.prefix1}help to get a list of commands!`)

    if (message.content.startsWith(`${config.prefix1}`)) {

        let command = client.commands.get(cmd)

        let aliases = client.aliases.get(cmd)

        if (!command) return message.reply(`${language.cmdnotfound} **${config.prefix1}help**`)

    }

    let command = client.commands.get(cmd)

    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) command.run(client, message, args, config, language)
})

// RESTART COMMAND (DEVELOPER OR SERVER OWNER ONLY)
client.on('message', message => {

    var args = message.content.split(" ");

    var command = args[0].toLowerCase();

    if (command === `${config.devprefix}restart`) {

        if (!message.member.hasPermission(`${config.mainpermission}`)) return message.reply(`${language.noperms}`)

        message.channel.send(`${language.restarting}`)

        message.delete();

        console.clear();

        client.destroy()

        client.login(config.token)

        message.channel.send(`${config.shortname} ${language.restarted}`)

        return;
    }
});


// KILL COMMAND (DEVELOPER OR SERVER OWNER ONLY)
client.on('message', message => {

    var args = message.content.split(" ");

    var command = args[0].toLowerCase();

    if (command === `${config.devprefix}kill`) {

        if (!message.member.hasPermission(`${config.mainpermission}`)) return message.reply(`${language.noperms}`);

        message.channel.send(`${language.killing} ${config.shortname}`)

        message.delete();

        console.clear();

        client.destroy()

        return;
    }
});

// ACTIVITY COMMAND (DEVELOPER OR SERVER OWNER ONLY)
client.on('message', message => {

    var args = message.content.split(" ");

    var command = args[0].toLowerCase();

    var activity = args.slice(1).join(' ')

    if (command === `${config.devprefix}activity`) {

        message.delete()

        if (!message.member.hasPermission(`${config.mainpermission}`)) return message.reply(`${langauge.noperms}`);

        client.user.setActivity(`${activity}`)

        message.reply(`${langauge.activityupdate} ${activity}`)

    }
});

// MESSAGE DELETE EVENT (SHOW DELTED MESSAGES)
client.on('messageDelete', message => {

    const loggingchannelmsg = message.guild.channels.find(channel => channel.name === `${config.logchannel}`);

    const messagedel = message.cleanContent || 'Message could not be retrieved!'

    if (message.cleanContent.startsWith(`${config.prefix1}`)) return console.log(`Command: ${language.cmdran} Channel: ${message.channel.name}`)

    let delMessage = new MessageEmbed()
        delMessage.setAuthor(`${config.shortname} | ${langugae.logs}`)
        delMessage.setColor(config.color)
        delMessage.setThumbnail(config.logo)
        delMessage.setDescription(`${language.msgdeleted}`)
        delMessage.addField(`Channel`, `<#${message.channel.id}>`, true)
        delMessage.addField(`Author`, `${message.author.username}`, true)
        delMessage.addField(`Message Content`, `${messagedel}`)
        delMessage.addField(`Date`, `${new Date()}`, true)

    loggingchannelmsg.send(delMessage)
});

// ERROR HANDLERS (DO NOT TOUCH THIS)
client.on("resume", function(replayed) {
    console.info(`${language.resume} ${replayed}`)
})

client.on("reconnecting", function() {
    console.info(`${language.reconnecting}`)
})


client.on("warn", function(info) {
    console.log(`${langauge.warn} ${info}`)
})

client.on("error", function(err) {
    console.error(`${language.error} ${err}`)
})

process.on("uncaughtException", function(err) {
    console.error(`${language.exception} ${err}`)
})

process.on("unhandledRejection", function(err) {
    console.error(`${language.rejection} ${err}`)
})

client.login(config.token)