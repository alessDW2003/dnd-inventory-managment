const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // zodat req.body werkt met JSON
app.use(express.urlencoded({ extended: true })); // voor form-data
app.use("/items", itemRoutes);
app.use("/users", userRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
