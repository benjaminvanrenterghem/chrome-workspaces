import { assert } from "../Utils.js";

const LocalStorage = {
	_observers: [],

	async get(key) {
		if (!key) return null
		const data = await chrome.storage.local.get(key)

		return data[key] ?? null
	},

	async getAll(keys) {
		const data = await chrome.storage.local.get(keys)

		return keys.map(key => data[key] ?? null)
	},

	async set(key, value) {
		assert(key)
		await chrome.storage.local.set({[key]: value})
	},

	async setAll(items) {
		await chrome.storage.local.set(items)
	},

	async update(key, updater) {
		const value = await LocalStorage.get(key)

		await LocalStorage.set(key, updater(value))
	},

	async remove(key) {
		await chrome.storage.local.remove(key)
	},

	subscribe(observer) {
		LocalStorage._observers.push(observer)
	},

	notify(key, value) {
		LocalStorage._observers.forEach(observer => observer(key, value))
	}
}

chrome.storage.onChanged.addListener(function (changes) {
	for (let key in changes) {
		LocalStorage.notify(key, changes[key].newValue)
	}
})

export default LocalStorage