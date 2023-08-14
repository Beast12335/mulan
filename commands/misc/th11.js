const client = require ('../bot.js')
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'th11') return;

    try {
      const member = interaction.user.id
      const role = interaction.guild.roles.cache.find(x => x.id == `1140684315995418674`);
      await member.roles.add(role)
      // Send an embed with two buttons to add or remove roles
      await interaction.followUp({ content:`You can now access the TH11 tournament.Someone from staff will associate with the bot soon.`, ephemeral:true});

    } catch (error) {
      console.error('Error handling th11 button interaction:', error);
    }
  },
};
