# Worktime Assist Mobile

Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento de pausas de trabalho.

## Integrantes

- [Adicione os nomes dos integrantes aqui]

## Descrição da Solução

Este aplicativo foi desenvolvido como parte da Global Solution e permite que usuários gerenciem suas pausas de trabalho de forma eficiente. O app oferece funcionalidades completas de CRUD (Create, Read, Update, Delete) para pausas, integração com API RESTful desenvolvida em Java, e uma interface moderna e intuitiva.

### Funcionalidades

- **Home**: Visualização de pausas recentes e acesso rápido às principais funcionalidades
- **Nova Pausa**: Criação de novas pausas com diferentes tipos (almoço, café, banheiro, descanso, reunião, outro)
- **Histórico**: Visualização completa de todas as pausas registradas, agrupadas por data
- **Detalhes**: Visualização, edição e exclusão de pausas individuais
- **Configurações**: Configuração da URL da API e preferências de tema

### Tecnologias Utilizadas

- React Native
- Expo
- Expo Router (navegação baseada em arquivos)
- TypeScript
- Axios (requisições HTTP)
- AsyncStorage (armazenamento local)

## Link do Vídeo

[Adicione o link do vídeo do YouTube aqui]

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure a URL da API no arquivo `.env` ou nas configurações do app:
```
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Escaneie o QR code com o app Expo Go ou pressione:
   - `a` para Android
   - `i` para iOS
   - `w` para Web

## Estrutura do Projeto

```
app/
├── (tabs)/
│   ├── index.tsx          # Tela Home
│   ├── historico.tsx      # Tela Histórico
│   └── configuracoes.tsx  # Tela Configurações
├── nova-pausa.tsx         # Tela Nova Pausa
├── detalhes/
│   └── [id].tsx          # Tela Detalhes
└── _layout.tsx           # Layout principal

components/
└── ui/                   # Componentes reutilizáveis
    ├── button.tsx
    ├── input.tsx
    └── card.tsx

services/
└── api.ts                # Configuração e serviços da API

types/
└── pausa.ts              # Tipos TypeScript

utils/
├── storage.ts            # Utilitários de armazenamento
└── formatters.ts         # Utilitários de formatação
```

## Integração com API

O aplicativo se integra com a API Java disponível em: https://github.com/davivsouza/worktime-assist-java

### Endpoints Utilizados

- `GET /pausas` - Listar todas as pausas
- `GET /pausas/{id}` - Obter pausa por ID
- `POST /pausas` - Criar nova pausa
- `PUT /pausas/{id}` - Atualizar pausa
- `DELETE /pausas/{id}` - Deletar pausa

## Requisitos Atendidos

✅ 5 telas com navegação fluida (Home, Nova Pausa, Histórico, Detalhes, Configurações)
✅ CRUD completo integrado com API
✅ Estilização personalizada com tema claro/escuro
✅ Tratamento de erros e feedback visual
✅ Arquitetura organizada e código limpo
✅ TypeScript para type safety
✅ Expo Router para navegação
