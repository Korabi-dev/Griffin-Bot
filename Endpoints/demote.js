/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const discord = require("discord.js");
const noblox = require("noblox.js");
require("dotenv").config();
module.exports = {
	path: "/demote",
	type: "get",
	/**
	 *
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {discord.Client} client
	 */
	run: async (req, res, client) => {
		if (!req.headers["x-demoter"] || !req.headers["x-demotee"])
			return res.json({
				error: true,
				message: "Invalid Arguments sent to API."
			});
		let demoter = Number(req.headers["x-demoter"]);
		let demotee = Number(req.headers["x-demotee"]);
		if (process.env.roblox_admins.split(",").includes(String(demotee)))
			return res.json({
				error: true,
				message: "Action can not be performed because demotee is godmode admin."
			});
		let demoter_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			demoter
		);
		let demotee_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			demotee
		);
		if (!demoter_rank)
			return res.json({
				error: true,
				message: "Demoter not in group.",
				kick: true
			});
		if (!demotee_rank)
			return res.json({ error: true, message: "Demotee not in group" });
		if (demotee_rank >= demoter_rank)
			return res.json({
				error: true,
				message: "Demoter rank is too low to perform this action."
			});
		try {
			await noblox.demote(Number(process.env.roblox_group), demotee);
			let name =
				(await noblox.getUsernameFromId(demotee)) || `(ID: ${demotee})`;
			let d_name =
				(await noblox.getUsernameFromId(demoter)) || `(ID: ${demoter})`;
			let rank = await noblox.getRankNameInGroup(
				Number(process.env.roblox_group),
				demotee
			);
			client.log({
				embeds: [
					client.embed(
						"Demotion",
						`${d_name} demoted ${name} to rank \`${rank}\`.${
							req.headers["x-reason"]
								? `\nReason: ${req.headers["x-reason"]}`
								: ""
						}`
					)
				]
			});
			return res.json({
				error: false,
				message: `Demoted ${name} to rank ${rank}.`
			});
		} catch (e) {
			return res.json({
				error: true,
				message: `There was an unknown error on the API.
				
				${e.message}`
			});
		}
	}
};
