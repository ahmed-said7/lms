import quizModel from "./../models/quiz.model";
import express, { Request, Response, NextFunction } from "express";

import { CatchAsyncError } from "../middleware/catchAsyncErrors";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  updateQuestion,
} from "../controllers/question.controller";
const questionRouter = express.Router({ mergeParams: true });

questionRouter.post(
  "/create-question",
  isAutheticated,
  authorizeRoles("admin"),
  createQuestion
);
questionRouter.put(
  "/update-question/:questionId",
  isAutheticated,
  authorizeRoles("admin"),
  updateQuestion
);
questionRouter.delete(
  "/delete-question/:questionId",
  isAutheticated,
  authorizeRoles("admin"),
  deleteQuestion
);
questionRouter.get(
  "/getAllQuesions",
  isAutheticated,
  authorizeRoles("admin"),
  getAllQuestions
);
export default questionRouter;
