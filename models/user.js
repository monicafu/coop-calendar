const mongoose = require('mongoose');
// Define schema
const userSchema = mongoose.Schema({
    username:String,
    password:String,
    events:[{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});
// Compile model from schema
modules.exports = mongoose.model('User',userSchema);