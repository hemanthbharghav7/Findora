/**
 * NotFound.jsx
 * ------------
 * 404 fallback page for Findora.
 * Rendered by react-router when no other route matches.
 *
 * Future responsibilities:
 *  - Show a detective-themed "Case Not Found" illustration
 *  - Provide a "Go Back Home" button linked to "/"
 */

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main>
      <h1>404 – Case Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to Home</Link>
    </main>
  );
}

export default NotFound;
