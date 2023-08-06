<script setup lang="ts">
import { provide, ref, type Ref } from 'vue';
import { type SelectOption } from 'naive-ui'
import { BASE_URL } from '@/Utils/constant';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { type FileUnit } from '@/Utils/Interfaces/FileBrowser';
import FileBrowserOption from '@/Components/FileBrowser/FileBrowserOption.vue';
import FileBrowserBody from '@/Components/FileBrowser/FileBrowserBody.vue';

const userInfo = useUserInfoStore();
const axios = useAxiosStore();

const selectedDir: Ref<string | null> = ref(window.localStorage.getItem('selectedDir'));
const temp_rpStack = window.localStorage.getItem('relativePathStack');
const relativePathStack: Ref<string[]> = ref(temp_rpStack == null || temp_rpStack.length == 0 ? [] : temp_rpStack!.split('/'));

const tableDataDir: Ref<FileUnit[]> = ref([]);
const tableDataFile: Ref<FileUnit[]> = ref([]);

provide('selectedDir', selectedDir);
provide('relativePathStack', relativePathStack);
provide('tableDataDir', tableDataDir);
provide('tableDataFile', tableDataFile);

provide('selectDir', select_dir);
provide('enterDir', enter_dir);
provide('returnSuperior', return_superior);
provide('updateFileTable', update_FileTable);


function return_superior(index?: number) {
    if (typeof (index) === 'number') {
        relativePathStack.value = relativePathStack.value.slice(0, index + 1);
    }
    else {
        relativePathStack.value.pop();
    }
    window.localStorage.setItem('relativePathStack', relativePathStack.value.join('/'));
    update_FileTable();
}

function update_FileTable() {
    tableDataDir.value = [];
    tableDataFile.value = [];
    let query = '';
    if (relativePathStack.value.length > 0) {
        query = `?relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
    }
    return axios.default.get(`${BASE_URL}/${selectedDir.value as string}/info${query}`).then(
        function (response) {
            let dirList = response.data['dirlist'];
            let fileList = response.data['filelist'];
            for (let dir of dirList) {
                let time = new Date(dir['modify_time'] * 1000);
                tableDataDir.value.push({
                    isfile: dir['is_file'],
                    name: dir['name'],
                    modified: time,
                    size: dir['file_size']
                });
            }
            for (let file of fileList) {
                let time = new Date(file['modify_time'] * 1000);
                tableDataFile.value.push({
                    isfile: file['is_file'],
                    name: file['name'],
                    modified: time,
                    size: file['file_size']
                });
            }
        }
    )
}

function select_dir(value: string, _: SelectOption) {
    selectedDir.value = value;
    window.localStorage.setItem('selectedDir', value);
    relativePathStack.value = [];
    window.localStorage.removeItem('relativePathStack');
    update_FileTable();
}

function enter_dir(dirname: string) {
    relativePathStack.value.push(dirname);
    window.localStorage.setItem('relativePathStack', relativePathStack.value.join('/'));
    update_FileTable();
}

</script>

<template>
    <main>
        <NMessageProvider>
            <h2 class="filebrowser-title" v-if="userInfo.token != null">FileBrowser</h2>
            <FileBrowserOption :selected-dir="selectedDir" :relative-path-stack="relativePathStack" @select-dir="select_dir"
                @return-superior="return_superior" @update-file-table="update_FileTable" />
            <FileBrowserBody :selected-dir="selectedDir" :relative-path-stack="relativePathStack"
                :table-data-dir="tableDataDir" :table-data-file="tableDataFile" @enter-dir="enter_dir"
                @update-file-table="update_FileTable" />
        </NMessageProvider>
    </main>
</template>

<style scoped>
.filebrowser-title {
    font-weight: 400;
}
</style>