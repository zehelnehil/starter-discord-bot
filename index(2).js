// .env
require("dotenv").config();

/*--------------- MongoDB ---------------*/
const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose.connect("mongodb+srv://zehelnehil:23439919@cluster0.0y4uves.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("DB Connected");
});

const todoSchema = new mongoose.Schema({
  userID: String,
  task: String,
});

const discordTodo = mongoose.model("discordTodos", todoSchema);

/*--------------- Express ---------------*/
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

/*--------------- Discord ---------------*/
const Discord = require("discord.js");
const { Collection } = require("discord.js");
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
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const client = new Discord.Client();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const commands = client.commands.map(({ execute, ...data }) => data);
const rest = new REST({ version: "9" }).setToken("OTkwMzUwNDYwMjY1MzE2NDQy.G3iUBK.GVYUknz2YcAuQTJCqjD5r4okxLwxbgn0D0YaKs");

(async () => {
  try {
    console.log("Started refreshing application (/) commands");

    await rest.put(
      Routes.applicationCommands(
       "990350460265316442"
      ),
      {
        body: commands,
      }
    );

    console.log("Sucessfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  client.user.setActivity(`/taskhelp in ${client.guilds.cache.size} servers`)
  .then(presence => logger.info({ message:`Activity set to ${presence.activities[0].name}`}))

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const command = interaction.data.name.toLowerCase();
    if (!client.commands.has(command)) return;
    try {
      await client.commands
        .get(command)
        .execute(interaction, client, discordTodo);
    } catch (error) {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "There was an error with your request. " + error,
            flags: 64,
          },
        },
      });
    }
  });
});

client.login("OTkwMzUwNDYwMjY1MzE2NDQy.G3iUBK.GVYUknz2YcAuQTJCqjD5r4okxLwxbgn0D0YaKs");
