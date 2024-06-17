import quizModel from "./../models/quiz.model";
import express, { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import questionModel from "../models/question.model";

export const createQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (req.params.quizId) data.quiz = req.params.quizId;
      const question = await questionModel.create(req.body);
      const quizQ = await quizModel.findById(question.quiz);

      //console.log(quizQ);
      quizQ.totalDegree += question.degree;
      await quizQ?.save();
      res.status(201).json({
        success: true,
        question,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await questionModel.findById({
        _id: req.params.questionId,
      });
      if (!question) {
        return next(new ErrorHandler("quesion not found ", 404));
      }
      const quizQ = await quizModel.findById(question.quiz);
      //console.log(quizQ);
      quizQ.totalDegree -= question.degree;
      await questionModel.findOneAndDelete({
        _id: req.params.questionId,
      });
      await quizQ?.save();
      res.status(204).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      let question;
      if (req.params.quizId) data.quiz = req.params.quizId;
      if (req.body.degree) {
        //delete degree before update
        question = await questionModel.findOneAndUpdate(
          { _id: req.params.questionId },
          data,
          { new: false }
        );
        //console.log(question);
        const quizQ = await quizModel.findById(question.quiz);
        //console.log(quizQ);
        quizQ.totalDegree -= question.degree;

        //console.log(quizQ);
        quizQ.totalDegree += req.body.degree;
        //console.log(quizQ.totalDegree);
        await quizQ?.save();
      } else {
        question = await questionModel.findOneAndUpdate(
          { _id: req.params.questionId },
          data,
          { new: true }
        );
      }
      res.status(200).json({
        success: true,
        question,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllQuestions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* 
      const user = await userModel.findById(req.user?.id);
      user?.courses.map((el) => {
        console.log(el._id);
      });
*/
      let fliter = {};
      if (req.params.quizId) fliter = { quiz: req.params.quizId };
      const quesions = await questionModel.find(fliter);
      res.status(200).json({
        success: true,
        quesions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
