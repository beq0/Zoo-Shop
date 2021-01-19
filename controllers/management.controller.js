const Management = require('../models/Management.model');

module.exports.addPassword = (req, res) => {
    Management.findOne({name: getManagementName()})
        .then((management) => {
            if (management) res.status(500).json({message: `Management already exists`});
            else {
                const management = new Management({
                    name: getManagementName(),
                    password: req.body.password
                });
                management.save().then(() => {
                    res.status(200).json({message: `Created Management with Password`, status: 200});
                }).catch((error) => {
                    console.log(error);
                    res.status(500).json({message: `Internal Error! Could not Create Management`, status: 500});
                });
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to add Password`});
        })
};

module.exports.changePassword = (req, res) => {
    Management.findOne({name: getManagementName()})
        .then((management) => {
            if (!management) res.status(500).json({message: `Management does not exist`});
            else {
                if (management.password != req.body.oldPassword) {
                    res.status(500).json({message: `Wrong old Password`});
                    return;
                } 
                Management.findOneAndUpdate(
                    { 'name': getManagementName() },
                    { $set: {password: req.body.newPassword} },
                    (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: 'Internal error! Could not change Password', status: 500});
                        } else {
                            res.status(200).json({message: `Changed Password`, status: 200});
                        }
                    }
                );
            }
        }).catch((err) => {
            res.status(500).json({message: `Internal Error! Could not find Management to change Password`});
        })
};

module.exports.findManagement = (req, res) => {
    let managementToFind = {
        name: getManagementName()
    }
    Management.findOne(managementToFind).then((management) => {
        if (management) {
            delete management.password;
            res.status(200).json({management});
        }
        else res.status(400).json({message: `Could not find Management`});
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: `Error during finding Management`});
    })
}

function getManagementName() {
    return 'Management';
}