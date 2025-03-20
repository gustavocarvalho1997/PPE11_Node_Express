import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { mainRouter } from './routers/main';

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Rotas
server.use(mainRouter);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando em ${process.env.BASE_URL}`);
});
