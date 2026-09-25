import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import type { AuthResponseDTO, LoginDTO } from "../interface/UsuarioDTO.js";

// Segredo JWT (Idealmente migrar para process.env.JWT_SECRET)
const SECRET = process.env.JWT_SECRET || "bananinha";

export class AuthService {
    private usuarioRepository: UsuarioRepository;

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    /**
     * Gera o JWT contendo as claims mínimas necessárias
     */
    public generateToken(id: number, nome: string, email: string, role: string): string {
        return jwt.sign({ id, nome, email, role }, SECRET, { expiresIn: "1h" });
    }

    /**
     * Valida credenciais e gera o token de autenticação
     */
     async autenticar(credenciais: LoginDTO): Promise<{ status: number; data: AuthResponseDTO }> {
        if (!credenciais.email || !credenciais.senha) {
            return {
                status: 400,
                data: { auth: false, token: null, message: "Email e senha são obrigatórios" }
            };
        }

        const usuario = await this.usuarioRepository.findByEmail(credenciais.email);

        // Se o usuário não existir ou a conta estiver desativada
        if (!usuario || usuario.situacao === false) {
            return {
                status: 401,
                data: { auth: false, token: null, message: "Usuário e/ou senha incorretos" }
            };
        }

        // Comparação de senha
        // NOTA: Se no futuro utilizarem bcrypt, aqui entraria: await bcrypt.compare(senha, usuario.senha)
        const senhaCorreta = usuario.senha === credenciais.senha;

        if (!senhaCorreta) {
            return {
                status: 401,
                data: { auth: false, token: null, message: "Usuário e/ou senha incorretos" }
            };
        }

        // Geração do token
        const token = this.generateToken(Number(usuario.id), usuario.nome, usuario.email, usuario.role);

        return {
            status: 200,
            data: {
                auth: true,
                token,
                usuario: {
                    id_usuario: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                    situacao: usuario.situacao
                }
            }
        };
    }
}