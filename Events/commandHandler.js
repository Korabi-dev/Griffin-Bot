/* eslint-disable no-undef */
require("dotenv").config();
// eslint-disable-next-line no-unused-vars
const discord = require("discord.js");
module.exports = {
	name: "messageCreate",
	/**
	 *
	 * @param {discord.Message} message
	 * @param {discord.Client} client
	 * @returns
	 */
	run: async (message, client) => {
		if (
			message.bot ||
			!message.content
				.toLowerCase()
				.startsWith(process.env.discord_prefix.toLowerCase()) ||
			message.content.replace(/ /g, "").length ===
				process.env.discord_prefix.length ||
			!message.guild
		)
			return;
		message.author.admin = false;
		message.member.admin = false;
		if (client.admins.includes(message.author.id)) {
			message.member.admin = true;
			message.author.admin = true;
		}
		message.author.rank = client.getRank(message.member);
		message.member.rank = client.getRank(message.member);
		let [commandName, ...args] = message.content
			.slice(process.env.discord_prefix.length)
			.trim()
			.split(/ /g);
		args.all = args.join(/ /g);
		let command =
			client.commands.get(commandName.toLowerCase()) ||
			client.commands.find((c) =>
				c.aliases?.includes(commandName.toLowerCase())
			);
		if (!command)
			return message.reply({
				embeds: [
					client.err(
						"Oops!",
						`I can't find a command named \`${commandName}\`, please check the spelling :)`
					)
				]
			});
		if (command.admin && !message.author.admin)
			return message.reply({
				embeds: [
					client.err(
						"Oops!",
						`The command \`${commandName}\` is locked, and can only be used by <@${client.admins.join(
							">, <@"
						)}>. :)`
					)
				]
			});
		if (command.perms) {
			let res = { stop: false, perm: "If you see this the bot broke" };
			if (Array.isArray(command.perms)) {
				for (const perm of command.perms) {
					if (
						!message.member.permissions.has(
							perm.split(/ /g).join("_").toUpperCase().replace(/ /g, "")
						) &&
						!message.author.admin
					) {
						res.stop = true;
						res.perm = perm;
						break;
					}
				}
			} else {
				res.stop = true;
				res.perm = "Tell Korabi To fix His Fucking Bot";
			}
			if (res.stop === true) {
				return message.reply({
					embeds: [
						client.err(
							"Oops!",
							`The command \`${commandName}\` is locked, and can only be used by people with the \`${res.perm}\` permission. :)`
						)
					]
				});
			}
		}
		if (command.rank) {
			if (typeof command.rank !== "number")
				throw new SyntaxError(
					`Idiot you didnt provide a number for the rank lock in the ${command.name} command.`
				);
			if (message.author.rank < command.rank && !message.author.admin) {
				return message.reply({
					embeds: [
						client.err(
							"Oops!",
							`The command \`${commandName}\` is locked, and can only be used by people with the rank \`${String(
								command.rank
							)}\`+ :)`
						)
					]
				});
			}
		}
		if (command.roles) {
			let res = { stop: false, role: "If you see this the bot broke" };
			if (Array.isArray(command.roles)) {
				for (const roleid of command.roles) {
					const role = message.guild.roles.cache.get(roleid);
					if (!message.member.roles.has(role) && !message.author.admin) {
						res.stop = true;
						res.role = role.name;
						break;
					}
				}
			} else {
				res.stop = true;
				res.role = "Tell Korabi To fix His Fucking Bot";
			}
			if (res.stop === true) {
				return message.reply({
					embeds: [
						client.err(
							"Oops!",
							`The command \`${commandName}\` is locked, and can only be used by people with the \`${res.perm}\` role. :)`
						)
					]
				});
			}
		}
		try {
			const res = await command.run(client, message, args);
			if (!res) {
				return message.reply({
					embeds: [
						client.err(
							"Oops!",
							`The command \`${commandName}\` didn't send a response to the handler, it might be experiencing some issues, Korabi the dumbass has been notified! :)`
						)
					]
				});
			}
		} catch (e) {
			let msg = "Korabi the dev has been notified";
			message.guild.members.cache
				.get("638476135457357849")
				.send({
					embeds: [
						client.err(
							"Hey dumbass, Look here!",
							`I experienced an error. [Jump to trigger](${
								message.url
							})\nError:\n\`\`\`js\n${require("util").inspect(e, {
								depth: 2
							})}\n\`\`\`\nFuck you and your shit code lmao.`
						)
					]
				})
				.catch((e) => {
					msg = "Please notify Korabi, I could not dm him";
					return e;
				});
			return message.reply({
				embeds: [
					client.err(
						"Oops!",
						`The command \`${commandName}\` sent an error response to the handler, it might be experiencing some issues, ${msg}! :)`
					)
				]
			});
		}
	}
};
