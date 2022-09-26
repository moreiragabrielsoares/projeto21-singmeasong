# <p align = "center"> Projeto Sing me a Song </p>


##  :clipboard: Descrição

Trata-se de um projeto de construção de testes para uma aplicação fullstack.
***

## :computer:	 Tecnologias e Conceitos

- Teste de integração e unitários: Jest e Supertest
- Testes e2e: Cypress
- Node.js
- TypeScript
- PostgreSQL

***

## 🏁 Rodando a aplicação

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/moreiragabrielsoares/projeto21-singmeasong.git
```

Depois, dentro de cada pasta (back e front), rode o seguinte comando em ambas para instalar as dependencias.

```
npm install
```

Finalizado o processo, basta rodar os testes
```
Testes unitários (apenas no backend): npm run test:unit
Testes de integração (apenas no backend): npm run test:integration
Testes e2e: inicializar o servidor rodando o comando 'npm run dev' na pasta do back e depois abrir o cypress na pasta do front com 'npx cypress open' 
```
