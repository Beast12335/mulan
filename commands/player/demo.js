const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const player = require('../../db/player.js');
const claim = require('../../db/claim.js');
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('demo')
    .setDescription('Add a player image')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Choose the player')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription('Upload the player picture')
        .setRequired(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let t = await claim.find({ user: interaction.user.id });
    const choices = t.map((u) => {
      return u.tag;
    });
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction) {
    await interaction.deferReply();
    try {
      let tag = interaction.options.getString('tag');
      let img = interaction.options.getAttachment('image').url;

      const s3 = new AWS.S3();
      const imageBuffer = Buffer.from(
        img.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );

      // Save the image locally
      const localImagePath = 'temp-image.jpg';
      fs.writeFileSync(localImagePath, imageBuffer);

      const params = {
        Bucket: 'beast-db',
        Key: `${tag}.jpg`,
        Body: fs.createReadStream(localImagePath),
        ContentType: 'image/jpeg',
      };

      // Upload the image to S3
      const uploadResult = await s3.upload(params).promise();

      console.log(`Image uploaded successfully. URL: ${uploadResult.Location}`);

      // Delete the local image file
      fs.unlinkSync(localImagePath);

      // ... rest of your code ...
    } catch (e) {
      // Handle errors appropriately
      console.error(e);
    }
  },
};
