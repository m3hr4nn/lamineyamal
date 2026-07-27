<div align="center">

# ⚽ Hamine YAML

### A simple YAML/YML checker & converter

**Lamine Yamal? No—*hamine YAML*.**

Validate YAML and convert it to JSON, XML, or clean YAML.<br>
No installation. No account. No mysterious upload.

[![Open the app](https://img.shields.io/badge/OPEN_THE_APP-147A3D?style=for-the-badge&logo=githubpages&logoColor=white)](https://m3hr4nn.github.io/lamineyamal/hamine-yamal-checker.html)

![Runs in the browser](https://img.shields.io/badge/runs_in-browser-202622?style=flat-square)
![Works offline](https://img.shields.io/badge/works-offline-202622?style=flat-square)
![No uploads](https://img.shields.io/badge/uploads-none-202622?style=flat-square)
![License: Unlicense](https://img.shields.io/badge/license-Unlicense-202622?style=flat-square)

</div>

---

## Why does this exist?

I needed a small tool to check YAML/YML and work with YAML files. I did not
want to install a full toolchain or paste configuration into a random website,
so I described the tool I wanted and AI helped me build it.

That is the whole origin story—no startup pitch, no plan to revolutionize
indentation.

The name is just a little wordplay:

> **Lamine Yamal → Hamine Yamal → Hamine YAML**

In Finglish, **hamine** roughly means “this is it.” So yes: *this is YAML*.
This project is not affiliated with Lamine Yamal; it just borrowed a good pun
and brought its own parser.

## Kick off

### Use it online

Open **[Hamine YAML](https://m3hr4nn.github.io/lamineyamal/hamine-yamal-checker.html)**,
paste your YAML, and select **Convert**.

### Use it offline

1. Select **Code → Download ZIP** on this repository.
2. Extract the complete archive.
3. Open `hamine-yamal-checker.html` in a modern browser.

Keep the HTML file, `app.js`, `styles.css`, and the `vendor` folder together.
There is no installation, build step, or local server.

## Match day features

| On the pitch | What it actually does |
| --- | --- |
| 🟨 The referee | Validates YAML/YML syntax |
| 📺 YAML VAR | Reports the problem line and column and selects the affected line |
| 🔁 The transfer window | Converts YAML to formatted JSON, XML, or YAML |
| 📂 Home fixture | Opens or accepts dropped `.yaml` and `.yml` files |
| 💾 Full-time export | Copies the result or downloads it with the correct extension |
| 🌗 Day/night match | Includes light and dark themes |
| 🏠 Home advantage | Processes everything locally in your browser |

It also supports multi-document YAML and the `Ctrl+Enter` shortcut
(`Cmd+Enter` on macOS).

## How to use it

1. Paste YAML into the **YAML/YML input** editor, open a file, or drop one
   onto the editor.
2. Choose **JSON**, **XML**, or **YAML** under **Convert to**.
3. Select **Convert**, or press `Ctrl+Enter` / `Cmd+Enter`.
4. Review the result in the **Output** editor.
5. Give the download a name if you want to save it.
6. Select **Copy** or **Download**.

If the input is invalid, the app shows **Incorrect input syntax**, reports the
line and column, and highlights the problem line instead of producing a bad
conversion.

## Privacy

Your YAML stays on your device. Files are read by the browser and processed
locally; their contents are not sent to a server.

The YAML parser is bundled with the repository, so the downloaded project
continues to work without an internet connection.

## What is inside?

```text
.
├── hamine-yamal-checker.html  # page structure
├── app.js                     # validation, conversion, files and themes
├── styles.css                 # responsive light/dark interface
└── vendor/
    └── js-yaml.min.js         # bundled YAML parser
```

## Dependency

This project includes the minified browser build of
[js-yaml 4.1.0](https://github.com/nodeca/js-yaml) in
`vendor/js-yaml.min.js`. js-yaml is distributed under the MIT License, and its
license notice is retained in the bundled file.

## License

The project is released under [The Unlicense](LICENSE). Use it, change it,
pass it around—or leave it on the bench.

---

<div align="center">

Built because sometimes you just need to know whether the YAML is YAMLing.

</div>
