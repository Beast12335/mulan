const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streamer-add')
    .setDescription('Add a streamer in db')
    .addStringOption(option =>
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
    try{
        await interaction.deferReply()
        const user = interaction.options.getString('user')
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
        console.log(a)
        await interaction.followUp('Pong')
    }catch(e){
        console.log(e)
    }
  },
};
