# ClipFlow SaaS - Arquitetura Técnica

## 1. Visão Geral do Projeto

**Nome:** ClipFlow
**Tipo:** SaaS - Plataforma de criação de clips de vídeo com IA
**Descrição:** Plataforma que permite upload de vídeos longos, geração automática de clips otimizados para redes sociais, edição profissional, e publicação automatizada.

---

## 2. Stack Tecnológica

### Frontend
- **Framework:** React 18 com TypeScript
- **Build:** Vite
- **Estilização:** Tailwind CSS + Framer Motion
- **Estado:** React Context + Hooks
- **HTTP:** Axios
- **Ícones:** Lucide React

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Cache:** Redis
- **Auth:** JWT + Google OAuth
- **Payments:** Stripe
- **AI:** OpenRouter (GPT, Claude, Gemini)
- **Video:** FFmpeg

### Infraestrutura
- **Container:** Docker + Docker Compose
- **Storage:** Local (dev) / S3 (prod)

---

## 3. Modelagem de Dados

### Entidades Principais

```prisma
// Usuários e Autenticação
User {
  id: UUID
  email: String (unique)
  passwordHash: String?
  name: String
  avatar: String?
  googleId: String? (unique)
  role: Enum (USER, ADMIN)
  plan: Enum (FREE, STARTER, PRO, BUSINESS, ENTERPRISE)
  credits: Int
  stripeCustomerId: String?
  stripeSubscriptionId: String?
  createdAt: DateTime
  updatedAt: DateTime
}

Session {
  id: UUID
  userId: UUID (FK)
  token: String (unique)
  expiresAt: DateTime
  createdAt: DateTime
}

// Workspace (Times)
Workspace {
  id: UUID
  name: String
  ownerId: UUID (FK User)
  plan: Enum
  members: WorkspaceMember[]
  createdAt: DateTime
}

WorkspaceMember {
  id: UUID
  workspaceId: UUID (FK)
  userId: UUID (FK)
  role: Enum (OWNER, ADMIN, MEMBER)
  invitedBy: UUID (FK User)?
  joinedAt: DateTime
}

// Vídeos e Processamento
Video {
  id: UUID
  userId: UUID (FK)
  workspaceId: UUID (FK)?
  title: String
  description: String?
  originalUrl: String?
  filePath: String?
  duration: Int (segundos)
  thumbnail: String?
  status: Enum (UPLOADING, PROCESSING, READY, ERROR)
  transcript: Text?
  metadata: JSON?
  creditsUsed: Int
  createdAt: DateTime
  updatedAt: DateTime
}

// Clips Gerados
Clip {
  id: UUID
  videoId: UUID (FK)
  userId: UUID (FK)
  title: String
  description: String?
  startTime: Int
  endTime: Int
  duration: Int
  viralScore: Int (0-100)
  scoreReason: String?
  thumbnail: String?
  filePath: String?
  status: Enum (PENDING, PROCESSING, READY, ERROR)
  aspectRatio: Enum (9:16, 16:9, 1:1, 4:5)
  createdAt: DateTime
}

// Análise de Clip
ClipAnalysis {
  id: UUID
  clipId: UUID (FK)
  viralScore: Int
  scoreReason: String
  highlights: String[]
  suggestedHashtags: String[]
  suggestedTitle: String?
  engagementPrediction: Float?
  targetAudience: String?
  bestTimeToPost: DateTime?
  createdAt: DateTime
}

// Legendas e Templates
CaptionTemplate {
  id: UUID
  name: String
  description: String?
  style: JSON (font, colors, position, animation)
  previewUrl: String?
  isPremium: Boolean
  isDefault: Boolean
  usageCount: Int
  createdAt: DateTime
}

Caption {
  id: UUID
  clipId: UUID (FK)
  templateId: UUID (FK)?
  content: Text
  style: JSON
  position: String
  animation: String?
  createdAt: DateTime
}

// Redes Sociais
SocialAccount {
  id: UUID
  userId: UUID (FK)
  platform: Enum (YOUTUBE, FACEBOOK, INSTAGRAM, TIKTOK)
  accountId: String
  accountName: String
  accessToken: String (encrypted)
  refreshToken: String? (encrypted)
  tokenExpiresAt: DateTime?
  isActive: Boolean
  connectedAt: DateTime
}

// Publicações
Post {
  id: UUID
  userId: UUID (FK)
  clipId: UUID (FK)
  socialAccountId: UUID (FK)
  platform: Enum
  status: Enum (DRAFT, SCHEDULED, PUBLISHED, FAILED)
  scheduledAt: DateTime?
  publishedAt: DateTime?
  platformPostId: String?
  platformUrl: String?
  error: String?
  createdAt: DateTime
}

// Analytics
Analytics {
  id: UUID
  postId: UUID (FK)
  views: Int?
  likes: Int?
  comments: Int?
  shares: Int?
  engagement: Float?
  fetchedAt: DateTime
}

// Configurações Admin
PlatformSettings {
  id: UUID
  key: String (unique)
  value: Text
  description: String?
  updatedAt: DateTime
}

// Billing
Invoice {
  id: UUID
  userId: UUID (FK)
  stripeInvoiceId: String?
  amount: Int (cents)
  currency: String
  status: Enum (PENDING, PAID, FAILED, CANCELLED)
  periodStart: DateTime
  periodEnd: DateTime
  paidAt: DateTime?
  createdAt: DateTime
}

// Motion Graphics (Gerador de Vídeo)
MotionProject {
  id: UUID
  userId: UUID (FK)
  title: String
  prompt: Text?
  audioPath: String?
  transcript: Text?
  status: Enum (DRAFT, PROCESSING, READY, ERROR)
  outputPath: String?
  duration: Int?
  createdAt: DateTime
}
```

---

## 4. API Endpoints

### Auth
| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | /api/auth/register | Registro com email/senha |
| POST | /api/auth/login | Login com email/senha |
| POST | /api/auth/google | Login/Registro Google OAuth |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Dados do usuário atual |
| POST | /api/auth/refresh | Refresh token |

### Users
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/users/profile | Perfil do usuário |
| PUT | /api/users/profile | Atualizar perfil |
| PUT | /api/users/password | Alterar senha |
| DELETE | /api/users/account | Deletar conta |

### Videos
| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | /api/videos/upload | Upload de vídeo |
| POST | /api/videos/from-url | Importar de URL (YouTube) |
| GET | /api/videos | Listar vídeos do usuário |
| GET | /api/videos/:id | Detalhes do vídeo |
| DELETE | /api/videos/:id | Deletar vídeo |
| GET | /api/videos/:id/transcript | Transcrição do vídeo |

### Clips
| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | /api/clips/generate | Gerar clips automaticamente |
| GET | /api/clips | Listar clips do usuário |
| GET | /api/clips/:id | Detalhes do clip |
| PUT | /api/clips/:id | Editar clip |
| DELETE | /api/clips/:id | Deletar clip |
| GET | /api/clips/:id/analysis | Análise do clip |
| POST | /api/clips/:id/export | Exportar clip |

### Caption Templates
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/captions/templates | Listar templates |
| GET | /api/captions/templates/:id | Detalhes do template |
| POST | /api/captions/templates | Criar template |
| PUT | /api/captions/templates/:id | Editar template |
| DELETE | /api/captions/templates/:id | Deletar template |
| POST | /api/clips/:id/caption | Aplicar caption ao clip |

### Social Accounts
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/social/accounts | Listar contas conectadas |
| POST | /api/social/connect/:platform | Conectar conta |
| DELETE | /api/social/accounts/:id | Desconectar conta |
| GET | /api/social/auth/:platform | Iniciar OAuth da plataforma |

### Posts
| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | /api/posts | Criar post |
| GET | /api/posts | Listar posts |
| GET | /api/posts/:id | Detalhes do post |
| PUT | /api/posts/:id | Editar post |
| DELETE | /api/posts/:id | Deletar post |
| POST | /api/posts/:id/publish | Publicar agora |
| POST | /api/posts/:id/schedule | Agendar post |

### Analytics
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/analytics/overview | Overview de analytics |
| GET | /api/analytics/posts | Analytics por posts |
| GET | /api/analytics/engagement | Métricas de engajamento |

### Billing
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/billing/plans | Listar planos |
| POST | /api/billing/subscribe | Assinar plano |
| GET | /api/billing/subscription | Assinatura atual |
| PUT | /api/billing/subscription | Alterar plano |
| DELETE | /api/billing/subscription | Cancelar assinatura |
| GET | /api/billing/invoices | Listar faturas |

### Motion Graphics
| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | /api/motion/generate | Gerar vídeo com IA |
| GET | /api/motion/projects | Listar projetos |
| GET | /api/motion/projects/:id | Detalhes do projeto |
| DELETE | /api/motion/projects/:id | Deletar projeto |

### Admin
| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | /api/admin/settings | Configurações da plataforma |
| PUT | /api/admin/settings | Atualizar configurações |
| GET | /api/admin/users | Listar usuários |
| GET | /api/admin/stats | Estatísticas globais |

---

## 5. Fluxos Principais

### 5.1 Upload e Processamento de Vídeo
```
1. Usuário faz upload de vídeo (drag & drop)
2. Backend salva arquivo e cria registro Video
3. Worker processa vídeo (FFmpeg):
   - Gera thumbnail
   - Extrai áudio
   - Transcreve com Whisper
4. Retorna transcrição para frontend
5. Usuário inicia geração de clips
```

### 5.2 Geração de Clips
```
1. Usuário solicita geração de clips
2. Backend analisa transcrição com LLM
3. Identifica momentos relevantes
4. Gera clip com FFmpeg (corte)
5. Calcula Viral Score
6. Salva clips no banco
7. Retorna lista de clips com scores
```

### 5.3 Publicação em Redes Sociais
```
1. Usuário conecta contas sociais (OAuth)
2. Seleciona clip para publicar
3. Escolhe plataforma e horário
4. Sistema agenda post
5. No horário, publica via API da plataforma
6. Coleta analytics
```

### 5.4 Motion Graphics
```
1. Usuário faz upload de áudio ou escreve prompt
2. Sistema transcreve áudio
3. Gera visualizações com IA (React Motion Graphics)
4. Sincroniza com áudio
5. Renderiza vídeo final
```

---

## 6. Estrutura de Pastas

```
clipflow-saas/
├── apps/
│   ├── web/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes reutilizáveis
│   │   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── services/       # API calls
│   │   │   ├── context/        # React Context
│   │   │   ├── utils/          # Utilitários
│   │   │   ├── types/          # TypeScript types
│   │   │   └── styles/         # Estilos globais
│   │   ├── public/
│   │   ├── e2e/                # Testes Playwright
│   │   └── package.json
│   │
│   └── api/                    # Backend Node.js
│       ├── src/
│       │   ├── controllers/    # Controllers
│       │   ├── services/       # Lógica de negócio
│       │   ├── middleware/     # Middlewares
│       │   ├── routes/         # Rotas
│       │   ├── utils/          # Utilitários
│       │   ├── types/          # Types
│       │   └── index.ts        # Entry point
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml
│   ├── api.Dockerfile
│   └── web.Dockerfile
│
├── .env.example
├── package.json
└── README.md
```

---

## 7. Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/clipflow

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Stripe
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx

# AI
OPENROUTER_API_KEY=sk-or-xxx
DEFAULT_AI_MODEL=openai/gpt-4o

# Video Processing
FFMPEG_PATH=/usr/bin/ffmpeg
VIDEO_STORAGE_PATH=/storage/videos

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## 8. Modelos de IA Suportados

| Modelo | Provider | Uso |
|--------|----------|-----|
| gpt-4o | OpenAI | Análise de clips |
| gpt-4o-mini | OpenAI | Tasks simples |
| claude-3.5-sonnet | Anthropic | Análise avançada |
| gemini-1.5-pro | Google | Multimodal |
| moonshotai/kimi-k2.5 | OpenRouter | Padrão |

---

## 9. Planos e Credits

| Plano | Preço | Credits/mês | Features |
|-------|-------|-------------|----------|
| Free | $0 | 60 | MVP básico, watermark |
| Starter | $19 | 300 | Sem watermark, 1080p |
| Pro | $49 | 1000 | Editor, analytics, scheduling |
| Business | $119 | Ilimitado | Equipe, API, brand kit |
| Enterprise | Custom | Custom | White label, SLA |

---

## 10. Referências

- Opus Clip: opus.pro
- Quso.ai: quso.ai
- Dify: github.com/langgenius/dify
- Stripe: stripe.com/docs
- Google OAuth: developers.google.com/identity/protocols/oauth2

