// server.js
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Servidor frontend rodando em http://localhost:${PORT}`);
});
