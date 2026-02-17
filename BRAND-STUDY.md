# ClipFlow - Estudo de Marca e Design

## 1. Análise de Nomes

### Nomes Considerados

| Nome | Significado | Disponibilidade | Score |
|------|-------------|------------------|-------|
| **ClipFlow** | Fluxo de clips + velocidade | ✅ .com disponível | ⭐⭐⭐⭐⭐ |
| Viralscape | Paisagem viral | ❌ Indisponível | - |
| ClipGenius | Clipe gênio | ⚠️ Parcial | ⭐⭐⭐ |
| ReelForge | Forjar reels | ✅ .com disponível | ⭐⭐⭐⭐ |
| ShortStack | Stack curto | ⚠️ Parcial | ⭐⭐⭐ |
| ClipCraft | Craft de clips | ✅ .com disponível | ⭐⭐⭐⭐ |
| **ClipPulse** | Pulso dos clips | ✅ .com disponível | ⭐⭐⭐⭐⭐ |

### Nome Escolhido: **ClipFlow**

**Justificativa:**
- Curto e memorável (8 letras)
- Define claramente o produto (clips + fluxo)
- Sonoridade moderna e tecnológica
- .com disponível
- Facilmente expandível (ClipFlow AI, ClipFlow Pro)

---

## 2. Posicionamento de Marca

### Missão
"Democratizar a criação de conteúdo short-form com IA, permitindo que qualquer criador produza vídeos virais de qualidade profissional."

### Visão
"Ser a plataforma líder mundial de criação e distribuição de clips de vídeo com IA, capacit criadores a alcançar seu potencial máximo."

### Valores
- **Inovação**: Sempre na fronteira da tecnologia
- **Acessibilidade**: Poderosos para todos os níveis
- **Qualidade**: Padrões profissionais em tudo
- **Velocidade**: Processamento ultra-rápido
- **Transparência**: Preços claros, sem surpresas

### Diferenciais Competitivos
1. Editor profissional integrado (único no mercado)
2. Analytics nativo (único no mercado)
3. Motion Graphics com IA (diferencial único)
4. Pricing justo com plano free generoso
5. IA contextual que entende tom e público

---

## 3. Paleta de Cores

### Cores Primárias

| Cor | Hex | Uso |
|-----|-----|-----|
| **Electric Purple** | `#8B5CF6` | Primária principal, CTAs |
| **Neon Cyan** | `#06B6D4` | Acentos, highlights |
| **Deep Black** | `#0A0A0F` | Backgrounds |

### Cores Secundárias

| Cor | Hex | Uso |
|-----|-----|-----|
| **Soft White** | `#F8FAFC` | Texto em dark |
| **Muted Gray** | `#64748B` | Textos secundários |
| **Success Green** | `#10B981` | Sucesso, viral score alto |
| **Warning Amber** | `#F59E0B` | Alertas, medium score |
| **Error Red** | `#EF4444` | Erros, low score |

### Gradientes

```css
/* Primary Gradient */
background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);

/* Viral Score Gradient */
background: linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%);

/* Card Glassmorphism */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
```

### Cores por Score de Viralidade

| Range | Cor | Significado |
|-------|-----|-------------|
| 0-30 | `#EF4444` (Red) | Baixo potencial |
| 31-60 | `#F59E0B` (Amber) | Médio potencial |
| 61-80 | `#22C55E` (Green) | Bom potencial |
| 81-100 | `#8B5CF6` (Purple) | Alto potencial viral |

---

## 4. Tipografia

### Fontes Principais

| Uso | Fonte | Weight | Size |
|-----|-------|--------|------|
| **Headings** | Inter | 700/800 | 32-64px |
| **Body** | Inter | 400/500 | 14-18px |
| **Mono/Code** | JetBrains Mono | 400 | 13px |
| **Accent** | Poppins | 600 | 14-20px |

### Escala Tipográfica

```css
/* Headings */
h1 { font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; }
h2 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.01em; }
h3 { font-size: 1.5rem; font-weight: 600; }

/* Body */
p { font-size: 1rem; line-height: 1.6; }
small { font-size: 0.875rem; }

/* Labels */
.label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
```

---

## 5. Layout e Grid

### Sistema de Grid
- **Container**: max-width 1440px
- **Grid**: 12 colunas, gap 24px
- **Margins**: 24px (mobile), 48px (tablet), 80px (desktop)

### Breakpoints

| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile | < 640px | 4 |
| Tablet | 640-1024px | 8 |
| Desktop | 1024-1440px | 12 |
| Wide | > 1440px | 12 (centered) |

---

## 6. Componentes UI

### 6.1 Botões

```typescript
// Variantes
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Estados
- Default: background gradiente
- Hover: scale(1.02) + glow
- Active: scale(0.98)
- Disabled: opacity 0.5
- Loading: spinner + texto
```

### 6.2 Cards

```typescript
// Card padrão com glassmorphism
Card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

// Hover: border mais brilhante, subtle glow
```

### 6.3 Inputs

```typescript
Input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #F8FAFC;
  transition: all 0.2s ease;
}

// Focus: border cyan, subtle glow
// Error: border red + mensagem
```

### 6.4 Viral Score Badge

```typescript
// Badge circular com score
ViralScoreBadge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, {color} 0%, {lighter} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: 0 0 30px {color}40;
}
```

### 6.5 Timeline/Editor

```typescript
// Track de vídeo
Timeline {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 16px;
  height: 120px;
}

// Clips no timeline
Clip {
  background: {color};
  border-radius: 8px;
  min-width: 50px;
  cursor: grab;
  hover: scale(1.05);
}
```

---

## 7. Animações

### 7.1 Micro-interações

```css
/* Botão hover */
.button:hover {
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.3);
}

/* Click */
:active {
  transform: scale(0.98);
}
```

### 7.2 Entrada de Elementos

```typescript
// Staggered fade-in
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### 7.3 Loading States

```css
/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### 7.4 Page Transitions

```typescript
// AnimatePresence para rotas
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

---

## 8. Ícones e Ilustrações

### Sistema de Ícones
- **Primário**: Lucide React
- **Custom**: Ícones específicos para edição de vídeo

### Ícones Custom Necessários
- 🎬 Clip/tesoura
- 📊 Gráfico de viralidade
- 🎵 Áudio/waveform
- ✨ Magic/AI
- 📱 Social platforms
- 💾 Export
- ⏱️ Timeline
- 🎨 Paleta/templates

---

## 9. Landing Page Structure

### Seções

1. **Hero**
   - Headline impactante
   - Subheadline
   - CTA principal
   - Video demo/animação
   - Social proof logos

2. **Features**
   - 6-8 features principais
   - Ícones + texto
   - Alternância izquierda/direita

3. **Como Funciona**
   - 3-4 passos
   - Ilustrações animadas
   - Tempo estimado

4. **Templates**
   - Gallery de modelos de legenda
   - Preview em vídeo real
   - "Ver todos"

5. **Pricing**
   - 4-5 planos
   - Comparação
   - FAQ

6. **Testimonials**
   - Depoimentos
   - Números (usuários, clips gerados)

7. **CTA Final**
   - Última chance
   - Garantias

8. **Footer**
   - Links
   - Social
   - Legal

---

## 10. Voice & Tom

### Voz da Marca
- **Positiva e inspiradora**
- **Técnica mas acessível**
- **Confiante sem arrogância**
- **Inovadora sem ser complexa**

### Exemplos

| Não | Use |
|-----|-----|
| "Processamos seu vídeo" | "Transformamos seu conteúdo" |
| "Você ganha credits" | "Você libera potencial" |
| "O sistema detectou" | "Nossa IA identificou" |
| "Erro ao conectar" | "Ops! Algo deu errado, mas já estamos resolvendo" |

---

## 11. Responsive Behavior

### Mobile-First
- Navigation: Hamburger menu
- Cards: Stack vertical
- Tables: Horizontal scroll ou collapse
- Forms: Full width
- Buttons: Full width mobile

### Touch Optimizations
- Min touch target: 44x44px
- Swipe para navegar clips
- Pinch-to-zoom no editor

---

## 12. Acessibilidade

### WCAG 2.1 AA
- Contrast ratio mínimo 4.5:1
- Focus states visíveis
- Screen reader labels
- Keyboard navigation
- Reduced motion option

### Focus States
```css
:focus-visible {
  outline: 2px solid #06B6D4;
  outline-offset: 2px;
}
```

---

## 13. Referências Visuais

### Inspirações
- Linear (UI de produto)
- Vercel (minimalismo)
- Stripe (micro-interações)
- Opus Clip (produto específico)
- CapCut (edição mobile)

### Elementos Distintivos
1. **Glow effects** em elementos-chave
2. **Glassmorphism** em cards
3. **Gradientes紫-cyan**
4. **Animações fluidas**
5. **Typography impactante**

