---
title: react-test-renderer ஓய்வு பெறுதல் குறித்த எச்சரிக்கைகள்
---

## ReactTestRenderer.create() எச்சரிக்கை {/*reacttestrenderercreate-warning*/}

`react-test-renderer` ஓய்வு பெறப்பட்டுள்ளது (deprecated). `ReactTestRenderer.create()` அல்லது `ReactShallowRender.render()` அழைக்கப்படும் ஒவ்வொரு முறையும் ஓர் எச்சரிக்கை காட்டப்படும். `react-test-renderer` package NPM-இல் தொடர்ந்து கிடைக்கும்; ஆனால் அது பராமரிக்கப்படாது, புதிய React அம்சங்களுடனோ React-இன் உட்புற மாற்றங்களுடனோ செயலிழக்கலாம்.

நவீனமான, சிறப்பாக ஆதரிக்கப்படும் testing அனுபவத்திற்காக, உங்கள் tests-ஐ [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) அல்லது [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro)-க்கு மாற்றுமாறு React குழு பரிந்துரைக்கிறது.


## new ShallowRenderer() எச்சரிக்கை {/*new-shallowrenderer-warning*/}

`react-test-renderer` package இனி `react-test-renderer/shallow`-இல் shallow renderer-ஐ export செய்வதில்லை. இது முன்னர் தனியாகப் பிரிக்கப்பட்ட `react-shallow-renderer` பேக்கேஜை மறுபொதியாக்கிய வடிவமே. எனவே அதை நேரடியாக நிறுவி, shallow renderer-ஐ அதே முறையில் தொடர்ந்து பயன்படுத்தலாம். [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer) பார்க்கவும்.
