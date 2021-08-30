const mongoose = require('mongoose');
const mongoPath = `mongodb+srv://netninja:tickerlive@cluster0.vd6ei.mongodb.net/AlertBot?retryWrites=true&w=majority`;
module.exports = async () => {
    await mongoose.connect(mongoPath, {
      retryWrites: true,
      w: "majority",
    })
    mongoose.Promise = global.Promise;
    return mongoose 
 
};