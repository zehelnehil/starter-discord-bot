const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "helptask",
    description: "Help Commands for the Todo List ",
    async execute(interaction, client) {
      const memberID = interaction.member.user.id;

      let todoListEmbed = new MessageEmbed()
      .setColor("#FF5733")
      .setTitle("Pomofy Todo-List")
      .addFields({ name: "To Add your task <a:NOTED:857859267885531156>", value: "`/addtodo`" })
      .addFields({ name: "To Clear your Todo-list <:LemonLove:902687638367133716>", value: "`/clearlist`" })
      .addFields({ name: "To Delete your task <:PokPikachu:1011021282567012382>" , value: "`/deletetask`" })
      .addFields({ name: "To Finish your task <:LimGlass:833599756675579934>", value: "`/finishtask`" })
      .addFields({ name: "To View your Todo-List <a:typing:842473311601557564>", value: "`/viewtodos`" });
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            embeds: [todoListEmbed],
            ephemeral: false
          },
        },
      });
    },
  };
  