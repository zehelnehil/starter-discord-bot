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
  name: "deletetask",
  description: "Deletes a task from your todo list. ",
  options: [
    {
      name: "input",
      type: 3,
      description:
        "The task to delete from your todo list. (ex. Finish code) ",
      required: true,
    },
  ],
  async execute(interaction, client, discordTodo) {
    const memberID = interaction.member.user.id;
    const taskToDelete = interaction.data.options[0].value;
    const username = interaction.member.user.username;
    const taskFound = await discordTodo
      .find({
        task: taskToDelete,
      })
      .exec();
    var deletedMessage = "Sorry we could not find that task in your list. ";

    if (taskFound.length == 1) {
      discordTodo.deleteOne(
        {
          userID: memberID,
          task: taskToDelete,
        },
        (err) => {
          if (!err) {
            logger.info({ message: `${username} deleted a task === ${taskToDelete}` });
          } else {
            console.log("error");
          }
        }
      );
      deletedMessage = taskToDelete + " deleted from your todo list. ";
    } else if (taskFound.length > 1) {
      discordTodo.deleteOne(
        {
          userID: memberID,
          task: taskToDelete,
        },
        (err) => {
          if (!err) {
            logger.info({ message: `${username} deleted a task === ${taskToDelete}` });
          } else {
            console.log("error");
          }
        }
      );
      deletedMessage =
        "You had multiple '" +
        taskToDelete +
        "' entries in your todo list so we only removed the newest entry. ";
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: deletedMessage,
          flags: 64,
        },
      },
    });
  },
};
