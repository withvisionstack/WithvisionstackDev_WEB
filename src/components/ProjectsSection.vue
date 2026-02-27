<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLangStore } from '../stores/LangStore'
import { useProjectStore } from '../stores/projectStore'
import type { Project } from '../components/types/index'

const { t, lang } = storeToRefs(useLangStore())
const projectStore = useProjectStore()
const { projects, loading } = storeToRefs(projectStore)

onMounted(() => projectStore.fetchPublic())

// ── fallback estático enquanto Supabase está vazio ──
const staticProjects: Project[] = [
  {
    id: '1',
    title_pt: 'Blog Simples sem banco de dados',
    title_en: 'Simple blog without a database',
    description_pt: 'Blog simples sem banco de dados em PHP puro com dados em memória consumindo a API do Unsplash.',
    description_en: 'Simple blog without a database, written in pure PHP, with data stored in memory and consuming the Unsplash API.',
    tags: ['HTML5', 'JS', 'PHP', 'CSS3'],
    demo_link: 'https://blogofofoqueiro.great-site.net/',
    visible: true,
    gradient: 'linear-gradient(135deg,#1c2e4a,#1c538e)',
    icon: '&lt;/&gt;',
    tag: 'Web App',
  },
  {
    id: '2',
    title_pt: 'API de E-commerce',
    title_en: 'E-commerce API',
    description_pt: 'Backend robusto para loja virtual com integração de pagamentos, controle de estoque e relatórios analíticos.',
    description_en: 'Robust backend for online store with payment integration, stock control and analytical reports.',
    tags: ['.NET Core', 'C#', 'PostgreSQL'],
    visible: true,
    gradient: 'linear-gradient(135deg,#0d1b2a,#2d6a4f)',
    icon: '{}',
    tag: 'API REST',
  },
  {
    id: '3',
    title_pt: 'Plataforma de Cursos',
    title_en: 'Courses Platform',
    description_pt: 'Plataforma de e-learning com player de vídeo, progressão de cursos e certificados automáticos.',
    description_en: 'E-learning platform with video player, course progression and automatic certificates.',
    tags: ['React', 'PHP', 'MySQL'],
    visible: true,
    gradient: 'linear-gradient(135deg,#1a2744,#6c3483)',
    icon: '▶',
    tag: 'SPA',
  },
]

// usa Supabase se tiver dados, senão mostra os estáticos
const displayProjects = computed(() =>
  projects.value.length > 0 ? projects.value : staticProjects
)
</script>

<template>
  <section id="projetos">
    <div class="container">
      <p class="section-label">{{ t['projects.label'] }}</p>
      <h2 class="section-title">{{ t['projects.title'] }}</h2>
      <div class="section-bar"></div>

      <div v-if="loading">Carregando...</div>

      <div v-else class="projects-grid">
  <div v-for="p in displayProjects" :key="p.id" class="project-card">
    <div class="project-img">

      <!-- ✅ imagem do Supabase Storage -->
      <img
        v-if="p.image_url"
        :src="p.image_url"
        :alt="lang === 'pt' ? p.title_pt : p.title_en"
        style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1;"
        @error="(e) => (e.target as HTMLImageElement).style.display='none'"
      />

      <!-- gradiente sempre de fundo -->
      <div
        class="project-img-bg"
        :style="{ background: p.gradient ?? 'linear-gradient(135deg,#1c2e4a,#1c538e)' }"
      />

      <!-- ícone só se não tiver imagem -->
      <div v-if="!p.image_url" class="project-img-icon" v-html="p.icon ?? '&lt;/&gt;'" />

      <span class="project-tag" style="position:relative; z-index:2;">{{ p.tag ?? 'Web App' }}</span>
    </div>

    <div class="project-body">
      <h3 class="project-title">{{ lang === 'pt' ? p.title_pt : p.title_en }}</h3>
      <p class="project-desc">{{ lang === 'pt' ? p.description_pt : p.description_en }}</p>
      <div class="project-techs">
        <span v-for="tag in p.tags" :key="tag" class="tech-tag">{{ tag }}</span>
      </div>
      <div class="project-actions">
        <a v-if="p.demo_link" :href="p.demo_link" target="_blank" class="btn-demo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Live Demo
        </a>
        <a v-if="p.github_link" :href="p.github_link" target="_blank" class="btn-demo">GitHub</a>
      </div>
    </div>
  </div>
</div>
</div>
</section>
</template>