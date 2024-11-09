const dotenv = require("dotenv");
dotenv.config({});
const express= require("express");
const app = express();
const port = process.env.PORT || 8000;
const mapRoute = require("./routes/maps");
const userRoute = require("./routes/users");
const database = require("./database/connect");
// Middleware
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/map", mapRoute);

app.listen(port, () => {

    database(process.env.MONGO_URI);
    console.log(`Server Running on PORT: ${port}`)

})