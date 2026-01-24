const axios = require('axios');

module.exports.config = {
  name: "profile",
  version: "1.0.0",
  role: 0,
  credits: "vern",
  description: "Get Facebook profile picture by user ID.",
  usage: ".hack <facebook_id>",
  prefix: true,
  cooldowns: 3,
  commandCategory: "Image"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prefix = "."; // Adjust if your bot uses a different prefix

  if (args.length < 1) {
    const usageMessage =
      `════『 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗩𝗔𝗧𝗔𝗥 』════\n\n` +
      `⚠️ Please provide a Facebook user ID.\n\n` +
      `📌 Usage: ${prefix}hack <facebook_id>\n` +
      `💬 Example: ${prefix}get 100000000000000\n\n` +
      `> 💀 Notorious Dev Lawkey 💀`;
    return api.sendMessage(usageMessage, threadID, messageID);
  }

  const id = args[0];
  const apiUrl = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  try {
    // Loading message
    const waitMsg = `════『 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗩𝗔𝗧𝗔𝗥 』════\n\n📤 Fetching avatar for ID: ${id}\nPlease wait...`;
    await api.sendMessage(waitMsg, threadID, messageID);

    // Download the avatar image as a stream
    const response = await axios.get(apiUrl, { responseType: "stream" });

    // Send the image as an attachment
    return api.sendMessage(
      {
        body: `Here is the Facebook avatar of ID: ${id}\n\n> Powered by Lawkey Marvelous`,
        attachment: response.data
      },
      threadID,
      messageID
    );
  } catch (error) {
    console.error('❌ Error in hack command:', error.message || error);

    const errorMessage =
      `════『 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗩𝗔𝗧𝗔𝗥 𝗘𝗥𝗥𝗢𝗥 』════\n\n` +
      `🚫 Failed to fetch the avatar.\nReason: ${error.response?.data?.error?.message || error.message || 'Unknown error'}\n\n` +
      `> Please try again later.`;

    return api.sendMessage(errorMessage, threadID, messageID);
  }
};