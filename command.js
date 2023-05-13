const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('match')
	.setDescription('Match Related commands')
        .addSubcommand(subcommand =>

		subcommand

			.setName('info')

			.setDescription('Info about a match)

			.addStringOption(option => option.setName('id').setDescription('Match Id').setAutocomplete(true)))
	
	
