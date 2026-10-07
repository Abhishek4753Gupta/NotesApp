import Note from "../models/Notes.js";
import {redis} from "../config/upstash.js";

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();

    const cacheKey = `notes:${userId}:search:${search.toLowerCase()}:page:${page}:limit:${limit}`;

    const cachedNotes = await redis.get(cacheKey);

    if (cachedNotes) {
      return res.status(200).json(cachedNotes);
    }

    const filter = { user: userId };
    if (search) {
      filter.title = { $regex: search , $options: "i" };
    }
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / limit);

    const result = {notes,totalPages,};

    await redis.set(cacheKey, result, { ex: 60 });

    res.status(200).json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createNotes = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user.id,
    });

    await note.save();


    const keys = await redis.keys(`notes:${req.user.id}:*`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateNotes = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatednote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!updatednote) {
      return res.status(404).json({ message: "Note not found" });
    }


    const keys = await redis.keys(`notes:${req.user.id}:*`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.status(200).json(updatednote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteNotes = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

   
    const keys = await redis.keys(`notes:${req.user.id}:*`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};