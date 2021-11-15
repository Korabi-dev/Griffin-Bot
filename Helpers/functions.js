/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const discord = require("discord.js");
const noblox = require("noblox.js");
module.exports = (client) => {
	global.isLink =
		client.isLink =
		isLink =
			function (string) {
				let url;
				try {
					url = new URL(string);
				} catch (_) {
					return false;
				}
				return url.protocol === "http:" || url.protocol === "https:";
			};
	/**
	 * @param {discord.GuildMember} member
	 */
	global.getRank =
		client.getRank =
		getRank =
			function (member) {
				let rank = 0;
				function setrank(r) {
					if (r > rank) {
						rank = r;
						return rank;
					} else {
						return;
					}
				}
				member.roles.cache.map((role) => {
					if (role.id === "822134086230999110") setrank(255);
					if (role.id === "849018921210347530") setrank(255);
					if (role.id === "848140936889892871") setrank(244);
					if (role.id === "904988996868898857") setrank(253);
					if (role.id === "848140848104996875") setrank(24);
					if (role.id === "847206663567835156") setrank(22);
					if (role.id === "847206650808107018") setrank(21);
					if (role.id === "848655956761378816") setrank(20);
					if (role.id === "811634383618310174") setrank(18);
					if (role.id === "811634384133554199") setrank(17);
					if (role.id === "811634385358290945") setrank(16);
					if (role.id === "811634386293489697") setrank(15);
					if (role.id === "811634386839273543") setrank(14);
					if (role.id === "811634387665813545") setrank(13);
					if (role.id === "848142355646644265") setrank(12);
					if (role.id === "811634389989589002") setrank(11);
					if (role.id === "811634390890971217") setrank(10);
					if (role.id === "863176837781913600") setrank(9);
					if (role.id === "863176765291626536") setrank(8);
					if (role.id === "863174572827082752") setrank(7);
					if (role.id === "863174462374936666") setrank(6);
					if (role.id === "863359050577608726") setrank(5);
					if (role.id === "863359050577608726") setrank(4);
					if (role.id === "811634397761372202") setrank(3);
					if (role.id === "863357313121386496") setrank(2);
					if (role.id === "811634399790891019") setrank(1);
				});
				return rank;
			};
	global.err =
		client.err =
		err =
			function (Title, Description, Footer) {
				const embed = new discord.MessageEmbed().setColor("RED");
				embed.setTitle(String(Title || "Oops!"));
				if (Description) embed.setDescription(String(Description));
				if (Footer) embed.setFooter(String(Footer));
				return embed;
			};
	global.succ =
		client.succ =
		succ =
			function (Title, Description, Footer) {
				const embed = new discord.MessageEmbed().setColor("GREEN");
				embed.setTitle(String(Title || "Yay!"));
				if (Description) embed.setDescription(String(Description));
				if (Footer) embed.setFooter(String(Footer));
				return embed;
			};
	global.embed =
		client.embed =
		embed =
			function (Title, Description, Footer) {
				const embed = new discord.MessageEmbed().setColor(
					process.env.embed_maincolor
				);
				if (Title) embed.setTitle(String(Title));
				if (Description) embed.setDescription(String(Description));
				if (Footer) embed.setFooter(String(Footer));
				return embed;
			};
	global.log =
		client.log =
		log =
			async function (options = { content: "Hi" }) {
				return await client.channels.cache
					.get("909693611921248276")
					.send(options)
					.catch(global.error);
			};
	global.discord_demote =
		client.demote =
		discord_demote =
			async function (demoter, demotee, reason = "Unspecified.") {
				if (!demoter || !demotee) throw new SyntaxError("Wrong args.");
				let user = await noblox.getIdFromUsername(demotee).catch(error);
				if (!user)
					user = await noblox.getUsernameFromId(Number(demotee)).catch(error);
				if (!user) return { error: true, message: "Demotee invalid." };
				if (typeof user === "string")
					user = await noblox.getIdFromUsername(user).catch(error);
				if (!user)
					return {
						error: true,
						message: "Demotee invalid. (Could not fetch ID via username)"
					};
				const demoter_rank = getRank(demoter);
				const demotee_rank = await noblox.getRankInGroup(
					Number(process.env.roblox_group),
					user
				);
				if (!demoter_rank)
					return { error: true, message: "Could not fetch demoter rank." };
				if (!demotee_rank)
					return { error: true, message: "Could not fetch demotee rank." };
				if (demoter_rank <= demotee_rank)
					return { error: true, message: "Demoter rank too low." };
				if (process.env.roblox_admins.split(",").includes(user))
					return {
						error: true,
						message:
							"the demotee can't be demoted because the demotee has godmode admin."
					};
				try {
					await noblox.demote(Number(process.env.roblox_group), user);
					await log({
						embeds: [
							embed(
								"Demotion",
								`${demoter.user.tag} (\`${demoter.user.id}\`) has demoted user \`${demotee}\` (\`${user}\`)\n\nReason: ${reason}.`,
								":("
							)
						]
					});
					return { error: false, message: "Demotion Success." };
				} catch (e) {
					return { error: true, message: e };
				}
			};
	global.discord_promote =
		client.promote =
		discord_promote =
			async function (promoter, promotee, reason = "Unspecified.") {
				if (!promoter || !promotee) throw new SyntaxError("Wrong args.");
				let user = await noblox.getIdFromUsername(promotee).catch(error);
				if (!user)
					user = await noblox.getUsernameFromId(Number(promotee)).catch(error);
				if (!user) return { error: true, message: "Promotee invalid." };
				if (typeof user === "string")
					user = await noblox.getIdFromUsername(user).catch(error);
				if (!user)
					return {
						error: true,
						message: "Promotee invalid. (Could not fetch ID via username)"
					};
				const promoter_rank = getRank(promoter);
				const promotee_rank = await noblox.getRankInGroup(
					Number(process.env.roblox_group),
					user
				);
				if (!promoter_rank)
					return { error: true, message: "Could not fetch promoter rank." };
				if (!promotee_rank)
					return { error: true, message: "Could not fetch promotee rank." };
				if (promoter_rank <= promotee_rank || promoter_rank - promotee_rank === 1)
					return { error: true, message: "promoter rank too low." };
				try {
					await noblox.promote(Number(process.env.roblox_group), user);
					await log({
						embeds: [
							embed(
								"Promotion",
								`${promoter.user.tag} (\`${promoter.user.id}\`) has promoted user \`${promotee}\` (\`${user}\`)\n\nReason: ${reason}.`,
								":("
							)
						]
					});
					return { error: false, message: "Promotion Success." };
				} catch (e) {
					return { error: true, message: e };
				}
			};
	global.success("Loaded Functions.");
};
