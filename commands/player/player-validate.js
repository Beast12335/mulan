const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const claim = require('../../db/claim.js');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

async function checkObjectExists(filename) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 'beast-db',
    Key: filename,
  };

  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-validate')
    .setDescription('Check for claimed ids')
    .addStringOption((option) =>
      option
        .setName('tags')
        .setDescription('Enter the player tags')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const tagsString = interaction.options.getString('tags');
    const tagsArray = tagsString.split(/\s+/);
    try {
      const availableTags = [];
      const unavailableTags = [];
      const nonTagValues = [];
      const availablePlayers = [];
      const nonPlayers = [];
      for (const tag of tagsArray) {
        if (tag.startsWith('#')) {
          const tagData = await claim.findOne({ tag });
          if (tagData) {
            availableTags.push(tag);
          } else {
            unavailableTags.push(tag);
          }
          const exists = await checkObjectExists(`${tag}.jpg`);
          if (exists) {
            availablePlayers.push(tag);
          } else {
            nonPlayers.push(tag);
          }
        } else {
          nonTagValues.push(tag);
        }
      }

      const availableTagsEmbed = new EmbedBuilder()
        .setTitle('Claimed Tags')
        .setDescription(availableTags.join('\n') || 'None')
        .setColor('#FFD700') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      const unavailableTagsEmbed = new EmbedBuilder()
        .setTitle('Not Claimed Tags')
        .setDescription(unavailableTags.join('\n') || 'None')
        .setColor('#FFD700') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      const availablePlayersEmbed = new EmbedBuilder()
        .setTitle('Picture Added Players')
        .setDescription(availablePlayers.join('\n') || 'None')
        .setColor('#FFD700') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      const nonPlayersEmbed = new EmbedBuilder()
        .setTitle('Picture Not Saved')
        .setDescription(nonPlayers.join('\n') || 'None')
        .setColor('#FFD700') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      const nonTagValuesEmbed = new EmbedBuilder()
        .setTitle('Invalid Values')
        .setDescription(nonTagValues.join('\n') || 'None')
        .setColor('#FFD700') // Yellowish color
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        });

      await interaction.followUp({ embeds: [availableTagsEmbed, unavailableTagsEmbed, availablePlayersEmbed, nonPlayersEmbed] });
      await interaction.channel.send({ embeds: [nonTagValuesEmbed] });

    } catch (e) {
      let err = new EmbedBuilder()
        .setColor(0xffff11)
        .setTitle('Error')
        .setDescription(e.message);
      console.log(e);
      await interaction.followUp({
        content: '',
        embeds: [err]
      });
    }
  },
};
