<script setup lang="ts">
import type { RouterLink } from 'vue-router';
import { NButton, NModal } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import { ref } from 'vue';
import LoginPanel from './Components/LoginPanel.vue';

let show_loginModal = ref(false);

</script>

<template>
  <main>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <n-space vertical size="large">
        <n-layout>
          <n-layout-header bordered>
            <nav class="navbar">
              <span>
                <RouterLink to="/home" class="logo">Hostsite</RouterLink>
              </span>
              <span class="navbar-content">
                <RouterLink to="/home">主页</RouterLink>
                <RouterLink to="/filebrowser">文件浏览</RouterLink>
                <RouterLink to="/login">登录页</RouterLink>
              </span>
              <span class="navbar-entry">
                <n-button text @click="show_loginModal = true">登录</n-button>
                <span>设置</span>
              </span>
            </nav>
          </n-layout-header>
          <n-layout-content bordered content-style="padding: 24px;">
            <n-modal v-model:show="show_loginModal">
              <LoginPanel />
            </n-modal>
            <RouterView />
          </n-layout-content>
          <n-layout-footer bordered>
            Servered by lcc206
          </n-layout-footer>
        </n-layout>
      </n-space>
    </n-config-provider>

  </main>
</template>

<style scoped>
.n-layout-header {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
}

.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-content {
  background: rgba(255, 255, 255, 0.4);
}

.navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.navbar>* {
  margin-right: 24px;
}

.navbar-content {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}

.navbar-content>* {
  text-decoration: none;
  margin-right: 18px;
  font-size: 1.2em;
  color: rgb(0, 0, 0);
}

.navbar-entry {
  display: flex;
  justify-content: flex-end;
}

.navbar-entry>* {
  text-decoration: none;
  margin-left: 18px;
  font-size: 1.2em;
  color: rgb(0, 0, 0);
}


.logo {
  font-size: 2em;
  font-weight: bold;
  color: rgb(27, 127, 173);
  text-decoration: none;
}
</style>
