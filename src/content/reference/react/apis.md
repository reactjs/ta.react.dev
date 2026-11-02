---
title: "உள்ளமைந்த React API-கள்"
---

<Intro>

[Hooks](/reference/react/hooks) மற்றும் [Components](/reference/react/components)-க்கு கூடுதலாக, components-ஐ வரையறுக்க பயனுள்ள இன்னும் சில API-களை `react` package export செய்கிறது. மீதமுள்ள அனைத்து நவீன React API-களையும் இந்தப் பக்கம் பட்டியலிடுகிறது.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) context-ஐ வரையறுத்து child components-க்கு வழங்க உதவுகிறது. [`useContext`.](/reference/react/useContext)-உடன் பயன்படுத்தப்படுகிறது
* [`lazy`](/reference/react/lazy) ஒரு component-இன் code முதல் முறையாக render ஆகும் வரை அதை load செய்வதை தள்ளிப்போட உதவுகிறது.
* [`memo`](/reference/react/memo) அதே props வந்தால் உங்கள் component மீண்டும் render ஆகாமல் தவிர்க்க உதவுகிறது. [`useMemo`](/reference/react/useMemo) மற்றும் [`useCallback`.](/reference/react/useCallback)-உடன் பயன்படுத்தப்படுகிறது
* [`startTransition`](/reference/react/startTransition) ஒரு state update அவசரமற்றது என்று குறிக்க உதவுகிறது. [`useTransition`.](/reference/react/useTransition)-க்கு ஒத்தது
* [`act`](/reference/react/act) tests-இல் renders மற்றும் interactions-ஐ சுற்றி அமைத்து, assertions செய்வதற்கு முன் updates செயலாக்கப்பட்டிருப்பதை உறுதிசெய்ய உதவுகிறது.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`addTransitionType`](/reference/react/addTransitionType) lets you specify the cause of a Transition. Used with [`startTransition`](/reference/react/startTransition) and [`<ViewTransition>`.](/reference/react/ViewTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.
>>>>>>> 0821e7d9428a6c58c922765b891bbffba9ed6249

---

## Resource API-கள் {/*resource-apis*/}

*Resources* ஒரு component-இன் state-இல் இல்லாவிட்டாலும் அந்த component அவற்றை அணுக முடியும். உதாரணமாக, ஒரு component Promise-இலிருந்து message ஒன்றைப் படிக்கலாம் அல்லது context-இலிருந்து styling தகவலைப் படிக்கலாம்.

<<<<<<< HEAD
ஒரு resource-இலிருந்து value-ஐப் படிக்க, இந்த API-யைப் பயன்படுத்துங்கள்:

* [`use`](/reference/react/use) [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது [context](/learn/passing-data-deeply-with-context) போன்ற resource-இன் value-ஐப் படிக்க உதவுகிறது.
=======
You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.

>>>>>>> 0821e7d9428a6c58c922765b891bbffba9ed6249
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
