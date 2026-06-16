/**
 * Comnyang Cat — Web Shim
 * Replaces Electron IPC with browser APIs (DOM events + localStorage).
 * Load BEFORE renderer.js so window.electronAPI is already defined.
 */
(function () {
  'use strict';

  /* ── Fix relative paths (renderer.js uses ../ from its original location) ── */
  var _origFetch = window.fetch;
  var CAT_BASE = 'cat/';
  window.fetch = function () {
    var args = Array.prototype.slice.call(arguments);
    var url = args[0];
    if (typeof url === 'string' && url.indexOf('../') !== -1) {
      args[0] = url.replace(/\.\.\//g, CAT_BASE);
    }
    return _origFetch.apply(this, args);
  };

  var _origAudio = window.Audio;
  window.Audio = function (src) {
    if (typeof src === 'string' && src.indexOf('../') !== -1) {
      src = src.replace(/\.\.\//g, CAT_BASE);
    }
    var a = new _origAudio(src);
    return a;
  };
  window.Audio.prototype = _origAudio.prototype;

  /* ── Storage ─────────────────────────────────────────── */
  function get(key, def) {
    try { const v = localStorage.getItem('comnyang_' + key); return v !== null ? JSON.parse(v) : def; }
    catch { return def; }
  }
  function set(key, val) {
    try { localStorage.setItem('comnyang_' + key, JSON.stringify(val)); } catch {}
  }

  /* ── Simple event bus ────────────────────────────────── */
  const _cbs = {};
  function _on(channel, cb) {
    if (!_cbs[channel]) _cbs[channel] = [];
    _cbs[channel].push(cb);
  }
  function _emit(channel, data) {
    (_cbs[channel] || []).forEach(function (fn) { fn(data); });
  }

  /* ── Cat dragging state ──────────────────────────────── */
  var dragEl = document.getElementById('cat-wrapper');
  var dragX = 0, dragY = 0;
  var catSize = get('catSize', 100);
  var SIZE_PRESETS = [60, 80, 100, 120, 140, 160, 200, 240];

  function updateCatTransform() {
    if (!dragEl) return;
    if (window.innerWidth > 900) {
      dragEl.style.setProperty('--cat-size', catSize + 'px');
    }
    dragEl.style.transform = 'translate(' + dragX + 'px, ' + dragY + 'px)';
  }

  /* ── Presets list (matches app-extracted/presets/) ──── */
  var PRESETS = [
    { id: 'black-cat',     name: 'Black cat',     file: 'black-cat.json',     img: '../assets/img/presets/black.png' },
    { id: 'white-cat',     name: 'White cat',     file: 'white-cat.json',     img: '../assets/img/presets/white.png' },
    { id: 'cheese-cat',    name: 'Cheese cat',    file: 'cheese-cat.json',    img: '../assets/img/presets/orange.png' },
    { id: 'siamese-cat',   name: 'Siamese cat',   file: 'siamese-cat.json',   img: '../assets/img/presets/siamese.png' },
    { id: 'mackerel-tabby',name: 'Mackerel tabby',file: 'mackerel-tabby.json',img: '../assets/img/presets/mackerel.png' },
    { id: 'calico-cat',    name: 'Calico cat',    file: 'calico-cat.json',   img: '../assets/img/presets/calico.png' },
    { id: 'russian-blue',  name: 'Russian Blue',  file: 'rusian-blue.json',   img: '../assets/img/presets/rusian-blue.png' },
  ];

  var currentPresetId = get('presetId', 'black-cat');

  /* ── Build electronAPI ───────────────────────────────── */
  window.electronAPI = {

    // ── Cursor / keyboard / wheel ──
    onCursorPos: function (cb) {
      document.addEventListener('mousemove', function (e) {
        var cat = document.getElementById('cat');
        if (!cat) return;
        var r = cat.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        cb({ dx: e.clientX - cx, dy: e.clientY - cy });
      });
    },

    onKeyPressed: function (cb) {
      document.addEventListener('keydown', function () { cb(); });
    },

    onMouseWheel: function (cb) {
      document.addEventListener('wheel', function (e) {
        cb({ rotation: Math.sign(e.deltaY) * 120 });
      });
      // Mobile: trigger on touch scroll (wheel events unreliable on mobile)
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            cb({ rotation: 120 });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    },

    // ── Do actions (triggered by renderer's own logic) ──
    onDoStretch: function (cb) { _on('do-stretch', cb); },
    onDoJump: function (cb)    { _on('do-jump', cb); },
    triggerStretch: function () { _emit('do-stretch'); },
    triggerJump: function ()    { _emit('do-jump'); },

    // ── Cat name ──
    catNameGet: function () {
      return Promise.resolve({ name: get('catName', 'Komi-chan'), visible: get('catNameVisible', true) });
    },
    catNameSet: function (name) {
      var n = String(name || '').trim().slice(0, 24) || 'Komi-chan';
      set('catName', n);
      _emit('cat-name-changed', { name: n, visible: get('catNameVisible', true) });
      return Promise.resolve({ name: n, visible: get('catNameVisible', true) });
    },
    catNameVisibleSet: function (vis) {
      set('catNameVisible', !!vis);
      _emit('cat-name-changed', { name: get('catName', 'Komi-chan'), visible: !!vis });
      return Promise.resolve({ name: get('catName', 'Komi-chan'), visible: !!vis });
    },
    onCatNameChanged: function (cb) { _on('cat-name-changed', cb); },
    onCatNameEdit: function (cb)    { _on('cat-name-edit', cb); },
    catNamePromptShown: function () { return Promise.resolve(); },

    // ── User name ──
    userNameGet: function () { return Promise.resolve({ name: get('userName', '') }); },
    userNameSet: function (name) {
      var n = String(name || '').trim().slice(0, 24);
      set('userName', n);
      _emit('user-name-changed', { name: n });
      return Promise.resolve({ name: n });
    },
    onUserNameChanged: function (cb) { _on('user-name-changed', cb); },
    onUserNameEdit: function (cb)    { _on('user-name-edit', cb); },

    // ── Fixed message ──
    fixedMessageGet: function () { return Promise.resolve({ message: get('fixedMessage', '') }); },
    fixedMessageSet: function (msg) {
      var m = String(msg || '').trim().slice(0, 80);
      set('fixedMessage', m);
      _emit('fixed-message-changed', { message: m });
      return Promise.resolve({ message: m });
    },
    onFixedMessageChanged: function (cb) { _on('fixed-message-changed', cb); },
    onFixedMessageEdit: function (cb)    { _on('fixed-message-edit', cb); },

    // ── Language ──
    languageGet: function ()    { return Promise.resolve(get('language', 'en')); },
    languageSet: function (l)  { set('language', l); _emit('language-changed', l); return l; },
    onLanguageChanged: function (cb) { _on('language-changed', cb); },

    // ── Sound ──
    taskCompleteSoundVolumeGet: function () { return Promise.resolve(get('soundVolume', 0.1)); },
    taskCompleteSoundVolumeSet: function (v) {
      set('soundVolume', Math.max(0, Math.min(1, Number(v) || 0)));
      _emit('volume-changed');
      return get('soundVolume');
    },
    onTaskCompleteSoundVolume: function (cb) {
      _on('volume-changed', function () { cb(get('soundVolume', 0.1)); });
      cb(get('soundVolume', 0.1));
    },
    soundMutedGet: function () { return Promise.resolve(get('soundMuted', false)); },
    soundMutedSet: function (m) {
      set('soundMuted', !!m);
      _emit('sound-muted');
      return !!m;
    },
    onSoundMuted: function (cb) { _on('sound-muted', cb); cb(get('soundMuted', false)); },

    // ── Pattern (cat colors) ──
    patternGet: function () { return Promise.resolve(get('pattern', null)); },
    patternSet: function (p) {
      set('pattern', p);
      _emit('pattern-changed', p);
    },
    onPatternChanged: function (cb) { _on('pattern-changed', cb); },

    // ── Mouse events (web: manages pointer-events on wrapper) ──
    setMouseEventsEnabled: function (enabled) {
      var w = document.getElementById('cat-wrapper');
      if (w) w.style.pointerEvents = enabled ? 'auto' : 'none';
    },

    // ── Drag (moves #cat-wrapper) ──
    dragWindow: function (dx, dy) {
      if (!dragEl) return;
      dragX += Number(dx) || 0;
      dragY += Number(dy) || 0;
      updateCatTransform();
    },
    dragWindowEnded: function () {
      var mobile = window.innerWidth <= 900;
      set(mobile ? 'dragX_mobile' : 'dragX', dragX);
      set(mobile ? 'dragY_mobile' : 'dragY', dragY);
      set('catSize', catSize);
    },

    // ── Context menu ──
    showContextMenu: function () { showCustomContextMenu(); },

    // ── Stretch / hunt mode (no-ops on web) ──
    setStretchMode: function () {},
    setHuntingMode: function () {},

    // ── Pomodoro — stubs (no timer needed) ──
    pomodoroGet: function () {
      return Promise.resolve({ visible: false, running: false, mode: 'focus', remainingSec: 1500, focusMin: 25, restSec: 300 });
    },
    pomodoroStart:   function () { return Promise.resolve({ visible: false }); },
    pomodoroPause:   function () { return Promise.resolve({ visible: false }); },
    pomodoroReset:   function () { return Promise.resolve({ visible: false }); },
    pomodoroFocusSet:function () { return Promise.resolve({ visible: false }); },
    pomodoroRestSet: function () { return Promise.resolve({ visible: false }); },
    onPomodoroState:       function () {},
    onPomodoroComplete:    function () {},
    onPomodoroFocusEdit:   function () {},
    onPomodoroRestEdit:    function () {},
    onPomodoroFocusStart:  function () {},

    // ── Reminders — stubs ──
    remindersGet: function () { return Promise.resolve([]); },
    reminderAdd:    function () { return Promise.resolve({ ok: true, reminders: [] }); },
    reminderDelete: function () { return Promise.resolve({ ok: true, reminders: [] }); },
    reminderUpdate: function () { return Promise.resolve({ ok: true, reminders: [] }); },
    onRemindersChanged:     function () {},
    onReminderTriggered:    function () {},
    onReminderPanelOpen:    function () {},
    onReminderSettingsChanged: function () {},

    // ── Screen share — stubs ──
    onShareRecord:        function () {},
    onShareCaptureCancel: function () {},
    shareCaptureOptions:    function () { return Promise.resolve(null); },
    shareCaptureOverlayHide:function () { return Promise.resolve(); },
    shareCaptureStarted:    function () { return Promise.resolve(); },
    shareErrorDialog:       function () { return Promise.resolve(); },
    shareVideoSave:         function () { return Promise.resolve({ ok: false }); },

    // ── Updates — stubs ──
    onUpdateState: function () {},
    updateDownload: function () { return Promise.resolve({ ok: false }); },

    // ── AI — stubs ──
    onAiTaskComplete:     function () {},
    onAiTaskState:        function () {},
    onAiTaskNotification: function (cb) {
      // 2-min idle timer: cat begs for attention when left alone
      var idleTimer = null;
      var callback = cb;
      function resetIdle() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          if (callback) callback();
        }, 30000);
      }
      resetIdle();
      document.addEventListener('keydown', resetIdle);
      document.addEventListener('wheel', resetIdle);
      document.addEventListener('click', resetIdle);
      document.addEventListener('touchstart', resetIdle);
      var dragHandle = document.getElementById('drag-handle');
      if (dragHandle) dragHandle.addEventListener('mousedown', resetIdle);
    },
  };

  /* ── Restore persisted drag position & size ──────────── */
  (function () {
    var mobile = window.innerWidth <= 900;
    dragX = get(mobile ? 'dragX_mobile' : 'dragX', 0);
    dragY = get(mobile ? 'dragY_mobile' : 'dragY', 0);
    catSize = get('catSize', 100);
    updateCatTransform();
  })();

  /* ── Touch drag + tap-to-purr for mobile ─────────────── */
  (function () {
    var handle = document.getElementById('drag-handle');
    var touchId = null;
    var moved = false;
    var startX = 0, startY = 0;
    var DRAG_THRESHOLD = 5;

    if (!handle) return;

    function getTouch(e, id) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === id) return e.changedTouches[i];
      }
      return null;
    }

    window.addEventListener('touchstart', function (e) {
      var touch = e.changedTouches[0];
      var rect = handle.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        touchId = touch.identifier;
        startX = touch.screenX;
        startY = touch.screenY;
        moved = false;
        // Dispatch mousedown so renderer initializes drag physics (Ai)
        handle.dispatchEvent(new MouseEvent('mousedown', {
          button: 0, buttons: 1, cancelable: true,
          clientX: touch.clientX, clientY: touch.clientY,
          screenX: touch.screenX, screenY: touch.screenY
        }));
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (touchId === null) return;
      var touch = getTouch(e, touchId);
      if (!touch) return;

      if (!moved && (Math.abs(touch.screenX - startX) > DRAG_THRESHOLD || Math.abs(touch.screenY - startY) > DRAG_THRESHOLD)) {
        moved = true;
      }

      if (moved) {
        // Dispatch mousemove so renderer tracks drag physics, stretch, G array
        window.dispatchEvent(new MouseEvent('mousemove', {
          button: 0, buttons: 1, cancelable: true,
          clientX: touch.clientX, clientY: touch.clientY,
          screenX: touch.screenX, screenY: touch.screenY
        }));
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', function (e) {
      if (touchId === null) return;
      var touch = getTouch(e, touchId);
      touchId = null;

      // Dispatch mouseup so renderer ends drag, handles throw/bounce
      var cx = touch ? touch.clientX : 0;
      var cy = touch ? touch.clientY : 0;
      var sx = touch ? touch.screenX : 0;
      var sy = touch ? touch.screenY : 0;
      window.dispatchEvent(new MouseEvent('mouseup', {
        button: 0, buttons: 0, cancelable: true,
        clientX: cx, clientY: cy,
        screenX: sx, screenY: sy
      }));

      if (!moved) {
        // Tap — trigger love/purr animation
        document.body.dataset.purring = '1';
        clearTimeout(window.__catPurrTimer);
        window.__catPurrTimer = setTimeout(function () {
          delete document.body.dataset.purring;
        }, 2000);
      }
      moved = false;
    }, { passive: true });

    window.addEventListener('touchcancel', function () {
      touchId = null;
      moved = false;
    }, { passive: true });
  })();

  /* ── Load saved pattern on startup ────────────────────── */
  (function () {
    var saved = get('pattern', null);
    if (saved) {
      // Let renderer's onPatternChanged pick it up — dispatch async
      setTimeout(function () { _emit('pattern-changed', saved); }, 100);
    }
  })();

  /* ── Custom right-click context menu ─────────────────── */
  var menuEl = null;

  function showCustomContextMenu() {
    hideContextMenu();
    menuEl = document.createElement('div');
    menuEl.className = 'comnyang-context-menu';

    var items = [];

    // Cat name
    items.push({ label: 'Name the cat…', action: function () {
      var current = get('catName', 'Komi-chan');
      var name = prompt('Name the cat:', current);
      if (name && name.trim()) {
        window.electronAPI.catNameSet(name.trim());
        _emit('cat-name-edit', name.trim());
      }
      hideContextMenu();
    }});

    items.push({ type: 'separator' });

    // Presets
    items.push({ label: 'Color / Pattern', enabled: false });
    PRESETS.forEach(function (p) {
      items.push({
        label: p.name,
        checked: p.id === currentPresetId,
        action: function () {
          currentPresetId = p.id;
          set('presetId', p.id);
          loadPreset(p);
          hideContextMenu();
        }
      });
    });

    items.push({ type: 'separator' });

    // Sound toggle
    var muted = get('soundMuted', false);
    items.push({
      label: muted ? 'Sound: Off' : 'Sound: On',
      action: function () {
        window.electronAPI.soundMutedSet(!muted);
        hideContextMenu();
      }
    });

    items.push({ type: 'separator' });

    items.push({ type: 'separator' });

    items.push({ label: 'About Comnyang', action: function () {
      alert('Comnyang — A desktop pet cat\nhttps://comnyang.com/');
      hideContextMenu();
    }});

    buildMenu(items);

    // ── Size hover submenu ────────────────────────────────
    (function () {
      // Insert Size button before the last separator
      var separators = menuEl.querySelectorAll('hr');
      var lastSep = separators[separators.length - 1];
      var sizeBtn = document.createElement('button');
      sizeBtn.textContent = 'Size (' + catSize + ' × ' + catSize + ')  ▶';
      sizeBtn.style.cssText = 'display:flex;justify-content:space-between;align-items:center;width:100%;padding:8px 16px;background:none;border:none;color:#eee;font:13px -apple-system,BlinkMacSystemFont,sans-serif;text-align:left;cursor:pointer;';
      sizeBtn.addEventListener('mouseenter', function () { sizeBtn.style.background = '#3a3a5e'; });
      sizeBtn.addEventListener('mouseleave', function () { if (!submenuOpen) sizeBtn.style.background = 'none'; });

      var wrap = document.createElement('div');
      wrap.className = 'cat-has-submenu';
      wrap.style.width = '100%';
      wrap.appendChild(sizeBtn);

      var submenu = document.createElement('div');
      submenu.className = 'comnyang-context-menu cat-submenu';
      submenu.style.cssText = 'display:none;position:absolute;left:100%;top:0;min-width:160px;';

      function buildSubmenu() {
        submenu.innerHTML = '';
        SIZE_PRESETS.forEach(function (s) {
          var b = document.createElement('button');
          b.textContent = s + ' × ' + s + (s === catSize ? ' ✓' : '');
          b.style.cssText = 'display:block;width:100%;padding:8px 16px;background:none;border:none;color:#eee;font:13px sans-serif;text-align:left;cursor:pointer;';
          b.addEventListener('mouseenter', function () { b.style.background = '#3a3a5e'; });
          b.addEventListener('mouseleave', function () { b.style.background = 'none'; });
          b.addEventListener('click', function (e) {
            e.stopPropagation();
            catSize = s;
            set('catSize', s);
            updateCatTransform();
            hideContextMenu();
          });
          submenu.appendChild(b);
        });
        // separator
        submenu.appendChild(document.createElement('hr'));
        // Smaller
        var sm = document.createElement('button');
        sm.textContent = 'Smaller (-20)';
        sm.style.cssText = 'display:block;width:100%;padding:8px 16px;background:none;border:none;color:#eee;font:13px sans-serif;text-align:left;cursor:pointer;';
        sm.addEventListener('mouseenter', function () { sm.style.background = '#3a3a5e'; });
        sm.addEventListener('mouseleave', function () { sm.style.background = 'none'; });
        sm.addEventListener('click', function (e) {
          e.stopPropagation();
          catSize = Math.max(40, catSize - 20);
          set('catSize', catSize);
          updateCatTransform();
          hideContextMenu();
        });
        submenu.appendChild(sm);
        // Larger
        var lg = document.createElement('button');
        lg.textContent = 'Larger (+20)';
        lg.style.cssText = 'display:block;width:100%;padding:8px 16px;background:none;border:none;color:#eee;font:13px sans-serif;text-align:left;cursor:pointer;';
        lg.addEventListener('mouseenter', function () { lg.style.background = '#3a3a5e'; });
        lg.addEventListener('mouseleave', function () { lg.style.background = 'none'; });
        lg.addEventListener('click', function (e) {
          e.stopPropagation();
          catSize = Math.min(400, catSize + 20);
          set('catSize', catSize);
          updateCatTransform();
          hideContextMenu();
        });
        submenu.appendChild(lg);
      }
      buildSubmenu();

      var hideTimeout = null;
      var submenuOpen = false;

      function showSubmenu() {
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        submenu.style.display = 'block';
        submenuOpen = true;
        sizeBtn.style.background = '#3a3a5e';
      }
      function hideSubmenu() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(function () {
          submenu.style.display = 'none';
          submenuOpen = false;
          sizeBtn.style.background = 'none';
        }, 150);
      }

      wrap.addEventListener('mouseenter', showSubmenu);
      wrap.addEventListener('mouseleave', hideSubmenu);
      submenu.addEventListener('mouseenter', showSubmenu);
      submenu.addEventListener('mouseleave', hideSubmenu);

      wrap.appendChild(submenu);
      lastSep.parentNode.insertBefore(wrap, lastSep);
    })();

    positionMenu();
    document.body.appendChild(menuEl);
    setTimeout(function () { document.addEventListener('click', hideContextMenu, { once: true }); }, 0);
  }

  function buildMenu(items) {
    items.forEach(function (item) {
      if (item.type === 'separator') {
        var sep = document.createElement('hr');
        menuEl.appendChild(sep);
        return;
      }
      var btn = document.createElement('button');
      btn.textContent = item.label;
      btn.disabled = item.enabled === false;
      if (item.checked) btn.classList.add('is-checked');
      if (item.action) btn.addEventListener('click', item.action);
      menuEl.appendChild(btn);
    });
  }

  function positionMenu() {
    // Menu will be positioned at cursor via CSS or JS
    var x = 0, y = 0;
    if (window.lastContextMenuEvent) {
      x = window.lastContextMenuEvent.clientX;
      y = window.lastContextMenuEvent.clientY;
    }
    menuEl.style.left = x + 'px';
    menuEl.style.top = y + 'px';
  }

  function hideContextMenu() {
    if (menuEl && menuEl.parentNode) menuEl.parentNode.removeChild(menuEl);
    menuEl = null;
  }

  // Capture right-click for positioning
  document.addEventListener('contextmenu', function (e) {
    window.lastContextMenuEvent = e;
  });

  /* ── Preset loading ──────────────────────────────────── */
  function loadPreset(preset) {
    var path = 'cat/presets/patterns/' + preset.file;
    fetch(path)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        set('pattern', data);
        _emit('pattern-changed', data);
      })
      .catch(function () { console.warn('Failed to load preset:', preset.id); });
  }

  // Load initial preset
  var initial = PRESETS.find(function (p) { return p.id === currentPresetId; }) || PRESETS[0];
  loadPreset(initial);

  // Also expose on window for external calls
  window.__comnyang = {
    setCatName: function (name) { window.electronAPI.catNameSet(name); _emit('cat-name-edit', name); },
    setPreset:  function (id) {
      var p = PRESETS.find(function (x) { return x.id === id; });
      if (p) { currentPresetId = id; set('presetId', id); loadPreset(p); }
    },
    getPresets: function () { return PRESETS.slice(); },
    getCatSize: function () { return catSize; },
    setCatSize: function (s) {
      catSize = Math.max(40, Math.min(400, Math.round(Number(s) || 100)));
      set('catSize', catSize);
      updateCatTransform();
    },
    triggerStretch: function () { _emit('do-stretch'); },
    triggerJump: function () { _emit('do-jump'); },
  };

})();
