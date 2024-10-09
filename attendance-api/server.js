const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const app = express();

const authRoute = require("./routes/auth.routes");
const attendenceRoute = require("./routes/attendence.routes");

app.use(express.json());
app.use(cors());

app.use("/api/v1", authRoute);
app.use("/api/v1", attendenceRoute);

app.listen(port, (error) => {
    if (error) {
        process.exit();
    }

    console.log(`Server running on port ${port}`);
});