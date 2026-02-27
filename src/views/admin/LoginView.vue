<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/SupabaseCli'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Preencha todos os campos.'
    return
  }
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  loading.value = false
  if (err) {
    error.value = 'E-mail ou senha inválidos.'
  } else {
    router.push('/admin')
  }
}
</script>

<template>
  <div class="al-page">
    <div class="al-bg">
      <svg class="al-bg-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <line x1="50"  y1="0"   x2="200" y2="150" stroke="#00e676" stroke-width="1" opacity=".18"/>
        <line x1="300" y1="50"  x2="450" y2="200" stroke="#1c538e" stroke-width="1" opacity=".13"/>
        <line x1="600" y1="0"   x2="750" y2="150" stroke="#00e676" stroke-width="1" opacity=".15"/>
        <line x1="0"   y1="300" x2="150" y2="450" stroke="#1c538e" stroke-width="1" opacity=".13"/>
        <line x1="650" y1="300" x2="800" y2="450" stroke="#00e676" stroke-width="1" opacity=".15"/>
        <line x1="100" y1="600" x2="250" y2="750" stroke="#1c538e" stroke-width="1" opacity=".13"/>
        <line x1="500" y1="650" x2="650" y2="800" stroke="#00e676" stroke-width="1" opacity=".18"/>
        <circle cx="120" cy="120" r="4" fill="none" stroke="#1c538e" stroke-width="1.2" opacity=".2"/>
        <circle cx="680" cy="200" r="4" fill="none" stroke="#00e676" stroke-width="1.2" opacity=".2"/>
        <circle cx="400" cy="700" r="4" fill="none" stroke="#1c538e" stroke-width="1.2" opacity=".2"/>
        <circle cx="750" cy="600" r="4" fill="none" stroke="#00e676" stroke-width="1.2" opacity=".2"/>
        <rect x="60"  y="400" width="6" height="6" fill="none" stroke="#1c538e" stroke-width="1" opacity=".18" transform="rotate(45 63 403)"/>
        <rect x="700" y="100" width="6" height="6" fill="none" stroke="#00e676" stroke-width="1" opacity=".18" transform="rotate(45 703 103)"/>
      </svg>
    </div>

    <div class="al-card">
      <div class="al-logo">
        <img src="/imagens/logo.png" alt="WhitVisionStack" />
      </div>
      <div class="al-header">
        <h1>Painel <span>Admin</span></h1>
        <p>Gerencie seus projetos com segurança</p>
      </div>
      <div v-if="error" class="al-error">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>
      <div class="al-form">
        <div class="al-field">
          <label>E-mail</label>
          <div class="al-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c538e" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input v-model="email" type="email" placeholder="seu@email.com" :disabled="loading" @keyup.enter="handleLogin" />
          </div>
        </div>
        <div class="al-field">
          <label>Senha</label>
          <div class="al-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c538e" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" :disabled="loading" @keyup.enter="handleLogin" />
            <button class="al-eye" type="button" @click="showPass = !showPass">
              <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>
        <button class="al-btn" :disabled="loading" @click="handleLogin">
          <span v-if="loading" class="al-spinner" />
          <span v-else>Entrar no Painel →</span>
        </button>
      </div>
      <p class="al-back"><a href="/">← Voltar ao portfólio</a></p>
    </div>
  </div>
</template>

<style scoped>
.al-page {
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.al-bg { position: absolute; inset: 0; pointer-events: none; }
.al-bg-svg { width: 100%; height: 100%; }
.al-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2.8rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(13,27,42,.10);
  border: 1px solid #e8edf2;
  position: relative;
  z-index: 2;
  animation: slideUp .4s ease;
}
@keyframes slideUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
.al-logo { display:flex; justify-content:center; margin-bottom:1.2rem; }
.al-logo img { height: 52px; object-fit: contain; }
.al-header { text-align: center; margin-bottom: 1.8rem; }
.al-header h1 { font-size:1.7rem; font-weight:800; color:#0d1b2a; margin:0 0 .3rem; }
.al-header h1 span { color: #00e676; }
.al-header p { font-size:.875rem; color:#7a8a9a; margin:0; }
.al-error {
  background:#fff5f5; border:1px solid #fed7d7; color:#c53030;
  border-radius:10px; padding:.65rem 1rem; font-size:.82rem;
  display:flex; align-items:center; gap:.5rem; margin-bottom:1.2rem;
}
.al-form { display:flex; flex-direction:column; gap:1.1rem; }
.al-field { display:flex; flex-direction:column; gap:.4rem; }
.al-field label { font-size:.78rem; font-weight:700; color:#0d1b2a; letter-spacing:.04em; text-transform:uppercase; }
.al-input-wrap {
  display:flex; align-items:center; gap:.6rem;
  background:#f4f6f9; border:1.5px solid #e0e6ed;
  border-radius:10px; padding:.72rem 1rem;
  transition: border-color .2s, box-shadow .2s;
}
.al-input-wrap:focus-within {
  border-color: #00e676;
  box-shadow: 0 0 0 3px rgba(0,230,118,.12);
  background: #fff;
}
.al-input-wrap input { border:none; background:transparent; outline:none; flex:1; font-size:.9rem; color:#0d1b2a; }
.al-input-wrap input::placeholder { color:#aab4be; }
.al-eye { background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; }
.al-btn {
  margin-top:.4rem; background:#0d1b2a; color:#fff;
  border:none; border-radius:10px; padding:.85rem;
  font-size:.95rem; font-weight:700; cursor:pointer;
  transition: background .2s, transform .15s;
  display:flex; align-items:center; justify-content:center;
}
.al-btn:hover:not(:disabled) { background:#1c538e; transform:translateY(-1px); }
.al-btn:disabled { opacity:.6; cursor:not-allowed; }
.al-spinner {
  width:18px; height:18px;
  border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff; border-radius:50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }
.al-back { text-align:center; margin-top:1.4rem; font-size:.82rem; }
.al-back a { color:#1c538e; text-decoration:none; font-weight:600; }
.al-back a:hover { color:#00e676; }
</style>