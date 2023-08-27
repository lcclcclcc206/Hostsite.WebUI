import { defineStore } from 'pinia'

interface State {
    selectedDir: string | null,
    relativePathStack: string[]
}

export const useFileBrowserStore = defineStore('filebrowser', {
    state: (): State => {
        return {
            selectedDir: null,
            relativePathStack: []
        }
    },
    getters: {

    },
    actions: {
        get_routePath() {
            if (this.selectedDir == null) {
                return `/filebrowser`;
            }
            else {
                if (this.relativePathStack.length == 0) {
                    return `/filebrowser/${encodeURIComponent(this.selectedDir)}`;
                }
                else {
                    return `/filebrowser/${encodeURIComponent(this.selectedDir)}?relativepath=${encodeURIComponent(this.relativePathStack.join('/'))}`
                }
            }
        }
    }
});