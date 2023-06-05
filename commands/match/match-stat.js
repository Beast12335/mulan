const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require('../../db/match.js');
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
    const choices = c.map((t) => {
      return t.teams;
    });
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({name: choice, value: choice}))
    );
  },
  async execute(interaction) {
    await interaction.deferReply();
    try {
      let team = interaction.options.getString('teams');
      let tags = interaction.options.getString('tags');
      let dc = interaction.options.getString('dc');
      let img1 = interaction.options.getAttachment('image1');
      let img2 = interaction.options.getAttachment('image2');
      let embed = new EmbedBuilder()
        .setTitle(' ')
        .setColor(0xffff00)
        .setDescription('Match Stats added');
      await match.update(
        {teams: team},
        {$set: {tags: tags, dc: dc, img1: img1, img2: img2}}
      );
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    } catch (e) {
      let embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xffff11)
        .setDescription(e);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
