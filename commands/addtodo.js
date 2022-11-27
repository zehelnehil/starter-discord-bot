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
  name: "addtodo",
  description: "Adds a task to your todo list",
  options: [
    {
      name: "input",
      type: 3,
      description: "Task to add to todo list",
      required: true,
    },
  ],
  async execute(interaction, client, discordTodo) {
    // Create the task in the database
    const username = interaction.member.user.username;
    const newTask = new discordTodo({
      userID: interaction.member.user.id,
      task: interaction.data.options[0].value,
    });

    newTask.save((err, discordTodo) => {
      if (err) return console.error(err);
         logger.info({
        message: 'Testing',
        description: discordTodo.task + " has been added to database " + username
      })
      console.log(discordTodo.task + " has been added to database " + username);
    });

    // Respond to the user on discord
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content:
          username  +
          " your task" +
             " ` " +
            interaction.data.options[0].value +
            " ` " +
            " has been added to your todo list <a:NOTED:857859267885531156>",
           ephemeral: false
        },
      },
    });
  },
};
