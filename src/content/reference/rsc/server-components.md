---
title: Server Components
---

<Intro>

Server Components என்பது bundling-க்கு முன், உங்கள் client app அல்லது SSR server-இலிருந்து தனியான environment-இல் முன்கூட்டியே render ஆகும் புதிய வகை Component.

</Intro>

இந்த தனி environment தான் React Server Components-இல் உள்ள "server". Server Components உங்கள் CI server-இல் build time-இல் ஒருமுறை run ஆகலாம், அல்லது web server பயன்படுத்தி ஒவ்வொரு request-க்கும் run ஆகலாம்.

<InlineToc />

<Note>

#### Server Components-க்கு support எப்படி build செய்வது? {/*how-do-i-build-support-for-server-components*/}

React 19-இல் React Server Components stable; minor versions இடையே break ஆகாது. ஆனால் React Server Components bundler அல்லது framework implement செய்ய பயன்படுத்தப்படும் underlying APIs semver-ஐ பின்பற்றாது; React 19.x minors இடையே break ஆகலாம்.

Bundler அல்லது framework ஆக React Server Components support செய்ய, குறிப்பிட்ட React version-க்கு pin செய்வதையோ அல்லது Canary release பயன்படுத்துவதையோ பரிந்துரைக்கிறோம். எதிர்காலத்தில் React Server Components implement செய்யப்படும் APIs-ஐ stabilize செய்ய bundlers மற்றும் frameworks உடன் தொடர்ந்து வேலை செய்வோம்.

</Note>

### Server இல்லாமல் Server Components {/*server-components-without-a-server*/}
Filesystem-இலிருந்து read செய்யவோ static content fetch செய்யவோ Server Components build time-இல் run ஆகலாம்; எனவே web server தேவையில்லை. உதாரணமாக, content management system-இலிருந்து static data read செய்ய நீங்கள் விரும்பலாம்.

Server Components இல்லாமல், client-இல் Effect மூலம் static data fetch செய்வது பொதுவானது:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

இந்த pattern-ன் பொருள்: page-ன் lifetime முழுவதும் மாறாத static content render செய்யவே users கூடுதலாக 75K (gzipped) libraries download செய்து parse செய்ய வேண்டும்; மேலும் page load ஆன பிறகு data fetch செய்ய இரண்டாவது request-க்காக காத்திருக்க வேண்டும்.

Server Components உடன், இந்த components-ஐ build time-இல் ஒருமுறை render செய்யலாம்:

```js
import marked from 'marked'; // bundle-இல் சேர்க்கப்படாது
import sanitizeHtml from 'sanitize-html'; // bundle-இல் சேர்க்கப்படாது

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Rendered output பின்னர் HTML-ஆக server-side rendered (SSR) செய்யப்பட்டு CDN-க்கு upload செய்யப்படலாம். App load ஆகும்போது, client original `Page` component-ஐயோ markdown render செய்யும் expensive libraries-ஐயோ பார்க்காது. Client rendered output மட்டும் பார்க்கும்:

```js
<div><!-- html for markdown --></div>
```

இதன் பொருள்: முதல் page load நேரத்திலேயே content visible ஆகும்; static content render செய்ய தேவையான expensive libraries bundle-இல் சேர்க்கப்படாது.

<Note>

மேலுள்ள Server Component async function என்பதை நீங்கள் கவனிக்கலாம்:

```js
async function Page({page}) {
  //...
}
```

Async Components என்பது render-இல் `await` செய்ய அனுமதிக்கும் Server Components-ன் புதிய feature.

கீழே [Server Components உடன் Async components](#async-components-with-server-components)-ஐப் பார்க்கவும்.

</Note>

### Server உடன் Server Components {/*server-components-with-a-server*/}
ஒரு page-க்கான request நேரத்தில் Server Components web server-இலும்கூட run ஆகலாம்; API build செய்யாமல் உங்கள் data layer-ஐ access செய்ய இது அனுமதிக்கிறது. உங்கள் application bundle செய்யப்படுவதற்கு முன் அவை render செய்யப்படுகின்றன; மேலும் data மற்றும் JSX-ஐ props ஆக Client Components-க்கு pass செய்யலாம்.

Server Components இல்லாமல், client-இல் Effect மூலம் dynamic data fetch செய்வது பொதுவானது:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Server Components உடன், component-இல் data read செய்து render செய்யலாம்:

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Bundler பின்னர் data, rendered Server Components, மற்றும் dynamic Client Components-ஐ bundle-ஆக combine செய்கிறது. விருப்பமாக, அந்த bundle page-க்கான initial HTML உருவாக்க server-side rendered (SSR) செய்யப்படலாம். Page load ஆகும்போது, browser original `Note` மற்றும் `Author` components-ஐ பார்க்காது; rendered output மட்டும் client-க்கு அனுப்பப்படும்:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Server-இலிருந்து அவற்றை re-fetch செய்வதன் மூலம் Server Components dynamic ஆக மாற்றப்படலாம்; அங்கே அவை data access செய்து மீண்டும் render செய்ய முடியும். இந்த புதிய application architecture, server-centric Multi-Page Apps-ன் நேரடியான “request/response” mental model-ஐ client-centric Single-Page Apps-ன் seamless interactivity உடன் இணைக்கிறது; இரண்டின் சிறந்த அம்சங்களையும் தருகிறது.

### Server Components-க்கு interactivity சேர்த்தல் {/*adding-interactivity-to-server-components*/}

Server Components browser-க்கு அனுப்பப்படாது; எனவே `useState` போன்ற interactive APIs-ஐ அவை பயன்படுத்த முடியாது. Server Components-க்கு interactivity சேர்க்க, `"use client"` directive பயன்படுத்தி அவற்றை Client Component உடன் compose செய்யலாம்.

<Note>

#### Server Components-க்கு directive இல்லை. {/*there-is-no-directive-for-server-components*/}

பொதுவான தவறான புரிதல்: Server Components `"use server"` மூலம் குறிக்கப்படுகின்றன என்று நினைப்பது. ஆனால் Server Components-க்கு directive இல்லை. `"use server"` directive Server Functions-க்காக பயன்படுத்தப்படுகிறது.

மேலும் தகவலுக்கு [Directives](/reference/rsc/directives) docs-ஐப் பார்க்கவும்.

</Note>


பின்வரும் உதாரணத்தில், `Notes` Server Component தனது `expanded` state-ஐ toggle செய்ய state பயன்படுத்தும் `Expandable` Client Component-ஐ import செய்கிறது:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

இது முதலில் `Notes`-ஐ Server Component ஆக render செய்து, பின்னர் Client Component `Expandable`-க்கான bundle உருவாக்க bundler-க்கு அறிவுறுத்துவதன் மூலம் வேலை செய்கிறது. Browser-இல், Client Components props ஆக pass செய்யப்பட்ட Server Components-ன் output-ஐப் பார்க்கும்:

```js
<head>
  <!-- Client Components-க்கான bundle -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Server Components உடன் Async components {/*async-components-with-server-components*/}

Async/await பயன்படுத்தி Components எழுத புதிய வழியை Server Components அறிமுகப்படுத்துகின்றன. Async component-இல் `await` செய்தால், React suspend செய்து, promise resolve ஆகும் வரை காத்திருந்து பிறகு rendering-ஐ resume செய்யும். இது Suspense-க்கான streaming support உடன் server/client boundaries முழுவதும் வேலை செய்கிறது.

Server-இல் promise உருவாக்கி, client-இல் அதை await கூட செய்யலாம்:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

Page render ஆக `note` content முக்கியமான data என்பதால், அதை server-இல் `await` செய்கிறோம். Comments fold-க்கு கீழே உள்ள lower-priority content; எனவே promise-ஐ server-இல் தொடங்கி, client-இல் `use` API மூலம் அதற்காக காத்திருக்கிறோம். இது `note` content render ஆகுவதை block செய்யாமல் client-இல் Suspend ஆகும்.

Client-இல் async components support செய்யப்படாததால், promise-ஐ `use` மூலம் await செய்கிறோம்.
