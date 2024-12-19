const express = require('express');
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000;
const dbConnection = require('./config/db')

dbConnection()

app.use(cors());
app.use(express.json());

app.use('/api', require('./Routes/route.meeting'));


app.listen(PORT, () => console.log(`localhost running on http://localhost:${PORT}`))

