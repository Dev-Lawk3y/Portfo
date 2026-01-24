const axios = require("axios");

module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ["song", "lyric"],
  description: "Fetch song lyrics by title",
  usage: "lyrics <song title>",
  credits: "Vern",
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const senderID = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!query) {
    return api.sendMessage("❌ Please enter a song title.\n\nExample: lyrics you're never over by Eminem", threadID, messageID);
  }

  api.sendMessage(`🎶 Searching lyrics for: "${query}"...`, threadID, async (err, info) => {
    if (err) return;

    try {
      const apikey = "4fe7e522-70b7-420b-a746-d7a23db49ee5";
      const res = await axios.get(`https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(query)}&apikey=${apikey}`);
      const { title, lyrics } = res.data;

      const userName = await getUserName(api, senderID);
      const timePH = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });

      const message = `🎵 𝗟𝗬𝗥𝗜𝗖𝗦 𝗙𝗢𝗨𝗡𝗗\n━━━━━━━━━━━━━━━━━━\n📌 𝗧𝗶𝘁𝗹𝗲: ${title}\n\n📃${lyrics.trim().substring(0, 5000)}\n━━━━━━━━━━━━━━━━━━\n🗣 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${userName}\n🕒 ${timePH}`;

      api.editMessage(message, info.messageID);
    } catch (err) {
      console.error("[lyrics.js] Error:", err);
      const msg = err.response?.data?.message || err.message || "Unknown error occurred.";
      api.editMessage(`❌ Failed to fetch lyrics:\n${msg}`, info.messageID);
    }
  });
};

async function getUserName(api, userID) {
  try {
    const info = await api.getUserInfo(userID);
    return info?.[userID]?.name || "Unknown User";
  } catch {
    return "Unknown User";
  }
}