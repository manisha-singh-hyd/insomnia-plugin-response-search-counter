# Insomnia Response Search Counter Plugin

A plugin for Insomnia that shows the count of search term matches in the response viewer.

## Features

- Shows number of matches for search terms in response content
- Works with all response types (JSON, XML, Text, etc.)
- Real-time count updates as you type
- Supports multiple tabs - updates when switching between tabs
- Case-insensitive search

## Installation

### From Insomnia Plugin Hub

1. Open Insomnia
2. Go to Application > Preferences > Plugins
3. Type "insomnia-plugin-response-search-counter"
4. Click "Install Plugin"

### Using npm

```bash
npm install -g insomnia-plugin-response-search-counter
```

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/manisha-singh-hyd/insomnia-plugin-response-search-counter.git
cd insomnia-plugin-response-search-counter
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Link the plugin to Insomnia:
   - Insomnia only loads plugins from its plugins directory
   - Instead of copying files manually, we create a symbolic link
   - This lets you develop in your preferred location while Insomnia sees the plugin in its directory
   - Any changes you make will be immediately available to Insomnia after rebuilding

```bash
# macOS: Create symbolic link in Insomnia's plugins directory
ln -s "$(pwd)" ~/Library/Application\ Support/Insomnia/plugins/insomnia-plugin-response-search-counter

# Windows: Create symbolic link in Insomnia's plugins directory
mklink /D "%APPDATA%\Insomnia\plugins\insomnia-plugin-response-search-counter" "%CD%"
```

## Usage

1. Send a request in Insomnia
2. In the response viewer, use either:
   - The search box in the response viewer
   - Keyboard shortcut (Cmd+F on macOS, Ctrl+F on Windows/Linux)
3. The count of matches will appear next to the search box
4. When switching between tabs, the counter automatically updates for the current response

### Search Results Display

When searching in the response viewer, the match count is displayed in a clear format:

![Search Results Counter](https://raw.githubusercontent.com/manisha-singh-hyd/insomnia-plugin-response-search-counter/main/docs/search-counter.png)

As shown in the screenshot above, the plugin displays the total number of matches (110 matches) for the search term "displayName". The count updates in real-time as you type, making it easy to see how many occurrences of your search term exist in the response.

## How It Works

- Maintains a single cached response that updates when:
  - New API responses are received
  - Switching between tabs
- Uses MutationObserver to detect tab changes
- Cleans up properly when:
  - Closing search
  - Switching tabs
  - Unloading plugin

## Development

1. Make changes to the source code
2. Run `npm run build` to rebuild the plugin
3. Restart Insomnia to load the changes

## Testing

To test the plugin:

1. Follow the Local Development installation steps
2. Restart Insomnia to load the plugin
3. Test the following scenarios:
   - Search in a single response
   - Switch between tabs with different responses
   - Close and reopen search
   - Make new requests and verify counter updates
4. After making code changes:
   - Run `npm run build`
   - Restart Insomnia
   - Test your changes

## Publishing

To publish a new version to npm:

1. Update version in package.json
2. Build the plugin:
```bash
npm run build
```

3. Publish to npm:
```bash
npm publish
```

The plugin will be available in the Insomnia Plugin Hub after publication.

## Support ❤️

[paypal.me/manishasinghhyd](https://paypal.me/manishasinghhyd)

## License

MIT
