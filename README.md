# Nutri Boost

Sistema web de gerenciamento de pacientes para nutricionistas, desenvolvido como projeto de estudo e portfólio, cobrindo o ciclo completo de desenvolvimento full stack: front-end, back-end, banco de dados e deploy em produção.

**🔗 Aplicação no ar:** [https://nutritionboost.netlify.app](https://nutritionboost.netlify.app)
**🔗 API:** [https://nutri-boost.onrender.com](https://nutri-boost.onrender.com)

> ⚠️ Este projeto foi construído para fins de aprendizado e portfólio, não para uso profissional real. Os dados exibidos são fictícios.

---

## 💡 Sobre o projeto

O Nutri Boost centraliza o acompanhamento de pacientes de nutrição em um só lugar: cadastro, plano alimentar, evolução de peso e composição corporal, observações clínicas, controle de retorno e relatórios.

A ideia nasceu de uma vontade simples: **entender de verdade como uma aplicação web funciona da ponta a ponta**, e não só decorar sintaxe. Comecei sem saber boa parte do que envolve desenvolvimento full stack — nunca tinha configurado um banco relacional do zero, nunca tinha escrito uma API, nunca tinha lidado com autenticação ou colocado algo no ar. Fui aprendendo cada peça conforme a necessidade real do projeto foi aparecendo, testando isoladamente antes de conectar ao todo.

Foi movido por curiosidade genuína: entender a rotina de quem desenvolve full stack no dia a dia, os problemas comuns que aparecem no caminho (e eles aparecem — bastante), e como se resolve cada um com calma, passo a passo.

---

## 🛠️ Tecnologias utilizadas

**Front-end**
- HTML5, CSS3 e JavaScript puro (vanilla JS, sem frameworks)
- Google Fonts (Lora + Montserrat)
- Design responsivo (desktop, tablet e mobile)

**Back-end**
- Node.js
- Express — organização de rotas e middlewares
- bcrypt — criptografia de senhas
- jsonwebtoken (JWT) — autenticação e sessão
- dotenv — variáveis de ambiente
- cors — controle de acesso entre origens

**Banco de dados**
- PostgreSQL — banco relacional, com tabelas normalizadas e chaves estrangeiras para manter a integridade entre pacientes e seus dados (dieta, peso, observações, relatórios)

**Infraestrutura / Deploy**
- Render — hospedagem do back-end (Node) e do banco PostgreSQL
- Netlify — hospedagem do front-end
- Git & GitHub — versionamento e integração contínua com os dois serviços acima

---

## ⚙️ Funcionalidades

- **Autenticação** — cadastro e login de nutricionista, com senha criptografada e sessão via token JWT
- **Dashboard** — visão geral do dia: próximas consultas, lembretes e atendimentos da semana
- **Gestão de pacientes** — cadastrar, listar, filtrar por status, editar e excluir
- **Ficha do paciente**, com abas para:
  - Plano alimentar (refeições e calorias)
  - Evolução de peso e composição corporal (% de gordura e massa magra, com histórico)
  - Observações clínicas (com adição de novas notas)
  - Relatórios
- **Controle de retorno** — status do paciente (ativo, em acompanhamento, aguardando retorno, inativo)
- Páginas de Relatórios, Configurações, Ajuda e Suporte

---

## 🧩 Arquitetura

```
Front-end (Netlify)  ──fetch──▶  Back-end (Render / Node + Express)  ──pg──▶  PostgreSQL (Render)
     HTML/CSS/JS                     Rotas REST + JWT                    6 tabelas relacionadas
```

Todas as rotas que expõem dados de pacientes exigem um token JWT válido, verificado por um middleware de autenticação antes de qualquer consulta ao banco.

### Modelo de dados (simplificado)

```
nutricionistas
    └── pacientes
            ├── composicao_corporal   (histórico de peso, % gordura, % massa magra)
            ├── planos_alimentares    (refeições)
            ├── observacoes           (anotações clínicas)
            └── relatorios            (relatórios gerados)
```

---

## 🚧 Desafios enfrentados

Alguns dos obstáculos reais encontrados ao longo da construção — porque parte do aprendizado está em documentar o que deu errado, não só o que deu certo:

- **Diferenças de sintaxe entre terminais**: descobrir na prática que `curl` no PowerShell não é o `curl` de verdade, e sim um alias para `Invoke-WebRequest`, com parâmetros diferentes.
- **Erros de importação silenciosos**: nomes de arquivo divergentes (`dieta.routes.js` vs `dietas.routes.js`) gerando `Cannot find module` e derrubando o servidor.
- **CORS e SSL em produção**: a conexão que funcionava perfeitamente em `localhost` passou a exigir SSL/TLS ao rodar no banco gerenciado do Render, e o front-end publicado precisou de uma política de CORS explícita para conversar com a API.
- **Variáveis de ambiente e segredos**: entender por que `.env` nunca deve subir ao GitHub, e como recriar essas mesmas variáveis manualmente na interface do provedor de hospedagem.

---

## 🎯 Aprendizados

Este projeto foi, acima de tudo, um exercício de entender o **fluxo real** de desenvolvimento: modelar dados antes de escrever código, testar cada rota isoladamente antes de conectar ao front-end, tratar segurança como parte do projeto desde o início (e não como um adendo), e finalmente publicar a aplicação.

---

## 📂 Estrutura do repositório

```
/
├── backend/
│   ├── src/
│   │   ├── routes/         # rotas da API (pacientes, auth, dieta, observações, relatórios...)
│   │   ├── middlewares/     # middleware de autenticação (JWT)
│   │   ├── db.js            # conexão com o PostgreSQL
│   │   └── server.js        # ponto de entrada da API
│   └── package.json
├── css/
├── js/
├── img/
└── *.html                   # páginas do sistema (dashboard, pacientes, login, etc.)
```

---

## 👤 Autor

Desenvolvido por **Henrique Hideki** como projeto de estudo e portfólio.
