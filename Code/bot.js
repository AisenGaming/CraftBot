const Discord = require('discord.js');
const config = require('./config.json');
var commandFile = null;
const client = new Discord.Client(); // Use the Discord.js package to setup a client.

// Constant Variables
const prefix = config.prefix;

// Functions
function command(help, message, args, ops, cmd) {
    try {
        if (help == true) {
            commandFile = require(`./commands/${args[0]}.js`);
            commandFile.help(client, message, args, ops);
            console.log(message.author.tag + " used help command for: " + args[0]);
        } else {
            commandFile = require(`./commands/${cmd}.js`);
            commandFile.run(client, message, args, ops);
            console.log(message.author.tag + " used command: " + cmd + " with subcommand: " + args.join(' '));
        }
    } catch (e) {
        console.error(`Error while processing command: ${args}`);
        console.error(e);
    }
    message.delete({timout:1000});
}

// Ready Event -- Runs whenever the bot is launched.
client.on('ready', () => {
    console.log('Launched!');
    if (config.botPlaying == true) {
        setInterval(() => {
            const index = Math.floor(Math.random() * (config.activities_list.length - 1) + 1);
            client.user.setActivity(config.activities_list[index]);
        }, config.botPlayingInterval);
    }
});

// Listener Events
// This event will run whenever there's a new message that the Bot can read.
client.on('message', async message => {
    
    // Variables
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) return;
    
    // Check if message comes from a bot and ignore if true
    if (message.author.bot) return;
    
    // Check if Message contains a Discord Invite Link
    if (config.allowInviteLinks == false) {
        if (message.content.toLowerCase().includes("https://discord.gg/")) {
            message.delete();
            message.author.send(config.inviteLinkWarning)
                .then(msg => console.log(`Deleted invite code from ${msg.author.username}`))
                .catch(console.error);
        }
    }
    
    // Check if Message is in #Rules & if keywords are hit.
    if (config.GatewayEnabled == true) {
        if (message.channel.id == config.GatewayChannelID) {
            if (message.content.toLowerCase().includes(config.GatewayCodeword)) {
                message.member.removeRole(config.GatewayRoleID)
                    .then(console.log(`${message.author.tag} has agreed to the rules. @ ${new Date()}`))
                    .catch(console.error);
                const newMemberEmbed = new Discord.RichEmbed()
                    .setTitle("User Joined")
                    .setColor(0xe74c3c)
                    .setFooter("© Equinox Studios")
                    .setThumbnail(message.author.avatarURL || "http://pixelartmaker.com/art/ccb56d90dfd4f6e.png")
                    .setTimestamp(new Date())
                    .addField(`${message.author.tag} Joined the Server`, `${config.JoinMessage}`);
                client.channels.get(config.AnnouncementsID).send(newMemberEmbed);
                message.delete()
                    .then(console.log("Deleted I Accept message"));
            }
            message.delete()
                .then(console.log("Deleted unrelated message in Gateway Channel")
        }
    }
    
    // Command Handler
    try { 
        // Options
        let ops = {
            ownerID: config.ownerID
        };
        // Run the command
        if (cmd == "help") {
            command(true, message, args, ops, cmd);
        } else {
            command(false, message, args, ops, cmd);
        }
    } catch (e) {
        console.log(e.stack);
        message.channel.send('That command does not exist or the syntax was wrong.');
    }
});

// New Member Alert
client.on('guildMemberAdd', member => {
    // Update Voice Channels with Server Stats if Config for it is enabled
    if (config.newMemberAlert == true) {
        client.channels.get(config.MemberCountID).setName(`Member Count: ${member.guild.memberCount}`)
            .then(console.log(`Updated Member Count on Server to ${member.guild.memberCount}`));
        if (config.GatewaySystem == true) {
            member.addRole(config.GatewayRoleID)
                .then(console.log(`${member.user.tag}. Joined the server, yet to accept rules`))
                .catch(console.error);
        }
    }
});

// Leaving Member Message
client.on('guildMemberRemove', member => {
    // Update Voice Channels with Server Stats
    if (config.memberLeavingAlert == true) {
        client.channels.get(config.MemberCountID).setName(`Member Count: ${member.guild.memberCount}`)
            .then(console.log(`Updated Member Count on Server to ${member.guild.memberCount}`));
        const oldMemberEmbed = new Discord.RichEmbed()
            .setTitle("User Left")
            .setColor(0xe74c3c)
            .setFooter("© Equinox Studios")
            .setThumbnail(member.avatarURL)
            .setTimestamp(new Date())
            .addField(`${member.user.tag} Left the Server`, `${config.MemberLeavingMessage}`);
        client.channels.get(config.AnnouncementsID).send(oldMemberEmbed);
    }
});
