import type { Request, Response } from 'express';
import { signupSchema } from '../schemas/signup';

export const signup = async (request: Request, response: Response) => {
    // Validar os dados recebidos
    const safeData = signupSchema.safeParse(request.body);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    // verificar email
    // verificar slug
    // gerar hash da senha
    // cria o usuário
    // cria o token
    // retorna o resultado {token, user}
    response.json({});
};
