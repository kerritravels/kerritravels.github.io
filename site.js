function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function cityUrl(city) {
  return `city.html?city=${encodeURIComponent(city.slug)}`;
}

function pages() {
  return cities.filter((city) => city.slug && city.sections);
}

function menuHtml(currentSlug) {
  return pages().map((city) => {
    const current = city.slug === currentSlug ? ' aria-current="page"' : "";
    return `<li><a href="${cityUrl(city)}"${current}>${esc(city.name)}</a></li>`;
  }).join("");
}

function figureHtml(spot) {
  const note = spot.note ? `<span>${esc(spot.note)}</span>` : "";
  return `<figure><img src="${esc(spot.photo)}" alt="${esc(spot.name)}"><figcaption><strong>${esc(spot.name)}</strong>${note}</figcaption></figure>`;
}

function textHtml(spot) {
  const note = spot.note ? `<span>${esc(spot.note)}</span>` : "";
  return `<div class="spot"><strong>${esc(spot.name)}</strong>${note}</div>`;
}

function linkText(value) {
  return esc(value).replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}">${url}</a>`);
}

function linesHtml(spots) {
  return `<ul class="favorites">${spots.map((spot) => {
    const note = spot.note ? `<span>${esc(spot.note)}</span>` : "";
    return `<li><strong>${esc(spot.name)}</strong>${note}</li>`;
  }).join("")}</ul>`;
}

function sectionHtml(section) {
  const spots = section.spots || [];
  let body = "";
  if (section.lines) {
    body = spots.length ? linesHtml(spots) : "";
  } else {
    let index = 0;
    while (index < spots.length) {
      if (spots[index].photo) {
        const photos = [];
        while (index < spots.length && spots[index].photo) photos.push(spots[index++]);
        body += `<div class="shots">${photos.map(figureHtml).join("")}</div>`;
      } else {
        while (index < spots.length && !spots[index].photo) body += textHtml(spots[index++]);
      }
    }
  }
  const note = section.note ? `<p class="section-note">${linkText(section.note)}</p>` : "";
  if (!body && !note) return "";
  return `<section class="recs"><h2>${esc(section.title)}</h2>${note}${body}</section>`;
}

function pinHtml(place) {
  const x = ((place.lng + 180) / 360) * 100;
  const y = ((90 - place.lat) / 180) * 100;
  const label = ["n", "s", "e", "w", "ne", "nw", "se", "sw"].includes(place.label) ? place.label : "n";
  const linked = place.slug && place.sections;
  const cls = `pin pin-${label}`;
  const style = `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%`;
  const inner = `<span class="pin-mark"></span><span class="pin-name">${esc(place.name)}</span>`;
  if (linked) return `<a class="${cls}" style="${style}" href="${cityUrl(place)}">${inner}</a>`;
  return `<span class="${cls}" style="${style}" tabindex="0">${inner}</span>`;
}

function homeHtml() {
  const places = cities.filter((city) => city.lat != null && city.lng != null);
  return `<div class="map-frame"><img src="images/world.svg" alt=""><div class="pins">${places.map(pinHtml).join("")}</div></div>`;
}

// ponytail: O(n^3) scan over pin edges. Fine under a few dozen pins; use a sweep if the list gets long.
function frameWindow(points, viewW, viewH) {
  const pad = 48;
  if (!points.length || viewW <= 0 || viewH <= 0) return { left: 0, top: 0 };
  const xs = [];
  const ys = [];
  for (const p of points) {
    xs.push(p.left - pad, p.right + pad - viewW);
    ys.push(p.top - pad, p.bottom + pad - viewH);
  }
  let bestCount = -1;
  let bestArea = Infinity;
  let best = { left: 0, top: 0 };
  for (const left of xs) {
    for (const top of ys) {
      const right = left + viewW;
      const bottom = top + viewH;
      let count = 0;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const p of points) {
        if (p.left >= left && p.right <= right && p.top >= top && p.bottom <= bottom) {
          count += 1;
          minX = Math.min(minX, p.left);
          minY = Math.min(minY, p.top);
          maxX = Math.max(maxX, p.right);
          maxY = Math.max(maxY, p.bottom);
        }
      }
      if (!count) continue;
      const area = (maxX - minX) * (maxY - minY);
      if (count < bestCount || (count === bestCount && area >= bestArea)) continue;
      bestCount = count;
      bestArea = area;
      const boxW = maxX - minX + pad * 2;
      const boxH = maxY - minY + pad * 2;
      best = {
        left: boxW <= viewW ? (minX + maxX) / 2 - viewW / 2 : left,
        top: boxH <= viewH ? (minY + maxY) / 2 - viewH / 2 : top,
      };
    }
  }
  return best;
}

function framePins(map) {
  const origin = map.getBoundingClientRect();
  const points = [...map.querySelectorAll(".pin")].map((pin) => {
    const box = pin.getBoundingClientRect();
    const left = box.left - origin.left + map.scrollLeft;
    const top = box.top - origin.top + map.scrollTop;
    return { left, top, right: left + box.width, bottom: top + box.height };
  });
  const frame = frameWindow(points, map.clientWidth, map.clientHeight);
  map.scrollLeft = frame.left;
  map.scrollTop = frame.top;
}

function enableMap(map) {
  framePins(map);
  map.addEventListener("wheel", (event) => {
    event.preventDefault();
    const overflowX = map.scrollWidth - map.clientWidth;
    const overflowY = map.scrollHeight - map.clientHeight;
    if (event.shiftKey) {
      map.scrollTop += event.deltaY;
      map.scrollLeft += event.deltaX;
    } else if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      map.scrollLeft += event.deltaX;
      map.scrollTop += event.deltaY;
    } else if (overflowX > overflowY) {
      map.scrollLeft += event.deltaY;
    } else {
      map.scrollTop += event.deltaY;
    }
  }, { passive: false });

  let drag = null;
  map.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest(".pin")) return;
    drag = { x: event.clientX, y: event.clientY, left: map.scrollLeft, top: map.scrollTop };
    map.classList.add("is-dragging");
    map.setPointerCapture(event.pointerId);
  });
  map.addEventListener("pointermove", (event) => {
    if (!drag) return;
    map.scrollLeft = drag.left - (event.clientX - drag.x);
    map.scrollTop = drag.top - (event.clientY - drag.y);
  });
  const endDrag = () => {
    drag = null;
    map.classList.remove("is-dragging");
  };
  map.addEventListener("pointerup", endDrag);
  map.addEventListener("pointercancel", endDrag);
}

function pageHtml(city) {
  const blurb = city.blurb ? `<p class="blurb">${esc(city.blurb)}</p>` : "";
  const sections = (city.sections || []).map(sectionHtml).join("");
  return blurb + sections;
}

function boot() {
  const slug = new URLSearchParams(location.search).get("city");
  const menu = document.querySelector("#city-menu");
  const grid = document.querySelector("#city-grid");
  const page = document.querySelector("#city-page");
  if (menu) menu.innerHTML = menuHtml(slug);
  if (grid) {
    grid.innerHTML = homeHtml();
    enableMap(grid);
  }
  if (!page) return;
  const heading = document.querySelector("#page-title");
  const city = pages().find((item) => item.slug === slug);
  if (!city) {
    document.title = "kerritravels";
    if (heading) heading.textContent = "";
    page.innerHTML = `<section class="recs"><h2>No page for that city yet.</h2><p><a href="index.html">Back home</a></p></section>`;
    return;
  }
  document.title = `${city.name} · kerritravels`;
  if (heading) heading.textContent = city.name;
  page.innerHTML = pageHtml(city);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", boot);
}
