const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder } = require('discord.js');
const claim = require('../../db/claim.js')
const player = require('../../db/player.js')

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
          console.log(claimed)
          for(let i=0;i<claimed.length;i++){
            let sheetData = await lib.googlesheets.query['@0.3.2'].select({
              range: `Claims!A:C`,
              bounds: 'FIRST_EMPTY_ROW',
              where: [
                {
                  'Tag__is': `${claimed[i].tag}`
                }
              ],
              limit: {
                'count': 0,
                'offset': 0
              }
            });
            if (sheetData.rows.length == 0){
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
          for(let i=0;i<play.length;i++){
            let playerData = await lib.googlesheets.query['@0.3.2'].select({
              range: `Players!A:E`,
              bounds: 'FIRST_EMPTY_ROW',
              where: [
                {
                  'Tag__is': `${play[i].tag}`
                }
              ],
              limit: {
                'count': 0,
                'offset': 0
              }
            });
            if (playerData.rows.length ==0){
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
