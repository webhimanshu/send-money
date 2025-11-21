import { plainToInstance } from "class-transformer"
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express"

export const validateDto = (DtoClass: any)=> {
    return async (req: Request, resp: Response, next: NextFunction) => {
        const dto = plainToInstance(DtoClass, req.body);
        const errors = await validate(dto);

        if(errors.length > 0){
            const messages = errors.map((err)=> Object.values(err.constraints || {}).flat());
            resp.status(400).json({ success: false, message: messages})
        }

        req.body = dto;
        next();
    }
}