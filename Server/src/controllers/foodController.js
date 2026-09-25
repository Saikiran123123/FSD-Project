import FoodItem from '../models/FoodItem.js';

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
export const getFoodItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== 'All') {
      filter.category = category;
    }
    const items = await FoodItem.find(filter).sort({ price: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create food item (Admin)
// @route   POST /api/food
// @access  Private/Admin
export const createFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update food item (Admin)
// @route   PUT /api/food/:id
// @access  Private/Admin
export const updateFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete food item (Admin)
// @route   DELETE /api/food/:id
// @access  Private/Admin
export const deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
