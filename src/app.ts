import { DatabaseModel } from "./model/DatabaseModel.js";
import { server } from "./server.js";

const port: number = 3333; //Define a porta que o servidor vai executar

//Liga o servidor HTTP
server.listen(port, () => {
    console.log(`Servidor executando no endereço: http://localhost:${port}`);
});

// No momento, a verificação de conexão com o banco de dados está desativada
new DatabaseModel().testeConexao().then((resbd) => {
    if (resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
});