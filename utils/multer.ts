import { Request } from "express";
import multer from "multer";
import ErrorHandler from "./ErrorHandler";

const uploadImage=()=>{
    const storage=multer.diskStorage({ });
    const filter=function(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback){
        if(file.mimetype.startsWith('image')){
            return cb( null , true );
        }else{
            return cb( new ErrorHandler('required file of type image',400)  );
        };
    };
    return multer({storage,fileFilter:filter});
};

export { uploadImage };