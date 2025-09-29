import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useSidebarStore = defineStore('sidebar', () => {
  const openMap = reactive({})
  const activePath = reactive({ path: '' })

  const route = useRoute()

  // 同步当前路由高亮
  watch(
    () => route.path,
    (newPath) => {
      activePath.path = newPath
    },
    { immediate: true }
  )

  const initOpenMap = (menus) => {
    if (!menus || !Array.isArray(menus)) return
    const currentPath = route.path

    const walk = (items) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some(
            (child) =>
              child.path === currentPath ||
              (child.children && child.children.some((c) => c.path === currentPath))
          )
          openMap[item.path] = hasActiveChild
          walk(item.children)
        }
      })
    }

    walk(menus)
  }

  const toggleOpen = (item) => {
    if (item.children && item.children.length > 0) {
      openMap[item.path] = !openMap[item.path]
    } else {
      activePath.path = item.path
    }
  }

  const isOpen = (path) => openMap[path] ?? false
  const isActive = (path) => activePath.path === path

  return { openMap, activePath, toggleOpen, initOpenMap, isOpen, isActive }
})
