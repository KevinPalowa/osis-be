const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(userRoutes);
app.use(candidateRoutes);
app.use(voteRoutes);
app.use(schoolRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
