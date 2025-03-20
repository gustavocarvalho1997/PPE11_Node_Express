import type { Request, Response } from 'express';
import slug from 'slug';
import { signupSchema } from '../schemas/signup';
import { findUserByEmail, findUserBySlug } from '../services/user';

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
    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        response.status(409).json({ error: 'E-mail já cadastrado' });
        return;
    }
    // verificar slug
    let genSlug = true;
    let userSlug = slug(safeData.data.name);
    while (genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            const slugSuffix = Math.floor(Math.random() * 999999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }
    // gerar hash da senha
    // cria o usuário
    // cria o token
    // retorna o resultado {token, user}
    response.json({});
};
