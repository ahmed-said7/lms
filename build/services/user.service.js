"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
// import { redis } from "../utils/redis";
const user_model_1 = __importDefault(require("../models/user.model"));
// get user by id
const getUserById = async (id, res) => {
    // const userJson = await redis.get(id);
    const user = await user_model_1.default.findById(id);
    // if (userJson) {
    //  / const user = JSON.parse(userJson);
    res.status(201).json({
        success: true,
        user,
    });
    // }
};
exports.getUserById = getUserById;
// Get All users
const getAllUsersService = async (res) => {
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = async (res, id, role) => {
    const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
};
exports.updateUserRoleService = updateUserRoleService;
