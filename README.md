# Simple YAML/YML Checker & Converter

Simple YAML/YML Checker & Converter is a lightweight browser tool for validating YAML syntax and converting YAML/YML data to JSON, XML, or cleanly formatted YAML.

All processing happens locally in your browser. The content you enter or open is never uploaded to a server.

The YAML parser is included in the repository, so the downloaded project also works without an internet connection.

## Use it online

Open the live application:

**[m3hr4nn.github.io/lamineyamal/hamine-yamal-checker.html](https://m3hr4nn.github.io/lamineyamal/hamine-yamal-checker.html)**

## How to use

1. Paste YAML into the **YAML/YML input** editor, or select **Open file** to load a `.yaml` or `.yml` file.
2. Choose **JSON**, **XML**, or **YAML** under **Convert to**.
3. Select **Convert** or press `Ctrl+Enter` (`Cmd+Enter` on macOS).
4. Review the converted result in the **Output** editor.
5. Enter the preferred download name. The correct `.json`, `.xml`, or `.yaml` extension is added automatically.
6. Select **Copy** to copy the result or **Download** to save it.

If the YAML syntax is invalid, the checker reports the problem line and column, selects the affected input line, and displays **Incorrect input syntax** instead of producing an invalid conversion.

## Features

- YAML/YML syntax validation with line and column feedback
- Conversion to formatted JSON, XML, or YAML
- Automatic output filename extension
- Drag-and-drop YAML file loading
- Copy and download controls
- Light and dark themes
- Responsive, single-page interface
- Local browser processing for privacy

## Run locally

1. On GitHub, select **Code → Download ZIP**.
2. Extract the complete ZIP archive.
3. Open `hamine-yamal-checker.html` in a modern web browser.

Keep `hamine-yamal-checker.html`, `app.js`, `styles.css`, and the `vendor` folder together. No installation, local server, or internet connection is required.

## Included dependency

This project includes the minified browser build of [js-yaml 4.1.0](https://github.com/nodeca/js-yaml) in `vendor/js-yaml.min.js`. js-yaml is distributed under the MIT License, and its license notice is retained in the bundled file.

## License

See [LICENSE](LICENSE).
