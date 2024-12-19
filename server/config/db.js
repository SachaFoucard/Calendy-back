const mongoose = require('mongoose');

require('dotenv').config()


const DBconnect = async () => {
    try {
        mongoose.connect(process.env.URI);
        console.log('Successfully connected to MongoDB Atlas!');
    } catch (error) {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
    }
}
module.exports = DBconnect;