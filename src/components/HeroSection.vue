<script setup lang="ts">
import { useLangStore } from '../stores/LangStore'
import { storeToRefs } from 'pinia'
const { t } = storeToRefs(useLangStore())
</script>

<template>
  <section id="inicio">
    <div class="hero-bg">
      <img src="/imagens/Sprinkle.svg" alt="fundo" height="95%" />
    </div>
    <div class="hero-content">
      <div class="hero-badge">{{ t['hero.badge'] }}</div>
      <!-- v-html porque tem <br> e <span> dentro -->
      <h1 class="hero-title" v-html="t['hero.title']" />
      <p class="hero-subtitle">{{ t['hero.subtitle'] }}</p>
      <p class="hero-desc">{{ t['hero.desc'] }}</p>
      <div class="hero-btns">
        <a href="#projetos" class="btn btn-primary">{{ t['hero.btn1'] }}</a>
        <a href="#contato"  class="btn btn-outline">{{ t['hero.btn2'] }}</a>
      </div>
    </div>
  </section>
</template>