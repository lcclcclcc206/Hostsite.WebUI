<script setup lang="ts">
import type { RouterLink } from 'vue-router';
import { NButton, NModal, NDropdown } from 'naive-ui'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import { ref, provide, type Ref } from 'vue';
import LoginPanel from './Components/LoginPanel.vue';
import { type IToken } from './Utils/interfaces'
import { get_token, update_token, is_token_needto_refresh } from './Utils/authentication'

const user_options = [
  {
    label: '退出登录',
    key: 'logout',
  }
];

let token: Ref<IToken | null> = ref(get_token());
if (token.value != null && is_token_needto_refresh(token.value))
  update_token(token.value, () => {
    console.log('令牌刷新成功');
  }, () => {
    token.value = null;
    console.log('令牌已失效，请重新登录');
  });

let show_loginModal = ref(false);

provide('token', token);

function login_success_operation() {
  show_loginModal.value = false;
}

function handle_user_select_option(key: string) {
  if (key == 'logout') {
    token.value = null;
    localStorage.removeItem('token');
  }
}
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
              </span>
              <span class="navbar-entry">
                <NButton v-if="token == null" text @click="show_loginModal = true">登录</NButton>
                <NDropdown v-if="token != null" :options="user_options" @select="handle_user_select_option">
                  <NButton text v-html="token.username" />
                </NDropdown>
              </span>
            </nav>
          </n-layout-header>
          <n-layout-content bordered content-style="padding: 24px;">
            <NMessageProvider>
              <n-modal v-model:show="show_loginModal">
                <LoginPanel @login_sucess="login_success_operation" />
              </n-modal>
            </NMessageProvider>
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
  font-weight: 300;
  color: rgb(27, 127, 173);
  text-decoration: none;
}
</style>
