import mongoose, { Document, Model, Schema } from "mongoose";
interface IQuestion extends Document {
  question: String;
  answers: [String];
  correctAnswer: String;
  quiz: Schema.Types.ObjectId;
  degree: Number;
}

const questionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: [true, "a question must have statament"],
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: [true, "a question must belong to a quiz"],
  },
  degree: {
    type: Number,
    default: 1,
    // required: [true, "a quiz must have total degree"],
  },
  answers: [String],
  correctAnswer: String,
});
const questionModel: Model<IQuestion> = mongoose.model(
  "Question",
  questionSchema
);
export default questionModel;
