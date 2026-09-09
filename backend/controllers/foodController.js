import foodModel from "../models/foodModel.js";

// Add food item func
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.json({
        success: false,
        message: "Missing required fields!",
      });
    }

    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: image || (req.file ? req.file.filename : ""),
    });

    await food.save();
    res.json({ success: true, message: "Food Added Successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

// All food list func- so that it can be accessed and send them as response.
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food item func-
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({ success: false, message: "Food not found!" });
    }

    await foodModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Food Removed!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };
