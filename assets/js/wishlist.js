import { PRODUCTS } from "./products-data.js";

export const WISH_KEY = "sf_wishlist";

export function loadWish() {
  try {
    const raw = localStorage.getItem(WISH_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveWish(ids) {
  localStorage.setItem(WISH_KEY, JSON.stringify(ids));
}

export function isWished(id) {
  return loadWish().includes(id);
}

export function toggleWish(id) {
  const ids = loadWish();
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.unshift(id);
  saveWish(ids);
  return ids;
}

export function wishCount() {
  return loadWish().length;
}

export function wishProducts() {
  const ids = loadWish();
  return ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
}
