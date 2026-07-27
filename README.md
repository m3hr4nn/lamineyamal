# Simple YAML/YML Checker & Converter

Simple YAML/YML Checker & Converter is a lightweight browser tool for validating YAML syntax and converting YAML/YML data to JSON, XML, or cleanly formatted YAML.

All processing happens locally in your browser. The content you enter or open is never uploaded to a server.

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

Download or clone the repository, then open `hamine-yamal-checker.html` in a modern web browser. An internet connection is required to load the `js-yaml` parser from jsDelivr.

## License

See [LICENSE](LICENSE).
