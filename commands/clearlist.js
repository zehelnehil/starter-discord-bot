module.exports = {
  name: "clearlist",
  description: "Clears your todo list",
  async execute(interaction, client, discordTodo) {
    const memberID = interaction.member.user.id;
    await discordTodo.deleteMany({});
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "Your todo list has been cleared. <:LemonLove:902687638367133716>  ",
          flags: 64,
        },
      },
    });
  },
};
