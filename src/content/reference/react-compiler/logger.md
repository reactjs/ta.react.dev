---
title: logger
---

<Intro>

Compilation நடக்கும் போது React Compiler events-க்கு custom logging வழங்க `logger` option உதவுகிறது.

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `logger` {/*logger*/}

Compiler behavior-ஐ track செய்யவும் பிரச்சினைகளை debug செய்யவும் custom logging-ஐ configure செய்கிறது.

#### Type {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### Default value {/*default-value*/}

`null`

#### Methods {/*methods*/}

- **`logEvent`**: ஒவ்வொரு compiler event-க்கும் filename மற்றும் event details-உடன் அழைக்கப்படும்

#### Event types {/*event-types*/}

- **`CompileSuccess`**: Function வெற்றிகரமாக compiled ஆனது
- **`CompileError`**: Errors காரணமாக function skip செய்யப்பட்டது
- **`CompileDiagnostic`**: Fatal அல்லாத diagnostic information
- **`CompileSkip`**: பிற காரணங்களால் function skip செய்யப்பட்டது
- **`PipelineError`**: எதிர்பாராத compilation error
- **`Timing`**: Performance timing information

#### Caveats {/*caveats*/}

- Event structure versions இடையே மாறலாம்
- பெரிய codebases பல log entries உருவாக்கும்

---

## Usage {/*usage*/}

### அடிப்படை logging {/*basic-logging*/}

Compilation success மற்றும் failures-ஐ track செய்ய:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### விரிவான error logging {/*detailed-error-logging*/}

Compilation failures பற்றிய குறிப்பிட்ட தகவல்களைப் பெற:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```
