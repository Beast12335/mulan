const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {SlashCommandBuilder,EmbedBuilder, PermissionsBitField} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-info')
    .setDescription('Shows info about a match(admin only)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('match')
        .setDescription('Choose the match')
        .setrequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    let a = await lib.mysql.db['@0.2.1'].query({
      query: `select id,teams from matches;`,
      charset: `UTF8MB4`
    });
    let match = a.result.map((u)=>{ 
      return u.teams+` (`+u.id+` )`
      })
    const focusedValue = interaction.options.getFocused();
    
    const filtered = match.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({name: choice, value: choice}))
    );
  },
  async execute(interaction) {
    if(interaction.member.roles.has('') || interaction.member.permission_names.includes('ADMINISTRATOR')){
      let b = await lib.mysql.db['@0.2.1'].query({
        query: `select * from matches;`,
        charset: `UTF8MB4`
      });
      let t = b.result
      console.log(interaction.options)
      let embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      await interaction.reply({embeds : [embed]});
    }
  },
};
