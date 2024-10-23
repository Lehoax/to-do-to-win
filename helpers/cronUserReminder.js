const cron = require('node-cron');
const mailer = require('../controllers/mailCtrl');
const User = require('../models/User');


exports.reminder = () => {
// Tâche planifiée pour s'exécuter toutes les 24 heures
cron.schedule('00 12 * * *', () => {  // Exécute tous les jours à midi

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); 
    
    User.find({
      last_connection: { $lt: twentyFourHoursAgo },
      reminder: true 
    })
      .then(users => {
        
        console.log(users);
        
        users.forEach(user => {
            console.log(user);
            mailer.reminder(user.email);
          console.log(`Email envoyé à ${user.email} pour inactivité.`);
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs inactifs:', error));
  })

}