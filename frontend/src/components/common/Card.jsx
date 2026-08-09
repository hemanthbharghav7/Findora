/**
 * Card.jsx
 * --------
 * Generic bordered container used as the base for ItemCard, ProfileCard, etc.
 */

function Card({ children, className = '' }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

export default Card;
