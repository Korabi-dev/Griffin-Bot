/* eslint-disable no-undef */

// Require dotenv to load .env config
require("dotenv").config();
// Variables
const noblox = require("noblox.js");
const discord = require("discord.js");
const client = new discord.Client({
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_MESSAGES,
		discord.Intents.FLAGS.GUILD_MEMBERS
	]
});
const fs = require("fs");
const mongoose = require("mongoose");
const logger = require("consola");
const express = require("express");
const app = new express();
// Globals
global.commands = client.commands = new discord.Collection();
global.error = error = logger.error;
global.info = info = logger.info;
global.warn = warn = logger.warn;
global.success = success = logger.success;
global.config = config = process.env;
global.id = id = process.env.roblox_group;
logger.wrapAll();
require("../Helpers/functions")(client);
// Init Function
async function init() {
	const currentUser = await noblox.setCookie(process.env.roblox_cookie);
	success(
		`Logged in as ${currentUser.UserName} [${currentUser.UserID}] on roblox.`
	);
	noblox.onWallPost(id).on("data", async function (data) {
		console.log(data);
		for (const part of data.body.split(/ /g)) {
			console.info(part);
			if (client.isLink(part)) {
				await noblox.deleteWallPost(Number(id), data.id);
				info("Deleted post");
			}
		}
	});

	const command_files = fs
		.readdirSync("Commands")
		.filter(
			(file) => file.endsWith(".js") && !file.toLowerCase().includes("_ignore_")
		);
	for (const file of command_files) {
		const command = require(`../Commands/${file}`);
		if (!command.name || !command.run) {
			warn(
				`Could not load command "${
					command.name ? command.name : `Commands\\${file}`
				}"`
			);
			continue;
		}
		client.commands.set(command.name, command);
		success(`Loaded Command: ${command.name}`);
	}
	const event_files = fs
		.readdirSync("Events")
		.filter(
			(file) => file.endsWith(".js") && !file.toLowerCase().includes("_ignore_")
		);
	for (const file of event_files) {
		const event = require(`../Events/${file}`);
		if (!event.name || !event.run) {
			warn(
				`Could not load event "${event.name ? event.name : `Events\\${file}`}"`
			);
			continue;
		}
		client.on(event.name, async (...args) => {
			try {
				await event.run(...args, client);
			} catch (e) {
				console.warn(
					`Event "${event.name}" Had an error:\n${require("util").inspect(e, {
						depth: 2
					})}`
				);
			}
		});
		success(`Loaded Event: ${event.name}`);
	}
	const endpoint_files = fs
		.readdirSync("Endpoints")
		.filter(
			(file) => file.endsWith(".js") && !file.toLowerCase().includes("_ignore_")
		);
	for (const file of endpoint_files) {
		const endpoint = require(`../Endpoints/${file}`);
		if (!endpoint.path || !endpoint.type || !endpoint.run) {
			warn(
				`Could not load event "${
					endpoint.name ? endpoint.name : `Endpoints\\${file}`
				}"`
			);
			continue;
		}
		app[endpoint.type](endpoint.path, async (req, res) => {
			try {
				await endpoint.run(req, res, client);
			} catch (e) {
				console.warn(
					`Endpoint "${endpoint.path}" Had an error:\n${require("util").inspect(
						e,
						{
							depth: 2
						}
					)}`
				);
			}
		});
		success(`Loaded Endpoint: ${endpoint.path}`);
	}
	client.admins = process.env.discord_admins.split(",");
	client.login(process.env.discord_token);
	app.listen(process.env.PORT);
	success(`Webserver listening on port: ${process.env.PORT}`);
	// eslint-disable-next-line no-unused-vars
	mongoose.connect(process.env.mongo).then((_) => {
		success("Database Connected.");
	});
	//console.info(await noblox.getWall(Number(process.env.roblox_group)));
}
// Run the "init" Function
init();

// Handle errors
process.on("uncaughtException", async (err) => {
	err = require("util").inspect(err, { depth: 2 });
	error(err);
});
