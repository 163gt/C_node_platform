<template>
  <div class="error">
    <div class="error-img">
      <div class="error-text">页面走丢了~</div>
      <img src="@/assets/image/error.gif" alt="error" />
    </div>
  </div>
</template>
<style scoped>
.error {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.error-img {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.error-text {
  display: flex;
  justify-content: center;
  font-weight: bold;
}
</style>