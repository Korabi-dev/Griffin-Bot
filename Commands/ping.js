/* eslint-disable no-unused-vars */
const discord = require("discord.js");

module.exports = {
	name: "ping",
	admin: true,
	/**
	 *
	 * @param {discord.Client} client
	 * @param {discord.Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		return message.reply({
			embeds: [
				client.embed(
					"Pong! 🏓",
					`Client's WebSocket latency is \`${Math.floor(client.ws.ping)}ms\` 🏓`
				)
			]
		});
	}
};
