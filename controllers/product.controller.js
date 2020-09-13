module.exports.addProduct = (req, res) => {
    res.status(200).json({message: 'Added'});
};

module.exports.changeProduct = (req, res) => {
    res.status(200).json({message: 'Changed'});
};

module.exports.deleteProduct = (req, res) => {
    res.status(404).json({message: 'Nothing to delete'});
};

module.exports.getProduct = (req, res) => {
    res.status(200).json({message: 'Here'});
};

module.exports.getProducts = (req, res) => {
    res.status(200).json({message: 'Here all'});
};