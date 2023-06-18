<script setup lang="ts">
import FileBrowser from './Components/FileBrowser.vue';
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <header>
  </header>
  <main>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <n-space vertical size="large">
        <n-layout>
          <n-layout-header bordered>
            <h2>
              Hostsite
            </h2>
          </n-layout-header>
          <n-layout-content bordered content-style="padding: 24px;">
            <n-message-provider>
              <FileBrowser></FileBrowser>
            </n-message-provider>
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
</style>
