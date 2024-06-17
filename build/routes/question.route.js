"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const question_controller_1 = require("../controllers/question.controller");
const questionRouter = express_1.default.Router({ mergeParams: true });
questionRouter.post("/create-question", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), question_controller_1.createQuestion);
questionRouter.put("/update-question/:questionId", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), question_controller_1.updateQuestion);
questionRouter.delete("/delete-question/:questionId", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), question_controller_1.deleteQuestion);
questionRouter.get("/getAllQuesions", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), question_controller_1.getAllQuestions);
exports.default = questionRouter;
