const ResponseSearchCounter = require('./components/ResponseSearchCounter');

// Store the latest response body
let cachedResponse = '';

// Function to update response from editor content
const updateResponseFromEditor = () => {
  const editor = document.querySelector('.response-pane .CodeMirror');
  if (!editor || !editor.CodeMirror) return;

  const content = editor.CodeMirror.getValue();
  if (!content) return;

  cachedResponse = content;
};

module.exports.responseHooks = [
  context => {
    // Update response body from API response
    const updateResponseBody = async () => {
      try {
        const body = await context.response.getBody();
        if (!body) return;
        cachedResponse = body.toString('utf-8');
      } catch (err) {
        console.error('Error getting response body:', err);
        cachedResponse = '';
      }
    };

    // Update the response body when a new response is received
    updateResponseBody();

    // Create a document-level event listener for search field appearance
    const handleSearchFieldAppearance = (event) => {
      if (!event.target) return;
      
      // Check if this is a search input
      if (event.target.matches('.search input, .CodeMirror-search-field') || 
          event.target.closest('.search input, .CodeMirror-search-field')) {
        
        const searchElement = event.target.matches('.search input, .CodeMirror-search-field') 
          ? event.target 
          : event.target.closest('.search input, .CodeMirror-search-field');

        // Remove any existing counter
        const existingCounter = document.querySelector('#search-counter-container');
        if (existingCounter) {
          existingCounter.remove();
        }

        // Create new counter container
        const counterContainer = document.createElement('div');
        counterContainer.id = 'search-counter-container';
        counterContainer.style.marginLeft = '10px';
        counterContainer.style.marginTop = '10px';
        counterContainer.style.display = 'inline-block';
        searchElement.parentElement.appendChild(counterContainer);
        
        // Create search handler
        const handleSearch = () => {
          const searchTerm = searchElement.value;
          
          // Render our counter component
          const React = require('react');
          const ReactDOM = require('react-dom');
          
          ReactDOM.render(
            React.createElement(ResponseSearchCounter, {
              searchTerm,
              responseBody: cachedResponse
            }),
            counterContainer
          );
        };

        // Add input listener
        searchElement.addEventListener('input', handleSearch);
        
        // Also listen for changes via mutation observer
        // This catches pre-filled search terms (e.g., from Cmd+F with selected text)
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
              handleSearch();
            }
          }
        });

        observer.observe(searchElement, {
          attributes: true,
          attributeFilter: ['value']
        });
        
        // Initial count (important for pre-filled search terms)
        setTimeout(handleSearch, 0);

        // Cleanup when search is closed
        const cleanup = () => {
          if (!document.contains(searchElement)) {
            observer.disconnect();
            searchElement.removeEventListener('input', handleSearch);
            document.removeEventListener('keydown', handleEsc);
          }
        };

        // Handle Escape key
        const handleEsc = (e) => {
          if (e.key === 'Escape') {
            cleanup();
          }
        };

        document.addEventListener('keydown', handleEsc);
      }
    };

    // Listen for search field appearance
    document.addEventListener('focusin', handleSearchFieldAppearance);

    // Watch for tab changes
    const tabObserver = new MutationObserver(() => {
      // Short delay to let the UI update
      setTimeout(updateResponseFromEditor, 100);
    });

    // Start observing the response pane for changes
    const responsePane = document.querySelector('.response-pane');
    if (responsePane) {
      tabObserver.observe(responsePane, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Cleanup function
    return () => {
      document.removeEventListener('focusin', handleSearchFieldAppearance);
      tabObserver.disconnect();
      const container = document.querySelector('#search-counter-container');
      if (container) {
        container.remove();
      }
    };
  }
];

// Clean up when plugin is unloaded
module.exports.destroy = () => {
  const container = document.querySelector('#search-counter-container');
  if (container) {
    container.remove();
  }
  cachedResponse = '';
};
