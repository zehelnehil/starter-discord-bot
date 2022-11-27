// Import Discord Console Logger
const { DiscordConsoleLogger } = require('discord-console-logger')

// Make a new Logger instance
const logger = new DiscordConsoleLogger({ 
// Full Discord Webhook URL with ID and Token (required)
    hookURL: 'https://discord.com/api/webhooks/1045732196528422982/udDWCzI8cPNVABRpSW0FTIMpmwaIyhiMj66g90tjfNWw9ZkelFKFbNlXo0t-Zhf9aLyH',
// Icon to Show in the embed footer (optional)
    iconURL: '', 
// Footer Text to show on the embed (optional)
    footer: '', 
// Sets if you want discord-console-logger to log to the console as well as your Discord Webhook (optional: default false)
    console: true, 
// Error Handler (optional)
    errorHandler: err => {
        console.error('[DISCORD CONSOLE LOGGER]', err); 
    }
})


module.exports = {
  name: "finishtask",
  description: "Marks a task as completed in your todo list. ",
  options: [
    {
      name: "completedtask",
      type: 3,
      description: "The task you wish to mark as completed. ",
      required: true,
    },
  ],
  async execute(interaction, client, discordTodo) {
    const memberID = interaction.member.user.id;
    const taskToEdit = interaction.data.options[0].value;
    const username = interaction.member.user.username;
    const editedTask = "~~ " + taskToEdit + "~~ ";
    const taskFound = await discordTodo
      .find({
        task: taskToEdit,
      })
      .exec();
    var editedConfirmation = "Sorry we could not find that task in your list. ";

    if (taskFound.length == 1) {
      discordTodo.updateOne(
        {
          userID: memberID,
          task: taskToEdit,
        },
        {
          task: editedTask,
        },
        (err) => {
          if (!err) {
         logger.info({ message: `${username} has attempted to finish a task === ${taskToEdit}` });
          } else {
            console.log("error");
          }
        }
      );
      editedConfirmation = taskToEdit + " has been marked as completed <:LimGlass:833599756675579934>";
    } else if (taskFound.length > 1) {
      discordTodo.updateMany(
        {
          userID: memberID,
          task: taskToEdit,
        },
        {
          task: editedTask,
        },
        (err) => {
          if (!err) {
            logger.info({ message: `${username} has attempted to finish a task === ${taskToEdit}` });
          } else {
            console.log("error");
          }
        }
      );
      editedConfirmation =
        "You had multiple '" +
        taskToEdit +
        "' entries in your todo list so we marked them all as completed.  ";
    }
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: editedConfirmation,
          ephemeral: false
        },
      },
    });
  },
};
