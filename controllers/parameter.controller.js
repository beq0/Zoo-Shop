const Parameter = require('../models/Parameter.model');
const Management = require('../models/Management.model');

module.exports.addParameter = (req, res) => {
    const param = new Parameter({
        name: req.body.name,
        description: req.body.description,
        parameterType: req.body.parameterType,
        value: req.body.value
    });
    param.save().then(() => {
        res.status(200).json({message: `Added ${param} Parameter!`, status: 200, _id: param._id});
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message: `Internal Error! Could not add ${param} Parameter`, status: 500});
    });
};

module.exports.changeParameter = (req, res) => {
    if (!req.body._id) {
        res.status(500).json({message: 'Id of the Parameter not provided!'});
        return;
    }
    Management.findOne({name: getManagementName(), password: req.body.password})
        .then((management) => {
            if (management) {
                let updatedParameter = {}
                if (req.body.name) updatedParameter['name'] = req.body.name;
                if (req.body.description) updatedParameter['description'] = req.body.description;
                if (req.body.parameterType) updatedParameter['parameterType'] = req.body.parameterType;
                if (req.body.value) updatedParameter['value'] = req.body.value;
                updatedParameter['lastChangeDate'] = new Date();
                console.log(updatedParameter);
                Parameter.findOneAndUpdate(
                    { '_id': req.body._id },
                    { $set: updatedParameter },
                    (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: err, status: 500});
                        } else {
                            res.status(200).json({message: `Updated Parameter ${req.body._id}!`, status: 200, _id: req.body._id});
                        }
                    }
                );
            } else {
                res.status(500).json({message: `Management not found / Wrong password druing changing Parameter`});
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to change Parameter`});
        })
};

module.exports.deleteParameter = (req, res) => {
    Management.findOne({name: getManagementName(), password: req.params.password})
        .then((management) => {
            if (management) {
                Parameter.findOneAndDelete(
                    { '_id': req.params._id },
                    (err, doc) => {
                        if (err) {
                            res.status(500).json({message: err, status: 500});
                        } else {
                            res.status(200).json({message: `Deleted Parameter ${req.body._id}!`, status: 200});
                        }
                    }
                );
            } else {
                res.status(500).json({message: `Management not found / Wrong password druing deleting Parameter`});
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to delete Parameter`});
        })
};

module.exports.findParameters = (req, res) => {
    Parameter.find().sort({lastChangeDate: 'desc'}).then((parameters) => {
        res.status(200).json(parameters);
    }).catch((err) => {
        res.status(500).json({message: err});
    })
};

module.exports.getParameter = (req, res) => {
    if (!req.body.name || !req.body.parameterType) {
        res.status(500).json({message: 'Both Parameter name and type must be specified to find it'});
        return;
    }
    let parameterToFind = {
        name: req.body.name,
        parameterType: req.body.parameterType
    }
    Parameter.findOne(parameterToFind).then((parameter) => {
        if (parameter) res.status(200).json(parameter);
        else res.status(200).json(getDefaultParameter(req));
    }).catch((err) => {
        if (!req.body.defaultValue) {
            res.status(500).json({message: `Error during finding Parameter: ${parameterToFind}`});
        } else {
            res.status(200).json(getDefaultParameter(req));
        }
    })
};

function getDefaultParameter(req) {
    return {
        name: req.body.name,
        parameterType: req.body.parameterType,
        value: req.body.defaultValue
    };
}

function getManagementName() {
    return 'Management';
}