(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  initMenu();
  initMobileNav();
  initDishDialog();
  initPhotoDialog();
  initReservation();
  initReveal();

  function initMenu() {
    const nav = document.querySelector(".menu-tabs");
    const panels = [...document.querySelectorAll(".menu-panel")];
    if (!nav || !panels.length) return;

    const tabs = [...nav.querySelectorAll("a")];
    nav.setAttribute("role", "tablist");

    tabs.forEach((tab, index) => {
      const panel = panels[index];
      tab.setAttribute("role", "tab");
      tab.id = tab.id || "tab-" + panel.id;
      tab.setAttribute("aria-controls", panel.id);
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.setAttribute("tabindex", "0");
    });

    let initial = 0;
    const hash = window.location.hash.replace("#", "");
    const hashed = panels.findIndex((panel) => panel.id === hash);
    if (hashed >= 0) initial = hashed;

    activate(initial);

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        activate(index);
      });

      tab.addEventListener("keydown", (event) => {
        const key = event.key;
        let next = null;
        if (key === "ArrowRight" || key === "ArrowDown") next = (index + 1) % tabs.length;
        if (key === "ArrowLeft" || key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
        if (key === "Home") next = 0;
        if (key === "End") next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        tabs[next].focus();
        activate(next);
      });
    });

    function activate(index) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
        if (selected) tab.setAttribute("aria-current", "true");
        else tab.removeAttribute("aria-current");
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === index);
      });
    }
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.getElementById("site-nav");
    const label = toggle && toggle.querySelector("[data-nav-label]");
    const main = document.querySelector("main");
    const footer = document.querySelector(".site-footer");
    if (!toggle || !panel) return;

    const desktop = window.matchMedia("(min-width: 761px)");
    let lastFocus = toggle;

    toggle.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });

    panel.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      closeMenu({ restore: false });
      const id = link.getAttribute("href") || "";
      if (!id.startsWith("#")) return;
      const target = document.querySelector(id);
      const heading = target && target.querySelector("h2, h3");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus();
    });

    document.addEventListener("keydown", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      trapFocus(event, headerFocusables());
    });

    document.addEventListener("pointerdown", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    desktop.addEventListener("change", () => {
      if (desktop.matches) closeMenu();
    });

    function openMenu() {
      lastFocus = document.activeElement || toggle;
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (label) label.textContent = "Close menu";
      document.body.classList.add("menu-open");
      if (main) main.inert = true;
      if (footer) footer.inert = true;
      const first = panel.querySelector("a");
      if (first) first.focus();
    }

    function closeMenu(options) {
      const restore = !options || options.restore !== false;
      const wasOpen = toggle.getAttribute("aria-expanded") === "true";
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (label) label.textContent = "Open menu";
      document.body.classList.remove("menu-open");
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      if (wasOpen && restore) toggle.focus();
    }

    function headerFocusables() {
      return [...document.querySelector(".site-header").querySelectorAll("a, button")].filter((el) => {
        return el.getClientRects().length > 0;
      });
    }
  }

  function initDishDialog() {
    const dialog = document.getElementById("dish-dialog");
    if (!dialog) return;
    const title = document.getElementById("dish-dialog-title");
    const price = document.getElementById("dish-dialog-price");
    const body = document.getElementById("dish-dialog-body");
    let opener = null;

    document.querySelectorAll(".dish-more").forEach((details) => {
      const summary = details.querySelector("summary");
      if (!summary) return;
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        details.open = false;
        const article = details.closest("article");
        const heading = article && article.querySelector("h3");
        const full = details.querySelector(".dish-full");
        title.textContent = heading ? heading.textContent : "Dish";
        price.textContent = article ? article.getAttribute("data-price") || "" : "";
        body.replaceChildren(full ? full.cloneNode(true) : document.createTextNode(""));
        opener = summary;
        dialog.showModal();
        title.focus();
      });
    });

    bindDialog(dialog, () => opener);
  }

  function initPhotoDialog() {
    const dialog = document.getElementById("photo-dialog");
    if (!dialog) return;
    const image = document.getElementById("photo-dialog-img");
    const title = document.getElementById("photo-dialog-title");
    let opener = null;

    document.querySelectorAll(".gallery-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const source = link.querySelector("img");
        const caption = link.getAttribute("data-caption") || (source ? source.alt : "Photograph");
        image.src = link.getAttribute("href");
        image.alt = "";
        title.textContent = caption;
        opener = link;
        dialog.showModal();
        title.focus();
      });
    });

    bindDialog(dialog, () => opener);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openDialog = document.querySelector("dialog[open]");
    if (!openDialog) return;
    event.preventDefault();
    openDialog.close();
  });

  function bindDialog(dialog, getOpener) {
    dialog.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      const opener = getOpener();
      if (opener && typeof opener.focus === "function") opener.focus();
    });
  }

  function trapFocus(event, elements) {
    const list = elements.filter((el) => el && !el.disabled);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initReservation() {
    const form = document.getElementById("reserve-form");
    if (!form) return;

    const nameInput = document.getElementById("guest-name");
    const emailInput = document.getElementById("guest-email");
    const dateInput = document.getElementById("reserve-date");
    const timeSelect = document.getElementById("reserve-time");
    const guestsInput = document.getElementById("guest-count");
    const errors = document.getElementById("form-errors");
    const success = document.getElementById("reserve-success");
    const timeHint = document.getElementById("time-hint");
    const submitButton = document.getElementById("reserve-submit");

    const today = startOfDay(new Date());
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    dateInput.min = formatISO(today);
    dateInput.max = formatISO(maxDate);

    dateInput.addEventListener("change", () => {
      renderSlots(dateInput.value);
      if (dateInput.getAttribute("aria-invalid") === "true") clearField(dateInput);
    });

    [nameInput, emailInput, guestsInput, timeSelect].forEach((field) => {
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") clearField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitDemo();
    });

    form.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        if (event.target.tagName === "BUTTON") return;
        event.preventDefault();
        submitDemo();
      }
    });

    renderSlots("");

    function submitDemo() {
      clearAllErrors();
      const found = validate();
      if (found.length) {
        found.forEach((item) => {
          const field = document.getElementById(item.field);
          const message = document.getElementById(field.getAttribute("data-error"));
          field.setAttribute("aria-invalid", "true");
          message.hidden = false;
          message.textContent = item.message;
        });
        errors.hidden = false;
        errors.replaceChildren();
        const lead = document.createElement("p");
        lead.textContent = "The demonstration form needs a few corrections.";
        const list = document.createElement("ul");
        found.forEach((item) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#" + item.field;
          link.textContent = item.message;
          li.append(link);
          list.append(li);
        });
        errors.append(lead, list);
        errors.focus();
        return;
      }

      const record = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        date: dateInput.value,
        time: timeSelect.value,
        guests: guestsInput.value
      };

      form.hidden = true;
      errors.hidden = true;
      renderSuccess(record);
      form.reset();
      renderSlots("");
    }

    function validate() {
      const found = [];
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const dateValue = dateInput.value;
      const timeValue = timeSelect.value;
      const guests = guestsInput.value;

      if (!/^[\p{L}][\p{L}\s.'’-]{1,59}$/u.test(name)) {
        found.push({ field: nameInput.id, message: "Enter a name using at least 2 letters." });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 80) {
        found.push({ field: emailInput.id, message: "Enter an email address, such as name@example.com." });
      }

      let dateReady = false;
      if (!dateValue) {
        found.push({ field: dateInput.id, message: "Choose a date." });
      } else {
        const chosen = parseISODate(dateValue);
        if (!chosen || chosen < today) {
          found.push({ field: dateInput.id, message: "Choose today or a future date. Past dates are not accepted." });
        } else if (chosen > maxDate) {
          found.push({ field: dateInput.id, message: "This demo accepts dates up to 60 days ahead." });
        } else if (chosen.getDay() === 1) {
          found.push({ field: dateInput.id, message: "The dining room is closed on Mondays. Choose another date." });
        } else {
          dateReady = true;
        }
      }

      if (dateReady) {
        const allowed = [...timeSelect.querySelectorAll("option")]
          .map((option) => option.value)
          .filter(Boolean);
        if (!timeValue || !allowed.includes(timeValue)) {
          found.push({ field: timeSelect.id, message: "Choose one of the sample seating times." });
        }
      }

      const guestCount = Number(guests);
      if (!guests || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 8) {
        found.push({ field: guestsInput.id, message: "Choose a guest count from 1 to 8." });
      }

      return found;
    }

    function renderSuccess(record) {
      success.replaceChildren();
      const heading = document.createElement("h3");
      heading.id = "reserve-success-title";
      heading.tabIndex = -1;
      heading.textContent = "No reservation was made.";

      const lead = document.createElement("p");
      lead.textContent = "This was a demonstration on this page only. Nothing was sent, stored, or logged, and no table is held.";

      const list = document.createElement("ul");
      list.className = "confirm-list";
      [
        ["Name", record.name],
        ["Email", record.email],
        ["Date", formatDisplayDate(record.date)],
        ["Time", record.time],
        ["Guests", record.guests]
      ].forEach(([label, value]) => {
        const item = document.createElement("li");
        const term = document.createElement("span");
        term.textContent = label;
        item.append(term, document.createTextNode(value));
        list.append(item);
      });

      const again = document.createElement("button");
      again.type = "button";
      again.className = "btn";
      again.dataset.reset = "true";
      again.textContent = "Clear this demo";
      again.addEventListener("click", () => {
        success.hidden = true;
        success.replaceChildren();
        form.hidden = false;
        form.reset();
        renderSlots("");
        clearAllErrors();
        nameInput.focus();
      });

      success.append(heading, lead, list, again);
      success.hidden = false;
      heading.focus();
    }

    function renderSlots(dateValue) {
      timeSelect.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      timeSelect.append(placeholder);

      if (!dateValue) {
        placeholder.textContent = "Choose a date first";
        timeHint.textContent = "Sample seating times appear after you choose a date. Lunch starts at 12:00 and dinner at 17:00, every half hour. Monday is closed.";
        return;
      }

      const chosen = parseISODate(dateValue);
      if (!chosen) {
        placeholder.textContent = "Select a time";
        timeHint.textContent = "Enter a valid date to see sample seating times.";
        return;
      }

      if (chosen < today) {
        placeholder.textContent = "Date has passed";
        timeHint.textContent = "Choose today or a future date. Past dates are not accepted.";
        return;
      }

      if (chosen > maxDate) {
        placeholder.textContent = "Too far ahead";
        timeHint.textContent = "This demo accepts dates up to 60 days ahead.";
        return;
      }

      if (chosen.getDay() === 1) {
        placeholder.textContent = "Closed on Mondays";
        timeHint.textContent = "The dining room is closed on Mondays. Choose another date.";
        return;
      }

      let list = slotsFor(chosen.getDay());
      if (sameDay(chosen, today)) list = list.filter((time) => !slotHasPassed(chosen, time));

      if (!list.length) {
        placeholder.textContent = "No times left";
        timeHint.textContent = "No sample seating times remain on this date. Choose another day.";
        return;
      }

      placeholder.textContent = "Select a time";
      addGroup("Lunch", list.filter((time) => time < "17:00"));
      addGroup("Dinner", list.filter((time) => time >= "17:00"));
      timeHint.textContent = "Sample seating times for this date. Last seating is before the kitchen closes.";
    }

    function addGroup(label, times) {
      if (!times.length) return;
      const group = document.createElement("optgroup");
      group.label = label;
      times.forEach((time) => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        group.append(option);
      });
      timeSelect.append(group);
    }

    function clearField(field) {
      field.removeAttribute("aria-invalid");
      const message = document.getElementById(field.getAttribute("data-error"));
      if (message) {
        message.hidden = true;
        message.textContent = "";
      }
    }

    function clearAllErrors() {
      [nameInput, emailInput, dateInput, timeSelect, guestsInput].forEach(clearField);
      errors.hidden = true;
      errors.replaceChildren();
    }
  }

  function slotsFor(day) {
    if (day === 1) return [];
    if (day === 0) return range("12:00", "19:30");
    if (day === 5) return range("12:00", "14:00").concat(range("17:00", "21:30"));
    if (day === 6) return range("12:00", "21:30");
    return range("17:00", "20:30");
  }

  function range(start, end) {
    const out = [];
    let [hour, minute] = start.split(":").map(Number);
    const endMinutes = toMinutes(end);
    while (hour * 60 + minute <= endMinutes) {
      out.push(String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0"));
      minute += 30;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return out;
  }

  function toMinutes(value) {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  }

  function slotHasPassed(date, time) {
    const [hour, minute] = time.split(":").map(Number);
    const slot = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
    return slot.getTime() <= Date.now();
  }

  function parseISODate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1) return null;
    return startOfDay(date);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function formatISO(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function formatDisplayDate(value) {
    const date = parseISODate(value);
    if (!date) return value;
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function initReveal() {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length || reduceMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item) => observer.observe(item));
  }
})();
