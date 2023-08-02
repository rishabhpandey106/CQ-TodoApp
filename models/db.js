const mongoose = require('mongoose');

module.exports.init = async function () 
{
    await mongoose.connect('mongodb+srv://jaiyaxh2:l7xEib1n7BbFN179@todoapp.abmtknx.mongodb.net/todoTask?retryWrites=true&w=majority')
}