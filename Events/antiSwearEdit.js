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
		const replace = [
			/@/g,
			/#/g,
			/%/g,
			/^/g,
			/&/g,
			/\*/g,
			/\(/g,
			/\)/g,
			/-/g,
			/_/g,
			/\+/g,
			/\+/g
		];
		let c = message.content.replace(/ /g, "").toLowerCase();
		replace.map((char) => {
			c = c.replace(char, "");
		});
		for (const word of bad_words.array) {
			if (c.includes(word.toLowerCase())) {
				await message.delete();
				console.info(
					`${message.author.tag} said: ${message.content}\n\nProfanity (${word}) found in: ${c}`
				);
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
			console.info(
				`${message.author.tag} said: ${message.content}\n\nProfanity (regexp) found in: ${c}`
			);
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
