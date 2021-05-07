import { assert, randomString } from "../Utils.js"
import WorkspaceList from "./WorkspaceList.js"
import WorkspaceTab from "./WorkspaceTab.js"
import LocalStorage from "../storage/LocalStorage.js"
import { scheduleSuspend } from "../TabSuspend.js"

const Workspace = {
	async create({ name, color, tabs, windowId }) {
		if (!tabs || tabs.length === 0) {
			tabs = [WorkspaceTab.createEmpty()]
		}

		const workspace = {
			id: `${LocalStorage.WORKSPACE_PREFIX}${randomString(8)}`,
			name, color, tabs
		}

		await Workspace.save(workspace)
		await WorkspaceList.add(workspace.id, windowId)

		return workspace
	},

	async get(workspaceId) {
		return await LocalStorage.get(workspaceId)
	},

	async save(workspace) {
		assert(Array.isArray(workspace.tabs))
		assert(workspace.tabs.every(tab => typeof tab === "object"))

		await LocalStorage.set(workspace.id, workspace)
	},

	async remove(workspaceId) {
		await WorkspaceList.remove(workspaceId)
		await LocalStorage.remove(workspaceId)
	},

	async open(workspaceId) {
		const workspace = await Workspace.get(workspaceId)
		const windowId = await WorkspaceList.findWindowForWorkspace(workspaceId)

		if (windowId && await focusWindow(windowId)) {
			return
		}

		const newWindow = await createWindow(workspace)
		await initWindow(workspace, newWindow)

		async function createWindow(workspace) {
			return await chrome.windows.create({
				url: workspace.tabs.map(tab => tab.url),
				focused: true
			})
		}

		async function initWindow(workspace, window) {
			await WorkspaceList.update(workspace.id, window.id)

			workspace.tabs.forEach(({ url, active = false, pinned = false}, i) => {
				const tabId = window.tabs[i].id
				if (url.startsWith("http")) {
					scheduleSuspend(tabId)
				}
				chrome.tabs.update(tabId, { active, pinned })
			})
		}

		async function focusWindow(windowId) {
			try {
				await chrome.windows.update(windowId, { focused: true })
				return true
			} catch (e) {
				console.error(e)
				return false
			}
		}
	},

	async updateFromWindow(windowId) {
		const workspaceId = await WorkspaceList.findWorkspaceForWindow(windowId)
		if (!workspaceId) return

		const workspace = await Workspace.get(workspaceId)
		if (!workspace) return

		const tabs = await chrome.tabs.query({ windowId })
		workspace.tabs = tabs.map(WorkspaceTab.create)

		await Workspace.save(workspace)
	}
}

export default Workspace
