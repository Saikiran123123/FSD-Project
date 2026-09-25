import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
export const getTheatres = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) {
      filter.city = new RegExp(city, 'i');
    }
    const theatres = await Theatre.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: theatres.length, data: theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single theatre details with screens
// @route   GET /api/theatres/:id
// @access  Public
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    const screens = await Screen.find({ theatreId: theatre._id });
    res.json({ success: true, data: { ...theatre.toObject(), screens } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new theatre
// @route   POST /api/theatres
// @access  Private/Admin
export const createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, data: theatre });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
export const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.json({ success: true, data: theatre });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
