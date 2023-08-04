<script setup lang="ts">
import { h, ref } from 'vue';
import { type FileUnit } from '@/Utils/Interfaces/FileBrowser';
import { useUserInfoStore } from '@/Stores/UserInfoStore';
import { useAxiosStore } from '@/Stores/AxiosStore';
import { filesize } from 'filesize'
import { NButton } from 'naive-ui'
import { BASE_URL } from '@/Utils/constant';


const userInfo = useUserInfoStore();
const axios = useAxiosStore();

const props = defineProps<{
    selectedDir: string | null,
    relativePathStack: string[],
    tableDataDir: FileUnit[],
    tableDataFile: FileUnit[]
}>();

const emit = defineEmits<{
    enterDir: [dirname: string],
    updateFileTable: [],
}>();

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
                        emit('enterDir', name);
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
        align: 'right'
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
            if (props.relativePathStack.length > 0) {
                query = `?file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(props.relativePathStack.join('/'))}`;
            }
            return h(
                'a',
                {
                    href: `${BASE_URL}/${props.selectedDir as string}/download${query}`,
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
                    if (props.relativePathStack.length > 0) {
                        path = `file=${encodeURIComponent(name)}&relative_path=${encodeURIComponent(props.relativePathStack.join('/'))}`;
                    }
                    window.location.href = `${BASE_URL}/${props.selectedDir as string}/download?inline=false&${path}`;
                }
            }, { default: () => '下载' });
            let delete_button = h(NButton, {
                type: 'error',
                onClick: () => {
                    let dirname = props.selectedDir;
                    let filename = data.name;
                    let relativepath = props.relativePathStack.join('/');

                    axios.useToken.post(`${BASE_URL}/${dirname}/delete?file=${encodeURIComponent(filename)}&relative_path=${encodeURIComponent(relativepath)}`)
                        .then(_ => {
                            emit('updateFileTable');
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