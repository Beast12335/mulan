const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require('../../db/match.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-info')
    .setDescription('Shows info for a face cam match')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNickname)
    .addStringOption((option) =>
      option
        .setName('teams')
        .setDescription('Enter the team names')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const c = await match.find();
    const choices = c.map((t) => {
      return t.teams;
    });
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
      let team = interaction.options.getString('teams');
      let record = await match.findOne({teams:team});
      let player = record.tags
      let players = player.map((t)=>{
        return t }).join('\n')
      
      let d = record.dc
      let dc = d.map((t)=>{
        return `<@`+t+`>` }).join('\n');
      let img = record.img1
      let img2 = record.img2
      let embed = [{title:'Match Info',
          color:0x13ff00,
          description:`Match : ${team}\n Players : ${players}\n`,
          fields:[{name:`Discord Id of players`,value:dc,inline:true}]},
          {
              title:'Team 1 Match Image',
              description:' ',
              image:{
                  url:img}
          },
          {
              title:'Team 2 Match Image',
              description:' ',
              image:{
                  url:img2
          }
          }];
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    } catch (e) {
      let embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xff0000)
        .setDescription(e.message);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
