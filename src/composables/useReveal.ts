// src/composables/useReveal.ts
import { onMounted, onUnmounted, nextTick } from 'vue'

export function useReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(async () => {
    await nextTick() // ← aguarda o DOM renderizar completamente

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger')
      .forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => observer?.disconnect())
}