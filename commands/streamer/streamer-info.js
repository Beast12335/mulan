const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streamer-info')
    .setDescription('Shows info about a streamer from sheet')
    .addUserOption(option =>
    option.setName('user')
      .setDescription('Choose the user')
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    try{
      if(!interaction.member.permissions.has('ADMINISTRATOR') || interaction.member.roles.include('920927751576387674')){
        return await interaction.followUp({content:`You can't use this command.`});
        }
        const user = interaction.options.getUser('user')
        await lib.googlesheets.query['@0.3.2'].select({
          range: `A:E`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
              'User Id__is': `${user}`
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
        await interaction.followUp(e);
    }
  },
};
