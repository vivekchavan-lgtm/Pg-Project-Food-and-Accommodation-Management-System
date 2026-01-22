// src/services/notifications.js
// Simple localStorage-backed notifications service

const LS_KEY = 'foodaccom_notifications_v1'

function read() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}
function write(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr))
}

export function getNotifications() {
  return Promise.resolve(read())
}

export function addNotification({ to = 'all', title = '', body = '', meta = {}, unread = true }) {
  // to: 'all' OR a username OR 'admin' OR 'owner'
  const arr = read()
  const id = arr.length ? Math.max(...arr.map(n => n.id)) + 1 : 1
  const item = {
    id,
    to,
    title,
    body,
    meta,
    unread: !!unread,
    createdAt: new Date().toISOString()
  }
  arr.unshift(item) // newest first
  write(arr)
  return Promise.resolve(item)
}

export function markRead(id) {
  const arr = read().map(n => n.id === id ? { ...n, unread: false } : n)
  write(arr)
  return Promise.resolve(true)
}

export function markAllRead(forTarget) {
  const arr = read().map(n => {
    if (!forTarget) return { ...n, unread: false }
    // mark read only for notifications matching user/admin/owner/all
    // forTarget can be username or role
    if (n.to === 'all') return { ...n, unread: false }
    if (n.to === forTarget) return { ...n, unread: false }
    return n
  })
  write(arr)
  return Promise.resolve(true)
}

export function clearNotifications(forTarget = null) {
  if (!forTarget) {
    write([])
    return Promise.resolve(true)
  }
  const arr = read().filter(n => !(n.to === forTarget || n.to === 'all'))
  write(arr)
  return Promise.resolve(true)
}

export default {
  getNotifications, addNotification, markRead, markAllRead, clearNotifications
}
