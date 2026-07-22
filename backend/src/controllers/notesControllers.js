import Note from "../models/notes.js";

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1});
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createNotes =async (req,res)=>{
    try{
        const { title, content } = req.body;
        const note = new Note({ title, content });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNotes =async (req,res)=>{
    try{
        const { title, content } = req.body;
        const updatednote = await Note.findByIdAndUpdate(req.params.id, { title, content },{new: true});
        if(!updatednote){
            return res.status(404).json({ message: "Note not found" }); 
        }
        res.status(200).json(updatednote);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
}

export const deleteNotes = async (req,res)=>{
    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note){
            return res.status(404).json({ message: "Note not found" }); 
        }
        res.status(200).json({ message: "Note deleted successfully" });
    }catch(error){
        res.status(500).json({ message : error.message});
    }
}