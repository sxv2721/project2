const models = require('../models');

const Notes = models.Notes;

const makerPage = (req, res) => {
    Notes.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err){
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }
        console.log(req.csrfToken());
        return res.render('app', { csrfToken: req.csrfToken(), notes: docs});
    });
};


const makeNote = (req, res) => {
    if(!req.body.name || !req.body.note){
        return res.status(400).json({ error: 'RAWR! name, and note are required' });
    }
    
    const noteData = {
        name: req.body.name,
        note: req.body.note,
        reveal: req.body.reveal,
        owner: req.session.account._id,
    };
    
    const newNote = new Notes.NoteModel(noteData);
    
    const notePromise = newNote.save();
    
    notePromise.then(() => res.json({ redirect: '/maker'}));
    
    notePromise.catch((err) => {
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Note already exists.'});
        }
        
        return res.status(400).json({ error: 'An error occurred'});
    });
    
    return notePromise;
};

const getNotes = (request, response) => {
    const req = request;
    const res = response;
    
    return Notes.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }
        
        return res.json({ Notes: docs});
    });
};

module.exports.makerPage = makerPage;
module.exports.getNotes = getNotes;
module.exports.make = makeNote;