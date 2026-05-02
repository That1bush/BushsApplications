const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CLIENT_ID = process.env.1500069502963028079;
const CLIENT_SECRET = process.env.YD2qw5HOwzCXLoQWsm_8Ayern0q_O6pv;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });

    const tokenData = await tokenRes.json();

    const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
            authorization: `Bearer ${tokenData.access_token}`
        }
    });

    const user = await userRes.json();

    // send back to your website
    res.redirect(`https://your-site.github.io/?user=${user.username}&id=${user.id}`);
});

app.listen(3000, () => console.log("Running"));
