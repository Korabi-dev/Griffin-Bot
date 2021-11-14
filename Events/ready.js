// eslint-disable-next-line no-unused-vars
const discord = require("discord.js");
module.exports = {
	name: "ready",
	/**
	 *
	 * @param {discord.Client} client
	 */
	run: async (client) => {
		global.info(`Logged in as ${client.user.tag} on discord.`);
	}
};
