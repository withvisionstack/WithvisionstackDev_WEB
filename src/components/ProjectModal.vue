<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project } from '../components/types/index'

const props = defineProps<{
  project?: Project | null
}>()

const emit = defineEmits<{
  save: [data: Partial<Project>]
  close: []
}>()

const AVAILABLE_TAGS = [
  'Vue.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
  'Tailwind CSS', 'PHP', 'Laravel', 'C#', '.NET Core',
  'MySQL', 'PostgreSQL', 'Node.js', 'Python', 'Docker',
  'REST API', 'GraphQL', 'Supabase', 'Firebase', 'MongoDB'
]

const isEdit = ref(false)
const form = ref({
  title_pt: '',
  title_en: '',
  description_pt: '',
  description_en: '',
  demo_link: '',
  github_link: '',
  image_url: '',
  tags: [] as string[],
  visible: true,
})
const tagInput = ref('')
const errors = ref<Record<string, string>>({})

// Preenche o form quando editar
watch(() => props.project, (p) => {
  if (p) {
    isEdit.value = true
    form.value = {
      title_pt: p.title_pt ?? '',
      title_en: p.title_en ?? '',
      description_pt: p.description_pt ?? '',
      description_en: p.description_en ?? '',
      demo_link: p.demo_link ?? '',
      github_link: p.github_link ?? '',
      image_url: p.image_url ?? '',
      tags: [...(p.tags ?? [])],
      visible: p.visible ?? true,
    }
  } else {
    isEdit.value = false
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = { title_pt:'', title_en:'', description_pt:'', description_en:'', demo_link:'', github_link:'', image_url:'', tags:[], visible:true }
  errors.value = {}
}

function toggleTag(tag: string) {
  const idx = form.value.tags.indexOf(tag)
  if (idx >= 0) form.value.tags.splice(idx, 1)
  else form.value.tags.push(tag)
}

function addCustomTag() {
  const t = tagInput.value.trim()
  if (t && !form.value.tags.includes(t)) {
    form.value.tags.push(t)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

function validate() {
  errors.value = {}
  if (!form.value.title_pt) errors.value.title_pt = 'Obrigatório'
  if (!form.value.title_en) errors.value.title_en = 'Obrigatório'
  if (!form.value.description_pt) errors.value.description_pt = 'Obrigatório'
  if (!form.value.description_en) errors.value.description_en = 'Obrigatório'
  return Object.keys(errors.value).length === 0
}

function handleSave() {
  if (!validate()) return
  const payload: Partial<Project> = { ...form.value }
  if (props.project?.id) payload.id = props.project.id
  emit('save', payload)
}
</script>

<template>
  <Teleport to="body">
    <div class="pm-overlay" @click.self="emit('close')">
      <div class="pm-modal">

        <!-- Header -->
        <div class="pm-header">
          <div class="pm-header-left">
            <div class="pm-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M8 12h8M12 8v8"/>
              </svg>
            </div>
            <div>
              <h2>{{ isEdit ? 'Editar Projeto' : 'Novo Projeto' }}</h2>
              <p>{{ isEdit ? 'Atualize as informações do projeto' : 'Preencha as informações do novo projeto' }}</p>
            </div>
          </div>
          <button class="pm-close" @click="emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="pm-body">

          <!-- Títulos -->
          <div class="pm-section-label">// Títulos</div>
          <div class="pm-row">
            <div class="pm-field" :class="{ error: errors.title_pt }">
              <label>Título <span class="lang-badge pt">PT</span></label>
              <input v-model="form.title_pt" type="text" placeholder="Nome do projeto em português" />
              <span v-if="errors.title_pt" class="pm-err">{{ errors.title_pt }}</span>
            </div>
            <div class="pm-field" :class="{ error: errors.title_en }">
              <label>Title <span class="lang-badge en">EN</span></label>
              <input v-model="form.title_en" type="text" placeholder="Project name in english" />
              <span v-if="errors.title_en" class="pm-err">{{ errors.title_en }}</span>
            </div>
          </div>

          <!-- Descrições -->
          <div class="pm-section-label">// Descrições</div>
          <div class="pm-row">
            <div class="pm-field" :class="{ error: errors.description_pt }">
              <label>Descrição <span class="lang-badge pt">PT</span></label>
              <textarea v-model="form.description_pt" rows="3" placeholder="Descreva o projeto em português..." />
              <span v-if="errors.description_pt" class="pm-err">{{ errors.description_pt }}</span>
            </div>
            <div class="pm-field" :class="{ error: errors.description_en }">
              <label>Description <span class="lang-badge en">EN</span></label>
              <textarea v-model="form.description_en" rows="3" placeholder="Describe the project in english..." />
              <span v-if="errors.description_en" class="pm-err">{{ errors.description_en }}</span>
            </div>
          </div>

          <!-- Links -->
          <div class="pm-section-label">// Links</div>
          <div class="pm-row">
            <div class="pm-field">
              <label>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live Demo
              </label>
              <input v-model="form.demo_link" type="url" placeholder="https://meusite.com" />
            </div>
            <div class="pm-field">
              <label>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                GitHub
              </label>
              <input v-model="form.github_link" type="url" placeholder="https://github.com/..." />
            </div>
          </div>

          <!-- Imagem -->
          <div class="pm-field">
            <label>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              URL da Imagem
            </label>
            <input v-model="form.image_url" type="url" placeholder="https://..." />
            <div v-if="form.image_url" class="pm-img-preview">
              <img :src="form.image_url" alt="preview" @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
            </div>
          </div>

          <!-- Tags -->
          <div class="pm-section-label">// Stack / Tecnologias</div>
          <div class="pm-tags-grid">
            <button
              v-for="tag in AVAILABLE_TAGS" :key="tag"
              class="pm-tag-btn"
              :class="{ active: form.tags.includes(tag) }"
              type="button"
              @click="toggleTag(tag)"
            >{{ tag }}</button>
          </div>

          <!-- Tag customizada -->
          <div class="pm-custom-tag">
            <input v-model="tagInput" type="text" placeholder="Tag personalizada..." @keyup.enter="addCustomTag" />
            <button type="button" @click="addCustomTag">+ Adicionar</button>
          </div>

          <!-- Tags selecionadas -->
          <div v-if="form.tags.length" class="pm-selected-tags">
            <span v-for="tag in form.tags" :key="tag" class="pm-selected-tag">
              {{ tag }}
              <button type="button" @click="removeTag(tag)">×</button>
            </span>
          </div>

          <!-- Visibilidade -->
          <div class="pm-visibility">
            <label class="pm-toggle">
              <input type="checkbox" v-model="form.visible" />
              <span class="pm-toggle-slider"></span>
              <span class="pm-toggle-label">
                {{ form.visible ? '👁 Visível no portfólio' : '🙈 Oculto no portfólio' }}
              </span>
            </label>
          </div>

        </div>

        <!-- Footer -->
        <div class="pm-footer">
          <button class="pm-btn-cancel" @click="emit('close')">Cancelar</button>
          <button class="pm-btn-save" @click="handleSave">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ isEdit ? 'Salvar Alterações' : 'Criar Projeto' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pm-overlay {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(13,27,42,.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.pm-modal {
  background: #fff;
  border-radius: 20px;
  width: 100%; max-width: 780px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(13,27,42,.2);
  animation: popIn .25s cubic-bezier(.34,1.56,.64,1);
  overflow: hidden;
}
@keyframes popIn {
  from { opacity:0; transform:scale(.92) translateY(16px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}
/* Header */
.pm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 1.8rem;
  border-bottom: 1.5px solid #f0f4f8;
  flex-shrink: 0;
}
.pm-header-left { display: flex; align-items: center; gap: 1rem; }
.pm-header-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: #0d1b2a; color: #00e676;
  display: flex; align-items: center; justify-content: center;
}
.pm-header h2 { font-size: 1.1rem; font-weight: 800; color: #0d1b2a; margin: 0; }
.pm-header p { font-size: .78rem; color: #8a9ab0; margin: 0; }
.pm-close {
  width: 36px; height: 36px; border-radius: 8px;
  background: #f4f6f9; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #0d1b2a; transition: background .2s;
}
.pm-close:hover { background: #e8edf2; }
/* Body */
.pm-body {
  padding: 1.6rem 1.8rem;
  overflow-y: auto;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
}
.pm-section-label {
  font-size: .72rem; font-weight: 700; color: #00b05a;
  letter-spacing: .08em; text-transform: uppercase;
  margin-top: .4rem;
}
.pm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.pm-field { display: flex; flex-direction: column; gap: .35rem; }
.pm-field label {
  font-size: .78rem; font-weight: 700; color: #0d1b2a;
  display: flex; align-items: center; gap: .35rem;
}
.lang-badge {
  font-size: .65rem; font-weight: 700; padding: .1rem .4rem;
  border-radius: 4px; letter-spacing: .04em;
}
.lang-badge.pt { background: #e8f5e9; color: #2e7d32; }
.lang-badge.en { background: #e3f2fd; color: #1565c0; }
.pm-field input, .pm-field textarea {
  background: #f4f6f9; border: 1.5px solid #e0e6ed;
  border-radius: 10px; padding: .65rem .9rem;
  font-size: .875rem; color: #0d1b2a; outline: none;
  resize: vertical; transition: border-color .2s, box-shadow .2s;
  font-family: inherit;
}
.pm-field input:focus, .pm-field textarea:focus {
  border-color: #00e676;
  box-shadow: 0 0 0 3px rgba(0,230,118,.1);
  background: #fff;
}
.pm-field.error input, .pm-field.error textarea { border-color: #fc8181; }
.pm-err { font-size: .75rem; color: #e53e3e; }
.pm-img-preview {
  margin-top: .4rem; border-radius: 10px; overflow: hidden;
  border: 1.5px solid #e0e6ed; max-height: 120px;
}
.pm-img-preview img { width: 100%; height: 120px; object-fit: cover; display: block; }
/* Tags grid */
.pm-tags-grid {
  display: flex; flex-wrap: wrap; gap: .45rem;
}
.pm-tag-btn {
  padding: .35rem .75rem; border-radius: 20px;
  border: 1.5px solid #e0e6ed; background: #f4f6f9;
  color: #4a5568; font-size: .78rem; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.pm-tag-btn:hover { border-color: #00e676; color: #0d1b2a; }
.pm-tag-btn.active { background: #0d1b2a; color: #00e676; border-color: #0d1b2a; }
/* Custom tag */
.pm-custom-tag { display: flex; gap: .5rem; }
.pm-custom-tag input {
  flex: 1; background: #f4f6f9; border: 1.5px solid #e0e6ed;
  border-radius: 10px; padding: .6rem .9rem;
  font-size: .85rem; color: #0d1b2a; outline: none;
}
.pm-custom-tag input:focus { border-color: #00e676; background: #fff; }
.pm-custom-tag button {
  background: #0d1b2a; color: #fff; border: none;
  border-radius: 10px; padding: .6rem 1rem;
  font-size: .82rem; font-weight: 700; cursor: pointer;
  white-space: nowrap; transition: background .2s;
}
.pm-custom-tag button:hover { background: #1c538e; }
/* Selected tags */
.pm-selected-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
.pm-selected-tag {
  display: flex; align-items: center; gap: .3rem;
  background: #e8f5e9; color: #2e7d32;
  border-radius: 20px; padding: .3rem .7rem;
  font-size: .78rem; font-weight: 600;
}
.pm-selected-tag button {
  background: none; border: none; cursor: pointer;
  color: #2e7d32; font-size: .95rem; line-height: 1;
  padding: 0; font-weight: 700;
}
/* Visibility toggle */
.pm-visibility { margin-top: .2rem; }
.pm-toggle { display: flex; align-items: center; gap: .8rem; cursor: pointer; }
.pm-toggle input { display: none; }
.pm-toggle-slider {
  width: 44px; height: 24px; background: #e0e6ed;
  border-radius: 12px; position: relative; transition: background .25s;
}
.pm-toggle-slider::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; background: #fff;
  border-radius: 50%; transition: transform .25s;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.pm-toggle input:checked + .pm-toggle-slider { background: #00e676; }
.pm-toggle input:checked + .pm-toggle-slider::after { transform: translateX(20px); }
.pm-toggle-label { font-size: .875rem; font-weight: 600; color: #0d1b2a; }
/* Footer */
.pm-footer {
  display: flex; justify-content: flex-end; gap: .8rem;
  padding: 1.2rem 1.8rem;
  border-top: 1.5px solid #f0f4f8;
  flex-shrink: 0;
}
.pm-btn-cancel {
  padding: .72rem 1.4rem; border-radius: 10px;
  background: #f4f6f9; border: 1.5px solid #e0e6ed;
  color: #0d1b2a; font-weight: 600; font-size: .9rem;
  cursor: pointer; transition: background .2s;
}
.pm-btn-cancel:hover { background: #e8edf2; }
.pm-btn-save {
  padding: .72rem 1.6rem; border-radius: 10px;
  background: #0d1b2a; border: none;
  color: #fff; font-weight: 700; font-size: .9rem;
  cursor: pointer; display: flex; align-items: center; gap: .5rem;
  transition: background .2s, transform .15s;
}
.pm-btn-save:hover { background: #1c538e; transform: translateY(-1px); }
@media (max-width: 600px) {
  .pm-row { grid-template-columns: 1fr; }
  .pm-modal { max-height: 95vh; }
  .pm-header, .pm-body, .pm-footer { padding-left: 1.2rem; padding-right: 1.2rem; }
}
</style>