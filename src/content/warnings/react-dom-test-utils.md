---
title: react-dom/test-utils ஓய்வு பெறுதல் குறித்த எச்சரிக்கைகள்
---

## ReactDOMTestUtils.act() எச்சரிக்கை {/*reactdomtestutilsact-warning*/}

`react`-இலுள்ள `act`-ஐப் பயன்படுத்துவதற்கு ஆதரவாக, `react-dom/test-utils`-இலுள்ள `act` ஓய்வு பெறப்பட்டுள்ளது (deprecated).

முன்பு:

```js
import {act} from 'react-dom/test-utils';
```

இப்போது:

```js
import {act} from 'react';
```

## மீதமுள்ள ReactDOMTestUtils APIs {/*rest-of-reactdomtestutils-apis*/}

`act` தவிர மற்ற அனைத்து APIs-உம் நீக்கப்பட்டுள்ளன.

நவீனமான, சிறப்பாக ஆதரிக்கப்படும் testing அனுபவத்திற்காக, உங்கள் tests-ஐ [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)-க்கு மாற்றுமாறு React குழு பரிந்துரைக்கிறது.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument`-க்குப் பதிலாக `@testing-library/react`-இலுள்ள `render`-ஐப் பயன்படுத்தலாம்.

முன்பு:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

இப்போது:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate`-க்குப் பதிலாக `@testing-library/react`-இலுள்ள `fireEvent`-ஐப் பயன்படுத்தலாம்.

முன்பு:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

இப்போது:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

`fireEvent`, event handler-ஐ செயற்கையாக அழைப்பது மட்டுமல்லாமல், அந்தக் கூறில் உண்மையான event ஒன்றை dispatch செய்கிறது என்பதை நினைவில் கொள்ளவும்.

### நீக்கப்பட்ட அனைத்து APIs-இன் பட்டியல் {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
