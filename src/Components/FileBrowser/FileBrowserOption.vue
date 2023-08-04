<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type SelectOption, type UploadCustomRequestOptions } from 'naive-ui'
import { type DirOption } from '@/Utils/Interfaces/FileBrowser';
import { BASE_URL } from '@/Utils/constant';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';

const userInfo = useUserInfoStore();
const axios = useAxiosStore();

const props = defineProps<{
    selectedDir: string | null,
    relativePathStack: string[]
}>();

const emit = defineEmits<{
    selectDir: [value: string, option: SelectOption],
    returnSuperior: [index?: number],
    updateFileTable: [],
}>();

const dirAccessOptions: Ref<DirOption[]> = ref([]);

function selectDir(value: string, option: SelectOption) {
    emit('selectDir', value, option);
}

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
if (props.selectedDir != null) {
    emit('updateFileTable');
}
</script>

<template>
    <main>
        <n-select style="width: 200px;" placeholder="选择文件夹" v-bind:value="props.selectedDir" :options="dirAccessOptions"
            @update:value="selectDir" />
        <div style="margin-top: 12px;display: flex;justify-content: space-between;">
            <div>
                <n-button v-if="relativePathStack.length != 0" @click="emit('returnSuperior')">
                    返回上级
                </n-button>
            </div>
            <div>
                <n-upload v-if="selectedDir != null && userInfo.token != null" multiple
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
            <n-breadcrumb-item v-for="(item, index) in relativePathStack" @click="emit('returnSuperior', index)">
                {{ item }}
            </n-breadcrumb-item>
        </n-breadcrumb>
    </main>
</template>

<style scoped></style>