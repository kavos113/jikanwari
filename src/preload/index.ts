import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SearchQuery } from '../types/search.js'
import { UserTimetable } from '../types/user.js'

// Custom APIs for renderer
const api = {
  scrape: () => ipcRenderer.invoke('scrape'),
  scrapeTest: () => ipcRenderer.invoke('scrapeTest'),
  pingCustom: () => ipcRenderer.invoke('pingCustom'),
  search: (query: SearchQuery) => ipcRenderer.invoke('search', query),
  getCourse: (id: number) => ipcRenderer.invoke('getCourse', id),
  postUserTimetable: (userTimetables: UserTimetable[]) =>
    ipcRenderer.invoke('postUserTimetable', userTimetables),
  getUserTimetable: (year: number, quarter: number) =>
    ipcRenderer.invoke('getUserTimetable', year, quarter),
  deleteUserTimetable: (year: number, quarter: number, course_id: number) =>
    ipcRenderer.invoke('deleteUserTimetable', year, quarter, course_id),
  onChangeScrapingStatus: (callback) =>
    ipcRenderer.on('scraping-status', (_event, value) => callback(value)),
  onChangeScrapingCount: (callback) =>
    ipcRenderer.on('scraping-count', (_event, value) => callback(value)),
  onChangeScrapingCountFinish: (callback) =>
    ipcRenderer.on('scraping-count-finish', (_event, value) => callback(value))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
