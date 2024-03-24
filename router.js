import parser from "./parser.js";

export default (app) => {
  app.get("/", (req, res) => {
    res.send("working");
  });
  app.get('/get-results', parser)
};
