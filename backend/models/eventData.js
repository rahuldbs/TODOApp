const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: {type : String, required : true},
  description: {type : String, required : false},
  day: {type : String, required : true}
});

module.exports = mongoose.model('EventData', eventSchema);
