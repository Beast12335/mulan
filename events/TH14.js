module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'th14') return;
    await interaction.deferReply({ephemeral:true})

    try {
      const client = interaction.client;
      const member = interaction.member
      const role = interaction.guild.roles.cache.find(x => x.id == `1140684597852647444`);
      const channel = await client.channels.fetch(`1140617134913900545`)
      if (!member.roles.cache.some(x => x.id == `1140684597852647444`)){
        await member.roles.add(role)
        await channel.send({content:`${interaction.user.username} wants to access TH14 tournaments.`});
        await interaction.followUp({ content:`You can now access the TH14 tournament.Someone from staff will associate with the bot soon.`, ephemeral:true});
      }
      else{
        await member.roles.remove(role)
        await channel.send({content:`${interaction.user.username} removed TH11 Access.`});
        await interaction.followUp({content:`Removed TH14 access from you.`, ephemeral:true});
      }} catch (error) {
      console.error('Error handling th14 button interaction:', error);
    }
  },
};
