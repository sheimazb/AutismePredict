const mongoose = require('mongoose');

const classTrackerSchema = new mongoose.Schema({
  percent : Number ,
  sumNormal : Number ,
  sumOther : Number ,  
  decision : String ,
  classDetails: [
    {
      className: {
        type: String,
        required: true,
      },
      totalTime: {
        type: String, // This is currently defined as a string
        required: true,
      },
    },
  ],
});

const classTrackerModel = mongoose.model('classTracker', classTrackerSchema);

module.exports = classTrackerModel;
