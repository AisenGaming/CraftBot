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
        }
        else {
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
    setInterval(() => {
        let index = Math.floor(Math.random() * (config.activities_list.length - 1) + 1);
        client.user.setActivity(config.activities_list[index]);
    }, 10000);
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
    
    // Check if user is a lurker
    if(RoleCheck.LurkerCheck(message)) {
        await message.guild.member(message.author).removeRole('553194491151122432');
    }
    
    // Check for Bot Banlist
    for (var i = 0; i < config.banlist.length; i++) {
        if (message.author.id == config.banlist[i] && message.content.startsWith(prefix)) {
            await message.reply(" I'm sorry, but I cannot be with you anymore. Our relationship is toxic, and I always end up hurt after our encounters. My creators have advised me against listening to your commands anymore. Goodbye.");
            return;
        }
    }
    
    // Check if Message contains a Discord Invite Link
    if (message.content.toLowerCase().includes("https://discord.gg/")) {
        message.delete();
        message.author.send("Invites to other servers are NOT allowed. Speak to a member of the staff if you want to link your server.")
            .then(msg => console.log(`Deleted invite code from ${msg.author.username}`))
            .catch(console.error);
    }
    
    // Check if Message is in #Rules & if keywords are hit.
    if (message.channel.id == config.RulesChannelID) {
        if (message.content.toLowerCase().includes("i accept")) {
        message.member.removeRole('467939264685146124')
            .then(console.log(`${message.author.tag} has agreed to the rules. @ ${new Date()}`))
            .catch(console.error);
            const newMemberEmbed = new Discord.RichEmbed()
                .setTitle("User Joined")
                .setColor(0xe74c3c)
                .setFooter("© Equinox Studios")
                .setThumbnail(message.author.avatarURL || "http://pixelartmaker.com/art/ccb56d90dfd4f6e.png")
                .setTimestamp(new Date())
                .addField(`${message.author.tag} Joined the Server`, `Enjoy the crafting goodness!`);
            client.channels.get(config.AnnouncementsID).send(newMemberEmbed);
        }
        message.delete()
            .then(console.log("Deleted I Accept message"));
    }
    
    // Fetch User Profile & Add 10 Exp
    // TODO: Make this stand-alone and NOT part of DL
    /*
    if (!message.content.startsWith(config.prefix)) {
        var nextExp = new Date();
        var profile = await dl.Fetch(message.author.id);
        var xpToAdd;
        // Check if 1 min has passed
        // TODO: lastexp WAS part of my modified DL, needs fixed
        if (profile.lastexp.valueOf() + 60000 < nextExp.valueOf()) {
            xpToAdd = parseInt(Math.random() * 9) + 1;
            dl.AddXp(message.author.id, xpToAdd);
            // If user xp is higher than 100 * Level, add a level
            if (profile.xp + xpToAdd >= profile.level * 100) {
                const embed = new Discord.RichEmbed()
                    .setTitle("LEVEL UP")
                    .setColor(0xe74c3c)
                    .setFooter("© Equinox Studios")
                    .setThumbnail(message.author.avatarURL)
                    .setImage("https://cdn.discordapp.com/attachments/526296470006267924/526297494733193217/rainbowdivider.gif")
                    .setTimestamp(new Date())
                    .addField(`${message.author.tag}`, `Congratulations! You've reached Level ${profile.level + 1}!`);
                await dl.AddLevel(message.author.id, 1);
                dl.SetXp(message.author.id, 1);
                message.channel.send(embed);
            }
        }
    }*/
    
    // Store Last Message Creation Date
    // TODO: Store this in the new DB seperate from DL
    //dl.SetLM(message.author.id, new Date());
    
    // Command Handler
    try { 
        // Options
        let ops = {
            ownerID: config.ownerID
        };
        // Run the command
        if (cmd == "help") {
            command(true, message, args, ops, cmd);
        }
        else {
            command(false, message, args, ops, cmd);
        }
    } catch (e) {
        console.log(e.stack);
        message.channel.send('That command does not exist or the syntax was wrong.');
    }
});

