import Note from "../models/Notes.js";

export const getSearchSuggestions = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) return res.status(200).json([]);

    const notes = await Note.find({
      user: req.user.id,
      title: { $regex: q , $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title -_id");

    
    const titles = [...new Set(notes.map((n) => n.title))].slice(0, 5);

    res.status(200).json(titles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
