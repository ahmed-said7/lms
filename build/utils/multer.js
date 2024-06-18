"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const ErrorHandler_1 = __importDefault(require("./ErrorHandler"));
const uploadImage = () => {
    const storage = multer_1.default.diskStorage({});
    const filter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            return cb(null, true);
        }
        else {
            return cb(new ErrorHandler_1.default('required file of type image', 400));
        }
        ;
    };
    return (0, multer_1.default)({ storage, fileFilter: filter });
};
exports.uploadImage = uploadImage;
