import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import router from "./router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

router(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
