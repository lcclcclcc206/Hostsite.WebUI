<script setup lang="ts">
import { h, inject, ref, type Ref } from 'vue';
import { type FileUnit } from '@/Utils/Interfaces/FileBrowser';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { useFileBrowserStore } from '@/Stores/FileBrowserStore';
import { filesize } from 'filesize'
import { NButton, useMessage } from 'naive-ui'
import { BASE_URL } from '@/Utils/constant';
import { storeToRefs } from 'pinia';


const userInfo = useUserInfoStore();
const axios = useAxiosStore();
const filebrowserInfo = useFileBrowserStore();
const message = useMessage();

const selectedDir: Ref<string | null> = storeToRefs(filebrowserInfo).selectedDir;
const relativePathStack: Ref<string[]> = storeToRefs(filebrowserInfo).relativePathStack;

const tableDataDir = inject('tableDataDir') as Ref<FileUnit[]>;
const tableDataFile = inject('tableDataFile') as Ref<FileUnit[]>;

const enter_dir = inject('enterDir') as (dirname: string) => void;
const update_FileTable = inject('updateFileTable') as () => void;

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
        render: (data: FileUnit, _: number) => {
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
        render: (_1: FileUnit, _2: number) => {
            return '';
        }
    },
    {
        title: '修改时间',
        key: 'modified',
        width: '200px',
        align: 'right',
        render: (data: FileUnit, _: number) => {
            return data.modified.toLocaleString();
        },
        sorter: (file1: FileUnit, file2: FileUnit) => {
            return file1.modified > file2.modified;
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: '150px',
        align: 'right',
        render: (data: FileUnit, _: number) => {
            let delete_button = h(NButton, {
                type: 'error',
                onClick: () => {
                    let dirname = selectedDir.value;
                    let folder_name = data.name;
                    let relativepath = relativePathStack.value.join('/');

                    axios.useToken.post(`${BASE_URL}/${dirname}/delete-folder?folder_name=${encodeURIComponent(folder_name)}&relative_path=${encodeURIComponent(relativepath)}`)
                        .then(_ => {
                            update_FileTable();
                        }).catch(function (error) {
                            message.error("文件夹删除失败，请确保文件夹为空！", { duration: 2000 });
                        });
                },
                style: "margin-left: 10px"
            }, { default: () => '删除' });
            let operation_list = [];
            if (userInfo.token != null)
                operation_list.push(delete_button);
            let div = h('div', {
                style: "display: flex;justify-content: flex-end;"
            }, operation_list);
            return div;
        }
    }
]

let tableColumns_file = [
    {
        title: '文件名',
        key: 'name',
        width: '400px',
        align: 'left',
        render: (data: FileUnit, _: number) => {
            let name = data.name;
            let query = `?file=${encodeURIComponent(name)}`;
            if (relativePathStack.value.length > 0) {
                query = `?file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
            }
            return h(
                'a',
                {
                    href: `${BASE_URL}/${selectedDir.value as string}/download${query}`,
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
        render: (data: FileUnit, _: number) => {
            return filesize(data.size) as string;
        },
        sorter: (file1: FileUnit, file2: FileUnit) => {
            return file1.size > file2.size;
        }
    },
    {
        title: '修改时间',
        key: 'modified',
        width: '200px',
        align: 'right',
        render: (data: FileUnit, _: number) => {
            return data.modified.toLocaleString();
        },
        sorter: (file1: FileUnit, file2: FileUnit) => {
            return file1.modified > file2.modified;
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: '150px',
        align: 'right',
        render: (data: FileUnit, _: number) => {
            let download_button = h(NButton, {
                type: 'info',
                onClick: () => {
                    let name = data.name;
                    let path = `file=${encodeURIComponent(name)}`;
                    if (relativePathStack.value.length > 0) {
                        path = `file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(relativePathStack.value.join('/'))}`;
                    }
                    window.location.href = `${BASE_URL}/${selectedDir.value as string}/download?inline=false&${path}`;
                }
            }, { default: () => '下载' });
            let delete_button = h(NButton, {
                type: 'error',
                onClick: () => {
                    let dirname = selectedDir.value;
                    let filename = data.name;
                    let relativepath = relativePathStack.value.join('/');

                    axios.useToken.post(`${BASE_URL}/${dirname}/delete?file=${encodeURIComponent(filename)}&relative_path=${encodeURIComponent(relativepath)}`)
                        .then(_ => {
                            update_FileTable();
                        });
                },
                style: "margin-left: 10px"
            }, { default: () => '删除' });
            let operation_list = [download_button];
            if (userInfo.token != null)
                operation_list.push(delete_button);
            let div = h('div', {
                style: "display: flex;justify-content: flex-end;"
            }, operation_list);
            return div;
        }
    }
]
</script>

<template>
    <main>
        <n-collapse :default-expanded-names="['1', '2']">
            <n-collapse-item v-if="tableDataDir.length != 0" title="目录" name="1">
                <n-data-table :columns="tableColumns_dir" :data="tableDataDir" :pagination="pagination_dir" />
            </n-collapse-item>
            <n-collapse-item title="文件" name="2">
                <n-data-table :columns="tableColumns_file" :data="tableDataFile" :pagination="pagination" />
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