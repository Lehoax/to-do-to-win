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
    console.log("Email reçu : ", req.body.email);  // Log pour vérifier l'email
  
    User.findOne({ email: req.body.email }) // Cherche l'utilisateur par email
      .then(result => {
        if (result) {  
          // Mettre à jour la tâche spécifique
          const taskIndex = result.task.findIndex(t => t._id.toString() === req.body.taskId); // Trouver l'index de la tâche
          if (taskIndex !== -1) {
            result.task[taskIndex].done = true; // Met à jour le champ "done"
            return result.save(); // Sauvegarde l'utilisateur avec la tâche mise à jour
          } else {
            return Promise.reject({ message: "Tâche non trouvée" }); // Si la tâche n'est pas trouvée
          }
        } else {
          return Promise.reject({ message: "Utilisateur non trouvé" }); // Si l'utilisateur n'est pas trouvé
        }
      })
      .then(updatedUser => {
        // Trouver la tâche mise à jour dans le tableau des tâches
        const updatedTask = updatedUser.task.find(t => t.done === true && t._id.toString() === req.body.taskId);
        res.status(200).json(updatedTask); // Retourner la tâche mise à jour
      })
      .catch(error => {
        console.error("Erreur de requête :", error);  // Log de l'erreur
        res.status(404).json(error); // Retourner l'erreur avec un statut 404
      });
  };