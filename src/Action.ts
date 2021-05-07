export const Action = {
    Type: {
        OpenWorkspace: 'OpenWorkspace'
    },

    openWorkspace(workspaceId: string) {
        chrome.runtime.sendMessage({
            type: Action.Type.OpenWorkspace,
            workspaceId: workspaceId
        })
    }
}
