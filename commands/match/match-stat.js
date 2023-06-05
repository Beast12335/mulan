const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require ('../../db/match.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-stats')
    .setDescription('Enter info for a face cam match')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNickname)
    .addStringOption((option) =>
      option
        .setName('teams')
        .setDescription('Enter the team names')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('tags')
        .setDescription('Enter the tags of all playing members')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('dc')
        .setDescription('Enter the dc id  of all playing members')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('image1')
        .setDescription('Enter the image for team1')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('image2')
        .setDescription('Enter the image for team2')
        .setRequired(true)
    ),
   async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const c = await match.find();
		const choices = c.map((t)=>{
		    return teams
		})
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
