# Projeto Teste

Este repositório é um projeto de referência Angular 20 padronizado conforme as diretrizes do MITH (Modelo Interno de Trabalho Homologado). Ele serve como base para aplicações escaláveis, organizadas e modulares.

## Tecnologias

- Angular 20 com Standalone Components
- TailwindCSS para estilo
- Reactive Forms com validação via Yup
- Comunicação com API usando Api Services + Interceptors

## Estrutura de Pastas

```
src/
├── app/
│   ├── auth/
│   │   ├── pages/
│   │   │   └── login.page.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth-token.interceptor.ts
│   │   │   └── auth-error.interceptor.ts
│   │   ├── service/
│   │   │   └── auth.service.ts
│   ├── api/
│   │   ├── auth/
│   │   │   ├── auth.api.service.ts
│   │   │   └── auth.api.types.ts
│   │   ├── users/
│   │   │   ├── user.api.service.ts
│   │   │   └── user.api.types.ts
│   │   └── products/
│   │   │   ├── product.api.service.ts
│   │   │   └── product.api.types.ts
│   ├── core/
│   │   ├── interceptors/
│   │   │   └── api.headers.interceptor.ts
│   │   ├── services/
│   │   │   └── form-validation/
│   │   │       └── form-validator.service.ts
│   │   ├── tokens/
│   │   │   └── api-base-url.token.ts
│   │   └── utils/
│   │       ├── createFormFromSchema.ts
│   │       ├── date.utils.ts
│   │       ├── string.utils.ts
│   │       └── number.utils.ts
│   ├── environments/
│   │   └── environment.ts
│   ├── design/
│   │   ├── theme/
│   │   │   ├── theme.service.ts
│   │   │   └── theme.types.ts
│   │   └── tailwind/
│   │       └── base.css
│   ├── layouts/
│   │   ├── layout-blank/
│   │   │   ├── layout-blank.component.html
│   │   │   └── layout-blank.component.ts
│   │   ├── layout-main/
│   │   │   ├── layout-main.component.html
│   │   │   └── layout-main.component.ts
│   │   └── components/
│   │       ├── footer/
│   │       │   ├── footer.component.html
│   │       │   └── footer.component.ts
│   │       ├── navbar/
│   │       │   ├── navbar.component.html
│   │       │   └── navbar.component.ts
│   │       └── sidebar/
│   │       │   ├── sidebar.component.html
│   │       │   └── sidebar.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── form/
│   │   │   │   ├── autocomplete/
│   │   │   │   │   ├── autocomplete.component.html
│   │   │   │   │   └── autocomplete.component.ts
│   │   │   │   ├── checkbox/
│   │   │   │   │   ├── checkbox.component.html
│   │   │   │   │   └── checkbox.component.ts
│   │   │   │   ├── input/
│   │   │   │   │   ├── input.component.html
│   │   │   │   │   └── input.component.ts
│   │   │   │   ├── radio/
│   │   │   │   │   ├── radio.component.html
│   │   │   │   │   └── radio.component.ts
│   │   │   │   └── select/
│   │   │   │       ├── select.component.html
│   │   │   │       └── select.component.ts
│   │   │   └── toast/
│   │   │       ├── toast.component.html
│   │   │       ├── toast.component.ts
│   │   │       └── toast.service.ts
│   │   ├── pipes/
│   │   └── directives/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   └── login/
│   │   │   │       ├── login.page.html
│   │   │   │       ├── login.page.page.ts
│   │   │   │       └── login.schema.page.ts
│   │   │   └── auth.routes.ts
│   │   ├── products/
│   │   │   ├── pages/
│   │   │   │   ├── product.page.html
│   │   │   │   ├── product.page.ts
│   │   │   │   └── product.schema.ts
│   │   │   └── product.routes.ts
│   ├── app.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
└── main.ts
public/
│   └── assets/
│       ├── logo.png
│       └── favicon.ico
scripts/
└── generate-env.js
```


## Padrões Adotados

- Componentes standalone
- Formulários com createFormFromSchema
- Schemas Yup centralizados
- Tipagens organizadas em `shared/interfaces`, `types`, `enums`
- Comunicação com backend via arquivos `*.api-service.ts`

A documentação completa está incluída no projeto.


