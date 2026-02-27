import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/SupabaseCli'
import type { Project } from '../components/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  const TABLE = 'portfolio_projects'

  async function fetchPublic() {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      projects.value = data ?? []
    } catch (err) {
      console.error('Erro ao buscar projetos públicos:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAll() {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      projects.value = data ?? []
    } catch (err) {
      console.error('Erro ao buscar todos os projetos:', err)
    } finally {
      loading.value = false
    }
  }

  async function upsert(project: Partial<Project>) {
    try {
      const { error } = await supabase
        .from(TABLE)
        .upsert(project)

      if (error) throw error

      await fetchAll()
      return null
    } catch (err) {
      console.error('Erro ao salvar projeto:', err)
      return err
    }
  }

  async function remove(id: string) {
    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchAll()
    } catch (err) {
      console.error('Erro ao remover projeto:', err)
    }
  }

  async function toggleVisibility(id: string, visible: boolean) {
    try {
      const { error } = await supabase
        .from(TABLE)
        .update({ visible })
        .eq('id', id)

      if (error) throw error

      await fetchAll()
    } catch (err) {
      console.error('Erro ao alterar visibilidade:', err)
    }
  }

  return {
    projects,
    loading,
    fetchPublic,
    fetchAll,
    upsert,
    remove,
    toggleVisibility
  }
})