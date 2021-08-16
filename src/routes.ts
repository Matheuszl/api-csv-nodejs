import { Request, Response, Router } from "express";
import multer from "multer";

const multerConfig = multer(); //definir um destino definir limites
const router = Router();

//entenda essa linha como:  path/caminho da rota -> midwhere arquivo que vem pelo path
router.post("/animais", multerConfig.single("file"), (request: Request, response: Response) => {

  console.log(request.file);
  return response.send();
});

export { router };