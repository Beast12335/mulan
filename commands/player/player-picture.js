const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
const claim = require('../../db/claim.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-picture')
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
      let tea = await player.create({tag:tag,image:img,added: interaction.user.id,time:new Date()});
      let embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('Sucess')
        .setDescription('Player picture saved successfully.');
      const channel = interaction.client.channels.cache.get('1174574152947081277')
      await channel.send({
        content:`${tag} \n Added by: ${interaction.user.id} \n Image: ${img}`,
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
};
