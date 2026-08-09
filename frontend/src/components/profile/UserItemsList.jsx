/**
 * UserItemsList.jsx
 * -------------------
 * Grid of items reported by a given user. Used by pages/Profile.jsx
 * (GET /api/users/:id/items).
 *
 * Props:
 *  - items: Array<Item>
 */

import ItemCard from '../items/ItemCard';

function UserItemsList({ items = [] }) {
  if (!items.length) return <p>No items reported yet.</p>;

  return (
    <div className="user-items-list">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}

export default UserItemsList;
