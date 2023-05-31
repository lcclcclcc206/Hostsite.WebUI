<script setup lang="ts">
import { h, ref, type Ref } from 'vue';
import axios from 'axios';
import { filesize } from 'filesize'
import { type SelectOption } from 'naive-ui'

interface DirOption {
    label: string;
    value: string;
}

interface file {
    isfile: boolean;
    name: string;
    size: string;
    modified: string;
}

const base_url = '/api/filebrowser';

let selectedDir: Ref<string | null> = ref(null);
let relativePathStack: Ref<string[]> = ref([]);
let dirAccessOptions: Ref<DirOption[]> = ref([]);
let tableData: Ref<file[]> = ref([]);
let pagination = ref({
    page: 1,
    pageSize: 20,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    onChange: (page: number) => {
        pagination.value.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.value.pageSize = pageSize
        pagination.value.page = 1
    }
})

let tableColumns = [
    {
        title: '名称',
        key: 'name',
        width: '400px',
        align: 'left',
        render: (data: file, _: number) => {
            let name = data.name;
            let query = `?file=${encodeURI(name)}`;
            if (relativePathStack.value.length > 0) {
                query = encodeURI(`?file=${encodeURI(name)}&relative_path=${relativePathStack.value.join('/')}`);
            }
            if (data.isfile) {
                return h(
                    'a',
                    {
                        href: `${base_url}/${selectedDir.value as string}/download${query}`,
                        class: 'dowloadlink',
                        target: '_blank'
                    },
                    name
                );
            }
            else {
                return h(
                    'a',
                    {
                        href: "javascript:void(0);",
                        onClick(event: Event) {
                            enter_dir(name);
                        },
                        class: 'dirlink'
                    },
                    name
                );
            }
        }
    },
    {
        title: '大小',
        key: 'size',
        width: '150px',
        align: 'right'
    },
    {
        title: '修改时间',
        key: 'modified',
        width: '200px',
        align: 'right'
    }
]

function init_DirAccessList() {
    return axios.get(base_url).then(
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

function update_FileTable() {
    tableData.value = [];
    let query = '';
    if (relativePathStack.value.length > 0) {
        query = encodeURI(`?relative_path=${relativePathStack.value.join('/')}`);
    }
    return axios.get(`${base_url}/${selectedDir.value as string}/info${query}`).then(
        function (response) {
            let dirList = response.data['dirlist'];
            let fileList = response.data['filelist'];
            for (let dir of dirList) {
                let time = new Date(dir['modify_time'] * 1000);
                tableData.value.push({
                    isfile: dir['is_file'],
                    name: dir['name'] + '/',
                    modified: time.toLocaleString(),
                    size: ''
                });
            }
            for (let file of fileList) {
                let time = new Date(file['modify_time'] * 1000);
                tableData.value.push({
                    isfile: file['is_file'],
                    name: file['name'],
                    modified: time.toLocaleString(),
                    size: filesize(file['file_size']) as string
                });
            }
        }
    )
}

function select_Dir(value: string, _: SelectOption) {
    selectedDir.value = value;
    relativePathStack.value = [];
    update_FileTable();
}

function enter_dir(dirname: string) {
    relativePathStack.value.push(dirname);
    update_FileTable();
}

function return_superior() {
    relativePathStack.value.pop();
    update_FileTable();
}

init_DirAccessList();
</script>

<template>
    <header>
    </header>
    <main>
        <h2>FileBrowser</h2>
        <n-select style="width: 200px;" placeholder="选择文件夹" v-model:value="selectedDir" :options="dirAccessOptions"
            @update:value="select_Dir" />
        <div style="margin-top: 12px;display: flex;justify-content: space-between;">
            <div>
                <n-button v-if="relativePathStack.length != 0" @click="return_superior">
                    返回上级
                </n-button>
            </div>
            <div>
                <n-button>
                    上传文件
                </n-button>
            </div>
        </div>
        <n-divider />
        <n-data-table :columns="tableColumns" :data="tableData" :pagination="pagination" @update:sorter=""/>
    </main>
</template>

<style scoped>
:deep(.dirlink) {
    text-decoration: none;
}

:deep(.dowloadlink) {
    text-decoration: none;
}
</style>
