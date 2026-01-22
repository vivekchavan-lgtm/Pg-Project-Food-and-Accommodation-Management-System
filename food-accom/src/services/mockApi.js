// src/services/mockApi.js
// localStorage-backed mock API with owner support for menus & rooms

const LS_KEYS = {
  MENUS: 'foodaccom_menus_v1',
  BOOKINGS: 'foodaccom_bookings_v1',
  USERS: 'foodaccom_users_v1',
  ROOMS: 'foodaccom_rooms_v1',
};

const defaultMenus = [
  { id: 1, name: 'Paratha & Sabzi', type: 'Breakfast', price: 50, owner: 'owner1' },
  { id: 2, name: 'Veg Thali', type: 'Lunch', price: 120, owner: 'owner2' },
  { id: 3, name: 'Paneer Butter Masala', type: 'Dinner', price: 150, owner: 'owner1' },
];

const defaultRooms = [
  { id: 1, number: 'A-101', type: 'Single', price: 500, owner: 'owner1', available: true },
  { id: 2, number: 'A-102', type: 'Double', price: 800, owner: 'owner2', available: true },
];

function read(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* MENUS */
export function getMenus() {
  let menus = read(LS_KEYS.MENUS, null);
  if (!menus) { menus = defaultMenus; write(LS_KEYS.MENUS, menus); }
  return Promise.resolve(menus);
}
export function addMenu(menu) {
  const menus = read(LS_KEYS.MENUS, defaultMenus);
  const id = menus.length ? Math.max(...menus.map(m=>m.id)) + 1 : 1;
  const newMenu = { id, ...menu };
  menus.push(newMenu);
  write(LS_KEYS.MENUS, menus);
  return Promise.resolve(newMenu);
}
export function updateMenu(id, changes) {
  const menus = read(LS_KEYS.MENUS, defaultMenus).map(m => m.id === id ? { ...m, ...changes } : m);
  write(LS_KEYS.MENUS, menus);
  return Promise.resolve(menus.find(m=>m.id===id));
}
export function deleteMenu(id) {
  const menus = read(LS_KEYS.MENUS, defaultMenus).filter(m => m.id !== id);
  write(LS_KEYS.MENUS, menus);
  return Promise.resolve(true);
}

/* ROOMS */
export function getRooms() {
  let rooms = read(LS_KEYS.ROOMS, null);
  if (!rooms) { rooms = defaultRooms; write(LS_KEYS.ROOMS, rooms); }
  return Promise.resolve(rooms);
}
export function addRoom(room) {
  const rooms = read(LS_KEYS.ROOMS, defaultRooms);
  const id = rooms.length ? Math.max(...rooms.map(r=>r.id)) + 1 : 1;
  const newRoom = { id, ...room };
  rooms.push(newRoom);
  write(LS_KEYS.ROOMS, rooms);
  return Promise.resolve(newRoom);
}
export function updateRoom(id, changes) {
  const rooms = read(LS_KEYS.ROOMS, defaultRooms).map(r => r.id === id ? { ...r, ...changes } : r);
  write(LS_KEYS.ROOMS, rooms);
  return Promise.resolve(rooms.find(r=>r.id===id));
}
export function deleteRoom(id) {
  const rooms = read(LS_KEYS.ROOMS, defaultRooms).filter(r => r.id !== id);
  write(LS_KEYS.ROOMS, rooms);
  return Promise.resolve(true);
}

/* BOOKINGS */
export function getBookings() {
  return Promise.resolve(read(LS_KEYS.BOOKINGS, []));
}
export function addBooking(booking) {
  // booking expected to contain: username, menuId? or roomId?, nights, roomNumber (optional)
  const bookings = read(LS_KEYS.BOOKINGS, []);
  const id = bookings.length ? Math.max(...bookings.map(b=>b.id)) + 1 : 1;

  // derive owner (if menuId provided use menu.owner, if roomId provided use room.owner)
  let owner = null;
  if (booking.menuId) {
    const menus = read(LS_KEYS.MENUS, defaultMenus);
    const menu = menus.find(m => m.id === Number(booking.menuId));
    if (menu) owner = menu.owner || null;
  }
  if (booking.roomId) {
    const rooms = read(LS_KEYS.ROOMS, defaultRooms);
    const room = rooms.find(r => r.id === Number(booking.roomId));
    if (room) owner = room.owner || owner;
  }

  const newBooking = { id, status: 'pending', createdAt: new Date().toISOString(), owner, ...booking };
  bookings.push(newBooking);
  write(LS_KEYS.BOOKINGS, bookings);
  return Promise.resolve(newBooking);
}
export function updateBooking(id, changes) {
  const bookings = read(LS_KEYS.BOOKINGS, []).map(b => b.id === id ? { ...b, ...changes } : b);
  write(LS_KEYS.BOOKINGS, bookings);
  return Promise.resolve(bookings.find(b=>b.id===id));
}

/* USERS (demo) */
export function getUsers() {
  const users = read(LS_KEYS.USERS, [{ id: 1, username: 'admin', role: 'admin' }, { id: 2, username: 'owner1', role: 'owner' }, { id:3, username:'owner2', role:'owner' }]);
  write(LS_KEYS.USERS, users);
  return Promise.resolve(users);
}

export default {
  getMenus, addMenu, updateMenu, deleteMenu,
  getRooms, addRoom, updateRoom, deleteRoom,
  getBookings, addBooking, updateBooking,
  getUsers,
};
