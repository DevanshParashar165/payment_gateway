import { body,param,query,validationResult } from "express-validator";
import { Promise } from "mongoose";
import { ApiError } from "./error.middleware";

export const validate = (validations)=>{
    return async(res,req,next)=>{
        await Promise.all(validations.map(validations.run(req)))

        const errors = validationResult(req)
        if(errors.isEmpty()){
            return next();
        }
        const extractedError = errors.array().map(err=>({
            field : err.path,
            message : err.message
        }))

        throw new ApiError("Validation Error")
    }
}

export const commonValidation = {
    pagination : [
        query('page')
             .optional()
             .isInt({min : 1})
             .withMessage('Page must be a positive integer'),
        query("limit")     
             .optional()
             .isInt({min : 1,max:100})
             .withMessage("limit must be between 1 and 100")
    ],
    email : 
      body('email')
          .isEmail()
          .normalizeEmail()
          .withMessage('Please provide a valid email'),
    name : 
       body('name')
           .trim()
           .isLength({min:2,max:50})
           .withMessage('Please provide a valid name')      
}

export const validateSignUp = validate([
    commonValidation.email,
    commonValidation.name
])