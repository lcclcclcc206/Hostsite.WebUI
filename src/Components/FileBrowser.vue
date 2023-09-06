<script setup lang="ts">
import { provide, ref, watch, type Ref } from 'vue';
import { c, type SelectOption } from 'naive-ui'
import { BASE_URL } from '@/Utils/constant';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { useFileBrowserStore } from '@/Stores/FileBrowserStore';
import { type FileUnit } from '@/Utils/Interfaces/FileBrowser';
import FileBrowserOption from '@/Components/FileBrowser/FileBrowserOption.vue';
import FileBrowserBody from '@/Components/FileBrowser/FileBrowserBody.vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const userInfo = useUserInfoStore();
const axios = useAxiosStore();
const filebrowserInfo = useFileBrowserStore();
const route = useRoute();
const router = useRouter();

const selectedDir: Ref<string | null> = storeToRefs(filebrowserInfo).selectedDir;
const relativePathStack: Ref<string[]> = storeToRefs(filebrowserInfo).relativePathStack;
const tableDataDir: Ref<FileUnit[]> = ref([]);
const tableDataFile: Ref<FileUnit[]> = ref([]);

provide('tableDataDir', tableDataDir);
provide('tableDataFile', tableDataFile);

provide('selectDir', select_dir);
provide('enterDir', enter_dir);
provide('returnSuperior', return_superior);
provide('updateFileTable', update_FileTable);

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

function return_superior(index?: number) {
    if (typeof (index) === 'number') {
        relativePathStack.value = relativePathStack.value.slice(0, index + 1);
    }
    else {
        relativePathStack.value.pop();
    }
    router.push({
        name: 'filebrowser',
        params: {
            dir: selectedDir.value
        },
        query: {
            relativepath: relativePathStack.value.join('/')
        }
    });
}

function select_dir(value: string, _: SelectOption) {
    selectedDir.value = value;
    window.localStorage.setItem('selectedDir', value);
    relativePathStack.value = [];
    router.push({
        name: 'filebrowser',
        params: {
            dir: selectedDir.value
        },
        query: {
            relativepath: relativePathStack.value.join('/')
        }
    });
}

function enter_dir(dirname: string) {
    relativePathStack.value.push(dirname);
    router.push({
        name: 'filebrowser',
        params: {
            dir: selectedDir.value
        },
        query: {
            relativepath: relativePathStack.value.join('/')
        }
    });
}

function init() {
    let route_dir = route.params.dir as string;
    let route_relativepath = route.query.relativepath as string;
    let need_relativepath = false;
    if (route_dir == '' || route_dir == undefined) {
        let local_dir = window.localStorage.getItem('selectedDir');
        if (local_dir == null) {
            selectedDir.value = null;
            window.localStorage.removeItem('selectedDir');
            relativePathStack.value = [];
        }
        else {
            selectedDir.value = local_dir;
            need_relativepath = true;
        }
    }
    else {
        selectedDir.value = route_dir;
        window.localStorage.setItem('selectedDir', route_dir);
        need_relativepath = true;
    }

    if (need_relativepath) {
        if (route_relativepath == '' || route_relativepath == undefined) {
            let local_relativepath = window.localStorage.getItem('relativePathStack');
            if (local_relativepath == null) {
                relativePathStack.value = [];
            }
            else {
                relativePathStack.value = local_relativepath.split('/');
            }
        }
        else {
            relativePathStack.value = route_relativepath.split('/');
        }
    }

    router.replace({
        name: 'filebrowser',
        params: {
            dir: selectedDir.value
        },
        query: {
            relativepath: relativePathStack.value.join('/')
        }
    });

    if (selectedDir.value != null) {
        update_FileTable();
    }
}

function route_update(route_dir: string, route_relativepath: string) {
    if (route_dir == '' || route_dir == undefined) {
        selectedDir.value = null;
        relativePathStack.value = [];
    }
    else {
        selectedDir.value = route_dir;
        window.localStorage.setItem('selectedDir', route_dir);
        if (route_relativepath == '' || route_relativepath == undefined) {
            relativePathStack.value = [];
            window.localStorage.removeItem('relativePathStack');
        }
        else {
            relativePathStack.value = route_relativepath.split('/');
            window.localStorage.setItem('relativePathStack', route_relativepath);
        }
    }
}

onBeforeRouteUpdate(async (to, from) => {
    let dir = from.params.dir;
    console.log(to.params.dir);
    if ((dir == '' || dir == undefined) && (to.params.dir == '' || to.params.dir == undefined))
        return;

    route_update(to.params.dir as string, to.query.relativepath as string);
    update_FileTable();
});

init();
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