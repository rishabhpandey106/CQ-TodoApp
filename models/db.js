const mongoose = require('mongoose');

module.exports.init = async function () 
{
    await mongoose.connect('mongodb+srv://jaiyaxd2:xriXbfjo7IJFWWmq@todoapp.abmtknx.mongodb.net/todoTask?retryWrites=true&w=majority')
    
}