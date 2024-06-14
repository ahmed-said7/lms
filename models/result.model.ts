import mongoose, { Document, Model, Schema } from "mongoose";
interface IResult extends Document {
  name: String;
  courseId: Schema.Types.ObjectId;
  totalDegree: Number;
  isOpened: boolean;
  questions: [];
}
