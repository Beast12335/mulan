const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streamer-remove')
    .setDescription('Removes a streamer from sheet')
    .addUserOption(option =>
    option.setName('user')
      .setDescription('Choose the user')
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    try{
      if(!interaction.member.permissions.has('ADMINISTRATOR') || interaction.member.roles.cache.has('920927751576387674')){
        return await interaction.followUp({content:`You can't use this command.`});
        }
        const user = interaction.options.getUser('user')
        await lib.googlesheets.query['@0.3.2'].delete({
          range: `streamers!A:E`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
              'Id__is': `${user.id}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          }
        });
        await interaction.followUp('Streamer Info deleted from the sheet.')
    }catch(e){
        console.log(e)
        await interaction.followUp(e)
    }
  },
};
