/**
 * Elm & Fern — sample shop.
 * Edit `shop` for the name and story, `plants` for the catalog,
 * and `hooks` for the three prompts at the top of the page.
 * Colors are the variables at the top of styles.css.
 */

const shop = {
  name: "Elm & Fern",
  eyebrow: "Neighborhood plant shop",
  tagline: "Houseplants, pots, and advice from a corner shop on Elm Street.",
  announcement: "Order before 2 for same-day pickup on Elm Street.",
  address: "18 Elm Street",
  hours: "Tuesday to Sunday, 10 to 6",
  established: "2014",
};

/** @typedef {{ id: string, name: string, price: number, category: string, note: string, badge?: string, featured?: boolean }} Plant */

/** @type {Plant[]} */
const plants = [
  {
    id: "birds-nest",
    name: "Bird's nest fern",
    price: 28,
    category: "indoor",
    note: "Ruffled leaves that like a steamy bathroom.",
    badge: "Easy",
    featured: true,
  },
  {
    id: "monstera",
    name: "Monstera",
    price: 48,
    category: "indoor",
    note: "The plant people recognize from across the room.",
    badge: "Popular",
  },
  {
    id: "string-of-pearls",
    name: "String of pearls",
    price: 22,
    category: "indoor",
    note: "A trailing strand of green beads.",
  },
  {
    id: "olive",
    name: "Olive tree",
    price: 64,
    category: "outdoor",
    note: "A young tree for the sunniest step you have.",
  },
  {
    id: "rosemary",
    name: "Rosemary",
    price: 14,
    category: "outdoor",
    note: "Woody, sharp, and happy in a kitchen window.",
  },
  {
    id: "lavender",
    name: "Lavender",
    price: 16,
    category: "outdoor",
    note: "Silver foliage and a summer spike of purple.",
  },
  {
    id: "clay-planter",
    name: "Sand clay planter",
    price: 18,
    category: "pots",
    note: "Unglazed sand clay, six inches across.",
  },
  {
    id: "cachepot",
    name: "Speckled cachepot",
    price: 26,
    category: "pots",
    note: "Speckled stoneware. The nursery pot sits inside.",
  },
];

const hooks = [
  {
    prompt: "Rename the shop to a bookstore named Margins.",
    area: "name",
  },
  {
    prompt: "Change the green accent color to deep navy.",
    area: "accent",
  },
  {
    prompt: "Add a fiddle-leaf fig for $54 in the indoor category.",
    area: "catalog",
  },
];

/** Scroll targets for each prompt. The highlight itself is wider than this landmark. */
const hookLandmarks = {
  name: "#shop-name",
  accent: ".featured",
  catalog: "#catalog",
};

const ART = {
  indoor: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M60 98V46" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 80c-14-2-24-12-28-24 10 2 18 8 22 16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 80c14-2 24-12 28-24-10 2-18 8-22 16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 64c-12-4-20-14-22-26 8 4 14 10 16 18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 64c12-4 20-14 22-26-8 4-14 10-16 18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 50c-8-6-12-16-12-24 6 6 10 12 12 18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 50c8-6 12-16 12-24-6 6-10 12-12 18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  outdoor: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M60 98V64" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="60" cy="46" r="18" stroke="currentColor" stroke-width="1.75"/><circle cx="46" cy="56" r="12" stroke="currentColor" stroke-width="1.75"/><circle cx="76" cy="58" r="11" stroke="currentColor" stroke-width="1.75"/><path d="M42 98h36" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  pots: `<svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M38 62h44l-5 32H43L38 62z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M34 54h52v8H34z" stroke="currentColor" stroke-width="1.75"/><path d="M60 54V36" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 44c10-2 16-10 18-18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M60 42c-9 0-15-8-18-16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="80" cy="26" r="3" fill="currentColor"/></svg>`,
};

const BAG_KEY = "elm-fern-bag";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** @typedef {{ id: string, qty: number }} BagLine */

/** @type {BagLine[]} */
let bag = [];
let category = "all";
let query = "";
let pickupNote = "";
let copyTimer = 0;
const tryHint = "Hover a number to see what it changes. Click it to copy the message.";
const tryCopied = "Copied successfully. Paste in the chat to make the change.";

function artFor(cat) {
  return ART[cat] || ART.indoor;
}

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return money.format(amount);
}

function labelFor(id) {
  if (id === "all") return "All";
  return String(id)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function knownCategories() {
  /** @type {string[]} */
  const list = [];
  for (const plant of plants) {
    if (plant.category && !list.includes(plant.category)) list.push(plant.category);
  }
  return list;
}

function plantById(id) {
  return plants.find((plant) => plant.id === id) || null;
}

function visiblePlants() {
  const q = query.trim().toLowerCase();
  return plants.filter((plant) => {
    if (category !== "all" && plant.category !== category) return false;
    if (!q) return true;
    return [plant.name, plant.note, plant.category, plant.badge]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}

function qtyOf(id) {
  return bag.find((line) => line.id === id)?.qty || 0;
}

function bagTotal() {
  return bag.reduce((sum, line) => {
    const plant = plantById(line.id);
    return sum + (plant ? plant.price * line.qty : 0);
  }, 0);
}

function loadBag() {
  try {
    const raw = localStorage.getItem(BAG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && plantById(line.id))
      .map((line) => ({
        id: String(line.id),
        qty: Math.min(9, Math.max(1, Number(line.qty) || 1)),
      }));
  } catch {
    return [];
  }
}

function saveBag() {
  try {
    localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  } catch {
    /* Private browsing can block storage. The bag still works for this visit. */
  }
}

/** @param {string} tag @param {string} className @param {string} [text] */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function fillIdentity() {
  document.title = shop.name;
  setText("mark", shop.name);
  setText("eyebrow", shop.eyebrow);
  setText("shop-name", shop.name);
  setText("tagline", shop.tagline);
  setText("address", shop.address);
  setText("hours", shop.hours);
  setText(
    "footer-line",
    `${shop.name} is a sample shop for Maintainer Pro. Nothing here is for sale.`
  );
  const banner = document.getElementById("banner");
  if (banner) {
    banner.textContent = shop.announcement || "";
    banner.hidden = !shop.announcement;
  }
}

function renderHooks() {
  const list = document.getElementById("hooks");
  if (!(list instanceof HTMLElement)) return;
  list.replaceChildren();
  hooks.forEach((hook, index) => {
    const button = el("button", "try-hook");
    button.type = "button";
    button.dataset.area = hook.area;
    button.setAttribute("aria-label", `Copy message ${index + 1}. ${hook.prompt}`);
    const copy = el("span", "try-copy", "Copy");
    button.append(el("span", "try-num", String(index + 1)), el("span", "try-text", hook.prompt), copy);
    button.addEventListener("click", () => {
      void copyHook(button, hook.prompt);
    });
    button.addEventListener("pointerenter", () => previewArea(hook.area));
    button.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      clearPreview(hook.area);
    });
    button.addEventListener("focus", () => previewArea(hook.area));
    button.addEventListener("blur", () => clearPreview(hook.area));
    list.append(button);
  });
}

let previewAreaName = "";

function previewArea(area) {
  previewAreaName = area;
  document.body.dataset.preview = area;
  const node = document.querySelector(hookLandmarks[area] || "");
  const bar = document.querySelector(".top");
  if (!(node instanceof HTMLElement) || !(bar instanceof HTMLElement)) return;
  const limit = bar.getBoundingClientRect().bottom + 16;
  const rect = node.getBoundingClientRect();
  const inView = rect.top >= limit - 1 && rect.bottom <= window.innerHeight - 8;
  const pinned = window.matchMedia("(min-width: 721px)").matches;
  if (!pinned || inView) return;
  const top = window.scrollY + rect.top - limit;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}

function clearPreview(area) {
  if (previewAreaName !== area) return;
  previewAreaName = "";
  delete document.body.dataset.preview;
}

/** @param {HTMLButtonElement} button @param {string} prompt */
async function copyHook(button, prompt) {
  const status = document.getElementById("try-status");
  let copied = false;
  try {
    await navigator.clipboard.writeText(prompt);
    copied = true;
  } catch {
    const area = document.createElement("textarea");
    area.value = prompt;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    copied = document.execCommand("copy");
    area.remove();
  }
  document.querySelectorAll(".try-hook").forEach((node) => {
    node.classList.toggle("is-copied", node === button && copied);
    const label = node.querySelector(".try-copy");
    if (label) label.textContent = node === button && copied ? "Copied" : "Copy";
  });
  if (status) {
    status.textContent = copied ? tryCopied : "Could not copy. Select the line and copy it yourself.";
    status.classList.toggle("is-done", copied);
  }
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    if (status) {
      status.textContent = tryHint;
      status.classList.remove("is-done");
    }
    button.classList.remove("is-copied");
    const label = button.querySelector(".try-copy");
    if (label) label.textContent = "Copy";
  }, 3200);
}

function renderFilters() {
  const row = document.getElementById("filters");
  if (!(row instanceof HTMLElement)) return;
  row.replaceChildren();
  for (const id of ["all", ...knownCategories()]) {
    const button = el("button", "filter", labelFor(id));
    button.type = "button";
    button.setAttribute("aria-pressed", String(id === category));
    button.addEventListener("click", () => {
      category = id;
      for (const other of row.querySelectorAll(".filter")) {
        other.setAttribute("aria-pressed", String(other === button));
      }
      renderCatalog();
    });
    row.append(button);
  }
}

/** @param {HTMLElement} parent @param {Plant} plant @param {boolean} featured */
function appendProduct(parent, plant, featured) {
  const qty = qtyOf(plant.id);
  const art = el("div", featured ? "featured-art" : "art");
  art.dataset.cat = plant.category;
  art.innerHTML = artFor(plant.category);

  const body = el("div", featured ? "featured-body" : "card-body");
  if (!featured && plant.badge) {
    const badge = el("p", "badge" + (/^sale$/i.test(plant.badge) ? " is-sale" : ""), plant.badge);
    body.append(badge);
  }
  if (featured) body.append(el("p", "kicker", "Featured"));

  const top = el("div", featured ? "featured-top" : "card-top");
  top.append(
    el(featured ? "h2" : "h3", "", plant.name),
    el("p", "price", formatPrice(plant.price))
  );
  const note = el("p", "note", plant.note);
  const add = el("button", "card-add", "Add to bag");
  add.type = "button";
  add.addEventListener("click", () => addPlant(plant.id));
  body.append(top, note);
  if (featured && plant.badge) {
    body.append(el("p", "badge" + (/^sale$/i.test(plant.badge) ? " is-sale" : ""), plant.badge));
  }
  if (qty) body.append(el("p", "in-bag", `${qty} in your bag`));
  body.append(add);
  parent.append(art, body);
}

function renderFeatured() {
  const slot = document.getElementById("featured");
  if (!(slot instanceof HTMLElement)) return;
  const plant = plants.find((item) => item.featured) || plants[0];
  slot.replaceChildren();
  if (!plant) {
    slot.hidden = true;
    return;
  }
  slot.hidden = false;
  if (shop.established) {
    const stamp = el("p", "stamp", `Since ${shop.established}`);
    slot.append(stamp);
  }
  appendProduct(slot, plant, true);
}

function renderCatalog() {
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  if (!(grid instanceof HTMLElement)) return;
  const visible = visiblePlants();
  const noun = visible.length === 1 ? "1 in the shop" : `${visible.length} in the shop`;
  setText("count", noun);
  grid.replaceChildren();
  for (const plant of visible) {
    const card = el("li", "card" + (qtyOf(plant.id) ? " is-in-bag" : ""));
    appendProduct(card, plant, false);
    grid.append(card);
  }
  if (empty) empty.hidden = visible.length > 0;
}

function renderBag() {
  const dialog = document.getElementById("bag");
  const list = document.getElementById("bag-lines");
  const empty = document.getElementById("bag-empty");
  const foot = document.getElementById("bag-foot");
  const note = document.getElementById("bag-note");
  if (!(list instanceof HTMLElement)) return;

  const active = document.activeElement;
  const focusKey = active instanceof HTMLElement ? active.getAttribute("data-focus-key") || "" : "";

  const lines = bag
    .map((line) => ({ line, plant: plantById(line.id) }))
    .filter((row) => row.plant);
  list.replaceChildren();
  if (empty) empty.hidden = lines.length > 0;
  if (foot) foot.hidden = lines.length === 0;
  if (note) note.textContent = pickupNote;

  for (const row of lines) {
    const { line } = row;
    const plant = /** @type {Plant} */ (row.plant);
    const item = el("li", "line");
    const main = el("div", "line-main");
    const remove = el("button", "line-remove", "Remove");
    remove.type = "button";
    remove.setAttribute("data-focus-key", `remove:${plant.id}`);
    remove.addEventListener("click", () => changeQty(plant.id, -line.qty));
    main.append(
      el("p", "line-name", plant.name),
      el("p", "line-meta", `${line.qty} × ${formatPrice(plant.price)}`),
      remove
    );

    const minus = el("button", "qty-btn", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", `Remove one ${plant.name}`);
    minus.setAttribute("data-focus-key", `minus:${plant.id}`);
    minus.addEventListener("click", () => changeQty(plant.id, -1));
    const plus = el("button", "qty-btn", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", `Add another ${plant.name}`);
    plus.setAttribute("data-focus-key", `plus:${plant.id}`);
    plus.addEventListener("click", () => changeQty(plant.id, 1));
    const qty = el("div", "qty");
    qty.append(minus, el("span", "qty-count", String(line.qty)), plus);

    const side = el("div", "line-side");
    side.append(el("p", "line-total", formatPrice(plant.price * line.qty)), qty);
    item.append(main, side);
    list.append(item);
  }

  setText("bag-total", formatPrice(bagTotal()));
  const count = bag.reduce((sum, line) => sum + line.qty, 0);
  setText("bag-count", String(count));
  const opener = document.getElementById("bag-open");
  if (opener) opener.setAttribute("aria-label", `Open bag, ${count} ${count === 1 ? "item" : "items"}`);

  if (focusKey && dialog) {
    const next = dialog.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`);
    if (next instanceof HTMLElement) next.focus();
  }
}

function paint() {
  renderFeatured();
  renderCatalog();
  renderBag();
}

function addPlant(id) {
  if (!plantById(id)) return;
  const line = bag.find((item) => item.id === id);
  if (line) line.qty = Math.min(9, line.qty + 1);
  else bag.push({ id, qty: 1 });
  pickupNote = "";
  saveBag();
  paint();
}

function changeQty(id, delta) {
  const line = bag.find((item) => item.id === id);
  if (!line) return;
  const next = line.qty + delta;
  if (next <= 0) bag = bag.filter((item) => item.id !== id);
  else line.qty = Math.min(9, next);
  if (delta > 0) pickupNote = "";
  saveBag();
  paint();
}

function requestPickup() {
  if (!bag.length) return;
  const count = bag.reduce((sum, line) => sum + line.qty, 0);
  pickupNote = `Pickup noted for ${count} ${count === 1 ? "item" : "items"} at ${shop.address}. This sample keeps it in the browser only.`;
  bag = [];
  saveBag();
  paint();
}

function wire() {
  const form = document.getElementById("search-form");
  const search = document.getElementById("search");
  const opener = document.getElementById("bag-open");
  const dialog = document.getElementById("bag");
  const pickup = document.getElementById("pickup");

  form?.addEventListener("submit", (event) => event.preventDefault());
  if (search instanceof HTMLInputElement) {
    search.addEventListener("input", () => {
      query = search.value;
      renderCatalog();
    });
  }
  opener?.addEventListener("click", () => {
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  });
  if (dialog instanceof HTMLDialogElement) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
  pickup?.addEventListener("click", requestPickup);
}

function syncBarHeight() {
  const bar = document.querySelector(".top");
  if (!(bar instanceof HTMLElement)) return;
  const height = Math.ceil(bar.getBoundingClientRect().height) + 16;
  document.documentElement.style.setProperty("--bar-height", `${height}px`);
}

function init() {
  bag = loadBag();
  fillIdentity();
  renderHooks();
  renderFilters();
  paint();
  wire();
  syncBarHeight();
  window.addEventListener("resize", syncBarHeight);
}

init();
