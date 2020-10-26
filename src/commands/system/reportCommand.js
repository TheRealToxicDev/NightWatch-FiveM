const { MessageEmbed } = require ('discord.js');

module.exports = {
    name: 'report',
    category: 'system',
    description: 'Report a user.',

    run: async (client, message, args, config, language) => {

        const reportedUser = message.mentions.users.first()

        const reason = args.slice(1).join(' ');

        var theReporter = message.author;

        await message.delete();

        var channel = message.channel.name;

        var reportChannel = message.guild.channels.cache.find(channel => channel.name === `${config.reportchannel}`);

        if (!reportedUser) return message.reply(`${language.invalidargs} | IE: **${config.prefix1}report @ToxicDev This is an example**`)

        if (!reason) return message.reply(`${language.invalidargs} | IE: **${config.prefix1}report @ToxicDev This is an example**`)

        if (!reportChannel) return message.reply(`${language.channelnotfound}`)

        let reportEmbed = new MessageEmbed()
            reportEmbed.setAuthor(`${config.shortname} Reports!`)
            reportEmbed.addField(`User Reported:`, `${reportedUser}`)
            reportEmbed.setDescription(`Reason: **${reason}**`)
            reportEmbed.addField('Reported By:', `<@${theReporter.id}>`)
            reportEmbed.addField('Reported In:', `#${channel}`)
            reportEmbed.setColor(config.color)
            reportEmbed.setThumbnail(config.logo)
            reportEmbed.setFooter('The following is the time of the report')
            .setTimestamp()

            reportChannel.send(reportEmbed)

            message.reply(`${reportsent}`)
            setTimeout(function() {
                message.channel.bulkDelete(`1`)
            } , 5000);
    }
}