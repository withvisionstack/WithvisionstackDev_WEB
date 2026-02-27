// src/stores/LangStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ✅ Tipo definido direto aqui — sem depender de import externo
export type Lang = 'pt' | 'en'

// ✅ Tipo do objeto de traduções — garante que PT e EN tenham sempre as mesmas chaves
type Translations = Record<string, string>

const translations: Record<Lang, Translations> = {
  pt: {
    // ── Navbar ──
    'nav.inicio':   'Início',
    'nav.projetos': 'Projetos',
    'nav.sobre':    'Sobre',
    'nav.contato':  'Contato',

    // ── Hero ──
    'hero.badge':    '● Disponível para projetos',
    'hero.title':    'Desenvolvedor<br><span>Full Stack</span>',
    'hero.subtitle': 'Transformando Ideias em experiências digitais',
    'hero.desc':     'Especializado em criar interfaces modernas, responsivas e de alta performance que encantam usuários e impulsionam negócios.',
    'hero.btn1':     '📄 Ver Projetos',
    'hero.btn2':     '💬 Entre em contato',

    // ── Projetos ──
    'projects.label': '// Meu Trabalho',
    'projects.title': 'Projetos em Destaque',
    'proj1.title': 'Blog Simples sem banco de dados',
    'proj1.desc':  'Blog simples sem banco de dados em PHP puro com dados em memória consumindo a API do Unsplash.',
    'proj2.title': 'API de E-commerce',
    'proj2.desc':  'Backend robusto para loja virtual com integração de pagamentos, controle de estoque e relatórios analíticos.',
    'proj3.title': 'Plataforma de Cursos',
    'proj3.desc':  'Plataforma de e-learning com player de vídeo, progressão de cursos e certificados automáticos.',

    // ── Sobre ──
    'about.label':     '// Sobre Mim',
    'about.title':     'Quem Sou Eu',
    'about.heading':   'Desenvolvedor Full Stack apaixonado por tecnologia',
    'about.p1':        'Olá! Sou um desenvolvedor Full Stack com experiência em criar soluções web completas — desde interfaces elegantes e responsivas até backends robustos e escaláveis.',
    'about.p2':        'Trabalho com tecnologias modernas como React, Laravel, .NET Core e bancos de dados relacionais, sempre com foco na qualidade do código e na experiência do usuário.',
    'about.p3':        'Acredito que um bom software nasce da união de código limpo, design atencioso e comunicação clara com o cliente.',
    'about.cta':       'Vamos conversar →',
    'about.techTitle': '// Stack Tecnológico',

    // ── Contato ──
    'contact.label':     '// Contato',
    'contact.title':     'Vamos Conversar',
    'contact.desc':      'Tem um projeto em mente ou quer saber mais sobre meu trabalho? Envie uma mensagem — responderei o mais rápido possível!',
    'contact.name':      'Nome',
    'contact.namePh':    'Seu nome completo',
    'contact.email':     'E-mail',
    'contact.emailPh':   'seu@email.com',
    'contact.message':   'Mensagem',
    'contact.messagePh': 'Conte sobre seu projeto...',
    'contact.send':      'Enviar Mensagem ➤',
    'contact.sending':   'Enviando...',          // ✅

    // ── Footer ──
    'footer.tagline': 'WHITVISIONSTACK · DESENVOLVEDOR',
    'footer.copy':    `© ${new Date().getFullYear()} WhitVisionStack. Todos os direitos reservados.`,

    // ── Toasts: sucesso ──
    'toast.ok.title': 'Mensagem enviada!',
    'toast.ok.msg':   'Entrarei em contato em breve. 😊',

    // ── Toasts: erros gerais ──
    'toast.err.title': 'Erro ao enviar.',
    'toast.err.msg':   'Por favor, complete o formulário.',

    // ── Toasts: validações do formulário ──
    'toast.warn.fields':    'Por favor, preencha todos os campos.',
    'toast.err.email':      'Por favor, insira um e-mail válido.',
    'toast.warn.name':      'Por favor, insira seu nome completo.',
    'toast.warn.emailReal': 'Por favor, insira um e-mail real.',
    'toast.warn.message':   'Escreva uma mensagem mais detalhada (mín. 600 caracteres).',
  },

  en: {
    // ── Navbar ──
    'nav.inicio':   'Home',
    'nav.projetos': 'Projects',
    'nav.sobre':    'About',
    'nav.contato':  'Contact',

    // ── Hero ──
    'hero.badge':    '● Available for projects',
    'hero.title':    'Full Stack<br><span>Developer</span>',
    'hero.subtitle': 'Turning Ideas into Digital Experiences',
    'hero.desc':     'Specialized in creating modern, responsive, high-performance interfaces that delight users and drive businesses forward.',
    'hero.btn1':     '📄 View Projects',
    'hero.btn2':     '💬 Get in touch',

    // ── Projetos ──
    'projects.label': '// My Work',
    'projects.title': 'Featured Projects',
    'proj1.title': 'Simple blog without a database',
    'proj1.desc':  'Simple blog without a database, written in pure PHP, with data stored in memory and consuming the Unsplash API.',
    'proj2.title': 'E-commerce API',
    'proj2.desc':  'Robust backend for online store with payment integration, stock control and analytical reports.',
    'proj3.title': 'Courses Platform',
    'proj3.desc':  'E-learning platform with video player, course progression and automatic certificates.',

    // ── Sobre ──
    'about.label':     '// About Me',
    'about.title':     'Who I Am',
    'about.heading':   'Full Stack Developer passionate about technology',
    'about.p1':        "Hi! I'm a Full Stack Developer with experience creating complete web solutions — from elegant, responsive interfaces to robust, scalable backends.",
    'about.p2':        'I work with modern technologies like React, Laravel, .NET Core and relational databases, always focused on code quality and user experience.',
    'about.p3':        'I believe great software is born from the union of clean code, thoughtful design and clear client communication.',
    'about.cta':       "Let's talk →",
    'about.techTitle': '// Tech Stack',

    // ── Contato ──
    'contact.label':     '// Contact',
    'contact.title':     "Let's Talk",
    'contact.desc':      "Have a project in mind or want to know more about my work? Send a message — I'll respond as soon as possible!",
    'contact.name':      'Name',
    'contact.namePh':    'Your full name',
    'contact.email':     'Email',
    'contact.emailPh':   'your@email.com',
    'contact.message':   'Message',
    'contact.messagePh': 'Tell me about your project...',
    'contact.send':      'Send Message ➤',
    'contact.sending':   'Sending...',           // ✅ estava faltando no EN

    // ── Footer ──
    'footer.tagline': 'WHITVISIONSTACK · DEVELOPER',
    'footer.copy':    `© ${new Date().getFullYear()} WhitVisionStack. All rights reserved.`,

    // ── Toasts: sucesso ──
    'toast.ok.title': 'Message sent!',
    'toast.ok.msg':   "I'll get back to you soon. 😊",

    // ── Toasts: erros gerais ──
    'toast.err.title': 'Error sending.',
    'toast.err.msg':   'Complete the form before sending.',

    // ── Toasts: validações do formulário ──
    'toast.warn.fields':    'Please fill in all fields.',
    'toast.err.email':      'Please enter a valid email.',
    'toast.warn.name':      'Please enter your full name.',
    'toast.warn.emailReal': 'Please enter a real email address.',
    'toast.warn.message':   'Write a more detailed message (min. 600 characters).',
  },
}

export const useLangStore = defineStore('lang', () => {
  const lang = ref<Lang>('pt')

  function setLang(l: Lang) {
    lang.value = l
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en'
  }

  const t = computed(() => translations[lang.value])

  return { lang, setLang, t }
})

export default useLangStore