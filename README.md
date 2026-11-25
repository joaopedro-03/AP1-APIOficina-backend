# ApiOficina AS – API de Gerenciamento de Ordens de Serviço

## Sobre o projeto

O ApiOficina é um projeto desenvolvido em C# utilizando ASP.NET Core Minimal API, com o objetivo de gerenciar ordens de serviço de uma oficina mecânica.

O projeto foi desenvolvido como atividade acadêmica, com a evolução de uma API inicialmente simples para uma aplicação com persistência de dados utilizando Entity Framework Core e SQLite.

A aplicação também possui uma interface frontend integrada, permitindo a interação com as funcionalidades da API.

## Tecnologias utilizadas

- C#
- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- SQLite
- HTML5
- CSS3
- JavaScript
- Bruno (testes de API)
- Visual Studio Code

## Estrutura do projeto

```text
ApiOficina/
│
├── Data/
│   └── ApiDbContext.cs
│
├── Dtos/
│
├── Migrations/
│
├── Models/
│   └── OficinaEntity.cs
│
├── wwwroot/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── bruno/
│   └── Collection de requisições
│
├── Program.cs
├── ApiOficina.csproj
├── appsettings.json
├── .gitignore
└── README.md
```

## Organização do projeto

- **Models:** contém as entidades que representam os dados utilizados pela aplicação.
- **Dtos:** contém os objetos de transferência de dados utilizados nas requisições.
- **Data:** contém o contexto do Entity Framework Core, responsável pela comunicação com o banco de dados.
- **Migrations:** armazena as migrações utilizadas para controlar a estrutura do banco de dados.
- **wwwroot:** contém os arquivos do frontend (HTML, CSS e JavaScript).
- **bruno:** contém a Collection com as requisições utilizadas para testar a API.
- **Program.cs:** responsável pela configuração, inicialização, middlewares e definição dos endpoints da aplicação.

## Banco de dados

O projeto utiliza SQLite como banco de dados, integrado ao Entity Framework Core.

A conexão é configurada através da propriedade `DefaultConnection`, localizada no arquivo `appsettings.json`.

O arquivo `ApiDbContext.cs` é responsável por representar o contexto do banco de dados e permitir as operações de consulta, inclusão, atualização e exclusão de registros.

As migrations são utilizadas para controlar as alterações na estrutura do banco de dados.

Os dados são armazenados de forma persistente, permanecendo disponíveis mesmo após o encerramento e a reinicialização da aplicação.

## Funcionalidades

- Cadastro de registros.
- Listagem de registros.
- Consulta de registros por identificador.
- Atualização de informações.
- Exclusão de registros.
- Tratamento de erros e respostas HTTP.
- Interface frontend integrada à API.
- Persistência de dados utilizando SQLite.

## Como executar o projeto

### Pré-requisitos

- .NET 10 SDK instalado.
- Visual Studio Code ou outra IDE compatível.
- Git (opcional).

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entrar na pasta do projeto

```bash
cd ApiOficina
```

### 3. Restaurar as dependências

```bash
dotnet restore
```

### 4. Compilar o projeto

```bash
dotnet build
```

### 5. Executar a aplicação

```bash
dotnet run
```

Após a inicialização, a aplicação estará disponível no endereço informado pelo terminal.

## Testes da API

Os testes das operações da API são realizados utilizando o Bruno.

O projeto possui uma Collection salva na pasta `bruno/`, contendo as requisições utilizadas para validar o funcionamento dos endpoints.

São testadas as seguintes operações:

| Método HTTP | Operação | Resultado esperado |
|---|---|---|
| GET | Listar registros | 200 OK |
| POST | Cadastrar registro | 201 Created |
| GET | Consultar por ID | 200 OK |
| PUT | Atualizar registro | 200 OK |
| DELETE | Excluir registro | 204 No Content |
| GET | Consultar registro inexistente | 404 Not Found |

## Persistência dos dados

Um dos pontos importantes da evolução do projeto foi a implementação da persistência utilizando SQLite e Entity Framework Core.

Para validar essa funcionalidade, é realizado o seguinte procedimento:

1. Cadastrar um novo registro utilizando o Bruno.
2. Consultar o registro para verificar se foi armazenado.
3. Encerrar a aplicação.
4. Iniciar novamente a API.
5. Consultar o mesmo registro utilizando seu identificador.

Dessa forma, é possível verificar que os dados permanecem armazenados mesmo após a reinicialização da aplicação.

## Tratamento de erros

O projeto possui um middleware de tratamento de exceções configurado no `Program.cs`.

Esse mecanismo permite capturar erros internos durante a execução da aplicação e retornar uma resposta padronizada em formato JSON, utilizando o código HTTP 500.

Também existe uma rota de teste de erro para verificar o funcionamento desse mecanismo.

## Frontend

A aplicação possui uma interface frontend integrada ao backend, desenvolvida utilizando:

- HTML para a estrutura das páginas.
- CSS para a estilização.
- JavaScript para a comunicação com a API.

Os arquivos estão organizados dentro da pasta `wwwroot`.

## Vídeo de demonstração — AS

**Link do vídeo:** https://drive.google.com/file/d/1YqqGoAV7dieIpqz_g0qpxSR5TxLVyY4S/view?usp=sharing

## Autor

João Pedro Matos da Rosa

**Projeto:** ApiOficina  
**Linguagem:** C#  
**Framework:** ASP.NET Core Minimal API  
**Banco de dados:** SQLite
