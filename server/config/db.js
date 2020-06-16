//FILENAME : db.js

const mongoose = require("mongoose");

// Replace this with your MONGOURI.
//const MONGOURI = 'mongodb://root:password@localhost:27017';
//const MONGOURI = 'mongodb://localhost:27017/cafe';

const InitiateMongoServer = async(err, res) => {
    //try {
    if (err) throw err;
    await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

    console.log("Connected to DB !!");
    //const db = client.db('cafe')

    // } catch (e) {
    //   console.log(e);
    //    throw e;
    // }
};

module.exports = InitiateMongoServer;