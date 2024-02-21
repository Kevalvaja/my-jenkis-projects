const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.status(200).json("Hello world runing my docker through build");
});

app.listen(3000, () => {
    console.log("Server running on PORT 3000")
})
