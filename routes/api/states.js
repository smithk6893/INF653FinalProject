const express = require('express');
const statesController = require('../../controllers/statesController');

const router = express.Router(); // express router

const {verifyStates, getStates} = require('../../middleware/verifyStates');

// handling different routes
router.route('/')
    .get(getStates, statesController.getAllStates);
router.route('/:state')
    .get(verifyStates, getStates, statesController.getState);
router.route('/:state/funfact')
    .get(verifyStates, getStates, statesController.getFunFact)
    .post(verifyStates, getStates, statesController.postFunFact)
    .patch(verifyStates, getStates, statesController.updateFunFact)
    .delete(verifyStates, getStates, statesController.deleteFunFact);
router.route('/:state/admission')
    .get(verifyStates, getStates, statesController.getStateAdmission);
router.route('/:state/nickname')
    .get(verifyStates, getStates, statesController.getStateNickname);
router.route('/:state/capital')
    .get(verifyStates, getStates, statesController.getStateCapital);
router.route('/:state/population')
    .get(verifyStates, getStates, statesController.getStatePopulation);

module.exports = router;