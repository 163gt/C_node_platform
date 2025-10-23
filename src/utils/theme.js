//恢复主题
export function initThemeColor() {
    const green = localStorage.getItem('green')
    if (green) {
        const { levelOne, levelTwo } = JSON.parse(green)
        const root = document.documentElement
        root.style.setProperty('--green--levelOne', levelOne)
        root.style.setProperty('--green--levelTwo', levelTwo)
    }

    const red = localStorage.getItem('red')
    if (red) {
        const { levelOne, levelTwo } = JSON.parse(red)
        const root = document.documentElement
        root.style.setProperty('--red--levelOne', levelOne)
        root.style.setProperty('--red--levelTwo', levelTwo)
    }

    const purple = localStorage.getItem('purple')
    if (purple) {
        const { levelOne, levelTwo } = JSON.parse(purple)
        const root = document.documentElement
        root.style.setProperty('--purple--levelOne', levelOne)
        root.style.setProperty('--purple--levelTwo', levelTwo)
    }
}


// 设置主题色（主色+浅色）
export function setThemeColor(name, levelOne, levelTwo) {
    const root = document.documentElement
    root.style.setProperty(`--${name}--levelOne`, levelOne)
    root.style.setProperty(`--${name}--levelOne`, levelTwo)

    // 存入浏览器缓存
    localStorage.setItem(name, JSON.stringify({
        levelOne,
        levelTwo
    }))
}
