const Task = require('../models/Task');
const User = require('../models/User');

exports.newTask = (req, res, next) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        xp: req.body.xp,
    })
        User.findOneAndUpdate({email: req.body.email} , {$push: { task: task }})
        .then(user =>{
            return res.status(200).json({ message: 'task create'});
        })        
}