const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient, PermissionsBitField } = require("discord.js")

const { createCanvas, GlobalFonts, loadImage, Canvas } = require("@napi-rs/canvas");
GlobalFonts.registerFromPath("./assets/fonts/bold-font.ttf", 'Manrope');
const font = "Manrope";

const jimp = require("jimp");
const circle = require("@jimp/plugin-circle");
const configure = require("@jimp/custom");

configure({ plugins: [circle] }, jimp);

async function circleImage(image) {
    try {
        image = await jimp.read(image);
        image.circle();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    } catch (e) {
        return "./assets/unknown.png";
    }
}

module.exports = {
    circleImage
} 