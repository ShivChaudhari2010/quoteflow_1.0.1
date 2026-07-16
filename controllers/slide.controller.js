import Slide from "../models/Slide.js";

/*
|--------------------------------------------------------------------------
| Create Slide
|--------------------------------------------------------------------------
*/

export const createSlide = async (req, res) => {
  try {
    const slide = await Slide.create(req.body);

    res.status(201).json({
      success: true,
      message: "Slide created successfully.",
      data: slide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Slides
|--------------------------------------------------------------------------
*/

export const getAllSlides = async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: slides.length,
      data: slides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Slide
|--------------------------------------------------------------------------
*/

export const getSlideById = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found."
      });
    }

    res.status(200).json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Slide
|--------------------------------------------------------------------------
*/

export const updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Slide updated successfully.",
      data: slide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Slide
|--------------------------------------------------------------------------
*/

export const deleteSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Slide not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Slide deleted successfully."
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
