<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/SupabaseCli'
import { useProjectStore } from '../stores/projectStore'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import ProjectModal from '../components/ProjectModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import type { Project } from '../components/types/index'

const router = useRouter()
const toast = useToast()
const store = useProjectStore()
const { projects, loading } = storeToRefs(store)

// Modais
const showProjectModal = ref(false)
const showConfirmModal = ref(false)
const editingProject = ref<Project | null>(null)
const deletingId = ref<string | null>(null)

// Filtros
const search = ref('')
const filterVisible = ref<'all' | 'visible' | 'hidden'>('all')

const filtered = computed(() => {
  return projects.value.filter(p => {
    const matchSearch = !search.value ||
      p.title_pt.toLowerCase().includes(search.value.toLowerCase()) ||
      p.title_en.toLowerCase().includes(search.value.toLowerCase())
    const matchVisible =
      filterVisible.value === 'all' ||
      (filterVisible.value === 'visible' && p.visible) ||
      (filterVisible.value === 'hidden' && !p.visible)
    return matchSearch && matchVisible
  })
})

const stats = computed(() => ({
  total: projects.value.length,
  visible: projects.value.filter(p => p.visible).length,
  hidden: projects.value.filter(p => !p.visible).length,
}))

onMounted(() => store.fetchAll())

// Novo projeto
function openCreate() {
  editingProject.value = null
  showProjectModal.value = true
}

// Editar projeto
function openEdit(p: Project) {
  editingProject.value = p
  showProjectModal.value = true
}

// Salvar (criar ou editar)
async function handleSave(data: Partial<Project>) {
  const err = await store.upsert(data)
  if (err) {
    toast.error('Erro ao salvar o projeto.')
  } else {
    toast.success(data.id ? 'Projeto atualizado! ✅' : 'Projeto criado! 🎉')
    showProjectModal.value = false
  }
}

// Confirmar exclusão
function confirmDelete(id: string) {
  deletingId.value = id
  showConfirmModal.value = true
}

async function handleDelete() {
  if (!deletingId.value) return
  await store.remove(deletingId.value)
  toast.success('Projeto excluído.')
  showConfirmModal.value = false
  deletingId.value = null
}

// Toggle visibilidade
async function toggleVisibility(p: Project) {
  await store.toggleVisibility(p.id, !p.visible)
  toast.success(p.visible ? 'Projeto ocultado.' : 'Projeto visível.')
}

// Logout
async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="db-root">

    <!-- Sidebar -->
    <aside class="db-sidebar">
      <div class="db-logo">
        <img src="/imagens/logo.png" alt="WhitVisionStack" />
      </div>
      <nav class="db-nav">
        <a class="db-nav-item active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          Projetos
        </a>
        <a class="db-nav-item" href="/" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Ver Portfólio
        </a>
      </nav>
      <button class="db-logout" @click="handleLogout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair
      </button>
    </aside>

    <!-- Main -->
    <main class="db-main">

      <!-- Top bar -->
      <header class="db-topbar">
        <div class="db-topbar-left">
          <h1>Gerenciar <span>Projetos</span></h1>
          <p>Crie, edite e controle a visibilidade dos seus projetos</p>
        </div>
        <button class="db-btn-new" @click="openCreate">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Projeto
        </button>
      </header>

      <!-- Stats cards -->
      <div class="db-stats">
        <div class="db-stat">
          <div class="db-stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
          </div>
          <div>
            <span class="db-stat-value">{{ stats.total }}</span>
            <span class="db-stat-label">Total</span>
          </div>
        </div>
        <div class="db-stat">
          <div class="db-stat-icon visible">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <span class="db-stat-value">{{ stats.visible }}</span>
            <span class="db-stat-label">Visíveis</span>
          </div>
        </div>
        <div class="db-stat">
          <div class="db-stat-icon hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </div>
          <div>
            <span class="db-stat-value">{{ stats.hidden }}</span>
            <span class="db-stat-label">Ocultos</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="db-filters">
        <div class="db-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a9ab0" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar projeto..." />
        </div>
        <div class="db-filter-tabs">
          <button :class="{ active: filterVisible === 'all' }"    @click="filterVisible = 'all'">Todos</button>
          <button :class="{ active: filterVisible === 'visible' }" @click="filterVisible = 'visible'">Visíveis</button>
          <button :class="{ active: filterVisible === 'hidden' }"  @click="filterVisible = 'hidden'">Ocultos</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="db-loading">
        <span class="db-spinner"></span>
        Carregando projetos...
      </div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="db-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cdd5e0" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M8 12h8M12 8v8"/>
        </svg>
        <p>Nenhum projeto encontrado</p>
        <button class="db-btn-new small" @click="openCreate">Criar primeiro projeto</button>
      </div>

      <!-- Tabela -->
      <div v-else class="db-table-wrap">
        <table class="db-table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Stack</th>
              <th>Status</th>
              <th>Links</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" :class="{ hidden: !p.visible }">
              <td>
                <div class="db-proj-name">
                  <div class="db-proj-dot" :class="{ active: p.visible }"></div>
                  <div>
                    <span class="db-proj-title">{{ p.title_pt }}</span>
                    <span class="db-proj-sub">{{ p.title_en }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="db-tags">
                  <span v-for="t in (p.tags ?? []).slice(0,3)" :key="t" class="db-tag">{{ t }}</span>
                  <span v-if="(p.tags ?? []).length > 3" class="db-tag-more">+{{ (p.tags ?? []).length - 3 }}</span>
                </div>
              </td>
              <td>
                <button class="db-vis-btn" :class="{ visible: p.visible }" @click="toggleVisibility(p)">
                  <svg v-if="p.visible" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  {{ p.visible ? 'Visível' : 'Oculto' }}
                </button>
              </td>
              <td>
                <div class="db-links">
                  <a v-if="p.demo_link" :href="p.demo_link" target="_blank" class="db-link-btn" title="Live Demo">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <a v-if="p.github_link" :href="p.github_link" target="_blank" class="db-link-btn" title="GitHub">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                    </svg>
                  </a>
                  <span v-if="!p.demo_link && !p.github_link" class="db-no-link">—</span>
                </div>
              </td>
              <td>
                <div class="db-actions">
                  <button class="db-act-btn edit" @click="openEdit(p)" title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="db-act-btn delete" @click="confirmDelete(p.id)" title="Excluir">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>

  <!-- Modais -->
  <ProjectModal
    v-if="showProjectModal"
    :project="editingProject"
    @save="handleSave"
    @close="showProjectModal = false"
  />

  <ConfirmModal
    v-if="showConfirmModal"
    title="Excluir Projeto"
    message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
    confirmLabel="Sim, excluir"
    cancelLabel="Cancelar"
    :danger="true"
    @confirm="handleDelete"
    @cancel="showConfirmModal = false"
  />
</template>

<style scoped>
/* Layout */
.db-root {
  display: flex; min-height: 100vh;
  background: #f4f6f9; font-family: 'Segoe UI', sans-serif;
}
/* Sidebar */
.db-sidebar {
  width: 220px; background: #0d1b2a;
  display: flex; flex-direction: column;
  padding: 1.8rem 1.2rem;
  position: sticky; top: 0; height: 100vh;
  flex-shrink: 0;
}
.db-logo { margin-bottom: 2rem; padding: 0 .4rem; }
.db-logo img { height: 40px; object-fit: contain; filter: brightness(0) invert(1); }
.db-nav { display: flex; flex-direction: column; gap: .3rem; flex: 1; }
.db-nav-item {
  display: flex; align-items: center; gap: .7rem;
  padding: .7rem .9rem; border-radius: 10px;
  color: #8a9ab0; font-size: .875rem; font-weight: 600;
  cursor: pointer; text-decoration: none; transition: all .2s;
}
.db-nav-item:hover { background: rgba(255,255,255,.06); color: #fff; }
.db-nav-item.active { background: rgba(0,230,118,.12); color: #00e676; }
.db-logout {
  display: flex; align-items: center; gap: .6rem;
  padding: .7rem .9rem; border-radius: 10px;
  background: none; border: none; cursor: pointer;
  color: #8a9ab0; font-size: .875rem; font-weight: 600;
  transition: all .2s; width: 100%;
}
.db-logout:hover { background: rgba(229,62,62,.12); color: #fc8181; }
/* Main */
.db-main { flex: 1; padding: 2rem 2.2rem; overflow-y: auto; }
/* Topbar */
.db-topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.8rem; }
.db-topbar-left h1 { font-size: 1.6rem; font-weight: 800; color: #0d1b2a; margin: 0; }
.db-topbar-left h1 span { color: #00b05a; }
.db-topbar-left p { font-size: .82rem; color: #8a9ab0; margin: .25rem 0 0; }
.db-btn-new {
  display: flex; align-items: center; gap: .5rem;
  background: #0d1b2a; color: #fff; border: none;
  border-radius: 10px; padding: .72rem 1.4rem;
  font-size: .875rem; font-weight: 700; cursor: pointer;
  transition: background .2s, transform .15s; white-space: nowrap;
}
.db-btn-new:hover { background: #1c538e; transform: translateY(-1px); }
.db-btn-new.small { font-size: .82rem; padding: .6rem 1.2rem; }
/* Stats */
.db-stats { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.db-stat {
  display: flex; align-items: center; gap: .9rem;
  background: #fff; border-radius: 14px; padding: 1rem 1.4rem;
  flex: 1; border: 1px solid #e8edf2;
  box-shadow: 0 2px 8px rgba(13,27,42,.05);
}
.db-stat-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.db-stat-icon.total   { background: #e8f0ff; color: #1c538e; }
.db-stat-icon.visible { background: #e8f5e9; color: #2e7d32; }
.db-stat-icon.hidden  { background: #fff3e0; color: #e65100; }
.db-stat-value { display: block; font-size: 1.5rem; font-weight: 800; color: #0d1b2a; line-height: 1; }
.db-stat-label { display: block; font-size: .75rem; color: #8a9ab0; margin-top: .15rem; font-weight: 600; }
/* Filtros */
.db-filters { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; }
.db-search {
  display: flex; align-items: center; gap: .6rem;
  background: #fff; border: 1.5px solid #e0e6ed;
  border-radius: 10px; padding: .6rem 1rem; flex: 1; min-width: 200px;
}
.db-search:focus-within { border-color: #00e676; }
.db-search input { border: none; outline: none; font-size: .875rem; color: #0d1b2a; background: transparent; width: 100%; }
.db-filter-tabs { display: flex; gap: .3rem; }
.db-filter-tabs button {
  padding: .55rem 1rem; border-radius: 8px;
  border: 1.5px solid #e0e6ed; background: #fff;
  color: #4a5568; font-size: .8rem; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.db-filter-tabs button:hover { border-color: #0d1b2a; color: #0d1b2a; }
.db-filter-tabs button.active { background: #0d1b2a; color: #fff; border-color: #0d1b2a; }
/* Loading / Empty */
.db-loading {
  display: flex; align-items: center; gap: .8rem;
  color: #8a9ab0; font-size: .875rem; padding: 3rem;
  justify-content: center;
}
.db-spinner {
  width: 20px; height: 20px;
  border: 2px solid #e0e6ed; border-top-color: #0d1b2a;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.db-empty {
  text-align: center; padding: 4rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.db-empty p { color: #8a9ab0; font-size: .9rem; margin: 0; }
/* Tabela */
.db-table-wrap {
  background: #fff; border-radius: 16px;
  border: 1px solid #e8edf2; overflow: hidden;
  box-shadow: 0 2px 12px rgba(13,27,42,.05);
}
.db-table { width: 100%; border-collapse: collapse; }
.db-table thead tr { background: #f8fafc; border-bottom: 1.5px solid #e8edf2; }
.db-table th {
  padding: .9rem 1.2rem; text-align: left;
  font-size: .72rem; font-weight: 700; color: #8a9ab0;
  letter-spacing: .06em; text-transform: uppercase;
}
.db-table tbody tr {
  border-bottom: 1px solid #f0f4f8;
  transition: background .15s;
}
.db-table tbody tr:last-child { border-bottom: none; }
.db-table tbody tr:hover { background: #f8fafc; }
.db-table tbody tr.hidden { opacity: .65; }
.db-table td { padding: 1rem 1.2rem; vertical-align: middle; }
/* Proj name */
.db-proj-name { display: flex; align-items: center; gap: .8rem; }
.db-proj-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #e0e6ed; flex-shrink: 0;
}
.db-proj-dot.active { background: #00e676; box-shadow: 0 0 0 3px rgba(0,230,118,.2); }
.db-proj-title { display: block; font-size: .875rem; font-weight: 700; color: #0d1b2a; }
.db-proj-sub { display: block; font-size: .75rem; color: #8a9ab0; margin-top: .1rem; }
/* Tags */
.db-tags { display: flex; flex-wrap: wrap; gap: .3rem; }
.db-tag {
  background: #f4f6f9; color: #4a5568;
  border-radius: 6px; padding: .2rem .55rem;
  font-size: .72rem; font-weight: 600;
}
.db-tag-more { color: #8a9ab0; font-size: .72rem; font-weight: 600; padding: .2rem .3rem; }
/* Visibility badge */
.db-vis-btn {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .3rem .75rem; border-radius: 20px;
  border: 1.5px solid #e0e6ed; background: #f4f6f9;
  font-size: .75rem; font-weight: 600; color: #8a9ab0;
  cursor: pointer; transition: all .2s;
}
.db-vis-btn.visible { background: #e8f5e9; border-color: #a5d6a7; color: #2e7d32; }
.db-vis-btn:hover { transform: scale(1.04); }
/* Links */
.db-links { display: flex; gap: .4rem; }
.db-link-btn {
  width: 30px; height: 30px; border-radius: 8px;
  background: #f4f6f9; color: #0d1b2a;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; transition: background .2s;
}
.db-link-btn:hover { background: #0d1b2a; color: #fff; }
.db-no-link { color: #cdd5e0; font-size: .875rem; }
/* Actions */
.db-actions { display: flex; gap: .4rem; }
.db-act-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.db-act-btn.edit   { background: #e8f0ff; color: #1c538e; }
.db-act-btn.edit:hover   { background: #1c538e; color: #fff; }
.db-act-btn.delete { background: #fff0f0; color: #e53e3e; }
.db-act-btn.delete:hover { background: #e53e3e; color: #fff; }

@media (max-width: 768px) {
  .db-sidebar { display: none; }
  .db-main { padding: 1.2rem; }
  .db-stats { flex-direction: column; }
  .db-table th:nth-child(2),
  .db-table td:nth-child(2) { display: none; }
}
</style>