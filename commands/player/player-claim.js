const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const claim = require('../../db/claim.js');
const {Client} = require('clashofclans.js')
const client = new Client()

//const cc = require('../../coc.js');
  module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-claim')
    .setDescription('Claim a player')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Enter the player tag')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Choose the owner of account')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const cc = await client.login({email: process.env.email, password: process.env.password});
    let search = interaction.options.getString('tag').toUpperCase();
    let regex = /^#[PYLQGRJCUV0289]+$/gm;
    let user = interaction.options.getUser('user');
    try {
      if (regex.test(search) == true) {
        await claim.create({
            user: user.id,
            tag: search,
          });
          let embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle(' ')
            .setDescription('Player sucessfully claimed.');
          const channel = interaction.client.channels.cache.get('1174574127445712937')
          await channel.send({
            content:`${user.displayName} (${user.id}) claimed ${search}`
            });
          await interaction.followUp({
            content: '',
            embeds: [embed],
          });
      } else {
        let embed = new EmbedBuilder()
          .setColor(0xffff11)
          .setTitle('Error')
          .setDescription('Invalid Player tag');
        await interaction.followUp({
          content: '',
          embeds: [embed],
        });
      }
    } catch (e) {
      console.log(e);
      let embed = new EmbedBuilder()
        .setColor(0xffff11)
        .setTitle('Error')
        .setDescription(e.message);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
