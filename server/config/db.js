const mongoose = require("mongoose");


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