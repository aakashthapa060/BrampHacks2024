const dotenv = require("dotenv");
dotenv.config({});
const express= require("express");
const app = express();
const port = process.env.PORT || 8000;
const mapRoute = require("./routes/maps");
const userRoute = require("./routes/users");
const database = require("./database/connect");
const cors = require("cors");
const authenticate = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");


// Middleware
app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoute);
app.use("/api/map", mapRoute);

app.listen(port, () => {

    database(process.env.MONGO_URI);
    console.log(`Server Running on PORT: ${port}`)

})