const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const claim = require ('../../db/claim.js')
const { createWriteStream } = require('fs');
const path = require('path')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('db-players')
    .setDescription('Get an excel sheet for player claims')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  
  async execute(interaction) {
    await interaction.deferReply()
    try{
      const x = await claim.find()
      const csvData = x.map(player => `${player.user},${player.tag}`).join('\n');
      const csvFilePath = (__dirname,'players.csv');

      const stream = createWriteStream(csvFilePath);
      stream.write('User,Tag\n');
      stream.write(csvData);
      stream.end();
      let embed = new EmbedBuilder()
      .setColor(0xffff00)
      .setTitle('Sucess')
      .setDescription('Match sucessfully created.');
        await interaction.followUp({
            content:'',
            embeds :[embed],
            files:[csvFilePath]
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
