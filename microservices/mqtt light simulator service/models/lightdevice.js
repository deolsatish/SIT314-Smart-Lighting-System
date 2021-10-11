const mongoose = require('mongoose');
module.exports = mongoose.model('LightDevice', new mongoose.Schema({
id: String,
device_name: String,
user_name: String,
light_status:Boolean,
status_history:Array,
description:String,
locationdesc:String,
rgb:String,
brightness:String
}));