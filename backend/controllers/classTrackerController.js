const express = require('express');
const router = express.Router();



const classTrackerModel = require('../models/classTracker');

exports.insertClassTracker = async (req, res) => {
  try {
    //console.log(req.body); 

    const { classDetails } = req.body;
      let sumClass1 = 0;
    let sumOtherClasses = 0;
    let decision =""; 

    // Loop through classDetails to calculate sums
    for (const entry of classDetails) {
      const totalTime = parseFloat(entry.totalTime);

      if (entry.className === 'Class 1' || entry.className === 'Class 5'){
        sumClass1 += totalTime;
      }
       else {
        // For other classes
        sumOtherClasses += totalTime;
      }
    }

    console.log('Sum of Class 1 and 5:', sumClass1);
    console.log('Sum of Other Classes:', sumOtherClasses);

    console.log('sumOtherClasses/sumClass1: ', sumOtherClasses/sumClass1);
    if(sumOtherClasses/sumClass1 >0.5){
      //console.log("autiste");
      decision ="autiste"
    }
    else {
      //console.log("no autiste");
      decision = "non autiste" ;
    }
   // console.log("percent" , (sumOtherClasses /(sumOtherClasses+sumClass1))*100);

    // Validate data if necessary
    const classTrackerObjects = {
      percent: (sumOtherClasses /(sumOtherClasses+sumClass1))*100 , 
      sumNormal:  sumClass1 , 
      sumOther: sumOtherClasses ,
      decision  : decision ,
      classDetails: classDetails.map(entry => ({
        className: entry.className,
        totalTime: entry.totalTime,
      })),
    };

    console.log("classTrackerObjects", classTrackerObjects);

    const createdClassTrackers = await classTrackerModel.create(classTrackerObjects);

    res.status(201).json({
      success: true,
      message: 'Data saved successfully in the database',
      createdClassTrackers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Error during data insertion: ${error.message}` });
  }
};





  

  
  