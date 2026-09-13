# API Oficina Mecânica

## Nome, tema e objetivo

**Nome:** API Oficina Mecânica

**Tema:** Ordem de Serviço de uma Oficina Mecânica

**Objetivo:** Desenvolver uma API REST simples para cadastrar, consultar, atualizar e remover ordens de serviço de uma oficina mecânica.

A API permite gerenciar informações como cliente, veículo, serviço realizado, valor e situação da ordem de serviço.

## Requisito do .NET

O projeto foi desenvolvido utilizando:

- .NET 10
- ASP.NET Core
- Minimal API
- C#

Os dados são armazenados em uma `List<T>` na memória.

Não é utilizado banco de dados.

## Como executar o projeto

Para executar o projeto, abra o terminal na pasta da aplicação e utilize:

```bash
dotnet restore
dotnet run

## URL utilizada nos testes foi:

http://localhost:5050

## metodos e descrição de cada endpoint

| Método | Rota               | Descrição                          |
| ------ | ------------------ | ---------------------------------- |
| GET    | `/`                | Verifica se a API está no ar       |
| GET    | `/api/ordens`      | Lista todas as ordens de serviço   |
| GET    | `/api/ordens/{id}` | Busca uma ordem de serviço pelo ID |
| POST   | `/api/ordens`      | Cadastra uma nova ordem de serviço |
| PUT    | `/api/ordens/{id}` | Atualiza uma ordem de serviço      |
| DELETE | `/api/ordens/{id}` | Remove uma ordem de serviço        |

## Cadastro de ordem de serviço no JSON - POST

{
  "cliente": "Maria Souza",
  "veiculo": "Fiat Uno",
  "servico": "Troca de bateria",
  "valor": 450.00,
  "concluida": false
}

## Atualização de ordem de serviço no JSON - PUT

{
  "cliente": "Maria Souza",
  "veiculo": "Fiat Uno",
  "servico": "Troca de bateria e revisão",
  "valor": 550.00,
  "concluida": true
}

## Armazenamento de dados 

os dados ficam salvos somente na memoria, toda vez que for reiniciado ou encerrado os dados são perdidos, pois não é usado banco de dados

## Testes 

os testes da API foram feitos no Bruno, a collection usada nos testes está na pasta:
bruno/

## Link do vídeo 
