# Jisho <> Anki

Create Anki notes when you look up words with Jisho

# Set up

1. Install [Anki Connect](https://github.com/FooSoft/anki-connect)
2. Install this Chrome Extension
3. Look up some words on Jisho!

# Developer set up

1. [Install NPM](https://nodejs.org/en/)
2. (Optional) You'll probably want to use [WebStorm](https://www.jetbrains.com/webstorm/download/#section=windows).

## Common Tasks

* `npm run build` - packs into `build/` folder ready to load as an unpacked extension

## Developing in Chrome
1. Run `npm run build`
2. Open the Extension Management page by navigating to `chrome://extensions`
3. Enable Developer Mode by clicking the toggle switch next to **Developer mode**
4. Click the **LOAD UNPACKED** button and select the extension `build` directory

## Reference

* [React Apps README](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md)