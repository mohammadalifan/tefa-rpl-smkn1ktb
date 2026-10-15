const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("node:path");
const authRoutes = require("./routes/auth-routes");
const guruRoutes = require("./routes/guru-routes");
const siswaRoutes = require("./routes/siswa-routes");
const { requireAuth } = require("./middlewares/auth-middleware");

const app = express();
const port = process.env.PORT || 3000;
const frontendDirectory = path.join(__dirname, "../frontend");

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "approval.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/guru", guruRoutes);
app.use("/api/siswa", siswaRoutes);
app.get("/login", (request, response) => {
  if (request.session.user) return response.redirect("/");
  response.sendFile(path.join(frontendDirectory, "login.html"));
});
app.get("/index.html", requireAuth, (request, response) => {
  response.sendFile(path.join(frontendDirectory, "index.html"));
});
app.get("/guru.html", requireAuth, (request, response) => {
  response.sendFile(path.join(frontendDirectory, "guru.html"));
});
app.get("/siswa.html", requireAuth, (request, response) => {
  response.sendFile(path.join(frontendDirectory, "siswa.html"));
});
app.get("/", requireAuth, (request, response) => {
  response.sendFile(path.join(frontendDirectory, "index.html"));
});
app.use(express.static(frontendDirectory));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
