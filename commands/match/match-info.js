const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const connection = require('../../db.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-info')
    .setDescription('Shows info about a match(admin only)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('match')
        .setDescription('Choose the match')
        .setRequired(true)
       // .setAutocomplete(true)
    ),
  /*async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    const filtered = match.filter((choice) => choice.startsWith(focusedValue));
    await interaction.respond(
      filtered.map((choice) => ({name: choice, value: choice}))
    );
  }, */
  async execute(interaction) {
    try{
        await interaction.deferReply()
        connection.query(
          'SELECT * FROM matches',
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
          }
        );
        console.log(interaction)
        console.log(interaction.options);
        console.log(interaction.member);
        let embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Some title')
          .setURL('https://discord.js.org/')
          .setAuthor({
              name: 'Some name',
              iconURL: 'https://i.imgur.com/AfFp7pu.png',
              url: 'https://discord.js.org',
          })
          .setDescription('Some description here');
        await interaction.followUp({content:' ',embeds: [embed]});
  }catch(e){
      console.log(e)
  }},
};
