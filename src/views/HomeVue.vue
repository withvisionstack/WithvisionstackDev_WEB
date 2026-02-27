<script setup lang="ts">
import NavBar          from '../components/Navbar.vue'
import HeroSection     from '../components/HeroSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import AboutSection    from '../components/AboutSection.vue'
import ContactSection  from '../components/ContactSection.vue'
import FooterSection   from '../components/FooterSection.vue'
import FloatingButtons from '../components/FloatingButtons.vue'
import { useReveal } from '../composables/useReveal' // ← adiciona

useReveal()
</script>

<template>
  <NavBar />
  <main>
    <HeroSection />
    <ProjectsSection />
    <AboutSection />
    <ContactSection />
  </main>
  <FooterSection />
  <FloatingButtons />
</template>