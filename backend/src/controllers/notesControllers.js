import Note from "../models/Notes.js";
import {redis} from "../config/upstash.js";

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    // Unique cache for each user's page
    const cacheKey = `notes:${userId}:page:${page}:limit:${limit}`;

    // Check Redis first
    const cachedNotes = await redis.get(cacheKey);

    if (cachedNotes) {
      return res.status(200).json(cachedNotes);
    }

    // Fetch from MongoDB
    const notes = await Note.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments({
      user: userId,
    });

    const totalPages = Math.ceil(totalNotes / limit);

    const result = {
      notes,
      currentPage: page,
      totalPages,
      totalNotes,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // Cache for 60 seconds
    await redis.set(cacheKey, result, {
      ex: 60,
    });

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

    // Invalidate cached pages for this user
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

    // Invalidate cached pages for this user
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

    // Invalidate cached pages for this user
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