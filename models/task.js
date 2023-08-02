const mongoose = require("mongoose");

const taskschema = new mongoose.Schema({
    tasktext : String,
    completed : Boolean,
    taskimg : String
});

const tasks = mongoose.model("tasks" , taskschema);
module.exports = tasks; 