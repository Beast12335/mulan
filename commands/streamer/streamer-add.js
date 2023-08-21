const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streamer-add')
    .setDescription('Add a streamer in db')
    .addUserOption(option =>
    option.setName('user')
      .setDescription('Choose the user')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('tags')
        .setDescription('Enter the player tags')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Enter the streamer language')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    try{
      if(!interaction.member.permissions.has('ADMINISTRATOR')){
        return await interaction.followUp({content:`You can't use this command.`});
        }
        const user = interaction.options.getUser('user')
        const tags = interaction.options.getString('tag')
        const language= interaction.options.getString('language')
        const a = await lib.googlesheets.query['@0.3.2'].insert({
          range: `A:C`,
          fieldsets: [
            {
              'Channel Name': user,
              'IG Profile': tags,
              'Language': language
            }
          ]
        });
        await interaction.followUp('Streamer Info added in the sheet.')
    }catch(e){
        console.log(e)
    }
  },
};