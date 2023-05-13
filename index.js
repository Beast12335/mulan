const lib = require('lib')({token: process.env['ltoken']});

const { Client, Events, Collection,GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.MessageContent,

    GatewayIntentBits.GuildMessages,

  ],

});
client.commands = new Collection ();
client.on("ready", ()=>console.log("READY"));

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isAutocomplete()) {		const command = interaction.client.commands.get(interaction.commandName);

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
