export type Menu = {
  name: string
  categories: MenuCategory[]
}

export type MenuCategory = {
  id: string
  name: string
  description: string
  menu_items: MenuItem[]
}

export type MenuItem = {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  price_suffix: string
  quantity?: number
}
