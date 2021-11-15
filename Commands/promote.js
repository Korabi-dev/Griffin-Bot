/* eslint-disable no-unused-vars */
const discord = require("discord.js");

module.exports = {
	name: "promote",
	/**
	 *
	 * @param {discord.Client} client
	 * @param {discord.Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const res = await client.promote(message.member, args[0], args.slice(1) || false);
		if (res.error === true) {
			return message.reply({ embeds: [client.err("Oops!", res.message)] });
		} else {
			return message.reply({ embeds: [client.succ("Yay!", res.message)] });
		}
	}
};
