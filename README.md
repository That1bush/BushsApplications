<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Twiln Application Hub</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
* {
    box-sizing: border-box;
    font-family: "Segoe UI", sans-serif;
}

body {
    margin: 0;
    background: linear-gradient(135deg, #0f172a, #020617);
    color: white;
}

/* HEADER */
header {
    padding: 30px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* CONTAINER */
.container {
    max-width: 900px;
    margin: auto;
    padding: 20px;
}

/* CARDS */
.card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(255,255,255,0.08);
}

/* BUTTONS */
button {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border: none;
    padding: 10px 16px;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
}

button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* INPUTS */
textarea {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    margin-top: 6px;
    margin-bottom: 15px;
    background: rgba(0,0,0,0.4);
    color: white;
}

label {
    font-size: 14px;
    opacity: 0.8;
}

.hidden {
    display: none;
}

.status {
    font-size: 13px;
    opacity: 0.7;
}

#loginMsg {
    text-align: center;
    margin-top: 10px;
    opacity: 0.8;
}
</style>
</head>

<body>

<header>Twiln Application Hub</header>

<div class="container">

    <!-- LOGIN -->
    <div class="card">
        <h3>Login</h3>
        <button onclick="loginDiscord()">Login with Discord</button>
        <p id="loginMsg"></p>
    </div>

    <!-- APPS -->
    <div id="appList"></div>

    <!-- FORM -->
    <div class="card hidden" id="formBox">
        <h3 id="formTitle"></h3>
        <form id="form"></form>
        <button onclick="submitApp()">Submit</button>
        <button onclick="closeForm()">Back</button>
    </div>

</div>

<script>

// ================= CONFIG =================
const applications = {
    partnership: {
        name: "Partnership Application",
        webhook: "PASTE_WEBHOOK_1",
        enabled: true,
        questions: [
            "Server Name",
            "Member Count",
            "Why partner?"
        ]
    },

    staff: {
        name: "Support Staff Application",
        webhook: "PASTE_WEBHOOK_2",
        enabled: true,
        questions: [
            "Username",
            "Age",
            "Experience",
            "Why should we pick you?"
        ]
    }
};
// ==========================================

// DISCORD LOGIN
const CLIENT_ID = "YOUR_CLIENT_ID";
const REDIRECT_URI = "https://YOUR-BACKEND.onrender.com/callback";

function loginDiscord() {
    window.location.href =
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
}

// GET USER FROM URL
const params = new URLSearchParams(window.location.search);
const username = params.get("user");
const userid = params.get("id");

let loggedIn = username && userid;

if (!loggedIn) {
    document.getElementById("loginMsg").innerText =
    "You must login with Discord to apply.";
}

// LOAD APPS
function loadApps() {
    const list = document.getElementById("appList");
    list.innerHTML = "";

    for (let key in applications) {
        const app = applications[key];

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${app.name}</h3>
            <div class="status">🟢 Open</div>
            <button onclick="openForm('${key}')" ${!loggedIn ? "disabled" : ""}>
                Apply
            </button>
        `;

        list.appendChild(card);
    }
}

let currentApp = null;

// OPEN FORM
function openForm(key) {
    currentApp = applications[key];

    document.getElementById("appList").classList.add("hidden");
    document.getElementById("formBox").classList.remove("hidden");

    document.getElementById("formTitle").innerText = currentApp.name;

    const form = document.getElementById("form");
    form.innerHTML = "";

    currentApp.questions.forEach((q, i) => {
        form.innerHTML += `
            <label>${q}</label>
            <textarea id="q${i}" required></textarea>
        `;
    });
}

// CLOSE FORM
function closeForm() {
    document.getElementById("appList").classList.remove("hidden");
    document.getElementById("formBox").classList.add("hidden");
}

// SUBMIT
async function submitApp() {

    let desc = `User: ${username} (${userid})\n\n`;

    currentApp.questions.forEach((q, i) => {
        const ans = document.getElementById(`q${i}`).value;

        desc += `***${q}***\n${ans}\n\n──────────────\n`;
    });

    const embed = {
        title: currentApp.name,
        description: desc,
        color: 5814783
    };

    await fetch(currentApp.webhook, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ embeds: [embed] })
    });

    alert("Submitted!");
    location.reload();
}

loadApps();

</script>

</body>
</html>
