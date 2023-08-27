<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { inject, ref, type Ref } from 'vue';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { useFileBrowserStore } from '@/Stores/FileBrowserStore';
import { BASE_URL } from '@/Utils/constant';
import { storeToRefs } from 'pinia';

const axios = useAxiosStore();
const message = useMessage();
const filebrowserInfo = useFileBrowserStore();

const selectedDir: Ref<string | null> = storeToRefs(filebrowserInfo).selectedDir;
const relativePathStack: Ref<string[]> = storeToRefs(filebrowserInfo).relativePathStack;

const update_FileTable = inject('updateFileTable') as () => void;

const newFolderName: Ref<string> = ref('');

const emit = defineEmits<{
    (e: 'close'):void
}>();

function create_folder() {
    axios.useToken.post(`${BASE_URL}/${selectedDir.value}/create-folder?relative_path=${encodeURIComponent(relativePathStack.value.join("/"))}&folder_name=${encodeURIComponent(newFolderName.value)}`)
        .then((res) => {
            message.success("文件夹创建成功", { duration: 2000 });
            update_FileTable();
            emit('close');
        }).catch(function (error) {
            message.error("文件夹创建失败", { duration: 2000 });
        });
}

document.addEventListener('keydown', function (e) {
    if (e.code == 'Enter') {
        create_folder();
    }
});
</script>

<template>
    <div class="container">
        <div class="title">新建文件夹</div>
        <div>
            <img class="icon" alt="new_folder" src='/src/Assets/Images/folder.svg' />
        </div>
        <n-form class="login-form" size="large">
            <n-form-item label="文件夹名称" path="username">
                <n-input v-model:value="newFolderName" placeholder="输入文件夹名称" />
            </n-form-item>
            <n-form-item :show-label="false" :show-feedback="false">
                <div style="width: 100%; display: flex; justify-content: center;">
                    <n-button class="submit-button" style="justify-self: center;" @click="create_folder">
                        创建
                    </n-button>
                </div>
            </n-form-item>
        </n-form>

    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 380px;
    background-color: rgb(255, 255, 255);
    border-radius: 1em;
}

.container>* {
    margin-bottom: 24px;
}

.title {
    font-size: 24px;
    font-weight: 300;
}

.icon {
    width: 80px;
}

.login-form {
    width: 240px;
    margin-bottom: 12px;
}
</style>