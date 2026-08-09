/**
 * ItemCard.jsx
 * ------------
 * Summary card for a single lost/found item, used in BrowseItems grid
 * and Dashboard's "my items" list.
 *
 * Props:
 *  - item: { _id, title, type, status, images, createdAt }
 */

import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

function ItemCard({ item }) {
  if (!item) return null;

  return (
    <Card className="item-card">
      <Link to={`/items/${item._id}`}>
        {/* TODO: render item.images?.[0] once image upload is wired up */}
        <h3>{item.title}</h3>
      </Link>
      <Badge tone={item.type === 'found' ? 'success' : 'warning'}>{item.type}</Badge>
      <p>{formatDate(item.createdAt)}</p>
    </Card>
  );
}

export default ItemCard;
