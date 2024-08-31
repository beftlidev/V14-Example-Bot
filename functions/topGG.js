const axios = require("axios");
const config = require("../config");

async function requestTopGG(method, path, body) {
    const headers = {
        "authorization": config.token.topGG
    };
    if (method !== "GET")
        headers["Content-Type"] = "application/json";
    let url = `https://top.gg/api${path}`;
    if (body && method === "GET")
        url += `?${new URLSearchParams(body)}`;
    try {
        const response = await axios({
            url,
            method,
            headers,
            data: body && method !== "GET" ? body : undefined,
        });
        let responseBody;
        if (response.headers["content-type"]?.startsWith("application/json")) {
            responseBody = response.data;
        } else {
            responseBody = response.data.toString();
        }
        return responseBody;
    } catch (error) {
        if (error.response) {
            return { error: `API Error: ${error.response.status} ${error.response.statusText}` };
        } else {
            return { error: `Request Error: ${error.message}` };
        }
    }
}

async function hasVoted(id) {
    const result = await requestTopGG("GET", "/bots/check", { userId: id })
    if (result.error) return false;
    return !!result.voted;
}

async function getVotes() {
    const result = await requestTopGG("GET", "/bots/votes");
    if (result.error) return false;
    return result;
}

async function isWeekend() {
    const result = await requestTopGG("GET", "/weekend")
    if(result.error) return false;
    return result.is_weekend;
}

async function postStats(client) {
    const result = await requestTopGG("POST", "/bots/stats", {
        server_count: client.guilds.cache.size
    })
    if(result.error) return false;
    return true;
}

module.exports = {
    hasVoted,
    getVotes,
    isWeekend,
    postStats
};