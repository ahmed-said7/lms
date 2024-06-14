import quizModel from "./../models/quiz.model";
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";

import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";

export const createQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizData = req.body;
      // course id from url
      if (req.params.id) req.body.courseId = req.params.id;

      const quiz = await quizModel.create(quizData);
      res.status(201).json({
        success: true,
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await quizModel.findOneAndUpdate({ _id: quizId }, req.body, {
        new: true,
      });
      if (!quiz) {
        return next(new ErrorHandler("no quiz found", 404));
      }
      res.status(204).json({
        success: true,
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await quizModel.findOneAndDelete({ _id: quizId });
      if (!quiz) {
        return next(new ErrorHandler("no quiz found with this id", 404));
      }
      res.status(204).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.id;
      const quiz = await quizModel.findById(quizId);
      res.status(201).json({
        success: true,
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllQuizes = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*
      const courseId = req.params.id;
      console.log(new mongoose.Types.ObjectId(courseId));
      const user = await userModel.findById(req.user?.id);
      user?.courses.map((el) => {
        console.log(el._id.toString());
      });
      */
      /* console.log(req.user?.courses);
      if (!req.user?.courses.includes({ courseId })) {
        return next( 
          new ErrorHandler("you must enroll to course first to see quizes", 403)
        );
      }
        */
      const quizes = await quizModel.find({});
      res.status(201).json({
        success: true,
        quizes,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
