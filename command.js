const { SlashCommandBuilder } = require('discord.js');
module.exports = {
     data : new SlashCommandBuilder()
	.setName('match')
	.setDescription('Match Related commands')
        .addSubcommand(subcommand =>

		subcommand

			.setName('info')

			.setDescription('Info about a match)

			.addStringOption(option => option.setName('id').setDescription('Match Id').setAutocomplete(true)))
		       async autocomplete(interaction) {

		const focusedValue = interaction.options.getFocused();

		const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];

		const filtered = choices.filter(choice => choice.startsWith(focusedValue));

		await interaction.respond(

			filtered.map(choice => ({ name: choice, value: choice })),

		);

	},
		

	

}
		       }
	
	
