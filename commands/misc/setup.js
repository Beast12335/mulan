const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up tournament access buttons')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the setup message')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply() 
    const userPermissions = interaction.member.permissions;
    if (!userPermissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
      return interaction.followUp({ content: 'You don\'t have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const th11Button = new ButtonBuilder()
      .setCustomId('th11')
      .setLabel('TH11')
      .setStyle('Success');

    const th12Button = new ButtonBuilder()
      .setCustomId('th12')
      .setLabel('TH12')
      .setStyle('Success');

    const th14Button = new ButtonBuilder()
      .setCustomId('th14')
      .setLabel('TH14')
      .setStyle('Success');

    const th15Button = new ButtonBuilder()
      .setCustomId('th15')
      .setLabel('TH15')
      .setStyle('Success');

    const mixCupButton = new ButtonBuilder()
      .setCustomId('mix_cup')
      .setLabel('Mix Cup')
      .setStyle('Success');

    const th16Button = new ButtonBuilder()
      .setCustomId('th16')
      .setLabel('TH16')
      .setStyle('Success');
    
    const row = new ActionRowBuilder()
      .addComponents(th11Button, th12Button, th14Button, th15Button, mixCupButton);

    const row2 = newActionRowBuilder()
      .addComponents(th16Button);
    const embed = new EmbedBuilder()
      .setTitle('Tournament Access Setup')
      .setDescription('React on the buttons below to access tournaments')
      .setColor('Random');

    try {
      await interaction.channel.send({ embeds: [embed], components: [row,row2] });
      await interaction.followUp({content:`Setup done`});
    } catch (error) {
      console.error(error);
      interaction.followUp({ content: 'An error occurred while sending the setup message.', ephemeral: true });
    }
  },
};
