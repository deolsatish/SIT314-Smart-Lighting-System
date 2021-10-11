const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
name: String,
password: String,
isAdmin: Boolean,
notification_array:Array,
email_id:String
}));