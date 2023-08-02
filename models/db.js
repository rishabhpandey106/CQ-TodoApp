const mongoose = require('mongoose');

module.exports.init = async function () 
{
    await mongoose.connect('mongodb+srv://jaiyaxh:y3N2NOZcP8A5sm4H@todoapp.abmtknx.mongodb.net/todoTask?retryWrites=true&w=majority')
}