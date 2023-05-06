const States = require('../model/States');

// gets all states
const getAllStates = async (req, res) => {

    let allStates = req.states;

    // for handling contiguous and uncontugious states:
    if (req.query.contig === 'true') {
        allStates = allStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (req.query.contig === 'false') {
      allStates = allStates.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const statesDatabase = await States.find();

    for (let i = 0; i < allStates.length; i++) {
        let find = statesDatabase.find(state => state.stateCode === allStates[i].code);
        if (find) {
          allStates[i].funfacts = find['funfacts'];
        }
    }
    res.status(200).json(allStates);
};

// gets single state
const getState = async (req, res) => {

    const statesDatabase = await States.findOne({
        stateCode: req.code
    });

    if (statesDatabase) {
        req.state.funfacts = statesDatabase.funfacts;
    }
    res.status(200).json(req.state);
};

// for /:state/funfact -> random fact
const getFunFact = async (req, res) => {
    const statesDatabase = await States.findOne(
    {
        stateCode: req.code
    });

    if (!statesDatabase) 
    {
        return res.status(404).json(
        {
            'message': 'No Fun Facts found for ' + req.state.state
        });
    }

    const operation = 
    {
        funfact: statesDatabase.funfacts[Math.floor(Math.random() * statesDatabase.funfacts.length)]
    };

    res.status(200).json(operation);
};

/**From now on, providing responses to the GET requests will be considerably easier */
// for state capital /:state/capital
const getStateCapital = (req, res) => {
    const operation = {
        "state": req.state.state,
        "capital": req.state.capital_city
    };
    res.json(operation);
};

// for state/nickname
const getStateNickname = (req, res) => {
    const operation = {
        "state": req.state.state,
        "nickname": req.state.nickname
    };
    res.json(operation);
};

// for state/population
const getStatePopulation = (req, res) => {
    const operation = {
        "state": req.state.state,
        "population": req.state.population.toLocaleString('en-US')
    };

    res.json(operation);
};

// for state/admission
const getStateAdmission = (req, res) => {
    const operation = {
        "state": req.state.state,
        "admitted": req.state.admission_date.toLocaleString('en-US')
    };

    res.json(operation);
};



/*POST request for state/funfact */
const postFunFact = async (req, res) => 
{
  const 
    {
        funfacts
    } = req.body || {};

  if (!funfacts) {
      return res.status(400).json({
          message: 'State fun facts value required'
      });
  }

  if (!Array.isArray(funfacts)) {
      return res.status(400).json({
          message: 'State fun facts value must be an array'
      });
  }

  try {
      const state = await States.findOne({
          stateCode: req.code
      });

      if (!state) {
          const operation = await States.create({
              stateCode: req.code,
              funfacts,
          });

          return res.status(201).json(operation);
      }

      state.funfacts = state.funfacts.concat(funfacts);
      const operation = await state.save();

      return res.status(201).json(operation);
  } catch (err) {
      console.error(err);
  }
};

/**for PATCH request*/
const updateFunFact = async (req, res) => {
  const {
      index,
      funfact
  } = req.body || {};
  const state = await States.findOne({
      stateCode: req.code
  });
  const x = index - 1;

  if (!index) {
      return res.status(400).json({
          message: 'State fun fact index value required'
      });
  }

  if (!funfact) {
      return res.status(400).json({
          message: 'State fun fact value required'
      });
  }

  if (!state) {
      return res.status(404).json({
          message: `No Fun Facts found for ${req.state.state}`
      });
  }

  if (index > state.funfacts.length) {
      return res.status(404).json({
          message: `No Fun Fact found at that index for ${req.state.state}`
      });
  }

  state.funfacts.splice(x, 1, funfact);
  const operation = await state.save();

  res.status(200).json(operation);
};

/*for DELETE request */
const deleteFunFact = async (req, res) => {
  const {
      index
  } = req.body || {};
  const state = await States.findOne({
      stateCode: req.code
  });
  const x = index - 1;

  if (!index) {
      return res.status(400).json({
          message: 'State fun fact index value required'
      });
  }

  if (!state) {
      return res.status(404).json({
          message: `No Fun Facts found for ${req.state.state}`
      });
  }

  if (index > state.funfacts.length) {
      return res.status(404).json({
          message: `No Fun Fact found at that index for ${req.state.state}`
      });
  }

  state.funfacts.splice(x, 1);
  const operation = await state.save();

  res.status(200).json(operation);
  };


  module.exports= {
    getAllStates,
    getState,
    getFunFact,
    getStateCapital,
    getStateAdmission,
    getStateNickname,
    getStatePopulation,
    postFunFact,
    deleteFunFact,
    updateFunFact
};