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
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('Enter the api token found in game')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const cc = await client.login({email: process.env.mail, password: process.env.password});
    console.log(cc)

    let search = interaction.options.getString('tag').toUpperCase();
    let regex = /^#[PYLQGRJCUV0289]+$/gm;
    let token = interaction.options.getString('token');
    try {
      if (regex.test(search) == true) {
        let claim = await client.verifyPlayerToken(search,token);
        if (claim == true) {
          await claim.create({
            user: interaction.user.id,
            tag: search,
          });
          let embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle('')
            .setDescription('Player sucessfully claimed.');
          await interaction.followUp({
            content: '',
            embeds: [embed],
          });
        } else {
          let embed = new EmbedBuilder()
            .setColor(0xffff11)
            .setTitle('Error')
            .setDescription('Invalid API Token.');
          await interaction.followUp({
            content: '',
            embeds: [embed],
          });
        }
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
