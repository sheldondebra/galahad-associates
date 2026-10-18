(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { menu?.setAttribute('aria-expanded', 'false'); menu?.setAttribute('aria-label', 'Open navigation'); nav?.classList.remove('is-open'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => { if(event.key === 'Escape' && nav?.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  const wide = matchMedia('(min-width: 851px)');
  wide.addEventListener('change', () => { if(wide.matches) closeMenu(); });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.04});
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  const articles = [...document.querySelectorAll('[data-category]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#insight-search');
  let selected = 'all';
  function filterArticles() {
    const term = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    articles.forEach(article => {
      const visible = (selected === 'all' || article.dataset.category === selected) && article.textContent.toLocaleLowerCase().includes(term);
      article.hidden = !visible;
      if(visible) { count++; article.classList.add('is-visible'); }
    });
    const empty = document.querySelector('#no-results');
    if(empty) empty.hidden = count !== 0;
    const status = document.querySelector('#filter-status');
    if(status) status.textContent = `${count} insight${count === 1 ? '' : 's'} shown`;
    filters.forEach(button => { const active = button.dataset.filter === selected; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  filters.forEach(button => button.addEventListener('click', () => { selected = button.dataset.filter; filterArticles(); }));
  search?.addEventListener('input', filterArticles);
  document.querySelector('#reset-filters')?.addEventListener('click', () => { selected = 'all'; search.value = ''; filterArticles(); search.focus(); });
  const panel = document.querySelector('#cookie-panel');
  let returnFocus = null;
  const close = () => { panel.hidden = true; try {localStorage.setItem('galahad-cookie-notice','seen');} catch {} returnFocus?.focus(); };
  document.querySelectorAll('[data-cookie-open]').forEach(button => button.addEventListener('click', () => { returnFocus = button; panel.hidden = false; panel.querySelector('button').focus(); }));
  document.querySelector('[data-cookie-close]')?.addEventListener('click', close);
  panel?.addEventListener('keydown', event => {
    if(event.key === 'Escape') close();
    if(event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('a,button')];
      if(event.shiftKey && document.activeElement === focusable[0]) {event.preventDefault(); focusable.at(-1).focus();}
      else if(!event.shiftKey && document.activeElement === focusable.at(-1)) {event.preventDefault(); focusable[0].focus();}
    }
  });
  document.querySelector('#error-summary')?.focus();
})();

// Client context switcher: same expertise, different priorities.
(() => {
  const tabs = [...document.querySelectorAll('[data-audience]')];
  if (!tabs.length) return;
  const content = {
    business: {title:'Move your business forward.', copy:'Explore new markets, protect travelling teams and build more resilient operations with security support shaped around your business.', image:'city.webp', alt:'London skyline and the River Thames'},
    private: {title:'Live your life with confidence.', copy:'Discreet personal protection, residential security and secure transport, considered around your family, your routine and the way you want to live.', image:'hotel.webp', alt:'A private hotel setting surrounded by landscaped grounds'},
    organisations: {title:'Keep your mission moving.', copy:'Prepare teams for challenging environments with practical training, informed risk planning and support that takes your operational priorities into account.', image:'desert.webp', alt:'Vehicles navigating remote desert terrain'}
  };
  const panel = document.querySelector('#audience-panel');
  const image = document.querySelector('.audience-image img');
  function select(tab, focus = false) {
    const value = content[tab.dataset.audience];
    tabs.forEach(button => {const active = button === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;});
    document.querySelector('#audience-title').textContent = value.title;
    document.querySelector('#audience-copy').textContent = value.copy;
    panel.setAttribute('aria-labelledby', tab.id);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && panel.animate) {
      panel.animate([{opacity:.4,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], {duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    image.src = '/galahad-associates/assets/images/' + value.image;
    image.alt = value.alt;
    if(focus) tab.focus();
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if(event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if(event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      else if(event.key === 'Home') next = 0;
      else if(event.key === 'End') next = tabs.length - 1;
      if(next !== undefined) {event.preventDefault(); select(tabs[next], true);}
    });
  });
})();

(() => {
  const pause = document.querySelector('.ribbon-pause');
  pause?.addEventListener('click', () => {
    const paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Resume service ticker' : 'Pause service ticker');
    pause.querySelector('[data-ticker-pause]').hidden = paused;
    pause.querySelector('[data-ticker-play]').hidden = !paused;
    document.querySelector('.expertise-ribbon').classList.toggle('is-paused', paused);
  });
})();
