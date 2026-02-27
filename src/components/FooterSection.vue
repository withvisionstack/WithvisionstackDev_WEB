<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLangStore } from '../stores/LangStore'
const { t, lang } = storeToRefs(useLangStore())
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <div class="footer-logo">
            <img src="/imagens/withvisionstack-no-background.png" alt="WhiteVisionStack" />
          </div>
          <p class="footer-tagline">{{ t['footer.tagline'] }}</p>
          <p class="footer-bio">Transformando ideias em experiências digitais de alta performance.</p>
        </div>

        <div class="footer-col">
          <h4>Navegação</h4>
          <a href="#inicio">{{ t['nav.inicio'] }}</a>
          <a href="#projetos">{{ t['nav.projetos'] }}</a>
          <a href="#sobre">{{ t['nav.sobre'] }}</a>
          <a href="#contato">{{ t['nav.contato'] }}</a>
        </div>

        <div class="footer-col">
          <a href="https://wa.me/5500000000000" target="_blank">WhatsApp</a>
          <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
          <a href="https://github.com/" target="_blank">GitHub</a>
        </div>
      </div>

      <div class="footer-bottom">
        <!-- ano dinâmico via computed, sem manipular DOM -->
       <p class="footer-copy">© {{ year }} WhitVisionStack. {{ lang === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.' }}</p>
        <!-- social icons — igual ao seu HTML original -->
        <div class="footer-social">
          <!-- cole aqui os 3 SVGs do seu HTML original, são estáticos -->
        </div>
      </div>
    </div>
  </footer>
</template>