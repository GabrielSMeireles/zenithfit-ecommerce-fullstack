# 👕 ZenithFit – Plataforma de E-commerce

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)

> Plataforma de e-commerce para venda de camisetas fitness da marca **ZenithFit**, em desenvolvimento com foco em arquitetura fullstack e simulação de fluxo real de vendas 🛒.

---

## 📄 Sumário

1. [Visão Geral](#-visão-geral)
2. [Principais Funcionalidades](#-principais-funcionalidades)
3. [Arquitetura e Organização](#-arquitetura-e-organização)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Como Executar](#-como-executar)
7. [Fluxo de Uso](#-fluxo-de-uso)
8. [Próximas Etapas](#-próximas-etapas)
9. [Autor](#-autor)

---

## 🔍 Visão Geral

O **ZenithFit** é um sistema de e-commerce desenvolvido para simular uma aplicação real de mercado, contemplando:

* Catálogo de produtos
* Autenticação de usuários
* Carrinho de compras
* Aplicação de cupons de desconto
* Fluxo completo de checkout

Atualmente, o projeto encontra-se na fase de **Front-end estático**, totalmente navegável utilizando **HTML, CSS e JavaScript**.
A migração para **React** e integração com API em **Node.js + Express + PostgreSQL** está planejada como próxima etapa.

---

## ⭐ Principais Funcionalidades (Front-end Atual)

1. **Catálogo de Produtos**

   * Listagem de camisetas fitness.
   * Página individual com detalhes do produto.

2. **Autenticação (Interface)**

   * Tela de login.
   * Tela de cadastro de usuário.

3. **Carrinho de Compras**

   * Visualização de produtos adicionados.
   * Atualização de quantidade.
   * Remoção de itens.

4. **Cupom de Desconto**

   * Campo para inserção de código promocional.
   * Simulação de aplicação de desconto.

5. **Checkout**

   * Fluxo navegável de finalização de compra.
   * Simulação de resumo do pedido.

---

## 🏗️ Arquitetura e Organização

### 📌 Estrutura Atual (Front-end)

O projeto está organizado de forma modular para facilitar a futura migração para React:

* Separação entre estrutura (HTML), estilo (CSS) e comportamento (JavaScript).
* Organização de arquivos por responsabilidade.
* Código preparado para futura componentização.

### 🔄 Evolução Planejada

* Refatoração completa para **React (SPA)**.
* Criação de API REST em **Node.js + Express**.
* Persistência de dados em **PostgreSQL**.
* Implementação de autenticação real com JWT.
* Testes automatizados das rotas da API.

---

## 📂 Estrutura do Projeto

```
zenithfit-ecommerce/
├── index.html                # Página principal
├── produto.html              # Detalhes do produto
├── login.html                # Tela de login
├── cadastro.html             # Tela de cadastro
├── carrinho.html             # Carrinho de compras
├── checkout.html             # Finalização do pedido
│
├── css/
│   └── style.css             # Estilos globais
│
├── js/
│   └── script.js             # Lógica de navegação e interações
│
└── assets/                   # Imagens e recursos visuais
```

---

## 🔧 Tecnologias Utilizadas (até o momento)

| Camada             | Tecnologia                               |
| ------------------ | ---------------------------------------- |
| **Front-end**      | HTML5 • CSS3 • JavaScript (ES6)          |
| **Back-end**       | Node.js • Express *(em desenvolvimento)* |
| **Banco de Dados** | PostgreSQL *(planejado)*                 |
| **Testes**         | Testes automatizados *(planejado)*       |

---

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/zenithfit-ecommerce.git
```

2. Acesse a pasta do projeto.

3. Abra o arquivo `index.html` diretamente no navegador.

> Não é necessário servidor neste estágio do projeto.

---

## 🔄 Fluxo de Uso

1. Acesse a página inicial.
2. Clique em um produto para visualizar detalhes.
3. Adicione ao carrinho.
4. Acesse o carrinho para revisar os itens.
5. Insira um cupom de desconto (simulação).
6. Prossiga para o checkout.
7. Finalize o pedido (fluxo visual).

---

## 🔜 Próximas Etapas

* [ ] Migração do front-end para React
* [ ] Implementação da API REST
* [ ] Integração com banco PostgreSQL
* [ ] Autenticação real com JWT
* [ ] Testes automatizados
* [ ] Deploy da aplicação

---

## 👨‍💻 Autores

**Gabriel Meireles**
Desenvolvedor em formação com foco em Back-end e Fullstack.

**Enzo Albuquerque**
Desenvolvedor em formação e colaborador no desenvolvimento da plataforma.

---

> Projeto em evolução contínua com foco em simular um e-commerce real de mercado.
