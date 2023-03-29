import type { NextFunction, Request, Response } from "express";

type IMiddleware = (req: Request, res: Response, next: NextFunction) => any;

export default IMiddleware;
