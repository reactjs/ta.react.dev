---
title: React Developer Tools
---

<Intro>

React [components](/learn/your-first-component)-ஐ ஆய்வு செய்ய, [props](/learn/passing-props-to-a-component) மற்றும் [state](/learn/state-a-components-memory)-ஐ திருத்த, மேலும் செயல்திறன் பிரச்சினைகளை கண்டறிய React Developer Tools-ஐப் பயன்படுத்துங்கள்.

</Intro>

<YouWillLearn>

* React Developer Tools-ஐ எவ்வாறு நிறுவுவது

</YouWillLearn>

## Browser extension {/*browser-extension*/}

React-உடன் உருவாக்கப்பட்ட websites-ஐ debug செய்வதற்கான நேரடியான வழி React Developer Tools browser extension-ஐ நிறுவுவதுதான். இது பல பிரபலமான உலாவிகளுக்கு கிடைக்கிறது:

* [**Chrome**-க்கு நிறுவவும்](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox**-க்கு நிறுவவும்](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge**-க்கு நிறுவவும்](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

இப்போது, **React-உடன் உருவாக்கப்பட்ட** website ஒன்றுக்குச் சென்றால், _Components_ மற்றும் _Profiler_ panels-ஐப் பார்ப்பீர்கள்.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari and other browsers {/*safari-and-other-browsers*/}
மற்ற உலாவிகளுக்கு (உதாரணமாக Safari), [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package-ஐ நிறுவுங்கள்:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

அடுத்து terminal-இலிருந்து developer tools-ஐத் திறக்கவும்:
```bash
react-devtools
```

பிறகு, உங்கள் website-இன் `<head>` தொடக்கத்தில் பின்வரும் `<script>` tag-ஐச் சேர்த்து உங்கள் website-ஐ இணைக்கவும்:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

இப்போது developer tools-இல் பார்க்க, browser-இல் உங்கள் website-ஐ reload செய்யுங்கள்.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}

[React Native](https://reactnative.dev/)-உடன் உருவாக்கப்பட்ட apps-ஐ ஆய்வு செய்ய, React Developer Tools-உடன் ஆழமாக ஒருங்கிணைந்த built-in debugger ஆன [React Native DevTools](https://reactnative.dev/docs/react-native-devtools)-ஐப் பயன்படுத்தலாம். Native element highlighting மற்றும் selection உட்பட அனைத்து அம்சங்களும் browser extension போலவே செயல்படும்.

[React Native-இல் debugging பற்றி மேலும் அறிக.](https://reactnative.dev/docs/debugging)

> React Native 0.76-க்கு முந்தைய பதிப்புகளுக்கு, மேலுள்ள [Safari மற்றும் பிற உலாவிகள்](#safari-and-other-browsers) வழிகாட்டியைப் பின்பற்றி React DevTools-இன் standalone build-ஐப் பயன்படுத்தவும்.
