/* eslint-disable no-unused-vars */
const express = require("express");
const discord = require("discord.js");
module.exports = {
	path: "/",
	type: "get",
	/**
	 *
	 * @param {express.Request} req
	 * @param {express.Response} res
	 * @param {discord.Client} client
	 */
	run: async (req, res, client) => {
		res.send(`Hi there! My name is ${client.user.username}`);
	}
};
