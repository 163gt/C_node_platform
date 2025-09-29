export default {
  mounted(el, binding) {
    // 当元素被点击时，触发烟花效果
    el.addEventListener('click', (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // 控制粒子数量
      const particleCount = 15;

      // 动态生成多个粒子元素
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-effect';

        // 设置粒子的颜色
        particle.style.backgroundColor = binding.value?.sparkColor || 'var(--green--levelOne)';

        // 设置粒子的位置
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // 随机计算粒子的方向和爆炸的距离
        const angle = Math.random() * 360;  // 随机角度
        const distance = Math.random() * 50;  // 随机距离
        const duration = Math.random() * 1 + 0.5; // 随机的动画持续时间

        // 将角度转换为弧度
        const radians = (angle * Math.PI) / 180;

        // 计算偏移量
        const offsetX = distance * Math.cos(radians);
        const offsetY = distance * Math.sin(radians);

        // 动态设置 CSS 变量来控制每个粒子的运动方向
        particle.style.setProperty('--x', `${offsetX}px`);
        particle.style.setProperty('--y', `${offsetY}px`);

        // 添加到 DOM
        document.body.appendChild(particle);

        // 在动画结束后移除粒子元素
        setTimeout(() => {
          particle.remove();
        }, duration * 1000);
      }
    });
  },

  unmounted(el) {
    // 清理绑定的事件
    el.removeEventListener('click', this.handleClick);
  }
};
