<script setup lang="ts">
import { ref } from 'vue'
import { useLangStore } from '../stores/LangStore'
import { storeToRefs } from 'pinia'

const langStore = useLangStore()
const { t, lang } = storeToRefs(langStore)

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}
function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

// scroll navbar
import { onMounted, onUnmounted } from 'vue'
const scrolled = ref(false)
const showBackTop = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
  showBackTop.value = window.scrollY > 400
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav id="navbar" :class="{ scrolled }">
    <div class="nav-logo">
      <img src="/imagens/logo.png" alt="WhiteVisionStack" />
    </div>

    <ul class="nav-links">
      <li><a href="#inicio">{{ t['nav.inicio'] }}</a></li>
      <li><a href="#projetos">{{ t['nav.projetos'] }}</a></li>
      <li><a href="#sobre">{{ t['nav.sobre'] }}</a></li>
      <li><a href="#contato">{{ t['nav.contato'] }}</a></li>
    </ul>

    <div class="nav-right" style="display:flex; align-items:center">
      <div class="lang-switcher">
        <button class="lang-btn" :class="{ active: lang === 'pt' }" @click="langStore.setLang('pt')">PT</button>
        <button class="lang-btn" :class="{ active: lang === 'en' }" @click="langStore.setLang('en')">EN</button>
      </div>
    </div>

    <button class="hamburger" :class="{ open: menuOpen }" aria-label="Menu" @click="toggleMenu">
      <span /><span /><span />
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" :class="{ open: menuOpen }">
    <a href="#inicio"   @click="closeMenu">{{ t['nav.inicio'] }}</a>
    <a href="#projetos" @click="closeMenu">{{ t['nav.projetos'] }}</a>
    <a href="#sobre"    @click="closeMenu">{{ t['nav.sobre'] }}</a>
    <a href="#contato"  @click="closeMenu">{{ t['nav.contato'] }}</a>
    <div class="lang-switcher">
      <button class="lang-btn" :class="{ active: lang === 'pt' }" @click="langStore.setLang('pt')">PT</button>
      <button class="lang-btn" :class="{ active: lang === 'en' }" @click="langStore.setLang('en')">EN</button>
    </div>
  </div>
</template>