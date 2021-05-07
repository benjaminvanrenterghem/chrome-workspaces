import { Color } from "../Color"

const Bookmarks = {
  async getRootId() {
    const title = "Workspaces Data"
    const results = await chrome.bookmarks.search(title)
    const root = results[0] ?? await chrome.bookmarks.create({ title })

    return root.id
  },

  async createWorkspace({ title, color = Color.GREY }) {
    const rootId = await Bookmarks.getRootId()
    const workspaceName = title.replace(/[\[\]]/g, "").slice(0, 40)
    const workspaceParams = `[color=${color}]`
    const workspaceNode = await chrome.bookmarks.create({
      title: `${workspaceName} ${workspaceParams}`,
      parentId: rootId
    })

    return workspaceNode.id
  },

  async getWorkspace() {
    const rootId = await Bookmarks.getRootId()
    
  },

  async updateWorkspace() {

  },

  async removeWorkspace() {

  },

  async createTab() {

  },

  async getTab() {

  },

  async updateTab() {

  },

  async removeTab() {

  },

  async moveTab() {

  }
}

export default Bookmarks