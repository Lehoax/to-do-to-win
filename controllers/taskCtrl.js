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
            return res.status(201).json({ message: 'task create'});
        })        
}

exports.taskToDo = (req, res, next) => {
    User.findOne(
        { email: req.body.email },  
        {
          task: { 
            $filter: {
              input: "$task",
              as: "task",
              cond: { $eq: ["$$task.done", false] }
            }
          }
        }
      )
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(400).json({ error });
      });
       
}