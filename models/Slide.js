import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Quote text is required"],
      trim: true,
      minlength: [3, "Quote must contain at least 3 characters"],
      maxlength: [500, "Quote cannot exceed 500 characters"]
    },

    backgroundColor: {
      type: String,
      required: true,
      trim: true,
      default: "#3498db"
    },

    textColor: {
      type: String,
      required: true,
      trim: true,
      default: "#ffffff"
    },

    order: {
      type: Number,
      required: true,
      min: 1,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }
  }
);

const Slide = mongoose.model("Slide", slideSchema);

export default Slide;
