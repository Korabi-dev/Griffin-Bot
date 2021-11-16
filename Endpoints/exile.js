/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const discord = require("discord.js");
const noblox = require("noblox.js");
require("dotenv").config();
module.exports = {
	path: "/exile",
	type: "get",
	/**
	 *
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {discord.Client} client
	 */
	run: async (req, res, client) => {
		if (!req.headers["x-mod"] || !req.headers["x-target"])
			return res.json({
				error: true,
				message: "Invalid Arguments sent to API."
			});
		let mod = Number(req.headers["x-mod"]);
		let target = Number(req.headers["x-target"]);
		if (process.env.roblox_admins.split(",").includes(String(target)))
			return res.json({
				error: true,
				message: "Action can not be performed because target is godmode admin."
			});
		let mod_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			mod
		);
		let target_rank = await noblox.getRankInGroup(
			Number(process.env.roblox_group),
			target
		);
		if (!mod_rank)
			return res.json({
				error: true,
				message: "Moderator not in group.",
				kick: true
			});
		if (!target_rank)
			return res.json({ error: true, message: "Target not in group" });
		if (target_rank >= mod_rank || mod_rank - mod_rank === 1)
			return res.json({
				error: true,
				message: "Moderator rank is too low to perform this action."
			});
		try {
			await noblox.exile(Number(process.env.roblox_group), target);
			let name =
				(await noblox.getUsernameFromId(target)) || `(ID: ${target})`;
			let d_name = (await noblox.getUsernameFromId(mod)) || `(ID: ${mod})`;
			client.log({
				embeds: [
					client.embed(
						"Exiled",
						`${d_name} exiled ${name}.${
							req.headers["x-reason"]
								? `\nReason: ${req.headers["x-reason"]}`
								: ""
						}`
					)
				]
			});
			return res.json({
				error: false,
				message: `Exiled ${name}.`
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
