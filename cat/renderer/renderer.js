"use strict";
(() => {
  var eo = (e, t) => () => (
    t || e((t = { exports: {} }).exports, t), t.exports
  );
  var $i = eo(() => {
    var to = {
        pupils: {
          ids: ["pupil-left", "pupil-right"],
          maxOffset: 1.6,
          ease: 0.42,
        },
        eyes: { ids: ["eyes-js"], maxOffset: 0.8, ease: 0.3 },
        face: { ids: ["face-js"], maxOffset: 2.2, ease: 0.2 },
        body: { ids: ["body"], maxOffset: 0.7, ease: 0.09 },
      },
      Cn = 400,
      ee = document.getElementById("cat"),
      vt = document.getElementById("share-name-badge"),
      w = document.getElementById("cat-speech-bubble"),
      Pn = document.getElementById("cat-thinking-dots"),
      Fe = document.getElementById("cat-name-editor"),
      Ce = document.getElementById("cat-name-input"),
      In = document.getElementById("cat-name-cancel"),
      Le = document.getElementById("user-name-editor"),
      St = document.getElementById("user-name-guide"),
      ie = document.getElementById("user-name-input"),
      Mn = document.getElementById("user-name-cancel"),
      ke = document.getElementById("fixed-message-editor"),
      Pe = document.getElementById("fixed-message-input"),
      Rn = document.getElementById("fixed-message-cancel"),
      pe = document.getElementById("reminder-clock-button"),
      Ue = document.getElementById("reminder-panel"),
      Bn = document.getElementById("reminder-panel-title"),
      Nn = document.getElementById("reminder-form"),
      V = document.getElementById("reminder-time-input"),
      Q = document.getElementById("reminder-repeat-input"),
      Z = document.getElementById("reminder-repeat-buttons"),
      j = document.getElementById("reminder-day-picker"),
      H = document.getElementById("reminder-message-input"),
      Tn = document.getElementById("reminder-save-button"),
      xt = document.getElementById("reminder-cancel-button"),
      Ct = document.getElementById("reminder-add-button"),
      Pt = document.getElementById("reminder-panel-close"),
      dt = document.getElementById("reminder-list"),
      De = document.getElementById("pomodoro-focus-editor"),
      me = document.getElementById("pomodoro-focus-input"),
      Fn = document.getElementById("pomodoro-focus-cancel"),
      He = document.getElementById("share-duration-editor"),
      fe = document.getElementById("share-duration-input"),
      Ln = document.getElementById("share-duration-cancel"),
      ue = null,
      kn = new WeakSet(),
      It = null,
      Je = 0,
      yt = 0,
      Mt = "Comnyang",
      je = "",
      Dn = !1,
      ae = null,
      Oe = null,
      tt = null,
      ut = null,
      Ke = [],
      nt = null,
      Yt = "",
      ze = null,
      Hn = !0,
      jt = "en",
      T = null,
      $e = "focus",
      D = null,
      he = new Audio("../assets/sound/meow.m4a"),
      ye = new Audio("../assets/sound/meow-alert.m4a"),
      _ = new Audio("../assets/sound/purring.m4a"),
      O = 0.1,
      rt = !1;
    he.volume = O;
    he.preload = "auto";
    ye.volume = O;
    ye.preload = "auto";
    _.loop = !0;
    _.preload = "auto";
    _.volume = O;
    var gt = {
      en: {
        agentComplete: "Task complete!",
        needsAttention: (e) => `${e || "Human"}, needs your attention!`,
        focusLabel: "Focus",
        restLabel: "Break",
        startBreak: (e) => `${e || "Human"}, take a break!`,
        startFocus: (e) => `${e || "Human"}, back to focus!`,
        updateChecking: "Checking...",
        updateAvailable: "Update",
        updateNone: "No updates",
        updateDownloading: (e) =>
          e === null ? "Updating..." : `Updating ${e}%`,
        updateRestarting: "Restarting...",
        userNameGuide:
          "Tell Comnyang your name, and Comnyang will call you for reminders and other moments.",
        userNamePlaceholder: "Enter your name",
        userGreeting: (e) => `Hi, ${e}!`,
        pomodoroPause: "Pause",
        pomodoroResume: "Resume",
        pomodoroReset: "Reset",
        reminderOnce: "Once",
        reminderCustomDays: "Choose days",
        reminderDaily: "Daily",
        reminderWeekdays: "Weekdays",
        reminderWeekends: "Weekends",
        reminderDaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        reminderOpen: "Open reminders",
        reminderTitle: "Reminder",
        reminderPanelLabel: "Reminders",
        reminderRepeatGroupLabel: "Repeat",
        reminderDayPickerLabel: "Choose days",
        reminderMessagePlaceholder: "What should Comnyang remind you?",
        reminderAdd: "Add",
        reminderCancel: "Cancel",
        reminderSave: "Save",
        reminderUpdate: "Update",
        reminderClose: "Close",
        reminderEmpty: "Add a reminder and Comnyang will tell you on time.",
        reminderEdit: "Edit",
        reminderDelete: "Delete",
        sharePermissionFailed:
          "Could not record the screen. Please check macOS screen recording permission.",
        sharePermissionFailedWindows:
          "Could not record the screen. Please check Windows privacy or security settings for screen capture.",
        shareConversionFailed: "Could not convert the share video to MP4.",
        shareRecordingFailed: "Could not make the share video.",
      },
      ko: {
        agentComplete: "\uC791\uC5C5 \uC644\uB8CC\uB0E5!",
        needsAttention: (e) =>
          `${
            e || "\uC9D1\uC0AC\uC57C"
          }, \uD655\uC778\uC774 \uD544\uC694\uD558\uB2E4\uB0E5!`,
        focusLabel: "\uC9D1\uC911\uB0E5",
        restLabel: "\uD734\uC2DD\uB0E5",
        startBreak: (e) => `${e || "\uC9D1\uC0AC\uC57C"}, \uC26C\uC790\uB0E5!`,
        startFocus: (e) =>
          `${
            e || "\uC9D1\uC0AC\uC57C"
          }, \uB2E4\uC2DC \uC9D1\uC911\uD558\uC790\uB0E5!`,
        updateChecking: "\uC5C5\uB370\uC774\uD2B8 \uD655\uC778 \uC911...",
        updateAvailable: "\uC5C5\uB370\uC774\uD2B8\uD558\uAE30",
        updateNone: "\uCD5C\uC2E0 \uBC84\uC804\uC774\uB2E4\uB0E5",
        updateDownloading: (e) =>
          e === null
            ? "\uC5C5\uB370\uC774\uD2B8 \uC911..."
            : `\uC5C5\uB370\uC774\uD2B8 \uC911 ${e}%`,
        updateRestarting: "\uC7AC\uC2DC\uC791 \uC911...",
        userNameGuide:
          "\uC774\uB984\uC744 \uC54C\uB824\uC8FC\uBA74 \uCF64\uB0E5\uC774\uAC00 \uC54C\uB9BC\uC744 \uC8FC\uAC70\uB098 \uB2E4\uC591\uD55C \uC0C1\uD669\uC5D0\uC11C \uC0AC\uC6A9\uC790\uB97C \uBD88\uB7EC\uC904\uAC70\uC608\uC694.",
        userNamePlaceholder:
          "\uC0AC\uC6A9\uC790 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694",
        userGreeting: (e) => `\uC548\uB155, ${e}!`,
        pomodoroPause: "\uC77C\uC2DC\uC815\uC9C0",
        pomodoroResume: "\uB2E4\uC2DC \uC2DC\uC791",
        pomodoroReset: "\uCD08\uAE30\uD654",
        reminderOnce: "\uD55C \uBC88",
        reminderCustomDays: "\uC694\uC77C \uC120\uD0DD",
        reminderDaily: "\uB9E4\uC77C",
        reminderWeekdays: "\uD3C9\uC77C",
        reminderWeekends: "\uC8FC\uB9D0",
        reminderDaysShort: [
          "\uC77C",
          "\uC6D4",
          "\uD654",
          "\uC218",
          "\uBAA9",
          "\uAE08",
          "\uD1A0",
        ],
        reminderOpen: "\uC54C\uB9BC \uC5F4\uAE30",
        reminderTitle: "\uC54C\uB9BC",
        reminderPanelLabel: "\uC54C\uB9BC\uC7A5",
        reminderRepeatGroupLabel: "\uBC18\uBCF5 \uC124\uC815",
        reminderDayPickerLabel: "\uC694\uC77C \uC120\uD0DD",
        reminderMessagePlaceholder:
          "\uBB34\uC5C7\uC744 \uC54C\uB824\uC904\uAE4C\uB0E5?",
        reminderAdd: "\uCD94\uAC00",
        reminderCancel: "\uCDE8\uC18C",
        reminderSave: "\uC800\uC7A5",
        reminderUpdate: "\uC218\uC815",
        reminderClose: "\uB2EB\uAE30",
        reminderEmpty:
          "\uC54C\uB9BC\uC744 \uB4F1\uB85D\uD558\uBA74 \uC2DC\uAC04 \uB9DE\uCDB0 \uC54C\uB824\uC8FC\uACA0\uB2E4\uB0E5.",
        reminderEdit: "\uC218\uC815",
        reminderDelete: "\uC0AD\uC81C",
        sharePermissionFailed:
          "\uD654\uBA74\uC744 \uB179\uD654\uD560 \uC218 \uC5C6\uC5B4\uC694. macOS \uD654\uBA74 \uAE30\uB85D \uAD8C\uD55C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
        sharePermissionFailedWindows:
          "\uD654\uBA74\uC744 \uB179\uD654\uD560 \uC218 \uC5C6\uC5B4\uC694. Windows \uAC1C\uC778\uC815\uBCF4 \uB610\uB294 \uBCF4\uC548 \uC124\uC815\uC5D0\uC11C \uD654\uBA74 \uCEA1\uCC98 \uAD8C\uD55C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
        shareConversionFailed:
          "\uC790\uB791 \uC601\uC0C1\uC744 MP4\uB85C \uBCC0\uD658\uD560 \uC218 \uC5C6\uC5B4\uC694.",
        shareRecordingFailed:
          "\uC790\uB791 \uC601\uC0C1\uC744 \uB9CC\uB4E4 \uC218 \uC5C6\uC5B4\uC694.",
      },
      ja: {
        agentComplete: "\u30BF\u30B9\u30AF\u5B8C\u4E86\u306B\u3083\uFF01",
        needsAttention: (e) =>
          `${
            e ? `${e}\u3055\u3093` : "\u3054\u4E3B\u4EBA"
          }\u3001\u78BA\u8A8D\u304C\u5FC5\u8981\u3060\u306B\u3083\uFF01`,
        focusLabel: "\u96C6\u4E2D\u306B\u3083",
        restLabel: "\u4F11\u61A9\u306B\u3083",
        startBreak: (e) =>
          `${
            e ? `${e}\u3055\u3093` : "\u3054\u4E3B\u4EBA"
          }\u3001\u4F11\u61A9\u3059\u308B\u306B\u3083\uFF01`,
        startFocus: (e) =>
          `${
            e ? `${e}\u3055\u3093` : "\u3054\u4E3B\u4EBA"
          }\u3001\u307E\u305F\u96C6\u4E2D\u3059\u308B\u306B\u3083\uFF01`,
        updateChecking: "\u78BA\u8A8D\u4E2D...",
        updateAvailable: "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8",
        updateNone:
          "\u6700\u65B0\u30D0\u30FC\u30B8\u30E7\u30F3\u3060\u306B\u3083",
        updateDownloading: (e) =>
          e === null
            ? "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u4E2D..."
            : `\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u4E2D ${e}%`,
        updateRestarting: "\u518D\u8D77\u52D5\u4E2D...",
        userNameGuide:
          "\u540D\u524D\u3092\u6559\u3048\u308B\u3068\u3001Comnyang \u304C\u901A\u77E5\u3084\u3044\u308D\u3044\u308D\u306A\u5834\u9762\u3067\u3042\u306A\u305F\u3092\u547C\u3093\u3067\u304F\u308C\u307E\u3059\u3002",
        userNamePlaceholder:
          "\u30E6\u30FC\u30B6\u30FC\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
        userGreeting: (e) =>
          `\u3053\u3093\u306B\u3061\u306F\u3001${e}\u3055\u3093\uFF01`,
        pomodoroPause: "\u4E00\u6642\u505C\u6B62",
        pomodoroResume: "\u518D\u958B",
        pomodoroReset: "\u30EA\u30BB\u30C3\u30C8",
        reminderOnce: "1\u56DE",
        reminderCustomDays: "\u66DC\u65E5\u9078\u629E",
        reminderDaily: "\u6BCE\u65E5",
        reminderWeekdays: "\u5E73\u65E5",
        reminderWeekends: "\u9031\u672B",
        reminderDaysShort: [
          "\u65E5",
          "\u6708",
          "\u706B",
          "\u6C34",
          "\u6728",
          "\u91D1",
          "\u571F",
        ],
        reminderOpen: "\u901A\u77E5\u3092\u958B\u304F",
        reminderTitle: "\u901A\u77E5",
        reminderPanelLabel: "\u901A\u77E5",
        reminderRepeatGroupLabel: "\u7E70\u308A\u8FD4\u3057",
        reminderDayPickerLabel: "\u66DC\u65E5\u9078\u629E",
        reminderMessagePlaceholder:
          "\u4F55\u3092\u77E5\u3089\u305B\u308B\u306B\u3083\uFF1F",
        reminderAdd: "\u8FFD\u52A0",
        reminderCancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
        reminderSave: "\u4FDD\u5B58",
        reminderUpdate: "\u66F4\u65B0",
        reminderClose: "\u9589\u3058\u308B",
        reminderEmpty:
          "\u901A\u77E5\u3092\u767B\u9332\u3057\u305F\u3089\u6642\u9593\u306B\u5408\u308F\u305B\u3066\u77E5\u3089\u305B\u308B\u306B\u3083\u3002",
        reminderEdit: "\u7DE8\u96C6",
        reminderDelete: "\u524A\u9664",
        sharePermissionFailed:
          "\u753B\u9762\u3092\u9332\u753B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002macOS \u306E\u753B\u9762\u53CE\u9332\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        sharePermissionFailedWindows:
          "\u753B\u9762\u3092\u9332\u753B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002Windows \u306E\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u307E\u305F\u306F\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u8A2D\u5B9A\u3067\u753B\u9762\u30AD\u30E3\u30D7\u30C1\u30E3\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        shareConversionFailed:
          "\u81EA\u6162\u52D5\u753B\u3092 MP4 \u306B\u5909\u63DB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
        shareRecordingFailed:
          "\u81EA\u6162\u52D5\u753B\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
      },
    };
    function zn(e) {
      let t = String(e || "")
        .toLowerCase()
        .split("-")[0];
      return gt[t] ? t : "en";
    }
    function p(e, ...t) {
      let r = (gt[jt] || gt.en)[e] || gt.en[e] || e;
      return typeof r == "function" ? r(...t) : r;
    }
    var W = new Set(),
      Zn = new WeakMap(),
      Qn = "#1A1A1A",
      er = "#FFFFFF",
      tr = "#dc2828",
      Kt = "0",
      zt = "0",
      Zt = null,
      Qt = null,
      en = null,
      tn = null;
    function Wt(e, t = null) {
      if (e) {
        if (
          (t &&
            (Zn.set(e, t),
            e.documentElement &&
              e.documentElement.setAttribute("data-comnyang-svg-name", t)),
          W.has(e))
        ) {
          nr(e) && (nn(e), Rt(e, ge), qt(e));
          return;
        }
        if ((W.add(e), go(e), nn(e), Rt(e, ge), ir(e), e.documentElement)) {
          let n = e.documentElement;
          n.style.setProperty("--cat-color", Qn),
            n.style.setProperty("--cat-outline", er),
            n.style.setProperty("--heat-overlay-color", tr),
            n.style.setProperty("--legacy-heat-overlay-opacity", Kt),
            n.style.setProperty("--full-heat-overlay-opacity", zt),
            Zt && n.style.setProperty("--eye-color", Zt),
            Qt && n.style.setProperty("--eye-bg-color", Qt),
            en && n.style.setProperty("--eye-color-left", en),
            tn && n.style.setProperty("--eye-color-right", tn);
        }
      }
    }
    function nr(e) {
      if (!e) return !1;
      for (let t of ["ear-left", "ear-right"]) {
        let n = e.getElementById(t);
        if (n && (!n.querySelector("path") || !n.querySelector(".patches")))
          return !0;
      }
      return !1;
    }
    function M(e) {
      let t = document.getElementById(e),
        n = t && t.contentDocument;
      return n
        ? (W.has(n) ? nr(n) && (nn(n), Rt(n, ge), qt(n)) : Wt(n, e), n)
        : null;
    }
    function rr(e) {
      Qn = e;
      for (let t of W)
        t &&
          t.documentElement &&
          t.documentElement.style.setProperty("--cat-color", e);
    }
    function no(e) {
      er = e;
      for (let t of W)
        t &&
          t.documentElement &&
          t.documentElement.style.setProperty("--cat-outline", e);
    }
    function ro(e, t, n = t) {
      (tr = e), (Kt = String(t)), (zt = String(n));
      for (let r of W)
        r &&
          r.documentElement &&
          (r.documentElement.style.setProperty("--heat-overlay-color", e),
          r.documentElement.style.setProperty(
            "--legacy-heat-overlay-opacity",
            Kt
          ),
          r.documentElement.style.setProperty(
            "--full-heat-overlay-opacity",
            zt
          ));
    }
    function oo(e) {
      Zt = e;
      for (let t of W)
        t &&
          t.documentElement &&
          t.documentElement.style.setProperty("--eye-color", e);
    }
    function io(e) {
      Qt = e;
      for (let t of W)
        t &&
          t.documentElement &&
          t.documentElement.style.setProperty("--eye-bg-color", e);
    }
    function On(e) {
      en = e;
      for (let t of W)
        t &&
          t.documentElement &&
          (e
            ? t.documentElement.style.setProperty("--eye-color-left", e)
            : t.documentElement.style.removeProperty("--eye-color-left"));
    }
    function $n(e) {
      tn = e;
      for (let t of W)
        t &&
          t.documentElement &&
          (e
            ? t.documentElement.style.setProperty("--eye-color-right", e)
            : t.documentElement.style.removeProperty("--eye-color-right"));
    }
    var A = "http://www.w3.org/2000/svg",
      ge = { head: [] };
    window.electronAPI.onPatternChanged((e) => {
      let t = e || {},
        n = Fi(t.baseColor);
      if (n) {
        (jr = n), rr(`rgb(${n[0]}, ${n[1]}, ${n[2]})`);
        let r = (0.299 * n[0] + 0.587 * n[1] + 0.114 * n[2]) / 255;
        no(r > 0.5 ? "#000000" : "#FFFFFF");
      }
      typeof t.eyeBgColor == "string" && io(t.eyeBgColor),
        t.oddEye
          ? (typeof t.eyeColorLeft == "string" && On(t.eyeColorLeft),
            typeof t.eyeColorRight == "string" && $n(t.eyeColorRight))
          : (On(null),
            $n(null),
            typeof t.eyeColor == "string" && oo(t.eyeColor)),
        co(t);
    });
    var ao = {
      legFl: ["leg-fl"],
      legFr: ["leg-fr"],
      legRl: ["leg-rl"],
      legRr: ["leg-rr"],
      earL: ["ear-left"],
      earR: ["ear-right"],
    };
    function Rt(e, t) {
      if (!(!e || !t))
        for (let [n, r] of Object.entries(t)) {
          if (!Array.isArray(r)) continue;
          let i = ao[n] || [n];
          for (let o of i) so(e, o, r);
        }
    }
    function so(e, t, n) {
      if (t === "body" && e.getElementById("seg-wrap-0")) {
        or(e, n);
        return;
      }
      let r = e.getElementById(t);
      if (!r) return;
      let i = r.getAttribute("data-patch-frame");
      if (!i) return;
      let [o, s, a, u] = i.split(/\s+/).map(Number),
        g = parseFloat(r.getAttribute("data-patch-mirror-x") || "0"),
        d = r.querySelector(".patches");
      if (d) {
        for (; d.firstChild; ) d.removeChild(d.firstChild);
        for (let m of n) {
          let c = g > 0 ? g - 1 - m.x : m.x,
            h = lo(e, t, c, m.y);
          if (h)
            for (let f of h) {
              let y = e.createElementNS(A, "rect");
              y.setAttribute("x", f.x),
                y.setAttribute("y", f.y),
                y.setAttribute("width", 1),
                y.setAttribute("height", 1),
                y.setAttribute("fill", m.color),
                d.appendChild(y);
            }
          else {
            let f = e.createElementNS(A, "rect");
            f.setAttribute("x", o + c * a),
              f.setAttribute("y", s + m.y * u),
              f.setAttribute("width", a),
              f.setAttribute("height", u),
              f.setAttribute("fill", m.color),
              d.appendChild(f);
          }
        }
      }
    }
    function lo(e, t, n, r) {
      let i = window.cellMappings;
      if (!i || typeof i.getPixelsForCell != "function") return null;
      let o =
        Zn.get(e) ||
        (e.documentElement &&
          e.documentElement.getAttribute("data-comnyang-svg-name"));
      if (!o) return null;
      let s = i.getPixelsForCell(o, t, n, r);
      return Array.isArray(s) &&
        s.length === 0 &&
        (o === "jump-ing" || o === "jump-start") &&
        (t === "leg-fl" || t === "leg-fr")
        ? null
        : Array.isArray(s)
        ? s
        : null;
    }
    function or(e, t) {
      if (!se) return;
      let n = e.getElementById("body");
      if (!n) return;
      let { bodyYmin: r, segHeight: i, lerpData: o, bodyRowRects: s } = se;
      if (!s || s.length === 0) return;
      for (let c = 0; c < B; c++) {
        let h = e.getElementById(`seg-wrap-${c}`);
        if (h)
          for (let f of Array.from(h.children))
            f.classList &&
              f.classList.contains("body-patch") &&
              h.removeChild(f);
      }
      for (let c = o.length - 1; c >= 0; c--)
        o[c].rect &&
          o[c].rect.classList &&
          o[c].rect.classList.contains("body-patch") &&
          o.splice(c, 1);
      let a = n.querySelector(".patches");
      if (a) for (; a.firstChild; ) a.removeChild(a.firstChild);
      function u({
        color: c,
        endX: h,
        endY: f,
        endW: y,
        endH: E,
        startX: F,
        startY: v,
        startW: N,
        startH: L,
      }) {
        let Ee = f + E / 2,
          ve = Math.min(B - 1, Math.max(0, Math.floor((Ee - r) / i))),
          Se = r + ve * i,
          U = v - Se,
          I = f - Se,
          k = e.createElementNS(A, "rect");
        k.setAttribute("class", "body-patch"),
          k.setAttribute("x", h),
          k.setAttribute("y", I),
          k.setAttribute("width", y),
          k.setAttribute("height", E),
          k.setAttribute("fill", c);
        let xe = e.getElementById(`seg-wrap-${ve}`);
        xe && xe.appendChild(k),
          o.push({
            rect: k,
            useTransform: !1,
            startX: F,
            endX: h,
            startYLocal: U,
            endYLocal: I,
            startW: N,
            endW: y,
            startH: L,
            endH: E,
          });
      }
      let g = 22,
        d =
          window.cellMappings &&
          window.cellMappings.MAPPINGS &&
          window.cellMappings.MAPPINGS["stretch-chain:body"];
      function m(c, h, f) {
        if (h < 0 || h >= s.length) return;
        let y = s[h];
        if (c < 0 || c >= g) return;
        let E = Math.max(0, y.startW - 1),
          F = Math.max(0, y.endW - 1),
          v = g - 1,
          N = Math.round((c * E) / v),
          L = Math.round((c * F) / v),
          Ee = y.startX + N,
          ve = y.endX + L,
          Se = 1,
          U = 1,
          I = y.startH,
          k = y.endH,
          xe = y.endY;
        u({
          color: f,
          endX: ve,
          endY: xe,
          endW: U,
          endH: k,
          startX: Ee,
          startY: y.startY,
          startW: Se,
          startH: I,
        });
      }
      for (let c of t) {
        let h =
          d &&
          d.cells &&
          Array.isArray(d.cells[`${c.x},${c.y}`]) &&
          d.cells[`${c.x},${c.y}`].length > 0
            ? d.cells[`${c.x},${c.y}`]
            : [[c.x, c.y]];
        for (let [f, y] of h) m(f, y, c.color);
      }
    }
    function co(e) {
      ge = e;
      for (let t of W) Rt(t, e), qt(t);
    }
    function uo(e) {
      let t = e && e.documentElement;
      if (!t) return null;
      let n = t.getAttribute("viewBox");
      if (n) {
        let [o, s, a, u] = n
          .trim()
          .split(/[\s,]+/)
          .map(Number);
        if ([o, s, a, u].every((g) => Number.isFinite(g)))
          return { x: o, y: s, width: a, height: u };
      }
      let r = parseFloat(t.getAttribute("width") || "0"),
        i = parseFloat(t.getAttribute("height") || "0");
      return Number.isFinite(r) && Number.isFinite(i) && r > 0 && i > 0
        ? { x: 0, y: 0, width: r, height: i }
        : null;
    }
    function mo(e) {
      if (e)
        for (let t of Array.from(e.querySelectorAll(".heat-overlay")))
          t.remove();
    }
    function qt(e) {
      mo(e), ir(e);
    }
    function ir(e) {
      let t = uo(e);
      if (!t) return;
      let n = e.getElementById("cat-content") || e.documentElement,
        r = "cat-heat-mask",
        i = e.querySelector("defs");
      i ||
        ((i = e.createElementNS(A, "defs")),
        e.documentElement.insertBefore(i, e.documentElement.firstChild));
      let o = e.getElementById(r);
      for (
        o ||
        ((o = e.createElementNS(A, "mask")),
        o.setAttribute("id", r),
        i.appendChild(o));
        o.firstChild;

      )
        o.removeChild(o.firstChild);
      o.setAttribute("maskUnits", "userSpaceOnUse"),
        o.setAttribute("x", t.x),
        o.setAttribute("y", t.y),
        o.setAttribute("width", t.width),
        o.setAttribute("height", t.height),
        o.style.setProperty("mask-type", "alpha");
      let s = [
          "[data-patch-frame]",
          "[data-heat-overlay]",
          "[id^='seg-wrap-']",
        ].join(","),
        a = Array.from(n.querySelectorAll(s)).filter(
          (m) =>
            !(
              m.closest("defs") ||
              m.closest(".heat-overlay") ||
              (m.closest("[id^='seg-wrap-']") &&
                !m.id.startsWith("seg-wrap-")) ||
              (m.id.startsWith("seg-wrap-") && m.id !== "seg-wrap-0") ||
              (m.id === "body" && e.getElementById("seg-wrap-0")) ||
              !m.id
            )
        );
      for (let m of a) {
        let c = e.createElementNS(A, "use");
        c.setAttribute("href", `#${m.id}`),
          c.setAttribute("fill", "white"),
          c.setAttribute("stroke", "white"),
          o.appendChild(c);
      }
      let u = e.createElementNS(A, "rect");
      u.setAttribute("class", "heat-overlay cat-heat-overlay"),
        u.setAttribute("pointer-events", "none"),
        u.setAttribute("x", t.x),
        u.setAttribute("y", t.y),
        u.setAttribute("width", t.width),
        u.setAttribute("height", t.height),
        u.setAttribute("mask", `url(#${r})`),
        u.style.setProperty("fill", "var(--heat-overlay-color, #dc2828)"),
        u.style.setProperty("opacity", "var(--full-heat-overlay-opacity, 0)"),
        n.appendChild(u);
      let g = Array.from(e.querySelectorAll(".patches")),
        d = new Set(["animate", "animateTransform", "animateMotion", "set"]);
      for (let m of g) {
        let c = m.parentNode;
        if (!c || !c.closest || !c.closest("[data-patch-frame]")) continue;
        let h = m.getAttribute("clip-path");
        if (!h) continue;
        if (!c.hasAttribute("data-patch-frame")) {
          let y = e.createElementNS(A, "g");
          y.setAttribute(
            "class",
            "heat-overlay legacy-heat-overlay shape-heat-overlay"
          ),
            y.setAttribute("pointer-events", "none");
          for (let E of Array.from(c.children)) {
            if (E === m) break;
            if (
              (E.classList && E.classList.contains("heat-overlay")) ||
              d.has(E.tagName)
            )
              continue;
            let F = E.cloneNode(!0);
            for (let v of Array.from(
              F.querySelectorAll(
                "animate, animateTransform, animateMotion, set"
              )
            ))
              v.remove();
            for (let v of [F, ...Array.from(F.querySelectorAll("*"))])
              v.hasAttribute("fill") &&
                v.setAttribute("fill", "var(--heat-overlay-color, #dc2828)"),
                v.hasAttribute("stroke") &&
                  v.setAttribute(
                    "stroke",
                    "var(--heat-overlay-color, #dc2828)"
                  );
            y.appendChild(F);
          }
          y.childNodes.length > 0 &&
            (y.style.setProperty(
              "opacity",
              "var(--legacy-heat-overlay-opacity, 0)"
            ),
            c.appendChild(y));
          continue;
        }
        let f = e.createElementNS(A, "rect");
        f.setAttribute(
          "class",
          "heat-overlay legacy-heat-overlay patch-heat-overlay"
        ),
          f.setAttribute("pointer-events", "none"),
          f.setAttribute("x", t.x),
          f.setAttribute("y", t.y),
          f.setAttribute("width", t.width),
          f.setAttribute("height", t.height),
          f.setAttribute("clip-path", h),
          f.style.setProperty("fill", "var(--heat-overlay-color, #dc2828)"),
          f.style.setProperty(
            "opacity",
            "var(--legacy-heat-overlay-opacity, 0)"
          ),
          c.appendChild(f);
      }
      for (let m of Array.from(e.querySelectorAll("[data-heat-overlay]"))) {
        let c = m.parentNode;
        if (!c) continue;
        let h = e.createElementNS(A, "g");
        h.setAttribute("class", "heat-overlay legacy-heat-overlay"),
          h.setAttribute("pointer-events", "none");
        for (let f of Array.from(m.children)) {
          let y = f.cloneNode(!0);
          for (let E of [y, ...Array.from(y.querySelectorAll("[fill]"))])
            E.hasAttribute("fill") &&
              E.setAttribute("fill", "var(--heat-overlay-color, #dc2828)");
          h.appendChild(y);
        }
        h.style.setProperty("opacity", "var(--legacy-heat-overlay-opacity, 0)"),
          c.insertBefore(h, m.nextSibling);
      }
    }
    var fo = "M0 7V4H1V2H2V1H3V0H4V2H5V3H6V7H5V8H1V7H0Z",
      po = "M1 3H0V7H1V8H4V7H5V2H4V1H3V0H2V1H1V3Z";
    function nn(e) {
      let t = [
          ["ear-left", fo, "ear-left-clip"],
          ["ear-right", po, "ear-right-clip"],
        ],
        n = e.querySelector("defs");
      !n &&
        e.documentElement &&
        ((n = e.createElementNS(A, "defs")),
        e.documentElement.insertBefore(n, e.documentElement.firstChild));
      for (let [r, i, o] of t) {
        let s = e.getElementById(r);
        if (!s) continue;
        let a = s.getAttribute("data-ear-position");
        if (!a) continue;
        let [u, g] = a.split(/\s+/).map(Number);
        for (; s.firstChild; ) s.removeChild(s.firstChild);
        let d = e.createElementNS(A, "path");
        if (
          (d.setAttribute("transform", `translate(${u} ${g})`),
          d.setAttribute("d", i),
          d.setAttribute("fill", "var(--cat-color)"),
          s.appendChild(d),
          n)
        ) {
          let c = e.getElementById(o);
          for (
            c ||
            ((c = e.createElementNS(A, "clipPath")),
            c.setAttribute("id", o),
            n.appendChild(c));
            c.firstChild;

          )
            c.removeChild(c.firstChild);
          let h = e.createElementNS(A, "path");
          h.setAttribute("transform", `translate(${u} ${g})`),
            h.setAttribute("d", i),
            c.appendChild(h);
        }
        let m = e.createElementNS(A, "g");
        m.setAttribute("class", "patches"),
          m.setAttribute("clip-path", `url(#${o})`),
          s.appendChild(m),
          s.setAttribute("data-patch-frame", `${u} ${g} 1 1`);
      }
      ho(e);
    }
    function ho(e) {
      let t = e.getElementById("head");
      if (!(!t || !t.parentNode))
        for (let n of ["ear-left", "ear-right"]) {
          let r = e.getElementById(n),
            i = yo(t.parentNode, r);
          !i || i === t || t.parentNode.insertBefore(i, t);
        }
    }
    function yo(e, t) {
      if (!e || !t) return null;
      let n = t;
      for (; n && n.parentNode && n.parentNode !== e; ) n = n.parentNode;
      return n && n.parentNode === e ? n : null;
    }
    var _n =
      "M0 8V7H6V6H8V5H9V4H8V1H9V0H11V1H12V2H13V7H12V8H11V9H9V10H4V9H1V8H0Z";
    function go(e) {
      let t = e.getElementById("tail");
      if (!t) return;
      let n = t.getAttribute("data-patch-frame");
      if (!n) return;
      let [r, i, o, s] = n.split(/\s+/).map(Number);
      for (; t.firstChild; ) t.removeChild(t.firstChild);
      let a =
          o === 1 && s === 1
            ? `translate(${r} ${i})`
            : `translate(${r} ${i}) scale(${o} ${s})`,
        u = e.createElementNS(A, "path");
      u.setAttribute("transform", a),
        u.setAttribute("d", _n),
        u.setAttribute("fill", "var(--cat-color)"),
        t.hasAttribute("data-tail-path-id") &&
          u.setAttribute("id", "tail-path"),
        t.appendChild(u);
      let g = e.querySelector("defs");
      g ||
        ((g = e.createElementNS(A, "defs")),
        e.documentElement.insertBefore(g, e.documentElement.firstChild));
      let d = e.getElementById("tail-clip");
      for (
        d ||
        ((d = e.createElementNS(A, "clipPath")),
        d.setAttribute("id", "tail-clip"),
        g.appendChild(d));
        d.firstChild;

      )
        d.removeChild(d.firstChild);
      let m = e.createElementNS(A, "path");
      m.setAttribute("transform", a), m.setAttribute("d", _n), d.appendChild(m);
      let c = e.createElementNS(A, "g");
      c.setAttribute("class", "patches"),
        c.setAttribute("clip-path", "url(#tail-clip)"),
        t.appendChild(c);
    }
    ee.addEventListener("load", ar);
    requestAnimationFrame(() => {
      ee && ee.contentDocument && ar();
    });
    function ar() {
      if (((ue = ee.contentDocument), !!ue)) {
        if (kn.has(ue)) {
          M("cat");
          return;
        }
        kn.add(ue), Wt(ue, "cat-idle-follow-v2"), (It = {});
        for (let [e, t] of Object.entries(to)) {
          let n = [];
          for (let r of t.ids) {
            let i = ue.getElementById(r);
            i && n.push(bo(i));
          }
          It[e] = {
            wrappers: n,
            maxOffset: t.maxOffset,
            ease: t.ease,
            stretchAxis: t.stretchAxis,
            x: 0,
            y: 0,
          };
        }
        requestAnimationFrame(sr);
      }
    }
    function bo(e) {
      let n = ue.createElementNS("http://www.w3.org/2000/svg", "g");
      return (
        n.setAttribute("data-tracking-wrapper", "1"),
        e.parentNode.insertBefore(n, e),
        n.appendChild(e),
        n
      );
    }
    function te() {
      return !!document.body.dataset.stretching;
    }
    function Ao(e, t) {
      let n = performance.now();
      if (!$) {
        $ = { dx: e, dy: t, vx: 0, vy: 0, t: n };
        return;
      }
      let r = Math.max(1, n - $.t),
        i = ((e - $.dx) / r) * 16,
        o = ((t - $.dy) / r) * 16,
        s = Math.hypot(i, o),
        a = Math.hypot($.vx, $.vy),
        u = i * $.vx + o * $.vy,
        g = a > 0 && s > 0 && u / (s * a) < -0.28,
        d = Math.max(0, s - a);
      (ne *= zo),
        Pr() &&
          s > Xe &&
          ((ne += Math.min(0.22, (s - Xe) / 42)),
          g && s > Xe * 1.28 && (ne += Math.min(0.42, (s - Xe) / 34 + 0.12)),
          d > 14 && (ne += Math.min(0.18, d / 52)),
          s > Xe * 3.2 && d > 18 && (ne += 0.28)),
        ne >= Xn && ((ne = Xn * 0.35), ti()),
        ($ = { dx: e, dy: t, vx: i, vy: o, t: n });
    }
    window.electronAPI.onCursorPos(({ dx: e, dy: t }) => {
      if (te()) {
        (Je = 0), (yt = 0), ($ = null), (ne = 0);
        return;
      }
      Ao(e, t);
      let n = Math.hypot(e, t);
      if (n === 0) {
        (Je = 0), (yt = 0);
        return;
      }
      let r = Math.min(n, Cn) / Cn;
      (Je = (e / n) * r), (yt = (t / n) * r);
    });
    function sr() {
      if (It) {
        for (let e of Object.values(It)) {
          let t = Je * e.maxOffset,
            n = yt * e.maxOffset;
          (e.x += (t - e.x) * e.ease),
            (e.y += (n - e.y) * e.ease),
            Math.abs(e.x) < 0.005 &&
              Math.abs(e.y) < 0.005 &&
              t === 0 &&
              n === 0 &&
              ((e.x = 0), (e.y = 0));
          let r = Math.round(e.x * 8) / 8,
            i = Math.round(e.y * 8) / 8;
          for (let o of e.wrappers)
            if (e.stretchAxis === "x") {
              let s = 1 + Math.abs(Je) * 0.08;
              o.setAttribute(
                "transform",
                `translate(${r} 0) scale(${s.toFixed(3)} 1)`
              );
            } else o.setAttribute("transform", `translate(${r} ${i})`);
        }
        requestAnimationFrame(sr);
      }
    }
    function fn(e) {
      e &&
        ((Mt = (e.name || "Comnyang").trim() || "Comnyang"),
        (Dn = !!e.visible),
        vt && (vt.textContent = Mt),
        document.body.toggleAttribute("data-show-name", Dn));
    }
    function pn(e) {
      je = String((e && e.name) || "")
        .trim()
        .slice(0, 24);
    }
    function wo(e) {
      !Fe ||
        !Ce ||
        (window.electronAPI.catNamePromptShown &&
          window.electronAPI.catNamePromptShown().catch(() => {}),
        (Ce.value = (e || Mt || "Comnyang").trim()),
        (document.body.dataset.editingName = "1"),
        requestAnimationFrame(() => {
          Ce.focus(), Ce.select();
        }));
    }
    function lr() {
      delete document.body.dataset.editingName;
    }
    function Eo(e) {
      !Le ||
        !ie ||
        ((ie.value = String(e || "").trim()),
        St && (St.textContent = p("userNameGuide")),
        (document.body.dataset.editingUserName = "1"),
        requestAnimationFrame(() => {
          ie.focus(), ie.select();
        }));
    }
    function cr() {
      delete document.body.dataset.editingUserName;
    }
    function vo(e) {
      !ke ||
        !Pe ||
        ((Pe.value = String(e || Yt || "").trim()),
        (document.body.dataset.editingFixedMessage = "1"),
        requestAnimationFrame(() => {
          Pe.focus(), Pe.select();
        }));
    }
    function dr() {
      delete document.body.dataset.editingFixedMessage;
    }
    function rn() {
      if (T && T.visible) {
        jn(_o(T.remainingSec), "timer");
        return;
      }
      jn(Yt, "fixed");
    }
    function hn(e) {
      (Yt = String((e && e.message) || "")
        .trim()
        .slice(0, 80)),
        rn();
    }
    function ur(e, t = "focus") {
      if (!De || !me) return;
      $e = t === "rest" ? "rest" : "focus";
      let n = $e === "rest" ? 60 : 180,
        r = $e === "rest" ? 5 : 25,
        i = Math.max(1, Math.min(n, Math.round(Number(e) || r)));
      (me.max = String(n)),
        (me.value = String(i)),
        (document.body.dataset.editingPomodoroFocus = "1"),
        requestAnimationFrame(() => {
          me.focus(), me.select();
        });
    }
    function mr() {
      delete document.body.dataset.editingPomodoroFocus;
    }
    function So() {
      !He ||
        !fe ||
        bt ||
        ((fe.value = fe.value || "5"),
        (document.body.dataset.editingShareDuration = "1"),
        requestAnimationFrame(() => {
          fe.focus(), fe.select();
        }));
    }
    function fr() {
      delete document.body.dataset.editingShareDuration;
    }
    function xo(e) {
      return p(
        e === "daily"
          ? "reminderDaily"
          : e === "weekdays"
          ? "reminderWeekdays"
          : e === "weekends"
          ? "reminderWeekends"
          : e === "custom"
          ? "reminderCustomDays"
          : "reminderOnce"
      );
    }
    function Co(e) {
      let t = p("reminderDaysShort"),
        n = Array.isArray(e) ? e : [],
        r = jt === "en" ? " " : "";
      return n
        .map((i) => t[Number(i)])
        .filter(Boolean)
        .join(r);
    }
    function Po() {
      return j
        ? Array.from(j.querySelectorAll("input[type='checkbox']:checked"))
            .map((e) => Number(e.value))
            .filter((e) => Number.isInteger(e) && e >= 0 && e <= 6)
        : [];
    }
    function Io() {
      !j || !Q || (j.hidden = Q.value !== "custom");
    }
    function Bt(e) {
      if (Q) {
        if (((Q.value = e === "custom" ? "custom" : "none"), Z))
          for (let t of Z.querySelectorAll("button[data-repeat]"))
            t.classList.toggle("is-selected", t.dataset.repeat === Q.value);
        Io();
      }
    }
    function yn() {
      Tn && (Tn.textContent = p(nt ? "reminderUpdate" : "reminderSave"));
    }
    function gn() {
      if (
        (pe && pe.setAttribute("aria-label", p("reminderOpen")),
        St && (St.textContent = p("userNameGuide")),
        ie && (ie.placeholder = p("userNamePlaceholder")),
        Bn && (Bn.textContent = p("reminderTitle")),
        Ue && Ue.setAttribute("aria-label", p("reminderPanelLabel")),
        H && (H.placeholder = p("reminderMessagePlaceholder")),
        Ct && (Ct.textContent = p("reminderAdd")),
        xt && (xt.textContent = p("reminderCancel")),
        Pt && (Pt.textContent = p("reminderClose")),
        Z && Z.setAttribute("aria-label", p("reminderRepeatGroupLabel")),
        Z)
      ) {
        let e = Z.querySelector('button[data-repeat="none"]'),
          t = Z.querySelector('button[data-repeat="custom"]');
        e && (e.textContent = p("reminderOnce")),
          t && (t.textContent = p("reminderCustomDays"));
      }
      if (j) {
        j.setAttribute("aria-label", p("reminderDayPickerLabel"));
        let e = p("reminderDaysShort");
        for (let t of j.querySelectorAll("label")) {
          let n = t.querySelector("input"),
            r = n ? Number(n.value) : -1,
            i = e[r] || "";
          for (let o of Array.from(t.childNodes))
            o.nodeType === 3 && o.remove();
          t.appendChild(document.createTextNode(i));
        }
      }
      yn(), at(Ke);
    }
    function pr() {
      document.body.dataset.reminderPanel = "1";
    }
    function Mo(e) {
      let t = !!(e && e.showButtonOutside);
      document.body.toggleAttribute("data-reminder-button", t);
    }
    function Ro() {
      if (((document.body.dataset.reminderForm = "1"), V && !V.value)) {
        let e = new Date();
        e.setMinutes(e.getMinutes() + 10),
          (V.value = `${String(e.getHours()).padStart(2, "0")}:${String(
            e.getMinutes()
          ).padStart(2, "0")}`);
      }
      requestAnimationFrame(() => {
        H && H.focus();
      });
    }
    function bn() {
      delete document.body.dataset.reminderPanel, hr();
    }
    function hr() {
      delete document.body.dataset.reminderForm;
    }
    function yr() {
      if (j)
        for (let e of j.querySelectorAll("input[type='checkbox']"))
          e.checked = !1;
    }
    function Bo(e) {
      if ((yr(), !j || !Array.isArray(e))) return;
      let t = new Set(e.map((n) => Number(n)));
      for (let n of j.querySelectorAll("input[type='checkbox']"))
        n.checked = t.has(Number(n.value));
    }
    function it() {
      (nt = null),
        yn(),
        V && (V.value = ""),
        H && (H.value = ""),
        Bt("none"),
        yr(),
        hr();
    }
    function No(e) {
      !e ||
        !e.id ||
        ((nt = e.id),
        (document.body.dataset.reminderPanel = "1"),
        (document.body.dataset.reminderForm = "1"),
        V && (V.value = e.time || ""),
        H && (H.value = e.message || ""),
        yn(),
        Bt(e.repeat === "custom" ? "custom" : "none"),
        Bo(e.days),
        requestAnimationFrame(() => {
          H && (H.focus(), H.select());
        }));
    }
    function To() {
      let e = new Date();
      return `${String(e.getHours()).padStart(2, "0")}:${String(
        e.getMinutes()
      ).padStart(2, "0")}`;
    }
    function Fo(e) {
      return e ? e.repeat === "none" && String(e.time || "") < To() : !1;
    }
    function at(e) {
      if (((Ke = Array.isArray(e) ? e : []), !!dt)) {
        if (((dt.textContent = ""), !Ke.length)) {
          let t = document.createElement("div");
          (t.className = "reminder-empty"),
            (t.textContent = p("reminderEmpty")),
            dt.appendChild(t);
          return;
        }
        for (let t of Ke.slice().sort((n, r) =>
          String(n.time).localeCompare(String(r.time))
        )) {
          let n = document.createElement("div");
          n.className = `reminder-item${Fo(t) ? " is-disabled" : ""}`;
          let r = document.createElement("span");
          r.textContent = t.time || "--:--";
          let i = document.createElement("span");
          (i.className = "reminder-message"),
            (i.textContent = t.message || ""),
            (i.title = t.message || "");
          let o = document.createElement("span");
          o.className = "reminder-repeat";
          let s = t.repeat === "custom" ? Co(t.days) : "";
          o.textContent = s || xo(t.repeat);
          let a = document.createElement("button");
          (a.type = "button"),
            (a.textContent = p("reminderEdit")),
            a.addEventListener("click", () => No(t));
          let u = document.createElement("button");
          (u.type = "button"),
            (u.textContent = p("reminderDelete")),
            u.addEventListener("click", () => {
              window.electronAPI.reminderDelete(t.id).catch(() => {});
            }),
            n.appendChild(r),
            n.appendChild(i),
            n.appendChild(o),
            n.appendChild(a),
            n.appendChild(u),
            dt.appendChild(n);
        }
      }
    }
    pe &&
      pe.addEventListener("click", (e) => {
        e.stopPropagation(), document.body.dataset.reminderPanel ? bn() : pr();
      });
    Pt &&
      Pt.addEventListener("click", () => {
        bn(), it();
      });
    Ct &&
      Ct.addEventListener("click", () => {
        it(), Ro();
      });
    xt && xt.addEventListener("click", () => it());
    Z &&
      (Z.addEventListener("click", (e) => {
        let t =
          e.target && e.target.closest
            ? e.target.closest("button[data-repeat]")
            : null;
        t && Bt(t.dataset.repeat);
      }),
      Bt(Q ? Q.value : "none"));
    Nn &&
      V &&
      Q &&
      H &&
      Nn.addEventListener("submit", async (e) => {
        e.preventDefault();
        let t = H.value.trim();
        if (!V.value || !t) return;
        let n = Q.value,
          r = n === "custom" ? Po() : [];
        if (n === "custom" && r.length === 0) return;
        let i = { time: V.value, message: t, repeat: n, days: r },
          o = nt
            ? await window.electronAPI.reminderUpdate({ ...i, id: nt })
            : await window.electronAPI.reminderAdd(i);
        o && o.ok && (it(), at(await window.electronAPI.remindersGet()));
      });
    document.addEventListener("keydown", (e) => {
      e.key !== "Escape" ||
        !document.body.dataset.reminderPanel ||
        (e.preventDefault(), bn(), it());
    });
    Fe &&
      Ce &&
      Fe.addEventListener("submit", async (e) => {
        e.preventDefault();
        let t = await window.electronAPI.catNameSet(Ce.value);
        fn(t), lr();
      });
    In && In.addEventListener("click", () => lr());
    Le &&
      ie &&
      Le.addEventListener("submit", async (e) => {
        e.preventDefault();
        let t = await window.electronAPI.userNameSet(ie.value);
        pn(t),
          cr(),
          je &&
            (Xt(),
            br(),
            st(p("userGreeting", je), { duration: 2200, kind: "notice" }));
      });
    Mn && Mn.addEventListener("click", () => cr());
    ke &&
      Pe &&
      ke.addEventListener("submit", async (e) => {
        e.preventDefault();
        let t = await window.electronAPI.fixedMessageSet(Pe.value);
        hn(t), dr();
      });
    Rn && Rn.addEventListener("click", () => dr());
    De &&
      me &&
      De.addEventListener("submit", async (e) => {
        e.preventDefault();
        let t = $e === "rest" ? 60 : 180,
          n = $e === "rest" ? 5 : 25,
          r = Math.max(1, Math.min(t, Math.round(Number(me.value) || n))),
          i =
            $e === "rest"
              ? await window.electronAPI.pomodoroRestSet(r)
              : await window.electronAPI.pomodoroFocusSet(r);
        Ae(i), mr();
      });
    Fn && Fn.addEventListener("click", () => mr());
    He &&
      fe &&
      He.addEventListener("submit", (e) => {
        e.preventDefault();
        let t = Math.max(5, Math.min(30, Math.round(Number(fe.value) || 5)));
        fr(), Xo(t);
      });
    Ln && Ln.addEventListener("click", () => fr());
    window.electronAPI
      .catNameGet()
      .then(fn)
      .catch(() => {});
    window.electronAPI.onCatNameChanged(fn);
    window.electronAPI
      .userNameGet()
      .then(pn)
      .catch(() => {});
    window.electronAPI.onUserNameChanged(pn);
    window.electronAPI.onUserNameEdit((e) => Eo(e));
    window.electronAPI.onCatNameEdit((e) => wo(e));
    window.electronAPI
      .fixedMessageGet()
      .then(hn)
      .catch(() => {});
    window.electronAPI.onFixedMessageChanged(hn);
    window.electronAPI.onFixedMessageEdit((e) => vo(e));
    window.electronAPI.onPomodoroFocusEdit((e) => ur(e));
    window.electronAPI.onPomodoroRestEdit((e) => ur(e, "rest"));
    gn();
    window.electronAPI
      .remindersGet()
      .then(at)
      .catch(() => {});
    setInterval(() => at(Ke), 30 * 1e3);
    window.electronAPI.onRemindersChanged(at);
    window.electronAPI.onReminderSettingsChanged(Mo);
    window.electronAPI.onReminderPanelOpen(() => {
      pr();
    });
    window.electronAPI.onReminderTriggered((e) => {
      let t = e && typeof e.text == "string" ? e.text.trim() : "";
      t && (Ar(), Ci(), st(t, { duration: 5200, kind: "reminder" }));
    });
    function Lo(e) {
      return e
        ? e.state === "checking"
          ? p("updateChecking")
          : e.state === "available"
          ? p("updateAvailable")
          : e.state === "none"
          ? p("updateNone")
          : e.state === "downloading"
          ? p("updateDownloading", e.percent ?? null)
          : e.state === "restarting"
          ? p("updateRestarting")
          : ""
        : "";
    }
    function gr() {
      if (!w || !D) return !1;
      let e = Lo(D);
      if (!e) return !1;
      w.textContent = "";
      let t = document.createElement("button");
      (t.type = "button"),
        (t.className = "update-cta-button"),
        (t.textContent = e),
        (t.disabled =
          D.state === "checking" ||
          D.state === "none" ||
          D.state === "downloading");
      let n = () => We(!0),
        r = (o) => {
          n(), o.stopPropagation();
        },
        i = () => {
          t.classList.add("is-pressed"),
            setTimeout(() => {
              t.classList.remove("is-pressed");
            }, 160);
        };
      return (
        w.addEventListener("pointerenter", n, { once: !0 }),
        w.addEventListener("pointermove", n, { once: !0 }),
        w.addEventListener("mouseenter", n, { once: !0 }),
        t.addEventListener("mouseenter", n),
        t.addEventListener("mousemove", n),
        t.addEventListener("pointerenter", n),
        t.addEventListener("pointermove", n),
        t.addEventListener("pointerdown", (o) => {
          r(o), i();
        }),
        t.addEventListener("mousedown", r),
        t.addEventListener("click", () => {
          D.state === "available" &&
            (i(),
            (D = { ...D, state: "downloading", percent: null }),
            gr(),
            window.electronAPI.updateDownload().catch(() => {}));
        }),
        w.appendChild(t),
        w.setAttribute("aria-label", e),
        (document.body.dataset.speech = "update"),
        n(),
        !0
      );
    }
    function Yn(e) {
      let t = document.createElementNS(A, "svg");
      t.setAttribute("class", "pomodoro-icon"),
        t.setAttribute("viewBox", "0 0 12 12"),
        t.setAttribute("aria-hidden", "true"),
        t.setAttribute("focusable", "false");
      let n = (r, i, o, s) => {
        let a = document.createElementNS(A, "rect");
        a.setAttribute("x", String(r)),
          a.setAttribute("y", String(i)),
          a.setAttribute("width", String(o)),
          a.setAttribute("height", String(s)),
          a.setAttribute("fill", "currentColor"),
          t.appendChild(a);
      };
      return (
        e === "pause"
          ? (n(3, 2, 2, 8), n(7, 2, 2, 8))
          : e === "play"
          ? (n(3, 2, 2, 8), n(5, 3, 2, 6), n(7, 4, 2, 4), n(9, 5, 1, 2))
          : (n(3, 3, 2, 2),
            n(7, 3, 2, 2),
            n(5, 5, 2, 2),
            n(3, 7, 2, 2),
            n(7, 7, 2, 2)),
        t
      );
    }
    function ko(e) {
      if (!w || !e || e.kind !== "timer" || !T || !T.visible) return !1;
      w.textContent = "";
      let t = String(Yt || "").trim();
      if (t) {
        let a = document.createElement("span");
        (a.className = "pomodoro-fixed-message"),
          (a.textContent = t),
          w.appendChild(a);
      }
      let n = document.createElement("span");
      n.className = "pomodoro-timer-row";
      let r = document.createElement("span");
      (r.className = "pomodoro-timer-text"),
        (r.textContent = e.text),
        n.appendChild(r);
      let i = document.createElement("span");
      i.className = "pomodoro-controls";
      let o = document.createElement("button");
      (o.type = "button"),
        (o.className = "pomodoro-control"),
        o.appendChild(Yn(T.running ? "pause" : "play")),
        (o.title = T.running ? p("pomodoroPause") : p("pomodoroResume")),
        o.setAttribute("aria-label", o.title),
        o.addEventListener("click", (a) => {
          a.stopPropagation(),
            (T && T.running
              ? window.electronAPI.pomodoroPause()
              : window.electronAPI.pomodoroStart()
            )
              .then(Ae)
              .catch(() => {});
        }),
        i.appendChild(o);
      let s = document.createElement("button");
      return (
        (s.type = "button"),
        (s.className = "pomodoro-control"),
        s.appendChild(Yn("reset")),
        (s.title = p("pomodoroReset")),
        s.setAttribute("aria-label", s.title),
        s.addEventListener("click", (a) => {
          a.stopPropagation(),
            window.electronAPI
              .pomodoroReset()
              .then(Ae)
              .catch(() => {});
        }),
        i.appendChild(s),
        n.appendChild(i),
        w.appendChild(n),
        w.setAttribute("aria-label", t ? `${t} ${e.text}` : e.text),
        (document.body.dataset.speech = "timer"),
        !0
      );
    }
    function Nt() {
      document.body.style.removeProperty("--bubble-overflow-y");
    }
    function Do() {
      w &&
        (ut && cancelAnimationFrame(ut),
        (ut = requestAnimationFrame(() => {
          if (
            ((ut = null),
            !document.body.dataset.speech || w.offsetParent === null)
          ) {
            Nt();
            return;
          }
          Nt();
          let e = w.getBoundingClientRect().top,
            t = 4;
          e < t &&
            document.body.style.setProperty(
              "--bubble-overflow-y",
              `${Math.ceil(t - e)}px`
            );
        })));
    }
    function ot(e) {
      if (w && !(Oe === "reminder" && (!e || e.kind !== "reminder"))) {
        if (gr()) {
          Nt();
          return;
        }
        if (!e || !e.text) {
          (w.textContent = ""),
            w.removeAttribute("aria-label"),
            delete document.body.dataset.speech,
            Nt();
          return;
        }
        ko(e) ||
          ((w.textContent = e.kind === "thinking" ? "" : e.text),
          w.setAttribute("aria-label", e.text),
          (document.body.dataset.speech = e.kind || "notice")),
          Do();
      }
    }
    window.electronAPI.onUpdateState((e) => {});
    function st(e, { duration: t = 1800, kind: n = "notice" } = {}) {
      (Oe === "reminder" && n !== "reminder") ||
        (ae && clearTimeout(ae),
        (Oe = n),
        delete document.body.dataset.speech,
        document.body.offsetWidth,
        ot({ text: e, kind: n }),
        (ae = setTimeout(() => {
          (ae = null), (Oe = null), ot(tt);
        }, t)));
    }
    function jn(e, t = "timer") {
      (tt = e ? { text: e, kind: t } : null), ae || ot(tt);
    }
    function Tt(e) {
      document.body.toggleAttribute("data-thinking", !!e),
        Pn && Pn.setAttribute("aria-hidden", e ? "false" : "true");
    }
    function Ho() {
      ze && (clearTimeout(ze), (ze = null));
    }
    function br() {
      rt ||
        O <= 0 ||
        ((he.volume = O), (he.currentTime = 0), he.play().catch(() => {}));
    }
    function Ar(e = {}) {
      if (rt || O <= 0) return;
      let t = Math.max(1, Math.min(3, Math.round(Number(e.repeat) || 3))),
        n = () => {
          (ye.volume = O), (ye.currentTime = 0), ye.play().catch(() => {});
        };
      n(), t >= 2 && setTimeout(n, 1500), t >= 3 && setTimeout(n, 3e3);
    }
    function Oo() {
      Tt(!1), Xt(), br(), st(p("agentComplete"), { kind: "complete" });
    }
    function $o() {
      Tt(!1),
        Pi(),
        st(p("needsAttention", je), { duration: 5200, kind: "reminder" });
    }
    function _o(e) {
      let t = Math.max(0, Math.floor(Number(e) || 0)),
        n = Math.floor(t / 60),
        r = t % 60;
      return `${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    }
    function Ae(e) {
      if (((T = e || null), !e || !e.visible)) {
        (T = null),
          delete document.body.dataset.pomodoro,
          delete document.body.dataset.pomodoroMode,
          delete document.body.dataset.pomodoroPaused,
          ae &&
            Oe !== "reminder" &&
            (clearTimeout(ae), (ae = null), (Oe = null)),
          rn();
        return;
      }
      let t = e.mode === "rest" ? "rest" : "focus";
      (T = e),
        (document.body.dataset.pomodoro = "1"),
        (document.body.dataset.pomodoroMode = t),
        document.body.toggleAttribute("data-pomodoro-paused", !e.running),
        rn();
    }
    function Yo(e) {
      let t = e && typeof e.state == "string" ? e.state : "",
        n = t === "thinking" || t === "working";
      Tt(n),
        Ho(),
        n &&
          e &&
          e.agentId === "antigravity" &&
          (ze = setTimeout(() => {
            (ze = null), Tt(!1);
          }, 3e3));
    }
    window.electronAPI.onAiTaskComplete(Oo);
    window.electronAPI.onDoJump(Xt);
    window.electronAPI.onAiTaskState(Yo);
    window.electronAPI.onAiTaskNotification($o);
    function wr(e) {
      (O = Math.max(0, Math.min(1, Number(e) || 0))),
        (he.volume = O),
        (ye.volume = O),
        (_.volume = O);
    }
    function Er(e) {
      (rt = !!e), rt && (he.pause(), ye.pause(), _.pause());
    }
    window.electronAPI
      .taskCompleteSoundVolumeGet()
      .then(wr)
      .catch(() => {});
    window.electronAPI.onTaskCompleteSoundVolume(wr);
    window.electronAPI
      .soundMutedGet()
      .then(Er)
      .catch(() => {});
    window.electronAPI.onSoundMuted(Er);
    window.electronAPI
      .pomodoroGet()
      .then(Ae)
      .catch(() => {});
    window.electronAPI.onPomodoroState(Ae);
    window.electronAPI.onPomodoroComplete((e) => {
      let t = e && e.completedMode === "focus",
        n = p(t ? "startBreak" : "startFocus", je);
      st(n, { kind: t ? "break" : "focus" });
    });
    window.electronAPI
      .languageGet()
      .then((e) => {
        (jt = zn(e)), gn(), Ae(T);
      })
      .catch(() => {});
    window.electronAPI.onLanguageChanged((e) => {
      (jt = zn(e)), gn(), Ae(T);
    });
    var bt = !1,
      At = !1,
      Ze = null;
    function Wn(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    function jo() {
      let e = [
        "video/mp4;codecs=h264",
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      return !window.MediaRecorder || !MediaRecorder.isTypeSupported
        ? ""
        : e.find((t) => MediaRecorder.isTypeSupported(t)) || "";
    }
    function Wo(e) {
      return e.arrayBuffer().then((t) => new Uint8Array(t));
    }
    function qo(e) {
      let t = e && e.name ? String(e.name) : "",
        n = e && e.message ? String(e.message) : "";
      return (
        t === "NotAllowedError" ||
        t === "SecurityError" ||
        /permission|not allowed|denied|No desktop capture source/i.test(n)
      );
    }
    function Go() {
      return /Windows/i.test(navigator.userAgent || navigator.platform || "");
    }
    function qn(e) {
      return qo(e)
        ? p(Go() ? "sharePermissionFailedWindows" : "sharePermissionFailed")
        : e && /conversion-failed|ffmpeg|MP4/i.test(String(e.message || ""))
        ? p("shareConversionFailed")
        : p("shareRecordingFailed");
    }
    async function Xo(e = 5) {
      if (bt) return;
      (bt = !0), (At = !1);
      let t = Math.max(5e3, Math.min(3e4, Math.round(Number(e) || 5) * 1e3)),
        n = Mt || "Comnyang";
      vt && (vt.textContent = n), (document.body.dataset.sharing = "1");
      let r = null;
      try {
        await Wn(250);
        let i = await window.electronAPI.shareCaptureOptions({ durationMs: t });
        if (!i || !i.sourceId) throw new Error("No desktop capture source.");
        r = await navigator.mediaDevices.getUserMedia({
          audio: !1,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: i.sourceId,
              maxFrameRate: 30,
            },
          },
        });
        let o = document.createElement("video");
        (o.muted = !0),
          (o.srcObject = r),
          await new Promise((L) => {
            o.onloadedmetadata = L;
          }),
          await o.play();
        let s = o.videoWidth / i.displayBounds.width,
          a = o.videoHeight / i.displayBounds.height,
          u = Math.max(0, Math.min(o.videoWidth - 2, i.crop.x * s)),
          g = Math.max(0, Math.min(o.videoHeight - 2, i.crop.y * a)),
          d = {
            x: u,
            y: g,
            width: Math.min(i.crop.width * s, o.videoWidth - u),
            height: Math.min(i.crop.height * a, o.videoHeight - g),
          },
          m = jo(),
          c = { videoBitsPerSecond: 24e6 };
        m && (c.mimeType = m);
        let h = new MediaRecorder(r, c);
        Ze = h;
        let f = [];
        h.ondataavailable = (L) => {
          L.data && L.data.size > 0 && f.push(L.data);
        };
        let y = new Promise((L) => {
          h.onstop = L;
        });
        if (
          (h.start(),
          await window.electronAPI.shareCaptureStarted().catch(() => {}),
          await Wn(i.durationMs || t),
          h.state !== "inactive" && h.stop(),
          await y,
          await window.electronAPI.shareCaptureOverlayHide().catch(() => {}),
          At)
        )
          return;
        let E = new Blob(f, { type: h.mimeType || m || "video/webm" }),
          F = await Wo(E),
          v = (E.type || "").includes("mp4") ? "mp4" : "webm",
          N = await window.electronAPI.shareVideoSave({
            bytes: F,
            extension: v,
            crop: d,
            scale: { x: s, y: a },
            source: { width: o.videoWidth, height: o.videoHeight },
            output: i.output,
          });
        if (N && N.ok === !1 && !N.canceled)
          throw new Error(N.reason || "share-save-failed");
      } catch (i) {
        console.error("Share recording failed:", i),
          await window.electronAPI.shareErrorDialog(qn(i)).catch(() => {
            window.alert(qn(i));
          });
      } finally {
        await window.electronAPI.shareCaptureOverlayHide().catch(() => {}),
          r && r.getTracks().forEach((i) => i.stop()),
          delete document.body.dataset.sharing,
          (Ze = null),
          (At = !1),
          (bt = !1);
      }
    }
    window.electronAPI.onShareRecord(() => So());
    window.electronAPI.onShareCaptureCancel(() => {
      (At = !0), Ze && Ze.state !== "inactive" && Ze.stop();
    });
    var Vo = document.getElementById("drag-handle"),
      Ft = document.getElementById("stretch-svg-end"),
      x = !1,
      on = 0,
      an = 0,
      vr = 0,
      P = 0,
      X = null,
      Lt = null,
      mt = null,
      sn = !1,
      kt = null,
      Qe = null,
      $ = null,
      ne = 0,
      Uo = 140,
      B = 6,
      Gn = 4,
      Jo = 420,
      Ko = 260,
      Xe = 11.2,
      Xn = 2.34,
      zo = 0.82,
      Zo = 1100,
      Qo = 420;
    function We(e) {
      let t = !!e;
      Hn !== t && ((Hn = t), window.electronAPI.setMouseEventsEnabled(t));
    }
    function q(e, t, n) {
      return t >= e.left && t <= e.right && n >= e.top && n <= e.bottom;
    }
    function Ve(e, t, n, r, i, o) {
      let s = (e - n) / i,
        a = (t - r) / o;
      return s * s + a * a <= 1;
    }
    function Sr(e, t, n) {
      if (!e) return null;
      let r = e.getBoundingClientRect();
      return r.width <= 0 || r.height <= 0 || !q(r, t, n)
        ? null
        : { nx: (t - r.left) / r.width, ny: (n - r.top) / r.height };
    }
    function xr() {
      return (
        !x &&
        !X &&
        !Y &&
        !te() &&
        !document.body.dataset.press &&
        !document.body.dataset.scroll &&
        !document.body.dataset.jump &&
        !document.body.dataset.hunting &&
        !document.body.dataset.huntingReturn
      );
    }
    function ei(e, t) {
      if (!xr()) return !1;
      let n = Sr(ee, e, t);
      return n ? Ve(n.nx, n.ny, 0.4, 0.33, 0.25, 0.23) : !1;
    }
    function Cr() {
      let e = ee && ee.contentDocument;
      return e && e.documentElement ? e.documentElement : null;
    }
    function be(e, t) {
      let n = Cr();
      n && n.classList.toggle(e, !!t);
    }
    function Pr() {
      return (
        !x &&
        !X &&
        !Y &&
        !te() &&
        !document.body.dataset.press &&
        !document.body.dataset.scroll &&
        !document.body.dataset.jump &&
        !document.body.dataset.huntingReturn
      );
    }
    function ti() {
      Pr() &&
        (qe(),
        clearTimeout(Qe),
        (Qe = null),
        delete document.body.dataset.huntingReturn,
        be("hunting-return", !1),
        window.electronAPI.setHuntingMode(!0),
        be("hunting", !0),
        (document.body.dataset.hunting = "1"),
        clearTimeout(kt),
        (kt = setTimeout(lt, Zo)));
    }
    function lt() {
      let e = !!document.body.dataset.hunting;
      be("hunting", !1),
        delete document.body.dataset.hunting,
        e && window.electronAPI.setHuntingMode(!1),
        clearTimeout(kt),
        (kt = null),
        e &&
          (be("hunting-return", !0),
          (document.body.dataset.huntingReturn = "1"),
          clearTimeout(Qe),
          (Qe = setTimeout(() => {
            be("hunting-return", !1),
              delete document.body.dataset.huntingReturn,
              (Qe = null);
          }, Qo)));
    }
    function Ir(e, t) {
      let n = Cr();
      n &&
        (n.style.setProperty("--purr-face-x", `${e.toFixed(2)}px`),
        n.style.setProperty("--purr-face-y", `${t.toFixed(2)}px`));
    }
    function ni(e, t) {
      let n = Sr(ee, e, t);
      if (!n) return { x: 0, y: 0 };
      let r = Math.max(-1, Math.min(1, (n.nx - 0.4) / 0.25)),
        i = Math.max(-1, Math.min(1, (n.ny - 0.33) / 0.23));
      return { x: r * 1.15, y: i * 0.75 };
    }
    function ri(e, t) {
      if (!xr()) return;
      let n = ni(e, t);
      Ir(n.x, n.y),
        be("purring", !0),
        (document.body.dataset.purring = "1"),
        (sn = !0),
        !rt &&
          _.paused &&
          !mt &&
          ((_.volume = O),
          (_.currentTime = 0),
          (mt = _.play()
            .then(() => {
              (mt = null), sn || qe();
            })
            .catch(() => {
              mt = null;
            }))),
        Mr(Jo);
    }
    function Mr(e) {
      clearTimeout(Lt), (Lt = setTimeout(qe, e));
    }
    function qe() {
      (sn = !1),
        be("purring", !1),
        delete document.body.dataset.purring,
        Ir(0, 0),
        clearTimeout(Lt),
        (Lt = null),
        _.pause(),
        (_.currentTime = 0);
    }
    function oi() {
      return document.body.classList.contains("dragging")
        ? (M("stretch-svg-end"), Ft)
        : document.body.dataset.stretching
        ? (M("stretch-pose-default"),
          document.getElementById("stretch-pose-default"))
        : document.body.dataset.hunting
        ? (M("cat"), document.getElementById("cat"))
        : document.body.dataset.jump === "start"
        ? (M("jump-start"), document.getElementById("jump-start"))
        : document.body.dataset.jump === "ing"
        ? (M("jump-ing"), document.getElementById("jump-ing"))
        : document.body.dataset.scroll
        ? (M("scroll-unroll"), document.getElementById("scroll-unroll"))
        : document.body.dataset.press === "left"
        ? (M("press-left"), document.getElementById("press-left"))
        : document.body.dataset.press === "right"
        ? (M("press-right"), document.getElementById("press-right"))
        : (M("cat"), ee);
    }
    function Rr(e, t) {
      let n = oi();
      if (!n) return !1;
      let r = n.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0 || !q(r, e, t)) return !1;
      let i = (e - r.left) / r.width,
        o = (t - r.top) / r.height;
      return n === Ft
        ? Ve(i, o, 0.5, 0.2, 0.2, 0.14) || Ve(i, o, 0.5, 0.52, 0.18, 0.38)
        : Ve(i, o, 0.4, 0.3, 0.24, 0.22) ||
            Ve(i, o, 0.55, 0.62, 0.3, 0.3) ||
            (i >= 0.28 && i <= 0.72 && o >= 0.3 && o <= 0.78);
    }
    function ii(e, t) {
      return x ||
        (Fe &&
          getComputedStyle(Fe).display !== "none" &&
          q(Fe.getBoundingClientRect(), e, t)) ||
        (Le &&
          getComputedStyle(Le).display !== "none" &&
          q(Le.getBoundingClientRect(), e, t)) ||
        (ke &&
          getComputedStyle(ke).display !== "none" &&
          q(ke.getBoundingClientRect(), e, t)) ||
        (De &&
          getComputedStyle(De).display !== "none" &&
          q(De.getBoundingClientRect(), e, t)) ||
        (He &&
          getComputedStyle(He).display !== "none" &&
          q(He.getBoundingClientRect(), e, t)) ||
        (pe &&
          getComputedStyle(pe).display !== "none" &&
          q(pe.getBoundingClientRect(), e, t)) ||
        (Ue &&
          getComputedStyle(Ue).display !== "none" &&
          q(Ue.getBoundingClientRect(), e, t)) ||
        (w &&
          getComputedStyle(w).display !== "none" &&
          q(w.getBoundingClientRect(), e, t))
        ? !0
        : Rr(e, t);
    }
    function An(e) {
      if (!e) {
        We(!1);
        return;
      }
      We(ii(e.clientX, e.clientY));
    }
    requestAnimationFrame(() => We(!1));
    var R = new Array(B).fill(0),
      G = new Array(B).fill(0),
      se = null,
      z = [],
      Ie = [],
      Me = [],
      Re = [],
      wt = null,
      ln = null;
    function Br(e) {
      let t = (e || "").match(/M\s*(-?\d+(?:\.\d+)?)[\s,]+(-?\d+(?:\.\d+)?)/);
      return t ? parseFloat(t[2]) : null;
    }
    function ai(e) {
      if (e.hasAttribute("y")) return parseFloat(e.getAttribute("y") || 0);
      let n = (e.getAttribute("transform") || "").match(
        /translate\(\s*[\d.\-]+(?:[\s,]+([\d.\-]+))?\s*\)/
      );
      return n && n[1] !== void 0 ? parseFloat(n[1]) : 0;
    }
    function si(e) {
      return parseFloat(e.getAttribute("height") || "0");
    }
    function li(e) {
      if (e.hasAttribute("x")) return parseFloat(e.getAttribute("x") || 0);
      let n = (e.getAttribute("transform") || "").match(
        /translate\(\s*([-\d.]+)/
      );
      return n && n[1] !== void 0 ? parseFloat(n[1]) : 0;
    }
    function ci(e) {
      return parseFloat(e.getAttribute("width") || "0");
    }
    function di(e, t, n, r) {
      r
        ? e.setAttribute("transform", `translate(${t} ${n})`)
        : (e.setAttribute("x", t), e.setAttribute("y", n));
    }
    function Nr(e) {
      return (
        !e.classList.contains("heat-overlay") &&
        !e.closest(".heat-overlay") &&
        !e.closest(".patches") &&
        !e.closest("defs") &&
        !e.closest("clipPath")
      );
    }
    // ── Parse stretch-start.svg inline (synchronous) ──
    try {
      var _ss = '<svg width="40" height="145" viewBox="0 0 40 145" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="leg-fl-start" d="M11 26H13V31H12V34H11V37H9V32H10V28H11V26Z" fill="var(--cat-color)"/><path d="M13 8H11V10H10V12H9V17H10V21H12V22H13V23H15V24H25V23H27V22H28V21H29V20H30V17H31V13H30V10H29V9H28V8H26V7H24V6H16V7H13V8Z" fill="var(--cat-color)"/><path id="tail-path" d="M27 51V50H33V49H35V48H36V47H35V44H36V43H38V44H39V45H40V50H39V51H38V52H36V53H31V52H28V51H27Z" fill="var(--cat-color)"/><g id="whiskers" data-heat-overlay="true"><rect width="5" height="1" transform="translate(6 14)" fill="var(--cat-color)"/><rect width="5" height="1" transform="translate(29 14)" fill="var(--cat-color)"/><rect width="6" height="1" transform="translate(5 17)" fill="var(--cat-color)"/><rect width="6" height="1" transform="translate(29 17)" fill="var(--cat-color)"/></g><path d="M11 9V6H12V4H13V3H14V2H15V4H16V5H17V9H16V10H12V9H11Z" fill="var(--cat-color)"/><path d="M24 5H23V9H24V10H27V9H28V4H27V3H26V2H25V3H24V5Z" fill="var(--cat-color)"/><rect x="13" y="22" width="14" height="3" fill="var(--cat-color)"/><rect x="12" y="24" width="16" height="3" fill="var(--cat-color)"/><rect x="12" y="26" width="16" height="3" fill="var(--cat-color)"/><rect x="12" y="28" width="16" height="3" fill="var(--cat-color)"/><rect x="12" y="30" width="16" height="3" fill="var(--cat-color)"/><rect x="12" y="32" width="16" height="3" fill="var(--cat-color)"/><rect x="11" y="34" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="36" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="38" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="40" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="42" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="44" width="18" height="3" fill="var(--cat-color)"/><rect x="11" y="46" width="18" height="3" fill="var(--cat-color)"/><rect x="10" y="48" width="20" height="3" fill="var(--cat-color)"/><rect x="10" y="50" width="20" height="3" fill="var(--cat-color)"/><rect width="1" height="3" transform="translate(22 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="1" height="3" transform="translate(26 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="5" transform="translate(23 12)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="3" transform="translate(23 13)" fill="var(--cat-color)"/><rect width="1" height="3" transform="translate(13 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="1" height="3" transform="translate(17 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="5" transform="translate(14 12)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="3" transform="translate(14 13)" fill="var(--cat-color)"/><path id="leg-fr-start" d="M29 26H27V31H28V34H29V37H31V32H30V28H29V26Z" fill="var(--cat-color)"/><path id="leg-rl-start" d="M10 55V51H18V55H17V57H16V59H12V57H11V55H10Z" fill="var(--cat-color)"/><path id="leg-rr-start" d="M22 55V51H30V55H29V57H28V59H24V57H23V55H22Z" fill="var(--cat-color)"/></svg>',
          _sd = new DOMParser().parseFromString(_ss, "image/svg+xml"),
          _sr = Array.from(_sd.querySelectorAll("rect")).filter(Nr);
      (z.length = 0), (Ie.length = 0), (Me.length = 0), (Re.length = 0);
      _sr.forEach(function (i, o) {
        (z[o] = ai(i)), (Ie[o] = si(i)), (Me[o] = li(i)), (Re[o] = ci(i));
      });
      var _tp = _sd.getElementById("tail-path");
      _tp && (ln = Br(_tp.getAttribute("d")));
    } catch (e) {
      console.error("Failed to parse stretch-start.svg:", e);
    }

    // ── Inject stretch-end.svg inline (synchronous) ──
    try {
      var _se = '<svg width="40" height="145" viewBox="0 0 40 145" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><style>:root{--cat-color:#1A1A1A;--cat-outline:#FFFFFF;}</style><filter id="cat-outline" x="-20%" y="-20%" width="140%" height="140%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated"/><feFlood flood-color="var(--cat-outline)" result="flood"/><feComposite in="flood" in2="dilated" operator="in" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="eye-outline" x="-50%" y="-50%" width="200%" height="200%"><feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated"/><feFlood flood-color="#F5F5F5" result="flood"/><feComposite in="flood" in2="dilated" operator="in" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter><clipPath id="head-clip"><path d="M13 8H11V10H10V12H9V17H10V21H12V22H13V23H15V24H25V23H27V22H28V21H29V20H30V17H31V13H30V10H29V9H28V8H26V7H24V6H16V7H13V8Z"/></clipPath><clipPath id="leg-fl-clip"><path d="M11 34H13V39H12V42H11V45H9V40H10V36H11V34Z"/></clipPath><clipPath id="leg-fr-clip"><path d="M29 34H27V39H28V42H29V45H31V40H30V36H29V34Z"/></clipPath><clipPath id="leg-rl-clip"><path d="M10 138V134H18V138H17V140H16V142H12V140H11V138H10Z"/></clipPath><clipPath id="leg-rr-clip"><path d="M22 138V134H30V138H29V140H28V142H24V140H23V138H22Z"/></clipPath></defs><g id="cat-content" filter="url(#cat-outline)"><g id="tail" data-patch-frame="27 125 1 1" data-tail-path-id="true"></g><g id="head" data-patch-frame="9 6 1 1"><path d="M13 8H11V10H10V12H9V17H10V21H12V22H13V23H15V24H25V23H27V22H28V21H29V20H30V17H31V13H30V10H29V9H28V8H26V7H24V6H16V7H13V8Z" fill="var(--cat-color)"/><g class="patches" clip-path="url(#head-clip)"></g></g><g id="whiskers" data-heat-overlay="true"><rect width="5" height="1" transform="translate(6 14)" fill="var(--cat-color)"/><rect width="5" height="1" transform="translate(29 14)" fill="var(--cat-color)"/><rect width="6" height="1" transform="translate(5 17)" fill="var(--cat-color)"/><rect width="6" height="1" transform="translate(29 17)" fill="var(--cat-color)"/></g><g id="ear-left" data-ear-position="11 2"></g><g id="ear-right" data-ear-position="23 2"></g><rect x="14" y="22" width="12" height="6" fill="var(--cat-color)"/><rect x="13" y="27" width="14" height="6" fill="var(--cat-color)"/><rect x="12" y="32" width="16" height="9" fill="var(--cat-color)"/><rect x="13" y="40" width="14" height="9" fill="var(--cat-color)"/><rect x="14" y="48" width="12" height="9" fill="var(--cat-color)"/><rect x="14" y="56" width="12" height="9" fill="var(--cat-color)"/><rect x="14" y="64" width="12" height="9" fill="var(--cat-color)"/><rect x="14" y="72" width="12" height="9" fill="var(--cat-color)"/><rect x="14" y="80" width="12" height="9" fill="var(--cat-color)"/><rect x="13" y="88" width="14" height="9" fill="var(--cat-color)"/><rect x="13" y="96" width="14" height="9" fill="var(--cat-color)"/><rect x="12" y="104" width="16" height="9" fill="var(--cat-color)"/><rect x="11" y="112" width="18" height="9" fill="var(--cat-color)"/><rect x="10" y="120" width="20" height="9" fill="var(--cat-color)"/><rect x="10" y="128" width="20" height="9" fill="var(--cat-color)"/><g id="leg-fl" data-patch-frame="9 34 0.5 1" data-stretch-y-delta="-8" data-stretch-cy="39.5"><path d="M11 34H13V39H12V42H11V45H9V40H10V36H11V34Z" fill="var(--cat-color)"/><g class="patches" clip-path="url(#leg-fl-clip)"></g></g><g id="leg-fr" data-patch-frame="27 34 0.5 1" data-stretch-y-delta="-8" data-stretch-cy="39.5"><path d="M29 34H27V39H28V42H29V45H31V40H30V36H29V34Z" fill="var(--cat-color)"/><g class="patches" clip-path="url(#leg-fr-clip)"></g></g><g id="leg-rl" data-patch-frame="10 134 1 1" data-stretch-y-delta="-83" data-stretch-cy="138"><path d="M10 138V134H18V138H17V140H16V142H12V140H11V138H10Z" fill="var(--cat-color)"/><g class="patches" clip-path="url(#leg-rl-clip)"></g></g><g id="leg-rr" data-patch-frame="22 134 1 1" data-stretch-y-delta="-83" data-stretch-cy="138"><path d="M22 138V134H30V138H29V140H28V142H24V140H23V138H22Z" fill="var(--cat-color)"/><g class="patches" clip-path="url(#leg-rr-clip)"></g></g><g id="body" data-patch-frame="10 22 1 9"></g><g><rect width="1" height="3" transform="translate(22 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="1" height="3" transform="translate(26 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="5" transform="translate(23 12)" fill="var(--eye-bg-color, #FFFFFF)"/></g><rect class="pupil-right" width="3" height="3" transform="translate(23 13)" fill="var(--eye-color-right, var(--eye-color, var(--cat-color)))"/><g><rect width="1" height="3" transform="translate(13 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="1" height="3" transform="translate(17 13)" fill="var(--eye-bg-color, #FFFFFF)"/><rect width="3" height="5" transform="translate(14 12)" fill="var(--eye-bg-color, #FFFFFF)"/></g><rect class="pupil-left" width="3" height="3" transform="translate(14 13)" fill="var(--eye-color-left, var(--eye-color, var(--cat-color)))"/></g></svg>',
          _ed = new DOMParser().parseFromString(_se, "image/svg+xml"),
          _es = _ed.documentElement,
          _ec = document.getElementById("stretch-svg-end");
      if (_ec && _ec.parentNode) {
        var _ei = document.importNode(_es, true);
        _ei.setAttribute("id", "stretch-svg-end");
        _ec.parentNode.replaceChild(_ei, _ec);
        _ei.removeAttribute("width");
        _ei.removeAttribute("height");
        Ft = _ei;
        var _da = {
          documentElement: _ei,
          getElementById: function (id) { return _ei.querySelector("#" + id); },
          createElementNS: function (ns, name) { return document.createElementNS(ns, name); },
          querySelector: function (sel) { return _ei.querySelector(sel); },
          querySelectorAll: function (sel) { return _ei.querySelectorAll(sel); },
        };
        Wt(_da, "stretch-svg-end");
        if (z.length > 0) { se = Tr(_da); _e(); }
      }
    } catch (e) {
      console.error("Failed to load stretch-end.svg:", e);
    }
    function Tr(e) {
      let t = "http://www.w3.org/2000/svg",
        n = e.documentElement;
      n.setAttribute("viewBox", "-20 -2 80 148"),
        n.setAttribute("preserveAspectRatio", "xMidYMin meet");
      let o = Array.from(n.querySelectorAll("rect"))
        .filter(Nr)
        .map((l, C) => {
          let S = 0,
            b = 0,
            J = !1;
          if (l.hasAttribute("y") || l.hasAttribute("x"))
            (S = parseFloat(l.getAttribute("x") || 0)),
              (b = parseFloat(l.getAttribute("y") || 0));
          else {
            let ce = (l.getAttribute("transform") || "").match(
              /translate\(\s*([\d.\-]+)(?:[\s,]+([\d.\-]+))?\s*\)/
            );
            ce &&
              ((S = parseFloat(ce[1])), (b = parseFloat(ce[2] || 0)), (J = !0));
          }
          return {
            rect: l,
            x: S,
            y: b,
            useTransform: J,
            origIdx: C,
            w: parseFloat(l.getAttribute("width")),
            h: parseFloat(l.getAttribute("height")),
          };
        })
        .filter((l) => l.y + l.h >= 25);
      if (o.length === 0) return null;
      let s = Math.min(...o.map((l) => l.y)),
        a = Math.max(...o.map((l) => l.y + l.h)),
        u = Math.min(...o.map((l) => l.x)),
        g = Math.max(...o.map((l) => l.x + l.w)),
        d = o.filter((l) => l.x < 33),
        m = Math.min(...d.map((l) => l.x)),
        c = Math.max(...d.map((l) => l.x + l.w)),
        h = (m + c) / 2,
        f = (a - s) / B,
        y = [];
      for (let l = 0; l < B; l++)
        y.push({ idx: l, yTop: s + l * f, rects: [] });
      for (let l of o) {
        let C = l.y + l.h / 2,
          S = Math.min(B - 1, Math.max(0, Math.floor((C - s) / f)));
        y[S].rects.push(l);
      }
      let E = [];
      for (let l = 0; l < B; l++) {
        let C = y[l],
          S = s + l * f;
        for (let b of C.rects) {
          let J = z[b.origIdx],
            Ge = b.y,
            ce = (J !== void 0 ? J : Ge) - S,
            xn = Ge - S,
            Ut = Me[b.origIdx] !== void 0 ? Me[b.origIdx] : b.x,
            Jr = b.x,
            Kr = Re[b.origIdx] !== void 0 ? Re[b.origIdx] : b.w,
            zr = b.w,
            Zr = Ie[b.origIdx] !== void 0 ? Ie[b.origIdx] : b.h,
            Qr = b.h;
          E.push({
            rect: b.rect,
            useTransform: b.useTransform,
            startX: Ut,
            endX: Jr,
            startYLocal: ce,
            endYLocal: xn,
            startW: Kr,
            endW: zr,
            startH: Zr,
            endH: Qr,
          }),
            b.rect.remove();
        }
      }
      let F = e.getElementById("cat-content") || n,
        v = [];
      for (let l = 0; l < B; l++) {
        let C = y[l],
          S = e.createElementNS(t, "g");
        S.setAttribute("id", `seg-wrap-${l}`);
        for (let b of C.rects) S.appendChild(b.rect);
        F.appendChild(S), (F = S), v.push({ el: S });
      }
      let N = e.getElementById("tail-path"),
        L = e.getElementById("tail") || N,
        Ee = N ? Br(N.getAttribute("d")) : null,
        ve = N ? ui(N.getAttribute("transform")) : 0,
        Se = Ee !== null ? Ee + ve : null,
        U = e.getElementById("body"),
        I = e.getElementById("cat-content");
      if (I && v.length > 0) {
        I.insertBefore(v[0].el, I.firstChild),
          U && U.parentNode === I && I.insertBefore(U, v[0].el.nextSibling);
        for (let C of ["leg-fl", "leg-fr", "leg-rl", "leg-rr"]) {
          let S = e.getElementById(C);
          S &&
            S.parentNode === I &&
            I.insertBefore(S, U || v[0].el.nextSibling);
        }
        let l = e.getElementById("tail");
        l && l.parentNode === I && I.insertBefore(l, I.firstChild);
      }
      let k = o
          .map((l) => z[l.origIdx])
          .filter((l) => l !== void 0 && !isNaN(l)),
        xe = o.map((l) => (z[l.origIdx] !== void 0 ? z[l.origIdx] : l.y) + l.h),
        qr = k.length ? Math.min(...k) : s,
        Gr = Math.max(...xe),
        Xr = Math.max(1, Gr - qr),
        Vr = Math.max(1, a - s),
        En = o.map((l) => ({
          endX: l.x,
          endY: l.y,
          endW: l.w,
          endH: l.h,
          startX: Me[l.origIdx] !== void 0 ? Me[l.origIdx] : l.x,
          startY: z[l.origIdx] !== void 0 ? z[l.origIdx] : l.y,
          startW: Re[l.origIdx] !== void 0 ? Re[l.origIdx] : l.w,
          startH: Ie[l.origIdx] !== void 0 ? Ie[l.origIdx] : l.h,
        })),
        Ur = En.filter((l) => l.endW >= 12 && l.endH >= 5).sort(
          (l, C) => l.endY - C.endY
        ),
        vn = [];
      for (let l of ["leg-fl", "leg-fr", "leg-rl", "leg-rr"]) {
        let C = e.getElementById(l);
        if (!C) continue;
        let S = parseFloat(C.getAttribute("data-stretch-y-delta") || "0"),
          b = C.getAttribute("data-patch-frame"),
          J = s + f;
        if (C.hasAttribute("data-stretch-cy"))
          J = parseFloat(C.getAttribute("data-stretch-cy"));
        else if (b) {
          let [, ce] = b.split(/\s+/).map(Number),
            Ut = l.startsWith("leg-f") ? 11 : 8;
          J = ce + Ut / 2;
        }
        let Ge = Math.min(B - 1, Math.max(0, Math.floor((J - s) / f)));
        vn.push({ el: C, delta: S, segIdx: Ge });
      }
      let Sn = {
        wrappers: v,
        segHeight: f,
        bodyYmin: s,
        bodyCenterX: h,
        lerpData: E,
        tailGroup: L,
        tailEndY: Se,
        bodyWrapper: U,
        startBodyHeight: Xr,
        endBodyHeight: Vr,
        bodyEndToStartMap: En,
        bodyRowRects: Ur,
        legGroups: vn,
      };
      return (
        (se = Sn), Array.isArray(ge && ge.body) && or(e, ge.body), qt(e), Sn
      );
    }
    function ui(e) {
      let t = (e || "").match(/translate\(\s*-?[\d.]+(?:[\s,]+(-?[\d.]+))?/);
      return t && t[1] != null ? parseFloat(t[1]) : 0;
    }
    function _e() {
      if (!se) return;
      let {
        wrappers: e,
        segHeight: t,
        bodyYmin: n,
        lerpData: r,
        tailGroup: i,
        tailEndY: o,
        legGroups: s,
      } = se;
      for (let a = 0; a < e.length; a++) {
        let u = a === 0 ? n : t,
          g = `translate(${R[a].toFixed(3)} ${u.toFixed(3)})`;
        e[a].el.setAttribute("transform", g);
      }
      for (let a of r) {
        let u =
            (a.startX !== void 0 ? a.startX : a.endX) +
            (a.endX - (a.startX !== void 0 ? a.startX : a.endX)) * P,
          g = a.startYLocal + (a.endYLocal - a.startYLocal) * P;
        if (
          (di(a.rect, u, g, a.useTransform),
          a.startW !== void 0 && a.endW !== void 0)
        ) {
          let d = a.startW + (a.endW - a.startW) * P;
          a.rect.setAttribute("width", d.toFixed(3));
        }
        if (a.startH !== void 0 && a.endH !== void 0) {
          let d = a.startH + (a.endH - a.startH) * P;
          a.rect.setAttribute("height", d.toFixed(3));
        }
      }
      if (s)
        for (let a of s) {
          let u = a.delta * (1 - P),
            g = 0;
          for (let d = 0; d <= a.segIdx; d++) g += R[d];
          a.el.setAttribute(
            "transform",
            `translate(${g.toFixed(3)} ${u.toFixed(3)})`
          );
        }
      if (i && o !== null && ln !== null) {
        let a = 0;
        for (let g = 0; g < R.length; g++) a += R[g];
        let u = (ln - o) * (1 - P);
        i.setAttribute(
          "transform",
          `translate(${a.toFixed(3)} ${u.toFixed(2)})`
        );
      }
    }
    var Be = null,
      Y = !1,
      cn = 0,
      Fr = 0,
      Lr = 0,
      mi = 0.1,
      fi = 0.28,
      pi = 0.84,
      hi = 0.002,
      yi = 2.5,
      gi = 0.85,
      bi = 0.32;
    function kr() {
      if (!se) {
        if (x) { Be = requestAnimationFrame(kr); return; }
        Be = null;
        return;
      }
      if (x && !document.body.classList.contains("dragging")) {
        document.body.classList.add("dragging");
        window.electronAPI.setStretchMode(!0);
        for (let n = 0; n < B; n++) (R[n] = 0), (G[n] = 0);
      }
      Y && ((P += (0 - P) * bi), P < 0.01 && (P = 0));
      let e = 0;
      for (let t = 0; t < B; t++) {
        let n = t === 0 ? 0 : R[t - 1];
        (G[t] += (n - R[t]) * fi),
          (G[t] += -R[t] * mi),
          (G[t] *= pi),
          (R[t] += G[t]);
        let r = yi * Math.pow(gi, t);
        (R[t] = Math.max(-r, Math.min(r, R[t]))),
          (e = Math.max(e, Math.abs(R[t]), Math.abs(G[t])));
      }
      if ((_e(), Y && P === 0 && e < 0.15)) {
        Y = !1;
        for (let t = 0; t < B; t++) (R[t] = 0), (G[t] = 0);
        _e(),
          document.body.classList.remove("dragging"),
          window.electronAPI.setStretchMode(!1),
          (Be = null);
        return;
      }
      if (x || Y || e > 0.01) Be = requestAnimationFrame(kr);
      else {
        for (let t = 0; t < B; t++) (R[t] = 0), (G[t] = 0);
        _e(), (Be = null);
      }
    }
    function Dr() {
      Be === null && (Be = requestAnimationFrame(kr));
    }
    function Ai(e, t = e) {
      if (!(x || !e || te())) {
        qe(),
          lt(),
          (x = !0),
          (Y = !1),
          (on = t.screenX),
          (an = t.screenY),
          (vr = e.screenY),
          (P = 0);
        for (let n = 0; n < B; n++) (R[n] = 0), (G[n] = 0);
        se && (document.body.classList.add("dragging"),
          window.electronAPI.setStretchMode(!0));
        Dr();
      }
    }
    function Dt() {
      X = null;
    }
    window.addEventListener(
      "mousedown",
      (e) => {
        (Fr = e.screenX), (Lr = e.screenY);
      },
      { capture: !0 }
    );
    Vo.addEventListener("mousedown", (e) => {
      if (Rr(e.clientX, e.clientY) && e.button === 0) {
        if (te()) return;
        We(!0),
          (X = {
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY,
            startedAt: Date.now(),
          }),
          e.preventDefault();
      }
    });
    window.addEventListener("mousemove", An, { passive: !0 });
    window.addEventListener("mousemove", (e) => {
      let t = Math.hypot(e.screenX - Fr, e.screenY - Lr);
      if ((e.buttons && t > Gn && (cn = Date.now()), X)) {
        let s = Math.hypot(e.screenX - X.screenX, e.screenY - X.screenY);
        e.buttons & 1 && s > Gn ? (Ai(X, e), Dt()) : e.buttons & 1 || Dt();
      }
      if (
        (ei(e.clientX, e.clientY) ? ri(e.clientX, e.clientY) : X || Mr(Ko), !x)
      )
        return;
      let n = e.screenX - on,
        r = e.screenY - an;
      (n !== 0 || r !== 0) &&
        ((cn = Date.now()),
        window.electronAPI.dragWindow(n, r),
        (G[0] -= n * hi),
        (on = e.screenX),
        (an = e.screenY));
      let i = vr - e.screenY,
        o = Math.max(0, Math.min(1, i / Uo));
      o > P && (P = o);
    });
    window.addEventListener("mouseup", (e) => {
      Dt(),
        x
          ? ((x = !1),
            window.electronAPI.dragWindowEnded(),
            P > 0
              ? ((Y = !0), Dr())
              : (document.body.classList.remove("dragging"),
                window.electronAPI.setStretchMode(!1)))
          : (x = !1),
        An(e);
    });
    window.addEventListener("mouseleave", () => {
      x || We(!1), Dt(), qe();
    });
    function wi() {
      (x = !1), (X = null), (Y = !1), (P = 0), qe(), lt();
      for (let e = 0; e < B; e++) (R[e] = 0), (G[e] = 0);
      document.body.classList.remove("dragging"),
        _e(),
        window.electronAPI.setStretchMode(!1),
        An();
    }
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault(),
        !(x || Y || Date.now() - cn < 350) &&
          window.electronAPI.showContextMenu();
    });
    var Hr = 180,
      Ei = 520,
      dn = 17,
      vi = 32.5,
      Si = 220,
      Ht = 0,
      we = null,
      Ot = null,
      Ye = null,
      re = null,
      un = [],
      ft = null;
    function xi(e, t) {
      if (
        (clearTimeout(ft),
        (ft = null),
        delete document.body.dataset.pomodoroFocusStart,
        e === "focus")
      )
        document.body.dataset.pomodoroFocusStart = "1";
      else return;
      ft = setTimeout(() => {
        delete document.body.dataset.pomodoroFocusStart, (ft = null);
      }, t);
    }
    function Or() {
      for (let e of un) clearTimeout(e);
      un = [];
    }
    function Gt() {
      Or(),
        delete document.body.dataset.jump,
        delete document.body.dataset.reminderJump,
        document.body.style.removeProperty("--jump-y"),
        document.body.style.removeProperty("--bubble-jump-y"),
        $t(!1);
    }
    function $r(e, t) {
      if (!e || !e.documentElement) return;
      if (!e.getElementById("reminder-jump-eye-style")) {
        let d = e.createElementNS(A, "style");
        d.setAttribute("id", "reminder-jump-eye-style"),
          (d.textContent = [
            ":root:not(.reminder-jump) .reminder-idle-eyes{display:none}",
            ":root.reminder-jump .jump-closed-eye{display:none}",
          ].join(`
`)),
          e.documentElement.insertBefore(d, e.documentElement.firstChild);
      }
      if (t === "ing")
        for (let d of e.querySelectorAll("path[stroke]")) {
          let m = d.getAttribute("d") || "";
          (m === "M13 12L17 14L13 16" || m === "M27 12L23 14L27 16") &&
            d.classList.add("jump-closed-eye");
        }
      if (e.getElementById("reminder-idle-eyes")) return;
      let r = t === "ing" ? 11 : 22,
        i = e.createElementNS(A, "g");
      i.setAttribute("id", "reminder-idle-eyes"),
        i.setAttribute("class", "reminder-idle-eyes");
      let o = (d) => {
          let m = e.createElementNS(A, "rect");
          for (let [c, h] of Object.entries(d)) m.setAttribute(c, String(h));
          i.appendChild(m);
        },
        s = "var(--eye-bg-color, #FFFFFF)",
        a = "var(--eye-color-left, var(--eye-color, var(--cat-color)))",
        u = "var(--eye-color-right, var(--eye-color, var(--cat-color)))";
      o({ x: 13, y: r + 1, width: 1, height: 3, fill: s }),
        o({ x: 17, y: r + 1, width: 1, height: 3, fill: s }),
        o({ x: 14, y: r, width: 3, height: 5, fill: s }),
        o({ x: 14, y: r + 1, width: 3, height: 3, fill: a }),
        o({ x: 22, y: r + 1, width: 1, height: 3, fill: s }),
        o({ x: 26, y: r + 1, width: 1, height: 3, fill: s }),
        o({ x: 23, y: r, width: 3, height: 5, fill: s }),
        o({ x: 23, y: r + 1, width: 3, height: 3, fill: u }),
        (e.getElementById("cat-content") || e.documentElement).appendChild(i);
    }
    function $t(e) {
      for (let t of ["jump-start", "jump-ing"]) {
        let n = document.getElementById(t),
          r = n && n.contentDocument;
        r &&
          r.documentElement &&
          r.documentElement.classList.toggle("reminder-jump", !!e);
      }
    }
    function Et() {
      Xt({ idleEyes: !0 });
    }
    function Ci() {
      Et(), setTimeout(Et, 1500), setTimeout(Et, 3e3);
    }
    function Pi() {
      Et(), Ar({ repeat: 1 });
    }
    function Xt(e = {}) {
      if (x || te()) return;
      let t = !!e.idleEyes;
      ct(),
        clearTimeout(we),
        delete document.body.dataset.press,
        Or(),
        document.body.toggleAttribute("data-reminder-jump", t),
        $t(t);
      let n = [
        ["start", 0, "0px", "0px"],
        ["start", 140, "0px", "0px"],
        ["ing", 300, "-16px", "-18px"],
        ["ing", 500, "-26px", "-26px"],
        ["ing", 660, "-24px", "-24px"],
        ["start", 860, "-5px", "-8px"],
        ["start", 1040, "0px", "0px"],
        ["ing", 1240, "-16px", "-18px"],
        ["ing", 1440, "-26px", "-26px"],
        ["ing", 1600, "-24px", "-24px"],
        ["start", 1800, "-5px", "-8px"],
        ["start", 1980, "0px", "0px"],
        [null, 2220, "0px", "0px"],
      ];
      for (let [r, i, o, s] of n)
        un.push(
          setTimeout(() => {
            if (
              (document.body.style.setProperty("--jump-y", o),
              document.body.style.setProperty("--bubble-jump-y", s),
              r)
            ) {
              let a = r === "start" ? "jump-start" : "jump-ing";
              if ((M(a), t)) {
                let u = document.getElementById(a);
                $r(u && u.contentDocument, r), $t(!0);
              }
              document.body.dataset.jump = r;
            } else Gt();
          }, i)
        );
    }
    function Ii() {
      return document.getElementById("scroll-unroll");
    }
    function Mi() {
      let e = Ii();
      return e ? e.contentDocument : null;
    }
    function Ri() {
      Ye !== null && (cancelAnimationFrame(Ye), (Ye = null));
    }
    function _r(e) {
      let t = Mi(),
        n = t && t.getElementById("paper-strip-mask");
      n && n.setAttribute("height", e.toFixed(2));
    }
    function Yr() {
      Ri(), _r(dn);
    }
    function Bi() {
      Yr();
      let e = performance.now(),
        t = (n) => {
          let r = Math.min(1, (n - e) / Si),
            i = 1 - Math.pow(1 - r, 3),
            o = dn + (vi - dn) * i;
          _r(o), r < 1 ? (Ye = requestAnimationFrame(t)) : (Ye = null);
        };
      Ye = requestAnimationFrame(t);
    }
    function ct() {
      delete document.body.dataset.scroll, clearTimeout(Ot), (Ot = null), Yr();
    }
    function Ni(e) {
      let t = document.getElementById(e);
      if (!t) return;
      let n = () => {
        t.contentDocument &&
          (Wt(t.contentDocument, e),
          document.body.dataset.reminderJump &&
            (e === "jump-start" || e === "jump-ing") &&
            ($r(t.contentDocument, e === "jump-start" ? "start" : "ing"),
            $t(!0)));
      };
      t.addEventListener("load", n), requestAnimationFrame(n);
    }
    for (let e of [
      "press-left",
      "press-right",
      "scroll-unroll",
      "jump-start",
      "jump-ing",
      "stretch-pose-default",
      "stretch-pose-ing",
    ])
      Ni(e);
    var jr = [26, 26, 26],
      Vn = [220, 40, 40],
      Ti = [60, 180, 90];
    function Fi(e) {
      let t = /^#?([0-9a-f]{6})$/i.exec(e || "");
      if (!t) return null;
      let n = parseInt(t[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var Un = 1500,
      Jn = 4,
      Li = 14,
      ki = 1.5,
      Di = 0.1,
      pt = 0.7,
      Kn = 0.42,
      Ne = [],
      Jt = 0,
      K = 0,
      le = null;
    function ht(e) {
      return `rgb(${e[0]}, ${e[1]}, ${e[2]})`;
    }
    var de = 0,
      Te = 0;
    function Vt() {
      let e = Date.now();
      for (; Ne.length > 0 && e - Ne[0] > Un; ) Ne.shift();
      let t = Ne.length / (Un / 1e3),
        n = Math.min(1, Math.max(0, (t - Jn) / (Li - Jn)));
      (Jt = Math.pow(n, ki)),
        (K += (Jt - K) * Di),
        K < 0.005 && Jt === 0 && (K = 0),
        (de += (Te - de) * 0.12),
        de < 0.005 && Te === 0 && (de = 0);
      let r,
        i = 0,
        o = 0;
      x && K > 0.005
        ? ((r = ht(Vn)), (o = Math.min(pt, K * pt)))
        : de > 0.005 || Te > 0
        ? ((r = ht(Ti)), (i = Math.min(Kn, de * Kn)))
        : ((r = ht(Vn)), (i = Math.min(pt, K * pt))),
        rr(ht(jr)),
        ro(r, i.toFixed(3), o.toFixed(3));
      let s = Math.max(0, Math.min(1, (K - 0.5) * 2));
      document.body.style.setProperty("--steam-opacity", s.toFixed(2)),
        K > 0 || t > 0 || de > 0 || Te > 0
          ? (le = requestAnimationFrame(Vt))
          : (le = null);
    }
    var mn = 3e3,
      _t = [],
      et = 0,
      oe = null;
    function wn() {
      if (oe) {
        let e = document.getElementById("stretch-pose-default");
        e && e.removeEventListener("load", oe), (oe = null);
      }
    }
    function Hi() {
      et += 1;
      for (let e of _t) clearTimeout(e);
      (_t = []), wn();
    }
    function Oi() {
      let e = ++et;
      if (oe) {
        let i = document.getElementById("stretch-pose-default");
        i && i.removeEventListener("load", oe), (oe = null);
      }
      let t = performance.now(),
        n = () => {
          if (!(e !== et || !document.body.dataset.stretching)) {
            if (Wr(!0)) {
              wn();
              return;
            }
            performance.now() - t < mn && requestAnimationFrame(n);
          }
        },
        r = document.getElementById("stretch-pose-default");
      r &&
        ((oe = () => {
          e !== et ||
            !document.body.dataset.stretching ||
            requestAnimationFrame(n);
        }),
        r.addEventListener("load", oe, { once: !0 })),
        requestAnimationFrame(() => requestAnimationFrame(n));
    }
    function Wr(e) {
      let t = document.getElementById("stretch-pose-default");
      if (!t) return !1;
      let n = t.contentDocument;
      if (!n || !n.documentElement) return !1;
      let r = n.documentElement;
      return (
        e
          ? (r.classList.remove("stretching"),
            r.getBoundingClientRect(),
            r.classList.add("stretching"))
          : r.classList.remove("stretching"),
        !0
      );
    }
    window.electronAPI.onDoStretch(() => {
      (x || Y || document.body.classList.contains("dragging")) && wi(),
        re && (clearInterval(re), (re = null)),
        clearTimeout(we),
        (we = null),
        delete document.body.dataset.press,
        Hi(),
        Gt(),
        ct(),
        lt(),
        M("stretch-pose-default"),
        (document.body.dataset.stretching = "ing"),
        Oi(),
        (Te = 1),
        le === null && (le = requestAnimationFrame(Vt)),
        _t.push(
          setTimeout(() => {
            Te = 0;
          }, mn * 0.7)
        ),
        _t.push(
          setTimeout(() => {
            (et += 1), wn(), Wr(!1), delete document.body.dataset.stretching;
          }, mn)
        );
    });
    window.electronAPI.onKeyPressed(() => {
      if (!te()) {
        if (!x) {
          lt(), Gt(), ct(), Ht++;
          let e = Ht % 2 === 0 ? "left" : "right";
          M(e === "left" ? "press-left" : "press-right"),
            (document.body.dataset.press = e),
            clearTimeout(we),
            (we = setTimeout(() => {
              delete document.body.dataset.press;
            }, Hr));
        }
        Ne.push(Date.now()), le === null && (le = requestAnimationFrame(Vt));
      }
    });
    window.electronAPI.onPomodoroFocusStart(() => {
      if (x || te()) return;
      xi("focus", 1600), re && clearInterval(re), Gt(), ct(), clearTimeout(we);
      let e = 0;
      re = setInterval(() => {
        Ht++;
        let t = Ht % 2 === 0 ? "left" : "right";
        M(t === "left" ? "press-left" : "press-right"),
          (document.body.dataset.press = t),
          Ne.push(Date.now()),
          le === null && (le = requestAnimationFrame(Vt)),
          e++,
          e >= 10 &&
            (clearInterval(re),
            (re = null),
            (we = setTimeout(() => {
              delete document.body.dataset.press;
            }, Hr)));
      }, 110);
    });
    window.electronAPI.onMouseWheel(() => {
      te() ||
        x ||
        document.body.dataset.press ||
        document.body.dataset.jump ||
        (document.body.dataset.scroll || Bi(),
        M("scroll-unroll"),
        (document.body.dataset.scroll = "unroll"),
        clearTimeout(Ot),
        (Ot = setTimeout(() => {
          ct();
        }, Ei)));
    });
  });
  $i();
})();
