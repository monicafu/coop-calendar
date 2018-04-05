const mongoose = require('mongoose'),
      passportLocalMongoose = require("passport-local-mongoose");

// Define schema
const userSchema = mongoose.Schema({
    username:String,
    password:String,
    events:[{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

userSchema.plugin(passportLocalMongoose);
// Compile model from schema
module.exports = mongoose.model('User',userSchema);