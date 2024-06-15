import quizModel from "./../models/quiz.model";
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";

import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import questionModel from "../models/question.model";
import resultModel from "../models/result.model";

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
      let courseId = "";
      if (req.params.id) {
        courseId = req.params.id;
      }
      if (!req.user?.role == "admin") {
        const user = await userModel.findById(req.user?.id);

        if (!req.user?.courses.includes({ courseId })) {
          return next(
            new ErrorHandler(
              "you must enroll to course first to see quizes",
              403
            )
          );
        }
      }
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

export const takeQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //req.body contains question Id and aswar
      const userAnswars = req.body.answars;
      // console.log(userAnswars);
      const user = await userModel.findById(req.user?.id);
      const quesions = await questionModel.find({ quiz: req.params.quizId });
      // console.log(quesions);
      const quiz = await quizModel.findById(req.params.quizId);
      const courseId = quiz?.courseId;
      let deg = 0;
      //console.log(data.answars[0].question);
      quesions.map((quesion) => {
        for (let i = 0; i < userAnswars.length; i++) {
          // console.log([i]);
          //console.log(quesion._id.toString());
          //console.log(userAnswars[i].question.toString());
          // console.log("******************************************");
          if (quesion._id.toString() === userAnswars[i].question.toString()) {
            if (quesion.correctAnswer == userAnswars[i].ans) {
              console.log("hello");
              deg = deg + quesion.degree;
            }
          }
        }
      });
      const result = await resultModel.create({
        quiz: req.params.quizId,
        degree: deg,
        totalDegree: quiz?.totalDegree,
        course: courseId,
      });
      user?.quizes.push(result._id);
      await user?.save();
      res.status(201).json({
        success: true,
        result,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
