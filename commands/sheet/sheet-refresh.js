const lib = require('lib')({token: process.env.Ltoken});
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const claim = require('../../db/claim.js')
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: 'ap-southeast-1', // replace with your AWS region
});
const s3 = new AWS.S3();
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
      if(!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTARTOR)){
        return await interaction.followUp({content:`You can't use this command.`});
        }
        const type = interaction.options.getString('sheet')
        if (type == 'Claims'){
          const claimed = await claim.find({})
         // console.log(claimed)
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
          try {
                const files = await listObjects('beast-db'); // Replace 'beast-db' with your bucket name
                const embed = new EmbedBuilder()
                  .setTitle('Files in the Bucket')
                  .setColor('#FFD700') // Adjust color as needed
                  .setThumbnail(interaction.guild.iconURL());
          
                if (files.length === 0) {
                  embed.setDescription('No files found in the bucket.');
                } else {
                  files.forEach((file) => {
                    embed.addField(file.filename, file.link);
                  });
                }
          
                await interaction.followUp({ embeds: [embed] });
              } catch (error) {
                console.error('Error:', error);
                await interaction.followUp('An error occurred while listing files.');
              }
          };
          
          async function listObjects(bucketName) {
            try {
              const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
              const files = data.Contents.map((object) => ({
                filename: object.Key,
                link: `https://${bucketName}.s3.amazonaws.com/${object.Key}`,
              }));
              return files;
            } catch (error) {
              console.error('Error listing objects:', error);
              throw error;
            }
          }
          /*for(let i=0;i<play.length;i++){
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
                    'Added By':`${play[i].added}`
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
    }*/
  },
};
