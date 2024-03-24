import axios from "axios";
import fs from "node:fs/promises";

const sendToTelegram = ({ link_original: url, title }) => {
  axios.post(
    process.env.TELEGRAM,
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
  const prevNewsIds = await fs.readFile("./newsIds").then((res) =>
    JSON.parse(res.toString())
  );

  const postToSend = data.filter(({ id }) => !prevNewsIds.includes(id));

  postToSend.forEach((post) => {
    setTimeout(() => {
      sendToTelegram(post);
    }, Math.random() * 60000);
  });

  const idsToSave = data.map(({ id }) => id);

  fs.writeFile("./newsIds", JSON.stringify(idsToSave, null, 2));
};
