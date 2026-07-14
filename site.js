// ============================================================
// SUN SPIRIT — Logique partagée entre toutes les pages du site
// ============================================================
(function(){
  var WA_NUMBER = '2250140970550';
  var CART_KEY = 'sunspirit_cart_v1';

  function fmt(n){ return n.toLocaleString('fr-FR').replace(/,/g,' '); }

  function slugify(name){
    return 'p-' + name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function placeholderImg(name, accent){
    var initials = name.split(' ').slice(0,2).map(function(w){return w[0];}).join('').toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">' +
      '<rect width="300" height="400" fill="#0d0d0d"/>' +
      '<rect x="0" y="0" width="300" height="400" fill="none" stroke="' + accent + '" stroke-opacity="0.25" stroke-width="2"/>' +
      '<g fill="none" stroke="' + accent + '" stroke-width="2.5">' +
        '<path d="M130 40 h40 v35 c0 10 12 14 12 30 v230 c0 8 -6 14 -14 14 h-66 c-8 0 -14 -6 -14 -14 v-230 c0 -16 12 -20 12 -30 z"/>' +
        '<line x1="122" y1="140" x2="178" y2="140"/>' +
      '</g>' +
      '<text x="150" y="240" font-family="Georgia, serif" font-size="30" font-weight="700" fill="' + accent + '" text-anchor="middle" opacity="0.85">' + initials + '</text>' +
    '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // ---------------------------------------------------------
  // CART (persisted in localStorage so it survives page changes)
  // ---------------------------------------------------------
  function loadCart(){
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){ return []; }
  }
  function saveCart(cart){
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){}
  }
  var cart = loadCart();

  function addToCart(cat, name, format, unitPrice, qty){
    if(qty <= 0) return;
    var existing = cart.find(function(l){ return l.cat===cat && l.name===name && l.format===format; });
    if(existing){ existing.qty += qty; } else { cart.push({ cat:cat, name:name, format:format, unitPrice:unitPrice, qty:qty }); }
    saveCart(cart);
    renderCart();
  }

  function renderCart(){
    var cartBody = document.getElementById('cartBody');
    var cartBadge = document.getElementById('cartBadge');
    var cartTotalValue = document.getElementById('cartTotalValue');
    var cartWhatsappBtn = document.getElementById('cartWhatsappBtn');
    if(!cartBody) return;

    var count = cart.reduce(function(s,l){ return s + l.qty; }, 0);
    if(cartBadge){
      cartBadge.textContent = count;
      cartBadge.classList.toggle('hidden', count === 0);
    }

    if(cart.length === 0){
      cartBody.innerHTML = '<div class="cart-empty">Votre panier est vide.</div>';
      if(cartTotalValue) cartTotalValue.textContent = '0 CFA';
      if(cartWhatsappBtn) cartWhatsappBtn.disabled = true;
      return;
    }
    var total = 0;
    cartBody.innerHTML = cart.map(function(line, i){
      var subtotal = line.unitPrice * line.qty;
      total += subtotal;
      return '<div class="cart-line">' +
        '<div><div class="cl-name">' + line.name + '</div>' +
        '<div class="cl-meta">' + line.cat + ' · ' + line.format + ' × ' + line.qty + '</div></div>' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
        '<span class="cl-price">' + fmt(subtotal) + ' CFA</span>' +
        '<button type="button" class="cl-remove" data-i="' + i + '" aria-label="Retirer">✕</button>' +
        '</div></div>';
    }).join('');
    if(cartTotalValue) cartTotalValue.textContent = fmt(total) + ' CFA';
    if(cartWhatsappBtn) cartWhatsappBtn.disabled = false;

    cartBody.querySelectorAll('.cl-remove').forEach(function(btn){
      btn.addEventListener('click', function(){
        cart.splice(parseInt(btn.dataset.i, 10), 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  function initCart(){
    var overlay = document.getElementById('cartOverlay');
    var drawer = document.getElementById('cartDrawer');
    var openBtn = document.getElementById('cartOpenBtn');
    var closeBtn = document.getElementById('cartCloseBtn');
    var clearBtn = document.getElementById('cartClearBtn');
    var whatsappBtn = document.getElementById('cartWhatsappBtn');
    if(!drawer) return;

    function openCart(){ overlay.classList.add('open'); drawer.classList.add('open'); }
    function closeCart(){ overlay.classList.remove('open'); drawer.classList.remove('open'); }
    if(openBtn) openBtn.addEventListener('click', openCart);
    if(closeBtn) closeBtn.addEventListener('click', closeCart);
    if(overlay) overlay.addEventListener('click', closeCart);
    if(clearBtn) clearBtn.addEventListener('click', function(){
      cart = [];
      saveCart(cart);
      renderCart();
    });
    if(whatsappBtn) whatsappBtn.addEventListener('click', function(){
      if(cart.length === 0) return;
      var total = 0;
      var lines = cart.map(function(line){
        var subtotal = line.unitPrice * line.qty;
        total += subtotal;
        return '- ' + line.name + ' (' + line.cat + ') — ' + line.format + ' x' + line.qty + ' (' + fmt(subtotal) + ' CFA)';
      });
      var msg = 'Bonjour Sun Spirit, je souhaite passer la commande suivante :\n\n' +
        lines.join('\n') + '\n\nTotal : ' + fmt(total) + ' CFA';
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    });
    renderCart();
  }

  // ---------------------------------------------------------
  // HAMBURGER MENU
  // ---------------------------------------------------------
  function initMegaMenu(){
    var btn = document.getElementById('hamburgerBtn');
    var overlay = document.getElementById('megaOverlay');
    var menu = document.getElementById('megaMenu');
    var closeBtn = document.getElementById('megaCloseBtn');
    if(!btn || !menu) return;
    function openMenu(){ overlay.classList.add('open'); menu.classList.add('open'); }
    function closeMenu(){ overlay.classList.remove('open'); menu.classList.remove('open'); }
    btn.addEventListener('click', openMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);
  }

  // ---------------------------------------------------------
  // SEARCH BAR
  // ---------------------------------------------------------
  function buildSearchIndex(){
    var index = [];
    Object.keys(CATALOG_DATA).forEach(function(cat){
      var group = CATALOG_DATA[cat];
      group.items.forEach(function(item){
        index.push({
          name: item.name,
          cat: cat,
          img: item.img || placeholderImg(item.name, group.accent),
          url: CATEGORY_PAGES[cat].url + '#' + slugify(item.name)
        });
      });
    });
    return index;
  }

  function initSearch(){
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    if(!input || !results) return;
    var index = buildSearchIndex();

    function renderResults(query){
      var q = query.trim().toLowerCase();
      if(q.length === 0){ results.classList.remove('open'); results.innerHTML = ''; return; }
      var matches = index.filter(function(p){ return p.name.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
      if(matches.length === 0){
        results.innerHTML = '<div class="search-empty">Aucun produit trouvé pour "' + query + '"</div>';
      } else {
        results.innerHTML = matches.map(function(p){
          return '<div class="search-result-item" data-url="' + p.url + '">' +
            '<img src="' + p.img + '" alt="' + p.name + '">' +
            '<div><div class="search-result-name">' + p.name + '</div>' +
            '<div class="search-result-cat">' + p.cat + '</div></div></div>';
        }).join('');
        results.querySelectorAll('.search-result-item').forEach(function(el){
          el.addEventListener('click', function(){
            window.location.href = el.dataset.url;
          });
        });
      }
      results.classList.add('open');
    }

    input.addEventListener('input', function(){ renderResults(input.value); });
    input.addEventListener('focus', function(){ if(input.value.trim().length) renderResults(input.value); });
    document.addEventListener('click', function(e){
      if(!results.contains(e.target) && e.target !== input){ results.classList.remove('open'); }
    });
  }

  // ---------------------------------------------------------
  // DEEP-LINK HIGHLIGHT: si l'URL contient #p-xxx, on scroll et
  // on met en évidence la carte produit correspondante
  // ---------------------------------------------------------
  function initDeepLinkHighlight(){
    if(!window.location.hash) return;
    var el = document.querySelector(window.location.hash);
    if(!el) return;
    setTimeout(function(){
      el.scrollIntoView({ behavior:'smooth', block:'center' });
      el.classList.add('highlight');
      setTimeout(function(){ el.classList.remove('highlight'); }, 2600);
    }, 200);
  }

  // ---------------------------------------------------------
  // PRODUCT GRID (pages whisky.html, cognac.html, tequila.html, champagnes.html)
  // ---------------------------------------------------------
  window.renderProductGrid = function(cat){
    var group = CATALOG_DATA[cat];
    var grid = document.getElementById('grid-' + cat);
    if(!grid || !group) return;

    grid.innerHTML = group.items.map(function(item, idx){
      var imgSrc = item.img || placeholderImg(item.name, group.accent);
      var cardId = cat + '-' + idx;
      var anchorId = slugify(item.name);
      return '<div class="product-card" id="' + anchorId + '">' +
        '<img class="product-photo" src="' + imgSrc + '" alt="' + item.name + '" loading="lazy">' +
        '<div class="product-body">' +
          '<div class="product-name">' + item.name + '</div>' +
          '<div class="product-price">' + fmt(item.bottle) + ' CFA</div>' +
          '<div class="product-row">' +
            '<div class="qty-stepper" data-id="' + cardId + '"><button type="button" data-act="dec">−</button><span>1</span><button type="button" data-act="inc">+</button></div>' +
            '<button type="button" class="add-to-cart-btn" data-id="' + cardId + '" data-cat="' + cat + '" data-name="' + item.name + '" data-bottle="' + item.bottle + '">Ajouter</button>' +
          '</div>' +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.qty-stepper').forEach(function(stepper){
      var span = stepper.querySelector('span');
      stepper.querySelectorAll('button').forEach(function(btn){
        btn.addEventListener('click', function(){
          var cur = parseInt(span.textContent, 10);
          if(btn.dataset.act === 'inc'){ cur++; } else { cur = Math.max(1, cur - 1); }
          span.textContent = cur;
        });
      });
    });

    grid.querySelectorAll('.add-to-cart-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.dataset.id;
        var qtySpan = grid.querySelector('.qty-stepper[data-id="' + id + '"] span');
        var qty = parseInt(qtySpan.textContent, 10);
        var unitPrice = parseInt(btn.dataset.bottle, 10);
        addToCart(btn.dataset.cat, btn.dataset.name, 'Bouteille', unitPrice, qty);
        btn.textContent = 'Ajouté ✓';
        btn.classList.add('added');
        setTimeout(function(){ btn.textContent = 'Ajouter'; btn.classList.remove('added'); }, 1200);
        qtySpan.textContent = '1';
      });
    });

    initDeepLinkHighlight();
  };

  // ---------------------------------------------------------
  // CARTON / GROS GRID (page carton.html)
  // ---------------------------------------------------------
  window.renderCartonGrid = function(){
    var grid = document.getElementById('grid-carton');
    if(!grid) return;
    var cards = [];
    Object.keys(CATALOG_DATA).forEach(function(cat){
      var group = CATALOG_DATA[cat];
      group.items.forEach(function(item, idx){
        if(!item.carton) return;
        var imgSrc = item.img || placeholderImg(item.name, group.accent);
        var cardId = 'carton-' + cat + '-' + idx;
        cards.push('<div class="product-card">' +
          '<img class="product-photo" src="' + imgSrc + '" alt="' + item.name + '" loading="lazy">' +
          '<div class="product-body">' +
            '<div class="product-name">' + item.name + '<br><span style="color:var(--gold-soft); font-size:10px; letter-spacing:1px; text-transform:uppercase;">' + cat + '</span></div>' +
            '<div class="product-price">Carton (6) — ' + fmt(item.carton) + ' CFA</div>' +
            '<div class="product-row">' +
              '<div class="qty-stepper" data-id="' + cardId + '"><button type="button" data-act="dec">−</button><span>1</span><button type="button" data-act="inc">+</button></div>' +
              '<button type="button" class="add-to-cart-btn carton-add" data-id="' + cardId + '" data-cat="' + cat + '" data-name="' + item.name + '" data-carton="' + item.carton + '">Ajouter</button>' +
            '</div>' +
          '</div></div>');
      });
    });
    grid.innerHTML = cards.join('');

    grid.querySelectorAll('.qty-stepper').forEach(function(stepper){
      var span = stepper.querySelector('span');
      stepper.querySelectorAll('button').forEach(function(btn){
        btn.addEventListener('click', function(){
          var cur = parseInt(span.textContent, 10);
          if(btn.dataset.act === 'inc'){ cur++; } else { cur = Math.max(1, cur - 1); }
          span.textContent = cur;
        });
      });
    });

    grid.querySelectorAll('.carton-add').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.dataset.id;
        var qtySpan = grid.querySelector('.qty-stepper[data-id="' + id + '"] span');
        var qty = parseInt(qtySpan.textContent, 10);
        addToCart(btn.dataset.cat, btn.dataset.name, 'Carton (6)', parseInt(btn.dataset.carton, 10), qty);
        btn.textContent = 'Ajouté ✓';
        btn.classList.add('added');
        setTimeout(function(){ btn.textContent = 'Ajouter'; btn.classList.remove('added'); }, 1200);
        qtySpan.textContent = '1';
      });
    });
  };

  // ---------------------------------------------------------
  // GALERIE (page galerie.html)
  // ---------------------------------------------------------
  window.renderGallery = function(){
    var track = document.getElementById('galleryTrack');
    if(!track) return;
    var slides = [];
    Object.keys(CATALOG_DATA).forEach(function(cat){
      var group = CATALOG_DATA[cat];
      group.items.forEach(function(item){
        var imgSrc = item.img || placeholderImg(item.name, group.accent);
        var url = CATEGORY_PAGES[cat].url + '#' + slugify(item.name);
        slides.push('<a class="gallery-slide" href="' + url + '">' +
          '<img src="' + imgSrc + '" alt="' + item.name + '" loading="lazy">' +
          '<div class="gallery-slide-body">' +
            '<div class="gallery-slide-cat">' + cat + '</div>' +
            '<div class="gallery-slide-name">' + item.name + '</div>' +
            '<div class="gallery-slide-price">' + fmt(item.bottle) + ' CFA</div>' +
          '</div></a>');
      });
    });
    track.innerHTML = slides.join('');
  };

  // ---------------------------------------------------------
  // KITS (page kits.html) : grille des 8 kits + configurateur libre
  // ---------------------------------------------------------
  window.renderKits = function(){
    var grid = document.getElementById('kitsGrid');
    if(!grid) return;
    grid.innerHTML = KITS_DATA.map(function(kit){
      return '<div class="kit-card">' +
        '<img src="' + kit.img + '" alt="' + kit.name + ' — ' + kit.contents + '" loading="lazy">' +
        '<div class="kit-card-body">' +
          '<div class="kit-name">' + kit.name + '</div>' +
          '<div class="kit-contents">' + kit.contents + '</div>' +
          '<div class="kit-price">' + fmt(kit.price) + ' CFA</div>' +
          '<a class="kit-order-btn kit-order" data-kit="' + kit.id + ' (' + kit.contents + ')" data-price="' + kit.price + '" href="#">Commander</a>' +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.kit-order').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var kit = btn.dataset.kit;
        var price = btn.dataset.price;
        var msg = 'Bonjour Sun Spirit, je souhaite commander le ' + kit + ' au prix de ' + fmt(parseInt(price, 10)) + ' CFA.';
        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
        window.open(url, '_blank', 'noopener');
      });
    });
  };

  window.initConfigurator = function(){
    var tabsEl = document.getElementById('configTabs');
    var listEl = document.getElementById('configList');
    var detailEl = document.getElementById('configDetail');
    var slipBody = document.getElementById('orderSlipBody');
    var totalEl = document.getElementById('configTotal');
    var orderBtn = document.getElementById('configOrderBtn');
    if(!tabsEl) return;

    var cats = Object.keys(CATALOG_DATA);
    var activeCat = 0;
    var activeItem = 0;
    var order = [];

    function renderTabs(){
      tabsEl.innerHTML = cats.map(function(c, i){
        return '<button type="button" class="config-tab' + (i===activeCat?' active':'') + '" data-i="' + i + '">' + c + '</button>';
      }).join('');
      tabsEl.querySelectorAll('.config-tab').forEach(function(btn){
        btn.addEventListener('click', function(){
          activeCat = parseInt(btn.dataset.i, 10);
          activeItem = 0;
          renderTabs(); renderList(); renderDetail();
        });
      });
    }

    function renderList(){
      var group = CATALOG_DATA[cats[activeCat]];
      listEl.innerHTML = group.items.map(function(item, i){
        return '<div class="config-list-row' + (i===activeItem?' active':'') + '" data-i="' + i + '">' +
          '<span class="config-list-name">' + item.name + '</span>' +
          '<span class="config-list-price">' + fmt(item.bottle) + ' CFA</span>' +
          '</div>';
      }).join('');
      listEl.querySelectorAll('.config-list-row').forEach(function(row){
        row.addEventListener('click', function(){
          activeItem = parseInt(row.dataset.i, 10);
          renderList(); renderDetail();
        });
      });
    }

    function renderDetail(){
      var catName = cats[activeCat];
      var group = CATALOG_DATA[catName];
      var item = group.items[activeItem];
      var name = item.name, bottle = item.bottle, carton = item.carton;
      var imgSrc = item.img || placeholderImg(name, group.accent);

      var cartonRow = carton ? (
        '<div class="config-format-row">' +
          '<div><div class="config-format-label">Carton (6 bouteilles)</div><div class="config-format-price">' + fmt(carton) + ' CFA</div></div>' +
          '<div class="stepper" data-fmt="carton"><button type="button" data-act="dec">−</button><span>0</span><button type="button" data-act="inc">+</button></div>' +
        '</div>'
      ) : '';

      detailEl.innerHTML =
        '<img class="config-illustration" src="' + imgSrc + '" alt="' + name + '">' +
        '<div class="config-detail-name">' + name + '</div>' +
        '<div class="config-detail-origin">Importé d\'Europe</div>' +
        '<div class="config-format-row">' +
          '<div><div class="config-format-label">Bouteille</div><div class="config-format-price">' + fmt(bottle) + ' CFA</div></div>' +
          '<div class="stepper" data-fmt="bottle"><button type="button" data-act="dec">−</button><span>0</span><button type="button" data-act="inc">+</button></div>' +
        '</div>' +
        cartonRow +
        '<button type="button" class="config-add-btn" id="addBtn" disabled>Ajouter à ma sélection</button>';

      var qtyBottle = 0, qtyCarton = 0;
      var addBtn = document.getElementById('addBtn');

      detailEl.querySelectorAll('.stepper').forEach(function(stepper){
        var fmtType = stepper.dataset.fmt;
        stepper.querySelectorAll('button').forEach(function(btn){
          btn.addEventListener('click', function(){
            var cur = fmtType === 'bottle' ? qtyBottle : qtyCarton;
            if(btn.dataset.act === 'inc'){ cur++; } else { cur = Math.max(0, cur - 1); }
            if(fmtType === 'bottle'){ qtyBottle = cur; } else { qtyCarton = cur; }
            stepper.querySelector('span').textContent = cur;
            addBtn.disabled = (qtyBottle === 0 && qtyCarton === 0);
          });
        });
      });

      addBtn.addEventListener('click', function(){
        if(qtyBottle > 0){ order.push({ cat: catName, name: name, format: 'Bouteille', unitPrice: bottle, qty: qtyBottle }); }
        if(qtyCarton > 0){ order.push({ cat: catName, name: name, format: 'Carton (6)', unitPrice: carton, qty: qtyCarton }); }
        qtyBottle = 0; qtyCarton = 0;
        renderDetail();
        renderSlip();
      });
    }

    function renderSlip(){
      if(order.length === 0){
        slipBody.innerHTML = '<div class="order-slip-empty">Aucun article ajouté pour l\'instant.</div>';
        totalEl.textContent = '0 CFA';
        orderBtn.disabled = true;
        return;
      }
      var total = 0;
      slipBody.innerHTML = order.map(function(line, i){
        var subtotal = line.unitPrice * line.qty;
        total += subtotal;
        return '<div class="order-slip-line">' +
          '<div><div class="osl-name">' + line.name + '</div>' +
          '<div class="osl-meta">' + line.format + ' × ' + line.qty + '</div></div>' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
          '<span class="osl-price">' + fmt(subtotal) + ' CFA</span>' +
          '<button type="button" class="osl-remove" data-i="' + i + '" aria-label="Retirer">✕</button>' +
          '</div></div>';
      }).join('');
      totalEl.textContent = fmt(total) + ' CFA';
      orderBtn.disabled = false;

      slipBody.querySelectorAll('.osl-remove').forEach(function(btn){
        btn.addEventListener('click', function(){
          order.splice(parseInt(btn.dataset.i, 10), 1);
          renderSlip();
        });
      });
    }

    orderBtn.addEventListener('click', function(){
      if(order.length === 0) return;
      var total = 0;
      var lines = order.map(function(line){
        var subtotal = line.unitPrice * line.qty;
        total += subtotal;
        return '- ' + line.name + ' — ' + line.format + ' x' + line.qty + ' (' + fmt(subtotal) + ' CFA)';
      });
      var msg = 'Bonjour Sun Spirit, je souhaite composer le kit suivant :\n\n' + lines.join('\n') + '\n\nTotal : ' + fmt(total) + ' CFA';
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    });

    renderTabs();
    renderList();
    renderDetail();
    renderSlip();
  };

  // ---------------------------------------------------------
  // EVENTS CAROUSEL (page index.html)
  // ---------------------------------------------------------
  window.initEventsCarousel = function(){
    var track = document.getElementById('ecTrack');
    if(!track) return;
    var dots = Array.prototype.slice.call(document.querySelectorAll('.ec-dot'));
    var prev = document.getElementById('ecPrev');
    var next = document.getElementById('ecNext');
    var panelCount = dots.length;
    var current = 0;
    var userSwiping = false;

    function setActiveDot(i){
      current = i;
      dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
    }
    function goTo(i){
      i = Math.max(0, Math.min(panelCount - 1, i));
      setActiveDot(i);
      track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
    }
    dots.forEach(function(d){ d.addEventListener('click', function(){ goTo(parseInt(d.dataset.i, 10)); }); });
    if(prev) prev.addEventListener('click', function(){ goTo(current - 1); });
    if(next) next.addEventListener('click', function(){ goTo(current + 1); });
    track.addEventListener('pointerdown', function(){ userSwiping = true; });
    track.addEventListener('touchstart', function(){ userSwiping = true; }, { passive:true });
    var scrollTimeout;
    track.addEventListener('scroll', function(){
      if (!userSwiping) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function(){
        setActiveDot(Math.round(track.scrollLeft / track.clientWidth));
        userSwiping = false;
      }, 120);
    });
    window.addEventListener('resize', function(){ goTo(current); });
  };

  // ---------------------------------------------------------
  // BOUTON WHATSAPP FLOTTANT (unique, injecte sur toutes les pages)
  // ---------------------------------------------------------
  function initFloatingWhatsapp(){
    var btn = document.createElement('a');
    btn.className = 'wa-float';
    btn.href = 'https://wa.me/' + WA_NUMBER;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.setAttribute('aria-label', 'Commander sur WhatsApp');
    btn.innerHTML = '<svg viewBox="0 0 32 32" fill="white"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.417.71 4.665 1.933 6.553L4 29l7.646-1.905A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm6.995 16.833c-.293.827-1.454 1.514-2.386 1.71-.634.134-1.462.24-4.25-.913-3.567-1.474-5.86-5.096-6.038-5.334-.177-.238-1.447-1.925-1.447-3.671 0-1.746.914-2.604 1.238-2.96.324-.357.708-.446.944-.446.236 0 .472.002.678.012.218.01.51-.083.797.608.293.706.996 2.437 1.083 2.615.088.178.147.386.03.624-.118.238-.177.386-.354.594-.177.208-.372.464-.531.623-.177.178-.361.372-.155.73.206.357.914 1.508 1.963 2.443 1.348 1.203 2.485 1.575 2.843 1.752.357.178.566.148.774-.09.207-.238.886-1.033 1.123-1.388.236-.357.472-.297.796-.178.324.119 2.055.97 2.407 1.147.354.178.588.267.674.416.088.148.088.858-.204 1.686z"/></svg>';
    document.body.appendChild(btn);
  }

  // ---------------------------------------------------------
  // INIT COMMUN À TOUTES LES PAGES
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function(){
    initMegaMenu();
    initCart();
    initSearch();
    initFloatingWhatsapp();
  });
})();
