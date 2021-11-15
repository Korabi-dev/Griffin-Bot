/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const discord = require("discord.js");
const noblox = require("noblox.js");
require("dotenv").config();
module.exports = {
	path: "/promote",
	type: "get",
	/**
	 *
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {discord.Client} client
	 */
	run: async (req, res, client) => {
		if (!req.headers["x-promoter"] || !req.headers["x-promotee"])
			return res.json({
				error: true,
				message: "Invalid Arguments sent to API."
			});
		let promoter = Number(req.headers["x-promoter"]);
		let promotee = Number(req.headers["x-promotee"]);
		let promoter_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			promoter
		);
		let promotee_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			promotee
		);
		if (!promoter_rank)
			return res.json({
				error: true,
				message: "Promoter not in group.",
				kick: true
			});
		if (!promotee_rank)
			return res.json({ error: true, message: "Promotee not in group" });
		if (promotee_rank >= promoter_rank || promoter_rank - promoter_rank === 1)
			return res.json({
				error: true,
				message: "Promoter rank is too low to perform this action."
			});
		try {
			await noblox.promote(Number(process.env.roblox_group), promotee);
			let name =
				(await noblox.getUsernameFromId(promotee)) || `(ID: ${promotee})`;
			let d_name =
				(await noblox.getUsernameFromId(promoter)) || `(ID: ${promoter})`;
			let rank = await noblox.getRankNameInGroup(
				Number(process.env.roblox_group),
				promotee
			);
			client.log({
				embeds: [
					client.embed(
						"Promotion",
						`${d_name} promoted ${name} to rank \`${rank}\`.${
							req.headers["x-reason"]
								? `\nReason: ${req.headers["x-reason"]}`
								: ""
						}`
					)
				]
			});
			return res.json({
				error: false,
				message: `Promoted ${name} to rank ${rank}.`
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
