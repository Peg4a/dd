const sourceText = document.getElementById("sourceText");
const targetText = document.getElementById("targetText");
const translateBtn = document.getElementById("translateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const useOutputBtn = document.getElementById("useOutputBtn");
const swapBtn = document.getElementById("swapBtn");
const modeLabel = document.getElementById("modeLabel");
const sourceLabel = document.getElementById("sourceLabel");
const targetLabel = document.getElementById("targetLabel");
const statusEl = document.getElementById("status");
const charCount = document.getElementById("charCount");

let direction = "en-to-ckb";

function currentPair() {
  if (direction === "en-to-ckb") {
    return {
      sourceCode: "en",
      targetCode: "ckb",
      sourceTextLabel: "English",
      targetTextLabel: "Central Kurdish (Sorani)",
      sourcePlaceholder: "Write English text here...",
      targetPlaceholder: "وەرگێڕانی کوردی ناوەندی لێرە دەردەکەوێت...",
      sourceDir: "ltr",
      targetDir: "rtl",
      sourceLang: "en",
      targetLang: "ckb"
    };
  }

  return {
    sourceCode: "ckb",
    targetCode: "en",
    sourceTextLabel: "Central Kurdish (Sorani)",
    targetTextLabel: "English",
    sourcePlaceholder: "دەقی کوردی ناوەندی لێرە بنووسە...",
    targetPlaceholder: "English translation appears here...",
    sourceDir: "rtl",
    targetDir: "ltr",
    sourceLang: "ckb",
    targetLang: "en"
  };
}

function applyDirectionUI() {
  const pair = currentPair();
  modeLabel.textContent =
    direction === "en-to-ckb"
      ? "Direction: English to Central Kurdish"
      : "Direction: Central Kurdish to English";

  sourceLabel.textContent = pair.sourceTextLabel;
  targetLabel.textContent = pair.targetTextLabel;

  sourceText.placeholder = pair.sourcePlaceholder;
  targetText.placeholder = pair.targetPlaceholder;

  sourceText.dir = pair.sourceDir;
  targetText.dir = pair.targetDir;

  sourceText.lang = pair.sourceLang;
  targetText.lang = pair.targetLang;
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove("error", "success");
  if (type) {
    statusEl.classList.add(type);
  }
}

async function translateWithGoogle(text, sourceCode, targetCode) {
  const endpoint = "https://translate.googleapis.com/translate_a/single";
  const url =
    `${endpoint}?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&q=` +
    encodeURIComponent(text);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Google translation provider unavailable.");
  }

  const data = await response.json();
  const fragments = Array.isArray(data?.[0]) ? data[0] : [];
  const translated = fragments.map((item) => item?.[0] || "").join("");

  if (!translated.trim()) {
    throw new Error("Google provider returned empty translation.");
  }

  return translated;
}

async function translateWithMyMemory(text, sourceCode, targetCode) {
  const endpoint = "https://api.mymemory.translated.net/get";
  const pairTarget = targetCode === "ckb" ? "ku" : targetCode;
  const pairSource = sourceCode === "ckb" ? "ku" : sourceCode;
  const url = `${endpoint}?q=${encodeURIComponent(text)}&langpair=${pairSource}|${pairTarget}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("MyMemory translation provider unavailable.");
  }

  const data = await response.json();
  const translated = data?.responseData?.translatedText;

  if (!translated || !translated.trim()) {
    throw new Error("MyMemory provider returned empty translation.");
  }

  return translated;
}

async function translateText(text, sourceCode, targetCode) {
  try {
    return await translateWithGoogle(text, sourceCode, targetCode);
  } catch (googleError) {
    return translateWithMyMemory(text, sourceCode, targetCode);
  }
}

translateBtn.addEventListener("click", async () => {
  const input = sourceText.value.trim();
  const pair = currentPair();

  if (!input) {
    targetText.value = "";
    setStatus("Please type text before translating.", "error");
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = "Translating...";
  setStatus("Contacting translation providers...");

  try {
    const translated = await translateText(input, pair.sourceCode, pair.targetCode);
    targetText.value = translated;
    setStatus("Translation completed.", "success");
  } catch (error) {
    targetText.value = "";
    setStatus("Unable to reach translation providers. Check your internet and try again.", "error");
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
});

clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  targetText.value = "";
  charCount.textContent = "0 chars";
  setStatus("Cleared.");
});

copyBtn.addEventListener("click", async () => {
  const output = targetText.value.trim();
  if (!output) {
    setStatus("Nothing to copy yet.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    setStatus("Translation copied to clipboard.", "success");
  } catch (error) {
    setStatus("Clipboard access blocked by browser.", "error");
  }
});

useOutputBtn.addEventListener("click", () => {
  if (!targetText.value.trim()) {
    setStatus("Translate something first.", "error");
    return;
  }

  sourceText.value = targetText.value;
  targetText.value = "";
  sourceText.focus();
  sourceText.setSelectionRange(sourceText.value.length, sourceText.value.length);
  charCount.textContent = `${sourceText.value.length} chars`;
  setStatus("Output moved to input.");
});

swapBtn.addEventListener("click", () => {
  direction = direction === "en-to-ckb" ? "ckb-to-en" : "en-to-ckb";

  const sourceValue = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = sourceValue;

  applyDirectionUI();
  charCount.textContent = `${sourceText.value.length} chars`;
  setStatus("Language direction swapped.");
});

sourceText.addEventListener("input", () => {
  charCount.textContent = `${sourceText.value.length} chars`;
});

applyDirectionUI();
