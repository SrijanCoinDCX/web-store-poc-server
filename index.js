const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);

app.use("/api/auth", require("./src/routes/auth.routes.js"));

app.listen(PORT, () => {
    console.log(`
        ************************************************************
                          Listening on port: ${PORT}
                          http://localhost:${PORT}
        ************************************************************`);
});
