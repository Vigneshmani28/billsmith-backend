const mongoose = require('mongoose');

const connetDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Mongodb connected!')
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

module.exports = connetDB;