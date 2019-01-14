const mongoose = require('mongoose')
const config = require('config')

module.exports = () => {
    mongoose.set("useFindAndModify", false);
    mongoose.connect(
        config.get('mongoConnectionString'),
        { useNewUrlParser: true }
    );
    //listen to errors
    mongoose.connection.on("error", error => console.log(error));
}