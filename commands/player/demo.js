const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
const claim = require('../../db/claim.js')
const AWS = require('aws-sdk');
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
    let t = await claim.find({user: interaction.user.id})
    const choices = t.map((u)=>{
      return u.tag })
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
      let img = interaction.options.getAttachment('image').url
      
      const s3 = new AWS.S3();
      const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const params = {
        Bucket: 'beast-db',
        Key: `${tag}.jpg`,
        Body: imageBuffer,
        ContentType: 'image/jpg',
        //ACL: 'public-read',
      };
      console.log(img)
      console.log('\n')
      console.log(imageBuffer)
      s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          // Handle error response to the user
        } else {
          console.log(`Image uploaded successfully. URL: ${data.Location}`);
          // Save data.Location (S3 URL) in your MongoDB for future retrieval
        }
      });
      
      let embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('Sucess')
        .setDescription('Player picture saved successfully.');
      const channel = interaction.client.channels.cache.get('1174574152947081277')
      await channel.send({
        content:`${tag} \n Added by: ${interaction.user.id} \n Image: `,
        });
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    } catch (e) {
      let err = new EmbedBuilder()
        .setColor(0xffff11)
        .setTitle('Error')
        .setDescription(e.message);
      console.log(e);
      await interaction.followUp({
        content: '',
        embeds: [err],
      });
    }
  },
}
