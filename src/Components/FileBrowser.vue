<script setup lang="ts">
import { h, ref, type Ref, watch } from 'vue';
import axios from 'axios';
import { filesize } from 'filesize'
import { NButton, type SelectOption, type UploadFileInfo } from 'naive-ui'

//#region type
interface DirOption {
    label: string;
    value: string;
}

interface File {
    isfile: boolean;
    name: string;
    size: number;
    modified: Date;
}
//#endregion

//#region filebrowser_properties
const base_url = '/api/filebrowser';

let selectedDir: Ref<string | null> = ref(window.localStorage.getItem('selectedDir'));
let temp_rpStack = window.localStorage.getItem('relativePathStack');
let relativePathStack: Ref<string[]> = ref(temp_rpStack == null || temp_rpStack.length == 0 ? [] : temp_rpStack!.split('/'));
let dirAccessOptions: Ref<DirOption[]> = ref([]);
//#endregion

//#region table_properties
let tableData_dir: Ref<File[]> = ref([]);
let tableData_file: Ref<File[]> = ref([]);
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
});

let pagination_dir = ref({
    page: 1,
    pageSize: 8,
    showSizePicker: true,
    pageSizes: [4, 8, 12, 16, 32],
    onChange: (page: number) => {
        pagination_dir.value.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination_dir.value.pageSize = pageSize
        pagination_dir.value.page = 1
    }
});

let tableColumns_dir = [
    {
        title: '目录',
        key: 'name',
        width: '400px',
        align: 'left',
        render: (data: File, _: number) => {
            let name = data.name;
            return h(
                'a',
                {
                    href: "javascript:void(0);",
                    onClick(event: Event) {
                        enter_dir(name);
                    },
                    class: 'dirlink'
                },
                name + '/'
            );
        },
        sorter: 'default'
    },
    {
        title: '大小',
        key: 'size',
        width: '150px',
        align: 'right',
        render: (_1: File, _2: number) => {
            return '';
        }
    },
    {
        title: '修改时间',
        key: 'modified',
        width: '200px',
        align: 'right',
        render: (data: File, _: number) => {
            return data.modified.toLocaleString();
        },
        sorter: (file1: File, file2: File) => {
            return file1.modified > file2.modified;
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: '150px',
        align: 'right'
    }
]

let tableColumns_file = [
    {
        title: '文件名',
        key: 'name',
        width: '400px',
        align: 'left',
        render: (data: File, _: number) => {
            let name = data.name;
            let query = `?file=${encodeURIComponent(name)}`;
            if (relativePathStack.value.length > 0) {
                query = `?file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
            }
            return h(
                'a',
                {
                    href: `${base_url}/${selectedDir.value as string}/download${query}`,
                    class: 'dowloadlink'
                },
                name
            );
        },
        sorter: 'default'
    },
    {
        title: '大小',
        key: 'size',
        width: '150px',
        align: 'right',
        render: (data: File, _: number) => {
            return filesize(data.size) as string;
        },
        sorter: (file1: File, file2: File) => {
            return file1.size > file2.size;
        }
    },
    {
        title: '修改时间',
        key: 'modified',
        width: '200px',
        align: 'right',
        render: (data: File, _: number) => {
            return data.modified.toLocaleString();
        },
        sorter: (file1: File, file2: File) => {
            return file1.modified > file2.modified;
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: '150px',
        align: 'right',
        render: (data: File, _: number) => {
            let download_button = h(NButton, {
                type: 'info',
                onClick: () => {
                    let name = data.name;
                    let path = `file=${encodeURIComponent(name)}`;
                    if (relativePathStack.value.length > 0) {
                        path = `file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
                    }
                    window.location.href = `${base_url}/${selectedDir.value as string}/download?inline=false&${path}`;
                }
            }, { default: () => '下载' });
            let delete_button = h(NButton, {
                type: 'error',
                onClick: () => {
                    let dirname = selectedDir.value;
                    let filename = data.name;
                    let relativepath = relativePathStack.value.join('/');

                    axios.post(`${base_url}/${dirname}/delete?file=${encodeURIComponent(filename)}&relative_path=${encodeURIComponent(relativepath)}`)
                        .then(_ => {
                            update_FileTable();
                        });
                },
                style: "margin-left: 10px"
            }, { default: () => '删除' });
            let div = h('div', {
                style: "display: flex;justify-content: flex-end;"
            }, [download_button, delete_button]);
            return div;
        }
    }
]
//#endregion

//#region filebrowser_function
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
//#endregion

//#region function_filetable
function update_FileTable() {
    tableData_dir.value = [];
    tableData_file.value = [];
    let query = '';
    if (relativePathStack.value.length > 0) {
        query = `?relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
    }
    return axios.get(`${base_url}/${selectedDir.value as string}/info${query}`).then(
        function (response) {
            let dirList = response.data['dirlist'];
            let fileList = response.data['filelist'];
            for (let dir of dirList) {
                let time = new Date(dir['modify_time'] * 1000);
                tableData_dir.value.push({
                    isfile: dir['is_file'],
                    name: dir['name'],
                    modified: time,
                    size: dir['file_size']
                });
            }
            for (let file of fileList) {
                let time = new Date(file['modify_time'] * 1000);
                tableData_file.value.push({
                    isfile: file['is_file'],
                    name: file['name'],
                    modified: time,
                    size: file['file_size']
                });
            }
        }
    )
}

function select_Dir(value: string, _: SelectOption) {
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
//#endregion

init_DirAccessList();
if (selectedDir.value != null) {
    update_FileTable();
}

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
                <n-button v-if="relativePathStack.length != 0" @click="return_superior()">
                    返回上级
                </n-button>
            </div>
            <div>
                <n-upload v-if="selectedDir != null" multiple
                    :action='`${base_url}/${selectedDir}/upload?relative_path=${encodeURIComponent(relativePathStack.join("/"))}`'>
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
        <n-collapse :default-expanded-names="['1', '2']">
            <n-collapse-item v-if="tableData_dir.length != 0" title="目录" name="1">
                <n-data-table :columns="tableColumns_dir" :data="tableData_dir" :pagination="pagination_dir" />
            </n-collapse-item>
            <n-collapse-item title="文件" name="2">
                <n-data-table :columns="tableColumns_file" :data="tableData_file" :pagination="pagination" />
            </n-collapse-item>
        </n-collapse>
    </main>
</template>

<style scoped>
:deep(.dirlink) {
    color: rgb(0, 178, 119);
    text-decoration: none;
}

:deep(.dowloadlink) {
    text-decoration: none;
}
</style>
