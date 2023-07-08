const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-rmpicture')
    .setDescription('Deletes a player picture')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Enter the player tag')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const c = await player.find();
    const choices = c.map((t) => {
      return t.tag
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
      let tag = interaction.options.getString('tag')
      await player.deleteOne({tag:tag})
      let embed = new EmbedBuilder()
      .setTitle('Sucess')
      .setColor(0x13ff00)
      .setDescription(`Picture for ${tag} have been removed`);
      
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    } catch (e) {
      let embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xffff11)
        .setDescription(e.message);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
