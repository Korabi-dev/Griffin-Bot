/* eslint-disable no-unused-vars */
const discord = require("discord.js");
const bad_words = require("../badwords");
module.exports = {
	name: "messageUpdate",
	/**
	 *
	 * @param {discord.Message} message
	 * @param {discord.Client} client
	 */
	run: async (old, message, client) => {
		if (message.author.bot) return;
		const c = message.content.replace(/ /g, "").toLowerCase();
		for (const word of bad_words.array) {
			if (c.includes(word.toLowerCase())) {
				await message.delete();
				return await message.channel.send({
					embeds: [
						client.err(
							"Oops!",
							`${message.author} you said a bad word! Thats a no-no.`
						)
					]
				});
			}
		}
		if (bad_words.regex.test(c)) {
			await message.delete();
			return await message.channel.send({
				embeds: [
					client.err(
						"Oops!",
						`${message.author} you said a bad word! Thats a no-no.`
					)
				]
			});
		}
	}
};
