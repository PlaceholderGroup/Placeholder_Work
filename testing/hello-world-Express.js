
const express = require("express"); //import express module

const app = express();
const port = 3000; //unused port for us to use

//when browser tries to "get" the homepage
app.get("/", (req, res) => {
    //response we want to send
    res.send("Hello Placeholder Team!");
});

//which port we want to listen for
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})
