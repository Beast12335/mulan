const client = require ('../index.js')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'mix_cup') return;

    try {
      const member = interaction.user.id
      const role = interaction.guild.roles.cache.find(x => x.id == `1140684315995418674`);
      await member.roles.add(role)
      const channel = await client.guild.channels.cache.find(x => x.id == `1140617134913900545`)
      await channel.send({content:`${interaction.user.username} wants to access Mix Cup tournaments.`});
      // Send an embed with two buttons to add or remove roles
      await interaction.followUp({ content:`You can now access the Mix Cup tournament.Someone from staff will associate with the bot soon.`, ephemeral:true});

    } catch (error) {
      console.error('Error handling mix cup button interaction:', error);
    }
  },
};
