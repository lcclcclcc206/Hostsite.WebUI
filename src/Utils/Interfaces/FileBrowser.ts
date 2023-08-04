interface DirOption {
    label: string;
    value: string;
}

interface FileUnit {
    isfile: boolean;
    name: string;
    size: number;
    modified: Date;
}

export type {
    DirOption,
    FileUnit
}