const { default: mongoose } = require('mongoose');
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
exports.taskDone = (req, res, next) => {
    console.log("Email reçu : ", req.body.email);
    console.log("ID de la tâche reçu : ", req.body.taskId);
  
    // Cherche l'utilisateur et la tâche à mettre à jour
    User.findOneAndUpdate(
      { email: req.body.email, "task._id": mongoose.Types.ObjectId(req.body.taskId) }, // Condition de recherche
      { $set: { "task.$.done": true } }, // Met à jour le statut de la tâche
      { new: true } // Retourne le document mis à jour
    )
    .then(updatedUser => {
      if (updatedUser) {
        const updatedTask = updatedUser.task.find(t => t._id.toString() === req.body.taskId); // Trouver la tâche mise à jour
  
        if (updatedTask) {
          // Ajoute l'xp de la tâche à l'utilisateur
          const newXp = updatedUser.xp + updatedTask.xp;
  
          // Met à jour l'utilisateur avec le nouvel xp
          User.findByIdAndUpdate(
            updatedUser._id,
            { xp: newXp },
            { new: true }
          )
          .then(finalUser => {
            if (finalUser) {
              res.status(200).json({ task: updatedTask, userXp: finalUser.xp }); // Retourner la tâche mise à jour et le nouvel xp
            } else {
              res.status(404).json({ message: "Utilisateur non trouvé lors de la mise à jour de l'XP" });
            }
          })
          .catch(error => {
            res.status(400).json({ error });
          });
        } else {
          res.status(404).json({ message: "Tâche non trouvée" });
        }
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    })
    .catch(error => {
      res.status(400).json({ error }); // Retourner l'erreur avec un statut 400
    });
  };