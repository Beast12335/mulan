const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require ('./db/match.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-create')
    .setDescription('Create a match for face cam')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNickname)
    .addStringOption((option) =>
      option
        .setName('teams')
        .setDescription('Enter the team names sep by comma(,)')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply()
    try{
        console.log(interaction)
        let tea = interaction.options.getString('teams')
        let a = await match.Create({
            teams:tea
});
        console.log('hello')
        console.log(a)
        let b = await match.find();
        console.log(b)
    }catch(e){
      console.log(e)
      }
    let embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({
        name: 'Some name',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
        url: 'https://discord.js.org',
      })
      .setDescription('Some description here');
    await interaction.followUp({content:' ',embeds: [embed]});
  },
};
