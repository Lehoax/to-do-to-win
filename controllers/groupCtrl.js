const Group = require('../models/Group');
const User = require('../models/User');


exports.newGroup = (req, res, next) => {
    try {
        const group = new Group({
            title: req.body.title,
            admin: req.body.admin,
            members: req.body.members
        });
    
        group.save()
        .then(async (savedGroup) => {
            try {
                const groupId = savedGroup._id;
    
                await User.findOneAndUpdate(
                    { email: req.body.admin },
                    { $push: { groups: groupId } }
                );
    
                for (const memberEmail of req.body.members) {
                    await User.findOneAndUpdate(
                        { email: memberEmail },
                        { $push: { groups: groupId } }
                    );
                }
    
                return res.status(201).json({ message: 'Groupe créé avec succès' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erreur lors de l\'ajout du groupe aux membres' });
            }
        })
        .catch(error => res.status(400).json({ error: 'Erreur lors de la création du groupe' }));
    } catch (error) {
        return res.status(500).json({ error: 'Erreur du serveur' });
    }
    
}

exports.deleteGroup = (req, res, next) => {
    const { groupId, admin } = req.body;
    Group.findById(groupId)
        .then(group => {
            if (!group) {
                return res.status(404).json({ message: 'Groupe non trouvé' });
            }
            if (group.admin.toString() !== admin) {
                return res.status(403).json({ message: 'Seul l\'admin peut supprimer ce groupe' });
            }
            return Group.findByIdAndDelete(groupId);
        })
        .then(deletedGroup => {
            if (deletedGroup) {
                return res.status(200).json({ message: 'Groupe supprimé avec succès' });
            }
        })
        .catch(error => {
            return res.status(500).json({ error: 'Erreur lors de la suppression du groupe' });
        });

}

exports.addMember = async (req, res, next) => {
    try {
        const { groupId, newMember } = req.body;

        const updatedGroup = await Group.findOneAndUpdate(
            { _id: groupId },
            { "$push": { members: [newMember] } },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        return res.status(201).json({ message: "Membre ajouté avec success", group: updatedGroup });
    } catch (error) {
        return res.status(400).json({ message: "Erreur lors de l'ajout du membre", error: error.message });
    }
};
