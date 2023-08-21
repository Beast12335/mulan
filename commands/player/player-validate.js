const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const claim = require ('../../db/claim.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-validate')
    .setDescription('Check for claimed ids')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('tags')
        .setDescription('Enter the player tags')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply()
    const tagsString = interaction.options.getString('tags');
    const tagsArray = tagsString.split(/\s+/);
    try{
        const availableTags = [];
        const unavailableTags = [];
        const nonTagValues = [];
        
        for (const tag of tagsArray) {
          if (tag.startsWith('#')) {
            const tagData = await claim.findOne({ tag });
            if (tagData) {
              availableTags.push(tag);
            } else {
              unavailableTags.push(tag);
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
        
        const nonTagValuesEmbed = new EmbedBuilder()
          .setTitle('Invalid Values')
          .setDescription(nonTagValues.join('\n') || 'None')
          .setColor('#FFD700') // Yellowish color
          .setThumbnail(interaction.user.displayAvatarURL())
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          });
        
        await interaction.followUp({ embeds: [availableTagsEmbed, unavailableTagsEmbed, nonTagValuesEmbed] });
        
    }catch(e){
        let err = new EmbedBuilder()
      .setColor(0xffff11)
      .setTitle('Error')
      .setDescription(e.message);
      console.log(e)
      await interaction.followUp({
          content:'',
          embeds:[err]
      });
      }
    },
};
