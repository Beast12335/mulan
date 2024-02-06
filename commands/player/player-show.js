const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-show')
    .setDescription('Shows the image of an player')
    .addStringOption((option) =>
    option
      .setName('tags')
      .setDescription('Enter the player tag')
      .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Specify the filename you want to retrieve from S3
      const tag = interaction.options.getString('tag')
      const filename = `${tag}.jpg`;

      // Retrieve the image from S3
      const imageBuffer = await retrieveFromS3(filename);

      // Send the retrieved image to the Discord channel
      await interaction.channel.send({
        content: `Here's the retrieved image:`,
        files: [new AttachmentBuilder(imageBuffer, filename)],
      });

    } catch (error) {
      console.error(error);
      await interaction.followUp('Error retrieving or sending the image.');
    }
  },
};

// Helper function to retrieve an image from AWS S3
async function retrieveFromS3(filename) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: 'beast-db',
    Key: filename,
  };

  const data = await s3.getObject(params).promise();
  return data.Body;
}
