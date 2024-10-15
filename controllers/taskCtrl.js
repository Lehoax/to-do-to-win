const Task = require('../models/Task');
const User = require('../models/User');

exports.newTask = (req, res, next) => {
    const task = new Task({
        title: req.body.task,
        description: req.body.description,
        xp: req.body.xp,
    })
    User.find({ email: req.body.email})
    .then(user =>{
        user.updateOne({ $addToSet: { task: task } })
        return res.status(200).json({ message: 'task create'});
    })
}