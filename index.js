const lib = require('lib')({token: process.env['ltoken']});
//const Discord = require("discord.js");
//const client = new Discord.Client();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const config = require("./config.json");

client.on("ready", ()=>console.log("READY"));





client.login(process.env['TOKEN']);

const lib = require('lib')({token: process.env['ltoken']});

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.MessageContent,

    GatewayIntentBits.GuildMessages,

  ],

});

client.on("ready", ()=>console.log("READY"));

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isAutocomplete()) {

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {

			console.error(`No command matching ${interaction.commandName} was found.`);

			return;

		}

		try {

			await command.autocomplete(interaction);

		} catch (error) {

			console.error(error);

		}

	}

});

client.login(process.env['TOKEN']);
