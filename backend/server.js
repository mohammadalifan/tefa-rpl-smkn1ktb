const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("node:path");
const fs = require("node:fs");
const authRoutes = require("./routes/auth-routes");
const guruRoutes = require("./routes/guru-routes");
const siswaRoutes = require("./routes/siswa-routes");
const { requireAuth } = require("./middlewares/auth-middleware");

const app = express();
const port = process.env.PORT || 3000;
const frontendDirectory = path.join(__dirname, "../frontend/dist");
const frontendIndex = path.join(frontendDirectory, "index.html");

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
app.use("/api", (request, response) => {
  response.status(404).json({ message: "Endpoint API tidak ditemukan." });
});

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDirectory));
  app.get(/.*/, (request, response) => {
    response.sendFile(frontendIndex);
  });
} else {
  app.get("/", requireAuth, (request, response) => {
    response.status(503).send("Frontend build belum tersedia. Jalankan npm run build di folder frontend.");
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
