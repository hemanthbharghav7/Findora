/**
 * itemService.js
 * --------------
 * Item (lost & found) API calls for Findora frontend.
 * All functions call the Express /api/items routes via the shared Axios instance.
 *
 * Resource model:
 *  An "Item" represents a single lost or found object.
 *  The "type" field on the Item schema distinguishes between 'lost' and 'found'.
 *  Claims are embedded documents inside each Item.
 *
 * Future responsibilities:
 *  - getItems(params)              → GET    /api/items          (search, filter, sort, page)
 *  - getItemById(id)               → GET    /api/items/:id
 *  - createItem(itemData)          → POST   /api/items          (multipart/form-data for images)
 *  - updateItem(id, itemData)      → PUT    /api/items/:id
 *  - deleteItem(id)                → DELETE /api/items/:id
 *  - submitClaim(id, claimData)    → POST   /api/items/:id/claims
 *  - updateClaimStatus(id, claimId, status) → PATCH /api/items/:id/claims/:claimId
 */

import api from './api';

// TODO: Implement actual API calls

export const getItems = async (params = {}) => {
  // TODO: const response = await api.get('/items', { params });
  // TODO: return response.data;
};

export const getItemById = async (id) => {
  // TODO: const response = await api.get(`/items/${id}`);
  // TODO: return response.data;
};

export const createItem = async (itemData) => {
  // TODO: const response = await api.post('/items', itemData);
  // TODO: return response.data;
};

export const updateItem = async (id, itemData) => {
  // TODO: const response = await api.put(`/items/${id}`, itemData);
  // TODO: return response.data;
};

export const deleteItem = async (id) => {
  // TODO: const response = await api.delete(`/items/${id}`);
  // TODO: return response.data;
};

export const submitClaim = async (id, claimData) => {
  // TODO: const response = await api.post(`/items/${id}/claims`, claimData);
  // TODO: return response.data;
};

export const updateClaimStatus = async (id, claimId, status) => {
  // TODO: const response = await api.patch(`/items/${id}/claims/${claimId}`, { status });
  // TODO: return response.data;
};
