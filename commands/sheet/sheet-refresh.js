const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');
const claim = require('../../claim.js')
const player = require('../../player.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sheet-refresh')
    .setDescription('Loads the db into sheet')
    .addStringOption(option =>
    option.setName('sheet')
      .setDescription('Choose the sheet type')
      .setRequired(true)
      .addChoices({
        name:`Claims`,value:`Claims`},
        {name:`Players`,value:`Players`})
        ),
  async execute(interaction) {
    await interaction.deferReply()
    try{
      if(!interaction.member.permissions.has('ADMINISTRATOR')){
        return await interaction.followUp({content:`You can't use this command.`});
        }
        const type = interaction.options.getString('sheet')
        if (type == 'Claims'){
          const claimed = await claim.find({})
          const sheetData = await lib.googlesheets.query['@0.3.2'].select({
            range: `Claims!A:C`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [{}],
            limit: {
              'count': 0,
              'offset': 0
            }
          });
          console.log(claimed)
          for(let i=0;i<claimed.length;i++){
            if (!claimed[i].tag in sheetData.rows){
              await lib.googlesheets.query['@0.3.2'].insert({
                range: `Claims!A:C`,
                fieldsets: [
                  {
                    'Tag': `${claimed[i].tag}`,
                    'Discord': `${claimed[i].user}`
                  }
                ]
              });
              }
              }
          await interaction.followUp({content:`Sheet have been refreshed successfully.`});
          }
        else if(type == 'Players'){
          const play = await player.find({})
          const playerData = await lib.googlesheets.query['@0.3.2'].select({
            range: `Players!A:C`,
            bounds: 'FIRST_EMPTY_ROW',
            where: [{}],
            limit: {
              'count': 0,
              'offset': 0
            }
          });
          for(let i=0;i<play.length;i++){
            if (!play[i].tag in playerData.rows){
              await lib.googlesheets.query['@0.3.2'].insert({
                range: `Players!A:C`,
                fieldsets: [
                  {
                    'Tag': `${play[i].tag}`,
                    'Picture':`${play[i].image}`,
                    'Added By':`${play[i].added}`,
                    'Time':`${play[i].time}`
                  }
                ]
              });
              }
              }
          await interaction.followUp('Players data have been loaded in the sheet')
        }
    }catch(e){
        console.log(e)
        await interaction.followUp({content:e})
    }
  },
};
