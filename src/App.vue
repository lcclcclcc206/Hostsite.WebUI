<script setup lang="ts">
import { useRouter, type RouterLink } from 'vue-router';
import { NButton, NDropdown } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import { useUserInfoStore } from '@/Stores/UserInfoStore';

const userInfo = useUserInfoStore();
const router = useRouter();

const user_options = [
  {
    label: '退出登录',
    key: 'logout',
  }
];

if (userInfo.is_token_needto_refresh()) {
  userInfo.update_token(() => {
    console.log('令牌刷新成功');
  }, () => {
    userInfo.remove_token();
  })
}

function handle_user_select_option(key: string) {
  if (key == 'logout') {
    userInfo.remove_token();
    router.push({ 'name': 'login' });
  }
}

function redirect_to_login() {
  router.push({ name: 'login' });
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
                <span class="navbar-content-list" v-if="userInfo.token != null">
                  <RouterLink to="/home">主页</RouterLink>
                  <RouterLink to="/filebrowser">文件浏览</RouterLink>
                  <RouterLink to="/Test">测试</RouterLink>
                </span>
              </span>
              <span class="navbar-entry">
                <NButton v-if="userInfo.token == null" text @click="redirect_to_login">登录</NButton>
                <NDropdown v-if="userInfo.token != null" :options="user_options" @select="handle_user_select_option">
                  <NButton text>{{ userInfo.token.username }}</NButton>
                </NDropdown>
              </span>
            </nav>
          </n-layout-header>
          <n-layout-content bordered content-style="padding: 24px;">
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

.navbar-content-list>* {
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
./Utils/Interfaces/interfaces