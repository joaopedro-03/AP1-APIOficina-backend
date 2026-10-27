# API de Oficina Mecânica — AP2

## Descrição do projeto

Este projeto foi desenvolvido para a disciplina de Backend, utilizando C# e ASP.NET Core com .NET 10.

O objetivo é criar uma API para gerenciar ordens de serviço de uma oficina mecânica, permitindo cadastrar, listar, buscar, atualizar e excluir registros.

Na AP1, os dados eram armazenados em uma lista na memória. Na AP2, o projeto foi atualizado para utilizar **Entity Framework Core e SQLite**, permitindo que os registros continuem armazenados mesmo após reiniciar a aplicação.

Também foi integrado um frontend desenvolvido com HTML, CSS e JavaScript, permitindo realizar as operações diretamente pelo navegador.

## Tecnologias utilizadas

- C#
- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- SQLite
- HTML, CSS e JavaScript
- Bruno (testes da API)
- Git e GitHub

## Funcionalidades

- Cadastrar uma nova ordem de serviço.
- Listar todas as ordens cadastradas.
- Buscar uma ordem pelo ID.
- Atualizar os dados de uma ordem.
- Alterar a situação entre Pendente e Concluída.
- Excluir uma ordem de serviço.
- Armazenar os dados no banco SQLite.
- Gerenciar ordens pelo frontend integrado.

## Estrutura do projeto

```text
ApiOficina/
├── Program.cs
├── ApiOficina.csproj
├── appsettings.json
├── appsettings.Development.json
├── Migrations/
├── wwwroot/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── bruno/
├── .gitignore
└── README.md
```

A pasta `wwwroot` contém a interface do sistema, enquanto o `Program.cs` contém os endpoints da API, o Model e o DbContext.

A pasta `Migrations` contém os arquivos utilizados para criar e atualizar a estrutura do banco SQLite.

A Collection do Bruno contém as requisições utilizadas nos testes do CRUD.

## Como executar o projeto

### Requisitos

- .NET 10 SDK instalado.
- Visual Studio Code ou outra IDE compatível.
- Ferramenta `dotnet-ef` versão 10.
- Bruno para testar os endpoints.

### 1. Clonar o repositório

Clone este repositório pelo Git ou faça o download dos arquivos e abra a pasta `ApiOficina` no VS Code.

### 2. Restaurar as dependências

No terminal, execute:

```bash
dotnet restore
```

### 3. Preparar o banco de dados

Se a ferramenta `dotnet-ef` ainda não estiver instalada, execute:

```bash
dotnet tool install --global dotnet-ef --version "10.0.*"
```

Depois, execute:

```bash
dotnet ef database update
```

Esse comando aplica as migrations e prepara o banco SQLite para utilização.

Não é necessário enviar o arquivo local do banco ao GitHub, pois ele pode ser preparado utilizando as migrations.

### 4. Compilar o projeto

```bash
dotnet build
```

O projeto deve compilar sem erros.

### 5. Executar a API

```bash
dotnet run --urls http://localhost:5050
```

A aplicação será iniciada no endereço:

http://localhost:5050

## Rotas da API

| Método | Endpoint | Descrição | Status |
|---|---|---|---|
| GET | /api/ordens | Lista todas as ordens | 200 |
| GET | /api/ordens/{id} | Busca uma ordem pelo ID | 200 ou 404 |
| POST | /api/ordens | Cadastra uma ordem | 201 |
| PUT | /api/ordens/{id} | Atualiza uma ordem | 200 ou 404 |
| DELETE | /api/ordens/{id} | Exclui uma ordem | 204 ou 404 |

## Exemplo de JSON

Para cadastrar uma ordem de serviço pelo Bruno, utilize o método POST com a seguinte URL:

http://localhost:5050/api/ordens

No Body, selecione JSON e informe:

```json
{
  "cliente": "João Pedro",
  "veiculo": "Corsa Classic",
  "servico": "Troca de óleo",
  "valor": 150.00,
  "concluida": false
}
```

Ao cadastrar uma ordem, a API retorna o código HTTP `201 Created` e o objeto cadastrado com seu ID.

O ID é gerado pelo banco de dados.

## Model e DbContext

A classe `OficinaEntity` representa uma ordem de serviço e possui os seguintes campos:

- `Id`: identificador da ordem.
- `cliente`: nome do cliente.
- `veiculo`: veículo do cliente.
- `servico`: descrição do serviço.
- `valor`: valor cobrado pelo serviço.
- `concluida`: indica se a ordem está concluída ou pendente.

A classe `ApiDbContext` é responsável pela comunicação com o banco SQLite através do Entity Framework Core.

As operações de cadastro, atualização e exclusão utilizam o método `SaveChangesAsync()` para gravar as alterações no banco de dados.

## Frontend integrado

O frontend foi desenvolvido com HTML, CSS e JavaScript e está localizado na pasta `wwwroot`.

Para acessar a interface, execute a aplicação e abra:

http://localhost:5050

A interface permite:

- Visualizar as ordens cadastradas.
- Cadastrar novas ordens.
- Consultar os detalhes de uma ordem.
- Editar informações.
- Alterar a situação da ordem.
- Excluir registros.
- Pesquisar e filtrar ordens por situação.
- Visualizar indicadores das ordens cadastradas.

O JavaScript utiliza `fetch()` para enviar requisições aos endpoints reais da API.

Os dados exibidos são consultados no banco SQLite através do backend, sem depender de uma lista fictícia no navegador.

## Testes realizados no Bruno

As operações da API foram testadas utilizando o Bruno.

A Collection contém requisições para:

1. POST — Cadastrar ordem de serviço.
2. GET — Listar ordens.
3. GET por ID — Consultar uma ordem.
4. PUT — Atualizar uma ordem.
5. DELETE — Excluir uma ordem.
6. GET após exclusão — Confirmar resposta 404.

Também foi realizado o teste de persistência, reiniciando a aplicação e verificando que os registros não excluídos continuam disponíveis.

## Persistência dos dados

Os registros são armazenados no SQLite utilizando Entity Framework Core.

Diferentemente da AP1, em que os dados eram mantidos em memória, agora as ordens permanecem salvas mesmo após encerrar e reiniciar a API.

O banco local não é enviado ao repositório. Sua estrutura é recriada utilizando o comando:

```bash
dotnet ef database update
```

## Vídeo de demonstração — AP2

**Link do vídeo:** https://drive.google.com/file/d/1y3ATvwn4Un0b1i6tQAoBgF64Vfw8d4qp/view?usp=sharing

O vídeo demonstra:

- Apresentação do projeto e sua estrutura.
- Inicialização da API.
- Explicação do Model, DbContext e SQLite.
- Testes das operações CRUD no Bruno.
- Respostas HTTP 201, 200, 204 e 404.
- Integração do frontend com a API real.
- Cadastro, listagem, edição e exclusão pelo navegador.
- Persistência de dados após reiniciar a aplicação.

O vídeo está disponível por link público, sem necessidade de solicitar autorização.

## Considerações finais

A AP2 representa uma evolução da API desenvolvida na AP1.

A principal melhoria foi a implementação da persistência de dados com Entity Framework Core e SQLite.

Além disso, o frontend foi integrado aos endpoints reais, permitindo realizar o gerenciamento das ordens de serviço diretamente pela interface.

O projeto demonstra a comunicação entre frontend, backend e banco de dados em uma aplicação ASP.NET Core.AquIQVjLhmBHCULz0n4qXvwedOuBVIh/view?usp=sharing
