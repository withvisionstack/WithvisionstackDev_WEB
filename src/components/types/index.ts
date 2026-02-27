export interface Project {
  id: string
  title_pt: string
  title_en: string
  description_pt: string
  description_en: string
  tags: string[]
  demo_link?: string
  github_link?: string
  image_url?: string
  visible: boolean
  created_at?: string
  // ✅ campos visuais
  gradient?: string
  icon?: string
  tag?: string
}

export type Lang = 'pt' | 'en'

export interface Toast {
  id: number
  type: 'success' | 'error'
  title: string
  msg: string
}