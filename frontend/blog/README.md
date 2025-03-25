# 🧠 Projeto: Blog Pessoal Integrado com IA para Geração de Currículo

Este projeto é um **blog pessoal integrado**, desenvolvido com **Next.js** e **MongoDB**, inspirado no WordPress. Ele permite que o usuário escreva posts categorizados por áreas do currículo, como "Experiências Profissionais", "Projetos Open Source", "Certificações", entre outras.

Futuramente, esses posts serão utilizados como insumo para um agente de IA gerar automaticamente um currículo estruturado.

---

## 🚀 Tecnologias Utilizadas

- **Next.js** (App Router)
- **Tailwind CSS** + `@tailwindcss/typography`
- **MDX** com `contentlayer` ou `next-mdx-remote`
- **MongoDB** com `mongoose`
- **next-auth** (autenticação)
- **react-hook-form** + `zod` (validação)
- **@heroicons/react** e `clsx` (ícones e estilo)

---

## 📄 Funcionalidades

### ✍️ Criar Post

- **Rota:** `/blog/novo`
- **Campos obrigatórios:**
  - Título
  - Categoria (dropdown)
  - Conteúdo (editor markdown ou MDX)
- **Botão:** "Publicar"

### 📚 Categorias disponíveis

As categorias seguem as seções comuns de um currículo. Exemplos:

- Carta de Apresentação  
- Experiências Profissionais  
- Projetos Open Source  
- Formação Acadêmica  
- Habilidades Técnicas  
- Certificações  
- Idiomas  
- Trabalho Voluntário  
- Premiações  
- Cursos Livres  
- Publicações  
- Participações em Eventos  
- Startups Fundadas  
- Atuação como Mentor  
- Participação em Comunidades  
- Portfólio Visual  
- Soft Skills  
- Ferramentas e Tecnologias  
- Interesses Profissionais  
- Objetivos de Carreira  

> Suporte para até **50 categorias**

### 🗂️ Listagem de Posts

- **Rota:** `/blog`
- Mostra os posts do usuário
- Exibe título, categoria, data e link de edição

### 📄 Página Pública de Post

- **URL:** `/blog/[slug]`
- Renderiza o conteúdo formatado com estilo semelhante ao WordPress

---

## 🧩 Módulo de Transcrições

Permite enviar transcrições de áudio ou texto para serem usadas como base para geração de posts automaticamente via IA.

- **Rota:** `/transcricoes`
- **Funcionalidade:**
  - Enviar texto da transcrição
  - Armazena no MongoDB
  - Endpoint `/api/gerar-post` usa IA (simulada) para gerar conteúdo estruturado
  - Post pode ser salvo como rascunho

---

## ☁️ MongoDB Collections

- `users`: dados de login/autenticação
- `posts`: título, slug, conteúdo, categoria, userId, data
- `transcricoes`: texto original, userId, data, status, postGerado

---

## 🎯 Objetivo Futuro

A camada de IA irá:
- Ler os posts do usuário
- Estruturar os dados por categoria
- Gerar automaticamente um **currículo completo em JSON**
- Oferecer visualizações e downloads no futuro

---

## 📦 Rodando o Projeto

```bash
pnpm install
pnpm dev
