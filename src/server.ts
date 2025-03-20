import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const server = express();

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Rotas


server.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando em ${process.env.BASE_URL}`)
})