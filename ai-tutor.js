/* =========================================================
   NADAF CREATES AI TUTOR
   Frontend Demo Version
   ========================================================= */

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const writtenModeButton = document.getElementById("writtenModeButton");

const chatModeButton = document.getElementById("chatModeButton");

const voiceModeButton = document.getElementById("voiceModeButton");

const voiceModePanel = document.getElementById("voiceModePanel");

const aiChatBody = document.getElementById("aiChatBody");

const textInputArea = document.getElementById("textInputArea");

const chatInput = document.getElementById("chatInput");

const sendMessageButton = document.getElementById("sendMessageButton");

const microphoneButton = document.getElementById("microphoneButton");

const attachmentButton = document.getElementById("attachmentButton");

const chatMessages = document.getElementById("chatMessages");

const aiWelcomeState = document.getElementById("aiWelcomeState");

const aiTypingIndicator = document.getElementById("aiTypingIndicator");

const modelSelectorButton = document.getElementById("modelSelectorButton");

const modelDropdown = document.getElementById("modelDropdown");

const selectedModelName = document.getElementById("selectedModelName");

const selectedModelIcon = document.getElementById("selectedModelIcon");

const modelOptions = document.querySelectorAll(".model-option");

const suggestedPrompts = document.querySelectorAll(".suggested-prompt");

const startVoiceButton = document.getElementById("startVoiceButton");

/* =========================================================
   STATE
   ========================================================= */

let currentMode = "written";

let selectedModel = "Myelin Smart";

let isTyping = false;

// True only when the current answer belongs to the user-supplied Q&A list.
let skipThinkingForCurrentResponse = false;

let microphoneActive = false;

/* =========================================================
   ACTIVATE MODE BUTTON
   ========================================================= */

function resetModeButtons() {
  writtenModeButton.classList.remove("active");

  chatModeButton.classList.remove("active");

  voiceModeButton.classList.remove("active");
}

/* =========================================================
   WRITTEN MODE
   ========================================================= */

function activateWrittenMode() {
  currentMode = "written";

  resetModeButtons();

  writtenModeButton.classList.add("active");

  voiceModePanel.classList.remove("active");

  aiChatBody.classList.remove("voice-active");

  textInputArea.style.display = "block";

  aiWelcomeState.style.display = "flex";

  chatInput.placeholder = "Write your doubt in detail...";

  chatInput.focus();
}

/* =========================================================
   CHAT MODE
   ========================================================= */

function activateChatMode() {
  currentMode = "chat";

  resetModeButtons();

  chatModeButton.classList.add("active");

  voiceModePanel.classList.remove("active");

  aiChatBody.classList.remove("voice-active");

  textInputArea.style.display = "block";

  aiWelcomeState.style.display = "flex";

  chatInput.placeholder = "Chat with Myelin AI by Nadaf Creates...";

  chatInput.focus();
}

/* =========================================================
   VOICE MODE
   ========================================================= */

function activateVoiceMode() {
  currentMode = "voice";

  resetModeButtons();

  voiceModeButton.classList.add("active");

  textInputArea.style.display = "none";

  aiWelcomeState.style.display = "none";

  voiceModePanel.classList.add("active");

  aiChatBody.classList.add("voice-active");
}

/* =========================================================
   MODE EVENTS
   ========================================================= */

writtenModeButton.addEventListener("click", activateWrittenMode);

chatModeButton.addEventListener("click", activateChatMode);

voiceModeButton.addEventListener("click", activateVoiceMode);

/* =========================================================
   MODEL DROPDOWN
   ========================================================= */

modelSelectorButton.addEventListener("click", function (event) {
  event.stopPropagation();

  modelDropdown.classList.toggle("show");
});

/* =========================================================
   MODEL SELECTION
   ========================================================= */

modelOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    selectedModel = option.getAttribute("data-model");

    selectedModelName.textContent = selectedModel;

    const modelWords = selectedModel.trim().split(/\s+/);

    selectedModelIcon.textContent =
      modelWords[1]?.charAt(0).toUpperCase() || "S";

    modelOptions.forEach(function (item) {
      item.classList.remove("selected");
    });

    option.classList.add("selected");

    modelDropdown.classList.remove("show");
  });
});

/* =========================================================
   CLOSE DROPDOWN OUTSIDE
   ========================================================= */

document.addEventListener("click", function (event) {
  if (!event.target.closest(".ai-model-selector")) {
    modelDropdown.classList.remove("show");
  }
});

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {
  const element = document.createElement("div");

  element.textContent = text;

  return element.innerHTML;
}

/* =========================================================
   SCROLL CHAT
   ========================================================= */

function scrollChatToBottom() {
  requestAnimationFrame(function () {
    if (!aiChatBody) return;
    aiChatBody.scrollTo({
      top: aiChatBody.scrollHeight,
      behavior: "smooth",
    });
  });
}

// During typewriter playback, keep the currently revealed token in view.
// Do not jump to the end of the full (still-hidden) answer before typing starts.
function keepTypingTokenVisible(token, messageElement) {
  if (!aiChatBody || !token) return;
  const target = token.node || token;
  if (!target || !target.getBoundingClientRect) return;

  const viewportRect = aiChatBody.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const topInset = 18;
  const bottomInset = 120;

  if (targetRect.bottom > viewportRect.bottom - bottomInset) {
    aiChatBody.scrollTop +=
      targetRect.bottom - (viewportRect.bottom - bottomInset);
  } else if (targetRect.top < viewportRect.top + topInset) {
    aiChatBody.scrollTop -= viewportRect.top + topInset - targetRect.top;
  }
}

/* =========================================================
   APPLY HINDI / DEVANAGARI FONT
   Split only Devanagari text into .hindi-text spans so
   English and Roman text use Inter. Existing
   <strong>, headings, list items, etc. keep their weight.
   ========================================================= */

function applyHindiFont(root) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      if (!parent || parent.closest(".hindi-text")) {
        return NodeFilter.FILTER_REJECT;
      }

      // Keep code/pre content untouched.
      if (parent.closest("pre, code")) {
        return NodeFilter.FILTER_REJECT;
      }

      return /[\u0900-\u097F]/.test(node.nodeValue)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  const devanagariPattern = /([\u0900-\u097F]+)/g;

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    devanagariPattern.lastIndex = 0;

    while ((match = devanagariPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index)),
        );
      }

      const hindiSpan = document.createElement("span");
      hindiSpan.className = "hindi-text";
      hindiSpan.textContent = match[0];
      fragment.appendChild(hindiSpan);

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

/* =========================================================
   ADD USER MESSAGE
   ========================================================= */

function addUserMessage(message) {
  const messageElement = document.createElement("div");

  messageElement.className = "chat-message user";

  messageElement.innerHTML = `

        <div class="message-avatar">
            <i class="fa-solid fa-user"></i>
        </div>

        <div class="message-content">
            ${escapeHTML(message)}
        </div>

    `;

  chatMessages.appendChild(messageElement);

  applyHindiFont(messageElement.querySelector(".message-content"));
  scrollChatToBottom();
}

/* =========================================================
   ADD AI MESSAGE WITH TYPEWRITER ANIMATION
   ========================================================= */

/* =========================================================
   MATHJAX — RENDER CENTERED DISPLAY EQUATIONS
   Loads MathJax once and typesets equations after AI typing.
   ========================================================= */
function ensureMathJaxLoaded() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    return Promise.resolve();
  }

  if (window.__myelinMathJaxPromise) {
    return window.__myelinMathJaxPromise;
  }

  // MathJax must be configured before its script is loaded.
  window.MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
    },
    chtml: { scale: 1 },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    },
    startup: { typeset: false },
  };

  window.__myelinMathJaxPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "MathJax-script";
    script.async = true;
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
    script.onload = () => resolve();
    script.onerror = () => {
      window.__myelinMathJaxPromise = null;
      reject(new Error("MathJax could not be loaded."));
    };
    document.head.appendChild(script);
  });

  return window.__myelinMathJaxPromise;
}

function renderMathInElement(element) {
  if (!element) return;

  ensureMathJaxLoaded()
    .then(() => window.MathJax.typesetPromise([element]))
    .catch((error) => console.error("MathJax rendering error:", error));
}


/* Align the logo with the actual FIRST rendered line, not the response box.
   Different first elements (p, headings, lists, math) have different margins. */
function alignMyelinAvatarToFirstLine(messageElement) {
  if (!messageElement || !messageElement.isConnected) return;
  const avatar = messageElement.querySelector('.message-avatar');
  const content = messageElement.querySelector('.message-content');
  if (!avatar || !content) return;
  avatar.style.setProperty('margin-top', '0px', 'important');
  messageElement.style.setProperty('align-items', 'flex-start', 'important');
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent.trim() || node.parentElement?.closest('script, style'))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const firstText = walker.nextNode();
  let lineTop, lineHeight;
  if (firstText) {
    const start = firstText.textContent.search(/\S/);
    const range = document.createRange();
    range.setStart(firstText, start);
    range.setEnd(firstText, Math.min(start + 1, firstText.length));
    const rect = range.getBoundingClientRect();
    const style = getComputedStyle(firstText.parentElement);
    lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
    lineTop = rect.top;
    lineHeight = rect.height || lineHeight;
  } else {
    const first = content.firstElementChild;
    if (!first) return;
    const rect = first.getBoundingClientRect();
    lineTop = rect.top;
    lineHeight = Math.min(rect.height, parseFloat(getComputedStyle(first).lineHeight) || 24);
  }
  const rowTop = messageElement.getBoundingClientRect().top;
  const avatarHeight = avatar.getBoundingClientRect().height;
  if (!avatarHeight || !Number.isFinite(lineTop)) return;
  // Align logo CENTER with the first line's center, for every response format.
  const offset = Math.max(0, lineTop - rowTop + lineHeight / 2 - avatarHeight / 2);
  avatar.style.setProperty('margin-top', `${offset}px`, 'important');
}

async function addAIMessageWithAnimation(fullHTML, onComplete) {
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message ai";
  // Anchor the AI logo to the first response line, even for long/list/math answers.
  messageElement.style.alignItems = "flex-start";
  messageElement.innerHTML = `
    <div class="message-avatar">
      <img src="images/ai-company.png" alt="Myelin AI">
    </div>
    <div class="message-content"></div>
  `;

  const contentContainer = messageElement.querySelector(".message-content");
  // Keep normal text line spacing intact while adding clearer section separation.
  contentContainer.style.lineHeight = "1.5";
  // Lift the response content by 10px to align its first line with the avatar.
  contentContainer.style.position = "relative";
  contentContainer.style.top = "0px";
  // Keep a 100px breathing space after the final animated line of the AI response.
  contentContainer.style.paddingBottom = "0px";
  contentContainer.innerHTML = fullHTML;
  contentContainer.querySelectorAll("p").forEach((el) => {
    el.style.setProperty("margin-top", "0.45em", "important");
    el.style.setProperty("margin-bottom", "0.75em", "important");
  });
  contentContainer
    .querySelectorAll("h1, h2, h3, h4, h5, h6")
    .forEach((heading) => {
      heading.style.setProperty("margin-top", "1.55em", "important");
      heading.style.setProperty("margin-bottom", "0.7em", "important");
      heading.style.setProperty("line-height", "1.3", "important");
    });
  contentContainer.querySelectorAll("ul, ol").forEach((el) => {
    el.style.marginTop = "0.55em";
    el.style.marginBottom = "0.95em";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
  });
  // Add space between a completed list and the paragraph/line that follows it,
  // without changing spacing between ordinary list items.
  contentContainer
    .querySelectorAll(
      "ul + p, ol + p, ul + h1, ul + h2, ul + h3, ul + h4, ul + h5, ul + h6, ol + h1, ol + h2, ol + h3, ol + h4, ol + h5, ol + h6",
    )
    .forEach((el) => {
      el.style.setProperty("margin-top", "1.1em", "important");
    });
  contentContainer.querySelectorAll("li").forEach((el) => {
    el.style.marginTop = "0";
    el.style.marginBottom = "0.35em";
    el.style.lineHeight = "1.5";
  });
  applyHindiFont(contentContainer);
  // First response block has no extra top gap; later blocks keep their spacing.
  const firstResponseBlock = Array.from(contentContainer.children).find(el =>
    !el.matches('script, style')
  );
  if (firstResponseBlock) {
    firstResponseBlock.style.setProperty('margin-top', '0px', 'important');
  }

  // Keep the answer hidden until any explicitly authored MathJax is fully typeset.
  messageElement.style.visibility = "hidden";
  chatMessages.appendChild(messageElement);

  // Only invoke MathJax for answers that actually contain MathJax delimiters.
  // Ordinary HTML answers retain their original markup and styling.
  const hasMathJax = /\\\(|\\\)|\\\[|\\\]/.test(fullHTML);
  if (hasMathJax) {
    try {
      await ensureMathJaxLoaded();
      if (window.MathJax && window.MathJax.typesetPromise) {
        await window.MathJax.typesetPromise([contentContainer]);
        contentContainer
          .querySelectorAll('mjx-container[display="true"]')
          .forEach((equation) => {
            equation.style.setProperty("display", "block", "important");
            equation.style.setProperty("text-align", "center", "important");
            equation.style.setProperty("margin", "0.8em auto", "important");
            equation.style.setProperty("max-width", "100%", "important");
          });
      }
    } catch (error) {
      console.error("MathJax rendering error:", error);
    }
  }

  const revealTokens = [];
  const hiddenElements = [];

  // Lists: replace browser-generated bullets/numbers with real text so they
  // can be revealed progressively just like the rest of the answer.
  // Suppress native/pseudo markers from site-level CSS; only the animated marker spans remain.
  if (!document.getElementById("myelin-single-list-marker-style")) {
    const markerStyle = document.createElement("style");
    markerStyle.id = "myelin-single-list-marker-style";
    markerStyle.textContent = `.chat-message.ai .message-content ol, .chat-message.ai .message-content ul { list-style: none !important; } .chat-message.ai .message-content li::marker { content: "" !important; font-size: 0 !important; } .chat-message.ai .message-content li::before { content: none !important; }`;
    document.head.appendChild(markerStyle);
  }
  contentContainer.querySelectorAll("ul, ol").forEach((list) => {
    // Disable native list markers explicitly; only our animated marker spans
    // should be visible, otherwise the browser shows numbers before typing.
    list.style.setProperty("list-style", "none", "important");
    list.style.setProperty("list-style-type", "none", "important");
    list.style.setProperty("padding-left", "1.4em", "important");
    Array.from(list.children)
      .filter((child) => child.tagName === "LI")
      .forEach((li, index) => {
        li.style.setProperty("list-style", "none", "important");
        li.style.setProperty("list-style-type", "none", "important");
        // A site-level li::marker rule can still render a native number even
        // when list-style is reset. Block display removes the native marker;
        // the custom span below remains the sole animated marker.
        li.style.setProperty("display", "block", "important");
        li.style.setProperty("position", "relative", "important");

        const marker = document.createElement("span");
        marker.className = "myelin-typewriter-list-marker";
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = list.tagName === "OL" ? `${index + 1}. ` : "• ";
        marker.style.position = "absolute";
        marker.style.left = "0";
        marker.style.marginLeft = "-1.4em";
        marker.style.setProperty("display", "inline", "important");
        marker.style.setProperty("list-style", "none", "important");
        marker.style.pointerEvents = "none";
        li.insertBefore(marker, li.firstChild);
      });
  });

  // Animate horizontal rules as a progressive wipe rather than showing them at once.
  contentContainer.querySelectorAll("hr").forEach((hr) => {
    hr.style.transformOrigin = "left center";
    hr.style.transform = "scaleX(0)";
    hr.style.transition = "none";
  });

  const walker = document.createTreeWalker(
    contentContainer,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.matches(
              "mjx-container, .MathJax, script, style, pre, code, hr",
            )
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          if (
            node.closest("mjx-container, .MathJax, script, style, pre, code")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_SKIP;
        }
        if (!node.nodeValue || !node.nodeValue.length)
          return NodeFilter.FILTER_REJECT;
        if (
          node.parentElement &&
          node.parentElement.closest(
            "script, style, pre, code, mjx-container, .MathJax",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const nodesToProcess = [];
  while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

  nodesToProcess.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // A rendered equation is kept intact (never expose raw TeX); reveal it
      // progressively with a left-to-right wipe after MathJax has finished.
      if (node.matches("mjx-container, .MathJax")) {
        const isDisplayEquation =
          node.matches('mjx-container[display="true"]') ||
          node.getAttribute("display") === "true";
        if (isDisplayEquation) {
          // Keep display equations centered during the reveal as well as after it.
          node.style.setProperty("display", "block", "important");
          node.style.setProperty("width", "100%", "important");
          node.style.setProperty("text-align", "center", "important");
          node.style.setProperty("margin-left", "auto", "important");
          node.style.setProperty("margin-right", "auto", "important");
        } else {
          node.style.display = "inline-block";
        }
        node.style.clipPath = "inset(0 100% 0 0)";
        node.style.transition = "none";
        revealTokens.push({ type: "equation", node, isDisplayEquation });
        return;
      }
      return;
    }

    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    for (const character of text) {
      const span = document.createElement("span");
      span.textContent = character;
      span.style.opacity = "0";
      // Use normal HTML whitespace collapsing so template indentation/newlines
      // do not become visible blank lines during the typewriter reveal.
      span.style.whiteSpace = "normal";
      fragment.appendChild(span);
      revealTokens.push({ type: "character", node: span });
    }
    node.parentNode.replaceChild(fragment, node);
  });

  messageElement.style.visibility = "visible";
  alignMyelinAvatarToFirstLine(messageElement);
  requestAnimationFrame(() => alignMyelinAvatarToFirstLine(messageElement));
  if (document.fonts?.ready) document.fonts.ready.then(() => alignMyelinAvatarToFirstLine(messageElement));
  const avatarImage = messageElement.querySelector(".message-avatar img");
  if (avatarImage && !avatarImage.complete) avatarImage.addEventListener("load", () => alignMyelinAvatarToFirstLine(messageElement), { once: true });
  requestAnimationFrame(() => {
    const bodyRect = aiChatBody.getBoundingClientRect();
    const messageRect = messageElement.getBoundingClientRect();
    const relativeTop = messageRect.top - bodyRect.top + aiChatBody.scrollTop;
    aiChatBody.scrollTop = Math.max(0, relativeTop - 12);
    if (revealTokens.length)
      keepTypingTokenVisible(revealTokens[0], messageElement);
  });

  let tokenIndex = 0;
  const typingSpeedMs = 1;
  function revealNextToken() {
    if (tokenIndex >= revealTokens.length) {
      if (typeof onComplete === "function") onComplete();
      return;
    }
    const token = revealTokens[tokenIndex++];
    if (token.type === "character") {
      token.node.style.opacity = "1";
    } else if (token.type === "equation") {
      token.node.style.transition = "clip-path 180ms linear";
      token.node.style.clipPath = "inset(0 0 0 0)";
    } else if (token.type === "rule") {
      token.node.style.transition = "transform 180ms linear";
      token.node.style.transform = "scaleX(1)";
    }
    keepTypingTokenVisible(token, messageElement);
    setTimeout(revealNextToken, typingSpeedMs);
  }
  revealNextToken();
}

/* =========================================================
   THINKING ANIMATION
   ========================================================= */

(function addThinkingAnimationStyles() {
  if (document.getElementById("myelin-thinking-animation-styles")) return;
  const style = document.createElement("style");
  style.id = "myelin-thinking-animation-styles";
  style.textContent = `
    .myelin-thinking-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0;
      color: #ffffff;
      font: inherit;
      font-weight: 500;
      line-height: 1.6;
      white-space: nowrap;
    }
    .myelin-thinking-indicator span {
      display: inline-block;
      color: #ffffff;
      animation: myelinThinkingJump 0.72s ease-in-out infinite;
      animation-delay: calc(var(--letter-index) * 0.075s);
    }
    @keyframes myelinThinkingJump {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.78; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .myelin-thinking-indicator span { animation: none; }
    }
  `;
  document.head.appendChild(style);
})();

function showThinkingAnimation() {
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message ai myelin-thinking-message";
  messageElement.innerHTML = `
    <div class="message-avatar">
      <img src="images/ai-company.png" alt="Myelin AI">
    </div>
    <div class="message-content">
      <span class="myelin-thinking-indicator" aria-label="Thinking" role="status">${"Thinking"
        .split("")
        .map(
          (letter, index) =>
            `<span style="--letter-index:${index}">${letter}</span>`,
        )
        .join("")}</span>
    </div>
  `;
  chatMessages.appendChild(messageElement);
  alignMyelinAvatarToFirstLine(messageElement);
  scrollChatToBottom();
  return messageElement;
}

/* =========================================================
   TYPING INDICATOR (DISABLED/REMOVED AS REQUESTED)
   ========================================================= */

function showTypingIndicator() {
  // Bypassed: User requested no typing indicator
}

function hideTypingIndicator() {
  if (aiTypingIndicator) {
    aiTypingIndicator.classList.remove("show");
  }
}

/* =========================================================
   DEMO RESPONSE ENGINE
   ========================================================= */

// Consistent matching for normal questions and MathJax-formatted answers alike.
// Commas, full stops, question marks and extra spaces in the user's question
// no longer prevent matching. Preserve math symbols for formula-based prompts.
function normalizeDemoQuestion(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[\u0964\u0965,!?;:।؟]/g, " ")
    .replace(/\.(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesDemoPhrase(message, phrase) {
  const needle = normalizeDemoQuestion(phrase);
  if (!needle) return false;
  // Match full words/phrases rather than fragments (e.g. 'hi' in 'this').
  let index = message.indexOf(needle);
  while (index !== -1) {
    const before = index === 0 ? "" : message[index - 1];
    const after = message[index + needle.length] || "";
    const isWord = c => /[\p{L}\p{N}]/u.test(c);
    if ((!before || !isWord(before)) && (!after || !isWord(after))) return true;
    index = message.indexOf(needle, index + 1);
  }
  return false;
}

function generateDemoResponse(userMessage) {
  skipThinkingForCurrentResponse = false;
  const message = normalizeDemoQuestion(userMessage);

  // MYELIN SIX SCIENCE TOPICS — only new question/answer blocks
  // 1. MENDEL'S LAWS — HEREDITY
  if (
    matchesDemoPhrase(message, "explain mendel's laws") ||
    matchesDemoPhrase(message, "what are mendel's laws") ||
    matchesDemoPhrase(message, "mendel law of inheritance") ||
    matchesDemoPhrase(message, "mendel ke niyam") ||
    matchesDemoPhrase(message, "explain monohybrid cross") ||
    matchesDemoPhrase(message, "mendel's law of dominance")
  ) {
    return `
      <h3>🫛 Mendel's Laws — Matar Ke Plants Ki Family Story!</h3>
      <div class="science-stage"><div class="science-stage-title">🫛 Mendel ka live inheritance map <small>Parents → F1 → F2</small></div><div class="science-rail"><div class="science-node green">🌳 TT<br><small>Pure Tall</small></div><span class="science-sign">×</span><div class="science-node amber">🌱 tt<br><small>Pure Dwarf</small></div></div><div class="science-arrow">↓ Dono ek-ek allele dete hain</div><div class="science-rail"><div class="science-node blue science-glow">🌿 Tt<br><small>F1: sab Tall</small></div></div><div class="science-arrow">↓ F1 × F1 = Tt × Tt</div><div class="science-grid4"><div class="science-node green science-rise">TT<br><small>Tall</small></div><div class="science-node green science-rise">Tt<br><small>Tall</small></div><div class="science-node green science-rise">Tt<br><small>Tall</small></div><div class="science-node amber science-rise">tt<br><small>Dwarf</small></div></div><p class="science-lesson">👀 Dekho: 4 mein se <strong>3 tall</strong>, <strong>1 dwarf</strong>. Recessive t gayab nahi hua tha!</p></div>
      <p>Genetics (आनुवंशिकी) confusing lagti hai? Socho Gregor Mendel ek detective the, aur unke suspects the <strong>pea plants (मटर के पौधे)</strong>! 🕵️😂</p>
      <h4>1. Pehle Characters Ko Jaano 🎭</h4>
      <ul>
        <li><strong>Trait (लक्षण):</strong> Jaise plant ka tall (लंबा) ya dwarf (बौना) hona.</li>
        <li><strong>Gene (जीन):</strong> Inherited information (वंशानुगत सूचना) ka ek unit.</li>
        <li><strong>Alleles (विकल्पी जीन):</strong> Ek gene ke different forms, jaise T aur t.</li>
        <li><strong>Dominant (प्रभावी):</strong> T — ek copy ho toh bhi tall trait dikhta hai.</li>
        <li><strong>Recessive (अप्रभावी):</strong> t — dwarf trait tab dikhta hai jab dono copies t hon.</li>
      </ul>
      <p><strong>Plant T:</strong> "Main tall hoon, meri entry hote hi tall trait dikhega!" 😎 <strong>Plant t:</strong> "Meri baari tab aayegi jab dono alleles t honge!" 😂</p>
      <h4>2. Monohybrid Cross (एकसंकर संकरण) 🌱</h4>
      <p><strong>Parent generation (P):</strong> Pure tall TT × pure dwarf tt.</p>
      <div style="border:1px solid #6b7280;border-radius:12px;padding:12px;margin:12px 0;text-align:center;line-height:2">
        <div><strong>🌳 TT (Tall)</strong> × <strong>🌱 tt (Dwarf)</strong></div>
        <div>⬇️ Gametes (युग्मक): T aur t</div>
        <div style="background:#dbeafe;color:#172554;border-radius:8px;padding:6px"><strong>F1: Sab Tt (Tall) 🌳</strong></div>
        <div>⬇️ F1 cross: Tt × Tt</div>
      </div>
      <p>Ab F2 generation ka Punnett square (पनेट वर्ग) dekho:</p>
      <table style="width:100%;border-collapse:collapse;text-align:center;margin:10px 0">
        <tr><th style="border:1px solid #94a3b8;padding:9px">🫛</th><th style="border:1px solid #94a3b8;padding:9px">T</th><th style="border:1px solid #94a3b8;padding:9px">t</th></tr>
        <tr><th style="border:1px solid #94a3b8;padding:9px">T</th><td style="border:1px solid #94a3b8;padding:9px;background:#dcfce7;color:#14532d">TT 🌳</td><td style="border:1px solid #94a3b8;padding:9px;background:#dcfce7;color:#14532d">Tt 🌳</td></tr>
        <tr><th style="border:1px solid #94a3b8;padding:9px">t</th><td style="border:1px solid #94a3b8;padding:9px;background:#dcfce7;color:#14532d">Tt 🌳</td><td style="border:1px solid #94a3b8;padding:9px;background:#fef3c7;color:#78350f">tt 🌱</td></tr>
      </table>
      <p><strong>Genotype ratio (जीन संयोजन अनुपात):</strong> 1 TT : 2 Tt : 1 tt.</p>
      <p><strong>Phenotype ratio (दिखने वाले लक्षणों का अनुपात):</strong> 3 tall : 1 dwarf.</p>
      <p><strong>t allele:</strong> "Main F1 mein gayab nahi hua tha bhai, bas chhupa tha!" 😂</p>
      <h4>3. Mendel Ke 3 Main Laws 📚</h4>
      <ul>
        <li><strong>Law of Dominance (प्रभाविता का नियम):</strong> Heterozygous Tt mein dominant trait (tall) dikhta hai.</li>
        <li><strong>Law of Segregation (पृथक्करण का नियम):</strong> Gametes bante waqt allele pair alag ho jaata hai; har gamete ko ek allele milta hai.</li>
        <li><strong>Law of Independent Assortment (स्वतंत्र अपव्यूहन का नियम):</strong> Different genes ke alleles independent tarike se distribute ho sakte hain, jab genes unlinked hon ya kaafi door hon.</li>
      </ul>
      <h4>4. Board Exam Quick Revision 🎯</h4>
      <p><strong>F1:</strong> 100% tall (Tt). <strong>F2:</strong> 3 tall : 1 dwarf. <strong>Genotype:</strong> 1:2:1.</p>
      <p><strong>Memory trick:</strong> "T ka attitude dominant, t ka talent recessive!" 😎🫛</p>
      <h4>5. Ek poori detective story — TT se F2 tak 🔎</h4><p><strong>Scene 1:</strong> Mendel uncle ne pure tall (TT) aur pure dwarf (tt) plant cross kiye. TT sirf T gamete dega; tt sirf t. Isliye bachche sab Tt hue aur tall dikhe. Dwarf gene chhutti par tha, delete nahi hua! 😂</p><p><strong>Scene 2:</strong> Do F1 plants (Tt × Tt) cross kiye. Har parent T ya t de sakta hai. Chaar equally likely combinations TT, Tt, Tt, tt. Sirf tt dwarf hai. Isliye 3:1 <strong>phenotypic ratio (दिखने वाले लक्षणों का अनुपात)</strong>.</p><p><strong>Genotype (आनुवंशिक संयोजन)</strong> = letters TT/Tt/tt; <strong>phenotype (बाहरी लक्षण)</strong> = tall/dwarf. Ek photo aur ek secret ID card jaisa samjho! 📸🪪</p><h4>6. Three laws with daily-life analogies 🎭</h4><p><strong>Dominance:</strong> Tt mein T ka effect dikhta hai. <strong>Segregation:</strong> Gamete bante waqt T aur t alag packets mein jaate hain. <strong>Independent assortment:</strong> Alag unlinked genes ke allele pairs independently distribute ho sakte hain; ye har linked gene par blindly apply nahi hota.</p><p><strong>Mendel:</strong> “Maine matar ugaaye the, genetics ki poori mystery solve ho gayi!” <strong>Matar:</strong> “Uncle, hum vegetables hain ya exam question bank?” 🤣</p><h4>7. Board exam mini-test 🎯</h4><p><strong>Q:</strong> Tt × Tt mein dwarf ki probability? <strong>Answer:</strong> 1/4 = 25%. <strong>Q:</strong> TT × tt ke F1? <strong>Answer:</strong> Sab Tt (tall). <strong>Q:</strong> Recessive trait F1 mein kahan gaya? <strong>Answer:</strong> Present hai, bas express nahi hota.</p>
    `;
  }

  // 2. ELECTRICITY — SERIES AND PARALLEL
  if (
    matchesDemoPhrase(message, "series and parallel circuits") ||
    matchesDemoPhrase(message, "series vs parallel circuit") ||
    matchesDemoPhrase(message, "explain series circuit") ||
    matchesDemoPhrase(message, "explain parallel circuit") ||
    matchesDemoPhrase(message, "series aur parallel circuit") ||
    matchesDemoPhrase(message, "resistors in series and parallel")
  ) {
    return `
      <h3>⚡ Series vs Parallel Circuits — Current Ki Road Trip!</h3>
      <div class="science-stage"><div class="science-stage-title">⚡ Current ki do road trips <small>Moving dots = charge flow</small></div><div class="science-circuit-label">SERIES: ek hi raasta, same current</div><div class="science-track"><div class="science-node blue">🔋 Battery</div><div class="science-wire"><i></i><i></i></div><div class="science-node amber">R₁</div><div class="science-wire"><i></i><i></i></div><div class="science-node amber">R₂</div></div><p class="science-mini">R₁ toot gaya? Eklauta raasta band → dono off.</p><div class="science-circuit-label">PARALLEL: current do raaston mein split</div><div class="science-track"><div class="science-node blue">🔋</div><div class="science-branches"><div class="science-branch"><div class="science-wire"><i></i></div><div class="science-node green">R₁ 💡</div><div class="science-wire"><i></i></div></div><div class="science-branch"><div class="science-wire"><i></i></div><div class="science-node green">R₂ 💡</div><div class="science-wire"><i></i></div></div></div><div class="science-node blue">↩ Return</div></div><p class="science-lesson">💡 Parallel mein ek branch kharab ho, doosri chal sakti hai. Har branch par same voltage!</p></div>
      <p>Imagine electric current (विद्युत धारा) ek traffic convoy hai. Resistance (प्रतिरोध) road ki rukawat jaisa hai. 🚗😂</p>
      <h4>1. Series Circuit (श्रेणी क्रम संयोजन) 🚗</h4>
      <p>Series mein current ke liye <strong>sirf ek path (मार्ग)</strong> hota hai. Jaise single-lane road!</p>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;text-align:center;margin:12px 0">
        <div><strong>🔋 Battery → [ R1 ] → [ R2 ] → 🔋</strong></div>
        <div style="font-size:0.9em;margin-top:6px">Ek hi loop: dono resistors se same current</div>
      </div>
      <ul>
        <li><strong>Current (धारा):</strong> Sab resistors mein same.</li>
        <li><strong>Voltage (विभवांतर):</strong> Alag resistors ke across divide hota hai.</li>
        <li><strong>Resistance (प्रतिरोध):</strong> Sab add hote hain.</li>
      </ul>
      <div class="math-equation">\\[ R_s = R_1 + R_2 + R_3 \\]</div>
      <p><strong>R1:</strong> "Main rukawat hoon!" <strong>R2:</strong> "Main bhi!" <strong>Battery:</strong> "Bhai, itna traffic jam?!" 😂</p>
      <h4>2. Parallel Circuit (समांतर क्रम संयोजन) 🛣️</h4>
      <p>Parallel mein current ko <strong>multiple paths (कई मार्ग)</strong> milte hain. Jaise ek road se do alag roads nikal rahi hon.</p>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;text-align:center;margin:12px 0;line-height:2">
        <div><strong>🔋 Battery</strong></div>
        <div>↙️ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘️</div>
        <div style="display:flex;gap:8px;justify-content:center"><span style="border:1px solid #60a5fa;border-radius:8px;padding:3px 12px">R1 ⚡</span><span style="border:1px solid #60a5fa;border-radius:8px;padding:3px 12px">R2 ⚡</span></div>
        <div>↘️ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↙️</div>
        <div><strong>🔋 Return path</strong></div>
      </div>
      <ul>
        <li><strong>Voltage (विभवांतर):</strong> Har branch par same.</li>
        <li><strong>Current (धारा):</strong> Branches mein divide hota hai.</li>
        <li><strong>Equivalent resistance (तुल्य प्रतिरोध):</strong> Sabse chhote branch resistance se bhi kam hota hai.</li>
      </ul>
      <div class="math-equation">\\[ \\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} \\]</div>
      <h4>3. Numerical Example 🧮</h4>
      <p>Do resistors 2 Ω aur 3 Ω hain. Series mein:</p>
      <div class="math-equation">\\[ R_s = 2 + 3 = 5\\,\\Omega \\]</div>
      <p>Parallel mein:</p>
      <div class="math-equation">\\[ R_p = \\frac{2\\times3}{2+3} = 1.2\\,\\Omega \\]</div>
      <h4>4. Exam Wala Comparison 🎯</h4>
      <table style="width:100%;border-collapse:collapse;text-align:left">
        <tr><th style="border:1px solid #94a3b8;padding:7px">Series</th><th style="border:1px solid #94a3b8;padding:7px">Parallel</th></tr>
        <tr><td style="border:1px solid #94a3b8;padding:7px">Same current</td><td style="border:1px solid #94a3b8;padding:7px">Same voltage</td></tr>
        <tr><td style="border:1px solid #94a3b8;padding:7px">One path</td><td style="border:1px solid #94a3b8;padding:7px">Multiple paths</td></tr>
        <tr><td style="border:1px solid #94a3b8;padding:7px">One break can stop whole loop</td><td style="border:1px solid #94a3b8;padding:7px">Other branches may still work</td></tr>
      </table>
      <p><strong>Memory trick:</strong> "Series = single road; Parallel = multiple roads!" 🚗⚡</p>
      <h4>5. Circuit ka actual logic, sirf traffic analogy nahi 🧠</h4><p><strong>Series (श्रेणी क्रम):</strong> Current ke paas ek hi closed path hota hai. Isliye I₁ = I₂. Har resistor ke across potential difference (विभवांतर) alag ho sakta hai; total voltage = individual voltage drops ka sum.</p><p><strong>Parallel (समांतर क्रम):</strong> Har branch battery ke same do points se judi hai, isliye V₁ = V₂. Junction par total current branches mein divide hota hai: I = I₁ + I₂.</p><p><strong>Battery:</strong> “Series mein tum sab line laga kar chalo!” <strong>Current:</strong> “Parallel mein shortcut mil gaya, boss!” 😂</p><h4>6. Solved numerical: 2 Ω and 3 Ω 🔢</h4><p><strong>Series:</strong> 2 + 3 = <strong>5 Ω</strong>. Agar battery 10 V hai toh current = 10/5 = <strong>2 A</strong>.</p><p><strong>Parallel:</strong> Reciprocal sum = 1/2 + 1/3 = 5/6, hence equivalent resistance = <strong>6/5 Ω = 1.2 Ω</strong>. Same 10 V battery par total current ≈ <strong>8.33 A</strong>.</p><p>Parallel resistance smallest branch resistance se bhi kam hota hai — extra raasta mil gaya, traffic easy ho gaya! 🛣️</p><h4>7. Exam traps 🎯</h4><ul><li>Series: current same, voltage divide.</li><li>Parallel: voltage same, current divide.</li><li>Home wiring parallel hoti hai, taaki appliances independently kaam kar sakein.</li><li>Bulb fuse hone par series chain break ho sakti hai; parallel ki doosri branch continue kar sakti hai.</li></ul>
    `;
  }

  // 3. CARBON AND ITS COMPOUNDS
  if (
    matchesDemoPhrase(message, "carbon and its compounds") ||
    matchesDemoPhrase(message, "explain carbon bonding") ||
    matchesDemoPhrase(message, "carbon ke compounds") ||
    matchesDemoPhrase(message, "covalent bonding in carbon") ||
    matchesDemoPhrase(message, "tetravalency and catenation")
  ) {
    return `
      <h3>🧪 Carbon and Its Compounds — Carbon Ka Friendship Network!</h3>
      <div class="science-stage"><div class="science-stage-title">🧪 Carbon ka bonding club <small>4 hands = tetravalency</small></div><div class="science-carbon"><div class="science-carbon-top">H</div><div class="science-carbon-middle"><span>H</span><b class="science-carbon-core">C</b><span>H</span></div><div class="science-carbon-top">H</div></div><p class="science-mini">CH₄: carbon 4 covalent bonds banata hai. Har H ek electron share karta hai.</p><div class="science-circuit-label">Catenation: carbon carbon se judkar chain banata hai</div><div class="science-rail"><div class="science-node green science-rise">C</div><span class="science-bond">—</span><div class="science-node green science-rise">C</div><span class="science-bond">—</span><div class="science-node green science-rise">C</div><span class="science-bond">—</span><div class="science-node green science-rise">C</div></div><p class="science-lesson">🔍 Diagram shortcut: single bond = 1 shared pair; double = 2; triple = 3. Carbon ke total bond orders aam taur par 4.</p></div>
      <p>Carbon ko samjho ek aise dost ki tarah jo <strong>4 bonds</strong> bana sakta hai. "Mere paas chaar connection slots hain!" 🤝😂</p>
      <h4>1. Carbon Special Kyun Hai? 🌟</h4>
      <ul>
        <li><strong>Tetravalency (चतुःसंयोजकता):</strong> Carbon ki valency (संयोजकता) 4 hoti hai.</li>
        <li><strong>Catenation (शृंखलन):</strong> Carbon apne hi atoms se long chains, branched chains aur rings bana sakta hai.</li>
        <li><strong>Covalent bond (सहसंयोजक बंध):</strong> Atoms electrons share (साझा) karte hain.</li>
      </ul>
      <h4>2. Methane (मीथेन) — CH4 🧩</h4>
      <p>Ek carbon aur chaar hydrogen atoms milkar methane banate hain. Har line ek shared electron pair (साझा इलेक्ट्रॉन युग्म) ka bond dikhati hai.</p>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;text-align:center;margin:12px 0;line-height:1.6"><div>H</div><div>│</div><div>H — <strong>C</strong> — H</div><div>│</div><div>H</div></div>
      <p><strong>Carbon:</strong> "4 connections complete! Ab koi aur request mat bhejna!" 😂</p>
      <h4>3. Saturated vs Unsaturated 🍃</h4>
      <ul>
        <li><strong>Saturated (संतृप्त):</strong> Carbon-carbon ke beech sirf single bonds, jaise ethane (C2H6).</li>
        <li><strong>Unsaturated (असंतृप्त):</strong> Carbon-carbon double ya triple bond, jaise ethene (C2H4) ya ethyne (C2H2).</li>
      </ul>
      <div style="border:1px solid #64748b;border-radius:12px;padding:10px;margin:10px 0;text-align:center"><strong>Ethane:</strong> C—C &nbsp; | &nbsp; <strong>Ethene:</strong> C=C &nbsp; | &nbsp; <strong>Ethyne:</strong> C≡C</div>
      <h4>4. Homologous Series (समजातीय श्रेणी) 🪜</h4>
      <p>Same functional group (क्रियात्मक समूह) aur similar chemical properties wale compounds ka family group. Consecutive members mein <strong>CH2</strong> ka difference hota hai.</p>
      <p><strong>Alkanes:</strong> Methane CH4 → Ethane C2H6 → Propane C3H8.</p>
      <p><strong>Memory trick:</strong> "Carbon ki 4 bonding seats aur CH2 wali family staircase!" 🪜😎</p>
      <h4>5. Important Reactions 🔥</h4>
      <p><strong>Combustion (दहन):</strong> Oxygen ke saath jalne par carbon dioxide, water aur heat bante hain (complete combustion mein).</p>
      <div class="math-equation">\\[ CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O + \\text{heat} \\]</div>
      <p><strong>Esterification (एस्टरीकरण):</strong> Alcohol aur carboxylic acid react karke ester (एस्टर) aur water banate hain; esters ki smell aksar fruity hoti hai. 🍍</p>
      <h4>6. Board Exam Quick Revision 🎯</h4>
      <p><strong>Carbon = 4 bonds + catenation + covalent bonding.</strong> Saturated = single C–C; unsaturated = double/triple C–C. Homologous members differ by CH2.</p>
      <h4>5. Carbon ka four-hand handshake 🤝</h4><p>Carbon ke outer shell mein <strong>4 valence electrons (संयोजक इलेक्ट्रॉन)</strong> hote hain. Stable arrangement paane ke liye carbon aksar electrons <strong>share (साझा)</strong> karta hai. Isi se <strong>covalent bond (सहसंयोजक बंध)</strong> banta hai.</p><p><strong>Carbon:</strong> “Mere chaar haath hain, sabke saath bonding karunga!” <strong>Hydrogen:</strong> “Bhai, friendship request accept kar lo!” 😂</p><h4>6. Methane, ethane, ethene, ethyne — naam se pehchaano 🧩</h4><ul><li><strong>Methane CH₄:</strong> Ek carbon, four single C–H bonds.</li><li><strong>Ethane C₂H₆:</strong> Do carbon, C–C single bond (संतृप्त).</li><li><strong>Ethene C₂H₄:</strong> C=C double bond (असंतृप्त).</li><li><strong>Ethyne C₂H₂:</strong> C≡C triple bond (असंतृप्त).</li></ul><p><strong>Saturated (संतृप्त)</strong> hydrocarbons mein carbon-carbon single bonds; <strong>unsaturated (असंतृप्त)</strong> mein double/triple bond.</p><h4>7. Functional groups (क्रियात्मक समूह) — naam ki identity card 🪪</h4><p>Alcohol: –OH (jaise ethanol). Carboxylic acid: –COOH (jaise ethanoic acid). Ye groups compound ke chemical properties par strong effect daalte hain.</p><p><strong>Funny memory:</strong> Carbon ka surname chain batata hai, functional group uska profession! 😆</p><h4>8. Board exam check 🎯</h4><p>Why so many carbon compounds? <strong>Tetravalency (चतुःसंयोजकता)</strong> aur <strong>catenation (श्रृंखलन)</strong>. Soap micelles oily dirt ko surround karne mein help karti hain — isi liye washing mein kaam aati hain.</p>
    `;
  }

  // 4. NEPHRON AND URINE FORMATION
  if (
    matchesDemoPhrase(message, "nephron and urine formation") ||
    matchesDemoPhrase(message, "explain nephron") ||
    matchesDemoPhrase(message, "how urine is formed") ||
    matchesDemoPhrase(message, "urine formation in kidney") ||
    matchesDemoPhrase(message, "nephron ka function")
  ) {
    return `
      <h3>🫘 Nephron — Kidney Ki Smart Filtering Factory!</h3>
      <div class="science-stage"><div class="science-stage-title">🫘 Nephron ki filtering factory <small>Follow the filtrate (छना द्रव)</small></div><div class="science-flow"><div class="science-node rose">🩸 Blood<br><small>Glomerulus</small></div><div class="science-down"><i></i></div><div class="science-node blue">① Filtration<br><small>Water + small solutes filtered</small></div><div class="science-down"><i></i></div><div class="science-node green">② Reabsorption<br><small>Useful water, glucose, salts → blood</small></div><div class="science-down"><i></i></div><div class="science-node amber">③ Secretion<br><small>Extra wastes/ions → tubule</small></div><div class="science-down"><i></i></div><div class="science-node rose">🚽 Urine<br><small>Collecting duct → ureter</small></div></div><p class="science-lesson">⚠️ Kidney sab paani waste nahi karti: useful cheezein blood mein wapas bhejti hai!</p></div>
      <p>Socho tumhari body ek city hai, aur kidneys (वृक्क) us city ki <strong>water-cleaning and waste-management factory</strong>! 🏭😂</p>
      <h4>1. Nephron Kya Hai? 🔬</h4>
      <p><strong>Nephron (वृक्काणु)</strong> kidney ki structural and functional unit (संरचनात्मक एवं क्रियात्मक इकाई) hai. Ye blood ko filter karta hai aur urine (मूत्र) banane mein help karta hai.</p>
      <h4>2. Factory Ka Flowchart 🗺️</h4>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;margin:12px 0;text-align:center;line-height:1.9">
        <div style="background:#dbeafe;color:#172554;border-radius:8px;padding:5px"><strong>🩸 Blood → Glomerulus (केशिकागुच्छ)</strong></div>
        <div>⬇️ Filtration (निस्यंदन)</div>
        <div style="background:#e0f2fe;color:#164e63;border-radius:8px;padding:5px"><strong>Bowman's Capsule (बोमैन संपुट)</strong></div>
        <div>⬇️ Useful substances reabsorbed</div>
        <div style="background:#dcfce7;color:#14532d;border-radius:8px;padding:5px"><strong>Renal Tubule (वृक्क नलिका)</strong></div>
        <div>⬇️ Further reabsorption + secretion</div>
        <div style="background:#fef3c7;color:#78350f;border-radius:8px;padding:5px"><strong>Collecting Duct (संग्राहक नलिका) → Urine 💧</strong></div>
      </div>
      <h4>3. Urine Formation Ke 3 Main Steps 🚦</h4>
      <p><strong>Step 1 — Ultrafiltration (अतिसूक्ष्म निस्यंदन):</strong> Glomerulus mein pressure ki wajah se water aur small dissolved substances filter hote hain. Blood cells aur most proteins blood mein rehte hain.</p>
      <p><strong>Security guard:</strong> "RBC aur bade proteins? Aapki entry filtrate mein allowed nahi!" 🛑😂</p>
      <p><strong>Step 2 — Selective Reabsorption (चयनात्मक पुनःअवशोषण):</strong> Useful glucose, ions aur required water blood mein wapas absorb hote hain.</p>
      <p><strong>Kidney:</strong> "Arre glucose bhai, tum waste nahi ho! Wapas blood mein jao!" 😎</p>
      <p><strong>Step 3 — Tubular Secretion (नलिकीय स्राव):</strong> Kuch extra ions aur waste substances blood se tubule mein transfer hote hain, jisse balance maintain hota hai.</p>
      <h4>4. Urine Ka Route 🚰</h4>
      <p><strong>Kidney → Ureter (मूत्रवाहिनी) → Urinary Bladder (मूत्राशय) → Urethra (मूत्रमार्ग).</strong></p>
      <p><strong>Important:</strong> Urine mein mainly water, urea (यूरिया) aur dissolved salts hote hain. Amount hydration aur body ki needs par depend karta hai.</p>
      <h4>5. Board Exam Quick Revision 🎯</h4>
      <p><strong>Nephron = filtration + selective reabsorption + secretion.</strong> Glomerulus filters; tubules useful substances wapas lete hain; collecting duct urine ko aage bhejti hai.</p>
      <p>Kidney ka motto: <strong>"Kaam ki cheez save karo, waste ko bye-bye!"</strong> 😂🫘</p>
      <h4>5. Nephron ka security-check drama 🚨</h4><p><strong>Glomerulus (केशिकागुच्छ):</strong> “Small molecules ka ticket check!” Blood pressure ki wajah se water, salts, glucose aur urea jaise small substances Bowman's capsule mein filter hote hain. Blood cells aur large proteins normally blood mein rehte hain.</p><p><strong>Tubule (नलिका):</strong> “Arre glucose, tum waste nahi ho, wapas blood mein jao!” 😂 Useful glucose, required salts aur water selective reabsorption (चयनात्मक पुनःअवशोषण) se blood mein lautte hain.</p><p><strong>Tubular secretion (नलिकीय स्राव):</strong> Kuch extra ions aur wastes blood se tubule mein add ho sakte hain.</p><h4>6. Complete journey, one step at a time 🧭</h4><p>Renal artery (वृक्क धमनी) → glomerulus → Bowman's capsule → nephron tubule → collecting duct → renal pelvis → ureter → urinary bladder → urethra.</p><p><strong>Important:</strong> Ureter kidney se bladder tak urine le jaata hai; urethra bladder se body ke bahar. Dono ko mix mat karna! 😄</p><h4>7. Kidneys water ko kaise bachati hain? 💧</h4><p>Body ko kitna water chahiye uske hisaab se kidneys reabsorption adjust karti hain. Is process ko hormones, especially ADH, regulate karne mein help karte hain. Isliye urine ka volume aur concentration change ho sakta hai.</p><p><strong>Kidney manager:</strong> “Water ka budget tight hai, jo useful hai return karo!” 😂</p><h4>8. Exam-ready answer 🎯</h4><p>Urine formation ke three main processes: <strong>glomerular filtration (निस्यंदन)</strong>, <strong>selective reabsorption (पुनःअवशोषण)</strong>, and <strong>tubular secretion (स्राव)</strong>.</p>
    `;
  }

  // 5. DOUBLE CIRCULATION OF BLOOD
  if (
    matchesDemoPhrase(message, "double circulation of blood") ||
    matchesDemoPhrase(message, "explain double circulation") ||
    matchesDemoPhrase(message, "double blood circulation") ||
    matchesDemoPhrase(message, "heart blood circulation") ||
    matchesDemoPhrase(message, "double circulation kya hai")
  ) {
    return `
      <h3>❤️ Heart Express — Oxygen Parcel Delivery Service!</h3>
      <div class="science-stage"><div class="science-stage-title">❤️ Heart Express — 2 delivery loops <small>Blue = low oxygen · Red = oxygen-rich</small></div><div class="science-circuit-label">LOOP 1: Pulmonary (फेफड़ों वाला)</div><div class="science-rail science-loop"><div class="science-node blue">💙 Right heart</div><div class="science-wire"><i></i><i></i></div><div class="science-node green">🫁 Lungs<br><small>O₂ pickup</small></div><div class="science-wire"><i></i><i></i></div><div class="science-node rose">❤️ Left heart</div></div><div class="science-circuit-label">LOOP 2: Systemic (पूरे शरीर वाला)</div><div class="science-rail science-loop"><div class="science-node rose">❤️ Left heart</div><div class="science-wire"><i></i><i></i></div><div class="science-node amber">🧍 Body<br><small>O₂ delivery</small></div><div class="science-wire"><i></i><i></i></div><div class="science-node blue">💙 Right heart</div></div><p class="science-lesson">🚚 One complete round mein blood heart se <strong>do baar</strong> guzarta hai. Pulmonary artery low-O₂ aur pulmonary vein high-O₂ blood le jaati hai.</p></div>
      <p>Welcome to <strong>Heart Express Delivery!</strong> 🚚📦 Tumhara heart (हृदय) ek 24×7 pump hai, blood (रक्त) delivery network hai aur RBC (लाल रक्त कोशिका) oxygen parcel le jaane wala carrier hai! 😂</p>
      <h4>1. Double Circulation (द्विगुण परिसंचरण) Kya Hai?</h4>
      <p>Ek complete round mein blood <strong>heart se do baar</strong> guzarta hai: pehle lungs (फेफड़ों) wale circuit mein, phir poori body wale circuit mein.</p>
      <h4>2. Heart Ke 4 Rooms 🏠</h4>
      <ul>
        <li><strong>Right Atrium (दायाँ आलिंद):</strong> Body se oxygen-poor blood receive karta hai.</li>
        <li><strong>Right Ventricle (दायाँ निलय):</strong> Blood lungs tak pump karta hai.</li>
        <li><strong>Left Atrium (बायाँ आलिंद):</strong> Lungs se oxygen-rich blood receive karta hai.</li>
        <li><strong>Left Ventricle (बायाँ निलय):</strong> Blood ko poori body tak pump karta hai.</li>
      </ul>
      <h4>3. Delivery Route — Diagram 🗺️</h4>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;margin:12px 0;text-align:center;line-height:1.85">
        <div style="background:#dbeafe;color:#172554;border-radius:8px;padding:6px"><strong>🧍 Body (oxygen-poor blood)</strong></div>
        <div>⬇️ Vena Cava (महाशिरा)</div>
        <div style="background:#dbeafe;color:#172554;border-radius:8px;padding:6px"><strong>💙 Right Atrium → Right Ventricle</strong></div>
        <div>⬇️ Pulmonary Artery (फुफ्फुसीय धमनी)</div>
        <div style="background:#dcfce7;color:#14532d;border-radius:8px;padding:6px"><strong>🫁 Lungs: Oxygen Pickup! 📦</strong></div>
        <div>⬇️ Pulmonary Veins (फुफ्फुसीय शिराएँ)</div>
        <div style="background:#fee2e2;color:#7f1d1d;border-radius:8px;padding:6px"><strong>❤️ Left Atrium → Left Ventricle</strong></div>
        <div>⬇️ Aorta (महाधमनी)</div>
        <div style="background:#fee2e2;color:#7f1d1d;border-radius:8px;padding:6px"><strong>🧍 Body: Oxygen Delivered! ✅</strong></div>
        <div>🔁 Repeat!</div>
      </div>
      <h4>4. Do Delivery Routes 🚚</h4>
      <p><strong>Pulmonary Circulation (फुफ्फुसीय परिसंचरण):</strong> Right ventricle → lungs → left atrium.</p>
      <p><strong>Systemic Circulation (दैहिक परिसंचरण):</strong> Left ventricle → body → right atrium.</p>
      <p><strong>RBC:</strong> "Lungs se oxygen parcel collect!" 🫁 <strong>Heart:</strong> "Next delivery poori body mein!" ❤️ <strong>Body cells:</strong> "Parcel received, thank you!" 😂📦</p>
      <h4>5. Most Common Exam Trap ⚠️</h4>
      <p><strong>Pulmonary artery</strong> oxygen-poor blood carry karti hai; <strong>pulmonary veins</strong> oxygen-rich blood carry karti hain. Artery/vein ka naam blood ki direction (heart se door ya heart ki taraf) se decide hota hai, oxygen level se nahi.</p>
      <h4>6. Board Exam Quick Revision 🎯</h4>
      <p><strong>Double circulation = pulmonary + systemic circulation.</strong> Isse oxygen-rich aur oxygen-poor blood largely separate rehte hain aur efficient oxygen supply milti hai.</p>
      <p><strong>Memory trick:</strong> "Right heart → lungs; Left heart → body!" ❤️🚚</p>
      <h4>5. Heart Express ki full delivery story 🚚</h4><p><strong>Stop 1:</strong> Body se low-oxygen blood <strong>vena cava (महाशिरा)</strong> ke through right atrium (दायाँ आलिंद) mein aata hai. Right ventricle (दायाँ निलय) ise pulmonary artery (फुफ्फुसीय धमनी) se lungs bhejta hai.</p><p><strong>RBC delivery boy:</strong> “Sir, oxygen parcel khatam ho gaya. Warehouse jaa raha hoon!” 😂</p><p><strong>Stop 2:</strong> Lungs mein gas exchange (गैस विनिमय) hota hai: blood oxygen leta aur carbon dioxide release karta hai. Oxygen-rich blood pulmonary veins (फुफ्फुसीय शिराएँ) se left atrium (बायाँ आलिंद) mein aata hai.</p><p><strong>Stop 3:</strong> Left ventricle (बायाँ निलय) blood ko aorta (महाधमनी) se body mein pump karta hai. Cells oxygen use karti hain, aur blood phir right side laut aata hai.</p><h4>6. Exam ke favourite tricky questions 🧠</h4><p><strong>Q:</strong> Pulmonary artery mein oxygen-rich blood hota hai? <strong>No!</strong> Ye low-oxygen blood lungs le jaati hai. <strong>Q:</strong> Pulmonary vein? <strong>Oxygen-rich blood</strong> heart laati hai.</p><p><strong>Q:</strong> Double circulation ka benefit? <strong>Oxygen-rich aur oxygen-poor blood ka separation</strong> aur efficient oxygen delivery.</p><p><strong>Heart:</strong> “Mere 4 chambers hain, 2 delivery routes hain, phir bhi main break nahi leta!” <strong>RBC:</strong> “Aur overtime ka payment?” 🤣❤️</p><h4>7. One-line recall 🎯</h4><p><strong>Body → Right heart → Lungs → Left heart → Body.</strong> Pulmonary = heart–lungs; systemic = heart–body.</p>
    `;
  }

  // 6. HUMAN EYE AND DEFECTS OF VISION
  if (
    matchesDemoPhrase(message, "human eye and defects of vision") ||
    matchesDemoPhrase(message, "defects of vision") ||
    matchesDemoPhrase(message, "myopia and hypermetropia") ||
    matchesDemoPhrase(message, "explain human eye") ||
    matchesDemoPhrase(message, "eye defects class 10") ||
    matchesDemoPhrase(message, "nazdeek aur door ki nazar")
  ) {
    return `
      <h3>👁️ Human Eye — Body Ka Smart Camera! 📸</h3>
      <div class="science-stage"><div class="science-stage-title">👁️ Retina pe focus kahaan banta hai? <small>Moving focus point dekho</small></div><div class="science-eyes"><div class="science-eye-panel"><b>Normal vision</b><div class="science-eye"><span class="science-ray">➜</span><span class="science-lens">◖◗</span><span class="science-focus on"></span><span class="science-retina"></span></div><small>Focus ON retina ✓</small></div><div class="science-eye-panel"><b>Myopia (निकट दृष्टि)</b><div class="science-eye"><span class="science-ray">➜</span><span class="science-lens">◖◗</span><span class="science-focus before"></span><span class="science-retina"></span></div><small>Focus BEFORE retina → concave lens</small></div><div class="science-eye-panel"><b>Hypermetropia (दूर दृष्टि)</b><div class="science-eye"><span class="science-ray">➜</span><span class="science-lens">◖◗</span><span class="science-focus after"></span><span class="science-retina"></span></div><small>Focus BEHIND retina → convex lens</small></div></div><p class="science-lesson">🎯 Red vertical line = retina; blinking yellow dot = focus. Ye location hi defect samjha deti hai!</p></div>
      <p>Tumhari aankh ek smart camera jaisi hai: lens focus karta hai, retina image receive karti hai, aur brain image ko samajhta hai. Camera ka autofocus kabhi confuse ho jaye toh? Chashma entry maarta hai! 🤓😂</p>
      <h4>1. Eye Ke Main Parts 🔍</h4>
      <ul>
        <li><strong>Cornea (स्वच्छ पटल):</strong> Light ko bend (अपवर्तित) karne mein major role.</li>
        <li><strong>Iris (परितारिका):</strong> Pupil (पुतली) ka size control karti hai.</li>
        <li><strong>Pupil (पुतली):</strong> Light enter hone ka opening.</li>
        <li><strong>Eye Lens (नेत्र लेंस):</strong> Light ko retina par focus karta hai.</li>
        <li><strong>Retina (दृष्टिपटल):</strong> Light-sensitive layer jahan image banti hai.</li>
        <li><strong>Ciliary Muscles (पक्ष्माभी पेशियाँ):</strong> Lens ka shape badal kar focus adjust karti hain.</li>
      </ul>
      <h4>2. Light Ka Route — Diagram ☀️</h4>
      <div style="border:1px solid #64748b;border-radius:12px;padding:12px;text-align:center;line-height:2;margin:12px 0">
        <div><strong>☀️ Object → Cornea → Pupil → Lens → Retina → 🧠 Brain</strong></div>
        <div style="font-size:0.9em">Light retina par real, inverted (उल्टा) image banati hai.</div>
      </div>
      <h4>3. Accommodation (समंजन) Kya Hai? 🎯</h4>
      <p>Eye lens apni focal length (फोकस दूरी) change karta hai taaki near aur far objects dono clear dikhein. Is ability ko <strong>power of accommodation (समंजन क्षमता)</strong> kehte hain.</p>
      <h4>4. Myopia (निकट दृष्टि दोष) — Door Wala Blur 🏫</h4>
      <p>Near objects clear, distant objects blurry. Image retina <strong>ke aage</strong> focus hoti hai.</p>
      <div style="border:1px solid #64748b;border-radius:12px;padding:10px;text-align:center;margin:10px 0"><strong>🌳 Distant object → 👁️ Focus • → | Retina</strong><div style="font-size:0.9em">Focus retina se pehle</div></div>
      <p><strong>Correction (सुधार):</strong> Concave lens (अवतल लेंस).</p>
      <p><strong>Student:</strong> "Board pe likha kya hai? 1080p se 144p kyun ho gaya?" 😂</p>
      <h4>5. Hypermetropia (दूर दृष्टि दोष) — Paas Wala Blur 📖</h4>
      <p>Distant objects relatively clear, nearby objects blurry. Image retina <strong>ke peeche</strong> focus hone ki tendency hoti hai.</p>
      <div style="border:1px solid #64748b;border-radius:12px;padding:10px;text-align:center;margin:10px 0"><strong>📖 Near object → 👁️ | Retina → • Focus</strong><div style="font-size:0.9em">Focus retina ke peeche</div></div>
      <p><strong>Correction (सुधार):</strong> Convex lens (उत्तल लेंस).</p>
      <p><strong>Student:</strong> "Door ka poster dikh raha hai, par paas ki book ka text nahi!" 🤓</p>
      <h4>6. Presbyopia (जरा दूरदृष्टिता) 👓</h4>
      <p>Age badhne par accommodation kam ho sakti hai. Near objects par focus mushkil hota hai; suitable reading ya multifocal lenses use kiye ja sakte hain.</p>
      <h4>7. Lens Power (लेंस की क्षमता) 🧮</h4>
      <div class="math-equation">\\[ P = \\frac{1}{f} \\]</div>
      <p>Yahan <strong>P</strong> dioptre (डायोप्टर) mein aur <strong>f</strong> metre (मीटर) mein hai. Concave lens ki power negative, convex lens ki positive hoti hai.</p>
      <h4>8. Board Exam Quick Revision 🎯</h4>
      <ul>
        <li><strong>Myopia:</strong> Door blur → concave lens.</li>
        <li><strong>Hypermetropia:</strong> Near blur → convex lens.</li>
        <li><strong>Retina:</strong> Image receiving layer.</li>
        <li><strong>Ciliary muscles:</strong> Lens shape change karke focus adjust karti hain.</li>
      </ul>
      <p><strong>Memory trick:</strong> "Myopia = Minus (concave); Hypermetropia = Plus (convex)!" 👁️✨</p>
      <h4>9. Camera vs eye: scene samjho 📸</h4><p><strong>Cornea (स्वच्छ पटल)</strong> light ka major refraction karti hai; <strong>pupil (पुतली)</strong> light ke entry hole ki tarah; <strong>iris (परितारिका)</strong> uska size control karti hai. <strong>Eye lens (नेत्र लेंस)</strong> fine focusing karta hai aur <strong>retina (दृष्टिपटल)</strong> light detect karti hai.</p><p><strong>Brain:</strong> “Image ulta aaya? Processing meri responsibility!” 😂</p><h4>10. Teen cases — focus point follow karo 🎯</h4><p><strong>Normal:</strong> Rays retina par converge (अभिसरित) hoti hain. <strong>Myopia:</strong> Distant object ke rays retina se <strong>pehle</strong> focus ho jaate hain; concave (अवतल) lens incoming rays ko diverge karke correct karta hai.</p><p><strong>Hypermetropia:</strong> Near object ke rays retina ke <strong>peeche</strong> focus hone ki tendency rakhte hain; convex (उत्तल) lens extra convergence dekar focus retina par laata hai.</p><p><strong>Student:</strong> “Board 144p hai!” <strong>Optician:</strong> “Myopia ke liye minus-power lens, ab HD!” 🤓😂</p><h4>11. Numerical: lens power 🔢</h4><p>Focal length f = −0.5 metre for concave lens. Lens power P = 1/f = <strong>−2 dioptre</strong>. Negative sign concave lens ko indicate karta hai.</p><h4>12. Board memory trick 🎯</h4><p><strong>Myopia:</strong> near clear, far blur → concave (minus). <strong>Hypermetropia:</strong> far relatively clear, near blur → convex (plus). <strong>Presbyopia:</strong> age-related loss of accommodation (समंजन).</p>
    `;
  }
  // END MYELIN SIX SCIENCE TOPICS


  // ============================================================
  // 100 GENERAL AI QUESTIONS & ANSWERS
  // ============================================================

  // Greeting — match complete words only
  if (/^(hello|hi|hey)( there)?$/.test(message)) {
    skipThinkingForCurrentResponse = true;
    return `
      <p>Hello! 👋</p>
      <p>I'm Myelin AI, your personal study assistant. What would you like to learn today?</p>
    `;
  }

  // 2. How are you?
  if (matchesDemoPhrase(message, "how are you") || matchesDemoPhrase(message, "how r u")) {
    skipThinkingForCurrentResponse = true;
    return `<p>I'm doing well and ready to help. What would you like to know?</p>`;
  }

  // 3. Who are you?
  if (matchesDemoPhrase(message, "who are you") || matchesDemoPhrase(message, "what are you")) {
    skipThinkingForCurrentResponse = true;
    return `<p>My name is <strong>Myelin AI</strong>. I am an <strong>AI assistant</strong> designed to answer questions, explain concepts, help with learning, and assist with a variety of tasks.</p>`;
  }

  // 4. What can you do?
  if (
    matchesDemoPhrase(message, "what can you do") ||
    matchesDemoPhrase(message, "what do you do") ||
    matchesDemoPhrase(message, "your capabilities")
  ) {
    skipThinkingForCurrentResponse = true;
    return `
    <p>I can help with:</p>
    <ul>
      <li>Academic questions</li>
      <li>Programming and coding</li>
      <li>Mathematics and science</li>
      <li>Writing and summarization</li>
      <li>Study planning</li>
      <li>General knowledge</li>
      <li>Problem solving</li>
    </ul>
  `;
  }

  // 5. Are you AI?
  if (matchesDemoPhrase(message, "are you ai") || matchesDemoPhrase(message, "are you an ai")) {
    skipThinkingForCurrentResponse = true;
    return `<p>Yes. I am an <strong>Artificial Intelligence (AI)</strong> assistant.</p>`;
  }

  // 6. What is AI?
  if (
    matchesDemoPhrase(message, "what is ai") ||
    matchesDemoPhrase(message, "what is artificial intelligence")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Artificial Intelligence (AI)</strong> is technology that enables computers to perform tasks that normally require human intelligence, such as understanding language, recognizing patterns, reasoning, and learning from data.</p>`;
  }

  // 7. What is machine learning?
  if (
    matchesDemoPhrase(message, "what is machine learning") ||
    matchesDemoPhrase(message, "what is ml")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Machine Learning (ML)</strong> is a branch of AI in which computers learn patterns from data and use those patterns to make predictions or decisions.</p>`;
  }

  // 8. What is deep learning?
  if (matchesDemoPhrase(message, "what is deep learning")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Deep Learning</strong> is a type of machine learning that uses multi-layered neural networks to learn complex patterns from large amounts of data.</p>`;
  }

  // 9. What is ChatGPT?
  if (
    matchesDemoPhrase(message, "what is chatgpt") ||
    matchesDemoPhrase(message, "what does chatgpt do")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>ChatGPT</strong> is an AI assistant developed by OpenAI that can understand and generate natural-language responses.</p>`;
  }

  // 10. Can you help me?
  if (matchesDemoPhrase(message, "can you help me") || matchesDemoPhrase(message, "help me")) {
    skipThinkingForCurrentResponse = true;
    return `<p>Yes. Tell me the problem or task, and I'll help you work through it.</p>`;
  }

  // 11. Thank you
  if (matchesDemoPhrase(message, "thank you") || matchesDemoPhrase(message, "thanks")) {
    skipThinkingForCurrentResponse = true;
    return `<p>You're welcome! 👍</p>`;
  }

  // 12. Bye
  if (
    message === "bye" ||
    matchesDemoPhrase(message, "goodbye") ||
    matchesDemoPhrase(message, "good bye") ||
    matchesDemoPhrase(message, "see you")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Goodbye! 👋 Good luck with your work.</p>`;
  }

  // 13. Good morning
  if (matchesDemoPhrase(message, "good morning")) {
    skipThinkingForCurrentResponse = true;
    return `<p>Good morning! ☀️ What are you working on today?</p>`;
  }

  // 14. Good afternoon
  if (matchesDemoPhrase(message, "good afternoon")) {
    skipThinkingForCurrentResponse = true;
    return `<p>Good afternoon! How can I help you?</p>`;
  }

  // 15. Good evening
  if (matchesDemoPhrase(message, "good evening")) {
    skipThinkingForCurrentResponse = true;
    return `<p>Good evening! How can I help you?</p>`;
  }

  // 16. What is programming?
  if (
    matchesDemoPhrase(message, "what is programming") ||
    matchesDemoPhrase(message, "what is coding")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Programming</strong> is the process of writing instructions that a computer can execute to solve problems or perform tasks.</p>`;
  }

  // 17. What is a programming language?
  if (matchesDemoPhrase(message, "what is a programming language")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>programming language</strong> is a formal language used to write instructions for computers, such as Python, C++, Java, and JavaScript.</p>`;
  }

  // 18. What is Python?
  if (matchesDemoPhrase(message, "what is python")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Python</strong> is a high-level programming language known for its readable syntax and wide use in web development, automation, data science, AI, and machine learning.</p>`;
  }

  // 19. What is C++?
  if (matchesDemoPhrase(message, "what is c++") || matchesDemoPhrase(message, "what is cpp")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>C++</strong> is a powerful general-purpose programming language commonly used for systems programming, competitive programming, game development, and performance-intensive applications.</p>`;
  }

  // 20. What is JavaScript?
  if (
    matchesDemoPhrase(message, "what is javascript") ||
    matchesDemoPhrase(message, "what is js")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>JavaScript</strong> is a programming language widely used to make websites and web applications interactive and dynamic.</p>`;
  }

  // 21. What is HTML?
  if (matchesDemoPhrase(message, "what is html")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>HTML</strong> stands for HyperText Markup Language. It defines the structure and content of web pages.</p>`;
  }

  // 22. What is CSS?
  if (matchesDemoPhrase(message, "what is css")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>CSS</strong> stands for Cascading Style Sheets. It controls the appearance, layout, colors, typography, and animations of web pages.</p>`;
  }

  // 23. What is SQL?
  if (matchesDemoPhrase(message, "what is sql")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>SQL</strong> stands for Structured Query Language. It is used to store, retrieve, manipulate, and manage data in relational databases.</p>`;
  }

  // 24. What is a database?
  if (matchesDemoPhrase(message, "what is a database")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>database</strong> is an organized collection of data that can be stored, accessed, updated, and managed efficiently.</p>`;
  }

  // 25. What is an algorithm?
  if (matchesDemoPhrase(message, "what is an algorithm")) {
    skipThinkingForCurrentResponse = true;
    return `<p>An <strong>algorithm</strong> is a step-by-step procedure for solving a problem or completing a computational task.</p>`;
  }

  // 26. What is data structure?
  if (
    matchesDemoPhrase(message, "what is data structure") ||
    matchesDemoPhrase(message, "what are data structures")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>data structure</strong> is a way of organizing and storing data so it can be accessed and modified efficiently. Examples include arrays, stacks, queues, trees, and graphs.</p>`;
  }

  // 27. What is DSA?
  if (matchesDemoPhrase(message, "what is dsa")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>DSA</strong> stands for Data Structures and Algorithms. It focuses on organizing data efficiently and designing effective methods for solving problems.</p>`;
  }

  // 28. What is frontend?
  if (
    matchesDemoPhrase(message, "what is frontend") ||
    matchesDemoPhrase(message, "what is front end")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Frontend development</strong> focuses on the part of a website or application that users see and interact with.</p>`;
  }

  // 29. What is backend?
  if (
    matchesDemoPhrase(message, "what is backend") ||
    matchesDemoPhrase(message, "what is back end")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Backend development</strong> handles server-side logic, databases, authentication, APIs, and other processes behind an application.</p>`;
  }

  // 30. What is full stack?
  if (
    matchesDemoPhrase(message, "what is full stack") ||
    matchesDemoPhrase(message, "what is fullstack")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Full-stack development</strong> involves working on both the frontend and backend of an application.</p>`;
  }

  // 31. What is a website?
  if (matchesDemoPhrase(message, "what is a website")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>website</strong> is a collection of web pages and resources that users can access through the internet using a web browser.</p>`;
  }

  // 32. What is an app?
  if (
    matchesDemoPhrase(message, "what is an app") ||
    matchesDemoPhrase(message, "what is an application")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>An <strong>application</strong> is software designed to perform specific tasks for users, such as messaging, studying, banking, or entertainment.</p>`;
  }

  // 33. What is the internet?
  if (
    matchesDemoPhrase(message, "what is the internet") ||
    matchesDemoPhrase(message, "what is internet")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>The <strong>Internet</strong> is a global network of interconnected computers and devices that communicate using standardized protocols.</p>`;
  }

  // 34. What is a browser?
  if (
    matchesDemoPhrase(message, "what is a browser") ||
    matchesDemoPhrase(message, "what is web browser")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>web browser</strong> is software used to access and interact with websites, such as Chrome, Safari, Firefox, and Edge.</p>`;
  }

  // 35. What is an API?
  if (matchesDemoPhrase(message, "what is an api") || matchesDemoPhrase(message, "what are apis")) {
    skipThinkingForCurrentResponse = true;
    return `<p>An <strong>API (Application Programming Interface)</strong> allows different software systems to communicate with each other.</p>`;
  }

  // 36. What is cloud computing?
  if (
    matchesDemoPhrase(message, "what is cloud computing") ||
    matchesDemoPhrase(message, "what is cloud")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Cloud computing</strong> provides computing resources such as servers, storage, databases, and software over the internet.</p>`;
  }

  // 37. What is Git?
  if (matchesDemoPhrase(message, "what is git")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Git</strong> is a distributed version-control system used to track changes in source code and collaborate with other developers.</p>`;
  }

  // 38. What is GitHub?
  if (matchesDemoPhrase(message, "what is github")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>GitHub</strong> is a platform for hosting Git repositories and collaborating on software projects.</p>`;
  }

  // 39. What is cybersecurity?
  if (
    matchesDemoPhrase(message, "what is cybersecurity") ||
    matchesDemoPhrase(message, "what is cyber security")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Cybersecurity</strong> is the practice of protecting computers, networks, applications, and data from unauthorized access and attacks.</p>`;
  }

  // 40. What is software?
  if (matchesDemoPhrase(message, "what is software")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Software</strong> is a collection of programs and related data that tells a computer or device what to do.</p>`;
  }

  // 41. What is hardware?
  if (matchesDemoPhrase(message, "what is hardware")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Hardware</strong> refers to the physical components of a computer or electronic device, such as the CPU, RAM, storage, and display.</p>`;
  }

  // 42. What is RAM?
  if (matchesDemoPhrase(message, "what is ram")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>RAM (Random Access Memory)</strong> is temporary, high-speed memory used by a computer to store data and programs currently in use.</p>`;
  }

  // 43. What is CPU?
  if (matchesDemoPhrase(message, "what is cpu") || matchesDemoPhrase(message, "what does cpu do")) {
    skipThinkingForCurrentResponse = true;
    return `<p>The <strong>CPU (Central Processing Unit)</strong> executes instructions and performs calculations required by computer programs.</p>`;
  }

  // 44. What is GPU?
  if (matchesDemoPhrase(message, "what is gpu") || matchesDemoPhrase(message, "what does gpu do")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>GPU (Graphics Processing Unit)</strong> is specialized hardware designed to perform many calculations in parallel, especially useful for graphics and AI workloads.</p>`;
  }

  // 45. What is an operating system?
  if (
    matchesDemoPhrase(message, "what is an operating system") ||
    matchesDemoPhrase(message, "what is os")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>An <strong>operating system</strong> manages computer hardware and provides services that allow applications to run. Examples include Windows, macOS, Linux, Android, and iOS.</p>`;
  }

  // 46. What is mathematics?
  if (
    matchesDemoPhrase(message, "what is mathematics") ||
    matchesDemoPhrase(message, "what is math")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Mathematics</strong> is the study of numbers, quantities, structures, patterns, relationships, and logical reasoning.</p>`;
  }

  // 47. What is percentage?
  if (matchesDemoPhrase(message, "what is percentage")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>percentage</strong> expresses a number as a fraction of 100. For example, 25% means 25 out of 100.</p>`;
  }

  // 48. What is probability?
  if (matchesDemoPhrase(message, "what is probability")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Probability</strong> measures how likely an event is to occur, usually from 0 (impossible) to 1 (certain).</p>`;
  }

  // 49. What is statistics?
  if (matchesDemoPhrase(message, "what is statistics")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Statistics</strong> is the field of collecting, analyzing, interpreting, and presenting data.</p>`;
  }

  // 50. What is calculus?
  if (matchesDemoPhrase(message, "what is calculus")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Calculus</strong> is a branch of mathematics focused mainly on change and accumulation, using concepts such as derivatives and integrals.</p>`;
  }

  // 51. What is physics?
  if (matchesDemoPhrase(message, "what is physics")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Physics</strong> is the study of matter, energy, motion, forces, space, and the fundamental laws governing the physical world.</p>`;
  }

  // 52. What is chemistry?
  if (matchesDemoPhrase(message, "what is chemistry")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Chemistry</strong> is the study of matter, its properties, composition, structure, and the reactions it undergoes.</p>`;
  }

  // 53. What is biology?
  if (matchesDemoPhrase(message, "what is biology")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Biology</strong> is the scientific study of living organisms and their structures, functions, evolution, and interactions.</p>`;
  }

  // 54. What is gravity?
  if (matchesDemoPhrase(message, "what is gravity")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Gravity</strong> is the attractive interaction between objects with mass. Near Earth's surface, it causes objects to accelerate toward Earth.</p>`;
  }

  // 55. What is photosynthesis?
  if (matchesDemoPhrase(message, "what is photosynthesis")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Photosynthesis</strong> is the process by which plants and certain other organisms use light energy to convert carbon dioxide and water into chemical energy, releasing oxygen as a byproduct.</p>`;
  }

  // 56. Why is the sky blue?
  if (
    matchesDemoPhrase(message, "why is the sky blue") ||
    matchesDemoPhrase(message, "why sky is blue")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>The sky appears blue mainly because Earth's atmosphere scatters shorter wavelengths of visible light, such as blue, more strongly than longer wavelengths such as red.</p>`;
  }

  // 57. What is the solar system?
  if (matchesDemoPhrase(message, "what is the solar system")) {
    skipThinkingForCurrentResponse = true;
    return `<p>The <strong>Solar System</strong> consists of the Sun and the objects gravitationally bound to it, including planets, moons, asteroids, and comets.</p>`;
  }

  // 58. How many planets are there?
  if (matchesDemoPhrase(message, "how many planets")) {
    skipThinkingForCurrentResponse = true;
    return `<p>There are <strong>8 recognized planets</strong> in our Solar System.</p>`;
  }

  // 59. What is the largest planet?
  if (
    matchesDemoPhrase(message, "largest planet") ||
    matchesDemoPhrase(message, "biggest planet")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Jupiter</strong> is the largest planet in our Solar System.</p>`;
  }

  // 60. What is the smallest planet?
  if (matchesDemoPhrase(message, "smallest planet")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Mercury</strong> is the smallest planet in our Solar System.</p>`;
  }

  // 61. How can I study better?
  if (
    matchesDemoPhrase(message, "how can i study better") ||
    matchesDemoPhrase(message, "how to study better") ||
    matchesDemoPhrase(message, "study better")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Use active recall, spaced repetition, practice questions, and regular revision. Reading the same material repeatedly is usually less effective than actively testing yourself.</p>`;
  }

  // 62. How can I concentrate?
  if (
    matchesDemoPhrase(message, "how can i concentrate") ||
    matchesDemoPhrase(message, "how to concentrate") ||
    matchesDemoPhrase(message, "improve concentration")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Remove distractions, work in focused blocks, keep your phone away, define one task at a time, and take short planned breaks.</p>`;
  }

  // 63. How can I stop procrastinating?
  if (
    matchesDemoPhrase(message, "stop procrastinating") ||
    matchesDemoPhrase(message, "how to stop procrastination") ||
    matchesDemoPhrase(message, "how can i stop procrastinating")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Make the task smaller, define the first action, set a short deadline, and start before you feel motivated. Waiting for motivation is a common cause of procrastination.</p>`;
  }

  // 64. How can I manage my time?
  if (
    matchesDemoPhrase(message, "time management") ||
    matchesDemoPhrase(message, "manage my time") ||
    matchesDemoPhrase(message, "how to manage time")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Prioritize important tasks, estimate how long they require, schedule them, and avoid filling your entire day with low-value activities.</p>`;
  }

  // 65. How do I make a study timetable?
  if (
    matchesDemoPhrase(message, "study timetable") ||
    matchesDemoPhrase(message, "study schedule") ||
    matchesDemoPhrase(message, "make a timetable")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>List your subjects, assign realistic study blocks, include revision and practice time, and leave some buffer for unexpected work.</p>`;
  }

  // 66. How many hours should I study?
  if (
    matchesDemoPhrase(message, "how many hours should i study") ||
    matchesDemoPhrase(message, "how many hours to study")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>There is no universal number. Focus on <strong>effective study hours</strong> rather than sitting with books for a fixed number of hours. Consistency and quality matter more than a large clocked number.</p>`;
  }

  // 67. How can I remember things?
  if (
    matchesDemoPhrase(message, "how can i remember") ||
    matchesDemoPhrase(message, "how to remember") ||
    matchesDemoPhrase(message, "improve memory")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Use active recall, spaced repetition, practice problems, explanations in your own words, and adequate sleep.</p>`;
  }

  // 68. How should I prepare for exams?
  if (
    matchesDemoPhrase(message, "how to prepare for exam") ||
    matchesDemoPhrase(message, "exam preparation") ||
    matchesDemoPhrase(message, "prepare for exams")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Understand the syllabus, identify weak topics, revise systematically, solve previous questions, take timed tests, and analyze your mistakes.</p>`;
  }

  // 69. What is active recall?
  if (matchesDemoPhrase(message, "what is active recall")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Active recall</strong> is a learning technique where you try to retrieve information from memory instead of simply rereading it.</p>`;
  }

  // 70. What is spaced repetition?
  if (matchesDemoPhrase(message, "what is spaced repetition")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Spaced repetition</strong> involves reviewing information at increasing intervals to improve long-term retention.</p>`;
  }

  // 71. How do I learn programming?
  if (
    matchesDemoPhrase(message, "how to learn programming") ||
    matchesDemoPhrase(message, "how do i learn programming")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Choose one language, learn the fundamentals, solve small problems, build projects, read documentation, debug your own code, and gradually work on larger projects.</p>`;
  }

  // 72. Which programming language should I learn?
  if (
    matchesDemoPhrase(message, "which programming language") ||
    matchesDemoPhrase(message, "best programming language to learn")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>It depends on your goal. <strong>Python</strong> is useful for AI, data science, and automation; <strong>JavaScript</strong> is important for web development; and <strong>C++</strong> is widely used for performance-oriented programming and competitive programming.</p>`;
  }

  // 73. How do I learn Python?
  if (
    matchesDemoPhrase(message, "how to learn python") ||
    matchesDemoPhrase(message, "how do i learn python")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Start with syntax and core concepts, then practice functions, data structures, modules, file handling, exceptions, and object-oriented programming before building projects.</p>`;
  }

  // 74. How do I learn web development?
  if (
    matchesDemoPhrase(message, "how to learn web development") ||
    matchesDemoPhrase(message, "learn web development")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>A practical progression is <strong>HTML → CSS → JavaScript → Git → frontend framework → backend → databases → APIs → deployment</strong>. Build projects throughout the process.</p>`;
  }

  // 75. How do I become a software engineer?
  if (
    matchesDemoPhrase(message, "how to become a software engineer") ||
    matchesDemoPhrase(message, "become a software engineer")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Build strong programming fundamentals, learn data structures and algorithms, understand software development, build real projects, use Git, practice problem solving, and gain experience through internships or real-world work.</p>`;
  }

  // 76. How do I get a job in tech?
  if (
    matchesDemoPhrase(message, "how to get a tech job") ||
    matchesDemoPhrase(message, "how to get a job in tech")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Develop relevant skills, build demonstrable projects, maintain a strong resume and portfolio, practice interviews, apply consistently, and gain experience through internships, freelancing, or open-source work.</p>`;
  }

  // 77. What is a resume?
  if (matchesDemoPhrase(message, "what is a resume") || matchesDemoPhrase(message, "what is cv")) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>resume</strong> is a concise document presenting your education, skills, experience, projects, and achievements for a job or internship.</p>`;
  }

  // 78. What is an internship?
  if (
    matchesDemoPhrase(message, "what is an internship") ||
    matchesDemoPhrase(message, "what is internship")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>An <strong>internship</strong> is a temporary work experience designed to help someone gain practical skills and exposure to a professional environment.</p>`;
  }

  // 79. What is freelancing?
  if (
    matchesDemoPhrase(message, "what is freelancing") ||
    matchesDemoPhrase(message, "what is freelance")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Freelancing</strong> means providing services independently to clients rather than working as a permanent employee of one organization.</p>`;
  }

  // 80. What is entrepreneurship?
  if (matchesDemoPhrase(message, "what is entrepreneurship")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Entrepreneurship</strong> involves identifying an opportunity or problem and building an organization or product around it, usually while taking financial and operational risks.</p>`;
  }

  // 81. How can I make money online?
  if (
    matchesDemoPhrase(message, "how can i make money online") ||
    matchesDemoPhrase(message, "how to make money online")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Legitimate options include freelancing, remote employment, creating useful digital products, content creation, tutoring, and building online businesses. Avoid schemes promising easy money with little effort.</p>`;
  }

  // 82. What is cryptocurrency?
  if (
    matchesDemoPhrase(message, "what is cryptocurrency") ||
    matchesDemoPhrase(message, "what is crypto")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Cryptocurrency</strong> is a type of digital asset that commonly uses cryptographic techniques and distributed ledger technology to record transactions.</p>`;
  }

  // 83. What is blockchain?
  if (matchesDemoPhrase(message, "what is blockchain")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Blockchain</strong> is a type of distributed ledger that records data in linked blocks, making the history difficult to alter without detection.</p>`;
  }

  // 84. What is money?
  if (message === "what is money" || matchesDemoPhrase(message, "what is money")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Money</strong> is a medium of exchange, a unit for measuring value, and a store of value used to facilitate economic transactions.</p>`;
  }

  // 85. What is inflation?
  if (matchesDemoPhrase(message, "what is inflation")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Inflation</strong> is a sustained increase in the general price level of goods and services, which reduces the purchasing power of money over time.</p>`;
  }

  // 86. What is a bank?
  if (
    matchesDemoPhrase(message, "what is a bank") ||
    matchesDemoPhrase(message, "what does a bank do")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>A <strong>bank</strong> is a financial institution that provides services such as deposits, payments, lending, and other financial products.</p>`;
  }

  // 87. What is health?
  if (matchesDemoPhrase(message, "what is health")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Health</strong> generally refers to a person's physical, mental, and social well-being. Maintaining good health involves factors such as nutrition, physical activity, sleep, and appropriate medical care.</p>`;
  }

  // 88. Why is sleep important?
  if (
    matchesDemoPhrase(message, "why is sleep important") ||
    matchesDemoPhrase(message, "importance of sleep")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Sleep supports memory, learning, physical recovery, immune function, mood regulation, and many other biological processes.</p>`;
  }

  // 89. Why is exercise important?
  if (
    matchesDemoPhrase(message, "why is exercise important") ||
    matchesDemoPhrase(message, "importance of exercise")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Regular physical activity supports cardiovascular health, strength, mobility, metabolic health, and overall well-being.</p>`;
  }

  // 90. What is a healthy diet?
  if (
    matchesDemoPhrase(message, "what is a healthy diet") ||
    matchesDemoPhrase(message, "healthy diet")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>A balanced diet generally includes appropriate amounts of vegetables, fruits, whole grains, protein sources, healthy fats, and adequate fluids, while limiting excessive added sugar, salt, and highly processed foods.</p>`;
  }

  // 91. What is motivation?
  if (matchesDemoPhrase(message, "what is motivation")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Motivation</strong> is the set of factors that influence a person's willingness to start and continue an activity or pursue a goal.</p>`;
  }

  // 92. How can I stay motivated?
  if (
    matchesDemoPhrase(message, "how can i stay motivated") ||
    matchesDemoPhrase(message, "how to stay motivated")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Don't depend entirely on motivation. Set clear goals, build routines, track progress, reduce friction, and continue working even when motivation is low.</p>`;
  }

  // 93. How do I set goals?
  if (
    matchesDemoPhrase(message, "how to set goals") ||
    matchesDemoPhrase(message, "how do i set goals")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Define a specific outcome, establish a measurable target, set a deadline, break it into smaller actions, and review your progress regularly.</p>`;
  }

  // 94. What is discipline?
  if (matchesDemoPhrase(message, "what is discipline")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Discipline</strong> is the ability to consistently take appropriate actions even when you do not feel motivated to do them.</p>`;
  }

  // 95. How can I become more disciplined?
  if (
    matchesDemoPhrase(message, "how to become disciplined") ||
    matchesDemoPhrase(message, "how can i become disciplined")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Start with small commitments, create routines, remove unnecessary distractions, track your behavior, and gradually increase the difficulty of your commitments.</p>`;
  }

  // 96. What is success?
  if (matchesDemoPhrase(message, "what is success")) {
    skipThinkingForCurrentResponse = true;
    return `<p><strong>Success</strong> does not have one universal definition. It generally means achieving goals or outcomes that are meaningful to the individual while meeting their chosen priorities and values.</p>`;
  }

  // 97. How can I improve myself?
  if (
    matchesDemoPhrase(message, "how can i improve myself") ||
    matchesDemoPhrase(message, "how to improve myself") ||
    matchesDemoPhrase(message, "self improvement")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Identify specific weaknesses, choose measurable improvements, practice consistently, seek feedback, and review your progress instead of relying on vague motivation.</p>`;
  }

  // 98. What should I do when I fail?
  if (
    matchesDemoPhrase(message, "what should i do when i fail") ||
    matchesDemoPhrase(message, "how to deal with failure") ||
    matchesDemoPhrase(message, "i failed")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Analyze what actually went wrong, separate controllable factors from uncontrollable ones, make a correction plan, and try again. Failure is useful only if you extract information from it.</p>`;
  }

  // 99. Can AI make mistakes?
  if (
    matchesDemoPhrase(message, "can ai make mistakes") ||
    matchesDemoPhrase(message, "can you make mistakes") ||
    matchesDemoPhrase(message, "do you make mistakes")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Yes. AI systems can produce incorrect, incomplete, or misleading information. Important facts should be verified using reliable sources, especially for high-stakes decisions.</p>`;
  }

  // 100. Can you explain something?
  if (
    message === "can you explain" ||
    message === "explain this" ||
    matchesDemoPhrase(message, "explain something")
  ) {
    skipThinkingForCurrentResponse = true;
    return `<p>Yes. Send me the topic, question, text, or concept, and I can explain it step by step at a level appropriate for you.</p>`;
  }

  if (
    message.length < 25 &&
    (matchesDemoPhrase(message, "math") ||
      matchesDemoPhrase(message, "mathematics") ||
      matchesDemoPhrase(message, "algebra") ||
      matchesDemoPhrase(message, "calculus"))
  ) {
    skipThinkingForCurrentResponse = true;
    return `
            <p>Let's solve this Maths concept step by step.</p>
            <p>First, identify the given values, then select the correct formula and simplify the expression.</p>
            <p>Share the exact question for a complete solution.</p>
        `;
  }

  if (
    message.length < 25 &&
    (matchesDemoPhrase(message, "python") ||
      matchesDemoPhrase(message, "coding") ||
      matchesDemoPhrase(message, "programming") ||
      matchesDemoPhrase(message, "javascript"))
  ) {
    skipThinkingForCurrentResponse = true;
    return `
            <p>I can explain this programming topic in a beginner-friendly way.</p>
            <p>We can divide it into:</p>
            <ol>
              <li>Concept</li>
              <li>Syntax</li>
              <li>Example</li>
              <li>Practice problem</li>
            </ol>
        `;
  }

  if (
    matchesDemoPhrase(message, "where is brilliant") ||
    matchesDemoPhrase(message, "where brilliant coaching center") ||
    matchesDemoPhrase(message, "brilliant coaching where") ||
    matchesDemoPhrase(message, "where is bcc")
  ) {
    skipThinkingForCurrentResponse = true;
    return `
              <p>Brilliant Coaching Center is a popular coaching center located at Kairi Birpur in Kishanganj district.</p> `;
  }

  if (
    matchesDemoPhrase(message, "bcc director") ||
    matchesDemoPhrase(message, "brilliant director")
  ) {
    skipThinkingForCurrentResponse = true;
    return `
              <p>The director of Brilliant Coaching Center is Mr. Rehan Quasmi.</p> `;
  }

  if (
    matchesDemoPhrase(message, "bcc principal") ||
    matchesDemoPhrase(message, "brilliant principal")
  ) {
    skipThinkingForCurrentResponse = true;
    return `
              <p>The principal of Brilliant Coaching Center is Mr. Zaki Quasmi, who completed his MBA degree from Pondicherry University.</p> `;
  }

  if (
    message.length < 25 &&
    (matchesDemoPhrase(message, "physics") ||
      matchesDemoPhrase(message, "force") ||
      matchesDemoPhrase(message, "motion"))
  ) {
    skipThinkingForCurrentResponse = true;
    return `
            <p>Let's understand the Physics concept using the basic idea, formula, units, and one example.</p>
            <p>Please mention the exact chapter or question.</p>
        `;
  }

  if (
    message.length < 25 &&
    (matchesDemoPhrase(message, "chemistry") || matchesDemoPhrase(message, "chemical"))
  ) {
    skipThinkingForCurrentResponse = true;
    return `
            <p>I can help you revise Chemistry through definitions, reactions, examples, and quick memory techniques.</p>
            <p>Tell me the chapter name.</p>
        `;
  }

  // Greeting — match complete words only
  if (/^(hello|hi|hey)( there)?$/.test(message)) {
    return `
      <p>Hello! 👋</p>
      <p>I'm <strong>Myelin AI</strong>, your personal study assistant. What would you like to learn today?</p>
    `;
  }

  if (
    matchesDemoPhrase(message, "rehan sir") ||
    matchesDemoPhrase(message, "who is rehan sir") ||
    matchesDemoPhrase(message, "rehan quasmi") ||
    matchesDemoPhrase(message, "mr rehan quasmi") ||
    matchesDemoPhrase(message, "about rehan sir") ||
    matchesDemoPhrase(message, "tell me about rehan sir") ||
    matchesDemoPhrase(message, "tell me about rehan")
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> is an accomplished educator and academic visionary
      originating from <strong>Kairi Birpur, Kishanganj.</strong>
    </p>

    <h2>Professional Background</h2>

    <ul>
      <li>
        <strong>Founder of Brilliant Coaching Center:</strong>
        He is the foundational visionary behind
        <strong>Brilliant Coaching Center</strong> in Kairi Birpur,
        establishing the institute to elevate educational standards in his hometown.
      </li>

      <li>
        <strong>Government Educator:</strong>
        He transitioned from private coaching administration after successfully securing
        a position as a <strong>Government Teacher</strong>, where he now serves the
        public education system.
      </li>

      <li>
        <strong>Legacy & Leadership:</strong>
        After moving into his government role, he handed over the operational management
        and principalship of <strong>Brilliant Coaching Center</strong> to his younger
        brother, <strong>Zaki Quasmi Alig.</strong>
      </li>
    </ul>

    <p>
      Would you like me to give more details about
      <strong>Mr. Rehan Quasmi's educational details</strong>
      (such as his college or degree), or anything else?
    </p>
  `;
  }

  // ============================================================
  // ZAKI QUASMI ALIG
  // ============================================================

  if (
    matchesDemoPhrase(message, "zaki sir") ||
    matchesDemoPhrase(message, "who is zaki sir") ||
    matchesDemoPhrase(message, "who is zaki") ||
    matchesDemoPhrase(message, "zaki quasmi") ||
    matchesDemoPhrase(message, "zaki quasmi alig") ||
    matchesDemoPhrase(message, "about zaki sir") ||
    matchesDemoPhrase(message, "tell me about zaki sir") ||
    matchesDemoPhrase(message, "tell me about zaki") ||
    matchesDemoPhrase(message, "zaki alig")
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> is a dedicated professional educator and
      academic consultant originating from <strong>Kairi Birpur, Kishanganj.</strong>
    </p>

    <h2>Academic Background</h2>

    <ul>
      <li>
        <strong>Aligarh Muslim University (AMU):</strong>
        Completed his foundational higher education, earning him the prestigious
        title of 'Alig'.
      </li>

      <li>
        <strong>Pondicherry University:</strong>
        Graduated with a <strong>Master of Business Administration (MBA)</strong>,
        equipping him with strong management and leadership skills.
      </li>
    </ul>

    <h2>Professional Experience</h2>

    <ul>
      <li>
        <strong>Coaching Administration:</strong>
        He currently serves as the <strong>Principal</strong> and operational head
        of <strong>Brilliant Coaching Center</strong> in Kairi Birpur.
        He took over the management of the institute from his elder brother,
        the original founder, who transitioned into a government teaching role.
      </li>

      <li>
        <strong>Global Online Tutoring:</strong>
        He provides academic support and mentorship to international students
        as a verified tutor on global ed-tech platforms, including
        <strong>Chegg</strong> and <strong>Course Hero.</strong>
      </li>
    </ul>
  `;
  }

  // ZAKI SIR - EDUCATION
  if (
    matchesDemoPhrase(message, "zaki") &&
    (matchesDemoPhrase(message, "education") ||
      matchesDemoPhrase(message, "qualification") ||
      matchesDemoPhrase(message, "degree") ||
      matchesDemoPhrase(message, "study") ||
      matchesDemoPhrase(message, "college") ||
      matchesDemoPhrase(message, "university"))
  ) {
    return `
    <h2>Zaki Quasmi Alig — Education</h2>

    <ul>
      <li>
        <strong>Aligarh Muslim University (AMU):</strong>
        Completed his foundational higher education and earned the title of 'Alig'.
      </li>

      <li>
        <strong>Pondicherry University:</strong>
        Completed a <strong>Master of Business Administration (MBA)</strong>.
      </li>
    </ul>
  `;
  }

  // ZAKI SIR - CURRENT ROLE
  if (
    matchesDemoPhrase(message, "zaki") &&
    (matchesDemoPhrase(message, "principal") ||
      matchesDemoPhrase(message, "current role") ||
      matchesDemoPhrase(message, "currently") ||
      matchesDemoPhrase(message, "work") ||
      matchesDemoPhrase(message, "job") ||
      matchesDemoPhrase(message, "profession") ||
      matchesDemoPhrase(message, "role"))
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> currently serves as the
      <strong>Principal and operational head of Brilliant Coaching Center</strong>
      in Kairi Birpur, Kishanganj.
    </p>

    <p>
      He took over the management of the institute from his elder brother,
      <strong>Mr. Rehan Quasmi</strong>, who transitioned into a government
      teaching role.
    </p>
  `;
  }

  // ZAKI SIR - BRILLIANT COACHING CENTER
  if (
    matchesDemoPhrase(message, "zaki") &&
    (matchesDemoPhrase(message, "brilliant coaching") ||
      matchesDemoPhrase(message, "coaching center") ||
      matchesDemoPhrase(message, "coaching centre"))
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> currently manages and serves as the
      <strong>Principal of Brilliant Coaching Center</strong> in
      <strong>Kairi Birpur, Kishanganj.</strong>
    </p>

    <p>
      He took over the operational management of the institute from his elder
      brother, <strong>Mr. Rehan Quasmi</strong>.
    </p>
  `;
  }

  // ZAKI SIR - ONLINE TUTORING
  if (
    matchesDemoPhrase(message, "zaki") &&
    (matchesDemoPhrase(message, "online tutor") ||
      matchesDemoPhrase(message, "online tutoring") ||
      matchesDemoPhrase(message, "chegg") ||
      matchesDemoPhrase(message, "course hero") ||
      matchesDemoPhrase(message, "international students") ||
      matchesDemoPhrase(message, "tutor"))
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> provides academic support and mentorship
      to international students as a verified tutor on global ed-tech platforms,
      including <strong>Chegg</strong> and <strong>Course Hero.</strong>
    </p>
  `;
  }

  // ZAKI SIR - LOCATION
  if (
    matchesDemoPhrase(message, "zaki") &&
    (matchesDemoPhrase(message, "where is he from") ||
      matchesDemoPhrase(message, "where does he come from") ||
      matchesDemoPhrase(message, "location") ||
      matchesDemoPhrase(message, "hometown") ||
      matchesDemoPhrase(message, "from where"))
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> originates from
      <strong>Kairi Birpur, Kishanganj.</strong>
    </p>
  `;
  }

  // REHAN SIR - PROFESSION
  if (
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "profession") ||
      matchesDemoPhrase(message, "professionally") ||
      matchesDemoPhrase(message, "job") ||
      matchesDemoPhrase(message, "work") ||
      matchesDemoPhrase(message, "role") ||
      matchesDemoPhrase(message, "occupation"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> is an educator and currently serves
      as a <strong>Government Teacher</strong> in the public education system.
    </p>

    <p>
      He was also the founder and original operational head of
      <strong>Brilliant Coaching Center</strong> in Kairi Birpur.
    </p>
  `;
  }

  // REHAN SIR - FOUNDER
  if (
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "founder") ||
      matchesDemoPhrase(message, "founded") ||
      matchesDemoPhrase(message, "started brilliant") ||
      matchesDemoPhrase(message, "created brilliant"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> is the founding visionary behind
      <strong>Brilliant Coaching Center</strong> in Kairi Birpur.
    </p>

    <p>
      He established the institute with the aim of contributing to and
      elevating educational standards in his hometown.
    </p>
  `;
  }

  // REHAN SIR - GOVERNMENT TEACHER
  if (
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "government teacher") ||
      matchesDemoPhrase(message, "govt teacher") ||
      matchesDemoPhrase(message, "government educator") ||
      matchesDemoPhrase(message, "public education") ||
      matchesDemoPhrase(message, "government job"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> transitioned from private coaching
      administration after securing a position as a
      <strong>Government Teacher</strong>.
    </p>

    <p>
      He now serves in the <strong>public education system</strong>.
    </p>
  `;
  }

  // REHAN SIR - BRILLIANT COACHING CENTER
  if (
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "brilliant coaching") ||
      matchesDemoPhrase(message, "coaching center") ||
      matchesDemoPhrase(message, "coaching centre"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> is the founding visionary behind
      <strong>Brilliant Coaching Center</strong> in Kairi Birpur.
    </p>

    <p>
      After moving into his government teaching role, he handed over the
      operational management and principalship of the institute to his
      younger brother, <strong>Zaki Quasmi Alig.</strong>
    </p>
  `;
  }

  // REHAN SIR - LOCATION
  if (
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "where is he from") ||
      matchesDemoPhrase(message, "where does he come from") ||
      matchesDemoPhrase(message, "location") ||
      matchesDemoPhrase(message, "hometown") ||
      matchesDemoPhrase(message, "from where"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> originates from
      <strong>Kairi Birpur, Kishanganj.</strong>
    </p>
  `;
  }

  // RELATIONSHIP BETWEEN ZAKI AND REHAN
  if (
    matchesDemoPhrase(message, "zaki") &&
    matchesDemoPhrase(message, "rehan") &&
    (matchesDemoPhrase(message, "brother") ||
      matchesDemoPhrase(message, "relation") ||
      matchesDemoPhrase(message, "relationship") ||
      matchesDemoPhrase(message, "related"))
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> and
      <strong>Zaki Quasmi Alig</strong> are brothers.
    </p>

    <p>
      Rehan Quasmi is the elder brother and the original founder of
      <strong>Brilliant Coaching Center</strong>. After transitioning to his
      government teaching role, he handed over the institute's operational
      management and principalship to his younger brother,
      <strong>Zaki Quasmi Alig.</strong>
    </p>
  `;
  }

  // WHO IS PRINCIPAL?
  if (
    matchesDemoPhrase(message, "who is the principal") ||
    matchesDemoPhrase(message, "who is principal") ||
    matchesDemoPhrase(message, "current principal") ||
    matchesDemoPhrase(message, "principal of brilliant coaching") ||
    matchesDemoPhrase(message, "principal of brilliant coaching center")
  ) {
    return `
    <p>
      The current <strong>Principal and operational head of Brilliant Coaching
      Center</strong> in Kairi Birpur is <strong>Zaki Quasmi Alig</strong>.
    </p>
  `;
  }

  // WHO IS THE FOUNDER?
  if (
    matchesDemoPhrase(message, "who is the founder") ||
    matchesDemoPhrase(message, "who founded brilliant coaching") ||
    matchesDemoPhrase(message, "founder of brilliant coaching") ||
    matchesDemoPhrase(message, "original founder")
  ) {
    return `
    <p>
      <strong>Mr. Rehan Quasmi</strong> is the original founder and
      foundational visionary behind <strong>Brilliant Coaching Center</strong>
      in Kairi Birpur.
    </p>

    <p>
      He later transitioned into a government teaching role and handed over
      the institute's operational management and principalship to his younger
      brother, <strong>Zaki Quasmi Alig.</strong>
    </p>
  `;
  }

  // ============================================================
  // MUNTAZIR AKRAM SIR
  // ============================================================

  if (
    matchesDemoPhrase(message, "muntazir sir") ||
    matchesDemoPhrase(message, "who is muntazir sir") ||
    matchesDemoPhrase(message, "who is muntazir akram") ||
    matchesDemoPhrase(message, "muntazir akram") ||
    matchesDemoPhrase(message, "muntazir sir kaun hai") ||
    matchesDemoPhrase(message, "about muntazir sir") ||
    matchesDemoPhrase(message, "tell me about muntazir sir") ||
    matchesDemoPhrase(message, "muntazir")
  ) {
    return `
    <p>
        <strong>Muntazir Akram Sir</strong> is an educator and digital creator
        associated with the Bahadurganj–Kishanganj area of Bihar.
    </p>

    <h2>Academic Background</h2>

    <ul>
        <li>
            <strong>B.N. Mandal University, Madhepura:</strong>
            His public Facebook profile states that he studied at
            B.N. Mandal University, Madhepura.
        </li>
    </ul>

    <h2>Professional Journey</h2>

    <ul>
        <li>
            <strong>Education:</strong>
            Muntazir Sir has been involved in teaching and educational
            activities in the Bahadurganj–Kishanganj region.
        </li>

        <li>
            <strong>Brilliant Coaching Centre:</strong>
            He is associated with Brilliant Coaching Centre (BCC),
            where he has contributed to the institute's educational
            activities.
        </li>

        <li>
            <strong>Digital Creator:</strong>
            His Facebook profile identifies him as a Digital Creator,
            and he also maintains an Instagram presence under
            <strong>@muntazir_akram</strong>.
        </li>
    </ul>

    <h2>Educational Contribution</h2>

    <p>
        Apart from his own academic journey, Muntazir Sir has been involved
        in education and student-oriented activities through BCC and his
        digital presence. His work connects teaching, student guidance,
        educational communication and local community involvement.
    </p>

    <h2>Current Work & Business</h2>

    <ul>
        <li>
            <strong>Education:</strong>
            He continues to be associated with educational activities
            and BCC.
        </li>

        <li>
            <strong>Automobile Business:</strong>
            Muntazir Sir is also associated with a Komaki/Kumaki
            electric vehicle showroom in the Bahadurganj area.
            The exact ownership/partnership structure is not publicly
            confirmed in the sources currently available.
        </li>
    </ul>

    <h2>Social Media</h2>

    <ul>
        <li>
            <strong>Instagram:</strong> @muntazir_akram
        </li>

        <li>
            <strong>YouTube:</strong> muntazirakram6088
        </li>

        <li>
            <strong>Facebook:</strong> Muntazir Akram
        </li>

        <li>
            <strong>BCC Family:</strong> He also has a connection with
            the BCC Family online presence.
        </li>
    </ul>

    <h2>In Short</h2>

    <p>
        <strong>Muntazir Akram Sir</strong> has also been involved in
        <strong>computer education and computer-training classes</strong>
        in the Bahadurganj–Kishanganj region.
    </p>

    <p>
        His work in computer education is part of his broader
        involvement in teaching and skill development, alongside
        his association with BCC.
    </p>

    <p>
        Muntazir Akram Sir's journey combines education, teaching,
        digital content creation and entrepreneurship. Starting from
        his academic background at B.N. Mandal University, Madhepura,
        he became involved in educational work in the Bahadurganj–
        Kishanganj region and is associated with BCC. His present
        activities also extend into the automobile/electric-vehicle
        business.
    </p>
    `;
  }

  // --------------------------------------------------------
  // 1. औद्योगिक क्रांति
  // --------------------------------------------------------

  if (
    matchesDemoPhrase(message, "औद्योगिक क्रांति क्या है") ||
    matchesDemoPhrase(message, "औद्योगिक क्रांति से आप क्या समझते हैं") ||
    matchesDemoPhrase(message, "audyogik kranti kya hai") ||
    matchesDemoPhrase(message, "audyogik kranti se aap kya samajhte hain") ||
    matchesDemoPhrase(message, "audyokit kranti se aap kya samjhte hain") ||
    matchesDemoPhrase(message, "audyokit kranti kya hai")
  ) {
    return `
    <h2>औद्योगिक क्रांति</h2>

    <p>
    उस क्रांति को जिसमें सामान का उत्पादन घरेलू उद्योगों के स्थान पर
    बड़े उद्योगों में बड़े पैमाने पर किया जाने लगा, उसे
    <strong>औद्योगिक क्रांति</strong> कहते हैं।
    </p>

    <p>
    इसमें काम मानव श्रम के द्वारा न होकर मशीनों के द्वारा होता है।
    </p>
  `;
  }
  // --------------------------------------------------------
  // 2. आर्थिक संकट
  // --------------------------------------------------------

  if (
    matchesDemoPhrase(message, "आर्थिक संकट से आप क्या समझते हैं") ||
    matchesDemoPhrase(message, "आर्थिक संकट क्या है") ||
    matchesDemoPhrase(message, "aarthik sankat se aap kya samajhte hain") ||
    matchesDemoPhrase(message, "aarthik sankat kya hai")
  ) {
    return `
    <h2>आर्थिक संकट</h2>

        <p>
        ऐसी स्थिति जिसमें कृषि, उद्योग और व्यापार का विकास रुक जाए
        और वस्तु तथा मुद्रा का बाजार में कोई मूल्य न रहे, तो ऐसी
        स्थिति को <strong>आर्थिक संकट</strong> कहा जाता है।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 3. भूमंडलीकरण
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "भूमंडलीकरण किसे कहते हैं") ||
    matchesDemoPhrase(message, "भूमंडलीकरण क्या है") ||
    matchesDemoPhrase(message, "bhumandalikaran kise kehte hain") ||
    matchesDemoPhrase(message, "bhoomandalikaran kise kehte hain") ||
    matchesDemoPhrase(message, "bhoomandalikaran kise kahte hain") ||
    matchesDemoPhrase(message, "bhumandalikaran kya hai") ||
    matchesDemoPhrase(message, "bhumandalikaran kise kahte hain") ||
    matchesDemoPhrase(message, "bhumandalikaran kya h")
  ) {
    return `
    <h2>भूमंडलीकरण</h2>

        <p>
        विश्व के आपस में राजनीतिक, सामाजिक, वैज्ञानिक तथा सांस्कृतिक
        रूप से जुड़ने की क्रिया को <strong>भूमंडलीकरण</strong> कहते हैं।
        </p>

        <p>
        भूमंडलीकरण प्राचीन समय से चली आ रही है। लोग व्यापार और अन्य
        कारणों से आपस में मिलते आ रहे हैं। वर्तमान में इसका मुख्य अर्थ
        <strong>विश्व बाजारों का आपस में जुड़ना</strong> है, जिसमें
        दुनिया के हर बाजार में हर तरह का सामान मिल जाता है।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 4. ब्रेटन वुड्स सम्मेलन
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "ब्रेटन वुड्स सम्मेलन का मुख्य उद्देश्य क्या था") ||
    matchesDemoPhrase(message, "बेटेन वुड्स सम्मेलन का मुख्य उद्देश्य क्या था") ||
    matchesDemoPhrase(message, "breton woods sammelan ka mukhya uddeshya kya tha") ||
    matchesDemoPhrase(message, "bretton woods sammelan ka mukhya uddeshya kya tha") ||
    matchesDemoPhrase(message, "bretton wood sammelan ka mukhya uddeshya kya tha") ||
    matchesDemoPhrase(message, "bretton woods conference ka main purpose kya tha") ||
    matchesDemoPhrase(message, "braton woods sammelan ka mukhya uddeshya kya tha") ||
    matchesDemoPhrase(message, "bratton woods conference ka main purpose kya tha")
  ) {
    return `
    <h2>ब्रेटन वुड्स सम्मेलन</h2>

        <p>
        आर्थिक मंदी के बाद द्वितीय विश्व युद्ध के दौरान यह महसूस किया गया
        कि विश्व शांति के लिए <strong>आर्थिक स्थिरता और पूर्ण रोजगार</strong>
        का होना जरूरी है।
        </p>

        <p>
        आर्थिक स्थिरता और पूर्ण रोजगार के लिए आर्थिक क्षेत्र में सरकारी
        हस्तक्षेप तथा अंतरराष्ट्रीय नियम जरूरी समझे गए।
        </p>

        <p>
        इसी बारे में विचार के लिए 1944 में अमेरिका के न्यू हैम्पशायर के
        ब्रेटन वुड्स नामक स्थान पर एक सम्मेलन आयोजित किया गया।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 5. बहुराष्ट्रीय कंपनी
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "बहुराष्ट्रीय कंपनी क्या है") ||
    matchesDemoPhrase(message, "बहुराष्ट्रीय कंपनी किसे कहते हैं") ||
    matchesDemoPhrase(message, "bahurashtriya company kya hai") ||
    matchesDemoPhrase(message, "bahurashtriya company kise kehte hain") ||
    matchesDemoPhrase(message, "bahurashtriya company kya h") ||
    matchesDemoPhrase(message, "bahuraashtriya company kise kahte hain")
  ) {
    return `
    <h2>बहुराष्ट्रीय कंपनी</h2>

        <p>
        वह कंपनी जो एक से अधिक देशों में सामानों का उत्पादन तथा व्यापार
        करती है, उसे <strong>बहुराष्ट्रीय कंपनी</strong> कहते हैं।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 6. 1929 आर्थिक महामंदी
  // --------------------------------------------------------

  if (
    matchesDemoPhrase(message, "1929 के आर्थिक संकट के कारणों को संक्षेप में स्पष्ट करें") ||
    matchesDemoPhrase(message, "1929 की आर्थिक महामंदी के कारण") ||
    matchesDemoPhrase(message, "1929 ki aarthik mandi ke karan") ||
    matchesDemoPhrase(message, "1929 ke aarthik sankat ke karanon ko sanchhep mein spasht karein") ||
    matchesDemoPhrase(message, "1929 ki aarthik mahamandi ke karan") ||
    matchesDemoPhrase(message, "1929 ke arthik sankat ke karanon ko spasht karein")
  ) {
    return `
    <h2>1929 की आर्थिक महामंदी के कारण</h2>

        <ol>

            <li>
                <strong>कृषि क्षेत्र में अति उत्पादन:</strong>
                प्रथम विश्व युद्ध के बाद अनाजों के उत्पादन की अत्यधिक
                वृद्धि हो गई। इससे अनाजों के खरीदार नहीं रहे और उनके
                मूल्य अत्यधिक कम हो गए। गोदामों में पड़ा अनाज सड़ने लगा।
                इससे किसानों की स्थिति बिगड़ गई।
            </li>

            <li>
                <strong>उपभोक्ताओं की कमी:</strong>
                प्रथम विश्व युद्ध के समय उद्योगों के उत्पादन में वृद्धि
                हो गई। पर साथ ही गरीबी, बेरोजगारी और भुखमरी भी बढ़ गई।
                इसलिए सामानों की बिक्री कम हो गई, जिससे अर्थव्यवस्था
                लड़खड़ा गई।
            </li>

            <li>
                <strong>अमेरिकी पूँजी प्रवाह की कमी:</strong>
                प्रथम विश्व युद्ध के समय अमेरिका कर्ज देता था, जिससे
                कर्ज लेने वाले राष्ट्र अपनी आवश्यकता पूरी करने के साथ
                विकास का कार्य भी करते थे। पर 1927 के बाद अमेरिकी
                अर्थव्यवस्था लड़खड़ाने लगी, इसलिए अमेरिका कर्ज देने
                के स्थान पर कर्ज वसूलने लगा। इस कारण कर्ज लेने वाले
                देशों की स्थिति और बिगड़ गई।
            </li>

        </ol>

        <h3>महामंदी का भारत पर प्रभाव</h3>

        <ol>
            <li>
                भारत के व्यापार में काफी गिरावट आ गई।
                1928-34 के बीच आयात-निर्यात घटकर आधा रह गया।
            </li>

            <li>
                कृषि उत्पादों के मूल्य में अत्यधिक कमी आ गई।
            </li>

            <li>
                कृषि उत्पादों के मूल्य में कमी आने के कारण किसानों की
                स्थिति दयनीय हो गई।
            </li>
        </ol>
  `;
  }

  // --------------------------------------------------------
  // 7. औद्योगिक क्रांति और विश्व बाजार
  // --------------------------------------------------------

  if (
    message.includes(
      "औद्योगिक क्रांति ने किस प्रकार विश्व बाजार के स्वरूप को विस्तृत किया",
    ) ||
    matchesDemoPhrase(message, "औद्योगिक क्रांति ने विश्व बाजार को कैसे विस्तृत किया") ||
    message.includes(
      "audyogik kranti ne kis prakar vishva bazar ke swaroop ko vistarit kiya",
    ) ||
    message.includes(
      "audyogik kranti ne kis parkar vishva bazar ke swaroop ko vistarit kiya",
    ) ||
    matchesDemoPhrase(message, "industrial kranti ne world market ko kaise badhaya") ||
    matchesDemoPhrase(message, "audyokik kranti ne vishva bazar ko kaise vistarit kiya")
  ) {
    return `
    <h2>औद्योगिक क्रांति और विश्व बाजार</h2>

        <p>
        औद्योगिक क्रांति के कारण विश्व बाजार का स्वरूप विश्वव्यापी हो गया।
        औद्योगिक क्रांति ने <strong>व्यापार, श्रमिक का पलायन और पूँजी का
        प्रवाह</strong> तीनों आर्थिक क्रियाओं को जन्म दिया।
        </p>

        <ul>
            <li>
                आरंभ में औद्योगिक क्रांति इंग्लैण्ड और यूरोप के कुछ देशों में हुई।
            </li>

            <li>
                दुनिया के विभिन्न देशों से इन देशों में कच्चा माल पहुँचने लगा
                तथा इन देशों से तैयार माल विभिन्न देशों में जाने लगा।
            </li>

            <li>
                रोजगार की तलाश में विभिन्न देशों से मजदूर भी इन देशों में जाने लगे।
            </li>

            <li>
                उद्योगपति विभिन्न देशों में पूँजी लगाकर सामानों का उत्पादन करने लगे।
            </li>
        </ul>

        <p>
        इस प्रकार सामान, श्रमिक और पूँजी तीनों मामलों में दुनिया आपस में जुड़ गई।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 8. विश्व बाजार का स्वरूप
  // --------------------------------------------------------

  if (
    matchesDemoPhrase(message, "विश्व बाजार के स्वरूप को समझाएँ") ||
    matchesDemoPhrase(message, "विश्व बाजार का स्वरूप समझाइए") ||
    matchesDemoPhrase(message, "vishva bazar ke swaroop ko samjhaen") ||
    matchesDemoPhrase(message, "vishva bazar ke swaroop ko samjhayein") ||
    matchesDemoPhrase(message, "vishva bazar ka swaroop samjhaiye")
  ) {
    return `
    <h2>विश्व बाजार का स्वरूप</h2>

        <p>
        औद्योगिक क्रांति के कारण विश्व बाजार का स्वरूप विश्वव्यापी हो गया।
        औद्योगिक क्रांति ने व्यापार, श्रमिक का पलायन और पूँजी का प्रवाह
        तीनों आर्थिक क्रियाओं को जन्म दिया।
        </p>

        <ul>
            <li>विभिन्न देशों से कच्चा माल औद्योगिक देशों में पहुँचने लगा।</li>
            <li>औद्योगिक देशों से तैयार माल विभिन्न देशों में जाने लगा।</li>
            <li>रोजगार की तलाश में मजदूर दूसरे देशों में जाने लगे।</li>
            <li>उद्योगपति विभिन्न देशों में पूँजी लगाने लगे।</li>
        </ul>

        <p>
        इस प्रकार सामान, श्रमिक और पूँजी के माध्यम से दुनिया आपस में जुड़ गई।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 9. भूमंडलीकरण और बहुराष्ट्रीय कंपनियाँ
  // --------------------------------------------------------

  if (
    message.includes(
      "भूमंडलीकरण में बहुराष्ट्रीय कंपनियों के योगदान को स्पष्ट करें",
    ) ||
    matchesDemoPhrase(message, "भूमंडलीकरण में बहुराष्ट्रीय कंपनियों का योगदान") ||
    message.includes(
      "bhumandalikaran mein bahurashtriya kampaniyon ke yogdan ko spasht karein",
    ) ||
    message.includes(
      "bhumandalikaran mein bahuraashtriya companiyon ke yogdan ko spasht karein",
    ) ||
    matchesDemoPhrase(message, "globalization mein multinational companies ka yogdan") ||
    matchesDemoPhrase(message, "bhumandalikaran mein bahurashtriya companiyon ka yogdan")
  ) {
    return `
    <h2>भूमंडलीकरण में बहुराष्ट्रीय कंपनियों का योगदान</h2>

        <p>
        जिस कंपनी का उत्पादन तथा व्यापार एक से अधिक देशों में होता है उसे
        <strong>बहुराष्ट्रीय कंपनी</strong> कहते हैं।
        </p>

        <p>
        भूमंडलीकरण में बहुराष्ट्रीय कंपनियों का महत्वपूर्ण योगदान है।
        बहुराष्ट्रीय कंपनियाँ विभिन्न देशों में व्यापार और उत्पादन करती हैं।
        </p>

        <ul>
            <li>विभिन्न देशों में पूँजी निवेश करती हैं।</li>
            <li>विभिन्न देशों के श्रमिकों को काम पर लगाती हैं।</li>
            <li>उत्पादन और व्यापार के माध्यम से विभिन्न देशों को जोड़ती हैं।</li>
        </ul>
  `;
  }

  // --------------------------------------------------------
  // 10. ग्रामीण और नगरीय जीवन
  // --------------------------------------------------------
  if (
    message.includes(
      "ग्रामीण एवं नगरीय जीवन के बीच की भिन्नता को स्पष्ट करें",
    ) ||
    matchesDemoPhrase(message, "ग्रामीण और नगरीय जीवन में अंतर") ||
    message.includes(
      "gramin evam nagariya jeevan ke beech ki bhinnata ko spasht karein",
    ) ||
    message.includes(
      "gramin evan nagariya jeevan ke beech ki bhinnata ko spasht karein",
    ) ||
    matchesDemoPhrase(message, "gaon aur shahar ke jeevan mein antar") ||
    matchesDemoPhrase(message, "gaon aur nagariya jeevan mein antar")
  ) {
    return `
    <h2>ग्रामीण एवं नगरीय जीवन के बीच भिन्नता</h2>

        <ol>

            <li>
                <strong>व्यवसाय:</strong>
                गाँव की अधिकांश जनसंख्या कृषि, पशुपालन तथा घरेलू उद्योगों
                का कार्य करती है जबकि शहर की अधिकांश जनसंख्या गैर-कृषि
                कार्य और दूसरे व्यवसाय करती है।
            </li>

            <li>
                <strong>घनत्व:</strong>
                गाँव की जनसंख्या विरल होती है जबकि शहर की जनसंख्या सघन होती है।
            </li>

            <li>
                <strong>आवास:</strong>
                गाँव में अधिक घर कच्चे तथा अव्यवस्थित होते हैं जबकि शहर में
                पक्के तथा व्यवस्थित होते हैं।
            </li>

            <li>
                <strong>परिवार:</strong>
                गाँव में अधिकतर संयुक्त परिवार होता है जबकि शहर में
                एकल परिवार होता है।
            </li>

        </ol>
  `;
  }

  // --------------------------------------------------------
  // 11. शहरी सामाजिक बदलाव
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "शहरी जीवन में किस प्रकार के सामाजिक बदलाव आए") ||
    matchesDemoPhrase(message, "शहरीकरण के साथ सामाजिक बदलाव") ||
    matchesDemoPhrase(message, "shahri jeevan mein kis prakar ke samajik badlav aaye") ||
    matchesDemoPhrase(message, "shahari jeevan mein kis prakar ke samajik badlav aaye") ||
    matchesDemoPhrase(message, "shahri jeevan mein kis parkar ke samajik badlao aaye") ||
    matchesDemoPhrase(message, "shahrikaran ke sath samajik badlav") ||
    matchesDemoPhrase(message, "shahrikaran ke sath samajik badlao")
  ) {
    return `
    <h2>शहरी जीवन में सामाजिक बदलाव</h2>

        <ol>

            <li>
                <strong>सामूहिक पहचान:</strong>
                शहरीकरण के साथ लोग अपनी जाति, धर्म, क्षेत्र आदि के आधार
                पर एकजुट होने लगे। समान पहचान वाले लोग एक साथ रहने लगे।
            </li>

            <li>
                <strong>नए सामाजिक समूह:</strong>
                अनेक नए सामाजिक समूहों का निर्माण हुआ, जैसे चिकित्सकों
                और व्यापारियों के समूह।
            </li>

            <li>
                <strong>मध्यम वर्ग का उदय:</strong>
                नए मध्यम वर्ग का उदय हुआ। वे पढ़े-लिखे लोग थे जो नौकरी
                तथा व्यवसाय करते थे।
            </li>

            <li>
                <strong>पूँजीपति वर्ग:</strong>
                औद्योगिकीकरण के साथ पूँजीपति वर्ग का उदय हुआ।
                ये अपनी पूँजी निवेश कर उद्योगों का निर्माण करते थे।
            </li>

            <li>
                <strong>श्रमिक वर्ग:</strong>
                औद्योगिकीकरण के कारण बड़ी संख्या में श्रमिक वर्ग तैयार हुआ।
                यह वर्ग पूँजीपति के शोषण का शिकार था।
            </li>

            <li>
                <strong>परिवार में बदलाव:</strong>
                शहरीकरण के साथ परिवार का ढाँचा भी बदल गया। संयुक्त परिवार
                के स्थान पर एकल परिवार बनने लगा।
            </li>

        </ol>
`;
  }

  // --------------------------------------------------------
  // 12. नगरीय जीवन और आधुनिकता
  // --------------------------------------------------------

  if (
    message.includes(
      "नगरीय जीवन एवं आधुनिकता एक-दूसरे से अभिन्न रूप से कैसे जुड़े हुए हैं",
    ) ||
    matchesDemoPhrase(message, "नगरीय जीवन और आधुनिकता कैसे जुड़े हैं") ||
    message.includes(
      "nagariya jeevan evam aadhunikta ek doosre se abhinn roop se kaise jude hue hain",
    ) ||
    matchesDemoPhrase(message, "urban life aur modernity kaise judi hai") ||
    matchesDemoPhrase(message, "nagariya jeevan aur aadhunikta kaise jude hain")
  ) {
    return `
    <h2>नगरीय जीवन एवं आधुनिकता</h2>

        <p>
        समय के साथ होने वाले बदलाव को <strong>आधुनिकता</strong> कहते हैं।
        जो भी बदलाव होता है अर्थात आधुनिकता आती है, उसकी शुरुआत शहर से होती है।
        इसके बाद यह गाँव में फैलती है।
        </p>

        <p>
        जैसे आधुनिक संचार सुविधा, आधुनिक घरेलू उपयोगी पदार्थ तथा नई-नई
        डिजाइनों की वेश-भूषा आदि सबसे पहले नगरीय जीवन में दिखाई देती हैं।
        बाद में यह गाँव की तरफ आती हैं।
        </p>

        <p>
        इसका कारण यह है कि शहर में संसाधन और सुविधाएँ उपलब्ध होती हैं,
        जबकि गाँव में ये सुविधाएँ कम उपलब्ध होती हैं।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 13. शहरों की नई समस्याएँ
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "शहर ने किन नई समस्याओं को जन्म दिया") ||
    matchesDemoPhrase(message, "शहर ने किन नई समस्या का जन्म दिया") ||
    matchesDemoPhrase(message, "shahar ne kin nayi samasyaon ko janm diya") ||
    matchesDemoPhrase(message, "shahar ne kin nayi samsya ka janm diya") ||
    matchesDemoPhrase(message, "shahar ki nayi samasyaen")
  ) {
    return `
    <h2>शहरों की नई समस्याएँ</h2>

        <p>
        शहर की जनसंख्या अत्यधिक तेजी से बढ़ने के कारण निम्न समस्याएँ पैदा हुईं:
        </p>

        <ol>

            <li>
                <strong>प्रदूषण की समस्या:</strong>
                जनसंख्या बढ़ने के साथ शहर में प्रदूषण बढ़ने लगा,
                जिससे स्वास्थ्य संबंधी समस्याएँ पैदा हुईं।
            </li>

            <li>
                <strong>बेरोजगारी की समस्या:</strong>
                शहर की जनसंख्या तेजी से बढ़ने के कारण रोजगार की समस्या
                भी पैदा होने लगी।
            </li>

            <li>
                <strong>आवास की समस्या:</strong>
                आबादी बढ़ने के साथ शहर में आवास की समस्या उत्पन्न हो गई।
                लोग रैनबसेरों तथा अस्थायी घरों में रहने लगे।
            </li>

        </ol>
  `;
  }

  // --------------------------------------------------------
  // 14. शहरों का विकास
  // --------------------------------------------------------
  if (
    message.includes(
      "शहरों की विकास की पृष्ठभूमि एवं उसके प्रक्रिया पर प्रकाश डालें",
    ) ||
    matchesDemoPhrase(message, "शहरों के विकास की पृष्ठभूमि और प्रक्रिया") ||
    message.includes(
      "shaharon ki vikas ki prishthbhoomi evam uski prakriya par prakash dalein",
    ) ||
    matchesDemoPhrase(message, "shaharon ka vikas kaise hua") ||
    matchesDemoPhrase(message, "shaharon ke vikas ki prishthbhoomi aur prakriya")
  ) {
    return `
    <h2>शहरों के विकास की पृष्ठभूमि एवं प्रक्रिया</h2>

        <h3>प्राचीन तथा मध्यकालीन नगर</h3>

        <p>
        शहरीकरण उस प्रक्रिया को कहते हैं जिसके अंतर्गत गाँव क्रमशः छोटे
        कस्बे, शहर, नगर और महानगर में तब्दील हो जाते हैं।
        </p>

        <p>
        प्राचीन तथा मध्यकाल में लोग अपने कृषि उत्पाद तथा अपने बनाए सामानों
        को बेचने के लिए गाँव से बाहर किसी एक केन्द्र में जमा होते थे।
        ये केन्द्र हाट या गंज के रूप में विकसित हुए।
        </p>

        <p>
        गंज के इर्द-गिर्द कस्बा या छोटे शहर का विकास हुआ। आगे ये कस्बे से
        शहर, शहर से नगर और नगर से महानगर बने।
        </p>

        <p>
        कृषि से अलग यहाँ लोग दूसरी गतिविधियों में व्यस्त हो गए।
        सामंत, राजा और उनके कर्मचारी भी यहाँ रहने लगे। सुंदर भवन बनाए जाने लगे।
        ये धर्म और शिक्षा के केन्द्र भी बन गए।
        </p>

        <h3>आधुनिक नगर</h3>

        <p>
        औद्योगिक क्रांति के बाद आधुनिक नगर का विकास हुआ। शहर में फैक्टरियाँ
        बनने लगीं और ग्रामीण कुटीर उद्योग बर्बाद होने लगे। इसलिए गाँव से
        बड़ी संख्या में लोग रोजगार की तलाश में शहर जाने लगे।
        </p>

        <h3>आधुनिक नगर के उदय में मुख्य तीन तत्व</h3>

        <ol>
            <li>
                <strong>औद्योगिक पूँजीवाद:</strong>
                औद्योगिकीकरण के कारण शहर में फैक्टरियाँ बनने लगीं।
            </li>

            <li>
                <strong>औपनिवेशिक विकास:</strong>
                उपनिवेशवाद के कारण विश्व व्यापार में वृद्धि हुई।
            </li>

            <li>
                <strong>लोकतांत्रिक आदर्शों का विकास:</strong>
                शहर प्रशासनिक तथा राजनीतिक केन्द्र के रूप में विकसित होने लगे।
            </li>
        </ol>
  `;
  }

  // --------------------------------------------------------
  // 15. उपनिवेशवाद
  // --------------------------------------------------------

  if (
    message.includes(
      "उपनिवेशवाद से आप क्या समझते हैं औद्योगीकरण ने उपनिवेशवाद को जन्म दिया कैसे",
    ) ||
    message.includes(
      "उपनिवेशवाद क्या है और औद्योगीकरण ने इसे कैसे जन्म दिया",
    ) ||
    message.includes(
      "upniveshvad se aap kya samajhte hain audyogikaran ne upniveshvad ko janm diya kaise",
    ) ||
    message.includes(
      "upniveshvad kya hai aur audyogikaran ne ise kaise janm diya",
    ) ||
    message.includes(
      "colonialism kya hai industrialization ne colonialism ko kaise janm diya",
    )
  ) {
    return `
    <h2>उपनिवेशवाद</h2>

        <p>
        दूसरे देश या उसके भूभाग पर कब्जा कर उसे अपने आर्थिक लाभ के लिए
        उपयोग करने को <strong>उपनिवेशवाद</strong> कहते हैं।
        </p>

        <h3>उपनिवेशवाद के कारण</h3>

        <p>
        उपनिवेशवाद का मुख्य कारक औद्योगिकीकरण था। यूरोप में औद्योगिकीकरण
        होने से फैक्टरियों में सामान बड़े पैमाने पर बनने लगा।
        इसके लिए कच्चे माल की अधिक मात्रा और तैयार माल बेचने के लिए
        बाजार की जरूरत थी।
        </p>

        <p>
        इसलिए यूरोप के औद्योगिक देश एशिया, अफ्रीका आदि देशों पर कब्जा
        करने लगे ताकि कपास, कोयला, लोहा आदि कच्चा माल प्राप्त कर सकें
        तथा अपना तैयार माल इन देशों में बेच सकें।
        </p>

        <p>
        इस तरह औद्योगिकीकरण ने उपनिवेशवाद को जन्म और बढ़ावा दिया।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 16. कुटीर उद्योग
  // --------------------------------------------------------
  if (
    message.includes(
      "कुटीर उद्योग के महत्व और उसकी उपयोगिता पर प्रकाश डालें",
    ) ||
    matchesDemoPhrase(message, "कुटीर उद्योग का महत्व और उपयोगिता") ||
    message.includes(
      "kutir udyog ke mahatva aur uski upyogita par prakash dalein",
    ) ||
    matchesDemoPhrase(message, "kutir udyog ka mahatva aur upyogita") ||
    matchesDemoPhrase(message, "kutir udyog ka mahatva kya hai")
  ) {
    return `
    <h2>कुटीर उद्योग का महत्व और उपयोगिता</h2>

        <p>
        बड़े उद्योगों के स्थापित होने के बावजूद घरेलू उद्योग समाप्त नहीं हुआ।
        कुछ पूँजीपति मशीनों के स्थान पर हाथ से काम करने वाले श्रमिकों को
        प्राथमिकता देते थे।
        </p>

        <ol>

            <li>
                <strong>सस्ता मजदूर:</strong>
                इंग्लैण्ड में मजदूर सस्ता था। कम मजदूरी में सामान तैयार हो
                जाता था। इसलिए पूँजीपति इन मजदूरों से कार्य करवाना उचित समझते थे।
            </li>

            <li>
                <strong>अत्यधिक पूँजी की आवश्यकता:</strong>
                मशीनों में अत्यधिक पूँजी लगती थी। रखरखाव और मरम्मत आदि
                के कारण हाथ से काम करवाना उचित समझा जाता था।
            </li>

            <li>
                <strong>अनियमित माँग:</strong>
                सामानों की माँग मौसम के आधार पर कम-अधिक होती रहती थी।
                हाथ से काम कराने पर माँग के आधार पर मजदूरों की संख्या
                घटाई-बढ़ाई जा सकती थी।
            </li>

            <li>
                <strong>फैक्टरियों में हर सामान का तैयार न होना:</strong>
                कुछ विशेष प्रकार के सामान केवल हाथ से ही बनाए जा सकते थे।
            </li>

            <li>
                <strong>कुलीन वर्ग की पसंद:</strong>
                ब्रिटेन के कुलीन वर्ग हाथों के सामानों को पसंद करते थे।
            </li>

        </ol>
  `;
  }

  // --------------------------------------------------------
  // 17. आधुनिक शहरों की स्थापना
  // --------------------------------------------------------
  if (
    message.includes(
      "आधुनिक शहरों की स्थापना निर्णायक रूप से किन तीन प्रक्रियाओं के द्वारा हुई",
    ) ||
    message.includes(
      "किन तीन प्रक्रियाओं के द्वारा आधुनिक शहरों की स्थापना निर्णायक रूप से हुई",
    ) ||
    message.includes(
      "aadhunik shaharon ki asthapna nirnayak roop se kin teen prakriyaon ke dwara hui",
    ) ||
    message.includes(
      "aadhunik shaharon ki sthapna nirnayak roop se kin teen prakriyaon ke dwara hui",
    ) ||
    message.includes(
      "kin teen prakriyaon ke dwara aadhunik shaharon ki sthapna nirnayak roop se hui",
    )
  ) {
    return `
    <h2>आधुनिक शहरों की स्थापना</h2>

        <p>
        निम्न तीन प्रक्रियाओं ने आधुनिक शहरों की स्थापना में मुख्य भूमिका निभाई:
        </p>

        <ol>
            <li><strong>औद्योगिक पूँजीवाद का उदय</strong></li>
            <li><strong>विश्व के बड़े भूभाग पर औपनिवेशिक शासन की स्थापना</strong></li>
            <li><strong>लोकतांत्रिक आदर्शों का विकास</strong></li>
        </ol>
  `;
  }

  // --------------------------------------------------------
  // 18. फैक्टरी प्रणाली
  // --------------------------------------------------------

  if (
    message.includes(
      "फैक्टरी प्रणाली के विकास के किन्हीं दो कारणों को बताएं",
    ) ||
    matchesDemoPhrase(message, "फैक्टरी प्रणाली के विकास के कारण") ||
    message.includes(
      "factory pranali ke vikas ke kinhi do karanon ko batayein",
    ) ||
    matchesDemoPhrase(message, "factory pranali ke vikas ke karan") ||
    message.includes(
      "factory pranali ke vikas ke kin hi do karanon ko vivran karein",
    )
  ) {
    return `
    <h2>फैक्टरी प्रणाली के विकास के कारण</h2>

        <ol>
            <li>देशी पूँजी तथा विदेशी पूँजी लगाकर बड़ी-बड़ी फैक्टरियाँ खोली गईं।</li>
            <li>बड़े पैमाने पर उत्पादन की आवश्यकता के कारण फैक्टरी प्रणाली का विकास हुआ।</li>
        </ol>
  `;
  }
  // --------------------------------------------------------
  // 19. मध्यम वर्ग
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "मध्यम वर्ग की उत्पत्ति कैसे हुई") ||
    matchesDemoPhrase(message, "मध्यम वर्ग का उदय कैसे हुआ") ||
    matchesDemoPhrase(message, "madhyam varg ki utpatti kaise hui") ||
    matchesDemoPhrase(message, "madhyam varg ka uday kaise hua") ||
    matchesDemoPhrase(message, "middle class ka uday kaise hua")
  ) {
    return `
    <h2>मध्यम वर्ग की उत्पत्ति</h2>

        <p>
        मध्यम वर्ग पूँजीपति और मजदूरों के बीच का वर्ग था।
        व्यापार तथा उद्योगों के विकास के कारण समाज में एक बड़ा वर्ग तैयार हुआ,
        जिसमें व्यापारी तथा पढ़े-लिखे शिक्षित वर्ग सम्मिलित थे।
        </p>
  `;
  }
  // --------------------------------------------------------
  // 20. अठारहवीं शताब्दी के भारतीय उद्योग
  // --------------------------------------------------------
  if (
    message.includes(
      "अठारहवीं शताब्दी में भारत के मुख्य उद्योग कौन-कौन से थे",
    ) ||
    matchesDemoPhrase(message, "18वीं शताब्दी में भारत के मुख्य उद्योग") ||
    message.includes(
      "atharahvin shatabdi mein bharat ke mukhya udyog kaun kaun se the",
    ) ||
    message.includes(
      "atharahvin shatabdi mein bharat ke mukhya udyog kon kon se the",
    ) ||
    message.includes(
      "18th shatabdi mein bharat ke mukhya udyog kaun kaun se the",
    ) ||
    matchesDemoPhrase(message, "atharahvin shatabdi mein bharat ke mukhya udyog")
  ) {
    return `
    <h2>अठारहवीं शताब्दी में भारत के मुख्य उद्योग</h2>

        <p>
        अठारहवीं शताब्दी में भारत के मुख्य उद्योग
        <strong>मलमल, छींट, सिल्क, सूती तथा ऊनी कपड़ा, हस्तकला और
        शिल्पकला</strong> थे।
        </p>
  `;
  }

  // --------------------------------------------------------
  // 21. शहरों के विकास की पृष्ठभूमि एवं प्रक्रिया पर प्रकाश डालें।
  // --------------------------------------------------------
  if (
    message.includes(
      "शहरों के विकास की पृष्ठभूमि एवं प्रक्रिया पर प्रकाश डालें।",
    ) ||
    message.includes(
      "शहरों के विकास की पृष्ठभूमि एवं प्रक्रिया पर प्रकाश डालें",
    ) ||
    message.includes(
      "shaharon ke vikas ki prishthbhoomi evam prakriya par prakash dalein",
    ) ||
    message.includes(
      "saharon ke vikas ki pristhbumi evam prakriya par prakas dalein",
    ) ||
    message.includes(
      "shaharon ke vikas ki prishthbhoomi evam prakriya par prakash dalein",
    ) ||
    message.includes(
      "shaharon ke vikas ki prishthboomi evam prakriya par prakash daalein",
    )
  ) {
    return `
  <h3>प्राचीन तथा मध्यकालीन नगर</h3><p>कृषि उत्पाद और सामान बेचने के लिए हाट और गंज विकसित हुए। इनके आसपास कस्बे और आगे शहर, नगर तथा महानगर बने।</p><h3>आधुनिक नगर</h3><p>औद्योगिक क्रांति के बाद कारखाने स्थापित हुए और रोजगार के लिए ग्रामीण आबादी शहरों की ओर आने लगी।</p><h3>मुख्य तत्व</h3><ol><li>औद्योगिक पूँजीवाद</li><li>उपनिवेशवाद</li><li>लोकतांत्रिक आदर्शों का विकास</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 22. औद्योगीकरण के परिणाम क्या थे?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "औद्योगीकरण के परिणाम क्या थे?") ||
    matchesDemoPhrase(message, "औद्योगीकरण के परिणाम क्या थे") ||
    matchesDemoPhrase(message, "audyogikaran ke parinaam kya the") ||
    matchesDemoPhrase(message, "audyogikaran ke parinam kya te") ||
    matchesDemoPhrase(message, "audyogikaran ke parinam kya the")
  ) {
    return `
  <ol><li>कारखानेदारी प्रथा का विकास।</li><li>पूँजीपति वर्ग का विकास।</li><li>श्रमिक वर्ग का उदय।</li><li>श्रमिक आंदोलनों का विकास।</li><li>स्लम पद्धति की शुरुआत।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 23. उपनिवेशवाद से आप क्या समझते हैं? औद्योगीकरण ने उपनिवेशवाद को जन्म कैसे दिया?
  // --------------------------------------------------------
  if (
    message.includes(
      "उपनिवेशवाद से आप क्या समझते हैं? औद्योगीकरण ने उपनिवेशवाद को जन्म कैसे दिया?",
    ) ||
    message.includes(
      "उपनिवेशवाद से आप क्या समझते हैं औद्योगीकरण ने उपनिवेशवाद को जन्म कैसे दिया",
    ) ||
    message.includes(
      "upniveshvad se aap kya samajhte hain audyogikaran ne upniveshvad ko janm kaise diya",
    ) ||
    message.includes(
      "upnivesvad se ap kya samajhte hain audyogikaran ne upnivesvad ko janm kaise diya",
    ) ||
    message.includes(
      "upnivesvad se aap kya samajhte hain audyogikaran ne upnivesvad ko janm kaise diya",
    ) ||
    message.includes(
      "upniveshvad se aap kya samajhte hain audyogikaran ne upniveshvad ko janm kese diya",
    )
  ) {
    return `
  <p><strong>उपनिवेशवाद:</strong> किसी दूसरे देश या भू-भाग पर कब्जा करके उसे अपने आर्थिक हितों के लिए उपयोग करना।</p><p>औद्योगिक देशों को कच्चे माल और तैयार माल के लिए बाजार चाहिए था। इसलिए उन्होंने एशिया और अफ्रीका के क्षेत्रों पर नियंत्रण स्थापित किया।</p>
    `;
  }

  // --------------------------------------------------------
  // 24. कुटीर उद्योग के महत्व और उपयोगिता पर प्रकाश डालें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "कुटीर उद्योग के महत्व और उपयोगिता पर प्रकाश डालें।") ||
    matchesDemoPhrase(message, "कुटीर उद्योग के महत्व और उपयोगिता पर प्रकाश डालें") ||
    message.includes(
      "kutir udyog ke mahatva aur upyogita par prakash daalein",
    ) ||
    matchesDemoPhrase(message, "kutir udyog ke mahatva aur upyogita par prakas dalein") ||
    message.includes(
      "kutir udyog ke mahatva aur upyogita par prakash dalein",
    ) ||
    matchesDemoPhrase(message, "kutir udyog ke mahatva aur upyogita par prakas daalein")
  ) {
    return `
  <ol><li>सस्ता मजदूर उपलब्ध था।</li><li>मशीनों की तुलना में कम पूँजी लगती थी।</li><li>अनियमित माँग के अनुसार उत्पादन घटाया-बढ़ाया जा सकता था।</li><li>कुछ विशेष वस्तुएँ हाथ से ही बनती थीं।</li><li>कुलीन वर्ग हाथ से बने सामान पसंद करता था।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 25. बंबई शहर के विकास की समीक्षा एक औपनिवेशिक शहर के रूप में करें।
  // --------------------------------------------------------
  if (
    message.includes(
      "बंबई शहर के विकास की समीक्षा एक औपनिवेशिक शहर के रूप में करें।",
    ) ||
    message.includes(
      "बंबई शहर के विकास की समीक्षा एक औपनिवेशिक शहर के रूप में करें",
    ) ||
    message.includes(
      "bombay shahar ke vikas ki samiksha ek aupniveshik shahar ke roop mein karein",
    ) ||
    message.includes(
      "bombay sahar ke vikas ki samiksa ek aupnivesik sahar ke rup mein karein",
    ) ||
    message.includes(
      "bombay sahar ke vikas ki samiksha ek aupniveshik sahar ke roop mein karein",
    ) ||
    message.includes(
      "bombay shahar ke vikas ki sameeksha ek aupniveshik shahar ke roop mein karein",
    ) ||
    message.includes(
      "bambayi shahar ke vikas ki samiksha ek aupniveshik shahar ke roop mein karein",
    ) ||
    message.includes(
      "bambayi shahar ke vikas ki samiksha ek aupniveshik shahar ke roop mein karein",
    )
  ) {
    return `
  <h3>बंबई का विकास</h3><p>पुर्तगाल के नियंत्रण के बाद बंबई इंग्लैंड को मिला। 1819 के बाद ईस्ट इंडिया कंपनी ने इसे पश्चिमी प्रांत की राजधानी बनाया और आबादी बढ़ी।</p><h3>चाल</h3><p>गरीबों के लिए बहुमंजिली इमारतों में छोटे कमरे बनाए गए, जिनमें भीड़ और स्वच्छता की समस्याएँ थीं।</p><h3>भूमि विकास</h3><ol><li>सात द्वीपों को जोड़ा गया।</li><li>समुद्र का पानी रोकने के लिए तटबंध बनाए गए।</li><li>पहाड़ी क्षेत्रों को समतल किया गया।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 26. शहरी जीवन एवं आधुनिकता एक-दूसरे से अभिन्न रूप से कैसे जुड़े हैं?
  // --------------------------------------------------------
  if (
    message.includes(
      "शहरी जीवन एवं आधुनिकता एक-दूसरे से अभिन्न रूप से कैसे जुड़े हैं?",
    ) ||
    message.includes(
      "शहरी जीवन एवं आधुनिकता एकदूसरे से अभिन्न रूप से कैसे जुड़े हैं",
    ) ||
    message.includes(
      "shahari jeevan evam aadhunikta ek doosre se abhinn roop se kaise jude hain",
    ) ||
    message.includes(
      "sahari jivan evam adunikta ek dusre se abinn rup se kaise jude hain",
    ) ||
    message.includes(
      "sahari jeevan evam aadhunikta ek doosre se abhinn roop se kaise jude hain",
    ) ||
    message.includes(
      "shahari jeevan evam adhunikta ek doosre se abhinn roop se kaise jude hain",
    )
  ) {
    return `
  नई सुविधाएँ, घरेलू उपयोग की वस्तुएँ, नई डिजाइन और जीवन-शैली पहले शहरों में दिखाई देती थीं क्योंकि शहरों में संसाधन और सुविधाएँ अधिक उपलब्ध थीं। बाद में ये परिवर्तन गाँवों तक पहुँचे।
    `;
  }

  // --------------------------------------------------------
  // 27. नगरों में विशेषाधिकार प्राप्त वर्ग अल्पसंख्यक हैं, ऐसी मान्यता क्यों बनी?
  // --------------------------------------------------------
  if (
    message.includes(
      "नगरों में विशेषाधिकार प्राप्त वर्ग अल्पसंख्यक हैं, ऐसी मान्यता क्यों बनी?",
    ) ||
    message.includes(
      "नगरों में विशेषाधिकार प्राप्त वर्ग अल्पसंख्यक हैं ऐसी मान्यता क्यों बनी",
    ) ||
    message.includes(
      "nagaron mein visheshadhikar prapt varg alpsankhyak hain aisi manyata kyu bani",
    ) ||
    message.includes(
      "nagaron mein visesadikar prapt varg alpsankhyak hain aisi manyata kyon bani",
    ) ||
    message.includes(
      "nagro mein visheshadhikar prapt varg alp-sankhyak hain aisi manyata kyon bani",
    ) ||
    message.includes(
      "nagaron mein viseshadhikar prapt varg alp-sankhyak hain aisi manyata kyon bani",
    )
  ) {
    return `
  विशेषाधिकार प्राप्त वर्ग मुख्यतः पूँजीपति वर्ग था। उसकी संख्या कम थी, लेकिन पूँजी के कारण वह अनेक सुविधाएँ प्राप्त कर सकता था। इसलिए उसे विशेषाधिकार प्राप्त अल्पसंख्यक कहा गया।
    `;
  }

  // --------------------------------------------------------
  // 28. नागरिक अधिकारों के प्रति नई चेतना किस प्रकार आंदोलनों और प्रयासों से बनी?
  // --------------------------------------------------------
  if (
    message.includes(
      "नागरिक अधिकारों के प्रति नई चेतना किस प्रकार आंदोलनों और प्रयासों से बनी?",
    ) ||
    message.includes(
      "नागरिक अधिकारों के प्रति नई चेतना किस प्रकार आंदोलनों और प्रयासों से बनी",
    ) ||
    message.includes(
      "nagrik adhikaron ke prati nai chetna kis prakar aandolanon aur prayason se bani",
    ) ||
    message.includes(
      "nagrik adikaron ke prati nai cetna kis prakar andolanon aur prayason se bani",
    ) ||
    message.includes(
      "nagrik adhikaron ke prati nai chetna kis tarah aandolanon aur prayason se bani",
    ) ||
    message.includes(
      "nagrik adhikaron ke prati nai chetna kis prakar aaandolanon aur prayason se bani?",
    )
  ) {
    return `
  शहरी लोगों ने अपने हितों के लिए संगठन बनाए। महिलाओं ने मताधिकार के लिए और मजदूरों ने काम के घंटे तथा बेहतर परिस्थितियों के लिए आंदोलन किए। इससे नागरिक अधिकारों के प्रति नई चेतना विकसित हुई।
    `;
  }

  // --------------------------------------------------------
  // 29. व्यवसायिक पूँजीवाद ने नगरों के विकास में कैसे योगदान दिया?
  // --------------------------------------------------------
  if (
    message.includes(
      "व्यवसायिक पूँजीवाद ने नगरों के विकास में कैसे योगदान दिया?",
    ) ||
    message.includes(
      "व्यवसायिक पूँजीवाद ने नगरों के विकास में कैसे योगदान दिया",
    ) ||
    message.includes(
      "vyavsayik punjivad ne nagaron ke vikas mein kaise yogdan diya",
    ) ||
    message.includes(
      "vyavsayik punjivad ne nagaron ke vikas mein kaise yogdan diya",
    ) ||
    message.includes(
      "vyavsayik punjivad ne nagro ke vikas mein kaise yogdan diya",
    ) ||
    message.includes(
      "vyavsayik punjivad ne nagaron ke vikas mein kese yogdan diya",
    )
  ) {
    return `
  व्यवसायिक पूँजीवाद के कारण विद्यालय, अस्पताल, बैंक और उद्योग जैसी सुविधाएँ विकसित हुईं। व्यापार और निवेश बढ़ने से शहरों की अर्थव्यवस्था मजबूत हुई।
    `;
  }

  // --------------------------------------------------------
  // 30. शहरों के उद्भव में मध्यम वर्ग की भूमिका किस प्रकार रही?
  // --------------------------------------------------------
  if (
    message.includes(
      "शहरों के उद्भव में मध्यम वर्ग की भूमिका किस प्रकार रही?",
    ) ||
    message.includes(
      "शहरों के उद्भव में मध्यम वर्ग की भूमिका किस प्रकार रही",
    ) ||
    message.includes(
      "shaharon ke udbhav mein madhyam varg ki bhoomika kis prakar rahi",
    ) ||
    message.includes(
      "saharon ke udbav mein madyam varg ki bumika kis prakar rahi",
    ) ||
    message.includes(
      "saharon ke udbhav mein madhyam varg ki bhoomika kis prakar rahi",
    ) ||
    message.includes(
      "shaharon ke udbhav mein madhyam varg ki bhoomika kis tarah rahi",
    )
  ) {
    return `
  शहरों में शिक्षित मध्यम वर्ग उभरा। शिक्षक, वकील, चिकित्सक, इंजीनियर और क्लर्क जैसे पेशे बढ़े, जिससे शहरीकरण और सामाजिक परिवर्तन को बल मिला।
    `;
  }

  // --------------------------------------------------------
  // 31. श्रमिक वर्ग का आगमन शहरों में किन परिस्थितियों के अंतर्गत हुआ?
  // --------------------------------------------------------
  if (
    message.includes(
      "श्रमिक वर्ग का आगमन शहरों में किन परिस्थितियों के अंतर्गत हुआ?",
    ) ||
    message.includes(
      "श्रमिक वर्ग का आगमन शहरों में किन परिस्थितियों के अंतर्गत हुआ",
    ) ||
    message.includes(
      "shramik varg ka aagman shaharon mein kin paristhitiyon ke antargat hua",
    ) ||
    message.includes(
      "sramik varg ka agman saharon mein kin paristitiyon ke antargat hua",
    ) ||
    message.includes(
      "shramik varg ka aagman saharon mein kin paristhitiyon ke antargat hua",
    ) ||
    message.includes(
      "shramik varg ka aagman shaharon me kin paristhitiyon ke antargat hua",
    )
  ) {
    return `
  बड़े उद्योगों में मजदूरों की आवश्यकता बढ़ी। गाँवों में रोजगार और भूमि की कमी के कारण भूमिहीन तथा बेरोजगार लोग काम की तलाश में शहरों की ओर आए।
    `;
  }

  // --------------------------------------------------------
  // 32. शहर ने किन नई समस्याओं को जन्म दिया?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "शहर ने किन नई समस्याओं को जन्म दिया?") ||
    matchesDemoPhrase(message, "शहर ने किन नई समस्याओं को जन्म दिया") ||
    matchesDemoPhrase(message, "shahar ne kin nayi samasyaon ko janm diya") ||
    matchesDemoPhrase(message, "sahar ne kin nai samasyaon ko janm diya") ||
    matchesDemoPhrase(message, "sahar ne kin nai samasyaon ko janm diya?")
  ) {
    return `
  <ol><li>प्रदूषण की समस्या</li><li>बेरोजगारी की समस्या</li><li>आवास की समस्या और झुग्गी-बस्तियों का विस्तार</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 33. असहयोग आंदोलन के कारण एवं परिणाम का वर्णन करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "असहयोग आंदोलन के कारण एवं परिणाम का वर्णन करें।") ||
    matchesDemoPhrase(message, "असहयोग आंदोलन के कारण एवं परिणाम का वर्णन करें") ||
    message.includes(
      "asahyog aandolan ke karan evam parinaam ka varnan karein",
    ) ||
    message.includes(
      "asahyog andolan ke karan evam parinam ka varnan karein",
    ) ||
    message.includes(
      "asahyog aandolan ke karan evam parinam ka varnan karein",
    ) ||
    matchesDemoPhrase(message, "asahyog aandolan ke karan avam parinaam ka varnan karein")
  ) {
    return `
  <h3>कारण</h3><ol><li>स्वराज्य की माँग</li><li>रॉलेट एक्ट का विरोध</li><li>जलियाँवाला बाग हत्याकांड</li><li>खिलाफत आंदोलन</li></ol><h3>परिणाम</h3><ol><li>राष्ट्रीय एकता बढ़ी।</li><li>राष्ट्रीय शिक्षण संस्थाएँ बनीं।</li><li>विदेशी वस्तुओं के बहिष्कार से ब्रिटिश व्यापार को नुकसान हुआ।</li><li>स्वदेशी और चरखे का प्रयोग बढ़ा।</li><li>कांग्रेस और गांधीजी का प्रभाव बढ़ा।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 34. सविनय अवज्ञा आंदोलन के कारणों की विवेचना करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "सविनय अवज्ञा आंदोलन के कारणों की विवेचना करें।") ||
    matchesDemoPhrase(message, "सविनय अवज्ञा आंदोलन के कारणों की विवेचना करें") ||
    message.includes(
      "savinay avagya aandolan ke karanon ki vivechana karein",
    ) ||
    matchesDemoPhrase(message, "savinay avagya aandolan ke karanon ki vivechna karein") ||
    message.includes(
      "savinay avagya aaandolan ke karanon ki vivechana karein",
    ) ||
    matchesDemoPhrase(message, "savinay avagya aandolan ke karanon ki vivechna karein")
  ) {
    return `
  <ol><li>साइमन कमीशन का विरोध।</li><li>1929 की आर्थिक मंदी का प्रभाव।</li><li>समाजवादी विचारों का बढ़ता प्रभाव।</li><li>क्रांतिकारी आंदोलनों का उभार।</li><li>पूर्ण स्वराज्य की माँग।</li><li>सरकार द्वारा गांधीजी की मांगें स्वीकार न करना।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 35. भारतीय राष्ट्रीय आंदोलन में गांधीजी के योगदान की विवेचना करें।
  // --------------------------------------------------------
  if (
    message.includes(
      "भारतीय राष्ट्रीय आंदोलन में गांधीजी के योगदान की विवेचना करें।",
    ) ||
    message.includes(
      "भारतीय राष्ट्रीय आंदोलन में गांधीजी के योगदान की विवेचना करें",
    ) ||
    message.includes(
      "bharatiya rashtriya aandolan mein gandhiji ke yogdan ki vivechana karein",
    ) ||
    message.includes(
      "bharatiya raastriya andolan mein gandhiji ke yogdan ki vivechana karein",
    ) ||
    message.includes(
      "bharatiya rashtriya aandolan mein gandhiji ke yogdan ki vivechna karein",
    ) ||
    message.includes(
      "bharatiya rashtriya aandolan mein gandhiji ke yogdan ki vivechna karein",
    )
  ) {
    return `
  <ol><li><strong>चंपारण सत्याग्रह:</strong> किसानों की समस्या को लेकर सत्याग्रह।</li><li><strong>असहयोग आंदोलन:</strong> इसे व्यापक जनभागीदारी वाला आंदोलन बनाया।</li><li><strong>सविनय अवज्ञा:</strong> दांडी मार्च और नमक कानून के विरोध के माध्यम से आंदोलन चलाया।</li><li><strong>भारत छोड़ो आंदोलन:</strong> 1942 में अंग्रेजों से भारत छोड़ने की माँग के साथ आंदोलन।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 36. सविनय अवज्ञा आंदोलन के क्या परिणाम हुए?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "सविनय अवज्ञा आंदोलन के क्या परिणाम हुए?") ||
    matchesDemoPhrase(message, "सविनय अवज्ञा आंदोलन के क्या परिणाम हुए") ||
    matchesDemoPhrase(message, "savinay avagya aandolan ke kya parinaam hue") ||
    matchesDemoPhrase(message, "savinay avagya andolan ke kya parinam hue") ||
    matchesDemoPhrase(message, "savinay avagya aandolan ke kya parinam hue") ||
    matchesDemoPhrase(message, "savinay avagya aaandolan ke kya parinaam hue")
  ) {
    return `
  <ol><li>विभिन्न वर्गों ने भाग लिया।</li><li>महिलाओं की बड़ी भागीदारी हुई।</li><li>बहिष्कार से ब्रिटिश सरकार को आर्थिक नुकसान हुआ।</li><li>संवैधानिक सुधारों का दबाव बढ़ा और 1935 के अधिनियम में प्रांतीय स्वायत्तता दी गई।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 37. भारतीय राष्ट्रीय कांग्रेस की स्थापना किन परिस्थितियों में हुई?
  // --------------------------------------------------------
  if (
    message.includes(
      "भारतीय राष्ट्रीय कांग्रेस की स्थापना किन परिस्थितियों में हुई?",
    ) ||
    message.includes(
      "भारतीय राष्ट्रीय कांग्रेस की स्थापना किन परिस्थितियों में हुई",
    ) ||
    message.includes(
      "bharatiya rashtriya congress ki sthapna kin paristhitiyon mein hui",
    ) ||
    message.includes(
      "bharatiya raashtriya congress ki sthapna kin paristhitiyon mein hui",
    ) ||
    message.includes(
      "bharatiya rashtriya congress ki sthapana kin paristhitiyon mein hui",
    ) ||
    message.includes(
      "bharatiya rashtriya congress ki sthapna kin paristhitiyon me hui",
    )
  ) {
    return `
  दमनकारी औपनिवेशिक नीतियों और बढ़ते राजनीतिक असंतोष के बीच ए. ओ. ह्यूम के प्रयासों से 28 दिसंबर 1885 को भारतीय राष्ट्रीय कांग्रेस की स्थापना हुई। डब्ल्यू. सी. बनर्जी इसके प्रथम अध्यक्ष बने।
    `;
  }

  // --------------------------------------------------------
  // 38. बिहार में किसान आंदोलन पर एक टिप्पणी लिखें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "बिहार में किसान आंदोलन पर एक टिप्पणी लिखें।") ||
    matchesDemoPhrase(message, "बिहार में किसान आंदोलन पर एक टिप्पणी लिखें") ||
    matchesDemoPhrase(message, "bihar mein kisan aandolan par ek tippani likhein") ||
    matchesDemoPhrase(message, "bihar mein kisan andolan par ek tippani likhein") ||
    matchesDemoPhrase(message, "bihar mein kisan aaandolan par ek tippani likhein") ||
    matchesDemoPhrase(message, "bihar me kisan aandolan par ek tippani likhein")
  ) {
    return `
  बिहार का प्रमुख किसान आंदोलन चंपारण में हुआ। राजकुमार शुक्ल के आग्रह पर गांधीजी वहाँ पहुँचे। तीनकठिया प्रणाली के विरोध में किसानों को संगठित किया गया और सत्याग्रह के बाद जाँच समिति की सिफारिश पर यह व्यवस्था समाप्त कर दी गई।
    `;
  }

  // --------------------------------------------------------
  // 39. स्वराज पार्टी की स्थापना और उद्देश्य की विवेचना करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "स्वराज पार्टी की स्थापना और उद्देश्य की विवेचना करें।") ||
    matchesDemoPhrase(message, "स्वराज पार्टी की स्थापना और उद्देश्य की विवेचना करें") ||
    message.includes(
      "swaraj party ki sthapna aur uddeshya ki vivechana karein",
    ) ||
    message.includes(
      "swaraj party ki sthapna aur uddeshya ki vivechna karein",
    ) ||
    message.includes(
      "swaraj party ki sthapana aur uddeshya ki vivechana karein",
    ) ||
    matchesDemoPhrase(message, "swaraj party ki sthapna aur uddeshya ki vivechna karein")
  ) {
    return `
  <p>चितरंजन दास और मोतीलाल नेहरू ने 1923 में स्वराज दल की स्थापना की।</p><h3>उद्देश्य</h3><p>चुनाव लड़कर विधान परिषदों में पहुँचना और सरकार के गलत निर्णयों का विरोध करना।</p><h3>उपलब्धियाँ</h3><ol><li>1923 के चुनाव में केंद्रीय विधान परिषद में 42 सीटें मिलीं।</li><li>मध्य प्रदेश में बहुमत मिला।</li><li>कई सरकारी प्रस्तावों का विरोध किया गया।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 40. चंपारण सत्याग्रह का संक्षिप्त विवरण दें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "चंपारण सत्याग्रह का संक्षिप्त विवरण दें।") ||
    matchesDemoPhrase(message, "चंपारण सत्याग्रह का संक्षिप्त विवरण दें") ||
    matchesDemoPhrase(message, "champaran satyagraha ka sankshipt vivaran dein") ||
    matchesDemoPhrase(message, "champaran satyagrah ka sankshipt vivaran dein") ||
    matchesDemoPhrase(message, "champaran satyagrah ka sankshipt vivaran dein") ||
    matchesDemoPhrase(message, "camparan satyagrah ka sanksipt vivaran dein")
  ) {
    return `
  चंपारण में किसानों पर तीनकठिया प्रणाली के तहत नील की खेती का दबाव था। राजकुमार शुक्ल के आग्रह पर गांधीजी पहुँचे, किसानों के पक्ष में सत्याग्रह किया और सरकार की जाँच के बाद तीनकठिया व्यवस्था समाप्त कर दी गई।
    `;
  }

  // --------------------------------------------------------
  // 41. मेरठ षड्यंत्र से आप क्या समझते हैं?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "मेरठ षड्यंत्र से आप क्या समझते हैं?") ||
    matchesDemoPhrase(message, "मेरठ षड्यंत्र से आप क्या समझते हैं") ||
    matchesDemoPhrase(message, "meerut shadyantra se aap kya samajhte hain") ||
    matchesDemoPhrase(message, "meruth shadyantra se aap kya samajhte hain") ||
    matchesDemoPhrase(message, "mirut sadyantra se ap kya samajhte hain")
  ) {
    return `
  मेरठ षड्यंत्र केस मजदूर आंदोलन और कम्युनिस्ट गतिविधियों से जुड़े नेताओं पर औपनिवेशिक सरकार द्वारा चलाया गया मुकदमा था। इसका उद्देश्य संगठित मजदूर और वामपंथी गतिविधियों पर नियंत्रण करना था।
    `;
  }

  // --------------------------------------------------------
  // 42. ऑल इंडिया ट्रेड यूनियन कांग्रेस की स्थापना क्यों हुई?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "ऑल इंडिया ट्रेड यूनियन कांग्रेस की स्थापना क्यों हुई?") ||
    matchesDemoPhrase(message, "ऑल इंडिया ट्रेड यूनियन कांग्रेस की स्थापना क्यों हुई") ||
    matchesDemoPhrase(message, "all india trade union congress ki sthapna kyon hui") ||
    matchesDemoPhrase(message, "all india trade union congress ki sthapna kyu hui") ||
    matchesDemoPhrase(message, "all india trade union congress ki sthapna kyo hui") ||
    matchesDemoPhrase(message, "all india trade union congress ki sthapana kyon hui")
  ) {
    return `
  ऑल इंडिया ट्रेड यूनियन कांग्रेस की स्थापना 1920 में मजदूरों को संगठित करने और उनके अधिकारों तथा हितों की रक्षा के लिए हुई। इसके प्रथम अध्यक्ष लाला लाजपत राय थे।
    `;
  }

  // --------------------------------------------------------
  // 43. प्रथम विश्व युद्ध का भारतीय राष्ट्रीय आंदोलन के साथ अंतर्संबंधों की विवेचना करें।
  // --------------------------------------------------------
  if (
    message.includes(
      "प्रथम विश्व युद्ध का भारतीय राष्ट्रीय आंदोलन के साथ अंतर्संबंधों की विवेचना करें।",
    ) ||
    message.includes(
      "प्रथम विश्व युद्ध का भारतीय राष्ट्रीय आंदोलन के साथ अंतर्संबंधों की विवेचना करें",
    ) ||
    message.includes(
      "pratham vishva yuddh ka bharatiya rashtriya aandolan ke saath antarsambandhon ki vivechana karein",
    ) ||
    message.includes(
      "pratham vishva yuddh ka bharatiya rashtriya aandolan ke saath antarsambandhon ki vivechna karein",
    ) ||
    message.includes(
      "pratam visva yudd ka baratiya rastriya andolan ke sat antarsambandon ki vivecana karein",
    ) ||
    message.includes(
      "pratham vishva yuddh ka bharatiya rashtriya aaandolan ke saath antarsambandhon ki vivechana karein.",
    ) ||
    message.includes(
      "pratham vishva yuddh ka bharatiya rashtriya aandolan ke saath antarsambandhon ki vivechna karein.",
    )
  ) {
    return `
  <ol><li>ब्रिटेन ने भारतीय सहयोग पाने के लिए युद्ध के बाद राजनीतिक सुधारों का आश्वासन दिया।</li><li>भारतीय नेताओं के एक हिस्से ने ब्रिटेन का सहयोग किया।</li><li>होमरूल आंदोलन से स्वशासन की माँग तेज हुई।</li><li>विदेशों में गदर पार्टी जैसी क्रांतिकारी गतिविधियाँ हुईं।</li><li>कांग्रेस के विभिन्न समूहों और मुस्लिम लीग के बीच 1916 का समझौता हुआ।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 44. जन आंदोलन से क्या तात्पर्य है?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "जन आंदोलन से क्या तात्पर्य है?") ||
    matchesDemoPhrase(message, "जन आंदोलन से क्या तात्पर्य है") ||
    matchesDemoPhrase(message, "jan aandolan se kya tatparya hai") ||
    matchesDemoPhrase(message, "jan aandolan se kya tatpraya hai") ||
    matchesDemoPhrase(message, "jan andolan se kya tatparya hai") ||
    matchesDemoPhrase(message, "jan aaandolan se kya tatparya hai") ||
    matchesDemoPhrase(message, "jan aan2lan se kya tatparya hai")
  ) {
    return `
  ऐसा आंदोलन जिसमें बड़ी संख्या में आम लोग राजनीतिक रूप से सक्रिय होकर भाग लेते हैं, जन आंदोलन कहलाता है। असहयोग आंदोलन को व्यापक जनभागीदारी के कारण पहला बड़ा भारतीय जन आंदोलन माना जाता है।
    `;
  }

  // --------------------------------------------------------
  // 45. हिन्द-चीन में उपनिवेश स्थापना का उद्देश्य क्या था?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "हिन्द-चीन में उपनिवेश स्थापना का उद्देश्य क्या था?") ||
    matchesDemoPhrase(message, "हिन्दचीन में उपनिवेश स्थापना का उद्देश्य क्या था") ||
    matchesDemoPhrase(message, "hind-china mein upnivesh sthapna ka uddeshya kya tha") ||
    matchesDemoPhrase(message, "hindchina mein upnives stapna ka uddesya kya tha") ||
    matchesDemoPhrase(message, "hind china mein upnivesh sthapana ka uddeshya kya tha") ||
    matchesDemoPhrase(message, "hind china mein upnivesh sthapna ka uddeshya kya tha") ||
    matchesDemoPhrase(message, "hind chin mein upnivesh sthapana ka uddeshya kya tha") ||
    matchesDemoPhrase(message, "hind chin mein upnivesh sthapna ka uddeshya kya tha") ||
    matchesDemoPhrase(message, "hind-china me upnivesh sthapna ka uddeshya kya tha")
  ) {
    return `
  <ol><li><strong>आर्थिक कारण:</strong> उपजाऊ भूमि और चावल, रबर, कोयला, टिन, जस्ता आदि संसाधन।</li><li><strong>सभ्य बनाने की नीति:</strong> यूरोपीय शक्तियाँ अपनी संस्कृति को श्रेष्ठ मानती थीं।</li><li><strong>व्यापारिक सुरक्षा:</strong> दक्षिण-पूर्व एशिया में अपने व्यापारिक हितों की रक्षा।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 46. माई ली गाँव की घटना क्या थी? इसका क्या प्रभाव पड़ा?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "माई ली गाँव की घटना क्या थी? इसका क्या प्रभाव पड़ा?") ||
    matchesDemoPhrase(message, "माई ली गाँव की घटना क्या थी इसका क्या प्रभाव पड़ा") ||
    matchesDemoPhrase(message, "my li gaon ki ghatna kya thi iska kya prabhav pada") ||
    matchesDemoPhrase(message, "mai li gaon ki ghatna kya thi iska kya prabhav pada") ||
    matchesDemoPhrase(message, "myli gaon ki ghatna kya thi iska kya prabhav pada") ||
    matchesDemoPhrase(message, "maili gaon ki ghatna kya thi iska kya prabhav pada") ||
    matchesDemoPhrase(message, "my lai gaon ki ghatna kya thi iska kya prabav pada")
  ) {
    return `
  1968 में माई ली गाँव में अमेरिकी सैनिकों द्वारा नागरिकों पर गंभीर अत्याचार और हत्याएँ की गईं। घटना सामने आने के बाद अमेरिका की युद्ध नीति के विरुद्ध आलोचना और विरोध बढ़ा।
    `;
  }

  // --------------------------------------------------------
  // 47. राष्ट्रपति निक्सन की हिन्द-चीन में शांति के संबंध में पाँच सूत्री योजना क्या थी?
  // --------------------------------------------------------
  if (
    message.includes(
      "राष्ट्रपति निक्सन की हिन्द-चीन में शांति के संबंध में पाँच सूत्री योजना क्या थी?",
    ) ||
    message.includes(
      "राष्ट्रपति निक्सन की हिन्दचीन में शांति के संबंध में पाँच सूत्री योजना क्या थी",
    ) ||
    message.includes(
      "rashtrapati nixon ki hind-china mein shanti ke sambandh mein paanch sutri yojana kya thi",
    ) ||
    message.includes(
      "rashtrapati nixon ki hind-china mein shanti ke sambandh mein paanch sutri yojna kya thi",
    ) ||
    message.includes(
      "rashtrapati nikson ki hind-china mein shanti ke sambandh mein paanch sutri yojana kya thi",
    ) ||
    message.includes(
      "rashtrapati nikson ki hind-china mein shanti ke sambandh mein paanch sutri yojna kya thi",
    ) ||
    message.includes(
      "rastrapati nixon ki hindcina mein santi ke samband mein panc sutri yojana kya ti",
    ) ||
    message.includes(
      "rashtrapati nixon ki hind-china me shanti ke sambandh me paanch sutri yojana kya thi",
    ) ||
    message.includes(
      "rastrapati nixon ki hindcina me santi ke samband me panc sutri yojana kya ti",
    )
  ) {
    return `
  <ol><li>सेनाएँ युद्ध बंद करके यथास्थान रहें।</li><li>अंतरराष्ट्रीय पर्यवेक्षक युद्धविराम की निगरानी करें।</li><li>कोई देश सैन्य शक्ति न बढ़ाए।</li><li>सभी लड़ाइयाँ बंद रहें।</li><li>अंतिम लक्ष्य पूरे हिन्द-चीन में संघर्ष का अंत हो।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 48. फ्रांसीसी शासन के साथ-साथ उसके द्वारा किए गए सकारात्मक कार्यों की समीक्षा करें।
  // --------------------------------------------------------
  if (
    message.includes(
      "फ्रांसीसी शासन के साथ-साथ उसके द्वारा किए गए सकारात्मक कार्यों की समीक्षा करें।",
    ) ||
    message.includes(
      "फ्रांसीसी शासन के साथसाथ उसके द्वारा किए गए सकारात्मक कार्यों की समीक्षा करें।",
    ) ||
    message.includes(
      "french shasan ke sath-sath uske dwara kiye gaye sakaratmak karyon ki samiksha karein",
    ) ||
    message.includes(
      "fransisi shasan ke sath-sath uske dwara kiye gaye sakaratmak karyon ki samiksha karein",
    ) ||
    message.includes(
      "fransisi shasan ke sath-sath uske dwara kiye gaye sakaratmak karyo ki samiksha karein",
    ) ||
    message.includes(
      "fransisi shasan ke sath sath uske dwara kiye gaye sakaratmak karyon ki samiksha karein",
    ) ||
    message.includes(
      "fransisi shasan ke sath sath uske dwara kiye gaye sakaratmak karyo ki samiksha karein",
    ) ||
    message.includes(
      "frenc sasan ke satsat uske dwara kiye gaye sakaratmak karyon ki samiksa karein",
    ) ||
    message.includes(
      "french shasan ke saath-saath uske dwara kiye gaye sakaratmak karyon ki sameeksha karein",
    )
  ) {
    return `
  <ol><li>नगर और बंदरगाहों का विकास।</li><li>सिंचाई और कृषि क्षेत्र का विकास।</li><li>सड़क और रेल जैसी आधारभूत संरचना का विस्तार।</li></ol><p>इन कार्यों का उद्देश्य औपनिवेशिक हित था, लेकिन उनसे कुछ बुनियादी सुविधाओं का विस्तार भी हुआ।</p>
    `;
  }

  // --------------------------------------------------------
  // 49. हिन्द-चीन में राष्ट्रवाद के विकास का वर्णन करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "हिन्द-चीन में राष्ट्रवाद के विकास का वर्णन करें।") ||
    matchesDemoPhrase(message, "हिन्दचीन में राष्ट्रवाद के विकास का वर्णन करें।") ||
    matchesDemoPhrase(message, "hind-china mein rashtravad ke vikas ka varnan karein") ||
    matchesDemoPhrase(message, "hind china mein rashtravad ke vikas ka varnan karein") ||
    matchesDemoPhrase(message, "hind chin mein rashtravad ke vikas ka varnan karein") ||
    matchesDemoPhrase(message, "hindcina mein rastravad ke vikas ka varnan karein") ||
    matchesDemoPhrase(message, "hind-china mein rashtravad ke vikas ka varnan kare") ||
    matchesDemoPhrase(message, "hind-china mein rastravad ke vikas ka varnan karein")
  ) {
    return `
  <ol><li>फ्रांस की शिक्षा नीति के विरुद्ध असंतोष।</li><li>औपनिवेशिक आर्थिक शोषण के विरुद्ध प्रतिक्रिया।</li><li>चीन और जापान से प्रेरणा।</li><li>छात्रों और राष्ट्रवादियों द्वारा राजनीतिक संगठनों का निर्माण।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 50. जेनेवा समझौता कब और किनके बीच हुआ?
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "जेनेवा समझौता कब और किनके बीच हुआ?") ||
    matchesDemoPhrase(message, "जेनेवा समझौता कब और किनके बीच हुआ") ||
    matchesDemoPhrase(message, "geneva samjhauta kab aur kin ke beech hua") ||
    matchesDemoPhrase(message, "geneva samjhauta kab aur kin ke bich hua") ||
    matchesDemoPhrase(message, "genewa samjhauta kab aur kin ke bich hua") ||
    matchesDemoPhrase(message, "genewa samjhauta kab aur kin ke beech hua") ||
    matchesDemoPhrase(message, "jeneva samjhauta kab aur kin ke bich hua") ||
    matchesDemoPhrase(message, "jeneva samjhauta kab aur kin ke beech hua") ||
    matchesDemoPhrase(message, "geneva samjhauta kab aur kin ke bich hua?") ||
    matchesDemoPhrase(message, "geneva samjhauta kab aur kin ke bich mein hua?")
  ) {
    return `
  1954 में जेनेवा समझौता हुआ। हिन्द-चीन से संबंधित पक्षों में फ्रांस, वियतनामी पक्ष और अन्य अंतरराष्ट्रीय शक्तियाँ शामिल थीं। समझौते के बाद वियतनाम को अस्थायी रूप से उत्तर और दक्षिण क्षेत्रों में बाँटा गया।
    `;
  }

  // --------------------------------------------------------
  // 51. होआ-होआ आंदोलन की चर्चा करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "होआ-होआ आंदोलन की चर्चा करें।") ||
    matchesDemoPhrase(message, "होआहोआ आंदोलन की चर्चा करें।") ||
    matchesDemoPhrase(message, "hoa-hoa aandolan ki charcha karein") ||
    matchesDemoPhrase(message, "hoa hoa aandolan ki charcha karein") ||
    matchesDemoPhrase(message, "hoahoa andolan ki charcha karein") ||
    matchesDemoPhrase(message, "hoa hoa andolan ki charcha karein") ||
    matchesDemoPhrase(message, "hoa-hoa aandolan ki charcha kare") ||
    matchesDemoPhrase(message, "hoa-hoa aaandolan ki charcha karein")
  ) {
    return `
  1939 में मेकांग क्षेत्र में होआ-होआ आंदोलन हुआ। इसका नेतृत्व हुइन्ह फू सो ने किया। उन्होंने गरीब और निराश लोगों की सहायता की और उनका प्रभाव बढ़ा। सरकार ने इसे रोकने के लिए दमनात्मक कार्रवाई की।
    `;
  }

  // --------------------------------------------------------
  // 52. हिन्द-चीन में फ्रांसीसी प्रसार का वर्णन करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "हिन्द-चीन में फ्रांसीसी प्रसार का वर्णन करें।") ||
    matchesDemoPhrase(message, "हिन्दचीन में फ्रांसीसी प्रसार का वर्णन करें।") ||
    matchesDemoPhrase(message, "hind-china mein fransisi prasar ka varnan karein") ||
    matchesDemoPhrase(message, "hindchina mein fransisi prasar ka varnan karein") ||
    matchesDemoPhrase(message, "hind china mein fransisi prasar ka varnan karein") ||
    matchesDemoPhrase(message, "hind chin mein fransisi prasar ka varnan karein") ||
    matchesDemoPhrase(message, "hind-china mein french prasar ka varnan kare") ||
    matchesDemoPhrase(message, "hind-china me french prasar ka varnan karein")
  ) {
    return `
  <ol><li>अन्नाम से राजनयिक संबंध।</li><li>कोचीन-चीन पर प्रभाव।</li><li>कोचीन-चीन में औपनिवेशिक नियंत्रण।</li><li>1863 में कंबोडिया संरक्षित राज्य।</li><li>1873 में तोकिन के क्षेत्रों पर अधिकार।</li><li>1884 में अन्नाम संरक्षित राज्य।</li><li>1893 में लाओस संरक्षित राज्य।</li></ol>
    `;
  }

  // --------------------------------------------------------
  // 53. रासायनिक हथियार और एजेंट ऑरेंज का वर्णन करें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "रासायनिक हथियार और एजेंट ऑरेंज का वर्णन करें।") ||
    matchesDemoPhrase(message, "रासायनिक हथियार और एजेंट ऑरेंज का वर्णन करें") ||
    matchesDemoPhrase(message, "rasayanik hathiyar aur agent orange ka varnan karein") ||
    matchesDemoPhrase(message, "rashayanik hathiyar aur agent orange ka varnan karein") ||
    matchesDemoPhrase(message, "rasayanik hathiyaar aur agent orange ka varnan karein") ||
    message.includes(
      "rashayanik hathiyaar aur agent orange ka varnan karein",
    ) ||
    matchesDemoPhrase(message, "rasayanik hatiyar aur agent orange ka varnan karein") ||
    matchesDemoPhrase(message, "rasayanik hathiyar aur agent orange ka varnan kare") ||
    message.includes(
      "rasayanik hathiyar aur agent orange ke bare mein batayein",
    )
  ) {
    return `
  रासायनिक हथियार ऐसे पदार्थ हैं जिनका उपयोग जीवों को नुकसान पहुँचाने के लिए किया जाता है। वियतनाम युद्ध में एजेंट ऑरेंज का उपयोग जंगलों की वनस्पति नष्ट करने के लिए किया गया, जिससे जंगलों और खेतों को भारी नुकसान हुआ।
    `;
  }

  // --------------------------------------------------------
  // 54. हो ची मिन्ह के विषय में संक्षिप्त में लिखें।
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "हो ची मिन्ह के विषय में संक्षिप्त में लिखें।") ||
    matchesDemoPhrase(message, "हो ची मिन्ह के विषय में संक्षिप्त में लिखें") ||
    matchesDemoPhrase(message, "ho chi minh ke vishay mein sankshipt mein likhein") ||
    matchesDemoPhrase(message, "ho chi minh ke visay mein sankshipt mein likhein") ||
    matchesDemoPhrase(message, "ho chi minh ke vishay mein sankshep mein likhein") ||
    matchesDemoPhrase(message, "ho chi minh ke vishay me sankshipt me likhein")
  ) {
    return `
  हो ची मिन्ह वियतनाम के प्रमुख स्वतंत्रता सेनानी और नेता थे। वे मार्क्सवादी विचारों से प्रभावित हुए, वियतनामी कम्युनिस्ट आंदोलन में प्रमुख भूमिका निभाई और द्वितीय विश्व युद्ध के दौरान वियेतमिन्ह के माध्यम से स्वतंत्रता संघर्ष चलाया। 1945 में वियतनाम की स्वतंत्रता की घोषणा में उनकी प्रमुख भूमिका थी।
    `;
  }

  if (
    message.includes(
      "bihar board class 10 ke liye agle 3 mahine ka revision plan",
    ) ||
    message.includes(
      "class 10th bihar board examination revision plan for next three months",
    ) ||
    matchesDemoPhrase(message, "3 months study plan to get 90% + in 10th bseb") ||
    matchesDemoPhrase(message, "bihar board 10th ke liye 90% marks kaise laayein") ||
    matchesDemoPhrase(message, "class 10 ka 3 month study plan") ||
    matchesDemoPhrase(message, "bihar board class 10 revision plan") ||
    matchesDemoPhrase(message, "class 10th ka revision plan batao") ||
    matchesDemoPhrase(message, "90% marks lane ke liye study plan")
  ) {
    return `
      <h2>Bihar Board Class 10: 3 Mahine ka Revision Plan 🎯</h2>

      <p><strong>Target: 90%+ Marks | Hindi Medium Students ke liye</strong></p>

      <p>
        Agar tum Bihar Board Class 10 ki taiyari kar rahe ho aur agle
        3 mahine mein 90% se zyada marks lana chahte ho, toh tumhe ek
        proper study plan follow karna hoga.
      </p>

      <p>
        Sirf kitab padhne se achhe marks nahi aate. Tumhe concepts
        samajhne, questions solve karne, baar-baar revision karne aur
        model papers ki practice karne ki zarurat hai.
      </p>

      <p>Chalo, samajhte hain ki agle 90 din kaise plan karne hain.</p>

      <h3>1. Pehle Apna Target Samjho 🎯</h3>

      <p>Agar tumhare exam ka total 500 marks hai, toh:</p>

      <ul>
        <li>90% = 450 marks</li>
        <li>92% = 460 marks</li>
        <li>95% = 475 marks</li>
      </ul>

      <p>
        Isliye practice tests mein 460–475 marks lane ka target rakho,
        taaki final examination mein bhi 90%+ score karne ka achha
        chance rahe.
      </p>

      <p>
        <em>
          Note: Apne examination ke applicable total marks aur
          subject-wise assessment rules ko zaroor check karna.
        </em>
      </p>

      <h3>2. Teen Mahine ka Complete Study Plan 📚</h3>

      <h4>Month 1: Syllabus Revision aur Concepts Strong Karna</h4>

      <p>
        Pehle mahine ka main target hai ki tum apne syllabus ke chapters
        ko achhe se samajh lo aur unki pehli revision complete karo.
      </p>

      <p><strong>Mathematics:</strong></p>
      <ul>
        <li>Har din formulas revise karo.</li>
        <li>Textbook ke solved examples aur exercises solve karo.</li>
        <li>
          Algebra (बीजगणित), Geometry (ज्यामिति),
          Trigonometry (त्रिकोणमिति), Statistics (सांख्यिकी)
          aur syllabus ke doosre chapters ki practice karo.
        </li>
      </ul>

      <p><strong>Science:</strong></p>
      <ul>
        <li>Physics mein formulas aur numericals par focus karo.</li>
        <li>Chemistry mein chemical reactions, equations aur important concepts samjho.</li>
        <li>Biology mein diagrams, definitions aur biological processes revise karo.</li>
      </ul>

      <p><strong>Social Science:</strong></p>
      <ul>
        <li>History mein events, causes aur consequences samjho.</li>
        <li>Geography mein resources, agriculture, industries aur maps ki practice karo.</li>
        <li>Civics aur Economics mein important concepts, definitions aur differences revise karo.</li>
      </ul>

      <p><strong>Hindi aur Urdu:</strong></p>
      <ul>
        <li>Prose, poetry, grammar aur writing section ki taiyari karo.</li>
        <li>Important questions ke answers likhkar practice karo.</li>
      </ul>

      <p><strong>English (Optional):</strong></p>
      <ul>
        <li>Basic grammar, textbook chapters aur writing formats par kaam karo.</li>
      </ul>

      <p>
        <strong>Month 1 ka target:</strong>
        Syllabus ka pehla revision complete karna aur weak chapters ki list banana.
      </p>

      <h4>Month 2: Question Practice aur Second Revision</h4>

      <p>
        Doosre mahine mein sirf padhne ke bajaye questions solve karne
        par zyada focus karo.
      </p>

      <ul>
        <li>Mathematics mein roz 15–25 questions solve karne ki koshish karo.</li>
        <li>Science mein MCQs, short answers, long answers aur numericals practise karo.</li>
        <li>Social Science mein chapter-wise questions aur point-wise answers likho.</li>
        <li>Hindi aur Urdu mein grammar, literature aur writing questions ki practice karo.</li>
        <li>English mein comprehension, grammar aur writing formats revise karo.</li>
        <li>Previous-year questions aur available official model papers solve karo.</li>
      </ul>

      <p>
        Har hafte kam se kam ek timed subject test do. Test ke baad
        apni mistakes ko analyse karo.
      </p>

      <p>
        <strong>Month 2 ka target:</strong>
        Questions solve karne ki speed badhana, concepts ko yaad rakhna
        aur answer-writing improve karna.
      </p>

      <h4>Month 3: Mock Tests aur Final Revision</h4>

      <p>Aakhri mahina examination practice ke liye sabse important hai.</p>

      <p><strong>Week 9:</strong></p>
      <ul>
        <li>Maths aur Science ke full-length papers solve karo.</li>
        <li>Apne weak chapters ko dobara revise karo.</li>
      </ul>

      <p><strong>Week 10:</strong></p>
      <ul>
        <li>Social Science ke model papers solve karo.</li>
        <li>History, Geography, Civics aur Economics ke important topics revise karo.</li>
      </ul>

      <p><strong>Week 11:</strong></p>
      <ul>
        <li>Hindi aur Urdu ke complete papers practise karo.</li>
        <li>English ke grammar aur writing section ki revision karo.</li>
        <li>Exam ke time limit ke andar paper complete karne ki practice karo.</li>
      </ul>

      <p><strong>Week 12:</strong></p>
      <ul>
        <li>Sabhi subjects ke formulas, definitions, diagrams, dates aur important points revise karo.</li>
        <li>Apni mistake notebook dobara dekho.</li>
        <li>Naye bade topics shuru karne ke bajaye pehle se padhe hue topics ko strong karo.</li>
        <li>Puri neend lo aur examination se pehle apna routine stable rakho.</li>
      </ul>

      <p>
        <strong>Month 3 ka target:</strong>
        Exam mein speed, accuracy aur confidence ke saath paper solve karna.
      </p>

      <h3>3. Roz ka Study Timetable 🕒</h3>

      <p>
        Agar tum school bhi jaate ho, toh apni suvidha ke hisaab se
        timetable adjust kar sakte ho.
      </p>

      <table>
        <thead>
          <tr>
            <th>Samay</th>
            <th>Subject / Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>6:00–7:30 AM</td><td>Mathematics</td></tr>
          <tr><td>7:30–8:00 AM</td><td>Break aur breakfast</td></tr>
          <tr><td>4:00–5:00 PM</td><td>Science</td></tr>
          <tr><td>5:00–5:30 PM</td><td>Break</td></tr>
          <tr><td>5:30–6:15 PM</td><td>Social Science</td></tr>
          <tr><td>6:15–7:00 PM</td><td>Hindi</td></tr>
          <tr><td>7:00–7:45 PM</td><td>Urdu</td></tr>
          <tr><td>8:00–8:30 PM</td><td>English (Optional)</td></tr>
          <tr><td>8:30–9:00 PM</td><td>MCQs, revision aur self-test</td></tr>
        </tbody>
      </table>

      <p>
        Yeh ek sample timetable hai. Agar tumhare paas kam samay hai,
        toh subjects ko alternate days par rotate kar sakte ho. Roz har
        subject padhna zaroori nahi hai, lekin kisi bhi subject ko kai
        din tak poori tarah ignore mat karna.
      </p>

      <h3>4. Har Subject ko Padhne ka Sahi Tarika 📖</h3>

      <h4>Mathematics</h4>
      <ol>
        <li>Formula samjho aur yaad karo.</li>
        <li>Solved example dekho.</li>
        <li>Bina solution dekhe khud question solve karo.</li>
        <li>Galat questions ko dobara solve karo.</li>
      </ol>

      <p>
        <strong>Example:</strong>
        Agar tum Quadratic Equations padh rahe ho, toh pehle formula
        samjho, phir 10 questions solve karo aur agle din galat
        questions ko phir se attempt karo.
      </p>

      <h4>Science</h4>
      <ul>
        <li><strong>Physics:</strong> Formulas, units, numericals aur diagrams.</li>
        <li><strong>Chemistry:</strong> Chemical equations, reactions, properties aur definitions.</li>
        <li><strong>Biology:</strong> Life processes, diagrams, functions aur important differences.</li>
      </ul>

      <p>
        Har chapter padhne ke baad kitab band karke khud se questions
        poochho. Isse pata chalega ki tumhe sach mein kitna yaad hai.
      </p>

      <h4>Social Science</h4>
      <ul>
        <li><strong>History:</strong> Events, causes, consequences aur important dates.</li>
        <li><strong>Geography:</strong> Resources, agriculture, industries, maps aur environmental topics.</li>
        <li><strong>Civics:</strong> Democracy, political institutions, power sharing aur syllabus ke relevant concepts.</li>
        <li><strong>Economics:</strong> Development, sectors of the economy, money, credit aur relevant textbook topics.</li>
      </ul>

      <p>
        Answers ko chhote, clear aur numbered points mein likhne ki
        practice karo.
      </p>

      <h4>Hindi aur Urdu</h4>
      <ul>
        <li>Literature ke chapters aur poems revise karo.</li>
        <li>Grammar ke questions daily practise karo.</li>
        <li>Writing section ke formats seekho.</li>
        <li>Answers ko saaf aur readable handwriting mein likho.</li>
        <li>Sirf answers ratne ke bajaye unka meaning bhi samjho.</li>
      </ul>

      <h4>English (Optional)</h4>
      <ul>
        <li>Basic grammar aur vocabulary improve karo.</li>
        <li>Textbook ke chapters aur poems revise karo.</li>
        <li>Comprehension aur writing questions solve karo.</li>
        <li>Har hafte ek chhota English test do.</li>
      </ul>

      <p>
        English optional hai, lekin agar tumhare examination mein iska
        score final result ko affect karta hai, toh ise poori tarah
        ignore mat karna.
      </p>

      <h3>5. Revision ka 4-Step Formula 🧠</h3>

      <p><strong>Step 1: Samjho</strong> — 30–40 minute textbook aur concepts par kaam karo.</p>

      <p><strong>Step 2: Yaad Karo</strong> — Kitab band karke important points likho.</p>

      <p><strong>Step 3: Questions Solve Karo</strong> — 20–30 minute written practice karo.</p>

      <p><strong>Step 4: Dobara Revise Karo</strong> — Agle din, ek hafte baad aur phir final revision ke samay chapter test karo.</p>

      <p>
        Yaad rakho: Answer ko dekhkar pehchan lena aur bina dekhe
        sahi answer likh pana dono alag cheezein hain.
      </p>

      <h3>6. 90%+ Marks ke Liye 5 Rules ✅</h3>

      <ol>
        <li>Har din apna study target complete karne ki koshish karo.</li>
        <li>Textbook aur official model papers ko priority do.</li>
        <li>Har hafte apni mistakes analyse karo.</li>
        <li>Mobile aur social media ka unnecessary use kam karo.</li>
        <li>Padhai ke saath proper sleep aur short breaks bhi lo.</li>
      </ol>

      <p>
        Har Sunday apna test lo aur marks note karo. Agar Maths mein
        60/100 aa rahe hain, toh sirf aur zyada ghante padhne ke bajaye
        dekho ki marks kahan kat rahe hain: formulas, calculations,
        concepts ya time management.
      </p>

      <h3>7. Aaj Se Kya Shuru Karna Hai? 📝</h3>

      <p>
        Aaj hi ek notebook banao aur usmein sabhi subjects ke chapters
        ki list likho.
      </p>

      <p>Har chapter ke saamne teen columns banao:</p>

      <ul>
        <li><strong>Not Started:</strong> Abhi padhna baaki hai.</li>
        <li><strong>Revision Needed:</strong> Ek baar padh liya hai, lekin practice baaki hai.</li>
        <li><strong>Strong:</strong> Questions bina madad ke solve kar sakte ho.</li>
      </ul>

      <p>Har hafte is list ko update karo.</p>

      <p>
        Sabse important baat: 90%+ marks ka koi guaranteed shortcut
        nahi hai. Lekin agar tum agle 3 mahine consistently padhte ho,
        written practice karte ho aur apni mistakes sudharte ho, toh
        apne score ko kaafi improve kar sakte ho.
      </p>

      <p>
        <strong>
          Ab mujhe batao: tumhara syllabus kitna complete hai aur abhi
          tests mein lagbhag kitne marks aa rahe hain?
        </strong>
        Main uske hisaab se tumhare liye aur bhi personalised study
        plan bana sakta hoon.
      </p>
    `;
  }

  // --------------------------------------------------------
  // PASTED Q&A — NEWTON'S THIRD LAW (MathJax only in this answer)
  // --------------------------------------------------------
  if (
    matchesDemoPhrase(message, "what is newton's third law") ||
    matchesDemoPhrase(message, "explain newton's third law") ||
    matchesDemoPhrase(message, "explain newton's third law of motion") ||
    matchesDemoPhrase(message, "newton third law") ||
    matchesDemoPhrase(message, "newton's third law of motion") ||
    matchesDemoPhrase(message, "newton ke third law") ||
    matchesDemoPhrase(message, "newton ka third law")
  ) {
    return `
    <h3>Newton's Third Law of Motion 🚀</h3>

    <p>Socho tum kisi ko push karte ho aur woh bhi tumhe wapas push kar de! 😆</p>

    <p>Bas, Newton ka Third Law bhi kuch aisa hi kehta hai. Lekin yahan koi badla nahi le raha, ye toh Physics ka universal rule hai! 🌍</p>

    <h4>1. Newton's Third Law Kya Kehta Hai? 📖</h4>

    <p><strong>न्यूटन के गति के तृतीय नियम के अनुसार, प्रत्येक क्रिया के बराबर तथा विपरीत दिशा में प्रतिक्रिया होती है।</strong></p>

    <p>English mein:</p>

    <p><strong>"For every action, there is an equal and opposite reaction."</strong></p>

    <p>Matlab jab ek object doosre object par force lagata hai, toh doosra object bhi pehle object par utna hi force lagata hai, lekin opposite direction mein.</p>

    <p>Ye dono forces ek hi time par lagte hain aur alag-alag objects par act karte hain.</p>

    <h4>2. Ek Simple Example Se Samjho 😎</h4>

    <p>Maan lo tum ek wall ke saamne khade ho.</p>

    <p>Tum wall ko dekhkar kehte ho:</p>

    <p><strong>"Hatt ja mere raaste se!" 😤</strong></p>

    <p>Aur phir wall ko zor se push karte ho.</p>

    <p>Lekin wall toh apni jagah se hilti hi nahi! 😂</p>

    <p>Ab tum sochoge, "Maine toh force lagaya, phir wall ne kuch kiya kyun nahi?"</p>

    <p>Physics kehti hai: <strong>Wall ne bhi tumhare haath par utna hi force lagaya, bas opposite direction mein!</strong></p>

    <ul>
      <li><strong>Action:</strong> Tum wall par force lagate ho.</li>
      <li><strong>Reaction:</strong> Wall tumhare haath par equal aur opposite force lagati hai.</li>
    </ul>

    <p>Isi wajah se zor se push karne par tumhare haath mein dard bhi ho sakta hai. 😅</p>

    <p>Wall visibly move nahi karti kyunki woh ground aur building ke structure se supported hoti hai.</p>

    <p><strong>Yaad rakho:</strong> Wall ka na hilna ye prove nahi karta ki reaction force nahi laga!</p>

    <h4>3. Mathematical Formula 🧮</h4>

    <p>Ab Newton ke is rule ko Mathematics ki language mein samajhte hain.</p>

    <div class="math-equation">
      \\[
        F_{A \\rightarrow B} = -F_{B \\rightarrow A}
      \\]
    </div>

    <p><strong>Yahan:</strong></p>

    <ul>
      <li><strong>F</strong> = Force (Bal).</li>
      <li><strong>A → B</strong> = Object A dwara object B par lagaya gaya force.</li>
      <li><strong>B → A</strong> = Object B dwara object A par lagaya gaya force.</li>
      <li><strong>Minus (−)</strong> = Forces opposite directions mein hain.</li>
    </ul>

    <p>Dono forces ki magnitude equal hoti hai, lekin direction opposite hoti hai.</p>

    <p><strong>Important:</strong> Force ek vector quantity hai, isliye direction bhi matter karti hai.</p>

    <h4>4. Rocket Space Mein Kaise Udta Hai? 🚀🔥</h4>

    <p>Ab aata hai Newton ke Third Law ka ek zabardast example!</p>

    <p>Socho ek rocket launch hone wala hai.</p>

    <p>Rocket ke engine se bahut high speed par hot gases neeche ki taraf nikalti hain.</p>

    <p>Rocket gases ko neeche ki taraf force lagata hai aur gases rocket par upar ki taraf equal aur opposite force lagati hain.</p>

    <p><strong>Action:</strong> Rocket gases ko neeche push karta hai.</p>

    <p><strong>Reaction:</strong> Gases rocket ko upar push karti hain.</p>

    <div class="math-equation">
      \\[
        F_{\\text{rocket on gas}} = -F_{\\text{gas on rocket}}
      \\]
    </div>

    <p>Is upward thrust ki wajah se rocket accelerate kar sakta hai. Launch ke waqt rocket ko upar accelerate karne ke liye thrust ka weight se zyada hona zaroori hai.</p>

    <p>Ab imagine karo rocket aur gases ki conversation! 😂</p>

    <p><strong>🚀 Rocket:</strong> "Bhai, tum neeche jao!"</p>

    <p><strong>💨 Gases:</strong> "Theek hai bhai, tum upar chale jao!"</p>

    <p><strong>🚀 Rocket:</strong> "Thank you, milte hain space mein!" 😎</p>

    <p>Ek interesting fact: Rocket ko aage badhne ke liye hawa ko push karna zaroori nahi hota. Isi principle par rocket space ke vacuum mein bhi kaam karta hai.</p>

    <h4>5. Numerical Example ✍️</h4>

    <p>Ab ek chhota sa numerical solve karte hain. Board exam mein bhi aise conceptual questions aa sakte hain.</p>

    <p><strong>Question:</strong> Ek ladka deewar ko 20 N ke force se dhakka deta hai. Deewar ladke par kitna force lagayegi?</p>

    <p><strong>Given:</strong></p>

    <p>Ladke dwara deewar par lagaya gaya force:</p>

    <div class="math-equation">
      \\[
        F_{\\text{ladka on deewar}} = +20\\,N
      \\]
    </div>

    <p><strong>Formula:</strong></p>

    <div class="math-equation">
      \\[
        F_{\\text{deewar on ladka}}
        = -F_{\\text{ladka on deewar}}
      \\]
    </div>

    <p><strong>Values put karne par:</strong></p>

    <div class="math-equation">
      \\[
        F_{\\text{deewar on ladka}} = -20\\,N
      \\]
    </div>

    <p><strong>Final Answer:</strong> Deewar ladke par <strong>20 N</strong> ka force lagayegi, jo ladke ke lagaye gaye force ki opposite direction mein hoga. ✅</p>

    <p>Matlab tumne wall ko 20 N se push kiya, toh wall ne bhi tumhe 20 N ka reaction force diya! 😄</p>

    <h4>6. Sabse Important Concept 🧠</h4>

    <p>Ab ek interesting doubt:</p>

    <p><strong>"Agar action aur reaction equal hain, toh dono cancel kyun nahi ho jaate?" 🤔</strong></p>

    <p>Excellent question!</p>

    <p>Newton ke Third Law mein action aur reaction forces <strong>do alag-alag objects</strong> par act karte hain.</p>

    <p>Isliye ye ek-doosre ko cancel nahi karte.</p>

    <ul>
      <li>Action aur reaction ki magnitude equal hoti hai.</li>
      <li>Dono ki directions opposite hoti hain.</li>
      <li>Dono forces simultaneously act karte hain.</li>
      <li>Dono hamesha alag-alag objects par lagte hain.</li>
      <li>Action aur reaction ek hi interaction ka force pair hote hain.</li>
    </ul>

    <p><strong>Extra Tip:</strong> Table par rakhi book ka weight aur table ka normal force action-reaction pair nahi hain, kyunki dono book par act karte hain.</p>

    <h4>7. Board Exam Quick Revision 🎯</h4>

    <p>Exam mein Newton's Third Law explain karna ho toh ye points yaad rakhna:</p>

    <ul>
      <li><strong>Law:</strong> For every action, there is an equal and opposite reaction.</li>
      <li><strong>Magnitude:</strong> Equal.</li>
      <li><strong>Direction:</strong> Opposite.</li>
      <li><strong>Objects:</strong> Different objects.</li>
      <li><strong>Timing:</strong> Both forces act simultaneously.</li>
      <li><strong>Examples:</strong> Walking, swimming, rocket propulsion, and pushing a wall.</li>
    </ul>

    <p><strong>Ek line mein yaad rakho:</strong></p>

    <p style="text-align:center;"><strong>"Jitna force tum lagate ho, utna hi opposite force saamne wala object tum par lagata hai!" 💪🚀</strong></p>

    <p>Bas! Newton ka Third Law samajh aa gaya. Ab koi pooche toh wall ko push karne ki zaroorat nahi, seedha Physics samjha dena! 😂❤️</p>
  `;
  }

  if (
    matchesDemoPhrase(message, "explain quadratic equation step by step") ||
    matchesDemoPhrase(message, "dwighat samikaran ko samjhao") ||
    matchesDemoPhrase(message, "x^2-5x+6") ||
    matchesDemoPhrase(message, "x²-5x+6") ||
    matchesDemoPhrase(message, "x^2 - 5x + 6")
  ) {
    return `
      <p>Hi Meezan! 😊 Aaj hum <strong>Quadratic Equation (Dwighat Samikaran)</strong> ko bilkul aasan bhasha mein samjhenge.</p>

      <p>Tension mat lo! Hum ek example ko step by step solve karenge, jisse tum exam mein bhi isi tarah ke questions kar sako.</p>

      <h3>1. Quadratic Equation (द्विघात समीकरण) kya hota hai?</h3>

      <p>Aisa equation jisme variable <em>x</em> ki sabse badi power 2 hoti hai, use Quadratic Equation kehte hain.</p>

      <p>Iska standard form hota hai:</p>

      <div class="math-block">
        \\[
        ax^2 + bx + c = 0, \\qquad a \\ne 0
        \\]
      </div>

      <p>Yahan <em>a</em>, <em>b</em>, aur <em>c</em> numbers hain, aur <em>x</em> variable hai.</p>

      <h3>2. Chalo ek example solve karte hain</h3>

      <p><strong>Question:</strong> \\(x^2 - 5x + 6 = 0\\) ko solve karo.</p>

      <p>Humein <em>x</em> ki aisi values nikalni hain jisse equation zero ke barabar ho jaaye.</p>

      <h4>Step 1: Equation ko dekho</h4>

      <div class="math-block">
        \\[
        x^2 - 5x + 6 = 0
        \\]
      </div>

      <p>Humein aise do numbers chahiye:</p>

      <ul>
        <li>Jinka <strong>product (guna)</strong> +6 ho.</li>
        <li>Jinka <strong>sum (jod)</strong> -5 ho.</li>
      </ul>

      <h4>Step 2: Numbers find karo</h4>

      <p>Socho, kaun se do numbers ka guna 6 aur jod -5 hai?</p>

      <div class="math-block">
        \\[
        (-2) \\times (-3) = +6
        \\]
        \\[
        (-2) + (-3) = -5
        \\]
      </div>

      <p>Bahut badhiya! Dono numbers hain <strong>-2 aur -3</strong>.</p>

      <h4>Step 3: Factorisation karo</h4>

      <p>Ab equation ko factors mein likhenge:</p>

      <div class="math-block">
        \\[
        (x - 2)(x - 3) = 0
        \\]
      </div>

      <h4>Step 4: Dono factors ko zero ke barabar rakho</h4>

      <p>Jab do factors ka product zero ho, toh kam se kam ek factor zero hoga.</p>

      <p>Isliye,</p>

      <div class="math-block">
        \\[
        x - 2 = 0 \\quad \\Rightarrow \\quad x = 2
        \\]
      </div>

      <p>Aur,</p>

      <div class="math-block">
        \\[
        x - 3 = 0 \\quad \\Rightarrow \\quad x = 3
        \\]
      </div>

      <h3>3. Final Answer ✅</h3>

      <p>Equation ke dono roots hain:</p>

      <div class="math-block">
        \\[
        \\boxed{x = 2 \\text{ ya } x = 3}
        \\]
      </div>

      <h3>4. Exam Trick 🧠</h3>

      <p>Factorisation method mein do numbers dhoondho jinka:</p>

      <ul>
        <li><strong>Product =</strong> constant term \\(c\\)</li>
        <li><strong>Sum =</strong> coefficient of \\(x\\), yaani \\(b\\)</li>
      </ul>

      <p><strong>Dhyan rahe:</strong> Signs ka khaas dhyan dena. Do negative numbers ka product positive hota hai, lekin unka sum negative hota hai.</p>

      <h3>5. Ab tumhari baari! ✍️</h3>

      <p>Bina solution dekhe is question ko try karo:</p>

      <div class="math-block">
        \\[
        x^2 - 7x + 12 = 0
        \\]
      </div>

      <p><strong>Iske roots kya honge?</strong> Socho, aise do numbers kaun se hain jinka product 12 aur sum -7 hai?</p>
    `;
  }

  if (
    matchesDemoPhrase(message, "career options after class 10") ||
    matchesDemoPhrase(message, "career after 10th") ||
    matchesDemoPhrase(message, "10th ke baad career") ||
    matchesDemoPhrase(message, "10th ke baad kya kare") ||
    matchesDemoPhrase(message, "class 10 ke baad kya kare") ||
    matchesDemoPhrase(message, "career guidance after 10th") ||
    matchesDemoPhrase(message, "10th ke baad options") ||
    matchesDemoPhrase(message, "career options after 10th")
  ) {
    return `
  <div class="career-lesson">

    <h2>🎯 Class 10 ke Baad Kya Karein?</h2>

    <p>
      Hello Meezan! 😊 Agar tum Class 10 complete kar rahe ho,
      toh tumhare mind mein bhi ye questions honge:
      IIT kaise jaayein? Doctor kaise banein? UPSC kya hai?
      CA kaise banein? NDA join kaise karein?
    </p>

    <p>
      Chalo, sabse pehle popular career goals ko samajhte hain.
      Phir hum dekhenge ki Class 10 ke baad kaunsi stream ya
      course choose karna useful ho sakta hai.
    </p>

    <p>
      <b>Important:</b> Class 10 ke baad in careers ke liye
      preparation shuru kar sakte ho, lekin inmein se
      zyadaatar careers ke liye Class 11–12, entrance exams,
      professional courses ya further qualifications ki
      zaroorat hoti hai.
    </p>

    <hr>

    <h3>1️⃣ IIT — Engineer ya Software Engineer banna</h3>

    <p>
      IIT ka full form Indian Institute of Technology hai.
      IITs engineering, technology aur related fields mein
      higher education provide karte hain.
    </p>

    <h4>Class 10 ke baad kya karna hoga?</h4>

    <ol>
      <li>Class 11–12 mein Science with PCM choose karna ek common route hai.</li>
      <li>Physics, Chemistry aur Mathematics ki concepts strong karo.</li>
      <li>JEE Main aur JEE Advanced ke eligibility rules samjho.</li>
      <li>Required examinations qualify karke admission process follow karo.</li>
    </ol>

    <h4>IIT ke baad possible career options</h4>

    <ul>
      <li>Software Development Engineer (SDE)</li>
      <li>AI / Machine Learning Engineer</li>
      <li>Electrical, Mechanical ya Civil Engineer</li>
      <li>Researcher</li>
      <li>Entrepreneur / Startup Founder</li>
    </ul>

    <p>
      <b>Yaad rakho:</b> IIT jaana aur software engineer banna
      alag cheezein hain. Software engineer banne ke liye
      IIT hi ekmatra route nahi hai. Other recognised colleges,
      degrees aur skill-based pathways bhi available hain.
    </p>

    <hr>

    <h3>2️⃣ NEET / AIIMS — Doctor banna</h3>

    <p>
      Agar tum patients ki help karna, human body samajhna
      aur medical science padhna chahte ho, toh medical
      career explore kar sakte ho.
    </p>

    <p>
      AIIMS ka full form All India Institute of Medical
      Sciences hai. AIIMS institutions mein medical education
      aur healthcare se related programmes hote hain.
      MBBS admission ke liye applicable NEET-UG route
      follow kiya jaata hai.
    </p>

    <h4>Class 10 ke baad common route</h4>

    <ol>
      <li>Class 11–12 mein Physics, Chemistry aur Biology wale subjects choose karo.</li>
      <li>PCB ke saath required subject aur eligibility rules check karo.</li>
      <li>NEET-UG ki preparation karo.</li>
      <li>Required eligibility, exam, counselling aur seat-allocation process complete karo.</li>
      <li>MBBS complete karne ke baad applicable internship aur registration requirements follow karo.</li>
    </ol>

    <h4>Medical aur allied-health pathways</h4>

    <ul>
      <li>Doctor — MBBS aur required registration ke through</li>
      <li>Dentist — BDS pathway</li>
      <li>Veterinarian — veterinary qualification ke through</li>
      <li>Pharmacy professional — approved pharmacy course ke through</li>
      <li>Physiotherapy aur allied-health careers — relevant course aur eligibility ke through</li>
    </ul>

    <p>
      <b>Important:</b> MBBS, BDS, veterinary aur allied-health
      courses ki admission requirements ek jaisi nahi hoti.
      Har course ke current official rules check karo.
    </p>

    <hr>

    <h3>3️⃣ UPSC — IAS, IPS aur Civil Services</h3>

    <p>
      UPSC ka full form Union Public Service Commission hai.
      Ye multiple examinations conduct karta hai, jinmein
      Civil Services Examination bhi shamil hai.
    </p>

    <p>
      IAS aur IPS jaise services mein jaana chahte ho,
      toh Civil Services ek possible pathway hai.
    </p>

    <h4>Class 10 ke baad kya karo?</h4>

    <ol>
      <li>Class 11–12 mein apni interest ke according stream choose karo.</li>
      <li>History, Geography, Polity, Economics aur current affairs ko gradually samjho.</li>
      <li>Reading comprehension, writing aur analytical thinking improve karo.</li>
      <li>Graduation complete karo aur future mein applicable UPSC eligibility meet karo.</li>
      <li>Required conditions meet karne par Civil Services Examination de sakte ho.</li>
    </ol>

    <p>
      <b>Yaad rakho:</b> UPSC Civil Services ke liye
      Class 11 mein koi ek compulsory stream nahi hai.
      Required educational qualification aur age conditions
      examination ke official rules se verify karni chahiye.
    </p>

    <hr>

    <h3>4️⃣ NDA — Defence Officer banna</h3>

    <p>
      Agar tum Indian Armed Forces mein officer banne ka goal
      rakhte ho, toh NDA ek popular route hai.
      NDA ka full form National Defence Academy hai.
    </p>

    <h4>Class 10 ke baad common preparation route</h4>

    <ol>
      <li>Class 11–12 complete karo.</li>
      <li>Army, Navy aur Air Force ke educational requirements ko samjho.</li>
      <li>Applicable NDA examination eligibility check karo.</li>
      <li>Written examination, SSB selection aur medical standards jaise stages ke liye prepare karo.</li>
    </ol>

    <p>
      Army Wing ke educational requirements aur Air Force
      ya Naval Wings ke subject requirements different
      ho sakte hain. Mathematics aur Physics ki requirements
      ko current official notification se verify karo.
    </p>

    <p>
      Defence careers mein academics ke saath discipline,
      teamwork, responsible decision-making aur physical
      fitness bhi important hote hain.
    </p>

    <hr>

    <h3>5️⃣ CA — Chartered Accountant banna</h3>

    <p>
      Agar tumhe accounts, finance, taxation, auditing aur
      business mein interest hai, toh CA ek professional
      career option hai.
    </p>

    <h4>Class 10 ke baad route</h4>

    <ol>
      <li>Class 11–12 mein Commerce consider kar sakte ho.</li>
      <li>Accountancy, Economics aur business concepts samjho.</li>
      <li>Class 12 aur applicable eligibility ke according CA course registration aur examination route follow karo.</li>
      <li>Required examinations, practical training aur other professional requirements complete karo.</li>
    </ol>

    <p>
      Commerce CA ke liye useful choice ho sakta hai, lekin
      eligibility rules meet karne wale students doosre
      streams se bhi applicable route explore kar sakte hain.
      Current details ICAI se check karna.
    </p>

    <hr>

    <h3>6️⃣ CS aur CMA — Business aur Finance ke doosre options</h3>

    <p>
      CA ke alawa professional qualifications ke aur bhi
      options hain.
    </p>

    <ul>
      <li>
        <b>CS — Company Secretary:</b> Company law, corporate
        governance aur compliance se related professional role.
      </li>
      <li>
        <b>CMA — Cost and Management Accountant:</b> Costing,
        management accounting aur financial planning se
        related professional role.
      </li>
    </ul>

    <p>
      Dono ke registration, examinations aur training ke
      specific rules hote hain. Official professional
      institutes se latest requirements check karo.
    </p>

    <hr>

    <h3>7️⃣ JEE ke alawa Computer Science aur AI/ML</h3>

    <p>
      Agar tumhara dream coding, apps, websites, AI ya
      machine learning mein kaam karna hai, toh tumhe
      sirf ek college ya ek entrance exam tak limited
      rehne ki zaroorat nahi hai.
    </p>

    <h4>Possible route</h4>

    <ol>
      <li>Mathematics aur logical thinking strong karo.</li>
      <li>Class 11–12 mein relevant subjects aur college eligibility ko consider karo.</li>
      <li>Suitable degree programmes aur recognised colleges research karo.</li>
      <li>Programming, data structures, algorithms aur real projects par kaam karo.</li>
      <li>Internships aur portfolio ke through practical experience build karo.</li>
    </ol>

    <p>
      Possible careers mein Software Developer, Web Developer,
      App Developer, Data Analyst aur AI/ML Engineer shamil
      ho sakte hain. Har role ke liye required skills aur
      educational expectations different ho sakte hain.
    </p>

    <hr>

    <h3>8️⃣ CLAT / Law — Lawyer banna</h3>

    <p>
      Agar tumhe arguments, Constitution, social issues,
      reading aur logical reasoning pasand hain, toh law
      ek option ho sakta hai.
    </p>

    <ol>
      <li>Class 11–12 mein apni interest ke according stream choose karo.</li>
      <li>Reading, comprehension aur reasoning improve karo.</li>
      <li>Eligible hone par relevant law entrance examinations explore karo.</li>
      <li>Recognised institution se required law degree complete karo.</li>
      <li>Legal practice ke liye applicable enrolment aur qualification rules follow karo.</li>
    </ol>

    <p>
      CLAT participating National Law Universities ke
      relevant programmes ke admissions se associated hai.
      Har law college ka admission route same nahi hota.
    </p>

    <hr>

    <h3>9️⃣ CUET aur University Degrees</h3>

    <p>
      Agar tum kisi particular professional exam ki jagah
      graduation ke through apna career build karna chahte ho,
      toh university degree bhi ek important route hai.
    </p>

    <ul>
      <li>B.Sc. — Science-related fields</li>
      <li>B.Com. — Commerce, accounts aur finance</li>
      <li>B.A. — Humanities, languages aur social sciences</li>
      <li>BCA — Computer applications, subject to college eligibility</li>
      <li>BBA — Business and management</li>
      <li>Other specialised undergraduate degrees</li>
    </ul>

    <p>
      CUET kuch participating universities aur programmes
      ke admissions mein use hota hai. Har university aur
      course ke subject combinations aur eligibility rules
      alag ho sakte hain.
    </p>

    <hr>

    <h3>🔟 Polytechnic, ITI aur Skill-Based Careers</h3>

    <p>
      Har student ko traditional Class 11–12 plus graduation
      route hi choose karna zaroori nahi hai. Technical aur
      vocational pathways bhi explore kiye ja sakte hain.
    </p>

    <ul>
      <li>
        <b>Polytechnic:</b> Civil, Mechanical, Electrical,
        Computer aur other diploma branches.
      </li>
      <li>
        <b>ITI:</b> Electrician, Fitter, COPA aur other
        trade-based programmes.
      </li>
      <li>
        <b>Creative skills:</b> Graphic Design, Animation,
        Photography aur Video Editing.
      </li>
      <li>
        <b>Digital skills:</b> Web Development, Programming
        aur Digital Design.
      </li>
    </ul>

    <p>
      Admission se pehle recognition, course duration,
      total fees, practical training aur future study
      opportunities verify karna zaroori hai.
    </p>

    <hr>

    <h3>🌟 Ab apni interest ke according options compare karo</h3>

    <ul>
      <li><b>Engineering aur technology:</b> PCM, JEE aur relevant degree pathways.</li>
      <li><b>Medical field:</b> PCB aur applicable medical entrance routes.</li>
      <li><b>Government administration:</b> Graduation aur applicable civil-services examinations.</li>
      <li><b>Defence:</b> NDA eligibility aur selection process.</li>
      <li><b>Finance aur accounts:</b> Commerce aur CA, CS ya CMA jaise options.</li>
      <li><b>Law:</b> Class 12 ke baad eligible law-degree pathways.</li>
      <li><b>Coding aur AI:</b> Relevant education, programming aur projects.</li>
      <li><b>Hands-on technical skills:</b> Polytechnic, ITI aur recognised vocational programmes.</li>
    </ul>

    <h3>❤️ Teacher ki final advice</h3>

    <p>
      Student, IIT, AIIMS, UPSC, NDA aur CA popular goals
      hain, lekin tumhara goal sirf popular hone ki wajah
      se choose nahi hona chahiye.
    </p>

    <p>
      Apni interest, strengths, available resources aur
      long-term goals ko samjho. Parents, teachers aur
      career counsellor se discussion karo. Ek hi career
      successful life ka only route nahi hai.
    </p>

    <p>
      <b>Ab khud se poochho:</b> Mujhe kis type ka kaam
      karna pasand hai — technology, medicine, government
      service, defence, business, law ya creative work?
      Isi answer se tumhari career exploration shuru hoti hai.
    </p>

  </div>
  `;
  }

  if (
    matchesDemoPhrase(message, "give me practice questions for 10th as pyqs") ||
    matchesDemoPhrase(message, "give me practice questions for class 10") ||
    matchesDemoPhrase(message, "give me pyqs for class 10") ||
    matchesDemoPhrase(message, "class 10 bihar board pyq") ||
    matchesDemoPhrase(message, "class 10 bseb pyq") ||
    matchesDemoPhrase(message, "bihar board 10th important questions") ||
    matchesDemoPhrase(message, "bihar board class 10 practice questions") ||
    matchesDemoPhrase(message, "10th ke pyq do") ||
    matchesDemoPhrase(message, "class 10 ke important questions do") ||
    matchesDemoPhrase(message, "matric ke vvi questions") ||
    matchesDemoPhrase(message, "most repeated questions of class 10") ||
    matchesDemoPhrase(message, "class 10 question bank") ||
    matchesDemoPhrase(message, "give me all subject pyqs") ||
    matchesDemoPhrase(message, "all six subjects pyq") ||
    matchesDemoPhrase(message, "all subjects practice questions")
  ) {
    return `
      <h2>📚 Bihar Board Class 10 — PYQ Practice Set</h2>
      <p><b>All six subjects • Chapter-wise important questions</b></p>
      <p>Ye questions board-exam practice ke liye hain. Inki exact year-wise repetition independently verify nahi ki gayi hai.</p>

      <hr>
      <h2>📐 1. Mathematics (गणित)</h2>

      <h3>Real Numbers (वास्तविक संख्याएँ)</h3>
      <ol>
        <li>Euclid's division algorithm ka use karke 135 aur 225 ka HCF gyaat kijiye.</li>
        <li>Siddh kijiye ki √2 ek aparimey sankhya hai.</li>
        <li>Abhaajya gunankhand vidhi se HCF aur LCM gyaat kijiye.</li>
      </ol>

      <h3>Quadratic Equations (द्विघात समीकरण)</h3>
      <ol>
        <li>Quadratic formula ka use karke x² − 5x + 6 = 0 ko solve kijiye.</li>
        <li>Discriminant D = b² − 4ac ke aadhar par moolon ki prakriti bataiye.</li>
      </ol>

      <h3>Arithmetic Progressions (समांतर श्रेणियाँ)</h3>
      <ol>
        <li>AP 3, 7, 11, 15, ... ka 20vaan pad gyaat kijiye.</li>
        <li>AP ke pratham n padon ke yog ka formula likhiye aur prayog kijiye.</li>
      </ol>

      <h3>Trigonometry (त्रिकोणमिति)</h3>
      <ol>
        <li>Siddh kijiye: sin²θ + cos²θ = 1.</li>
        <li>Yadi tan θ = 3/4 hai, to sin θ aur cos θ gyaat kijiye.</li>
        <li>Ek tower ki height aur usse doori par aadharit height-distance prashn hal kijiye.</li>
      </ol>

      <h3>Statistics (सांख्यिकी)</h3>
      <ol>
        <li>Diye gaye data ka mean, median aur mode gyaat kijiye.</li>
      </ol>

      <h3>Circles and Mensuration (वृत्त एवं क्षेत्रमिति)</h3>
      <ol>
        <li>7 cm trijya wale vratt ka kshetrafal gyaat kijiye. (π = 22/7)</li>
        <li>Gole, belan ya shanku ka aayatan aur prishthiya kshetrafal gyaat kijiye.</li>
        <li>Vritt ki sparsh rekha se sambandhit pramey likhiye.</li>
      </ol>

      <h3>Coordinate Geometry (निर्देशांक ज्यामिति)</h3>
      <ol>
        <li>Do binduon ke beech ki doori ka formula likhiye aur prayog kijiye.</li>
        <li>Vibhajan sutra ka use karke kisi bindu ke nirdeshank gyaat kijiye.</li>
      </ol>

      <hr>
      <h2>🔬 2. Science (विज्ञान)</h2>

      <h3>Chemistry (रसायन विज्ञान)</h3>
      <ol>
        <li>Sanyojan aur viyojan abhikriya mein antar udaharan sahit bataiye.</li>
        <li>Ushmaakshepi aur ushmaashoshi abhikriya kya hain?</li>
        <li>Santulit rasayanik samikaran kya hai? Ise santulit karna kyon zaroori hai?</li>
        <li>Sanaksharan (corrosion) aur vikritgandhita (rancidity) kya hain?</li>
        <li>Plaster of Paris banane ki vidhi, gun aur upyog likhiye.</li>
        <li>Virinjak churn (bleaching powder) ka rasayanik naam, sutra aur upyog likhiye.</li>
        <li>pH scale kya hai? Dainik jeevan mein iska kya mahatva hai?</li>
        <li>Baking soda ka rasayanik naam, banane ki vidhi aur upyog likhiye.</li>
        <li>Dhatu aur adhatu ke bhautik evam rasayanik gunon mein antar likhiye.</li>
        <li>Ayaneek yogikon ke saamanya gun bataiye.</li>
        <li>Khanij, ayask aur gangue mein antar bataiye.</li>
        <li>Sabunikaran (saponification) kya hai?</li>
        <li>Sajatiya shreni (homologous series) kya hai? Iski visheshtayein likhiye.</li>
        <li>Ethanol aur ethanoic acid mein antar spasht kijiye.</li>
      </ol>

      <h3>Physics (भौतिकी)</h3>
      <ol>
        <li>Prakash ke paravartan ke niyam likhiye.</li>
        <li>Avatal darpan ke teen upyog likhiye.</li>
        <li>Uttal lens ko abhisaari lens kyon kaha jaata hai?</li>
        <li>Snell ka apavartan niyam likhiye.</li>
        <li>Goleeya darpan ke liye f = R/2 sambandh ko samjhaiye.</li>
        <li>Nikat-drishtidosh aur door-drishtidosh kya hain? Inka nivaran kaise hota hai?</li>
        <li>Taare kyon timtimate hain?</li>
        <li>Shwet prakash ka varna-vikshepan kya hai?</li>
        <li>Ohm ka niyam likhiye aur iska ganitiya vyंजक bataiye.</li>
        <li>Shrenikram aur parshvakram mein pratirodhon ke samatulya pratirodh ka sutra likhiye.</li>
        <li>Vidyut shakti kya hai? Iska SI matrak bataiye.</li>
        <li>Fleming ka vaam-hast niyam likhiye.</li>
        <li>Vidyut-chumbakiya prerana kya hai?</li>
        <li>Laghu path (short circuit) aur atibharan (overloading) kya hain?</li>
      </ol>

      <h3>Biology (जीव विज्ञान)</h3>
      <ol>
        <li>Prakash sanshleshan kya hai? Iski rasayanik samikaran likhiye.</li>
        <li>Dhamani aur shira mein antar spasht kijiye.</li>
        <li>Manushya ke pachan tantra ka naamankit chitra banakar varnan kijiye.</li>
        <li>Vayveey aur avayveey shwasan mein antar bataiye.</li>
        <li>Prativedi kriya (reflex action) aur prativedi chaap kya hain?</li>
        <li>Do paadap hormones ke naam aur karya likhiye.</li>
        <li>Alैंगik aur laingik janan mein antar bataiye.</li>
        <li>Paragan kya hai? Swa-paragan aur par-paragan mein antar likhiye.</li>
        <li>Mendel ke ek-sankari aur dvi-sankari cross ke niyamon ko samjhaiye.</li>
        <li>Samjaat aur samvrit angon mein antar udaharan sahit likhiye.</li>
        <li>Aahaar shrinkhala kya hai? Ek udaharan dijiye.</li>
        <li>Ozone parat ka hraas kaise ho raha hai? Iske prabhav likhiye.</li>
      </ol>

      <hr>
      <h2>🌍 3. Social Science (सामाजिक विज्ञान)</h2>

      <h3>History (इतिहास)</h3>
      <ol>
        <li>Italy ke ekikaran mein Mazzini, Cavour aur Garibaldi ka kya yogdan tha?</li>
        <li>1905 ki Russia ki Bloody Sunday ghatna kya thi?</li>
        <li>Ho Chi Minh Marg kya tha aur Vietnam yuddh mein iska kya mahatva tha?</li>
        <li>Audhyogik kranti sarvapratham kahan aarambh hui aur iska kya prabhav pada?</li>
        <li>Rowlatt Act kya tha? Bharatiyon ne iska virodh kyon kiya?</li>
      </ol>

      <h3>Geography (भूगोल)</h3>
      <ol>
        <li>Naveekarniya aur anaveekarniya sansadhanon mein antar spasht kijiye.</li>
        <li>Bharat mein jal sankat ke pramukh karan kya hain?</li>
        <li>Rabi aur Kharif faslon mein antar likhiye aur do-do udaharan dijiye.</li>
        <li>Bahuddeshiya nadi ghaati pariyojanaon ko aadhunik Bharat ka mandir kyon kaha jaata hai?</li>
        <li>Baadh aur sookhe ke pramukh karan evam bachav ke upay likhiye.</li>
      </ol>

      <h3>Civics (राजनीति विज्ञान)</h3>
      <ol>
        <li>Rajnitik dal ko loktantra ka praan kyon kaha jaata hai?</li>
        <li>Bharatiya rajneeti mein jaativad aur parivarvad kis prakar prabhavit karte hain?</li>
        <li>Dal-badal kanoon kya hai?</li>
        <li>Kshetriyata ki bhavna loktantra ke liye kaise hanikarak ho sakti hai?</li>
        <li>Suchna ka Adhikar Adhiniyam 2005 ke uddeshya kya hain?</li>
      </ol>

      <h3>Economics (अर्थशास्त्र)</h3>
      <ol>
        <li>Rashtriya aay ki ganana kaise ki jaati hai? Iski pramukh kathinaiyan kya hain?</li>
        <li>Money kya hai? Iske mukhya karya likhiye.</li>
        <li>Vaishvikaran kya hai? Iske sakaratmak aur nakaratmak prabhav likhiye.</li>
        <li>Tritiyak ya seva kshetra ka vartaman samay mein kya mahatva hai?</li>
        <li>Upbhokta ke adhikar kaun-kaun se hain? ISI aur Agmark ka arth bataiye.</li>
      </ol>

      <hr>
      <h2>📖 4. Hindi (हिंदी)</h2>
      <ol>
        <li>Apne pathyakram ke kisi ek pramukh gadya-paath ka saar likhiye.</li>
        <li>Kisi kavita ka bhaavarth apne shabdon mein likhiye.</li>
        <li>Sandhi ki paribhasha likhkar udaharan dijiye.</li>
        <li>Samas kise kehte hain? Iske prakar udaharan sahit bataiye.</li>
        <li>Shiksha ke mahatva par anuchhed likhiye.</li>
        <li>Apne pradhanadhyapak ko avakash ke liye aavedan-patra likhiye.</li>
      </ol>

      <hr>
      <h2>📝 5. English</h2>
      <ol>
        <li>Change into indirect speech: He said, "I am busy."</li>
        <li>Fill in the blank: She ___ to school every day. (go/goes)</li>
        <li>Change into passive voice: The teacher praised the student.</li>
        <li>Write an application to your Headmaster requesting leave.</li>
        <li>Write a paragraph on the importance of education.</li>
        <li>Write a short essay on environmental protection.</li>
      </ol>

      <hr>
      <h2>🖋️ 6. Urdu (اردو)</h2>
      <ol>
        <li>Apne syllabus ke kisi ek aham sabaq ka khulasa likhiye.</li>
        <li>Ghazal kise kehte hain? Iski do khasusiyat likhiye.</li>
        <li>Radif aur qafiya ki tareef misaal ke saath kijiye.</li>
        <li>Apne principal ko chhutti ke liye darkhwast likhiye.</li>
        <li>Taleem ki ahmiyat par ek mazmoon likhiye.</li>
      </ol>

      <hr>
      <p><b>Exam tip:</b> Pehle textbook ke chapter-wise questions practice karein, phir Bihar Board ke original previous-year papers se questions aur year/set verify karein.</p>
    `;
  }

  // WHO RUNS / MANAGES BRILLIANT COACHING CENTER?
  if (
    matchesDemoPhrase(message, "who runs brilliant coaching") ||
    matchesDemoPhrase(message, "who manages brilliant coaching") ||
    matchesDemoPhrase(message, "who manages the coaching center") ||
    matchesDemoPhrase(message, "who is running brilliant coaching") ||
    matchesDemoPhrase(message, "head of brilliant coaching")
  ) {
    return `
    <p>
      <strong>Zaki Quasmi Alig</strong> currently manages
      <strong>Brilliant Coaching Center</strong> in Kairi Birpur and serves
      as its <strong>Principal and operational head</strong>.
    </p>

    <p>
      The institute was originally founded by his elder brother,
      <strong>Mr. Rehan Quasmi.</strong>
    </p>
  `;
  }

  if (
    matchesDemoPhrase(message, "who created you") ||
    matchesDemoPhrase(message, "who create you") ||
    matchesDemoPhrase(message, "who creates you") ||
    matchesDemoPhrase(message, "who developed you") ||
    matchesDemoPhrase(message, "you created by whom") ||
    matchesDemoPhrase(message, "you developed by whom") ||
    matchesDemoPhrase(message, "who made you")
  ) {
    skipThinkingForCurrentResponse = true;
    return `
      <p>
        I was created by <strong>Nadaf Reza</strong>, who is associated with 
        <strong>IIT Madras</strong>. He is continuously working on me to make me 
        more <strong>intelligent, capable, and intuitive</strong>—with the goal of 
        helping me explain even the most complex concepts in a simple, clear, and 
        understandable way.
      </p>

      <p>
        He is also working toward building an advanced learning system where 
        <strong>science experiments, complex concepts, mathematical theorems, and 
        abstract ideas</strong> can be explained through interactive 
        <strong>3D visualizations</strong>, making difficult topics easier to 
        understand and explore.
      </p>
    `;
  }

  if (/\b(revision|study plan|give me study plan)\b/i.test(message.trim())) {
    skipThinkingForCurrentResponse = true;
    return `
            <p>Here's a simple study structure:</p>
            <ol>
              <li>Understand the concept</li>
              <li>Review important formulas</li>
              <li>Solve examples</li>
              <li>Practice without looking at solutions</li>
              <li>Revise mistakes</li>
            </ol>
        `;
  }

  return `
    <p>I'm sorry, but I couldn't understand your question. Please check your spelling or try rephrasing it.</p>
    <p>This topic is not yet covered in my current training. I'm continuously being improved by <strong>Nadaf Reza</strong> to help you with a wider range of academic questions.</p>
    <p>Thank you for your patience! Please try asking in a different way, or check back later as my learning resources continue to expand.</p>
  `;
}

/* =========================================================
   SEND MESSAGE
   ========================================================= */

function sendMessage() {
  const message = chatInput.value.trim();

  if (!message || isTyping) {
    return;
  }

  aiWelcomeState.style.display = "none";

  addUserMessage(message);

  chatInput.value = "";

  chatInput.style.height = "auto";

  isTyping = true;

  const responseHTML = generateDemoResponse(message);

  // Only the explicitly supplied Q&A set skips the thinking animation.
  if (skipThinkingForCurrentResponse) {
    addAIMessageWithAnimation(responseHTML, function () {
      isTyping = false;
    });
    return;
  }

  const thinkingMessage = showThinkingAnimation();
  // Keep the established short render delay; the indicator remains visible for 1.3s.
  setTimeout(function () {
    thinkingMessage.remove();
    addAIMessageWithAnimation(responseHTML, function () {
      isTyping = false;
    });
  }, 1300);
}

/* =========================================================
   SEND BUTTON
   ========================================================= */

sendMessageButton.addEventListener("click", sendMessage);

/* =========================================================
   ENTER TO SEND
   ========================================================= */

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    sendMessage();
  }
});

/* =========================================================
   AUTO RESIZE TEXTAREA
   ========================================================= */

chatInput.addEventListener("input", function () {
  this.style.height = "auto";

  this.style.height = Math.min(this.scrollHeight, 125) + "px";
});

/* =========================================================
   SUGGESTED PROMPTS
   ========================================================= */

suggestedPrompts.forEach(function (button) {
  button.addEventListener("click", function () {
    chatInput.value = button.textContent.trim();

    chatInput.focus();

    chatInput.style.height = "auto";

    chatInput.style.height = Math.min(chatInput.scrollHeight, 125) + "px";
  });
});

/* =========================================================
   MICROPHONE BUTTON
   ========================================================= */

microphoneButton.addEventListener("click", function () {
  microphoneActive = !microphoneActive;

  this.classList.toggle("microphone-active", microphoneActive);

  if (microphoneActive) {
    this.innerHTML = '<i class="fa-solid fa-stop"></i>';

    this.title = "Stop microphone";
  } else {
    this.innerHTML = '<i class="fa-solid fa-microphone"></i>';

    this.title = "Use microphone";
  }
});

/* =========================================================
   ATTACHMENT BUTTON
   ========================================================= */

attachmentButton.addEventListener("click", function () {
  alert("File and image upload will be added later.");
});

/* =========================================================
   START VOICE SESSION
   ========================================================= */

startVoiceButton.addEventListener("click", function () {
  alert("Voice AI integration will be added later.");
});

/* =========================================================
   INITIAL STATE
   ========================================================= */

activateWrittenMode();

/* Full Screen Window */

const aiTutorWindow = document.querySelector(".ai-tutor-window");
const fullscreenButton = document.getElementById("aiFullscreenButton");

if (fullscreenButton && aiTutorWindow) {
  fullscreenButton.addEventListener("click", () => {
    aiTutorWindow.classList.toggle("fullscreen");
    const isFullscreen = aiTutorWindow.classList.contains("fullscreen");
    document.body.classList.toggle("ai-tutor-fullscreen", isFullscreen);

    const icon = fullscreenButton.querySelector("i");

    if (isFullscreen) {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");

      fullscreenButton.title = "Exit Fullscreen";
      fullscreenButton.setAttribute("aria-label", "Exit AI Tutor fullscreen");
    } else {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");

      fullscreenButton.title = "Fullscreen";
      fullscreenButton.setAttribute("aria-label", "Open AI Tutor fullscreen");
    }
  });
}

/* =========================================================
   FINAL — KEEP MYELIN BRAND LINES EXACTLY THE SAME WIDTH
   Measures the responsive text and gives both lines the same
   width, while allowing the company name to remain fully visible.
   ========================================================= */
function syncMyelinBrandWidth() {
  document
    .querySelectorAll(".ai-tutor-window .company-name")
    .forEach((company) => {
      const title = company.querySelector(":scope > strong");
      const status = company.querySelector(":scope > .ai-online-status");

      if (!title || !status) return;

      // Temporarily use natural widths so responsive font sizes are measured correctly.
      company.style.width = "max-content";
      title.style.width = "max-content";
      status.style.width = "max-content";

      const targetWidth = Math.max(title.scrollWidth, status.scrollWidth);

      // Both lines receive exactly the same rendered width.
      company.style.width = `${targetWidth}px`;
      title.style.width = `${targetWidth}px`;
      status.style.width = `${targetWidth}px`;
    });
}

window.addEventListener("load", () => {
  requestAnimationFrame(syncMyelinBrandWidth);
});

window.addEventListener("resize", () => {
  requestAnimationFrame(syncMyelinBrandWidth);
});

// Re-sync after the custom fullscreen class changes.
if (fullscreenButton && aiTutorWindow) {
  fullscreenButton.addEventListener("click", () => {
    requestAnimationFrame(syncMyelinBrandWidth);
  });
}

/* =========================================================
   MOBILE SIDEBAR + VIRTUAL KEYBOARD AWARE COMPOSER
   Uses VisualViewport where supported (iOS/Android browsers).
   ========================================================= */
(() => {
  const sidebarToggle = document.getElementById("mobileSidebarToggle");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const windowEl = document.querySelector(".ai-tutor-window");
  const composer = document.getElementById("textInputArea");
  const input = document.getElementById("chatInput");

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.setAttribute("aria-label", "Open navigation");
      sidebarToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }
  if (sidebarToggle)
    sidebarToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("sidebar-open");
      sidebarToggle.setAttribute("aria-expanded", String(open));
      sidebarToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
      sidebarToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      if (windowEl && windowEl.classList.contains("fullscreen")) {
        windowEl.classList.remove("fullscreen");
        document.body.classList.remove("ai-tutor-fullscreen");
        const icon = document.querySelector("#aiFullscreenButton i");
        if (icon) {
          icon.classList.remove("fa-compress");
          icon.classList.add("fa-expand");
        }
        const button = document.getElementById("aiFullscreenButton");
        if (button) {
          button.title = "Fullscreen";
          button.setAttribute("aria-label", "Open AI Tutor fullscreen");
        }
      }
    }
  });

  if (!windowEl || !composer || !input) return;
  let keyboardOpen = false;
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function updateKeyboardLayout() {
    const vv = window.visualViewport;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const viewportOffset = vv ? vv.offsetTop : 0;
    const keyboardHeight = Math.max(
      0,
      window.innerHeight - viewportHeight - viewportOffset,
    );
    const focused = document.activeElement === input;
    const isOpen = mobileQuery.matches && focused && keyboardHeight > 100;
    keyboardOpen = isOpen;
    windowEl.classList.toggle("keyboard-open", isOpen);
    windowEl.style.setProperty("--keyboard-inset", `${keyboardHeight}px`);
    if (isOpen) {
      requestAnimationFrame(() => {
        const body = document.getElementById("aiChatBody");
        if (body) body.scrollTop = body.scrollHeight;
      });
    }
  }
  input.addEventListener("focus", () => {
    // Let the browser begin opening its native keyboard before measuring.
    setTimeout(updateKeyboardLayout, 60);
    setTimeout(updateKeyboardLayout, 250);
    setTimeout(updateKeyboardLayout, 500);
  });
  input.addEventListener("blur", () => {
    keyboardOpen = false;
    windowEl.classList.remove("keyboard-open");
    windowEl.style.setProperty("--keyboard-inset", "0px");
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateKeyboardLayout);
    window.visualViewport.addEventListener("scroll", updateKeyboardLayout);
  }
  window.addEventListener("resize", updateKeyboardLayout);
  window.addEventListener("orientationchange", () =>
    setTimeout(updateKeyboardLayout, 250),
  );
  document.addEventListener("focusin", (event) => {
    if (event.target === input) updateKeyboardLayout();
  });
  document.addEventListener("focusout", (event) => {
    if (event.target === input)
      setTimeout(() => {
        if (document.activeElement !== input) {
          windowEl.classList.remove("keyboard-open");
          windowEl.style.setProperty("--keyboard-inset", "0px");
        }
      }, 80);
  });
})();
