const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Match related commands')
    .addSubcommand(subcommand =>
    subcommand
      .setName('info')
      .setDescription('Info about the match')
      .Autocomplete(true)),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })),
    );
  },
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
