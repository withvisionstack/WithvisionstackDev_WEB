<!-- src/components/ContactSection.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLangStore } from '../stores/LangStore'
import { useToast } from 'vue-toastification'

interface ContactForm {
  nome: string
  email: string
  mensagem: string
}

const langStore = useLangStore()
const { t } = storeToRefs(langStore)
const toast = useToast()

const formData = reactive<ContactForm>({
  nome: '',
  email: '',
  mensagem: ''
})

const isSubmitting = ref<boolean>(false)
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handleSubmit = async (): Promise<void> => {
  if (isSubmitting.value) return

  if (!formData.nome || !formData.email || !formData.mensagem) {
    toast.warning(t.value['toast.warn.fields'])
    return
  }
  if (!emailRegex.test(formData.email)) {
    toast.error(t.value['toast.err.email'])
    return
  }
  if (formData.nome.length < 10) {
    toast.warning(t.value['toast.warn.name'])
    return
  }
  if (formData.email.length < 16) {
    toast.warning(t.value['toast.warn.emailReal'])
    return
  }
  if (formData.mensagem.length < 600) {
    toast.warning(t.value['toast.warn.message'])
    return
  }

  try {
    isSubmitting.value = true

   const response = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
  },
  body: JSON.stringify({
    sender_name: formData.nome,
    sender_email: formData.email,
    content: formData.mensagem
  })
})
    const data: { success?: boolean; message?: string; detail?: string } = await response.json()

    if (response.ok) {
      toast.success(t.value['toast.ok.title'])
      formData.nome = ''
      formData.email = ''
      formData.mensagem = ''
    } else {
      toast.error(data.message || data.detail || t.value['toast.err.title'])
    }
  } catch (error) {
    console.error('Erro no envio:', error)
    toast.error(t.value['toast.err.title'])
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="contato">

    <!-- Wave -->
    <div class="contato-wave-top">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        style="height: 90px; display: block; background: #f8f9fa"
      >
        <path d="M0 90 Q360 0 720 50 Q1080 90 1440 20 L1440 90Z" fill="#0d1b2a" />
      </svg>
    </div>

    <div class="contato-body">
      <div class="container">
        <div class="contact-grid">

          <!-- Lado esquerdo: info -->
          <div class="contact-left reveal-left">
            <p class="section-label">{{ t['contact.label'] }}</p>
            <h2 class="section-title">{{ t['contact.title'] }}</h2>
            <div class="section-bar" style="margin-left: 0" />
            <p>{{ t['contact.desc'] }}</p>
            <div class="contact-illustration">
             <img 
  src="/imagens/illustration.png" 
  alt="Ilustração contato"
  @error="(e) => (e.target as HTMLImageElement).style.display='none'"
/>
            </div>
          </div>

          <!-- Lado direito: formulário -->
          <div class="contact-form-wrap reveal-right">

            <div class="form-group">
              <label for="nome">{{ t['contact.name'] }}</label>
              <input
                id="nome"
                v-model="formData.nome"
                type="text"
                :placeholder="t['contact.namePh']"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="email">{{ t['contact.email'] }}</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                :placeholder="t['contact.emailPh']"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="mensagem">{{ t['contact.message'] }}</label>
              <textarea
                id="mensagem"
                v-model="formData.mensagem"
                :placeholder="t['contact.messagePh']"
                :disabled="isSubmitting"
              />
              <span class="char-counter" :class="{ valid: formData.mensagem.length >= 600 }">
                {{ formData.mensagem.length }} / 600 mín.
              </span>
            </div>

            <button
              class="btn-submit"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="isSubmitting">⏳ {{ t['contact.sending'] ?? 'Enviando...' }}</span>
              <span v-else>{{ t['contact.send'] }}</span>
            </button>

          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.char-counter {
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
  display: block;
  text-align: right;
  transition: color 0.3s;
}
.char-counter.valid {
  color: #4ade80;
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>