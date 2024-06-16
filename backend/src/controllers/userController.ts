import { Request, Response } from "express"

export const login = (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Login Successful")
}

