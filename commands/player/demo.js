const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('storeimage')
    .setDescription('Store the uploaded image'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const imageAttachment = interaction.options.getAttachment('image');
      const imageBuffer = await imageAttachment.read();

      // Generate a unique filename based on timestamp
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const filename = `uploaded_image_${timestamp}.jpg`;

      // Save the image locally
      fs.writeFileSync(filename, imageBuffer);

      // Respond with a confirmation message and the saved image
      await interaction.followUp({
        content: `Image stored as \`${filename}\`.`,
        files: [new AttachmentBuilder(filename)],
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
