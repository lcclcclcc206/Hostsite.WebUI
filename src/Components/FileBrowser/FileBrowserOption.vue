<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { type SelectOption, type UploadCustomRequestOptions } from 'naive-ui'
import { type DirOption } from '@/Utils/Interfaces/FileBrowser';
import { BASE_URL } from '@/Utils/constant';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { useFileBrowserStore } from '@/Stores/FileBrowserStore';
import NewFolderPanel from '@/Components/FileBrowser/NewFolderPanel.vue';
import { storeToRefs } from 'pinia';

const userInfo = useUserInfoStore();
const axios = useAxiosStore();
const filebrowserInfo = useFileBrowserStore();

const selectedDir: Ref<string | null> = storeToRefs(filebrowserInfo).selectedDir;
const relativePathStack: Ref<string[]> = storeToRefs(filebrowserInfo).relativePathStack;

const selectDir = inject('selectDir') as (value: string, _: SelectOption) => void;
const return_superior = inject('returnSuperior') as (index?: number) => void;
const update_FileTable = inject('updateFileTable') as () => void;

const dirAccessOptions: Ref<DirOption[]> = ref([]);
const showNewFolderPanel = ref(false);

function uploadfile_customRequest(options: UploadCustomRequestOptions) {
    const formData = new FormData();
    formData.append('file', options.file.file as File);
    axios.useToken.post(options.action as string, formData, {
        headers: options.headers as Record<string, string>,
        onUploadProgress: (event) => {
            options.onProgress({ percent: Math.ceil(event.loaded * 100 / event.total!) });
        }
    }).then((res) => {
        options.onFinish();
    }).catch((error) => {
        options.onError();
    });
}

function init_DirAccessList() {
    return axios.default.get(BASE_URL).then(
        function (response) {
            let data = response.data;
            let list: string[] = data;
            let dirList: string[] = [];
            for (let item of list) {
                dirList.push(item);
            }
            for (let dir of dirList) {
                dirAccessOptions.value.push({
                    label: dir,
                    value: dir
                });
            }
        }
    )
}

init_DirAccessList();
</script>

<template>
    <main>
        <n-select style="width: 200px;" placeholder="选择文件夹" v-bind:value="selectedDir" :options="dirAccessOptions"
            @update:value="selectDir" />
        <div style="margin-top: 12px;display: flex;justify-content: space-between;">
            <div>
                <n-button v-if="relativePathStack.length != 0" @click="return_superior">
                    返回上级
                </n-button>
            </div>
            <div class="file-operation-list" v-if="selectedDir != null && userInfo.token != null">
                <n-button @click="showNewFolderPanel = true">新建文件夹</n-button>
                <n-upload multiple
                    :action='`${BASE_URL}/${selectedDir}/upload?relative_path=${encodeURIComponent(relativePathStack.join("/"))}`'
                    :headers="{ 'Authorization': `${userInfo.token.token_type} ${userInfo.token.access_token}` }"
                    :custom-request="uploadfile_customRequest">
                    <n-button>
                        上传文件
                    </n-button>
                </n-upload>
            </div>
        </div>
        <n-divider />
        <n-breadcrumb style="margin-bottom: 12px;">
            <n-breadcrumb-item v-for="(item, index) in relativePathStack" @click="return_superior(index)">
                {{ item }}
            </n-breadcrumb-item>
        </n-breadcrumb>
        <n-modal v-model:show="showNewFolderPanel">
            <NewFolderPanel class="new-folder-panel" @close="showNewFolderPanel = false" />
        </n-modal>
    </main>
</template>

<style scoped>
.file-operation-list {
    display: flex;
}

.file-operation-list>* {
    margin-left: 12px;
}

.new-folder-panel {
    float: left;
    margin: auto;
}
</style>