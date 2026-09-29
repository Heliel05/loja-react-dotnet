# 🛒 Sistema de Gestão de Loja (React + .NET)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![.NET](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

Um sistema full-stack concebido para a gestão do catálogo de produtos e categorias, desenvolvido com uma API RESTful em **.NET 10** e uma interface de utilizador moderna e responsiva em **React** com **Tailwind CSS**.

## ✨ Funcionalidades

* **CRUD Completo de Produtos:** Adicionar, listar, editar e eliminar produtos em tempo real.
* **Gestão de Relações:** Associação dinâmica de produtos a categorias carregadas diretamente da base de dados.
* **Interface Responsiva:** Design adaptável a dispositivos móveis e computadores, construído com Tailwind CSS v4.
* **Formatação Localizada:** Exibição de valores monetários nativamente formatados em Real (BRL).
* **Feedback Visual:** Indicadores dinâmicos de disponibilidade em stock (Esgotado / Em Estoque) e de carregamento de dados.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* React 18
* Vite
* Tailwind CSS v4
* Integração assíncrona via API `fetch`

**Back-end:**
* C# / .NET 10
* Entity Framework Core
* Microsoft SQL Server
* OpenAPI / Scalar para a documentação e teste da API

## 🚀 Como Executar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/)
* [.NET 10 SDK](https://dotnet.microsoft.com/)
* SQL Server (instalação local ou via Docker)

### 1. Configurar o Back-end (API)
1. Navegue até à pasta principal do projeto back-end.
2. Verifique e ajuste a string de ligação à base de dados (`DefaultConnection`) no ficheiro `appsettings.json`[cite: 2].
3. Aplique as migrações (se aplicável) e inicie o servidor:
   ```bash
   dotnet run
