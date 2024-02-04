const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const https = require('https');
const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('storeimage')
    .setDescription('Store the uploaded image')
    .addStringOption((option) =>
    option.setName('tag')
    .setDescription('Enter the player tag')
    .setRequired(true))
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Upload the image')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const imageAttachment = interaction.options.getAttachment('image');
      const tag = interaction.options.getString('tag')
      // Fetch the image and convert it to a buffer
      const imageBuffer = await getImageBuffer(imageAttachment.url);

      // Generate a unique filename based on timestamp
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const filename = `${tag}.jpg`;

      // Save the image locally
      fs.writeFileSync(filename, imageBuffer);

      // Upload the image to S3
      await uploadToS3(filename);

      // Respond with a confirmation message and the saved image
      await interaction.followUp({
        content: `Player picture saved.`, // Adjust the message as needed
      });

      // Optionally, you can perform additional actions with the saved image.

      // Delete the local file after responding (optional)
      fs.unlinkSync(filename);
    } catch (error) {
      console.error(error);
      await interaction.followUp('Error storing the image.');
    }
  },
};

// Helper function to fetch an image and convert it to a buffer
async function getImageBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = [];

      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('end', () => {
        resolve(Buffer.concat(data));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

// Helper function to upload the image to AWS S3
async function uploadToS3(filename) {
  const s3 = new AWS.S3();
  const fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: 'beast-db',
    Key: filename,
    Body: fileContent,
  };

  await s3.upload(params).promise();
}
