const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require ('../../db/match.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-create')
    .setDescription('Create a match for face cam')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNickname)
    .addStringOption((option) =>
      option
        .setName('teams')
        .setDescription('Enter the team names')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply()
    try{
        let tea = interaction.options.getString('teams')
        let a = await match.create({
            teams:tea
});
        let embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('')
      .setDescription('Match sucessfully created.');
        await interaction.followUp({
            content:'',
            embeds :[embed]
        });
    }catch(e){
        let err = let embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('Error')
      .setDescription(e);
      console.log(e)
      await interaction.followUp({
          content:'',
          embeds:[err]
      });
      },
};
