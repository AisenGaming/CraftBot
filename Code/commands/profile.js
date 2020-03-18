const db = require('../craftdb.js');
const Discord = require('discord.js');

exports.run = async (client, message, args, ops) => {
    if (args[0] == null) return help(client, message, args, ops);
    var user = message.mentions.users.first() || message.author;
    switch (args[0].toLowerCase()) {
        case 'check': return check(user, message);
        case 'setexp': return setexp(user, message, args);
        case 'reset': return reset(user, message);
        case 'commend': return commend(user, message);
        case 'setinfo': return setinfo(message, args);
        default: return help(client, message, args, ops);
    }
};

async function check(user, message) {
    var output = await db.fetch(user.id);
    const RoleOutput = filterRoles(message.guild.member(user.id).roles).join(' | ');
        const embed = new Discord.MessageEmbed()
          .setTitle("Profile")
          .setColor(0xe74c3c)
          .setFooter("© Equinox Studios")
          .setThumbnail(user.displayAvatarURL())
          .setTimestamp(new Date())
          .addField(`Name`, `${user.tag}`, true)
          .addField(`Level`, `${output.level}`, true)
          .addField(`Exp`, `${output.xp}`, true)
          .addField(`Commendations`, `:star: ${output.commendations}`, true)
          .addField(`Info`, `${output.info}`)
          .addField('Roles:', RoleOutput || "None", true);
    message.reply(embed);
}
async function setexp(user, message, args) {
    var exp = parseInt(args[1]);
    db.setXP(user.id, exp);
}
async function reset(user, message) {
    db.initUser(user.id);
    console.log(`Reset ${user.tag}'s profile`);
}
async function commend(user, message) {
    var profile = await db.fetch(message.author.id);
    var currentTime = new Date();
    if (user.id == message.author.id) return message.reply("You cannot commend yourself!");
    if (Date.parse(profile.lastcommend) + 79200000 < currentTime.valueOf()) {
        db.addComm(user.id);
        db.lastComm(message.author.id);
        console.log(message.author.tag + " commended " + user.tag + " @ " + new Date());
        message.channel.send(message.author.tag + " has succcessfully given a commendation to " + user.tag);
    }
    else {
        var TimerOutput;
        var commendtimer = (86400000 - (currentTime.valueOf() - Date.parse(profile.lastcommend))) / 60000;
        if (commendtimer > 60)
            TimerOutput = Math.round(commendtimer / 60) + " hours.";
        else
            TimerOutput = Math.round(commendtimer) + " minutes.";
        return message.reply("You can only give 1 commendation per day. Next commendation can be given in: " + TimerOutput);
    }
}
async function setinfo(message, args) {
    args.shift();
    db.updateInfo(message.author.id, args.join(' '));
}

const blacklist = [
	'@everyone'
];
function filterRoles(roles) {
	return Array.from(roles.cache.filter(role => !blacklist.includes('' + role)).values());
}

function help(client, message, args, ops) {
    const embed = new Discord.RichEmbed()
        .setTitle("Profile")
        .setColor(0xe74c3c)
        .setFooter("© Equinox Studios")
        .setTimestamp(new Date())
        .addField("Usage","\`!profile subcommand mention\`")
        .addField("Subcommands", "\`Check\`, \`Commend\`, \`SetInfo\`")
        .addField("Check","Checks your own profile or the mentioned persons profile.")
        .addField("Commend","Gives a commendation to the person mentioned. Warning: You can only give one commendation every 24 hours.")
        .addField("SetInfo","Adds the information added after the command onto your profile in the Information section.")
    message.channel.send({embed});
}

exports.help = help;
