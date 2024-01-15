module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'th16') return;
    await interaction.deferReply({ephemeral:true})

    try {
      const client = interaction.client;
      const member = interaction.member
      const role = interaction.guild.roles.cache.find(x => x.id == `1196059837323300864`);
      const channel = await client.channels.fetch(`1140617134913900545`)
      if (!member.roles.cache.some(x => x.id == `1196059837323300864`)){
        await member.roles.add(role)
        await channel.send({content:`${interaction.user.username} wants to access TH16 tournaments.`});
        await interaction.followUp({ content:`You can now access the TH16 tournament.Someone from staff will associate with the bot soon.`, ephemeral:true});
      }
      else{
        await member.roles.remove(role)
        await channel.send({content:`${interaction.user.username} removed TH16 AAccess.`});
        await interaction.followUp({content:`Removed TH16 access from you.`, ephemeral:true});
      }} catch (error) {
      console.error('Error handling th16 button interaction:', error);
    }
  },
}
