const path = require('path');
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello world!"});
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, '../cliet/build')));
app.get('*', (req, res) => {
    res.sendFile(pah.resolve(__dirname, '../cliet/build', 'index.js'));
})