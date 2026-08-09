/**
 * ProfileCard.jsx
 * ---------------
 * Read-only display of a user's public profile info.
 * Used by pages/Profile.jsx.
 *
 * Props:
 *  - user: { name, email, avatar, createdAt }
 */

import Card from '../common/Card';
import { formatDate } from '../../utils/formatDate';

function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <Card className="profile-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Member since {formatDate(user.createdAt)}</p>
    </Card>
  );
}

export default ProfileCard;
