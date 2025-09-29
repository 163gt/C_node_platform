<template>
  <!-- 右侧主内容模块 -->
  <section class="main-content">
    <div class="content-wrapper">
      <h2>主内容区域</h2>
      <p>这里是页面的主要内容区域，可以放置各种组件和功能模块。</p>
      <div class="content-placeholder">
        <div v-for="n in 100" :key="n" class="placeholder-item">
          内容区块 {{ n }}
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
</script>
<style scoped>
.content-wrapper {
  margin: 0 auto;
}

.content-wrapper h2 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.content-wrapper p {
  margin-bottom: 24px;
  color: #7f8c8d;
  line-height: 1.6;
}

.content-placeholder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.placeholder-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.placeholder-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-placeholder {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.main-content::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
</style>