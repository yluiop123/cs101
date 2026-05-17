export interface ResourceItem { title: string; url: string; icon?: string; lang?: 'zh' | 'en'; type?: 'article' | 'video' }
export interface ResourceGroup { name: string; icon?: string; items: ResourceItem[] }

export interface DrawerItem {
  title: string
  description?: string
  optional?: boolean
  groups?: ResourceGroup[]
}
