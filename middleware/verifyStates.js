const statesData = require('../model/statesData.json');

function getStates(req, res, next) {
    const statesJSON = JSON.stringify(statesData);
    const statesObj = JSON.parse(statesJSON);
    req.states = statesObj;
    req.state = statesObj.find(state => state.code === req.code);
    next();
}

async function verifyStates(req, res, next) {
    const stateCodes = statesData.map(state => state.code);
    const code = req.params.state;
    const index = stateCodes.indexOf(code.toUpperCase());

    if (index < 0) {
        res.json({
            message: 'Invalid state abbreviation parameter'
        });
    } else {
        req.code = stateCodes[index];
        next();
    }
}

module.exports = {
    verifyStates,
    getStates
};