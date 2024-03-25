import { launchBrowser } from "./helpers.js";
import telegram from "./telegram.js";

const browser = await launchBrowser();
let parserWorkerTimer = undefined;

class Parser {
  constructor() {
    this.page = undefined;
    this.sended = false;
  }

  async newPage() {
    this.page = await browser.newPage();

    this.subscribe();
  }

  async goto() {
    await this.page.goto(process.env.URL, { timeout: 0, waitUntil: "domcontentloaded" });
  }

  subscribe() {
    this.page.on("response", async (response) => {
      const responseUrl = await response.url();

      if (responseUrl.includes("clusters/list")) {
        const responseJson = await response.json();

        this.send(responseJson);
      }
    });
  }

  onResponse({ data }) {
    return data.reduce((acc, { source } = {}) => {
      if (!source) return acc;

      return acc.concat(source.map(({ article }) => article));
    }, []);
  }

  async send(data) {
    try {
      telegram(this.onResponse(data));

      this.page.close();
    } catch (err) {
      console.error(err);
    }
  }
}

const parserWorker =  async () => {
  console.log('started')
  parserWorkerTimer = setImmediate(async () => {
    const parser = new Parser();

    await parser.newPage();

    await parser.goto();
  }, 30000);
};

export default async (req, res) => {
  clearImmediate(parserWorkerTimer)

  parserWorker();

  res.send("Ok");
};
