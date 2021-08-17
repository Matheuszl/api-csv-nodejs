import { Request, Response, Router } from "express";
import { Readable } from "stream"
import readline from "readline";
import multer from "multer";
import { client } from "./database/client";

const multerConfig = multer(); //definir um destino definir limites
const router = Router();

interface Animais {
  id: string;
  name: string;
  nota: number;
}

//entenda essa linha como:  path/caminho da rota -> midwhere arquivo que vem pelo path
router.post("/animais", multerConfig.single("file"), async (request: Request, response: Response) => {

  const { file } = request;
  //const { buffer } = file;
  const buffer = file?.buffer;

  const readbleFile = new Readable();
  readbleFile.push(buffer);
  readbleFile.push(null); //permite a leitura do arquivo

  //apos isso precisa ler linha a linha do meu doc
  const animaisLine = readline.createInterface({
    input: readbleFile
  });

  const animais: Animais[] = [];

  for await (let line of animaisLine) {
    const animaisSplit = line.split(";");
    animais.push({
      id: animaisSplit[0],
      name: animaisSplit[1],
      nota: Number(animaisSplit[2]),
    });
  }


  for await (let { id, name, nota } of animais) {
    await client.animais.create({
      data: {
        id,
        name,
        nota,
      },
    });
  }
  return response.json(animais);
});

export { router };