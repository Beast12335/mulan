const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const claim = require ('../../db/claim.js')
const XLSX = require('xlsx')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('db-players')
    .setDescription('Get an excel sheet for player claims')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  
  async execute(interaction) {
    await interaction.deferReply()
    try{
      const data = await claim.find()//.toArray()
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Player Claim Data');
      
      // Create a buffer from the workbook
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      console.log(excelBuffer)
      let embed = new EmbedBuilder()
      .setColor(0xffff00)
      .setTitle('Sucess')
      .setDescription('Match sucessfully created.');
        await interaction.followUp({
            content:'',
            embeds :[embed],
            files:[{
              file:excelBuffer.toBuffer(),
              filename:'player_claim.xlsx'
              }]
        });
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
