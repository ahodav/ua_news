import axios from "axios";

const sendToTelegram = ({ link_original: url, title }) => {
  axios.post(process.env.TELEGRAM, {
    chat_id: process.env.CHAT_ID,
    link_preview_options: {
      prefer_large_media: true,
    },
    parse_mode: "html",
    text: `<a href="${url}">${title}</a>`,
  });
};

let prevNewsIds = [];
let prevNewsTitles = [];

export default async (data) => {
  const postToSend = data.filter(
    ({ id, title }) =>
      !prevNewsIds.includes(id) && !prevNewsTitles.includes(title)
  );
  const uniquePosts = postToSend.reduce((acc, curr) => {
    if (acc.find(({ title }) => title === curr.title)) return acc;
    
    acc.push(curr)
    
    return acc;
  }, []);

  uniquePosts.forEach((post, i) => {
    setTimeout(() => {
      sendToTelegram(post);
    }, (i + 1) * 60000);
  });

  prevNewsIds = uniquePosts.map(({ id }) => id);
  prevNewsTitles = uniquePosts.map(({ title }) => title);
};
