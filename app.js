(() => {
  "use strict";

  const root = document.documentElement;
  const input = document.querySelector("#yaml-input");
  const output = document.querySelector("#output");
  const formatInputs = [...document.querySelectorAll('input[name="output-format"]')];
  const status = document.querySelector("#status");
  const fileInput = document.querySelector("#file-input");
  const dropZone = document.querySelector("#drop-zone");
  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = themeButton.querySelector(".theme-icon");
  const themeLabel = themeButton.querySelector(".theme-label");
  const inputStats = document.querySelector("#input-stats");
  const filenameInput = document.querySelector("#filename");
  const fileExtension = document.querySelector("#file-extension");

  const selectedFormat = () => formatInputs.find((item) => item.checked).value;

  const setStatus = (message = "", type = "") => {
    status.textContent = message;
    status.className = type;
  };

  const resizeEditors = () => {
    input.style.height = "auto";
    output.style.height = "auto";
    const height = Math.max(320, input.scrollHeight, output.scrollHeight);
    input.style.height = `${height}px`;
    output.style.height = `${height}px`;
  };

  const updateStats = () => {
    const lines = input.value ? input.value.split(/\r?\n/).length : 0;
    inputStats.textContent = `${lines} ${lines === 1 ? "line" : "lines"}`;
    requestAnimationFrame(resizeEditors);
  };

  const updateExtension = () => {
    fileExtension.textContent = `.${selectedFormat()}`;
  };

  const escapeXml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

  const xmlName = (name) => {
    let safeName = String(name).trim().replace(/[^A-Za-z0-9_.-]/g, "_");
    if (!safeName || !/^[A-Za-z_]/.test(safeName)) safeName = `_${safeName}`;
    return safeName;
  };

  const toXml = (value, name = "root", depth = 0) => {
    const tag = xmlName(name);
    const indent = "  ".repeat(depth);
    if (value === null || value === undefined) return `${indent}<${tag}/>`;
    if (Array.isArray(value)) {
      if (!value.length) return `${indent}<${tag}/>`;
      const items = value.map((item) => toXml(item, "item", depth + 1)).join("\n");
      return `${indent}<${tag}>\n${items}\n${indent}</${tag}>`;
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (!entries.length) return `${indent}<${tag}/>`;
      const children = entries.map(([key, child]) => toXml(child, key, depth + 1)).join("\n");
      return `${indent}<${tag}>\n${children}\n${indent}</${tag}>`;
    }
    return `${indent}<${tag}>${escapeXml(value)}</${tag}>`;
  };

  const selectProblemLine = (lineNumber) => {
    const lines = input.value.split(/\r?\n/);
    const safeLine = Math.max(0, Math.min(lineNumber, lines.length - 1));
    const start = lines.slice(0, safeLine).reduce((total, line) => total + line.length + 1, 0);
    input.focus();
    input.setSelectionRange(start, start + lines[safeLine].length);
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const showSyntaxError = (error) => {
    const line = error.mark?.line;
    const column = error.mark?.column;
    const location = Number.isInteger(line)
      ? `Line ${line + 1}, column ${(column ?? 0) + 1}: `
      : "";
    output.value = "Incorrect input syntax.";
    output.classList.add("output-error");
    input.classList.add("has-error");
    setStatus(`${location}${error.reason || error.message}`, "error");
    resizeEditors();
    if (Number.isInteger(line)) selectProblemLine(line);
  };

  const convert = () => {
    input.classList.remove("has-error");
    output.classList.remove("output-error");
    try {
      if (!window.jsyaml) throw new Error("The bundled YAML parser could not load. Make sure the vendor folder is included.");
      if (!input.value.trim()) throw new Error("Enter YAML or open a .yaml/.yml file first.");

      const documents = [];
      window.jsyaml.loadAll(input.value, (document) => documents.push(document));
      const data = documents.length === 1 ? documents[0] : documents;
      const format = selectedFormat();

      if (format === "json") output.value = JSON.stringify(data, null, 2);
      if (format === "xml") output.value = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data)}`;
      if (format === "yaml") output.value = window.jsyaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true });

      setStatus(`Valid YAML · Converted to ${format.toUpperCase()}`, "success");
      resizeEditors();
    } catch (error) {
      if (error.name === "YAMLException" || error.mark) showSyntaxError(error);
      else {
        output.value = error.message;
        output.classList.add("output-error");
        setStatus(error.message, "error");
        resizeEditors();
      }
    }
  };

  const loadFile = async (file) => {
    if (!file) return;
    if (!/\.ya?ml$/i.test(file.name)) {
      setStatus("Please choose a .yaml or .yml file.", "error");
      return;
    }
    input.value = await file.text();
    filenameInput.value = file.name.replace(/\.ya?ml$/i, "") || "simple-yaml-checker";
    updateStats();
    convert();
  };

  const safeFilename = () => {
    const cleaned = filenameInput.value.trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
      .replace(/[. ]+$/g, "");
    return cleaned || "simple-yaml-checker";
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    themeIcon.textContent = dark ? "☀" : "☾";
    themeLabel.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    document.querySelector('meta[name="theme-color"]').content = dark ? "#161a17" : "#f5faf6";
    localStorage.setItem("simple-yaml-checker-theme", theme);
  };

  const savedTheme = localStorage.getItem("simple-yaml-checker-theme");
  const preferredTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(savedTheme || preferredTheme);

  themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  document.querySelector("#convert-button").addEventListener("click", convert);

  formatInputs.forEach((item) => item.addEventListener("change", () => {
    updateExtension();
    convert();
  }));

  input.addEventListener("input", () => {
    input.classList.remove("has-error");
    output.classList.remove("output-error");
    updateStats();
    setStatus("Ready to check and convert");
  });

  document.querySelector("#open-button").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));

  document.querySelector("#clear-button").addEventListener("click", () => {
    input.value = "";
    output.value = "";
    input.classList.remove("has-error");
    output.classList.remove("output-error");
    updateStats();
    setStatus("Editor cleared");
    input.focus();
  });

  document.querySelector("#copy-button").addEventListener("click", async () => {
    if (!output.value || output.classList.contains("output-error")) {
      setStatus("There is no valid output to copy.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(output.value);
    } catch {
      output.select();
      document.execCommand("copy");
    }
    setStatus("Output copied to clipboard.", "success");
  });

  document.querySelector("#download-button").addEventListener("click", () => {
    if (!output.value || output.classList.contains("output-error")) {
      setStatus("There is no valid output to download.", "error");
      return;
    }
    const format = selectedFormat();
    const mime = { json: "application/json", xml: "application/xml", yaml: "application/yaml" }[format];
    const downloadName = `${safeFilename()}.${format}`;
    filenameInput.value = safeFilename();
    const url = URL.createObjectURL(new Blob([output.value], { type: `${mime};charset=utf-8` }));
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`${downloadName} downloaded.`, "success");
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
    });
  });

  dropZone.addEventListener("drop", (event) => loadFile(event.dataTransfer.files[0]));

  input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") convert();
    if (event.key === "Tab") {
      event.preventDefault();
      input.setRangeText("  ", input.selectionStart, input.selectionEnd, "end");
      updateStats();
    }
  });

  updateExtension();
  updateStats();
  window.addEventListener("load", convert);
  window.addEventListener("resize", resizeEditors);
})();
