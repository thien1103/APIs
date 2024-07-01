const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const route = require('./routes/index')
const { connection } = require('./configuration/dbConfig');


dotenv.config();
const port = process.env.port || 8080;
app.use(bodyParser.json())


// Connect to the database
connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("Connected to Database Successfully");
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json())
route(app);

app.listen(port, console.log('Server is running on port: ' + port));