const mongoose = require('mongoose');
const mongoPath = `mongodb+srv://`;
module.exports = async () => {
    await mongoose.connect(mongoPath, {
      retryWrites: true,
      w: "majority",
    })
    mongoose.Promise = global.Promise;
    return mongoose 
 
};
