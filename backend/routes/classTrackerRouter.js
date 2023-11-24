const express = require('express');
const router =express.Router();
const classTarckerController = require('../controllers/classTrackerController');


router.post('/insertListTimeTracker'  , classTarckerController.insertClassTracker );


module.exports = router ; 