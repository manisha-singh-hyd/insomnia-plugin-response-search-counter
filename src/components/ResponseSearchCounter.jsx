const React = require('react');

const ResponseSearchCounter = ({ searchTerm, responseBody }) => {
  const [matchCount, setMatchCount] = React.useState(0);
  
  React.useEffect(() => {
    if (!searchTerm || !responseBody) {
      setMatchCount(0);
      return;
    }

    try {
      // Escape special regex characters in search term
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedTerm, 'gi');
      const matches = responseBody.match(regex);
      const count = matches ? matches.length : 0;
      
      console.log('Search results:', {
        term: searchTerm,
        count,
        responseLength: responseBody.length,
        sampleMatch: matches?.[0]
      });
      
      setMatchCount(count);
    } catch (err) {
      console.error('Error counting matches:', err);
      setMatchCount(0);
    }
  }, [searchTerm, responseBody]);

  if (!searchTerm) {
    return null;
  }

  return (
    <div style={{ 
      padding: '2px 8px',
      fontSize: '12px',
      fontFamily: 'var(--font-monospace)',
      color: matchCount > 0 ? 'var(--color-success)' : 'var(--color-font)',
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: 'var(--color-bg)',
      border: `1px solid ${matchCount > 0 ? 'var(--color-success)' : 'var(--color-border)'}`,
      borderRadius: '3px',
      marginLeft: '5px',
      opacity: matchCount > 0 ? 1 : 0.7,
      transition: 'all 0.2s ease'
    }}>
      <span style={{ fontWeight: matchCount > 0 ? 'bold' : 'normal' }}>
        {matchCount} {matchCount === 1 ? 'match' : 'matches'}
      </span>
    </div>
  );
};

module.exports = ResponseSearchCounter;
