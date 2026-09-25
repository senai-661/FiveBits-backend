import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'bananinha';

interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    role: string;
    exp: number;
}

export class Auth {
    /**
     * Middleware de validação do token JWT nas rotas protegidas
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            return res.status(401).json({ message: "Token não informado", auth: false });
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false });
                }
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false });
            }

            if (!decoded) {
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false });
            }

            const { exp, id } = decoded as JwtPayload;

            if (!exp || !id) {
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false });
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false });
            }

            req.headers['userId'] = String(id);
            next();
        });
    }
}