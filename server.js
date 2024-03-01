require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db_config");
// handle file storage for image uploaded
// const homeRoutes = require("homeRoutes");
const menuRoutes = require("./routes/menuRoutes");
const menuSatuanRoutes = require("./routes/menuSatuanRoutes");
const tumpengRoutes = require("./routes/tumpengRoutes");
const nasiBoxRoutes = require("./routes/nasiBoxRoutes");
const contentRoutes = require("./routes/contentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
// model
const Content = require("./models/Content");
const Contact = require("./models/Contact");

// app
const app = express();
const rootWebsite = path.dirname(__dirname) + "/frontend/website";
const rootBackend = path.dirname(__dirname) + "/backend/public";
const options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
// middleware
app.use(cors(options));
app.use(express.json());
app.use(express.static(rootWebsite + "/home/static"));
app.use(express.static(rootWebsite + "/home/static/image"));
app.use("/static", express.static("public"));
//templating engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", rootWebsite + "/home");

app.get("/", async (req, res) => {
  const [content] = await Content.all();
  const [contact] = await Contact.all();

  res.render("index.html", {
    content,
    contact,
    menupage: process.env.MENUPAGE,
  });
});

// routes
app.use("/api/content/", contentRoutes);
app.use("/api/contact/", contactRoutes);
app.use("/api/menu/", menuRoutes);
app.use("/api/menu-satuan/", menuSatuanRoutes);
app.use("/api/tumpeng/", tumpengRoutes);
app.use("/api/nasi-box/", nasiBoxRoutes);
app.use("/api/user/", userRoutes);

// connect to database and listen to server
db.connect((error) => {
  if (error) {
    throw Error(error);
  }
  app.listen(process.env.PORT, () => {
    console.log("connect to database and listen to port", process.env.PORT);
  });
});
