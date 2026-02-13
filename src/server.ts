import express from "express"; //Importa o pacote express
import cors from "cors"; //Importa o pacote CORS
import { router } from "./routes.js" //Importa a configuração das rotas

const server = express(); //Cria um servidor HTTP
server.use(cors()); //Configura o servidor para usar o CORS
server.use(express.json()); //Configura o servidor para usar o JSON
server.use(router); //Adiciona as rotas ao servidor HTTP

export { server }; //Exporta o servidor