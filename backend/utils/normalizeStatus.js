// backend/utils/normalizeStatus.js
export const normalizeStatus = (stock) =>
    stock > 0 ? "In Stock" : "Out of Stock";
