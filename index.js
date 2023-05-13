const lib = require('lib')({token: process.env['ltoken']});
//const Discord = require("discord.js");
//const client = new Discord.Client();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const config = require("./config.json");

client.on("ready", ()=>console.log("READY"));





client.login(process.env['TOKEN']);

