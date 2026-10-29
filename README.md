# Gerenciador de Senhas

Gera senhas fortes e guarda uma lista de senhas no próprio navegador.

## Como rodar

Abra o arquivo `index.html` no navegador (clique duas vezes). Não precisa instalar nada.

## Estrutura

```
gerenciador-senhas/
├── index.html     -> a página
├── css/
│   └── estilo.css -> as cores e o visual
└── js/
    └── app.js     -> a lógica (gerar, salvar, copiar, excluir)
```

## O que ele faz

- Gera senha com tamanho de 6 a 32 caracteres (maiúsculas, minúsculas, números, símbolos)
- Salva site, usuário e senha
- Mostra/oculta, copia e exclui cada senha salva

## Aviso

Projeto de estudo. As senhas ficam no `localStorage` do navegador, sem criptografia.
Não guarde senhas reais aqui.
