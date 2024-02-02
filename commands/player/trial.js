const {
  SlashCommandBuilder,
  EmbedBuilder, AttachmentBuilder
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
const claim = require('../../db/claim.js')
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trial')
    .setDescription('Add a player image'),

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
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'beast-db',
        Key: 'ankit.jpg', // Replace with the actual key of your image
      };
      const s3Object = await s3.getObject(params).promise();
      
      let file = new AttachmentBuilder(s3Object.Body,{name:'trial.jpg'})
      await interaction.channel.send({files:[file]})
      let embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('Sucess')
        .setDescription('Player picture saved successfully.');
      
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
