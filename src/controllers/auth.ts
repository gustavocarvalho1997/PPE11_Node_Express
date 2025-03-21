import { hash } from 'bcrypt-ts';
import type { Request, Response } from 'express';
import slug from 'slug';
import { signupSchema } from '../schemas/signup';
import { createUser, findUserByEmail, findUserBySlug } from '../services/user';
import { createJWT } from '../utils/jwt';

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
    const hashPassword = await hash(safeData.data.password, 10);
    // cria o usuário
    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword,
    });
    // cria o token
    const token = createJWT(userSlug);
    // retorna o resultado {token, user}
    response.status(201).json({
        token,
        user: {
            name: newUser.name,
            slug: newUser.slug,
            avatar: newUser.avatar,
        },
    });
};
