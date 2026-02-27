<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLangStore } from '../stores/LangStore'
const { t } = storeToRefs(useLangStore())

// Lista de techs — pode vir do Supabase futuramente, por ora estático
const techs = [
  { src: 'html5.png',        label: 'HTML5' },
  { src: 'Tailwind_CSS_Logo.svg.png', label: 'Tailwind CSS' },
  { src: 'javascript-logo.png', label: 'JavaScript' },
  { src: 'ts.png',           label: 'TypeScript' },
  { src: 'react-1-logo-png-transparent-no-background.png', label: 'React' },
  { src: 'php_PNG43.png',    label: 'PHP' },
  { src: 'logo-laravel-icon-1024-no-background.png', label: 'Laravel' },
  { src: 'c--4.png',         label: 'C#' },
  { src: '33-335825_-net-core-logo-png-transparent-png-no-background.png', label: '.NET Core' },
  { src: '543-5438423_mysql-logo-hd-png-download-no-background.png', label: 'MySQL' },
  { src: 'png-transparent-postgresql-plain-wordmark-logo-icon.png', label: 'PostgreSQL' },
]
// duplica para o loop infinito do carrossel
const carousel = [...techs, ...techs]
</script>

<template>
  <section id="sobre">
    <div class="container">
      <p class="section-label">{{ t['about.label'] }}</p>
      <h2 class="section-title">{{ t['about.title'] }}</h2>
      <div class="section-bar"></div>

      <div class="sobre-grid">
        <div class="sobre-text reveal-left">
          <h3>{{ t['about.heading'] }}</h3>
          <p>{{ t['about.p1'] }}</p>
          <p>{{ t['about.p2'] }}</p>
          <p>{{ t['about.p3'] }}</p>
          <a href="#contato" class="btn btn-primary" style="margin-top:1.5rem">
            {{ t['about.cta'] }}
          </a>
        </div>
        <div class="sobre-img-wrap reveal-right">
          <img src="/imagens/programing.jpg" alt="Desenvolvedor programando" />
          <span class="sobre-img-badge">💻 Full Stack Dev</span>
        </div>
      </div>

      <!-- Carrossel -->
      <div class="tech-section reveal">
        <p class="tech-section-title">{{ t['about.techTitle'] }}</p>
        <div class="carousel-wrapper">
          <div class="carousel-track">
            <div v-for="(tech, i) in carousel" :key="i" class="tech-item">
              <img :src="`/imagens/${tech.src}`" :alt="tech.label"  />
              <span>{{ tech.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>