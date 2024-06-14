import mongoose, { Document, Model, Schema } from "mongoose";
interface IQuiz extends Document {
  name: String;
  courseId: Schema.Types.ObjectId;
  totalDegree: Number;
  isOpened: boolean;
  questions: [];
}

const quizSchema = new Schema<IQuiz>(
  {
    name: {
      type: String,
      required: [true, "a quiz must have a name"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: [true, "a quiz must belong to a course"],
    },
    totalDegree: {
      type: Number,
      //required: [true, "a quiz must have total degree"],
      default: 0,
    },
    isOpened: {
      type: Boolean,
      default: true,
    },
    //questions: [Schema.Types.ObjectId],
  },
  { timestamps: true }
);
const quizModel: Model<IQuiz> = mongoose.model("Quiz", quizSchema);
export default quizModel;
