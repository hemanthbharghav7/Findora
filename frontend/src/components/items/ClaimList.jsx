/**
 * ClaimList.jsx
 * -------------
 * Lists claims submitted on an item, with approve/reject actions for
 * the item owner. Used by pages/ItemDetails.jsx and Dashboard.jsx.
 *
 * Props:
 *  - claims: Array<{ _id, user, message, status }>
 *  - isOwner: bool — whether current user can approve/reject
 *  - onStatusChange: (claimId, status) => void
 */

import Badge from '../common/Badge';
import Button from '../common/Button';

function ClaimList({ claims = [], isOwner = false, onStatusChange }) {
  if (!claims.length) return <p>No claims yet.</p>;

  return (
    <ul className="claim-list">
      {claims.map((claim) => (
        <li key={claim._id}>
          <p>{claim.message}</p>
          <Badge tone={claim.status === 'approved' ? 'success' : 'neutral'}>
            {claim.status}
          </Badge>
          {isOwner && claim.status === 'pending' && (
            <>
              <Button variant="primary" onClick={() => onStatusChange?.(claim._id, 'approved')}>Approve</Button>
              <Button variant="danger" onClick={() => onStatusChange?.(claim._id, 'rejected')}>Reject</Button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ClaimList;
