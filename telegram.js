import axios from "axios";
import { readFile, writeFile } from "fs/promises";

const sendToTelegram = ({ link_original: url, title }) => {
  axios.post(
    "https://api.telegram.org/bot6426231628:AAEEgra-eH8n-yyhsg0bTWNtsUGBUX0znNo/sendMessage",
    {
      chat_id: "@science_ua_news",
      link_preview_options: {
        prefer_large_media: true,
      },
      parse_mode: "html",
      text: `<a href="${url}">${title}</a>`,
    }
  );
};

export default async (data) => {
  const prevNewsIds = await readFile("newsIds.json").then((res) =>
    JSON.parse(res.toString())
  );

  const postToSend = data.filter(({ id }) => !prevNewsIds.includes(id));

  postToSend.forEach((post) => {
    setTimeout(() => {
      sendToTelegram(post);
    }, Math.random() * 1000);
  });

  const idsToSave = data.map(({ id }) => id);

  writeFile("newsIds.json", JSON.stringify(idsToSave, null, 2));
};
