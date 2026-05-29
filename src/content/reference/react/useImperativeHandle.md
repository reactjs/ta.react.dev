---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` என்பது [ref](/learn/manipulating-the-dom-with-refs) ஆக expose செய்யப்படும் handle-ஐ customize செய்ய உதவும் React Hook.

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

உங்கள் component expose செய்யும் ref handle-ஐ customize செய்ய, component-ன் top level-இல் `useImperativeHandle`-ஐ call செய்யுங்கள்:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `ref`: `MyInput` component-க்கு prop ஆக நீங்கள் பெற்ற `ref`.

* `createHandle`: Arguments எதையும் ஏற்காமல், expose செய்ய வேண்டிய ref handle-ஐ return செய்யும் function. அந்த ref handle எந்த type ஆகவும் இருக்கலாம். பொதுவாக, expose செய்ய வேண்டிய methods கொண்ட object-ஐ return செய்வீர்கள்.

* **optional** `dependencies`: `createHandle` code-க்குள் reference செய்யப்படும் அனைத்து reactive values-ன் பட்டியல். Reactive values-ல் props, state, மற்றும் உங்கள் component body-க்குள் நேரடியாக declare செய்யப்பட்ட அனைத்து variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்](/learn/editor-setup#linting), ஒவ்வொரு reactive value-உம் dependency ஆக சரியாக குறிப்பிடப்பட்டுள்ளதா என்பதை அது verify செய்யும். Dependencies பட்டியல் நிலையான எண்ணிக்கையிலான items கொண்டிருக்க வேண்டும், மேலும் `[dep1, dep2, dep3]` போல inline-ஆக எழுதப்பட வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் முந்தைய value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் ஒப்பிடும். Re-render காரணமாக dependency ஒன்று மாறியிருந்தால், அல்லது இந்த argument-ஐ நீங்கள் விடுத்திருந்தால், உங்கள் `createHandle` function மீண்டும் execute ஆகி, புதிதாக உருவாக்கப்பட்ட handle ref-க்கு assign செய்யப்படும்.

<Note>

React 19 முதல், [`ref` prop ஆக கிடைக்கிறது](/blog/2024/12/05/react-19#ref-as-a-prop). React 18 மற்றும் அதற்கு முன், [`forwardRef`](/reference/react/forwardRef)-இலிருந்து `ref` பெறுவது அவசியமாக இருந்தது.

</Note>

#### Returns {/*returns*/}

`useImperativeHandle` `undefined` return செய்கிறது.

---

## பயன்பாடு {/*usage*/}

### Parent component-க்கு custom ref handle expose செய்தல் {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Parent element-க்கு DOM node expose செய்ய, அந்த node-க்கு `ref` prop-ஐ pass செய்யுங்கள்.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

மேலுள்ள code-இல், [`MyInput`-க்கு கொடுக்கப்படும் ref `<input>` DOM node-ஐ பெறும்](/learn/manipulating-the-dom-with-refs). ஆனால் அதற்கு பதிலாக custom value expose செய்யலாம். Expose செய்யப்படும் handle-ஐ customize செய்ய, உங்கள் component-ன் top level-இல் `useImperativeHandle`-ஐ call செய்யுங்கள்:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

மேலுள்ள code-இல், `ref` இனி `<input>`-க்கு pass செய்யப்படவில்லை என்பதை கவனியுங்கள்.

உதாரணமாக, முழு `<input>` DOM node-ஐ expose செய்ய விரும்பவில்லை; ஆனால் அதன் இரண்டு methods: `focus` மற்றும் `scrollIntoView` மட்டும் expose செய்ய விரும்புகிறீர்கள் என்று வைத்துக் கொள்ளுங்கள். இதை செய்ய, உண்மையான browser DOM-ஐ தனி ref-இல் வைத்திருக்கவும். பின்னர் parent component call செய்ய வேண்டும் என்று நீங்கள் விரும்பும் methods மட்டும் கொண்ட handle-ஐ expose செய்ய `useImperativeHandle`-ஐப் பயன்படுத்துங்கள்:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

இப்போது parent component `MyInput`-க்கு ref பெற்றால், அதில் `focus` மற்றும் `scrollIntoView` methods-ஐ call செய்ய முடியும். ஆனால் underlying `<input>` DOM node-க்கு முழு access இருக்காது.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### உங்கள் சொந்த imperative methods-ஐ expose செய்தல் {/*exposing-your-own-imperative-methods*/}

Imperative handle மூலம் expose செய்யும் methods DOM methods-க்கு துல்லியமாக match ஆக வேண்டியதில்லை. உதாரணமாக, இந்த `Post` component imperative handle மூலம் `scrollAndFocusAddComment` method-ஐ expose செய்கிறது. Button-ஐ click செய்யும்போது, parent `Page` comments பட்டியலை scroll செய்யவும் input field-ஐ focus செய்யவும் இது அனுமதிக்கிறது:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Refs-ஐ அதிகமாகப் பயன்படுத்த வேண்டாம்.** Props ஆக வெளிப்படுத்த முடியாத *imperative* behaviors-க்காக மட்டுமே refs பயன்படுத்த வேண்டும்: உதாரணமாக, node-க்கு scroll செய்தல், node-ஐ focus செய்தல், animation trigger செய்தல், text select செய்தல், போன்றவை.

**ஏதாவது ஒன்றை prop ஆக வெளிப்படுத்த முடிந்தால், ref பயன்படுத்த வேண்டாம்.** உதாரணமாக, `Modal` component-இலிருந்து `{ open, close }` போன்ற imperative handle expose செய்வதற்கு பதிலாக, `<Modal isOpen={isOpen} />` போல `isOpen`-ஐ prop ஆக ஏற்குவது சிறந்தது. Props மூலம் imperative behaviors expose செய்ய [Effects](/learn/synchronizing-with-effects) உதவலாம்.

</Pitfall>
