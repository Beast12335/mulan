const lib = require('lib')({token: process.env['Ltoken']});
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const {Client, Collection, Events, GatewayIntentBits} = require('discord.js');
//const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

const dotenv = require('dotenv');

// Read the contents of the .env file
const envFile = fs.readFileSync('.env');

// Parse the contents into an object
const envConfig = dotenv.parse(envFile);

// Load the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const { REST, Routes } = require('discord.js');

const clientId  = process.env['ID']

//const fs = require('node:fs');

//const path = require('node:path');

const token = process.env['TOKEN']

const commands = [];

// Grab all the command folders from the commands directory you created earlier

const folderPath = path.join(__dirname, 'commands');

const commandFolder = fs.readdirSync(folderPath);

for (const folder of commandFolder) {

	// Grab all the command files from the commands directory you created earlier

	const commandPath = path.join(folderPath, folder);

	const commandFile = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment

	for (const file of commandFile) {

		const filePath = path.join(commandPath, file);

		const command1 = require(filePath);

		if ('data' in command1 && 'execute' in command1) {

			commands.push(command1.data.toJSON());

		} else {

			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

		}

	}

}

// Construct and prepare an instance of the REST module

const rest = new REST().setToken(token);

// and deploy your commands!

(async () => {

	try {

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set

		const data = await rest.put(

			Routes.applicationCommands(clientId),

			{ body: commands },

		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);

	} catch (error) {

		// And of course, make sure you catch and log any errors!

		console.error(error);

	}

})();
client.once(Events.ClientReady, () => {
  console.log('Ready!');
});
mongoose
    .connect(process.env.mongo)
    .then(() => {
      console.log("Successfully connected to the MongoDB Database");
    })
    .catch((err) => {
      console.log(err);
      console.log("Failed to connect to the MongoDB Database");
    });

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
	  let command = client.commands.get(interaction.commandName)
	  await command.execute(interaction)
	  }
  else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
});

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const eventHandler = require(`./events/${file}`);
  client.on(eventHandler.name, (...args) => eventHandler.execute(...args));
}
client.login(process.env['TOKEN']);
module.exports = client;
