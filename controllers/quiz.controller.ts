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
      res.status(200).json({
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

export const getAllQuizes = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let filter = {};
      if (req.params.id) filter = { courseId: req.params.id };
      let quiz = [];
      if (req.user?.role === "admin") {
        //console.log("hello from here 1");
        quiz = await quizModel.find(filter).populate({
          path: "results",
          select: "degree -quiz",
          populate: { path: "user", select: "name" },
        });
        // quiz.map(el=>{
        //   el.populate()
        // })
        //console.log("results", quiz.results);
      } else {
        //req.user?.courses.push({ courseId: "666b97a594238ca851ed4e42" });
        //console.log(req.user?.courses);
        if (req.user?.courses.length === 0) {
          //console.log("helo from 4");
          return next(
            new ErrorHandler(
              "you must enroll to courses first to see courses quizes",
              403
            )
          );
        }
        if (!filter) {
          if (allowUserToQuiz(req.user?.courses, req.params.id)) {
            //console.log("hello from here 2");
            quiz = await quizModel.find({ courseId: req.params.id });
          }
        } else {
          console.log(req.user?.courses);
          quiz = await quizModel.find({
            courseId: { $in: req.user?.courses.courseId },
          });
          //console.log("hello from here 3");
        }
      }
      res.status(200).json({
        success: true,
        result: quiz.length,
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const takeQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quiz = await quizModel.findById(req.params.quizId);
      //req.user?.courses.push({ courseId: "666b97a594238ca851ed4e42" });
      if (!quiz) {
        return next(new ErrorHandler("there is no quiz with this id", 404));
      }
      if (quiz?.startDate > Date.now()) {
        return next(new ErrorHandler("quiz is not started yet", 400));
      }

      if (!allowUserToQuiz(req.user?.courses, quiz.courseId)) {
        return next(new ErrorHandler("you must enroll course first", 403));
      }

      if (quiz?.endDate < Date.now()) {
        return next(new ErrorHandler("sorry quiz time out", 400));
      }
      //checkQuizVaildation(quiz, req, next);
      const questions = await questionModel.find({ quiz: quiz._id });
      res.status(201).json({
        success: true,
        results: questions.length,
        questions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const submitQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quiz = await quizModel.findById(req.params.quizId);
      //req.user?.courses.push({ courseId: "666b97a594238ca851ed4e42" });

      if (!quiz) {
        return next(new ErrorHandler("there is no quiz with this id", 404));
      }
      if (quiz?.startDate > Date.now()) {
        return next(new ErrorHandler("quiz is not started yet", 400));
      }

      if (!allowUserToQuiz(req.user?.courses, quiz.courseId)) {
        return next(new ErrorHandler("you must enroll course first", 403));
      }

      if (quiz?.endDate < Date.now()) {
        return next(
          new ErrorHandler(
            "sorry quiz time out and your answers are not sent",
            400
          )
        );
      }
      //req.body contains question Id and aswar
      const userAnswars = req.body.answars;
      // console.log(userAnswars);
      const user = req.user;
      const quesions = await questionModel.find({ quiz: quiz?._id });
      // console.log(quesions);

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
        quiz: quiz?._id,
        degree: deg,
        totalDegree: quiz?.totalDegree,
        course: courseId,
        user: req.user?.id,
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

const allowUserToQuiz = (courses: [], quizId: any) => {
  let found: boolean = false;
  courses.map((el) => {
    if (el.courseId.toString() === quizId.toString()) {
      found = true;
      return found;
    }
  });
  return found;
};

const checkQuizVaildation = (
  quiz: object,
  req: Request,
  next: NextFunction
) => {
  if (!quiz) {
    return next(new ErrorHandler("there is no quiz with this id", 404));
  }
  if (quiz?.startDate > Date.now()) {
    return next(new ErrorHandler("quiz is not started yet", 400));
  }
  if (!allowUserToQuiz(req.user?.courses, quiz.courseId)) {
    return next(new ErrorHandler("you must enroll course first", 403));
  }
  if (quiz?.endDate < Date.now()) {
    return next(
      new ErrorHandler("sorry quiz time out your answers is not sent", 400)
    );
  }
};

export const getMyResults = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.quizes.length === 0) {
        return next(new ErrorHandler("there is no results to display", 404));
      }

      const myResults = (
        await req.user?.populate({ path: "quizes", select: "-user" })
      ).quizes;
      res.status(201).json({
        success: true,
        result: myResults.length,
        myResults,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
