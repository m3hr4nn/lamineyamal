(() => {
  "use strict";

  const root = document.documentElement;
  const input = document.querySelector("#yaml-input");
  const output = document.querySelector("#output");
  const format = document.querySelector("#output-format");
  const status = document.querySelector("#status");
  const fileInput = document.querySelector("#file-input");
  const dropZone = document.querySelector("#drop-zone");
  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = themeButton.querySelector(".theme-icon");
  const themeLabel = themeButton.querySelector(".theme-label");
  const inputStats = document.querySelector("#input-stats");

  const setStatus = (message = "", type = "") => {
    status.textContent = message;
    status.className = type;
  };

  const updateStats = () => {
    const lines = input.value ? input.value.split(/\r?\n/).length : 0;
    inputStats.textContent = `${lines} ${lines === 1 ? "line" : "lines"}`;
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
    const childIndent = "  ".repeat(depth + 1);

    if (value === null || value === undefined) return `${indent}<${tag}/>`;

    if (Array.isArray(value)) {
      if (value.length === 0) return `${indent}<${tag}/>`;
      const items = value.map((item) => toXml(item, "item", depth + 1)).join("\n");
      return `${indent}<${tag}>\n${items}\n${indent}</${tag}>`;
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return `${indent}<${tag}/>`;
      const children = entries
        .map(([key, child]) => toXml(child, key, depth + 1))
        .join("\n");
      return `${indent}<${tag}>\n${children}\n${indent}</${tag}>`;
    }

    return `${indent}<${tag}>${escapeXml(value)}</${tag}>`;
  };

  const convert = () => {
    try {
      if (!window.jsyaml) throw new Error("The YAML parser could not load. Check your internet connection.");
      if (!input.value.trim()) throw new Error("Enter YAML or open a .yaml file first.");

      const documents = [];
      window.jsyaml.loadAll(input.value, (document) => documents.push(document));
      const data = documents.length === 1 ? documents[0] : documents;

      output.value = format.value === "json"
        ? JSON.stringify(data, null, 2)
        : `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data)}`;

      setStatus(`Valid YAML · Converted to ${format.value.toUpperCase()}`, "success");
    } catch (error) {
      output.value = "";
      setStatus(error.message, "error");
    }
  };

  const loadFile = async (file) => {
    if (!file) return;
    const validExtension = /\.ya?ml$/i.test(file.name);
    if (!validExtension) {
      setStatus("Please choose a .yaml or .yml file.", "error");
      return;
    }
    input.value = await file.text();
    updateStats();
    convert();
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    themeIcon.textContent = dark ? "☀" : "☾";
    themeLabel.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
    document.querySelector('meta[name="theme-color"]').content = dark ? "#161a17" : "#f5faf6";
    localStorage.setItem("hamine-yamal-theme", theme);
  };

  const savedTheme = localStorage.getItem("hamine-yamal-theme");
  const preferredTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(savedTheme || preferredTheme);

  themeButton.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  document.querySelector("#convert-button").addEventListener("click", convert);
  format.addEventListener("change", convert);
  input.addEventListener("input", () => {
    updateStats();
    setStatus("Ready to convert");
  });

  document.querySelector("#open-button").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));

  document.querySelector("#clear-button").addEventListener("click", () => {
    input.value = "";
    output.value = "";
    updateStats();
    setStatus("Editor cleared");
    input.focus();
  });

  document.querySelector("#copy-button").addEventListener("click", async () => {
    if (!output.value) {
      setStatus("Nothing to copy yet.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("Output copied to clipboard.", "success");
    } catch {
      output.select();
      document.execCommand("copy");
      setStatus("Output copied to clipboard.", "success");
    }
  });

  document.querySelector("#download-button").addEventListener("click", () => {
    if (!output.value) {
      setStatus("Nothing to download yet.", "error");
      return;
    }
    const extension = format.value;
    const mime = extension === "json" ? "application/json" : "application/xml";
    const url = URL.createObjectURL(new Blob([output.value], { type: `${mime};charset=utf-8` }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `hamine-yamal-output.${extension}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`${link.download} downloaded.`, "success");
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
      const start = input.selectionStart;
      input.setRangeText("  ", start, input.selectionEnd, "end");
      updateStats();
    }
  });

  updateStats();
  window.addEventListener("load", convert);
})();
