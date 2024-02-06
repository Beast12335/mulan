const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

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
  async execute(interaction) {
    await interaction.deferReply();
    try {
      let tag = interaction.options.getString('tag');
      const file = interaction.options.getString('filename');
      const filename = `${file}.jpg`;
      // Delete the image from S3
      await deleteFromS3(filename);
      let embed = new EmbedBuilder()
        .setTitle('Success')
        .setColor(0x13ff00)
        .setDescription(`Picture for ${tag} has been removed`);
      
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

async function deleteFromS3(filename) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 'beast-db',
    Key: filename,
  };

  await s3.deleteObject(params).promise();
}
