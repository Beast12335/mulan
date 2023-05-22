const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-claim')
    .setDescription('Removes claim from id(admin only)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Enter the player tag')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply()
    try{
    await lib.mysql.db['@0.2.1'].query({
      query: `delete from claims where tag = '${event.data.options[0].options[0].value}';`,
      charset: `UTF8MB4`
    });
    await lib.discord.interactions['@1.0.1'].followups.create({
      token: `${event.token}`,
      content: ` `,
      embeds: [
        {
          'type': `rich`,
          'title': `Sucess`,
          'description': `Player have been unclaimed successfully.`,
          'color': 0x1111ff
        }
      ]
    });
    }catch(e){
      await lib.discord.interactions['@1.0.1'].followups.create({
        token: `${event.token}`,
        content: ` `,
        embeds: [
          {
            'type': `rich`,
            'title': `Error`,
            'description': `${e.message}`,
            'color': 0xff1111
          }
        ]
      });
      }
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
  },
};
