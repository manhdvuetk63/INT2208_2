! function(_, l) {
    var d;
    _.rails !== l && _.error("jquery-ujs has already been loaded!");
    var e = _(document);
    _.rails = d = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote], button[data-confirm]",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
        fileInputSelector: "input[type=file]",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        CSRFProtection: function(e) {
            var t = _('meta[name="csrf-token"]').attr("content");
            t && e.setRequestHeader("X-CSRF-Token", t)
        },
        refreshCSRFTokens: function() {
            var e = _("meta[name=csrf-token]").attr("content"),
                t = _("meta[name=csrf-param]").attr("content");
            _('form input[name="' + t + '"]').val(e)
        },
        fire: function(e, t, n) { var r = _.Event(t); return e.trigger(r, n), !1 !== r.result },
        confirm: function(e) { return confirm(e) },
        ajax: function(e) { return _.ajax(e) },
        href: function(e) { return e.attr("href") },
        handleRemote: function(r) {
            var e, t, n, s, i, o, a, c;
            if (d.fire(r, "ajax:before")) {
                if (i = (s = r.data("cross-domain")) === l ? null : s, o = r.data("with-credentials") || null, a = r.data("type") || _.ajaxSettings && _.ajaxSettings.dataType, r.is("form")) {
                    e = r.attr("method"), t = r.attr("action"), n = r.serializeArray();
                    var u = r.data("ujs:submit-button");
                    u && (n.push(u), r.data("ujs:submit-button", null))
                } else r.is(d.inputChangeSelector) ? (e = r.data("method"), t = r.data("url"), n = r.serialize(), r.data("params") && (n = n + "&" + r.data("params"))) : r.is(d.buttonClickSelector) ? (e = r.data("method") || "get", t = r.data("url"), n = r.serialize(), r.data("params") && (n = n + "&" + r.data("params"))) : (e = r.data("method"), t = d.href(r), n = r.data("params") || null);
                return c = {
                    type: e || "GET",
                    data: n,
                    dataType: a,
                    beforeSend: function(e, t) {
                        if (t.dataType === l && e.setRequestHeader("accept", "*/*;q=0.5, " + t.accepts.script), !d.fire(r, "ajax:beforeSend", [e, t])) return !1;
                        r.trigger("ajax:send", e)
                    },
                    success: function(e, t, n) { r.trigger("ajax:success", [e, t, n]) },
                    complete: function(e, t) { r.trigger("ajax:complete", [e, t]) },
                    error: function(e, t, n) { r.trigger("ajax:error", [e, t, n]) },
                    crossDomain: i
                }, o && (c.xhrFields = { withCredentials: o }), t && (c.url = t), d.ajax(c)
            }
            return !1
        },
        handleMethod: function(e) {
            var t = d.href(e),
                n = e.data("method"),
                r = e.attr("target"),
                s = _("meta[name=csrf-token]").attr("content"),
                i = _("meta[name=csrf-param]").attr("content"),
                o = _('<form method="post" action="' + t + '"></form>'),
                a = '<input name="_method" value="' + n + '" type="hidden" />';
            i !== l && s !== l && (a += '<input name="' + i + '" value="' + s + '" type="hidden" />'), r && o.attr("target", r), o.hide().append(a).appendTo("body"), o.submit()
        },
        formElements: function(e, t) { return e.is("form") ? _(e[0].elements).filter(t) : e.find(t) },
        disableFormElements: function(e) { d.formElements(e, d.disableSelector).each(function() { d.disableFormElement(_(this)) }) },
        disableFormElement: function(e) {
            var t, n;
            t = e.is("button") ? "html" : "val", n = e.data("disable-with"), e.data("ujs:enable-with", e[t]()), n !== l && e[t](n), e.prop("disabled", !0)
        },
        enableFormElements: function(e) { d.formElements(e, d.enableSelector).each(function() { d.enableFormElement(_(this)) }) },
        enableFormElement: function(e) {
            var t = e.is("button") ? "html" : "val";
            e.data("ujs:enable-with") && e[t](e.data("ujs:enable-with")), e.prop("disabled", !1)
        },
        allowAction: function(e) {
            var t, n = e.data("confirm"),
                r = !1;
            return !n || (d.fire(e, "confirm") && (r = d.confirm(n), t = d.fire(e, "confirm:complete", [r])), r && t)
        },
        blankInputs: function(e, t, n) {
            var r, s = _(),
                i = t || "input,textarea",
                o = e.find(i);
            return o.each(function() {
                if (r = _(this), !(r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : r.val()) == !n) {
                    if (r.is("input[type=radio]") && o.filter('input[type=radio]:checked[name="' + r.attr("name") + '"]').length) return !0;
                    s = s.add(r)
                }
            }), !!s.length && s
        },
        nonBlankInputs: function(e, t) { return d.blankInputs(e, t, !0) },
        stopEverything: function(e) { return _(e.target).trigger("ujs:everythingStopped"), e.stopImmediatePropagation(), !1 },
        disableElement: function(e) {
            var t = e.data("disable-with");
            e.data("ujs:enable-with", e.html()), t !== l && e.html(t), e.bind("click.railsDisable", function(e) { return d.stopEverything(e) })
        },
        enableElement: function(e) { e.data("ujs:enable-with") !== l && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable") }
    }, d.fire(e, "rails:attachBindings") && (_.ajaxPrefilter(function(e, t, n) { e.crossDomain || d.CSRFProtection(n) }), e.delegate(d.linkDisableSelector, "ajax:complete", function() { d.enableElement(_(this)) }), e.delegate(d.buttonDisableSelector, "ajax:complete", function() { d.enableFormElement(_(this)) }), e.delegate(d.linkClickSelector, "click.rails", function(e) {
        var t = _(this),
            n = t.data("method"),
            r = t.data("params"),
            s = e.metaKey || e.ctrlKey;
        if (!d.allowAction(t)) return d.stopEverything(e);
        if (!s && t.is(d.linkDisableSelector) && d.disableElement(t), t.data("remote") === l) return t.data("method") ? (d.handleMethod(t), !1) : void 0;
        if (s && (!n || "GET" === n) && !r) return !0;
        var i = d.handleRemote(t);
        return !1 === i ? d.enableElement(t) : i.error(function() { d.enableElement(t) }), !1
    }), e.delegate(d.buttonClickSelector, "click.rails", function(e) {
        var t = _(this);
        if (!d.allowAction(t)) return d.stopEverything(e);
        t.is(d.buttonDisableSelector) && d.disableFormElement(t);
        var n = d.handleRemote(t);
        return !1 === n ? d.enableFormElement(t) : n.error(function() { d.enableFormElement(t) }), !1
    }), e.delegate(d.inputChangeSelector, "change.rails", function(e) { var t = _(this); return d.allowAction(t) ? (d.handleRemote(t), !1) : d.stopEverything(e) }), e.delegate(d.formSubmitSelector, "submit.rails", function(e) {
        var t, n, r = _(this),
            s = r.data("remote") !== l;
        if (!d.allowAction(r)) return d.stopEverything(e);
        if (r.attr("novalidate") == l && (t = d.blankInputs(r, d.requiredInputSelector)) && d.fire(r, "ajax:aborted:required", [t])) return d.stopEverything(e);
        if (s) { if (n = d.nonBlankInputs(r, d.fileInputSelector)) { setTimeout(function() { d.disableFormElements(r) }, 13); var i = d.fire(r, "ajax:aborted:file", [n]); return i || setTimeout(function() { d.enableFormElements(r) }, 13), i } return d.handleRemote(r), !1 }
        setTimeout(function() { d.disableFormElements(r) }, 13)
    }), e.delegate(d.formInputClickSelector, "click.rails", function(e) {
        var t = _(this);
        if (!d.allowAction(t)) return d.stopEverything(e);
        var n = t.attr("name"),
            r = n ? { name: n, value: t.val() } : null;
        t.closest("form").data("ujs:submit-button", r)
    }), e.delegate(d.formSubmitSelector, "ajax:send.rails", function(e) { this == e.target && d.disableFormElements(_(this)) }), e.delegate(d.formSubmitSelector, "ajax:complete.rails", function(e) { this == e.target && d.enableFormElements(_(this)) }), _(function() { d.refreshCSRFTokens() }))
}(jQuery),
function(e) {
    if ("function" == typeof define && define.amd) define(e);
    else if ("object" == typeof exports) module.exports = e();
    else {
        var t = window.Cookies,
            n = window.Cookies = e();
        n.noConflict = function() { return window.Cookies = t, n }
    }
}(function() {
    function h() { for (var e = 0, t = {}; e < arguments.length; e++) { var n = arguments[e]; for (var r in n) t[r] = n[r] } return t }

    function e(d) {
        function p(e, t, n) {
            var r;
            if (1 < arguments.length) {
                if ("number" == typeof(n = h({ path: "/" }, p.defaults, n)).expires) {
                    var s = new Date;
                    s.setMilliseconds(s.getMilliseconds() + 864e5 * n.expires), n.expires = s
                }
                try { r = JSON.stringify(t), /^[\{\[]/.test(r) && (t = r) } catch (l) {}
                return t = (t = encodeURIComponent(String(t))).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), e = (e = (e = encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape), document.cookie = [e, "=", t, n.expires && "; expires=" + n.expires.toUTCString(), n.path && "; path=" + n.path, n.domain && "; domain=" + n.domain, n.secure ? "; secure" : ""].join("")
            }
            e || (r = {});
            for (var i = document.cookie ? document.cookie.split("; ") : [], o = /(%[0-9A-Z]{2})+/g, a = 0; a < i.length; a++) {
                var c = i[a].split("="),
                    u = c[0].replace(o, decodeURIComponent),
                    _ = c.slice(1).join("=");
                '"' === _.charAt(0) && (_ = _.slice(1, -1));
                try {
                    if (_ = d && d(_, u) || _.replace(o, decodeURIComponent), this.json) try { _ = JSON.parse(_) } catch (l) {}
                    if (e === u) { r = _; break }
                    e || (r[u] = _)
                } catch (l) {}
            }
            return r
        }
        return p.get = p.set = p, p.getJSON = function() { return p.apply({ json: !0 }, [].slice.call(arguments)) }, p.defaults = {}, p.remove = function(e, t) { p(e, "", h(t, { expires: -1 })) }, p.withConverter = e, p
    }
    return e()
}), this.FatPlayer || (this.FatPlayer = {}),
    function(e) {
        var t;
        e.MessageTunnel = (function(e) {
            function o(e) { if (e) return { name: e.name, message: e.message } }

            function n(e) { if (e) { var t = new Error(e.message); return t.name = e.name, t } }

            function t() { return window.self !== window.top ? s(window.parent) : undefined }

            function s(e) { for (var t = 0, n = u; t < n.length; t++) { var r = n[t]; if (r.getTarget() === e) return r } var s = new _(e); return u.push(s), s }

            function r(e, t, n) { s(e).setListener(t, n) }

            function i(e, t) { s(e).removeListener(t) }

            function a(e, t, n, r) { s(e).sendMessage(t, n, r) }

            function c(e) { e.data instanceof Object && "MessageTunnel" === e.data.via && ("_pong" === e.data.name ? s(e.source).pongReceived(e.data) : s(e.source).messageReceived(e.data, e.origin)) }
            var u = [],
                _ = function() {
                    function e(e) { this._listeners = {}, this._pings = {}, this._nextPingId = 0, this._target = e }
                    return e.prototype.getTarget = function() { return this._target }, e.prototype.setListener = function(e, t) { e && t ? this._listeners[e] = t : console.log("Warning: Cannot add listener.") }, e.prototype.removeListener = function(e) { delete this._listeners[e] }, e.prototype.sendMessage = function(e, t, n) {
                        if (!e || "_pong" === e) throw new Error("Name is invalid.");
                        var r = { name: e, id: this._addPing(n), payload: t, via: "MessageTunnel" };
                        this._target.postMessage(r, "*")
                    }, e.prototype.messageReceived = function(r, s) {
                        var i = this,
                            e = this._listeners[r.name];
                        e && e(r.payload, function(e, t) {
                            var n = { name: "_pong", id: r.id, error: o(e), payload: t, via: "MessageTunnel" };
                            i._target.postMessage(n, s)
                        })
                    }, e.prototype.pongReceived = function(e) {
                        var t = this._pings[e.id];
                        t && t(n(e.error), e.payload), delete this._pings[e.id]
                    }, e.prototype._pingTimeout = function(e) {
                        var t = this._pings[e];
                        if (t) {
                            var n = new Error("Message timed out.");
                            n.name = "TimeoutError", t(n)
                        }
                        delete this._pings[e]
                    }, e.prototype._addPing = function(e) { var t = this; if (e) { var n = this._nextPingId; return this._nextPingId++, this._pings[n] = e, setTimeout(function() { t._pingTimeout(n) }, 4e3), n } }, e
                }();
            e.Portal = _, e.getParentPortal = t, e.getPortal = s, e.setListener = r, e.removeListener = i, e.sendMessage = a, window.addEventListener("message", c)
        }(t || (t = {})), t)
    }(this.FatPlayer),
    function() {
        var s, e, t;
        null == this.FatPlayer && (this.FatPlayer = {}), s = this.FatPlayer, e = s.MessageTunnel, t = e.getParentPortal(), s.playCard = null, s.manageCard = function(e, t) { return window.Card.manage(e, t) }, s.focus = function() { return window.focus(), window.document.body.focus() }, s._updateBoardDevKlass = function() { return $("#board").toggleClass("dev", this.dev) }, Object.defineProperties(s, { bodyScrollHeight: { get: function() { return window.document.body.scrollHeight } }, dev: { get: function() { return null == this._dev && (this._dev = !1), this._dev }, set: function(e) { return this._dev !== e && (this._dev = e), this._updateBoardDevKlass(), this._dev } }, locationPathname: { get: function() { return window.location.pathname } }, locationSearch: { get: function() { return window.location.search } } }), s.init = function() { if (null != t) return t.setListener("FatPlayer.playCard", function(e, t) { var n; return n = e.options, s.playCard(n), t(null) }), t.setListener("FatPlayer.focus", function(e, t) { return s.focus(), t(null) }), t.setListener("FatPlayer.getBodyScrollHeight", function(e, t) { return t(null, { value: s.bodyScrollHeight }) }), t.setListener("FatPlayer.getDev", function(e, t) { return t(null, { value: s.dev }) }), t.setListener("FatPlayer.setDev", function(e, t) { var n; return n = e.value, s.dev = n, t(null, { value: s.dev }) }), t.setListener("FatPlayer.getLocationPathname", function(e, t) { return t(null, { value: s.locationPathname }) }), t.setListener("FatPlayer.getLocationSearch", function(e, t) { return t(null, { value: s.locationSearch }) }), t.setListener("FatPlayer.manageCard", function(e, t) { var n, r; return n = e.kind, r = e.options, s.manageCard(n, r), t(null) }) }, s.destroy = function() { if (null != t) return t.removeListener("FatPlayer.playCard"), t.removeListener("FatPlayer.focus"), t.removeListener("FatPlayer.getBodyScrollHeight"), t.removeListener("FatPlayer.getDev"), t.removeListener("FatPlayer.setDev"), t.removeListener("FatPlayer.getLocationPathname"), t.removeListener("FatPlayer.getLocationSearch"), t.removeListener("FatPlayer.manageCard") }, s.init()
    }.call(this),
    function() {
        ! function() {
            var e;
            this.InterbeadsCongratDrawer = function() {
                function a(e) { this.place = e, this.cycled_right = null, this.cycled_wrong = null, this.updateDistributions() }
                return a.prototype.FRUITS = ["orange", "apple", "pear", "plum", "kiwi"], a.prototype.RADIUS = 40, a.defaultLocale = I18n.locale, a.prototype.run = function(e) {
                    e.chunk_success;
                    var t, n = e.interbeads_congrat || "bead",
                        r = e.is_solved,
                        s = e.chunk_end;
                    _ASSERT(null != r), _ASSERT(null != e.chunk_idx), _ASSERT(null != e.cb), this.locale = e.interbeads_congrat_locale || a.defaultLocale;
                    var i = function() { e.cb() };
                    switch ((t = _.extend({}, e, { cb: null })).is_jump = !r, n) {
                        case "bead_success":
                            if (!r) return i();
                            t.is_jump = !1, t.interbeads_congrat = "bead";
                            break;
                        case "chunk_success":
                            if (!r || !s) return i();
                            t.is_jump = !1, t.interbeads_congrat = "bead";
                            break;
                        case "no":
                            return i();
                        case "chunk":
                            if (t.is_jump = !1, t.interbeads_congrat = "bead", !s) return i();
                            break;
                        case "chunk_no_text":
                            if (t.is_jump = !1, t.interbeads_congrat = "bead_no_text", !s) return i();
                            break;
                        case "chunk_done":
                            if (t.is_jump = !1, !s) return i();
                            break;
                        case "bead_done":
                            t.is_jump = !1
                    }
                    var o = this._playAnimation(t);
                    return $.when(o).done(function() { i() })
                }, a.prototype._playAudio = function(e, t) {
                    var n = $.Deferred(),
                        r = a.audio[t];
                    return "auto" === e.interbeads_congrat_sound && r && "ipad" != get_browser() ? UchiruAudioManager.instance.play(r, function() { n.resolve() }) : n.resolve(), n.promise()
                }, a.prototype._playAnimation = function(e) {
                    var t = $.Deferred(),
                        n = _.extend({}, e);
                    return n.cb = function() { t.resolve() }, this._animate_congrat(n), t.promise()
                }, a.prototype._animate_congrat = function(e) {
                    var t, n, r, s, i, o, a;
                    return o = e.interbeads_congrat, i = e.is_solved ? 700 : 500, (t = []).push(this.place.children().animate({ opacity: 0 }, i).promise()), n = this._make_congrat(e), t.push(this._playAudio(e, n.textOriginal)), r = n.box, this.place.append(r), e.is_jump ? (s = $.Deferred(), t.push(s.promise()), r.animate({ opacity: 1 }, i, (a = this, function() { a._slide_wrong(n.fruit).done(function() { s.resolve() }) }))) : (t.push(r.animate({ opacity: 1 }, i).promise()), this._isFruitCongrat(e.interbeads_congrat) && t.push(this._slide(n.fruitBox, n.fruit))), $.when.apply($, t).done(function() {
                        if (r.css({ opacity: "" }), "bead_done" !== o && "chunk_done" !== o) return e.cb();
                        n.checkBox.css({ opacity: 1 }), $.delay(500, function() { return e.cb() })
                    })
                }, a.prototype._make_congrat = function(e) { return interbeads_congrat = e.interbeads_congrat, this._isFruitCongrat(e.interbeads_congrat) ? this._renderFruit("ibc_" + this.FRUITS[e.chunk_idx], e.is_solved, e.interbeads_congrat, this.place, e) : this._renderCheck("ibc__check", this.place) }, a.prototype._isFruitCongrat = function(e) { return ~~("bead_done" !== e & "chunk_done" !== e) }, a.prototype._renderCheck = function(e, t) { return box = $.div("ibc__container").css({ opacity: 0 }).appendTo(t).append(checkBox = $.div(e).css({ opacity: 0 })), { box: box, checkBox: checkBox } }, a.prototype._switchClass = function(e, t) { return e.removeClass("_" + (e.data("step") || 0)).addClass("_" + t), e.data({ step: t }) }, a.prototype._magic = function(e, t, n, r, s) { var i, o, a; return i = r / t * 360 % 360, o = 360 / n, (a = Math.floor(i / o)) !== s && (s = a, this._switchClass(e, a)), s }, a.prototype._slide_wrong = function(e) {
                    var t, n, r, s, i, o, a;
                    for (i = 1, t = [], r = $.Deferred(), n = o = 0; 0 <= i ? o < i : i < o; n = 0 <= i ? ++o : --o)
                        for (s = a = 0; a <= 11; s = ++a) t.push(this._jump(e, s, n));
                    return $.when.apply($, t).done(function() { return r.resolve() }), r.promise()
                }, a.prototype._jump = function(e, t, n) { var r; return r = $.Deferred(), $.delay(40 * t + 520 * n, function() { return e.removeClass("_" + (e.data("step") || 0)).addClass("_" + t), e.data({ step: t }), $.delay(1e3, function() { return r.resolve() }) }), r.promise() }, a.prototype._slide = function(e, s) { var i, o, a, c, u, _, l, n, d, r; return _ = Math.floor(2 * Math.PI * this.RADIUS), c = 40, l = this._offset(e, s).left, a = this._offset(e, s).left + 2 * _, i = a + 10, o = a - 15, u = 0, e.animate({ left: i }, { duration: 1200, easing: "linear", progress: (r = this, function(e, t) { return u = r._magic(s, _, c, (i - l) * t, u) }) }).animate({ left: o }, { duration: 300, easing: "easeOutSine", progress: (d = this, function(e, t) { var n, r; return n = c, (r = i - l - (i - o) * t) <= a - l && (n *= 2), u = d._magic(s, _, n, r, u) }) }).animate({ left: a }, { duration: 360, easing: "easeInOutQuad", progress: (n = this, function(e, t) { return u = n._magic(s, _, 2 * c, o - l + (a - o) * t, u) }) }).promise() }, a.prototype._renderFruit = function(e, t, n, r, s) { var i, o, a, c, u, _, l; return t ? (u = "ibc_right", l = this.arrRight[this.cycled_right.getNext()]) : (u = "ibc_wrong", l = this.arrWrong[this.cycled_wrong.getNext()]), prop = { visibility: "" }, "bead_no_text" === n && (prop = { visibility: "hidden" }), $.div("ibc__container").appendTo(r).append(i = $.div("ibc__box")), _ = $.span().addClass("ibc__text").css(prop).html(s.interbeads_congrat_no_text ? "&nbsp;" : l).appendTo(i), i.append(a = $.div().addClass("ibc__fruit-box " + u).append(o = $.div().addClass("ibc__fruit " + u + " " + e + " _0"))), c = "ibc_wrong" === u ? Math.floor(this._offset(i, _).left) - o.width() - 10 : Math.floor(this._offset(i, _).left + _.width()) - Math.floor(4 * Math.PI * this.RADIUS) + 120, a.css({ marginLeft: c }), i.css({ opacity: 0 }), { box: i, fruitBox: a, fruit: o, text: _, textOriginal: l } }, a.prototype._offset = function(e, t) { return { top: t.offset().top + parseInt(t.css("border-top-width")) - e.offset().top - parseInt(e.css("border-top-width")), left: t.offset().left + parseInt(t.css("border-left-width")) - e.offset().left - parseInt(e.css("border-left-width")) } }, a.audio = { "Great!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/great_g1-38dc9bc33b7f0d407179edf7fcabb19c65e4be9538624ceac664da69e9bd6007.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/great_g1-5b902ac0f0f30c11f54d8737caafaab01a97c588a30193221951ca776da63e0d.ogg" }, "Excellent!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/excellent_g1-59f4f039ac91ea8c56a4d1576bd7e9c036800036ad01944565ea79c3e6983316.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/excellent_g1-bd7c95a5eb979395f3229b29b76fbb9b93ab7859cd4e01312fae5bc02daec144.ogg" }, "Perfect!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/perfect_g1-a9c5102d941f77c6d6e0272982653962e9422b86f9dcb21a162033e569ede71f.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/perfect_g1-b98b528f41bb6ac54ef979b7e96c40a525e960f5f8adc3b448ee763e6350096b.ogg" }, "Good!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/good_g1-31186c10a9a91c65a1bccf4bbae24500655c64db02eae47017e7f0df767e1222.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/good_g1-5ed45a9a1ece14b3f0360b4e20ba1083aceb53cec9972a40b47388ef94bf6957.ogg" }, "Well done!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/well_done_g1-0f2cbe743406cb29ba3e219cf05c29bce4875f1e2736cbdb467e31ab1eb7586b.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat/sound/en/well_done_g1-91d3ba51b5f44ab63098a97cb7ef18b192d176c9388ad3ca0de6e25365acf53e.ogg" } }, a.prototype.updateDistributions = function() { this._arrRight = null, this._arrWrong = null, this.cycled_right = new e(this.arrRight.length), this.cycled_wrong = new e(this.arrWrong.length) }, a.prototype.redefineCongratLocale = function(e, t) { for (var n in this._arrRight = null, this._arrWrong = null, e) this.__translation["_" + t][n] = e[n].map(function(e) { return e.audio && (a.audio[e.text] = e.audio), e.text }) }, a.prototype.__translation = { _arrRight: { ru: ["\u041e\u0442\u043b\u0438\u0447\u043d\u043e!", "\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u043e!", "\u041f\u043e\u0442\u0440\u044f\u0441\u0430\u044e\u0449\u0435!", "\u0417\u0434\u043e\u0440\u043e\u0432\u043e!"], ua: ["\u0412\u0456\u0434\u043c\u0456\u043d\u043d\u043e!", "\u0427\u0443\u0434\u043e\u0432\u043e!", "\u0412\u0440\u0430\u0436\u0430\u044e\u0447\u0435!", "\u041f\u0440\u0435\u043a\u0440\u0430\u0441\u043d\u043e!", "\u0422\u043e\u0431\u0456 \u0432\u0434\u0430\u043b\u043e\u0441\u044f!"], en: ["Great!", "Excellent!", "Perfect!"], es: ["Great!", "Excellent!", "Perfect!"], ch: ["\u975e\u5e38\u597d", "\u597d\u6781\u4e86", "\u771f\u68d2", "\u4f60\u505a\u5bf9\u5566"], ind: ["Sempurna!", "Cemerlang!", "Menakjubkan!", "Hebat!", "Kamu berhasil!"], pt: ["\xd3timo!", "Maravilhoso!", "Incr\xedvel!", "Super!", "Voc\xea completou a tarefa!"], hi: ["Great!", "Excellent!", "Perfect!"], vi: ["Xu\u1ea5t s\u1eafc!", "Tuy\u1ec7t v\u1eddi!", "Tuy\u1ec7t!", "T\u1ed1t!", "B\u1ea1n \u0111\xe3 l\xe0m \u0111\u01b0\u1ee3c!"], tn: ["Great!", "Excellent!", "Perfect!"], zu: ["Great!", "Excellent!", "Perfect!"], "default": ["\u041e\u0442\u043b\u0438\u0447\u043d\u043e!", "\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u043e!", "\u041f\u043e\u0442\u0440\u044f\u0441\u0430\u044e\u0449\u0435!", "\u0417\u0434\u043e\u0440\u043e\u0432\u043e!"] }, _arrWrong: { ru: ["\u041d\u0435\u043f\u043b\u043e\u0445\u043e!", "\u041c\u043e\u043b\u043e\u0434\u0435\u0446!", "\u0425\u043e\u0440\u043e\u0448\u043e!", "\u0423\u0440\u0430!"], ua: ["\u041d\u0435\u043f\u043e\u0433\u0430\u043d\u043e!", "\u041c\u043e\u043b\u043e\u0434\u0435\u0446\u044c!", "\u0414\u043e\u0431\u0440\u0435!", "\u0423\u0440\u0430!"], en: ["Good!", "Well done!"], es: ["Good!", "Well done!"], ch: ["\u4e0d\u9519\uff01\u7ee7\u7eed\u52aa\u529b", "\u771f\u68d2\uff01\u52a0\u6cb9", "\u633a\u597d\u7684"], ind: ["Sama sekali tidak buruk!", "Pintar!", "Baik sekali!", "Hore!"], pt: ["Bom!", "Sensacional!", "Muito bom!", "Viva!"], hi: ["Good!", "Well done!"], vi: ["T\u1ed1t!", "Gi\u1ecfi!", "R\u1ea5t t\u1ed1t!", "Hoan h\xf4!"], tn: ["Good!", "Well done!"], zu: ["Good!", "Well done!"], "default": ["\u041d\u0435\u043f\u043b\u043e\u0445\u043e!", "\u041c\u043e\u043b\u043e\u0434\u0435\u0446!", "\u0425\u043e\u0440\u043e\u0448\u043e!", "\u0423\u0440\u0430!"] } }, Object.defineProperties(a.prototype, { locale: { get: function() { return null == this._locale && (this._locale = a.defaultLocale), this._locale }, set: function(e) { return this._locale !== e && (this._locale = e, this.updateDistributions()), this._locale } }, arrRight: { get: function() { return null == this._arrRight && (this._arrRight = (this.__translation._arrRight[this.locale] || this.__translation._arrRight["default"]).slice()), this._arrRight } }, arrWrong: { get: function() { return null == this._arrWrong && (this._arrWrong = (this.__translation._arrWrong[this.locale] || this.__translation._arrWrong["default"]).slice()), this._arrWrong } } }), a
            }(), e = function() {
                function e(e) {
                    var n;
                    this.count = e, this.buffer = function() { n = []; for (var e = 0, t = this.count; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.index = 0
                }
                return e.prototype.getNext = function() { var e; return e = this.buffer[this.index], this.index = (this.index + 1) % this.buffer.length, e }, e
            }()
        }()
    }.call(this),
    function() {
        ! function() {
            var e;
            this.InterbeadsCongratDrawerV2 = function() {
                function a(e) { this.place = e, this["class"] = "ibc_v2", this.cycled_right = null, this.cycled_wrong = null, this.updateDistributions(), this.setCongratPaths() }
                return a.defaultLocale = I18n.locale, a.prototype.run = function(e) {
                    e.chunk_success;
                    var t, n = e.interbeads_congrat || "bead",
                        r = e.is_solved,
                        s = e.chunk_end;
                    _ASSERT(null != r), _ASSERT(null != e.chunk_idx), _ASSERT(null != e.cb), this.locale = e.interbeads_congrat_locale || a.defaultLocale;
                    var i = function() { e.cb() };
                    switch (t = _.extend({}, e, { cb: null }), n) {
                        case "bead_success":
                            if (!r) return i();
                            t.interbeads_congrat = "bead";
                            break;
                        case "chunk_success":
                            if (!r || !s) return i();
                            t.interbeads_congrat = "bead";
                            break;
                        case "no":
                            return i();
                        case "chunk":
                            if (t.interbeads_congrat = "bead", !s) return i();
                            break;
                        case "chunk_no_text":
                            if (t.interbeads_congrat = "bead_no_text", !s) return i();
                            break;
                        case "chunk_done":
                            if (!s) return i()
                    }
                    var o = this._playAnimation(t);
                    return $.when(o).done(function() { i() })
                }, a.prototype._playAudio = function(e, t) {
                    var n = $.Deferred(),
                        r = a.audio[t];
                    return "auto" === e.interbeads_congrat_sound && r && "ipad" != get_browser() ? UchiruAudioManager.instance.play(r, function() { n.resolve() }) : n.resolve(), n.promise()
                }, a.prototype._playAnimation = function(e) {
                    var t = $.Deferred(),
                        n = _.extend({}, e);
                    return n.cb = function() { t.resolve() }, this._animate_congrat(n), t.promise()
                }, a.prototype._animate_congrat = function(e) { var t, n, r, s, i, o; return o = e.interbeads_congrat, i = e.is_solved ? 700 : 500, (t = []).push(this.place.children().animate({ opacity: 0 }, i).promise()), r = this._make_congrat(e), t.push(this._playAudio(e, r.text)), this.place.append(r.container), t.push(r.container.fadeIn(i).promise()), n = { container: r.lottieBox[0], renderer: "svg", loop: !1, autoplay: !0, animationData: r.lottieData }, s = $.Deferred(), $.delay(300, function() { r.lottieBox.removeClass("hidden"), lottie.loadAnimation(n).addEventListener("complete", function() { s.resolve() }) }), t.push(s), $.when.apply($, t).done(function() { r.container.css({ opacity: "" }), i = "bead_done" === o || "chunk_done" === o ? 700 : 500, $.delay(i, function() { return e.cb() }) }) }, a.prototype._make_congrat = function(e) { var t, n, r, s; return interbeads_congrat = e.interbeads_congrat, e.is_solved ? (t = this.arrRight[this.cycled_right.getNext()], n = this.rightCongratData) : (t = this.arrWrong[this.cycled_wrong.getNext()], n = this.wrongCongratData), { container: $.div(this["class"] + "__container").hide().append($.div(this["class"] + "__box").append(r = $.span(this["class"] + "__text").html(e.interbeads_congrat_no_text ? "&nbsp;" : t), s = $.div(this["class"] + "__lottie_box hidden"))), textBox: r, lottieBox: s, lottieData: n, text: t } }, a.audio = { "Superb!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Superb_g1-69b8d5e683ef331131fa41a677b82a342c9aadc1eca42ffabd5ed97ba624ff58.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Superb_g1-4da2f6635fe2a281405045af6d4222cc21737951ec22076789d26d9da1517e61.ogg" }, "Outstanding!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Outstanding_g1-a2fd755a7c2e54fcc0fb511829f4888da13d7fc52ac8ccdfeec03f65bf7847cf.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Outstanding_g1-bade412ab229beed292e86fd95268a35dea876685fc1bc7544f0ff930d68a7fa.ogg" }, "Fantastic!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Fantastic_g1-c661109dc34aacf6e1db21843d4ee289ebbe71892e62316cb119a3cc77d45892.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Fantastic_g1-fa047e5521cdc39694dca73dbbde846c9f6d53b1962ebba32c2536511e744db2.ogg" }, "You rock!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/You_rock_g1-2ae8abf04e63eee114bfa10daf20c3d343ac9d8a116347642d06891c500927bc.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/You_rock_g1-a0735abad760ab46ac77d776ace4d7ec7d099364c02845ab529130a693aa384b.ogg" }, "Awesome!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Awesome_g1-99314d3fa10c945927d22d6a087761d3d8e663d8fcc85160a17757ac693308d7.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Awesome_g1-f9e86f23125898eae059aa9ba9042030834529cfe7243baca7c6c10c4b1492e8.ogg" }, "Splendid!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Splendid_g1-403e04379e4fde7f5ac488435c6ead680ecfac9d5e30843a4f6005e5c939af85.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Splendid_g1-af8a34e834827fa6b16ddf6f56b920aa5b5ec33716512df1d03dd018c2fa5b70.ogg" }, "Smashing!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Smashing_g1-24f1e8a8c14c83b5341278153f580cd0f5787c0c0584aa4ad2c1b475c7eddf0e.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Smashing_g1-77ac77976b851c9af5039f2be6e1ba2cd45023775b8173a68b49cc81be166000.ogg" }, "Tremendous!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Tremendous_g1-f8b1c963ec3c03d213eff4251a19259107726d956fc333ddb319ffe06f737dbe.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Tremendous_g1-ad9356add9f30ede13ab0af276a2066be0769a01d9564ef23530fefe37bd8c89.ogg" }, "Terrific!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Terrific_g1-abb2d383c820275a91eb10a6b034fd3b51f4cf4c4a885a4ea53db9fabcee3c34.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Terrific_g1-8d9bb1dc86905217b7973f91663348a7fbcc1251758b07bb18cbcbbda8140d73.ogg" }, "Nice one!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_one_g1-ad7993cb0a3db646a17e6d650027c8419d7302619c5db13779e2974c7359e307.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_one_g1-29f8e927f92ddac2144c029070da2f3ee2a3189d47cd7fa9941efefb3a0b3802.ogg" }, "You did it!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/You_did_it_g1-4c8c54671007c253927e2fa9a6d6f59085fac131be7baff94f0e1336cc5fd111.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/You_did_it_g1-19d3d4587bcbae74371307bec9840c4c7450c7d02a0117a475403b461fd66b68.ogg" }, "Way to go!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Way_to_go_g1-9e47d2fd31d27874c1d75bea5c73cf8e20fa142deace2972bae363d0697d2788.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Way_to_go_g1-529445411055df2c6e26763b8f8671833dc9cfb3574c41778ab7b5c842c69752.ogg" }, "Keep on trying!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Keep_on_trying_g1-cd598f88522be6183f1e5d8a469d1eab654db971972354f089427dac8e08988e.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Keep_on_trying_g1-9fc3f03460a99963f24c9f2b9a2cfb0dd20a7bea1807872f428ac720d785cb1b.ogg" }, "Nice going!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_going_g1-9bedd9d3787198ce61a6353e23d4ab85dc264675645769128b6972e915f51131.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_going_g1-2fe452ef0733b39528d95bb0672accb3012f231d7d3e10a657b1d6995752a722.ogg" }, "Keep it up!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Keep_it_up_g1-e75c97119ed13e258b8748007e03c605223fa7af1cb8c1d5bee50f6751fceb13.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Keep_it_up_g1-4fed2ab6859e48158a6b7adf790de7a169588890522088fb17e7b4278abc95e9.ogg" }, "Nice try!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_try_g1-1011c00cf80d863a540dfc17e6838d17fedd0f62ac890c5863a1f94063dba3bc.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Nice_try_g1-7b7096fa8ec31757c236a6e91976dc82a410722dc753d770c3e978b19aa416c6.ogg" }, "Well done!": { mp3: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Well_done_g1-42996c0ab76dc1f8a456c115acab48593195e603c0cad7498ccea27086a9a2d4.mp3", ogg: window.fp_asset_host + "/fat_player/common/interbeads-congrat-v2/sound/en/Well_done_g1-364e50c9e06124d644fa77dd1c9e943940dafb6cee275cce34df464902f2837b.ogg" } }, a.prototype.setCongratPaths = function() {
                    this.rightCongratData = {
                        v: "5.1.20",
                        fr: 24,
                        ip: 0,
                        op: 15,
                        w: 250,
                        h: 250,
                        nm: "Comp 1",
                        ddd: 0,
                        assets: [],
                        layers: [{
                            ddd: 0,
                            ind: 1,
                            ty: 4,
                            nm: "Shape Layer 2",
                            sr: 1,
                            ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [97.781, 89.781, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } },
                            ao: 0,
                            shapes: [{
                                ty: "gr",
                                it: [{
                                    ind: 0,
                                    ty: "sh",
                                    ix: 1,
                                    ks: {
                                        a: 0,
                                        k: {
                                            i: [
                                                [35.467, 0],
                                                [0, -35.467],
                                                [-35.467, 0],
                                                [0, 35.467]
                                            ],
                                            o: [
                                                [-35.467, 0],
                                                [0, 35.467],
                                                [35.467, 0],
                                                [0, -35.467]
                                            ],
                                            v: [
                                                [0, -64.219],
                                                [-64.219, 0],
                                                [0, 64.219],
                                                [64.219, 0]
                                            ],
                                            c: !0
                                        },
                                        ix: 2
                                    },
                                    nm: "Path 1",
                                    mn: "ADBE Vector Shape - Group",
                                    hd: !1
                                }, { ty: "tm", s: { a: 1, k: [{ i: { x: [.667], y: [1] }, o: { x: [.167], y: [.167] }, n: ["0p667_1_0p167_0p167"], t: 0, s: [100], e: [0] }, { t: 7 }], ix: 1 }, e: { a: 0, k: 100, ix: 2 }, o: { a: 0, k: 90, ix: 3 }, m: 1, ix: 2, nm: "Trim Paths 1", mn: "ADBE Vector Filter - Trim", hd: !1 }, { ty: "st", c: { a: 0, k: [.521568655968, .796078443527, .54509806633, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 12, ix: 5 }, lc: 2, lj: 2, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "tr", p: { a: 0, k: [27.219, 35.219], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }],
                                nm: "Ellipse 1",
                                np: 4,
                                cix: 2,
                                ix: 1,
                                mn: "ADBE Vector Group",
                                hd: !1
                            }],
                            ip: 0,
                            op: 720.720720720721,
                            st: 0,
                            bm: 0
                        }, {
                            ddd: 0,
                            ind: 2,
                            ty: 4,
                            nm: "Shape Layer 1",
                            sr: 1,
                            ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [108.938, 124, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 94.1, 100], ix: 6 } },
                            ao: 0,
                            shapes: [{
                                ind: 0,
                                ty: "sh",
                                ix: 1,
                                ks: {
                                    a: 0,
                                    k: {
                                        i: [
                                            [0, 0],
                                            [-11.833, -14.804],
                                            [-7.201, 13.245],
                                            [0, 0]
                                        ],
                                        o: [
                                            [0, 0],
                                            [10.181, 12.738],
                                            [8.313, -15.291],
                                            [0, 0]
                                        ],
                                        v: [
                                            [-15.844, .959],
                                            [1.13, 24.012],
                                            [21.748,
                                                23.291
                                            ],
                                            [45.967, -23.174]
                                        ],
                                        c: !1
                                    },
                                    ix: 2
                                },
                                nm: "Path 1",
                                mn: "ADBE Vector Shape - Group",
                                hd: !1
                            }, { ty: "tm", s: { a: 0, k: 0, ix: 1 }, e: { a: 1, k: [{ i: { x: [.667], y: [1] }, o: { x: [.167], y: [.167] }, n: ["0p667_1_0p167_0p167"], t: 9, s: [0], e: [100] }, { t: 15 }], ix: 2 }, o: { a: 0, k: 0, ix: 3 }, m: 1, ix: 2, nm: "Trim Paths 1", mn: "ADBE Vector Filter - Trim", hd: !1 }, { ty: "st", c: { a: 0, k: [.352941185236, .741176486015, .388235300779, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 12, ix: 5 }, lc: 2, lj: 2, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }],
                            ip: 0,
                            op: 720.720720720721,
                            st: 0,
                            bm: 0
                        }],
                        markers: []
                    }, this.wrongCongratData = {
                        v: "5.1.20",
                        fr: 24,
                        ip: 0,
                        op: 18,
                        w: 250,
                        h: 250,
                        nm: "Comp 1",
                        ddd: 0,
                        assets: [],
                        layers: [{
                            ddd: 0,
                            ind: 1,
                            ty: 4,
                            nm: "Shape Layer 2",
                            sr: 1,
                            ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [97.781, 89.781, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } },
                            ao: 0,
                            shapes: [{
                                ty: "gr",
                                it: [{
                                    ind: 0,
                                    ty: "sh",
                                    ix: 1,
                                    ks: {
                                        a: 0,
                                        k: {
                                            i: [
                                                [35.467, 0],
                                                [0, -35.467],
                                                [-35.467, 0],
                                                [0, 35.467]
                                            ],
                                            o: [
                                                [-35.467, 0],
                                                [0, 35.467],
                                                [35.467, 0],
                                                [0, -35.467]
                                            ],
                                            v: [
                                                [0, -64.219],
                                                [-64.219, 0],
                                                [0, 64.219],
                                                [64.219, 0]
                                            ],
                                            c: !0
                                        },
                                        ix: 2
                                    },
                                    nm: "Path 1",
                                    mn: "ADBE Vector Shape - Group",
                                    hd: !1
                                }, { ty: "tm", s: { a: 1, k: [{ i: { x: [.667], y: [1] }, o: { x: [.167], y: [.167] }, n: ["0p667_1_0p167_0p167"], t: 0, s: [100], e: [0] }, { t: 7 }], ix: 1 }, e: { a: 0, k: 100, ix: 2 }, o: { a: 0, k: 0, ix: 3 }, m: 1, ix: 2, nm: "Trim Paths 1", mn: "ADBE Vector Filter - Trim", hd: !1 }, { ty: "st", c: { a: 0, k: [.435294121504, .760784327984, .878431379795, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 12, ix: 5 }, lc: 2, lj: 2, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "tr", p: { a: 0, k: [27.219, 35.219], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }],
                                nm: "Ellipse 1",
                                np: 4,
                                cix: 2,
                                ix: 1,
                                mn: "ADBE Vector Group",
                                hd: !1
                            }],
                            ip: 0,
                            op: 720.720720720721,
                            st: 0,
                            bm: 0
                        }, {
                            ddd: 0,
                            ind: 2,
                            ty: 4,
                            nm: "Shape Layer 8",
                            sr: 1,
                            ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [71.5, 226, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } },
                            ao: 0,
                            shapes: [{
                                ty: "gr",
                                it: [{
                                    ind: 0,
                                    ty: "sh",
                                    ix: 1,
                                    ks: {
                                        a: 0,
                                        k: {
                                            i: [
                                                [0, 0],
                                                [0, 0]
                                            ],
                                            o: [
                                                [0, 0],
                                                [0, 0]
                                            ],
                                            v: [
                                                [105.25, -95.095],
                                                [105.25, -67.5]
                                            ],
                                            c: !1
                                        },
                                        ix: 2
                                    },
                                    nm: "Path 1",
                                    mn: "ADBE Vector Shape - Group",
                                    hd: !1
                                }, { ty: "tm", s: { a: 1, k: [{ i: { x: [.833], y: [.833] }, o: { x: [.167], y: [.167] }, n: ["0p833_0p833_0p167_0p167"], t: 13, s: [100], e: [0] }, { t: 18 }], ix: 1 }, e: { a: 0, k: 100, ix: 2 }, o: { a: 0, k: 0, ix: 3 }, m: 1, ix: 2, nm: "Trim Paths 1", mn: "ADBE Vector Filter - Trim", hd: !1 }, { ty: "st", c: { a: 0, k: [.227450981736, .670588254929, .831372559071, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 12, ix: 5 }, lc: 2, lj: 2, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "tr", p: { a: 0, k: [46.139, -101.234], ix: 2 }, a: { a: 0, k: [71.688, -101.703], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: -45, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }],
                                nm: "Shape 2",
                                np: 4,
                                cix: 2,
                                ix: 1,
                                mn: "ADBE Vector Group",
                                hd: !1
                            }, { ty: "gr", it: [{ ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 2, ix: 5 }, lc: 1, lj: 1, ml: 4, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 0, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Shape 1", np: 2, cix: 2, ix: 2, mn: "ADBE Vector Group", hd: !1 }],
                            ip: 0,
                            op: 720,
                            st: 0,
                            bm: 0
                        }, {
                            ddd: 0,
                            ind: 3,
                            ty: 4,
                            nm: "Shape Layer 7",
                            sr: 1,
                            ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [71.5, 226, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } },
                            ao: 0,
                            shapes: [{
                                ty: "gr",
                                it: [{
                                    ind: 0,
                                    ty: "sh",
                                    ix: 1,
                                    ks: {
                                        a: 0,
                                        k: {
                                            i: [
                                                [0, 0],
                                                [0, 0]
                                            ],
                                            o: [
                                                [0, 0],
                                                [0, 0]
                                            ],
                                            v: [
                                                [105.25, -67.5],
                                                [78.672, -67.5]
                                            ],
                                            c: !1
                                        },
                                        ix: 2
                                    },
                                    nm: "Path 1",
                                    mn: "ADBE Vector Shape - Group",
                                    hd: !1
                                }, { ty: "st", c: { a: 0, k: [.227450981736, .670588254929, .831372559071, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 12, ix: 5 }, lc: 2, lj: 2, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "tr", p: { a: 0, k: [46.139, -101.234], ix: 2 }, a: { a: 0, k: [71.688, -101.703], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: -45, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }],
                                nm: "Shape 2",
                                np: 3,
                                cix: 2,
                                ix: 1,
                                mn: "ADBE Vector Group",
                                hd: !1
                            }, { ty: "gr", it: [{ ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 2, ix: 5 }, lc: 1, lj: 1, ml: 4, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 0, 0, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Shape 1", np: 2, cix: 2, ix: 2, mn: "ADBE Vector Group", hd: !1 }, { ty: "tm", s: { a: 0, k: 0, ix: 1 }, e: { a: 1, k: [{ i: { x: [.667], y: [1] }, o: { x: [.167], y: [.167] }, n: ["0p667_1_0p167_0p167"], t: 13, s: [0], e: [100] }, { t: 18 }], ix: 2 }, o: { a: 0, k: 0, ix: 3 }, m: 1, ix: 3, nm: "Trim Paths 1", mn: "ADBE Vector Filter - Trim", hd: !1 }],
                            ip: 0,
                            op: 720,
                            st: 0,
                            bm: 0
                        }, { ddd: 0, ind: 4, ty: 4, nm: "Shape Layer 4", sr: 1, ks: { o: { a: 1, k: [{ i: { x: [.833], y: [.833] }, o: { x: [.167], y: [.167] }, n: ["0p833_0p833_0p167_0p167"], t: 8, s: [0], e: [100] }, { t: 9 }], ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [100, 125, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ d: 1, ty: "el", s: { a: 0, k: [8.094, 8.094], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, nm: "Ellipse Path 1", mn: "ADBE Vector Shape - Ellipse", hd: !1 }, { ty: "fl", c: { a: 0, k: [.227450981736, .670588254929, .831372559071, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-3.931, -.32], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [174.761, 174.761], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Ellipse 1", np: 3, cix: 2, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 720, st: 0, bm: 0 }, { ddd: 0, ind: 5, ty: 4, nm: "Shape Layer 3", sr: 1, ks: { o: { a: 1, k: [{ i: { x: [.833], y: [.833] }, o: { x: [.167], y: [.167] }, n: ["0p833_0p833_0p167_0p167"], t: 11, s: [0], e: [100] }, { t: 12 }], ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [128.5, 125, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ d: 1, ty: "el", s: { a: 0, k: [8.094, 8.094], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, nm: "Ellipse Path 1", mn: "ADBE Vector Shape - Ellipse", hd: !1 }, { ty: "fl", c: { a: 0, k: [.227450981736, .670588254929, .831372559071, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [-3.931, -.32], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [174.761, 174.761], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Ellipse 1", np: 3, cix: 2, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 720, st: 0, bm: 0 }, { ddd: 0, ind: 6, ty: 4, nm: "Shape Layer 6", sr: 1, ks: { o: { a: 0, k: 100, ix: 11 }, r: { a: 0, k: 0, ix: 10 }, p: { a: 0, k: [125, 125, 0], ix: 2 }, a: { a: 0, k: [0, 0, 0], ix: 1 }, s: { a: 0, k: [100, 100, 100], ix: 6 } }, ao: 0, shapes: [{ ty: "gr", it: [{ ty: "rc", d: 1, s: { a: 0, k: [420.492, 342.02], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, r: { a: 0, k: 0, ix: 4 }, nm: "Rectangle Path 1", mn: "ADBE Vector Shape - Rect", hd: !1 }, { ty: "st", c: { a: 0, k: [1, 1, 1, 1], ix: 3 }, o: { a: 0, k: 100, ix: 4 }, w: { a: 0, k: 2, ix: 5 }, lc: 1, lj: 1, ml: 4, nm: "Stroke 1", mn: "ADBE Vector Graphic - Stroke", hd: !1 }, { ty: "fl", c: { a: 0, k: [1, 1, 1, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: !1 }, { ty: "tr", p: { a: 0, k: [27.246, 20.01], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }], nm: "Rectangle 1", np: 3, cix: 2, ix: 1, mn: "ADBE Vector Group", hd: !1 }], ip: 0, op: 720, st: 0, bm: 0 }],
                        markers: []
                    }
                }, a.prototype.updateDistributions = function() { this._arrRight = null, this._arrWrong = null, this.cycled_right = new e(this.arrRight.length), this.cycled_wrong = new e(this.arrWrong.length) }, a.prototype.redefineCongratLocale = function(e, t) { for (var n in this._arrRight = null, this._arrWrong = null, e) this.__translation["_" + t][n] = e[n].map(function(e) { return e.audio && (a.audio[e.text] = e.audio), e.text }) }, a.prototype.__translation = { _arrRight: { ru: ["\u041c\u043e\u043b\u043e\u0434\u0435\u0446!", "\u041e\u0442\u043b\u0438\u0447\u043d\u043e!", "\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u043e!", "\u041f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u043d\u043e!", "\u0428\u0438\u043a\u0430\u0440\u043d\u043e!", "\u0421\u0443\u043f\u0435\u0440!", "\u0418\u0434\u0435\u0430\u043b\u044c\u043d\u043e!", "\u0411\u043b\u0438\u0441\u0442\u0430\u0442\u0435\u043b\u044c\u043d\u043e!", "\u0411\u0435\u0437\u0443\u043f\u0440\u0435\u0447\u043d\u043e!", "\u041f\u043e\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u043e!", "\u041d\u0443 \u0442\u044b \u0434\u0430\u0451\u0448\u044c!", "\u0422\u0430\u043a \u0434\u0435\u0440\u0436\u0430\u0442\u044c!", "\u0423\u0441\u043f\u0435\u0445!", "\u0421\u0438\u043b\u044c\u043d\u043e!", "\u0414\u0430\u0439 \u043f\u044f\u0442\u044c!"], ua: ["\u0412\u0456\u0434\u043c\u0456\u043d\u043d\u043e!", "\u0427\u0443\u0434\u043e\u0432\u043e!", "\u0412\u0440\u0430\u0436\u0430\u044e\u0447\u0435!", "\u041f\u0440\u0435\u043a\u0440\u0430\u0441\u043d\u043e!", "\u0422\u043e\u0431\u0456 \u0432\u0434\u0430\u043b\u043e\u0441\u044f!"], en: ["Superb!", "Outstanding!", "Fantastic!", "You rock!", "Awesome!", "Splendid!", "Smashing!", "Tremendous!", "Terrific!", "Nice one!", "You did it!", "Way to go!"], es: ["Great!", "Excellent!", "Perfect!"], ch: ["\u975e\u5e38\u597d", "\u597d\u6781\u4e86", "\u771f\u68d2", "\u4f60\u505a\u5bf9\u5566"], ind: ["Sempurna!", "Cemerlang!", "Menakjubkan!", "Hebat!", "Kamu berhasil!"], pt: ["\xd3timo!", "Maravilhoso!", "Incr\xedvel!", "Super!", "Voc\xea completou a tarefa!"], hi: ["Great!", "Excellent!", "Perfect!"], vi: ["Xu\u1ea5t s\u1eafc!", "Tuy\u1ec7t v\u1eddi!", "Tuy\u1ec7t!", "T\u1ed1t!", "B\u1ea1n \u0111\xe3 l\xe0m \u0111\u01b0\u1ee3c!"], tn: ["Great!", "Excellent!", "Perfect!"], zu: ["Great!", "Excellent!", "Perfect!"], "default": ["\u041c\u043e\u043b\u043e\u0434\u0435\u0446!", "\u041e\u0442\u043b\u0438\u0447\u043d\u043e!", "\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u043e!", "\u041f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u043d\u043e!", "\u0428\u0438\u043a\u0430\u0440\u043d\u043e!", "\u0421\u0443\u043f\u0435\u0440!", "\u0418\u0434\u0435\u0430\u043b\u044c\u043d\u043e!", "\u0411\u043b\u0438\u0441\u0442\u0430\u0442\u0435\u043b\u044c\u043d\u043e!", "\u0411\u0435\u0437\u0443\u043f\u0440\u0435\u0447\u043d\u043e!", "\u041f\u043e\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u043e!", "\u041d\u0443 \u0442\u044b \u0434\u0430\u0451\u0448\u044c!", "\u0422\u0430\u043a \u0434\u0435\u0440\u0436\u0430\u0442\u044c!", "\u0423\u0441\u043f\u0435\u0445!", "\u0421\u0438\u043b\u044c\u043d\u043e!", "\u0414\u0430\u0439 \u043f\u044f\u0442\u044c!"] }, _arrWrong: { ru: ["\u0425\u043e\u0440\u043e\u0448\u043e!", "\u041a\u043b\u0430\u0441\u0441!", "\u041f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c!", "\u0421\u0434\u0435\u043b\u0430\u043d\u043e!", "\u041a\u043b\u0430\u0441\u0441\u043d\u043e!", "\u041b\u043e\u0433\u0438\u0447\u043d\u043e!", "\u041f\u0440\u043e\u0439\u0434\u0435\u043d\u043e!", "\u041d\u0435\u043f\u043b\u043e\u0445\u043e!"], ua: ["\u041d\u0435\u043f\u043e\u0433\u0430\u043d\u043e!", "\u041c\u043e\u043b\u043e\u0434\u0435\u0446\u044c!", "\u0414\u043e\u0431\u0440\u0435!", "\u0423\u0440\u0430!"], en: ["Keep on trying!", "Nice going!", "Keep it up!", "Nice try!", "Well done!"], es: ["Good!", "Well done!"], ch: ["\u4e0d\u9519\uff01\u7ee7\u7eed\u52aa\u529b", "\u771f\u68d2\uff01\u52a0\u6cb9", "\u633a\u597d\u7684"], ind: ["Sama sekali tidak buruk!", "Pintar!", "Baik sekali!", "Hore!"], pt: ["Bom!", "Sensacional!", "Muito bom!", "Viva!"], hi: ["Good!", "Well done!"], vi: ["T\u1ed1t!", "Gi\u1ecfi!", "R\u1ea5t t\u1ed1t!", "Hoan h\xf4!"], tn: ["Good!", "Well done!"], zu: ["Good!", "Well done!"], "default": ["\u0425\u043e\u0440\u043e\u0448\u043e!", "\u041a\u043b\u0430\u0441\u0441!", "\u041f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c!", "\u0421\u0434\u0435\u043b\u0430\u043d\u043e!", "\u041a\u043b\u0430\u0441\u0441\u043d\u043e!", "\u041b\u043e\u0433\u0438\u0447\u043d\u043e!", "\u041f\u0440\u043e\u0439\u0434\u0435\u043d\u043e!", "\u041d\u0435\u043f\u043b\u043e\u0445\u043e!"] } }, Object.defineProperties(a.prototype, { locale: { get: function() { return null == this._locale && (this._locale = a.defaultLocale), this._locale }, set: function(e) { return this._locale !== e && (this._locale = e, this.updateDistributions()), this._locale } }, arrRight: { get: function() { return null == this._arrRight && (this._arrRight = (this.__translation._arrRight[this.locale] || this.__translation._arrRight["default"]).slice()), this._arrRight } }, arrWrong: { get: function() { return null == this._arrWrong && (this._arrWrong = (this.__translation._arrWrong[this.locale] || this.__translation._arrWrong["default"]).slice()), this._arrWrong } } }), a
            }(), e = function() {
                function e(e) {
                    var n;
                    this.count = e, this.buffer = function() { n = []; for (var e = 0, t = this.count; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.index = 0
                }
                return e.prototype.getNext = function() { var e; return e = this.buffer[this.index], this.index = (this.index + 1) % this.buffer.length, e }, e
            }()
        }()
    }.call(this),
    function() {
        this.BeadsProgressDrawer = function() {
            function e(e, t, n, r) { this.interbeads_congrat_no_text = r.interbeads_congrat_no_text, this.place = e, this.progress_wrapper = t, this.congrat_path = n, $(".uchiru_head").addClass("with_progress"), this.progress = $("<div>").addClass("inner_progress").appendTo(this.progress_wrapper), this.without_interbeads_congrat || ("v1" == r.interbeads_congrat ? this.ibc = new InterbeadsCongratDrawer(this.place) : this.ibc = new InterbeadsCongratDrawerV2(this.place)) }
            return e.prototype.BEAD = 24, e.prototype.PROGRESS = 464, e.prototype.BEAD_OFFSET = 4, e.prototype.on_beads = function(e, t) {
                switch (console.log("#on_beads", e, t), e) {
                    case "lesson_start":
                        return this._on_lesson_start(t);
                    case "__interbeads_congrat":
                        return this._on_interbeads_congrat(t);
                    case "exercise_finish_succ":
                    case "exercise_finish_force_succ":
                        return this._on_exercise_finish_succ(t);
                    case "bead_move_left":
                        return this._on_bead_move_left(t);
                    case "lesson_finish":
                        return this._on_lesson_finish();
                    case "terminated":
                        return this._on_terminated()
                }
            }, e.prototype._on_lesson_start = function(e) { var t, n, r, s, i; for (i = [], n = r = 0, s = e.total; 0 <= s ? r < s : s < r; n = 0 <= s ? ++r : --r) t = $("<i>").addClass("az_ball_" + n).attr("id", "bead" + n).appendTo(this.progress), n > e.total - e.amount - 1 ? i.push(t.css("left", this.PROGRESS - this.BEAD * (e.total - n))) : i.push(t.css("left", this.BEAD * n + this.BEAD_OFFSET)); return i }, e.prototype._on_exercise_finish_succ = function(e) { return this.progress.find("#bead" + (e.total - e.amount)).css("left", this.PROGRESS - this.BEAD * e.amount) }, e.prototype._on_bead_move_left = function(e) { var t; return t = e.total - e.amount - 1, this.progress.find("#bead" + t).css("left", this.BEAD * t + this.BEAD_OFFSET) }, e.prototype._on_interbeads_congrat = function(e) {
                var t = e.current_exercise_solved,
                    n = e.chunk_idx,
                    r = e.interbeads_congrat,
                    s = e.interbeads_congrat_sound,
                    i = e.interbeads_congrat_locale,
                    o = e.chunk_end,
                    a = e.cb;
                return _ASSERT(null != t), _ASSERT(null != n), this.without_interbeads_congrat ? a() : this.ibc.run({ interbeads_congrat_no_text: this.interbeads_congrat_no_text, is_solved: t, chunk_idx: n, interbeads_congrat: r, interbeads_congrat_sound: s, interbeads_congrat_locale: i, chunk_end: o, cb: a })
            }, e.prototype._on_lesson_finish = function() { return this._transition_to_congrat() }, e.prototype._transition_to_congrat = function() { return window.location = this.congrat_path }, e.prototype._on_terminated = function() { return $("body").append($.div().attr("style", "position:absolute;z-index:100;left:0;top:0;width:" + $(document).width() + "px;height:" + $(document).height() + "px").append($.div().attr("style", "position:absolute;left:0;top:0;width:100%;height:100%;background:white;opacity:0.9;z-index:1")).append($.div().attr("style", "position:absolute;left:0;top:0;width:100%;height:100%;z-index:2").append($.div().attr("style", "margin:202px auto 0;width:600px;border:2px solid red;text-align:center;background-color:white;font-size:150%;padding:30px;").html("<a href='' style='text-decoration:underline'>" + I18n.js_common_beads_progress_drawer_on_terminated + "</a>")))) }, e
        }()
    }.call(this),
    function() {
        var _ = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        this.KeypadIWB2Hacker = function() {
            function e(e, t, n) { this.keypad_manager = e, null == n && (n = {}), this.browser_mobile = is_browser_mobile(), this.creator(t, { interactive_whiteboard_2: n.interactive_whiteboard_2 }) }
            return e.prototype._keypad_manager_started_and_not_paused = function() { return this.keypad_manager._keypad_started && !this.keypad_manager._keypad_paused }, e.prototype._keypad_manager_roles = function() { return this.keypad_manager._roles }, e.prototype._keypad_manager_chars_for_role = function(e) { return this.keypad_manager.__chars[e] }, e.prototype._keypad_manager_callback = function(e) { var t; return "function" == typeof(t = this.keypad_manager)._keypad_callback ? t._keypad_callback(e) : void 0 }, e.prototype.hack = function() { var t; if (!this.browser_mobile) return this.keypad_start((t = this, function(e) { return t._keypad_manager_callback(e) })) }, e.prototype.destroy = function() { if (!this.browser_mobile) return this.keypad_finish() }, e.prototype.creator = function(e, t) { var n, r; return null == t && (t = {}), this.parent = e, this.options = t, this._keypad_callback = null, this._keypad_started = !1, this._keypad_iwb_2_position = (null != (n = this.options.interactive_whiteboard_2) ? n.position : void 0) || "right", this._keypad_iwb_2_state = (null != (r = this.options.interactive_whiteboard_2) ? r.state : void 0) || "hide", this._keypad = null }, e.prototype.keypad_start = function(e) { var t, n, r, s, i, o, a, c, u, _, l, d, p; return _ASSERT(!this._keypad_started, "keypad_start() should be called only once"), this._keypad_callback = e, this.options.interactive_whiteboard_2 && (o = ["numeric", "operation", "input"], $("body").addClass("keypaded"), this._keypad = $.div().appendTo(this.parent), r = this.options.interactive_whiteboard_2.on_position_changed || function() {}, s = this.options.interactive_whiteboard_2.on_state_changed || function() {}, i = this._keypad_iwb_2_position, u = this._keypad_iwb_2_state, _ASSERT("left" === i || "right" === i), _ASSERT("show" === u || "hide" === u), $.div().addClass("keypad_buttons_holder").appendTo(this._keypad), this._keypad.addClass("keypad-iwb-2-hacker"), t = $.div().addClass("keypad-move").html("&nbsp;").appendTo(this._keypad), p = this, a = function(e) { return p._keypad.toggleClass("keypad-iwb-2-hacker-right", "right" === e), p._keypad_iwb_2_position = e, r(e) }, t.click((d = this, function() { return "right" === d._keypad_iwb_2_position ? a("left") : a("right"), !1 })), a(i), n = $.div().addClass("keypad-showhide").html("").appendTo(this._keypad), l = this, c = function(e) { return "hide" === e ? (l._keypad.addClass("keypad-iwb-2-hacker-hide"), n.html(I18n.js_common_keypad_iwb_2_hacker_show)) : (l._keypad.removeClass("keypad-iwb-2-hacker-hide"), n.html(I18n.js_common_keypad_iwb_2_hacker_hide)), l._keypad_iwb_2_state = e, s(e) }, n.click((_ = this, function() { return "hide" === _._keypad_iwb_2_state ? c("show") : c("hide"), !1 })), c(u), this._fill_keypad(this._keypad, o)), this._keypad_started = !0 }, e.prototype.keypad_finish = function() { return _ASSERT(this._keypad_started, "Call keypad_finish() only after keypad_start()"), this.options.interactive_whiteboard_2 && ($("body").removeClass("keypaded"), this._keypad.remove(), this._keypad = null), this._keypad_callback = null, this._keypad_started = !1 }, e.prototype._fill_keypad = function(s, e) {
                var i, o, a, c, u, t, n, r;
                for (c = this, r = [], t = 0, n = e.length; t < n; t++) a = e[t], r.push(function() {
                    var e, t, n, r;
                    for (r = [], e = 0, t = (n = this.__chars[a]).length; e < t; e++) {
                        switch (o = n[e], i = $.div().addClass("keypad_button").data("char", o).appendTo(s.find(".keypad_buttons_holder")), !0) {
                            case "backspace" === o:
                                i.html("&nbsp;"), i.addClass("keypad_button_" + o);
                                break;
                            case "enter" === o:
                                i.html("OK"), i.addClass("keypad_button_" + o);
                                break;
                            case 0 <= _.call(this.__chars.numeric, o):
                                i.html(o), i.addClass("keypad_button_" + o);
                                break;
                            case 0 <= _.call(this.__chars.operation, o):
                                i.html("&nbsp;"), u = { "+": "plus", "-": "minus", "*": "multiply", "/": "divide" }[o], _ASSERT(null != u, "wrong operation: " + o), i.addClass("keypad_button_" + u);
                                break;
                            default:
                                i.html(o)
                        }
                        r.push(i.bind("click", function() { return c._on_keypadclick($(this).data("char")) }))
                    }
                    return r
                }.call(this));
                return r
            }, e.prototype._on_char = function(e) { if (null != this._keypad_callback) return this._keypad_callback(e) }, e.prototype.__chars = { numeric: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], compare: ["<", "=", ">"], operation: ["+", "-", "*", "/"], input: ["backspace", "enter"], arrows: [], button: [] }, e.prototype._on_keypadclick = function(e) {
                var t, n, r, s;
                if (this._keypad_manager_started_and_not_paused())
                    for (n = 0, r = (s = this._keypad_manager_roles()).length; n < r; n++)
                        if (t = s[n], -1 !== this._keypad_manager_chars_for_role(t).indexOf(e)) return void this._on_char(e)
            }, e
        }()
    }.call(this),
    function() {
        this.UchiruAudioManager = function() {
            function e() { this._config = null, this._audioManager = new e.AudioManager({ locale: I18n.locale, onEvent: function(e, t) { if ("missed_audio_constant" === e) return console.log("[UchiruAudioManager] __missed_audio_constant", _.extend({}, t)) } }) }
            return e._instance = null, e.prototype.play = function(e, t) { return this._audioManager.play(e, t) }, e.prototype.sound = function(e, t) { return this._audioManager.sound(e, t) }, e.prototype.unload = function() { return this._audioManager.unload() }, Object.defineProperties(e, { instance: { get: function() { return null == this._instance && (this._instance = new e), this._instance } } }), Object.defineProperties(e, { Howler: { get: function() { return null == this._Howler && (this._Howler = e.Howler2_0_3), this._Howler }, set: function(e) { return this._Howler !== e && (this._Howler = e), this._Howler } } }), Object.defineProperties(e.prototype, { config: { get: function() { return this._config }, set: function(e) { return this._config !== e && (this._config = e), this._config } } }), e
        }()
    }.call(this),
    function() {
        var n = this.UchiruAudioManager;
        n.Howler2_0_3 = {},
            function() {
                "use strict";
                var m = setTimeoutOrig || m,
                    e = function() { this.init() };
                e.prototype = {
                    init: function() { var e = this || y; return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e },
                    volume: function(e) {
                        var t = this || y;
                        if (e = parseFloat(e), t.ctx || l(), void 0 !== e && 0 <= e && e <= 1) {
                            if (t._volume = e, t._muted) return t;
                            t.usingWebAudio && t.masterGain.gain.setValueAtTime(e, y.ctx.currentTime);
                            for (var n = 0; n < t._howls.length; n++)
                                if (!t._howls[n]._webAudio)
                                    for (var r = t._howls[n]._getSoundIds(), s = 0; s < r.length; s++) {
                                        var i = t._howls[n]._soundById(r[s]);
                                        i && i._node && (i._node.volume = i._volume * e)
                                    }
                            return t
                        }
                        return t._volume
                    },
                    mute: function(e) {
                        var t = this || y;
                        t.ctx || l(), t._muted = e, t.usingWebAudio && t.masterGain.gain.setValueAtTime(e ? 0 : t._volume, y.ctx.currentTime);
                        for (var n = 0; n < t._howls.length; n++)
                            if (!t._howls[n]._webAudio)
                                for (var r = t._howls[n]._getSoundIds(), s = 0; s < r.length; s++) {
                                    var i = t._howls[n]._soundById(r[s]);
                                    i && i._node && (i._node.muted = !!e || i._muted)
                                }
                        return t
                    },
                    unload: function() { for (var e = this || y, t = e._howls.length - 1; 0 <= t; t--) e._howls[t].unload(); return e.usingWebAudio && e.ctx && "undefined" != typeof e.ctx.close && (e.ctx.close(), e.ctx = null, l()), e },
                    codecs: function(e) { return (this || y)._codecs[e.replace(/^x-/, "")] },
                    _setup: function() {
                        var e = this || y;
                        if (e.state = e.ctx && e.ctx.state || "running", e._autoSuspend(), !e.usingWebAudio)
                            if ("undefined" != typeof Audio) try { "undefined" == typeof(new Audio).oncanplaythrough && (e._canPlayEvent = "canplay") } catch (t) { e.noAudio = !0 } else e.noAudio = !0;
                        try {
                            (new Audio).muted && (e.noAudio = !0)
                        } catch (t) {}
                        return e.noAudio || e._setupCodecs(), e
                    },
                    _setupCodecs: function() {
                        var e = this || y,
                            t = null;
                        try { t = "undefined" != typeof Audio ? new Audio : null } catch (i) { return e }
                        if (!t || "function" != typeof t.canPlayType) return e;
                        var n = t.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                            r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                            s = r && parseInt(r[0].split("/")[1], 10) < 33;
                        return e._codecs = { mp3: !(s || !n && !t.canPlayType("audio/mp3;").replace(/^no$/, "")), mpeg: !!n, opus: !!t.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""), ogg: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), oga: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), wav: !!t.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), aac: !!t.canPlayType("audio/aac;").replace(/^no$/, ""), caf: !!t.canPlayType("audio/x-caf;").replace(/^no$/, ""), m4a: !!(t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), mp4: !!(t.canPlayType("audio/x-mp4;") || t.canPlayType("audio/mp4;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), weba: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), webm: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), dolby: !!t.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""), flac: !!(t.canPlayType("audio/x-flac;") || t.canPlayType("audio/flac;")).replace(/^no$/, "") }, e
                    },
                    _enableMobileAudio: function() {
                        var t = this || y,
                            e = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(t._navigator && t._navigator.userAgent),
                            n = !!("ontouchend" in window || t._navigator && 0 < t._navigator.maxTouchPoints || t._navigator && 0 < t._navigator.msMaxTouchPoints);
                        if (!t._mobileEnabled && t.ctx && (e || n)) {
                            t._mobileEnabled = !1, t._mobileUnloaded || 44100 === t.ctx.sampleRate || (t._mobileUnloaded = !0, t.unload()), t._scratchBuffer = t.ctx.createBuffer(1, 1, 22050);
                            var r = function() {
                                y._autoResume();
                                var e = t.ctx.createBufferSource();
                                e.buffer = t._scratchBuffer, e.connect(t.ctx.destination), "undefined" == typeof e.start ? e.noteOn(0) : e.start(0), "function" == typeof t.ctx.resume && t.ctx.resume(), e.onended = function() { e.disconnect(0), t._mobileEnabled = !0, t.mobileAutoEnable = !1, document.removeEventListener("touchstart", r, !0), document.removeEventListener("touchend", r, !0) }
                            };
                            return document.addEventListener("touchstart", r, !0), document.addEventListener("touchend", r, !0), t
                        }
                    },
                    _autoSuspend: function() {
                        var e = this;
                        if (e.autoSuspend && e.ctx && "undefined" != typeof e.ctx.suspend && y.usingWebAudio) {
                            for (var t = 0; t < e._howls.length; t++)
                                if (e._howls[t]._webAudio)
                                    for (var n = 0; n < e._howls[t]._sounds.length; n++)
                                        if (!e._howls[t]._sounds[n]._paused) return e;
                            return e._suspendTimer && (clearTimeout(e._suspendTimer), clearTimeout(e._notPlayedTimer)), e._suspendTimer = m(function() { e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function() { e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume()) })) }, 3e4), e
                        }
                    },
                    _autoResume: function() { var t = this; if (t.ctx && "undefined" != typeof t.ctx.resume && y.usingWebAudio) return "running" === t.state && t._suspendTimer ? (clearTimeout(t._suspendTimer), clearTimeout(t._notPlayedTimer), t._suspendTimer = null, t._notPlayedTimer = null) : "suspended" === t.state ? (t.ctx.resume().then(function() { t.state = "running"; for (var e = 0; e < t._howls.length; e++) t._howls[e]._emit("resume") }), t._suspendTimer && (clearTimeout(t._suspendTimer), clearTimeout(t._notPlayedTimer), t._suspendTimer = null, t._notPlayedTimer = null)) : "suspending" === t.state && (t._resumeAfterSuspend = !0), t }
                };
                var y = new e,
                    t = function(e) {
                        var t = this;
                        e.src && 0 !== e.src.length ? t.init(e) : console.error("An array of source files must be passed with any new Howl.")
                    };
                t.prototype = {
                    init: function(e) { var t = this; return y.ctx || l(), t._autoplay = e.autoplay || !1, t._format = "string" != typeof e.format ? e.format : [e.format], t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = "boolean" != typeof e.preload || e.preload, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = "string" != typeof e.src ? e.src : [e.src], t._volume = e.volume !== undefined ? e.volume : 1, t._xhrWithCredentials = e.xhrWithCredentials || !1, t._duration = 0, t._state = "unloaded", t._sounds = [], t._endTimers = {}, t._queue = [], t._playLock = !1, t._onend = e.onend ? [{ fn: e.onend }] : [], t._onfade = e.onfade ? [{ fn: e.onfade }] : [], t._onload = e.onload ? [{ fn: e.onload }] : [], t._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : [], t._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : [], t._onpause = e.onpause ? [{ fn: e.onpause }] : [], t._onplay = e.onplay ? [{ fn: e.onplay }] : [], t._onstop = e.onstop ? [{ fn: e.onstop }] : [], t._onmute = e.onmute ? [{ fn: e.onmute }] : [], t._onvolume = e.onvolume ? [{ fn: e.onvolume }] : [], t._onrate = e.onrate ? [{ fn: e.onrate }] : [], t._onseek = e.onseek ? [{ fn: e.onseek }] : [], t._onresume = [], t._webAudio = y.usingWebAudio && !t._html5, "undefined" != typeof y.ctx && y.ctx && y.mobileAutoEnable && y._enableMobileAudio(), y._howls.push(t), t._autoplay && t._queue.push({ event: "play", action: function() { t.play() } }), t._preload && t.load(), t },
                    load: function() {
                        var e = this,
                            t = null;
                        if (y.noAudio) e._emit("loaderror", null, "No audio support.");
                        else {
                            "string" == typeof e._src && (e._src = [e._src]);
                            for (var n = 0; n < e._src.length; n++) {
                                var r, s;
                                if (e._format && e._format[n]) r = e._format[n];
                                else { if ("string" != typeof(s = e._src[n])) { e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring."); continue }(r = /^data:audio\/([^;,]+);/i.exec(s)) || (r = /\.([^.]+)$/.exec(s.split("?", 1)[0])), r && (r = r[1].toLowerCase()) }
                                if (r || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), r && y.codecs(r)) { t = e._src[n]; break }
                            }
                            if (t) return e._src = t, e._state = "loading", "https:" === window.location.protocol && "http:" === t.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new i(e), e._webAudio && a(e), e;
                            e._emit("loaderror", null, "No codec support for selected audio sources.")
                        }
                    },
                    play: function(r, s) {
                        var i = this,
                            e = null;
                        if ("number" == typeof r) e = r, r = null;
                        else {
                            if ("string" == typeof r && "loaded" === i._state && !i._sprite[r]) return null;
                            if (void 0 === r) {
                                r = "__default";
                                for (var t = 0, n = 0; n < i._sounds.length; n++) i._sounds[n]._paused && !i._sounds[n]._ended && (t++, e = i._sounds[n]._id);
                                1 === t ? r = null : e = null
                            }
                        }
                        var o = e ? i._soundById(e) : i._inactiveSound();
                        if (!o) return null;
                        if (e && !r && (r = o._sprite || "__default"), "loaded" !== i._state) { o._sprite = r, o._ended = !1; var a = o._id; return i._queue.push({ event: "play", action: function() { i.play(a) } }), a }
                        if (e && !o._paused) return s || i._loadQueue("play"), o._id;
                        i._webAudio && y._autoResume();
                        var c = Math.max(0, 0 < o._seek ? o._seek : i._sprite[r][0] / 1e3),
                            u = Math.max(0, (i._sprite[r][0] + i._sprite[r][1]) / 1e3 - c),
                            _ = 1e3 * u / Math.abs(o._rate);
                        o._paused = !1, o._ended = !1, o._sprite = r, o._seek = c, o._start = i._sprite[r][0] / 1e3, o._stop = (i._sprite[r][0] + i._sprite[r][1]) / 1e3, o._loop = !(!o._loop && !i._sprite[r][2]);
                        var l = o._node;
                        if (i._webAudio) {
                            var d = function() {
                                i._refreshBuffer(o);
                                var e = o._muted || i._muted ? 0 : o._volume;
                                l.gain.setValueAtTime(e, y.ctx.currentTime), o._playStart = y.ctx.currentTime, "undefined" == typeof l.bufferSource.start ? o._loop ? l.bufferSource.noteGrainOn(0, c, 86400) : l.bufferSource.noteGrainOn(0, c, u) : o._loop ? l.bufferSource.start(0, c, 86400) : l.bufferSource.start(0, c, u), _ !== Infinity && (i._endTimers[o._id] = m(i._ended.bind(i, o), _)), s || m(function() { i._emit("play", o._id) }, 0)
                            };
                            "running" === y.state ? d() : (i._notPlayedTimer = m(function() { "suspended" !== y.state || o._paused || o._ended || (i.off("resume", d), i._emit("playerror", o._id, "Playback was unable to start.")) }, 100), i.once("resume", d), i._clearTimer(o._id))
                        } else {
                            var p = function() {
                                    l.currentTime = c, l.muted = o._muted || i._muted || y._muted || l.muted, l.volume = o._volume * y.volume(), l.playbackRate = o._rate;
                                    try {
                                        var e = l.play();
                                        if ("undefined" != typeof Promise && e instanceof Promise) {
                                            i._playLock = !0;
                                            var t = function() { i._playLock = !1, s || i._emit("play", o._id) };
                                            e.then(t, t)
                                        } else s || i._emit("play", o._id);
                                        if (l.playbackRate = o._rate, l.paused) return void i._emit("playerror", o._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");
                                        "__default" !== r || o._loop ? i._endTimers[o._id] = m(i._ended.bind(i, o), _) : (i._endTimers[o._id] = function() { i._ended(o), l.removeEventListener("ended", i._endTimers[o._id], !1) }, l.addEventListener("ended", i._endTimers[o._id], !1))
                                    } catch (n) { i._emit("playerror", o._id, n) }
                                },
                                h = window && window.ejecta || !l.readyState && y._navigator.isCocoonJS;
                            if (3 <= l.readyState || h) p();
                            else {
                                var f = function() { p(), l.removeEventListener(y._canPlayEvent, f, !1) };
                                l.addEventListener(y._canPlayEvent, f, !1), i._clearTimer(o._id)
                            }
                        }
                        return o._id
                    },
                    pause: function(e, t) {
                        var n = this;
                        if ("loaded" !== n._state || n._playLock) return n._queue.push({ event: "pause", action: function() { n.pause(e) } }), n;
                        for (var r = n._getSoundIds(e), s = 0; s < r.length; s++) {
                            n._clearTimer(r[s]);
                            var i = n._soundById(r[s]);
                            if (i && !i._paused && (i._seek = n.seek(r[s]), i._rateSeek = 0, i._paused = !0, n._stopFade(r[s]), i._node))
                                if (n._webAudio) { if (!i._node.bufferSource) continue; "undefined" == typeof i._node.bufferSource.stop ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0), n._cleanBuffer(i._node) } else isNaN(i._node.duration) && i._node.duration !== Infinity || i._node.pause();
                            t || n._emit("pause", i ? i._id : null)
                        }
                        return n
                    },
                    stop: function(e, t) {
                        var n = this;
                        if ("loaded" !== n._state) return n._queue.push({ event: "stop", action: function() { n.stop(e) } }), n;
                        for (var r = n._getSoundIds(e), s = 0; s < r.length; s++) {
                            n._clearTimer(r[s]);
                            var i = n._soundById(r[s]);
                            i && (i._seek = i._start || 0, i._rateSeek = 0, i._paused = !0, i._ended = !0, n._stopFade(r[s]), i._node && (n._webAudio ? i._node.bufferSource && ("undefined" == typeof i._node.bufferSource.stop ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0), n._cleanBuffer(i._node)) : isNaN(i._node.duration) && i._node.duration !== Infinity || (i._node.currentTime = i._start || 0, i._node.pause())), t || n._emit("stop", i._id))
                        }
                        return n
                    },
                    mute: function(e, t) {
                        var n = this;
                        if ("loaded" !== n._state) return n._queue.push({ event: "mute", action: function() { n.mute(e, t) } }), n;
                        if (void 0 === t) {
                            if ("boolean" != typeof e) return n._muted;
                            n._muted = e
                        }
                        for (var r = n._getSoundIds(t), s = 0; s < r.length; s++) {
                            var i = n._soundById(r[s]);
                            i && (i._muted = e, i._interval && n._stopFade(i._id),
                                n._webAudio && i._node ? i._node.gain.setValueAtTime(e ? 0 : i._volume, y.ctx.currentTime) : i._node && (i._node.muted = !!y._muted || e), n._emit("mute", i._id))
                        }
                        return n
                    },
                    volume: function() {
                        var e, t, n, r = this,
                            s = arguments;
                        if (0 === s.length) return r._volume;
                        if (1 === s.length || 2 === s.length && "undefined" == typeof s[1] ? 0 <= r._getSoundIds().indexOf(s[0]) ? t = parseInt(s[0], 10) : e = parseFloat(s[0]) : 2 <= s.length && (e = parseFloat(s[0]), t = parseInt(s[1], 10)), !(void 0 !== e && 0 <= e && e <= 1)) return (n = t ? r._soundById(t) : r._sounds[0]) ? n._volume : 0;
                        if ("loaded" !== r._state) return r._queue.push({ event: "volume", action: function() { r.volume.apply(r, s) } }), r;
                        void 0 === t && (r._volume = e), t = r._getSoundIds(t);
                        for (var i = 0; i < t.length; i++)(n = r._soundById(t[i])) && (n._volume = e, s[2] || r._stopFade(t[i]), r._webAudio && n._node && !n._muted ? n._node.gain.setValueAtTime(e, y.ctx.currentTime) : n._node && !n._muted && (n._node.volume = e * y.volume()), r._emit("volume", n._id));
                        return r
                    },
                    fade: function(e, t, n, r) {
                        var s = this;
                        if ("loaded" !== s._state) return s._queue.push({ event: "fade", action: function() { s.fade(e, t, n, r) } }), s;
                        s.volume(e, r);
                        for (var i = s._getSoundIds(r), o = 0; o < i.length; o++) {
                            var a = s._soundById(i[o]);
                            if (a) {
                                if (r || s._stopFade(i[o]), s._webAudio && !a._muted) {
                                    var c = y.ctx.currentTime,
                                        u = c + n / 1e3;
                                    a._volume = e, a._node.gain.setValueAtTime(e, c), a._node.gain.linearRampToValueAtTime(t, u)
                                }
                                s._startFadeInterval(a, e, t, n, i[o], void 0 === r)
                            }
                        }
                        return s
                    },
                    _startFadeInterval: function(t, n, r, s, e, i) {
                        var o = this,
                            a = n,
                            c = r - n,
                            u = Math.abs(c / .01),
                            _ = Math.max(4, 0 < u ? s / u : s),
                            l = Date.now();
                        t._fadeTo = r, t._interval = setInterval(function() {
                            var e = (Date.now() - l) / s;
                            l = Date.now(), a += c * e, a = Math.max(0, a), a = Math.min(1, a), a = Math.round(100 * a) / 100, o._webAudio ? t._volume = a : o.volume(a, t._id, !0), i && (o._volume = a), (r < n && a <= r || n < r && r <= a) && (clearInterval(t._interval), t._interval = null, t._fadeTo = null, o.volume(r, t._id), o._emit("fade", t._id))
                        }, _)
                    },
                    _stopFade: function(e) {
                        var t = this,
                            n = t._soundById(e);
                        return n && n._interval && (t._webAudio && n._node.gain.cancelScheduledValues(y.ctx.currentTime), clearInterval(n._interval), n._interval = null, t.volume(n._fadeTo, e), n._fadeTo = null, t._emit("fade", e)), t
                    },
                    loop: function() {
                        var e, t, n, r = this,
                            s = arguments;
                        if (0 === s.length) return r._loop;
                        if (1 === s.length) {
                            if ("boolean" != typeof s[0]) return !!(n = r._soundById(parseInt(s[0], 10))) && n._loop;
                            e = s[0], r._loop = e
                        } else 2 === s.length && (e = s[0], t = parseInt(s[1], 10));
                        for (var i = r._getSoundIds(t), o = 0; o < i.length; o++)(n = r._soundById(i[o])) && (n._loop = e, r._webAudio && n._node && n._node.bufferSource && (n._node.bufferSource.loop = e) && (n._node.bufferSource.loopStart = n._start || 0, n._node.bufferSource.loopEnd = n._stop));
                        return r
                    },
                    rate: function() {
                        var e, t, n, r = this,
                            s = arguments;
                        if (0 === s.length) t = r._sounds[0]._id;
                        else if (1 === s.length) { 0 <= r._getSoundIds().indexOf(s[0]) ? t = parseInt(s[0], 10) : e = parseFloat(s[0]) } else 2 === s.length && (e = parseFloat(s[0]), t = parseInt(s[1], 10));
                        if ("number" != typeof e) return (n = r._soundById(t)) ? n._rate : r._rate;
                        if ("loaded" !== r._state) return r._queue.push({ event: "rate", action: function() { r.rate.apply(r, s) } }), r;
                        void 0 === t && (r._rate = e), t = r._getSoundIds(t);
                        for (var i = 0; i < t.length; i++)
                            if (n = r._soundById(t[i])) {
                                n._rateSeek = r.seek(t[i]), n._playStart = r._webAudio ? y.ctx.currentTime : n._playStart, n._rate = e, r._webAudio && n._node && n._node.bufferSource ? n._node.bufferSource.playbackRate.setValueAtTime(e, y.ctx.currentTime) : n._node && (n._node.playbackRate = e);
                                var o = r.seek(t[i]),
                                    a = 1e3 * ((r._sprite[n._sprite][0] + r._sprite[n._sprite][1]) / 1e3 - o) / Math.abs(n._rate);
                                !r._endTimers[t[i]] && n._paused || (r._clearTimer(t[i]), r._endTimers[t[i]] = m(r._ended.bind(r, n), a)), r._emit("rate", n._id)
                            }
                        return r
                    },
                    seek: function() {
                        var e, t, n = this,
                            r = arguments;
                        if (0 === r.length) t = n._sounds[0]._id;
                        else if (1 === r.length) { 0 <= n._getSoundIds().indexOf(r[0]) ? t = parseInt(r[0], 10) : n._sounds.length && (t = n._sounds[0]._id, e = parseFloat(r[0])) } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10));
                        if (void 0 === t) return n;
                        if ("loaded" !== n._state) return n._queue.push({ event: "seek", action: function() { n.seek.apply(n, r) } }), n;
                        var s = n._soundById(t);
                        if (s) {
                            if (!("number" == typeof e && 0 <= e)) {
                                if (n._webAudio) {
                                    var i = n.playing(t) ? y.ctx.currentTime - s._playStart : 0,
                                        o = s._rateSeek ? s._rateSeek - s._seek : 0;
                                    return s._seek + (o + i * Math.abs(s._rate))
                                }
                                return s._node.currentTime
                            }
                            var a = n.playing(t);
                            if (a && n.pause(t, !0), s._seek = e, s._ended = !1, n._clearTimer(t), a && n.play(t, !0), !n._webAudio && s._node && (s._node.currentTime = e), a && !n._webAudio) {
                                var c = function() { n._playLock ? m(c, 0) : n._emit("seek", t) };
                                m(c, 0)
                            } else n._emit("seek", t)
                        }
                        return n
                    },
                    playing: function(e) {
                        var t = this;
                        if ("number" == typeof e) { var n = t._soundById(e); return !!n && !n._paused }
                        for (var r = 0; r < t._sounds.length; r++)
                            if (!t._sounds[r]._paused) return !0;
                        return !1
                    },
                    duration: function(e) {
                        var t = this,
                            n = t._duration,
                            r = t._soundById(e);
                        return r && (n = t._sprite[r._sprite][1] / 1e3), n
                    },
                    state: function() { return this._state },
                    unload: function() {
                        for (var e = this, t = e._sounds, n = 0; n < t.length; n++) {
                            if (t[n]._paused || e.stop(t[n]._id), !e._webAudio) /MSIE |Trident\//.test(y._navigator && y._navigator.userAgent) || (t[n]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), t[n]._node.removeEventListener("error", t[n]._errorFn, !1), t[n]._node.removeEventListener(y._canPlayEvent, t[n]._loadFn, !1);
                            delete t[n]._node, e._clearTimer(t[n]._id);
                            var r = y._howls.indexOf(e);
                            0 <= r && y._howls.splice(r, 1)
                        }
                        var s = !0;
                        for (n = 0; n < y._howls.length; n++)
                            if (y._howls[n]._src === e._src) { s = !1; break }
                        return o && s && delete o[e._src], y.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null
                    },
                    on: function(e, t, n, r) {
                        var s = this,
                            i = s["_on" + e];
                        return "function" == typeof t && i.push(r ? { id: n, fn: t, once: r } : { id: n, fn: t }), s
                    },
                    off: function(e, t, n) {
                        var r = this,
                            s = r["_on" + e],
                            i = 0;
                        if ("number" == typeof t && (n = t, t = null), t || n)
                            for (i = 0; i < s.length; i++) { var o = n === s[i].id; if (t === s[i].fn && o || !t && o) { s.splice(i, 1); break } } else if (e) r["_on" + e] = [];
                            else { var a = Object.keys(r); for (i = 0; i < a.length; i++) 0 === a[i].indexOf("_on") && Array.isArray(r[a[i]]) && (r[a[i]] = []) }
                        return r
                    },
                    once: function(e, t, n) { var r = this; return r.on(e, t, n, 1), r },
                    _emit: function(e, t, n) { for (var r = this, s = r["_on" + e], i = s.length - 1; 0 <= i; i--) s[i].id && s[i].id !== t && "load" !== e || (m(function(e) { e.call(this, t, n) }.bind(r, s[i].fn), 0), s[i].once && r.off(e, s[i].fn, s[i].id)); return r._loadQueue(e), r },
                    _loadQueue: function(e) {
                        var t = this;
                        if (0 < t._queue.length) {
                            var n = t._queue[0];
                            n.event === e && (t._queue.shift(), t._loadQueue()), e || n.action()
                        }
                        return t
                    },
                    _ended: function(e) {
                        var t = this,
                            n = e._sprite;
                        if (!t._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return m(t._ended.bind(t, e), 100), t;
                        var r = !(!e._loop && !t._sprite[n][2]);
                        if (t._emit("end", e._id), !t._webAudio && r && t.stop(e._id, !0).play(e._id), t._webAudio && r) {
                            t._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = y.ctx.currentTime;
                            var s = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                            t._endTimers[e._id] = m(t._ended.bind(t, e), s)
                        }
                        return t._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, t._clearTimer(e._id), t._cleanBuffer(e._node), y._autoSuspend()), t._webAudio || r || t.stop(e._id), t
                    },
                    _clearTimer: function(e) {
                        var t = this;
                        if (t._endTimers[e]) {
                            if ("function" != typeof t._endTimers[e]) clearTimeout(t._endTimers[e]);
                            else {
                                var n = t._soundById(e);
                                n && n._node && n._node.removeEventListener("ended", t._endTimers[e], !1)
                            }
                            delete t._endTimers[e]
                        }
                        return t
                    },
                    _soundById: function(e) {
                        for (var t = this, n = 0; n < t._sounds.length; n++)
                            if (e === t._sounds[n]._id) return t._sounds[n];
                        return null
                    },
                    _inactiveSound: function() {
                        var e = this;
                        e._drain();
                        for (var t = 0; t < e._sounds.length; t++)
                            if (e._sounds[t]._ended) return e._sounds[t].reset();
                        return new i(e)
                    },
                    _drain: function() {
                        var e = this,
                            t = e._pool,
                            n = 0,
                            r = 0;
                        if (!(e._sounds.length < t)) {
                            for (r = 0; r < e._sounds.length; r++) e._sounds[r]._ended && n++;
                            for (r = e._sounds.length - 1; 0 <= r; r--) {
                                if (n <= t) return;
                                e._sounds[r]._ended && (e._webAudio && e._sounds[r]._node && e._sounds[r]._node.disconnect(0), e._sounds.splice(r, 1), n--)
                            }
                        }
                    },
                    _getSoundIds: function(e) { var t = this; if (void 0 !== e) return [e]; for (var n = [], r = 0; r < t._sounds.length; r++) n.push(t._sounds[r]._id); return n },
                    _refreshBuffer: function(e) { var t = this; return e._node.bufferSource = y.ctx.createBufferSource(), e._node.bufferSource.buffer = o[t._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.setValueAtTime(e._rate, y.ctx.currentTime), t },
                    _cleanBuffer: function(e) { var t = this; if (y._scratchBuffer) { e.bufferSource.onended = null, e.bufferSource.disconnect(0); try { e.bufferSource.buffer = y._scratchBuffer } catch (n) {} } return e.bufferSource = null, t }
                };
                var i = function(e) { this._parent = e, this.init() };
                i.prototype = {
                    init: function() {
                        var e = this,
                            t = e._parent;
                        return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++y._counter, t._sounds.push(e), e.create(), e
                    },
                    create: function() {
                        var e = this,
                            t = e._parent,
                            n = y._muted || e._muted || e._parent._muted ? 0 : e._volume;
                        return t._webAudio ? (e._node = "undefined" == typeof y.ctx.createGain ? y.ctx.createGainNode() : y.ctx.createGain(), e._node.gain.setValueAtTime(n, y.ctx.currentTime), e._node.paused = !0, e._node.connect(y.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(y._canPlayEvent, e._loadFn, !1), e._node.src = t._src, e._node.preload = "auto", e._node.volume = n * y.volume(), e._node.load()), e
                    },
                    reset: function() {
                        var e = this,
                            t = e._parent;
                        return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++y._counter, e
                    },
                    _errorListener: function() {
                        var e = this;
                        e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1)
                    },
                    _loadListener: function() {
                        var e = this,
                            t = e._parent;
                        t._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(t._sprite).length && (t._sprite = { __default: [0, 1e3 * t._duration] }), "loaded" !== t._state && (t._state = "loaded", t._emit("load"), t._loadQueue()), e._node.removeEventListener(y._canPlayEvent, e._loadFn, !1)
                    }
                };
                var o = {},
                    a = function(t) {
                        var e = t._src;
                        if (o[e]) return t._duration = o[e].duration, void _(t);
                        if (/^data:[^;]+;base64,/.test(e)) {
                            for (var n = atob(e.split(",")[1]), r = new Uint8Array(n.length), s = 0; s < n.length; ++s) r[s] = n.charCodeAt(s);
                            u(r.buffer, t)
                        } else {
                            var i = new XMLHttpRequest;
                            i.open("GET", e, !0), i.withCredentials = t._xhrWithCredentials, i.responseType = "arraybuffer", i.onload = function() { var e = (i.status + "")[0]; "0" === e || "2" === e || "3" === e ? u(i.response, t) : t._emit("loaderror", null, "Failed loading audio file with status: " + i.status + ".") }, i.onerror = function() { t._webAudio && (t._html5 = !0, t._webAudio = !1, t._sounds = [], delete o[e], t.load()) }, c(i)
                        }
                    },
                    c = function(e) { try { e.send() } catch (t) { e.onerror() } },
                    u = function(e, t) { y.ctx.decodeAudioData(e, function(e) { e && 0 < t._sounds.length && (o[t._src] = e, _(t, e)) }, function() { t._emit("loaderror", null, "Decoding audio data failed.") }) },
                    _ = function(e, t) { t && !e._duration && (e._duration = t.duration), 0 === Object.keys(e._sprite).length && (e._sprite = { __default: [0, 1e3 * e._duration] }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue()) },
                    l = function() {
                        try { "undefined" != typeof AudioContext ? y.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? y.ctx = new webkitAudioContext : y.usingWebAudio = !1 } catch (s) { y.usingWebAudio = !1 }
                        var e = /iP(hone|od|ad)/.test(y._navigator && y._navigator.platform),
                            t = y._navigator && y._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                            n = t ? parseInt(t[1], 10) : null;
                        if (e && n && n < 9) {
                            var r = /safari/.test(y._navigator && y._navigator.userAgent.toLowerCase());
                            (y._navigator && y._navigator.standalone && !r || y._navigator && !y._navigator.standalone && !r) && (y.usingWebAudio = !1)
                        }
                        y.usingWebAudio && (y.masterGain = "undefined" == typeof y.ctx.createGain ? y.ctx.createGainNode() : y.ctx.createGain(), y.masterGain.gain.setValueAtTime(y._muted ? 0 : 1, y.ctx.currentTime), y.masterGain.connect(y.ctx.destination)), y._setup()
                    };
                n.Howler2_0_3.HowlerGlobal = e, n.Howler2_0_3.Howler = y, n.Howler2_0_3.Howl = t, n.Howler2_0_3.Sound = i
            }()
    }.call(this),
    function() {
        var e = this.UchiruAudioManager,
            t = e.Howler2_0_3.HowlerGlobal,
            a = e.Howler2_0_3.Howler,
            i = e.Howler2_0_3.Howl,
            o = e.Howler2_0_3.Sound;
        ! function() {
            "use strict";
            var n, r, s;
            t.prototype._pos = [0, 0, 0], t.prototype._orientation = [0, 0, -1, 0, 1, 0], t.prototype.stereo = function(e) { var t = this; if (!t.ctx || !t.ctx.listener) return t; for (var n = t._howls.length - 1; 0 <= n; n--) t._howls[n].stereo(e); return t }, t.prototype.pos = function(e, t, n) { var r = this; return r.ctx && r.ctx.listener ? (t = "number" != typeof t ? r._pos[1] : t, n = "number" != typeof n ? r._pos[2] : n, "number" != typeof e ? r._pos : (r._pos = [e, t, n], r.ctx.listener.setPosition(r._pos[0], r._pos[1], r._pos[2]), r)) : r }, t.prototype.orientation = function(e, t, n, r, s, i) { var o = this; if (!o.ctx || !o.ctx.listener) return o; var a = o._orientation; return t = "number" != typeof t ? a[1] : t, n = "number" != typeof n ? a[2] : n, r = "number" != typeof r ? a[3] : r, s = "number" != typeof s ? a[4] : s, i = "number" != typeof i ? a[5] : i, "number" != typeof e ? a : (o._orientation = [e, t, n, r, s, i], o.ctx.listener.setOrientation(e, t, n, r, s, i), o) }, i.prototype.init = (n = i.prototype.init, function(e) { var t = this; return t._orientation = e.orientation || [1, 0, 0], t._stereo = e.stereo || null, t._pos = e.pos || null, t._pannerAttr = { coneInnerAngle: "undefined" != typeof e.coneInnerAngle ? e.coneInnerAngle : 360, coneOuterAngle: "undefined" != typeof e.coneOuterAngle ? e.coneOuterAngle : 360, coneOuterGain: "undefined" != typeof e.coneOuterGain ? e.coneOuterGain : 0, distanceModel: "undefined" != typeof e.distanceModel ? e.distanceModel : "inverse", maxDistance: "undefined" != typeof e.maxDistance ? e.maxDistance : 1e4, panningModel: "undefined" != typeof e.panningModel ? e.panningModel : "HRTF", refDistance: "undefined" != typeof e.refDistance ? e.refDistance : 1, rolloffFactor: "undefined" != typeof e.rolloffFactor ? e.rolloffFactor : 1 }, t._onstereo = e.onstereo ? [{ fn: e.onstereo }] : [], t._onpos = e.onpos ? [{ fn: e.onpos }] : [], t._onorientation = e.onorientation ? [{ fn: e.onorientation }] : [], n.call(this, e) }), i.prototype.stereo = function(e, t) {
                var n = this;
                if (!n._webAudio) return n;
                if ("loaded" !== n._state) return n._queue.push({ event: "stereo", action: function() { n.stereo(e, t) } }), n;
                var r = "undefined" == typeof a.ctx.createStereoPanner ? "spatial" : "stereo";
                if (void 0 === t) {
                    if ("number" != typeof e) return n._stereo;
                    n._stereo = e, n._pos = [e, 0, 0]
                }
                for (var s = n._getSoundIds(t), i = 0; i < s.length; i++) {
                    var o = n._soundById(s[i]);
                    if (o) {
                        if ("number" != typeof e) return o._stereo;
                        o._stereo = e, o._pos = [e, 0, 0], o._node && (o._pannerAttr.panningModel = "equalpower", o._panner && o._panner.pan || u(o, r), "spatial" === r ? o._panner.setPosition(e, 0, 0) : o._panner.pan.value = e), n._emit("stereo", o._id)
                    }
                }
                return n
            }, i.prototype.pos = function(e, t, n, r) {
                var s = this;
                if (!s._webAudio) return s;
                if ("loaded" !== s._state) return s._queue.push({ event: "pos", action: function() { s.pos(e, t, n, r) } }), s;
                if (t = "number" != typeof t ? 0 : t, n = "number" != typeof n ? -.5 : n, void 0 === r) {
                    if ("number" != typeof e) return s._pos;
                    s._pos = [e, t, n]
                }
                for (var i = s._getSoundIds(r), o = 0; o < i.length; o++) {
                    var a = s._soundById(i[o]);
                    if (a) {
                        if ("number" != typeof e) return a._pos;
                        a._pos = [e, t, n], a._node && (a._panner && !a._panner.pan || u(a, "spatial"), a._panner.setPosition(e, t, n)), s._emit("pos", a._id)
                    }
                }
                return s
            }, i.prototype.orientation = function(e, t, n, r) {
                var s = this;
                if (!s._webAudio) return s;
                if ("loaded" !== s._state) return s._queue.push({ event: "orientation", action: function() { s.orientation(e, t, n, r) } }), s;
                if (t = "number" != typeof t ? s._orientation[1] : t, n = "number" != typeof n ? s._orientation[2] : n, void 0 === r) {
                    if ("number" != typeof e) return s._orientation;
                    s._orientation = [e, t, n]
                }
                for (var i = s._getSoundIds(r), o = 0; o < i.length; o++) {
                    var a = s._soundById(i[o]);
                    if (a) {
                        if ("number" != typeof e) return a._orientation;
                        a._orientation = [e, t, n], a._node && (a._panner || (a._pos || (a._pos = s._pos || [0, 0, -.5]), u(a, "spatial")), a._panner.setOrientation(e, t, n)), s._emit("orientation", a._id)
                    }
                }
                return s
            }, i.prototype.pannerAttr = function() {
                var e, t, n, r = this,
                    s = arguments;
                if (!r._webAudio) return r;
                if (0 === s.length) return r._pannerAttr;
                if (1 === s.length) {
                    if ("object" != typeof s[0]) return (n = r._soundById(parseInt(s[0], 10))) ? n._pannerAttr : r._pannerAttr;
                    e = s[0], void 0 === t && (r._pannerAttr = { coneInnerAngle: "undefined" != typeof e.coneInnerAngle ? e.coneInnerAngle : r._coneInnerAngle, coneOuterAngle: "undefined" != typeof e.coneOuterAngle ? e.coneOuterAngle : r._coneOuterAngle, coneOuterGain: "undefined" != typeof e.coneOuterGain ? e.coneOuterGain : r._coneOuterGain, distanceModel: "undefined" != typeof e.distanceModel ? e.distanceModel : r._distanceModel, maxDistance: "undefined" != typeof e.maxDistance ? e.maxDistance : r._maxDistance, panningModel: "undefined" != typeof e.panningModel ? e.panningModel : r._panningModel, refDistance: "undefined" != typeof e.refDistance ? e.refDistance : r._refDistance, rolloffFactor: "undefined" != typeof e.rolloffFactor ? e.rolloffFactor : r._rolloffFactor })
                } else 2 === s.length && (e = s[0], t = parseInt(s[1], 10));
                for (var i = r._getSoundIds(t), o = 0; o < i.length; o++)
                    if (n = r._soundById(i[o])) {
                        var a = n._pannerAttr;
                        a = { coneInnerAngle: "undefined" != typeof e.coneInnerAngle ? e.coneInnerAngle : a.coneInnerAngle, coneOuterAngle: "undefined" != typeof e.coneOuterAngle ? e.coneOuterAngle : a.coneOuterAngle, coneOuterGain: "undefined" != typeof e.coneOuterGain ? e.coneOuterGain : a.coneOuterGain, distanceModel: "undefined" != typeof e.distanceModel ? e.distanceModel : a.distanceModel, maxDistance: "undefined" != typeof e.maxDistance ? e.maxDistance : a.maxDistance, panningModel: "undefined" != typeof e.panningModel ? e.panningModel : a.panningModel, refDistance: "undefined" != typeof e.refDistance ? e.refDistance : a.refDistance, rolloffFactor: "undefined" != typeof e.rolloffFactor ? e.rolloffFactor : a.rolloffFactor };
                        var c = n._panner;
                        c ? (c.coneInnerAngle = a.coneInnerAngle, c.coneOuterAngle = a.coneOuterAngle, c.coneOuterGain = a.coneOuterGain, c.distanceModel = a.distanceModel, c.maxDistance = a.maxDistance, c.panningModel = a.panningModel, c.refDistance = a.refDistance, c.rolloffFactor = a.rolloffFactor) : (n._pos || (n._pos = r._pos || [0, 0, -.5]), u(n, "spatial"))
                    }
                return r
            }, o.prototype.init = (r = o.prototype.init, function() {
                var e = this,
                    t = e._parent;
                e._orientation = t._orientation, e._stereo = t._stereo, e._pos = t._pos, e._pannerAttr = t._pannerAttr, r.call(this), e._stereo ? t.stereo(e._stereo) : e._pos && t.pos(e._pos[0], e._pos[1], e._pos[2], e._id)
            }), o.prototype.reset = (s = o.prototype.reset, function() {
                var e = this,
                    t = e._parent;
                return e._orientation = t._orientation, e._pos = t._pos, e._pannerAttr = t._pannerAttr, s.call(this)
            });
            var u = function(e, t) { "spatial" === (t = t || "spatial") ? (e._panner = a.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.panningModel = e._pannerAttr.panningModel, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]), e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = a.ctx.createStereoPanner(), e._panner.pan.value = e._stereo), e._panner.connect(e._node), e._paused || e._parent.pause(e._id, !0).play(e._id) }
        }()
    }.call(this),
    function() {
        "use strict";

        function u() {}

        function i(e, t, n) { this.fn = e, this.context = t, this.once = n || !1 }

        function e() { this._events = new u, this._eventsCount = 0 }
        var t = this.UchiruAudioManager,
            r = Object.prototype.hasOwnProperty,
            p = "~";
        Object.create && (u.prototype = Object.create(null), (new u).__proto__ || (p = !1)), e.prototype.eventNames = function s() { var e, t, n = []; if (0 === this._eventsCount) return n; for (t in e = this._events) r.call(e, t) && n.push(p ? t.slice(1) : t); return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(e)) : n }, e.prototype.listeners = function a(e, t) {
            var n = p ? p + e : e,
                r = this._events[n];
            if (t) return !!r;
            if (!r) return [];
            if (r.fn) return [r.fn];
            for (var s = 0, i = r.length, o = new Array(i); s < i; s++) o[s] = r[s].fn;
            return o
        }, e.prototype.emit = function h(e, t, n, r, s, i) {
            var o = p ? p + e : e;
            if (!this._events[o]) return !1;
            var a, c, u = this._events[o],
                _ = arguments.length;
            if (u.fn) {
                switch (u.once && this.removeListener(e, u.fn, undefined, !0), _) {
                    case 1:
                        return u.fn.call(u.context), !0;
                    case 2:
                        return u.fn.call(u.context, t), !0;
                    case 3:
                        return u.fn.call(u.context, t, n), !0;
                    case 4:
                        return u.fn.call(u.context, t, n, r), !0;
                    case 5:
                        return u.fn.call(u.context, t, n, r, s), !0;
                    case 6:
                        return u.fn.call(u.context, t, n, r, s, i), !0
                }
                for (c = 1, a = new Array(_ - 1); c < _; c++) a[c - 1] = arguments[c];
                u.fn.apply(u.context, a)
            } else {
                var l, d = u.length;
                for (c = 0; c < d; c++) switch (u[c].once && this.removeListener(e, u[c].fn, undefined, !0), _) {
                    case 1:
                        u[c].fn.call(u[c].context);
                        break;
                    case 2:
                        u[c].fn.call(u[c].context, t);
                        break;
                    case 3:
                        u[c].fn.call(u[c].context, t, n);
                        break;
                    case 4:
                        u[c].fn.call(u[c].context, t, n, r);
                        break;
                    default:
                        if (!a)
                            for (l = 1, a = new Array(_ - 1); l < _; l++) a[l - 1] = arguments[l];
                        u[c].fn.apply(u[c].context, a)
                }
            }
            return !0
        }, e.prototype.on = function o(e, t, n) {
            var r = new i(t, n || this),
                s = p ? p + e : e;
            return this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], r] : this._events[s].push(r) : (this._events[s] = r, this._eventsCount++), this
        }, e.prototype.once = function c(e, t, n) {
            var r = new i(t, n || this, !0),
                s = p ? p + e : e;
            return this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], r] : this._events[s].push(r) : (this._events[s] = r, this._eventsCount++), this
        }, e.prototype.removeListener = function _(e, t, n, r) {
            var s = p ? p + e : e;
            if (!this._events[s]) return this;
            if (!t) return 0 == --this._eventsCount ? this._events = new u : delete this._events[s], this;
            var i = this._events[s];
            if (i.fn) i.fn !== t || r && !i.once || n && i.context !== n || (0 == --this._eventsCount ? this._events = new u : delete this._events[s]);
            else {
                for (var o = 0, a = [], c = i.length; o < c; o++)(i[o].fn !== t || r && !i[o].once || n && i[o].context !== n) && a.push(i[o]);
                a.length ? this._events[s] = 1 === a.length ? a[0] : a : 0 == --this._eventsCount ? this._events = new u : delete this._events[s]
            }
            return this
        }, e.prototype.removeAllListeners = function n(e) { var t; return e ? (t = p ? p + e : e, this._events[t] && (0 == --this._eventsCount ? this._events = new u : delete this._events[t])) : (this._events = new u, this._eventsCount = 0), this }, e.prototype.off = e.prototype.removeListener, e.prototype.addListener = e.prototype.on, e.prototype.setMaxListeners = function l() { return this }, e.prefixed = p, e.EventEmitter = e, "undefined" != typeof module && (module.exports = e), t.EventEmitter3 = e
    }.call(this),
    function() {
        var s = function(e, t) { return function() { return e.apply(t, arguments) } },
            i = function(e, t) {
                function n() { this.constructor = e }
                for (var r in t) o.call(t, r) && (e[r] = t[r]);
                return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
            },
            o = {}.hasOwnProperty;
        ! function() {
            var e, a, r, t;
            e = (r = this.UchiruAudioManager).EventEmitter3, (t = {}).Howler, a = t.Howl, r.Sound = function() {
                function n(e) {
                    var t;
                    this.source = e, this._onplayerror = s(this._onplayerror, this), this._onstop = s(this._onstop, this), this._onended = s(this._onended, this), this._onpause = s(this._onpause, this), this._onplay = s(this._onplay, this), this._onloaderror = s(this._onloaderror, this), this._onload = s(this._onload, this), n.__super__.constructor.call(this), t = r.Howler, t.Howler, a = t.Howl, this._sound = null, this._loaded = !1, this._loaderror = !1, this.load()
                }
                return i(n, e), n.supportedFormats = ["mp3", "wav", "ogg"], n.prototype._onload = function() { return this._loaded = !0, this.emit("load", this) }, n.prototype._onloaderror = function() { return this._loaderror = !0, this.emit("loaderror", this) }, n.prototype._onplay = function() { return this.emit("play", this) }, n.prototype._onpause = function() { return this.emit("pause", this) }, n.prototype._onended = function() { return this.emit("ended", this) }, n.prototype._onstop = function() { return this.emit("stop", this) }, n.prototype._onplayerror = function() { return this.emit("playerror", this) }, n.prototype.play = function() { return this._sound.play() }, n.prototype.pause = function() { return this._sound.pause() }, n.prototype.stop = function() { return this._sound.stop(), this._onstop() }, n.prototype.playing = function() { return this._sound.playing() }, n.prototype.reload = function() { return this.unload(!1), this.load() }, n.prototype.load = function() { var e, t, n, r, s, i, o; for (i = [], e = [], n = 0, r = (s = this.constructor.supportedFormats).length; n < r; n++) t = s[n], (o = this.source[t]) && (i.push(o), e.push(t)); return this._sound = new a({ src: i, ext: e, onload: this._onload, onloaderror: this._onloaderror, onplayerror: this._onplayerror, onplay: this._onplay, onpause: this._onpause, onend: this._onended }), this }, n.prototype.unload = function(e) { return null == e && (e = !0), e && (this.off("load"), this.off("loaderror"), this.off("play"), this.off("pause"), this.off("ended"), this.off("stop")), this._sound = null, this._loaded = !1, this._loaderror = !1, this }, n
            }()
        }()
    }.call(this),
    function() {
        ! function() {
            var n, o, r, e;
            r = this.UchiruAudioManager, o = r.Sound, n = (e = {}).Howler, e.Howl, r.AudioManager = function() {
                function e(e) {
                    var t;
                    null == e && (e = {}), t = r.Howler, n = t.Howler, t.Howl, this.locale = e.locale, this.onEvent = e.onEvent, _ASSERT(null != this.locale), this.sounds = {}
                }
                return e.prototype.play = function(e, t) { var n, r; return (r = this.sound(e)) ? (n = function() { return r.off("ended", n), r.off("loaderror", n), r.off("playerror", n), "function" == typeof t ? t() : void 0 }, r.once("ended", n), r.once("loaderror", n), r.once("playerror", n), r.play()) : "function" == typeof t ? t() : void 0 }, e.prototype.sound = function(t, e) { var n, r, s, i; return null == e && (e = {}), n = t[_.find(o.supportedFormats, function(e) { return null != t[e] })], null == this.sounds[n] && (null == (i = t) && "function" == typeof this.onEvent && this.onEvent("missed_audio_constant", { urls: t }), i && (s = this._makeSound(i)) && (s.name = n, this.sounds[s.name] = s)), (null != (r = this.sounds[n]) ? r._loaderror : void 0) && this.sounds[n].reload(), this.sounds[n] }, e.prototype.unload = function() { return _(this.sounds).each(function(e) { return null != e ? e.unload() : void 0 }), this }, e.prototype._makeSound = function(e) { return this._runnable() ? new o(e) : null }, e.prototype._runnable = function() { return !n.noAudio }, e
            }()
        }()
    }.call(this),
    function() {
        var n;
        $("document").ready((n = this, function() { var t; return t = function() { try { return new n.UchiruAudioManager.Howler2_0_3.Howl({ src: "data:audio/mpeg;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7RAAAAEkABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7QEsQAAAAAAAEX/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+7RAwAAP/ABLgAAACByACXAAAAEAAAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" }).play(), $(document.body).off("touchstart mousedown", t) } catch (e) { return console.log("error") } }, $(document.body).one("touchstart mousedown", t) }))
    }.call(this), this.UchiruLocaleDropdown = function() {
        function e(e, t) { this.toggleButton = e, this.menu = t, this._handler = this._handler.bind(this) }
        return e.prototype.run = function() {
            var t = this;
            this.toggleButton.on("click", function(e) { e.preventDefault(), e.stopPropagation(), t.toggle() }), $("body").on("click", this._handler)
        }, e.prototype.clear = function() { this.toggleButton.off("click"), $("body").off("click", this._handler) }, e.prototype._handler = function() { this.close() }, e.prototype.toggle = function() { this.isOpen() ? this.close() : this.open() }, e.prototype.isDisabled = function() { return this.toggleButton.hasClass("uchiru-locale-dropdown__toggle_disabled") }, e.prototype.isOpen = function() { return this.toggleButton.hasClass("uchiru-locale-dropdown__toggle_open") }, e.prototype.open = function() { this.isDisabled() || (this.toggleButton.addClass("uchiru-locale-dropdown__toggle_open"), this.menu.addClass("uchiru-locale-dropdown__menu_open")) }, e.prototype.close = function() { this.isDisabled() || (this.toggleButton.removeClass("uchiru-locale-dropdown__toggle_open"), this.menu.removeClass("uchiru-locale-dropdown__menu_open")) }, e
    }(), this.UchiruKeypad3 = this.UchiruKeypad3 || {}, this.UchiruKeypad3.Keypad = function() {
        function e(e, t) {
            t = t || {};
            this.className = t.className, this.locale = t.locale || "ru", this._roles = t.roles, this._hidden = !!t.hidden;
            var n = t.opt || {};
            _ASSERT(this.className), _ASSERT(this._roles), this.onChar = null, this.mouseDownAction = "mousedown", this.mouseUpAction = "mouseup", this.mouseOutAction = "mouseout", "ie10_touch" === get_browser_version() ? (this.touchStartAction = "MSPointerDown", this.touchEndAction = "MSPointerUp") : (this.touchStartAction = "touchstart", this.touchEndAction = "touchend"), this.view = $.div().addClass(this.className).appendTo(e), this._init(n), (this._hidden || this._hasRole("button") || !this._hasVisibleSymbols()) && this.view.hide()
        }
        return e.prototype.destroy = function() { this._destroy(), this.view.remove() }, e.prototype.buttonOkToggle = function(e) { return this.view.find("." + this.className + "__button_enter").toggleClass(this.className + "__button_disabled", !e) }, e.prototype._init = function(e) { this.view.on("mousedown touchstart mouseup touchend click", function(e) { e.stopPropagation() }), $.div().addClass(this.className + "__background").append($.div().addClass(this.className + "__background_blured")).appendTo(this.view), this._buttonsHolder = $.div().addClass(this.className + "__buttons-holder").appendTo(this.view), this._fill(this._roles, { keypad: e.keypad }) }, e.prototype._destroy = function() { this._buttonsHolder = null }, e.prototype._fill = function(a, c) {
            var u, _, e, t, n, r, s, i, o, l, d, p, h, f, m, y = this;
            for (null == a && (a = y._roles), null == c && (c = {}), _ = 0; _ < a.length; _++) ! function() {
                var e, t, n, r, s, i, o = a[_];
                for (e = 0; e < y.chars[o].length; e++) {
                    if (t = y.chars[o][e], y.view.hasClass(y.className)) { if ("enter" === t && c.keypad && c.keypad.button_enter && c.keypad.button_enter.without) continue; if ("decimal_point" === o && t !== y._decimalMark()) continue }
                    switch (u = $.div().addClass(y.className + "__button").data("char", t).appendTo(y._buttonsHolder), y.view.hasClass(y.className) && u.attr({ style: "font-family: 'Helvetica-Light', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !important" }), t) {
                        case "backspace":
                            u.addClass(y.className + "__button_system " + y.className + "__button_backspace"), u.html("&nbsp;");
                            break;
                        case "enter":
                            r = (s = c.keypad && c.keypad.button_enter || {}).type || "ok", n = s.text || "OK", i = s.color || "blue", _ASSERT("ok" === r || "done" === r), _ASSERT("blue-intense" === i || "blue" === i), u.data({ type: r, text: n, color: i }), u.addClass(y.className + "__button_system " + y.className + "__button_enter " + y.className + "__button_type_" + r + " " + y.className + "__button_color_" + i), u.html(n);
                            break;
                        case "0":
                            u.html(t);
                            break;
                        case " ":
                            u.html("&nbsp;");
                            break;
                        default:
                            u.html(y._typograph(t))
                    }
                    u.on(y.mouseDownAction + " " + y.touchStartAction, function(e) { return e.type === y.mouseDownAction && 1 !== e.which || $(this).hasClass(y.className + "__button_disabled") || $(this).addClass(y.className + "__button_active"), !1 }), u.on(y.mouseUpAction + " " + y.touchEndAction, function() { return $(this).hasClass(y.className + "__button_disabled") || ($(this).removeClass(y.className + "__button_active"), y._onKeypadclick($(this).data("char"))), !1 }), u.on(y.mouseOutAction, function() { return $(this).hasClass(y.className + "__button_disabled") || $(this).removeClass(y.className + "__button_active"), !1 })
                }
            }();
            u && u.addClass(y.className + "__button_last-button"), y.view.hasClass(y.className) && (l = y.view.find("." + y.className + "__button." + y.className + "__button_enter").eq(0), d = l.data(), p = 11, h = 78, f = 6, m = 8, d && "done" === d.type ? (r = y.view.find("." + y.className + "__button:not(." + y.className + "__button_enter)"), s = p * (h + f) + h, i = l.outerWidth() + (parseInt(l.css("marginLeft"), 10) - m), (o = Math.floor((s - i - (r.length - 1) * f) / r.length)) < h && r.css({ width: o })) : (e = y.view.find("." + y.className + "__button"), t = p * (h + f) + h, (n = Math.floor((t - (e.length - 1) * f) / e.length)) < h && e.css({ width: n })))
        }, e.prototype._onKeypadclick = function(e) { var t; for (t = 0; t < this._roles.length; t++) { var n = this._roles[t]; if (-1 !== this.chars[n].indexOf(e)) { var r = this.localizedChar(e, n); return void(this.onChar && this.onChar(r)) } } }, e.prototype._typograph = function(e) { var t = e; return t = t.replace(/\-/, "&minus;"), t = (t = (t = (t = (t = (t = -1 !== ["en", "es", "hi", "ch", "ind"].indexOf(this.locale) ? t.replace(/\*/, "&times;") : t.replace(/\*/, "&middot;")).replace(/\//, ":")).replace(/>/, "&gt;")).replace(/</, "&lt;")).replace(/>=/, "&ge;")).replace(/<=/, "&le;") }, e.prototype._decimalMark = function() { return -1 !== ["en", "es", "hi", "ch", "ind"].indexOf(this.locale) ? "." : "," }, e.prototype.localizedChar = function(e, t) {
            return "decimal_point" === t ? this._decimalMark() : e
        }, e.prototype._hasRole = function(e) { return _ASSERT(void 0 !== e), -1 != this._roles.indexOf(e) }, e.prototype._hasVisibleSymbols = function() {
            for (var e = 0; e < this._roles.length; e++)
                if (0 < this.chars[this._roles[e]].length) return !0;
            return !1
        }, Object.defineProperties(e.prototype, { height: { get: function() { return this.view.is(":visible") ? 95 : 0 } }, roles: { get: function() { return this._roles } }, keyCode2Char: { get: function() { return this.__keyCode2Char } }, chars: { get: function() { return this.__chars } } }), e.prototype.__keyCode2Char = { numeric: {}, compare: {}, operation: {}, input: { 13: "enter", 8: "backspace", 9: "tab" }, enter: { 13: "enter" }, backspace: { 8: "backspace" }, tab: { 9: "tab" }, decimal_point: {}, percent: {}, minus: {}, arrows: { 37: "left", 38: "up", 39: "right", 40: "down" }, question_mark: {}, exclamation_mark: {}, period: {}, comma: {}, colon: {}, semicolon: {}, apostrophe: {}, button: { 13: "enter" }, space: {}, letters_ru: {}, letters_en: {} }, e.prototype.__chars = { numeric: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], compare: ["<", "=", ">"], operation: ["+", "-", "*", "/"], input: ["backspace", "enter"], enter: ["enter"], backspace: ["backspace"], tab: [], decimal_point: [".", ","], percent: ["%"], minus: ["-"], arrows: [], question_mark: ["?"], exclamation_mark: ["!"], period: ["."], comma: [","], colon: [":"], semicolon: [";"], apostrophe: ["'"], button: [], space: [" "], letters_ru: ["\u0430", "\u0431", "\u0432", "\u0433", "\u0434", "\u0435", "\u0451", "\u0436", "\u0437", "\u0438", "\u0439", "\u043a", "\u043b", "\u043c", "\u043d", "\u043e", "\u043f", "\u0440", "\u0441", "\u0442", "\u0443", "\u0444", "\u0445", "\u0446", "\u0447", "\u0448", "\u0449", "\u044a", "\u044b", "\u044c", "\u044d", "\u044e", "\u044f"].concat(["\u0410", "\u0411", "\u0412", "\u0413", "\u0414", "\u0415", "\u0401", "\u0416", "\u0417", "\u0418", "\u0419", "\u041a", "\u041b", "\u041c", "\u041d", "\u041e", "\u041f", "\u0420", "\u0421", "\u0422", "\u0423", "\u0424", "\u0425", "\u0426", "\u0427", "\u0428", "\u0429", "\u042a", "\u042b", "\u042c", "\u042d", "\u042e", "\u042f"]), letters_en: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].concat(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) }, e
    }(), this.UchiruKeypad3 = this.UchiruKeypad3 || {}, this.UchiruKeypad3.KeypadNative = function() {
        function e(e, t) {
            t = t || {};
            this.className = t.className, this.locale = t.locale || "ru", this._roles = t.roles;
            var n = t.opt || {};
            _ASSERT(this.className), _ASSERT(this._roles), this.onChar = null, this.onBecomeActive = null, this.onResignActive = null, this._autoActivateHandler = null, this.view = $.div().addClass(this.className).appendTo(e), this._init(n)
        }
        return e.prototype.destroy = function() { this._destroy(), this.view.remove() }, e.prototype.keypadActivate = function() { this.view.find("." + this.className + "__input").focus() }, e.prototype.keypadDeactivate = function() { this.view.find("." + this.className + "__input").blur() }, e.prototype._init = function(e) {
            var t = this;
            this.view.css({ position: "absolute", top: Math.max(0, Math.min((e.targetTop || 0) - 34, this.view.parent().height() + parseInt(this.view.parent().css("padding-top"), 10) - 34)), left: 0, width: 0, height: 0, overflow: "hidden" });
            var n = $('<input type="text" maxlength="2048" autocapitalize="off" autocomplete="off" autocorrect="off">').addClass(this.className + "__input").css({ border: "none", padding: 0, margin: 0, backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw%3D%3D)", backgroundColor: "transparent", fontSize: 16, lineHeight: "34px", height: 34, width: 100, position: "absolute", userSelect: "auto", right: 0, top: 0, color: "transparent" }).appendTo(this.view);
            return n.on("input", function() {
                var e = n.val();
                t._onKeypadclick(e[e.length - 1]), n.val("")
            }), n.on("change", function() { n.val("") }), n.on("keyup", function(e) { 8 === e.keyCode && t._onKeypadclick("backspace") }), n.on("keyup", function(e) { 13 === e.keyCode && t._onKeypadclick("enter") }), n.on("focus", function() { t._onBecomeActive() }), n.on("blur", function() { t._onResignActive() }), n.on("paste", function(e) { e.preventDefault() }), !1 !== e.autoActivate && (this._autoActivateHandler = function() { return this.keypadActivate() }.bind(this), $(document).on("mouseup touchend", this._autoActivateHandler)), this.view
        }, e.prototype._destroy = function() { this._autoActivateHandler && ($(document).off("mouseup touchend", this._autoActivateHandler), this._autoActivateHandler = null) }, e.prototype._onBecomeActive = function() { this.onBecomeActive && this.onBecomeActive() }, e.prototype._onResignActive = function() { this.onResignActive && this.onResignActive() }, e.prototype._onKeypadclick = function(e) { var t; for (t = 0; t < this._roles.length; t++) { var n = this._roles[t]; if (-1 !== this.chars[n].indexOf(e)) { var r = this.localizedChar(e, n); return void(this.onChar && this.onChar(r)) } } }, e.prototype._decimalMark = function() { return -1 !== ["en", "es", "hi", "ch", "ind"].indexOf(this.locale) ? "." : "," }, e.prototype.localizedChar = function(e, t) { return "decimal_point" === t ? this._decimalMark() : e }, Object.defineProperties(e.prototype, { roles: { get: function() { return this._roles } }, keyCode2Char: { get: function() { return this.__keyCode2Char } }, chars: { get: function() { return this.__chars } } }), e.prototype.__keyCode2Char = { numeric: {}, compare: {}, operation: {}, input: { 9: "tab" }, enter: {}, backspace: {}, tab: { 9: "tab" }, decimal_point: {}, percent: {}, minus: {}, arrows: { 37: "left", 38: "up", 39: "right", 40: "down" }, question_mark: {}, exclamation_mark: {}, period: {}, comma: {}, colon: {}, semicolon: {}, apostrophe: {}, button: { 13: "enter" }, space: {}, letters_ru: {}, letters_en: {} }, e.prototype.__chars = { numeric: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], compare: ["<", "=", ">"], operation: ["+", "-", "*", "/"], input: ["backspace", "enter"], enter: ["enter"], backspace: ["backspace"], tab: [], decimal_point: [".", ","], percent: ["%"], minus: ["-"], arrows: [], question_mark: ["?"], exclamation_mark: ["!"], period: ["."], comma: [","], colon: [":"], semicolon: [";"], apostrophe: ["'"], button: [], space: [" "], letters_ru: ["\u0430", "\u0431", "\u0432", "\u0433", "\u0434", "\u0435", "\u0451", "\u0436", "\u0437", "\u0438", "\u0439", "\u043a", "\u043b", "\u043c", "\u043d", "\u043e", "\u043f", "\u0440", "\u0441", "\u0442", "\u0443", "\u0444", "\u0445", "\u0446", "\u0447", "\u0448", "\u0449", "\u044a", "\u044b", "\u044c", "\u044d", "\u044e", "\u044f"].concat(["\u0410", "\u0411", "\u0412", "\u0413", "\u0414", "\u0415", "\u0401", "\u0416", "\u0417", "\u0418", "\u0419", "\u041a", "\u041b", "\u041c", "\u041d", "\u041e", "\u041f", "\u0420", "\u0421", "\u0422", "\u0423", "\u0424", "\u0425", "\u0426", "\u0427", "\u0428", "\u0429", "\u042a", "\u042b", "\u042c", "\u042d", "\u042e", "\u042f"]), letters_en: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].concat(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) }, e
    }(), this.UchiruKeypad3 = this.UchiruKeypad3 || {}, this.UchiruKeypad3.KeypadAlgebra = function() {
        function e(e, t) {
            (t = t || {}).opt;
            _ASSERT(t.className), _ASSERT(t.roles), this.className = t.className, this.locale = t.locale || "ru", this._roles = t.roles, this.onChar = null, this.mouseDownAction = "mousedown", this.mouseUpAction = "mouseup", this.mouseOutAction = "mouseout", "ie10_touch" === get_browser_version() ? (this.touchStartAction = "MSPointerDown", this.touchEndAction = "MSPointerUp") : (this.touchStartAction = "touchstart", this.touchEndAction = "touchend"), this.view = $.div().addClass(this.className).appendTo(e), this._init()
        }
        return e.prototype.destroy = function() { this._destroy(), this.view.remove() }, e.prototype._init = function() {
            var e = $.div(this.className + "__background"),
                t = $.div(this.className + "__background_blured");
            this._buttonsHolder = $.div(this.className + "__buttons-holder"), this.view.on("mousedown touchstart mouseup touchend click", function(e) { e.stopPropagation() }), e.append(t), this.view.append(e).append(this._buttonsHolder), this._fill()
        }, e.prototype._destroy = function() { this._buttonsHolder = null }, e.prototype._fill = function() {
            var n = this,
                r = [];
            _.each(n._roles, function(e) {
                var t = n._fillRole(e);
                null != t && r.push(t)
            })
        }, e.prototype._fillRole = function(t) {
            var r, s = this,
                e = "string" == typeof t ? s.__presets[t] : t;
            if (_ASSERT("object" == typeof e, "wrong role: " + t), 0 < e.length) {
                r = $.div(s.className + "__keypad-block").appendTo(s._buttonsHolder);
                var i = [];
                _.each(e, function(e) {
                    _ASSERT("object" == typeof e, "wrong role: " + t);
                    var n = $.div(s.className + "__keypad-block-row").appendTo(r);
                    _.each(e, function(e) {
                        var t = s._createButton(n, e);
                        i.push(t), "enter" == e && (s.okButton = t)
                    })
                }), r.data("buttons", i)
            }
            return r
        }, e.prototype._createButton = function(e, t) {
            var n = this,
                r = n.className + "__button";
            return button = $.div(r), label = n._charToLabel(t), system_chars = ["backspace", "enter"], special_chars = ["abs", "derivative", "element_of", "element_not_of", "exp", "factorial", "frac", "index", "infinity", "integral", "integral_d", "left", "lim", "minus_infinity", "plus_infinity", "power", "right", "root", "root_power", "union"], button.data("char", t).appendTo(e).html(label), null == t ? button.css({ visibility: "hidden" }) : (-1 !== system_chars.indexOf(t) && button.addClass(r + "_system " + r + "_" + t), -1 !== special_chars.indexOf(t) && button.addClass(r + "_" + t), "^" == t && button.addClass(r + "_power"), "/" == t && button.addClass(r + "_frac"), t.match(/^(arc)\w+/) && button.addClass(r + "_small_text"), "enter" == t && button.addClass(r + "_color_blue"), t.match(/\b[a-z]\b/i) && button.addClass(r + "_char"), button.on(n.mouseDownAction + " " + n.touchStartAction, function(e) { return e.type === n.mouseDownAction && 1 !== e.which || $(this).hasClass(r + "_disabled") || $(this).addClass(r + "_active"), !1 }), button.on(n.mouseUpAction + " " + n.touchEndAction, function() { return $(this).hasClass(r + "_disabled") || ($(this).removeClass(r + "_active"), n._onKeypadclick($(this).data("char"))), !1 }), button.on(n.mouseOutAction, function() { return $(this).hasClass(r + "_disabled") || $(this).removeClass(r + "_active"), !1 })), button
        }, e.prototype._onKeypadclick = function(e) { this.onChar && this.onChar(e) }, e.prototype.localizedChar = function(e) { return e }, Object.defineProperties(e.prototype, { height: { get: function() { return this.view.is(":visible") ? this.view.outerHeight() + 5 : 0 } }, roles: { get: function() { return this._composeRoles() } }, keyCode2Char: { get: function() { return this._composeKeyCode2Char() } }, chars: { get: function() { return this._composeChars() } } }), e.prototype._composeRoles = function() { return ["custom"] }, e.prototype._composeKeyCode2Char = function() {
            var t = this,
                n = { custom: {} };
            return _.each(t._roles, function(e) { "string" == typeof e && t.__keyCode2Char[e] && _.extend(n.custom, t.__keyCode2Char[e]) }), n
        }, e.prototype._composeChars = function() {
            var n = this,
                r = { custom: [] };
            return _.each(n._roles, function(e) {
                var t = "string" == typeof e ? n.__presets[e] : e;
                _.each(t, function(e) { _.each(e, function(e) { r.custom.push(e) }) })
            }), r
        }, e.prototype.buttonOkToggle = function(e) { this.okButton && ("boolean" == typeof e ? this.okButton.toggleClass(this.className + "__button_disabled", !e) : this.okButton.toggleClass(this.className + "__button_disabled")) }, e.prototype.buttonOkWrong = function() { this.okButton && (this.okButton.addClass(this.className + "__button_red"), this.okButton.removeClass(this.className + "__button_green")) }, e.prototype.buttonOkClear = function() { this.okButton && (this.okButton.removeClass(this.className + "__button_red"), this.okButton.removeClass(this.className + "__button_green")) }, e.prototype.buttonOkRight = function() { this.okButton && (this.okButton.removeClass(this.className + "__button_red"), this.okButton.addClass(this.className + "__button_green")) }, e.prototype.__keyCode2Char = { arrows: { 37: "left", 38: "up", 39: "right", 40: "down" }, input: { 13: "enter", 8: "backspace", 9: "tab" }, enter: { 13: "enter" }, backspace: { 8: "backspace" }, backspace_enter: { 8: "backspace", 13: "enter" }, tab: { 9: "tab" } }, e.prototype.__presets = {
            "default": [
                ["+", "-", "*", ":", ",", "(", ")"],
                [">", "<", "less_or_equal", "more_or_equal", "=", "a", "b"]
            ],
            minimal: [
                ["+", "-", "*", ":", ",", "(", ")"],
                [">", "<", "less_or_equal", "more_or_equal", "=", "a", "b"]
            ],
            medium: [
                ["+", "-", "*", ":", ",", "(", ")"],
                [">", "<", "less_or_equal", "more_or_equal", "=", "a", "b"]
            ],
            maximal: [
                ["+", "-", "*", ":", ",", "(", ")"],
                [">", "<", "less_or_equal", "more_or_equal", "=", "a", "b"]
            ],
            arithmetic: [
                ["/", "+"],
                ["-", "*"]
            ],
            compare: [
                ["<", ">", ">="],
                ["<=", "=", "!="]
            ],
            power_pack: [
                ["power", "root"],
                [null, "logarithm"]
            ],
            letters: [
                ["a", "b"],
                ["x", "y"]
            ],
            other: [
                ["abs"],
                ["braket"]
            ],
            numeric: [
                ["1", "2", "3", "4", "5"],
                ["6", "7", "8", "9", "0"]
            ],
            arrows: [],
            tab: [],
            enter: [
                ["enter"]
            ],
            backspace: [
                ["backspace"]
            ],
            backspace_enter: [
                ["backspace", "enter"]
            ],
            input: [
                ["backspace", "enter"],
                ["left", "right"]
            ]
        }, e.prototype._charToLabel = function(e) {
            var t = e.match(/([a-zA-Z])\_\{([^{}]+)\}/),
                n = /^[\\]/.test(e);
            if (null == e) return "&nbsp;";
            if (!t || n) return this._relatedLabels[e] || e;
            var r = this.className + "__button_sub";
            return "<i>" + t[1] + '</i><sub class="' + r + '">' + t[2] + "</sub>"
        }, Object.defineProperties(e.prototype, {
            _relatedLabels: {
                get: function() {
                    if (!this.__relatedLabels) {
                        var e = this.className + "__button" + "__place",
                            t = e + "_small";
                        this.__relatedLabels = { abs: '<div class="' + e + '"/>', alpha: "\u03b1", approx: "\u2248", backspace: "&nbsp;", beta: "\u03b2", empty_score: "\u2205", element_of: "<span>&in;</span>", element_not_of: "<span>&notin;</span>", exp: '<span>e</span><div class="' + t + '"/>', enter: "OK", delta: "\u03b4", delta_capital: "\u0394", derivative: '<div class="' + e + '"/>', factorial: '<div class="' + e + '"/>', frac: '<div class="' + e + '"/><div class="' + e + '"/>', "/": '<div class="' + e + '"/><div class="' + e + '"/>', grad: "\xb0", index: '<div class="' + e + " " + t + '"/>', integral: "\u222b", infinity: "<span>\u221e</span>", integral_d: '<div class="' + t + '"/>\u222b<div class="' + t + '"/>', ksi: "\u03be", less_or_equal: "\u2a7d", left: "&nbsp;", log: "log", lg: "lg", ln: "ln", lim: '<div class="' + t + '"/>lim<div class="' + t + '"/>', mathbb_n: "\u2115", mathbb_q: "\u211a", mathbb_r: "\u211d", mathbb_z: "\u2124", minus_infinity: "&minus;<span>\u221e</span>", more_or_equal: "\u2a7e", neq: "\u2260", pi: "\u03c0", plus_infinity: "+<span>\u221e</span>", pm: "\xb1", power: '<div class="' + e + " " + t + '"/>', "^": '<div class="' + e + " " + t + '"/>', right: "&nbsp;", root: '<div class="' + e + '"/>', root_power: '<div class="' + e + " " + t + '"/><div class="' + e + '"/>', tau: "\u03c4", union: "\u222a", "*": "&middot;", "-": "&minus;", "<=": "&le;", ">=": "&ge;" }
                    }
                    return this.__relatedLabels
                }
            }
        }), e
    }(), this.UchiruKeypad3 = this.UchiruKeypad3 || {}, this.UchiruKeypad3.KeypadQwerty = function() {
        function e(e, t) {
            t = t || {};
            this.opt = t.opt || {}, this.locale = this.opt.locale || "ru", this.KLASS = this.opt.className || "uchiru-keypad-3__keypad-qwerty", this.BUTTON_KLASS = this.KLASS + "__button", this.CAPSED_KLASS = this.KLASS + "__capsed", this.BUTTON_SELECTOR = "." + this.BUTTON_KLASS, this.ACTIVE_KLASS = this.BUTTON_KLASS + "-active", this.MAX_LENGTH = 2048, this.isCaps = !!this.opt.isCaps, this.$parent = e, this.$view = $.div(this.KLASS), this.roles = t.roles, this.events = this._initEvents()
        }
        return e.prototype.init = function() { this._subscribe_desktop(), window.is_browser_mobile() && (this._draw(), this._capsify(), this._subscribe_mobile()) }, e.prototype.destroy = function() { this.$view.remove(), this._buttonsHolder = null, this._unsubscribe() }, e.prototype._draw = function() {
            var e = this,
                t = $.div(e.KLASS + "__background"),
                n = $.div(e.KLASS + "__buttons-holder");
            e.$view.addClass(e.KLASS + "__locale-" + e.locale), e.$view.append(t), e._fill(n), e.$view.appendTo(e.$parent), e.$buttons = e.$view.find(e.BUTTON_SELECTOR)
        }, e.prototype._subscribe_desktop = function() {
            var e = this;
            $(document).on("keypress", e._onKey.bind(e)), $(document).on("keydown", e._onSpecialKey.bind(e))
        }, e.prototype._subscribe_mobile = function() {
            var r = this;
            this.$view.on("click", function(e) { e.stopPropagation() }), this.$view.on(r.events.start, r.BUTTON_SELECTOR, function(e) {
                var t = $(this),
                    n = t.data("key");
                e.stopPropagation(), "caps" == n && (r.isCaps = !r.isCaps, r._capsify()), t.addClass(r.ACTIVE_KLASS)
            }), this.$view.on(r.events.end, r.BUTTON_SELECTOR, function() {
                var e = $(this),
                    t = e.data("key");
                if (e.hasClass(r.KLASS + "__button_disabled")) return !1;
                e.hasClass(r.ACTIVE_KLASS) && r.callback(t)
            }), $(document).on(r.events.end, function() { r.$buttons.removeClass(r.ACTIVE_KLASS) })
        }, e.prototype._unsubscribe = function() { $(document).off("keypress", self._onKey), $(document).off("keydown", self._onSpecialKey) }, e.prototype._onKey = function(e) {
            var t = window.event ? e.keyCode : e.which,
                n = String.fromCharCode(t);
            "function" == typeof this.callback && this.callback(n)
        }, e.prototype._onSpecialKey = function(e) {
            var t = this.__keyCode2Char[e.keyCode];
            t && "function" == typeof this.callback && this.callback(t)
        }, e.prototype._fill = function(e) {
            for (var t = this._checkRoles() ? this.roles : this.constructor.getKeys(this.locale), n = 0, r = t.length; n < r; n++) {
                for (var s = t[n], i = $.div(this.KLASS + "__buttons-line"), o = 0, a = s.length; o < a; o++) this._getButton(s[o]).appendTo(i);
                i.appendTo(e)
            }
            this.$view.append(e)
        }, e.prototype._checkRoles = function() { var e = !1; return (e = !!Array.isArray(this.roles) && (e = this.roles.map(function(e) { return Array.isArray(e) })).every(function(e) { return !0 === e })) || "localhost" !== location.hostname && "127.0.0.1" !== location.hostname || console.warn("wrong keypad set"), e }, e.prototype._getButton = function(e) { var t = $.div(this.BUTTON_KLASS); return t.data("key", e).append(e), -1 !== this.specialKeys.indexOf(e) && (t.addClass(this.BUTTON_KLASS + "-" + e), t.addClass(this.BUTTON_KLASS + "-special"), t.data("is_special", !0)), t }, e.prototype._capsify = function() {
            var s = this;
            s.$view.toggleClass(s.CAPSED_KLASS, s.isCaps), s.$buttons.each(function(e, t) {
                var n = $(t),
                    r = n.data("key");
                n.data("is_special") || (r = s.isCaps ? r.toUpperCase() : r.toLowerCase(), n.data("key", r))
            })
        }, e.prototype._initEvents = function() {
            for (var e = ["touchstart", "mousedown", "MSPointerDown"], t = ["touchend", "mouseup", "MSPointerUp"], n = {}, r = 0, s = e.length; r < s; r++)
                if ("on" + e[r] in window) { n.start = e[r]; break }
            for (r = 0, s = t.length; r < s; r++)
                if ("on" + t[r] in window) { n.end = t[r]; break }
            return n.start || console.warn("WARNING! No start pointer/touch event detected"), n.end || console.warn("WARNING! No end pointer/touch event detected"), n
        }, e.prototype.__keyCode2Char = { 40: "down", 39: "right", 38: "up", 37: "left", 16: "caps", 13: "enter", 9: "tab", 8: "backspace" }, e.getKeys = function(e) {
            return {
                ru: [
                    ["\u0439", "\u0446", "\u0443", "\u043a", "\u0435", "\u043d", "\u0433", "\u0448", "\u0449", "\u0437", "\u0445", "backspace"],
                    ["\u044a", "\u0444", "\u044b", "\u0432", "\u0430", "\u043f", "\u0440", "\u043e", "\u043b", "\u0434", "\u0436", "\u044d"],
                    ["caps", "\u044f", "\u0447", "\u0441", "\u043c", "\u0438", "\u0442", "\u044c", "\u0431", "\u044e", "enter"]
                ],
                en: [
                    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace"],
                    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
                    ["caps", "'", "z", "x", "c", "v", "b", "n", "m", "enter"]
                ]
            }[e]
        }, Object.defineProperties(e.prototype, { specialKeys: { get: function() { return Object.values(this.__keyCode2Char) } } }), e
    }(), this.UchiruKeypad3 = this.UchiruKeypad3 || {}, this.UchiruKeypad3.KeypadManager = function() {
        function e(e, t) {
            var n, r;
            this.place = e, this.options = t || {}, this.locale = this.options.locale || "ru", this.className = "uchiru-keypad-3", this.keypadShow = !!is_browser_mobile() || this.options.show_keypad_on_desktop, this._keypadCallback = null, this._keypadStarted = !1, this._roles = [], this._keypad = null, this._keypadNative = null, this._keypadAlgebra = null, this._keypadBecomeActiveHandler = null, this._keypadResignActiveHandler = null, this._preventDefaultInitialized = !1, this._removeBodyPaddingForKeyboardTimeoutId = null, $(document).bind("keydown", (n = this, function(e) { return n._onKeydown(e) })), $(document).bind("keypress", (r = this, function(e) { return r._onKeypress(e) })), this.keypadShow && $("body").addClass("overflow-y-scroll")
        }
        var r = this.UchiruKeypad3.Keypad,
            s = this.UchiruKeypad3.KeypadNative,
            o = this.UchiruKeypad3.KeypadAlgebra,
            a = this.UchiruKeypad3.KeypadQwerty;
        return e.prototype.onEvents = function(e, t) {
            switch (e) {
                case "__keypad_3_start":
                    return this.keypadStart(t.roles, t.opt, t.callback);
                case "__keypad_3_finish":
                    return this.keypadFinish();
                case "__keypad_3_button_ok_toggle":
                    return this.buttonOkToggle(t.enabled);
                case "__keypad_3_button_ok_wrong":
                    return this.buttonOkWrong();
                case "__keypad_3_button_ok_right":
                    return this.buttonOkRight();
                case "__keypad_3_button_ok_clear":
                    return this.buttonOkClear();
                case "__keypad_3_activate":
                    return this.keypadActivate();
                case "__keypad_3_deactivate":
                    return this.keypadDeactivate();
                case "__keypad_3_prevent_default_init":
                    return this.preventDefaultInit();
                case "__keypad_3_prevent_default_destroy":
                    return this.preventDefaultDestroy();
                case "__keypad_3_emit":
                    return this.emit(t.event, t.eventData)
            }
        }, e.prototype.keypadPause = function() { return this._keypadPaused = !0 }, e.prototype.keypadResume = function() { return this._keypadPaused = !1 }, e.prototype.keypadStart = function(e, t, n) { return null == t && (t = {}), _.isFunction(t) && (_ASSERT(_.isUndefined(n)), n = t, t = {}), _ASSERT("array" === $.type(e)), _ASSERT(0 < e.length), _ASSERT(!this._keypadStarted, "keypadStart() should be called only once"), this._roles = e, this._keypadCallback = n, this._keypadBecomeActiveHandler = t.becomeActive, this._keypadResignActiveHandler = t.resignActive, "algebra" === t.type ? (this._keypadAlgebra = new o(this.place, { className: "uchiru-keypad-3__keypad-algebra", locale: this.locale, roles: this._roles, opt: t }), this._keypadAlgebra.onChar = function(e) { this._onKeypadchar(e) }.bind(this)) : "qwerty" === t.type ? (this._keypadQwerty = new a(this.place, { opt: t, roles: this._roles }), this._keypadQwerty.init(), this._keypadQwerty.callback = n) : this._hasLetters() ? (this._keypadNative = new s(this.place, { className: "uchiru-keypad-3__keypad-native", locale: this.locale, roles: this._roles, opt: t, hidden: !this.keypadShow }), this._keypadNative.onChar = function(e) { this._onKeypadchar(e) }.bind(this), this._keypadNative.onBecomeActive = this._keypadBecomeActiveHandler, this._keypadNative.onResignActive = this._keypadResignActiveHandler) : (this._keypad = new r(this.place, { className: "uchiru-keypad-3__keypad", locale: this.locale, roles: this._roles, opt: t, hidden: !this.keypadShow }), this._keypad.onChar = function(e) { this._onKeypadchar(e) }.bind(this)), this._addBodyPaddingForKeyboard(), this.keypadActivate(), this._keypadStarted = !0 }, e.prototype.keypadFinish = function() { _ASSERT(this._keypadStarted, "Call keypadFinish() only after keypadStart()"), this.keypadDeactivate(), this._removeBodyPaddingForKeyboard(), this._keypadAlgebra ? (this._keypadAlgebra.destroy(), this._keypadAlgebra = null) : this._keypadQwerty ? (this._keypadQwerty.destroy(), this._keypadQwerty = null) : this._keypadNative ? (this._keypadNative.destroy(), this._keypadNative = null) : this._keypad && (this._keypad.destroy(), this._keypad = null), this._keypadBecomeActiveHandler = null, this._keypadResignActiveHandler = null, this._keypadCallback = null, this._roles = [], this._keypadStarted = !1 }, e.prototype.keypadActivate = function() { this._keypadNative ? this._keypadNative.keypadActivate() : this._keypadBecomeActiveHandler && this._keypadBecomeActiveHandler() }, e.prototype.keypadDeactivate = function() { this._keypadNative ? this._keypadNative.keypadDeactivate() : this._keypadResignActiveHandler && this._keypadResignActiveHandler() }, e.prototype.buttonOkToggle = function(e) { return this._keypad ? this._keypad.buttonOkToggle(e) : this._keypadAlgebra ? this._keypadAlgebra.buttonOkToggle(e) : void _ASSERT(!1, "not implemented") }, e.prototype.buttonOkWrong = function() {
            if (this._keypadAlgebra) return this._keypadAlgebra.buttonOkWrong();
            _ASSERT(!1, "not implemented")
        }, e.prototype.buttonOkClear = function() {
            if (this._keypadAlgebra) return this._keypadAlgebra.buttonOkClear();
            _ASSERT(!1, "not implemented")
        }, e.prototype.buttonOkRight = function() {
            if (this._keypadAlgebra) return this._keypadAlgebra.buttonOkRight();
            _ASSERT(!1, "not implemented")
        }, e.prototype.preventDefaultInit = function() { return _ASSERT(!this._preventDefaultInitialized, "preventDefaultInit() should be called only once"), $(document).on("keydown.__uchiru-keypad-3-manager__prevent-default", function(e) { var t; if (t = e.target || e.srcElement, !$(t).is('input[type="text"]') && !$(t).is("textarea") && 8 === e.keyCode) return e.preventDefault() }), this._preventDefaultInitialized = !0 }, e.prototype.preventDefaultDestroy = function() { return _ASSERT(this._preventDefaultInitialized, "Call preventDefaultDestroy() only after preventDefaultInit()"), $(document).off("keydown.__uchiru-keypad-3-manager__prevent-default"), this._preventDefaultInitialized = !1 }, e.prototype.emit = function(e, t) {
            switch (e) {
                case "keydown":
                    _ASSERT("metaKey" in t), _ASSERT("keyCode" in t), _ASSERT("stopPropagation" in t), this._onKeydown(t) || t.stopPropagation();
                    break;
                case "keypress":
                    _ASSERT("metaKey" in t), _ASSERT("which" in t), _ASSERT("stopPropagation" in t), this._onKeypress(t) || t.stopPropagation()
            }
        }, e.prototype._onChar = function(e) { if (null != this._keypadCallback) return this._keypadCallback(e) }, e.prototype._onKeypadchar = function(e) {!this._keypadStarted || this._keypadPaused || this._keypadQwerty || this._onChar(e) }, e.prototype._onKeypress = function(e) { if (this._keypadStarted && !this._keypadPaused && !this._keypadQwerty) { var t = String.fromCharCode(e.which); for (i = 0; i < this.roles.length; i++) { var n = this.roles[i]; if (!e.metaKey && -1 !== this.chars[n].indexOf(t)) { var r = this._localizedChar(t, n); return this._onChar(r), !1 } } } }, e.prototype._onKeydown = function(e) {
            if (this._keypadStarted && !this._keypadPaused && !this._keypadQwerty)
                for (i = 0, l = this.roles.length; i < l; i++) {
                    var t = this.roles[i],
                        n = this.keyCode2Char[t][e.keyCode];
                    if (!e.metaKey && n) { var r = this._localizedChar(n, t); return this._onChar(r), !1 }
                }
            return !0
        }, e.prototype._localizedChar = function(e, t) { return this._keypadAlgebra ? this._keypadAlgebra.localizedChar(e, t) : this._keypadNative ? this._keypadNative.localizedChar(e, t) : this._keypadQwerty ? this._keypadQwerty.localizedChar(e, t) : this._keypad ? this._keypad.localizedChar(e, t) : e }, e.prototype._addBodyPaddingForKeyboard = function() { this._keypad && (this._clearDeferredRemoveBodyPadding(), $("body").css({ marginBottom: this._keypad.height })), this._keypadAlgebra && (this._clearDeferredRemoveBodyPadding(), $("body").css({ marginBottom: this._keypadAlgebra.height })) }, e.prototype._removeBodyPaddingForKeyboard = function() { this._keypad && this._deferredRemoveBodyPadding(function() { $("body").css({ marginBottom: "" }) }), this._keypadAlgebra && this._deferredRemoveBodyPadding(function() { $("body").css({ marginBottom: "" }) }) }, e.prototype._clearDeferredRemoveBodyPadding = function() { this._removeBodyPaddingForKeyboardTimeoutId && (clearTimeout(this._removeBodyPaddingForKeyboardTimeoutId), this._removeBodyPaddingForKeyboardTimeoutId = null) }, e.prototype._deferredRemoveBodyPadding = function(e) { this._clearDeferredRemoveBodyPadding(), this._removeBodyPaddingForKeyboardTimeoutId = setTimeoutOrig(function() { e() }, 0) }, e.prototype._hasLetters = function() { return this._hasRole("letters_ru") || this._hasRole("letters_en") }, e.prototype._hasRole = function(e) { return _ASSERT(void 0 !== e), -1 != this._roles.indexOf(e) }, Object.defineProperties(e.prototype, { roles: { get: function() { return this._keypadAlgebra ? this._keypadAlgebra.roles : this._keypadQwerty ? this._keypadQwerty.roles : this._keypadNative ? this._keypadNative.roles : this._keypad ? this._keypad.roles : void 0 } }, keyCode2Char: { get: function() { return this._keypadAlgebra ? this._keypadAlgebra.keyCode2Char : this._keypadQwerty ? this._keypadQwerty.keyCode2Char : this._keypadNative ? this._keypadNative.keyCode2Char : this._keypad ? this._keypad.keyCode2Char : void 0 } }, chars: { get: function() { return this._keypadAlgebra ? this._keypadAlgebra.chars : this._keypadNative ? this._keypadNative.chars : this._keypad ? this._keypad.chars : void 0 } } }), e
    }(),
    function() {
        ! function() {
            var e, t, n, r, s, i, o, a;
            s = null != (r = null != this.UchiruPopups ? this.UchiruPopups : this.UchiruPopups = {}).Require100PercentZoom ? r.Require100PercentZoom : r.Require100PercentZoom = {}, e = function() {
                function e(e) {
                    var t, n, r, s;
                    this.text = (null != e ? e : {}).text, null == this.type && (this.type = "next"), this.text = _.extend({}, i, this.text), _ASSERT("default" === (t = this.type) || "next" === t), this.view = $("<div>"), this.onClick = null, this.label = $("<span>").appendTo(this.view), "next" === this.type ? (a(this.view, o.buttonNext), a($("<div>"), o.buttonNextArrow).appendTo(this.view)) : a(this.view, o.buttonDefault), this.view[0].style.setProperty("font-family", "Noto Sans", "important"), this.view.hover((r = this, function() { return r.hovered = !0 }), (n = this, function() { return n.hovered = !1 })), this.view.click((s = this, function() { return "function" == typeof s.onClick ? s.onClick() : void 0 })), this.update()
                }
                return e.prototype.destroy = function() {}, e.prototype.update = function() { return this.label.html(n(this.text)), this.hovered ? "next" === this.type ? a(this.view, [o.buttonNext, o.buttonNextHover]) : a(this.view, [o.buttonDefault, o.buttonDefaultHover]) : "next" === this.type ? a(this.view, [o.buttonNext]) : a(this.view, [o.buttonDefault]) }, Object.defineProperties(e.prototype, { hovered: { get: function() { return null == this._hovered && (this._hovered = !1), this._hovered }, set: function(e) { return this._hovered !== e && (this._hovered = e, this.update()), this._hovered } } }), e
            }(), t = { arrow_white: window.fp_asset_host + "/fat_player/common/uchiru-popups/require-100-percent-zoom/src/img/arrow_white-57795cfad1822d3d12964350307a1a6f241f26d4814e42be28e891ef282bbee5.svg", arrow_blue: window.fp_asset_host + "/fat_player/common/uchiru-popups/require-100-percent-zoom/src/img/arrow_blue-f0fe8ef1c37279a1b936b6353aeea0b438c91a867a484c8ceb23ec63c1b1413e.svg" }, o = { buttonDefault: { position: "absolute", display: "inline-block", padding: "3px 15px 3px", borderRadius: 7, textAlign: "center", fontSize: 24, textDecoration: "none", background: "#6ac4e4", color: "white", cursor: "pointer", transition: "background-color 0.2s easy-in", top: 410, left: "50%", transform: "translate(-50%, 0)", whiteSpace: "nowrap" }, buttonDefaultHover: { backgroundColor: "#54bbe0" }, buttonNext: { position: "absolute", display: "inline-block", padding: "1px 15px 1px", borderRadius: 7, textAlign: "center", fontSize: 24, textDecoration: "none", background: "rgb(255, 255, 255)", border: "2px solid rgb(106, 196, 228)", color: "rgb(106, 196, 228)", cursor: "pointer", transition: "background-color 0.2s easy-in", top: 410, left: "50%", transform: "translate(-50%, 0)", whiteSpace: "nowrap", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }, buttonNextHover: { borderColor: "#54bbe0", color: "#54bbe0" }, buttonNextArrow: { position: "relative", display: "inline-block", backgroundImage: "url(" + t.arrow_blue + ")", backgroundRepeat: "no-repeat", width: 10, height: 16, backgroundPosition: -12, marginBottom: -1, marginLeft: 5 } }, n = function(e) { return e[I18n.locale] || e.en || e.ru }, i = { ru: "\u0414\u0430\u043b\u044c\u0448\u0435", tat: "\u0414\u0430\u043b\u044c\u0448\u0435", en: "Next", pt: "Mais", hi: "Next", tn: "Next", zu: "Next", ch: "\u7ee7\u7eed" }, a = function(e, t) { var n; return console.log(t.backgroundImage), n = Array.isArray(t) ? _.extend.apply(_, [{}].concat(t)) : t, e.css(n) }, s.Button = e
        }()
    }.call(this),
    function() {
        ! function() {
            var n, e, t, r, s, i, o, a, c;
            i = null != (s = null != this.UchiruPopups ? this.UchiruPopups : this.UchiruPopups = {}).Require100PercentZoom ? s.Require100PercentZoom : s.Require100PercentZoom = {}, n = this.UchiruPopups.Require100PercentZoom.Button, t = function() {
                function e(e) {
                    var t;
                    null == e && (e = {}), this.view = c($("<div>"), a.container), this.onClick = null, this.content = c($("<div>"), a.content).appendTo(this.view), this.img = c($("<div>"), a.img).appendTo(this.content), this.text = c($("<div>"), a.text).appendTo(this.content), this.text[0].style.setProperty("font-family", "Noto Sans", "important"), this.text.html(r()), this.button = new n({ text: e.buttonText }), this.button.view.appendTo(this.content), this.button.onClick = (t = this, function() { return "function" == typeof t.onClick ? t.onClick() : void 0 })
                }
                return e.prototype.destroy = function() {}, e
            }(), o = navigator.appVersion.indexOf("Mac") + 1 ? "mac_keypad" : "win_keypad", e = { cloud: window.fp_asset_host + "/fat_player/common/uchiru-popups/require-100-percent-zoom/src/img/cloud-3f41e35235a9928df4b2168997fd59f0cc6df79ebd8a19e73b75240551ccd42a.svg", win_keypad: { width: 717, height: 239, path: window.fp_asset_host + "/fat_player/common/uchiru-popups/require-100-percent-zoom/src/img/win_keypad-42f48fb3471d17cdebb8c40e584675ee5be305e85a8822c4e38754b181ac9ab1.svg" }, mac_keypad: { width: 660, height: 276, path: window.fp_asset_host + "/fat_player/common/uchiru-popups/require-100-percent-zoom/src/img/mac_keypad-37bd1c0eb9024ec27da3e066c853f4c5e735de398eb4c6e354dd673a974eb378.svg" } }, a = { container: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(90, 194, 226, 0.75)", zIndex: 1e4 }, content: { position: "absolute", top: 110, left: "50%", transform: "translate(-50%, 0)", fontSize: 24, width: 887, height: 518, backgroundSize: "887px 518px", backgroundPosition: "center center", backgroundImage: "url(" + e.cloud + ")", backgroundRepeat: "no-repeat" }, text: { whiteSpace: "nowrap", position: "absolute", top: 60, left: "50%", transform: "translate(-50%, 0)" }, img: { position: "absolute", width: e[o].width, height: e[o].height, top: 155, left: "50%", transform: "translate(-50%, 0)", backgroundSize: e[o].width + "px " + e[o].height + "px", backgroundPosition: "center center", backgroundImage: "url(" + e[o].path + ")", backgroundRepeat: "no-repeat" } }, c = function(e, t) { var n; return n = Array.isArray(t) ? _.extend.apply(_, [{}].concat(t)) : t, e.css(n) }, r = function() {
                var e;
                return (e = {
                    ru: "\u0427\u0442\u043e\u0431\u044b \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0440\u0430\u0431\u043e\u0442\u0430\u043b\u0430 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e,<br>\u043d\u0430\u0436\u043c\u0438 \u043e\u0434\u043d\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u044d\u0442\u0438 \u043a\u043d\u043e\u043f\u043a\u0438",
                    en: "For the next task to work properly,<br>press these buttons together",
                    pt: "Para que este cart\xe3o funcione corretamente,<br>pressione simult\xe2neamente esses bot\xf5es",
                    hi: "For the next task to work properly,<br>press these buttons together",
                    tn: "For the next task to work properly,<br>press these buttons together",
                    zu: "For the next task to work properly,<br>press these buttons together",
                    ch: "\u4e3a\u4e86\u4e0b\u4e00\u5f20\u5361\u7247\u6b63\u5e38\u5de5\u4f5c\uff0c\u8bf7\u540c\u65f6\u6309\u4e0b\u8fd9\u4e9b\u6309\u94ae",
                    ind: "Agar tugas berikutnya berfungsi dengan baik,<br>silakan tekan tombol-tombol ini bersama"
                })[I18n.locale] || e.en || e.ru
            }, i.Popup = t
        }()
    }.call(this),
    function() {
        ! function() {
            var n, e, t, r;
            r = null != (t = null != this.UchiruPopups ? this.UchiruPopups : this.UchiruPopups = {}).Require100PercentZoom ? t.Require100PercentZoom : t.Require100PercentZoom = {}, n = this.UchiruPopups.Require100PercentZoom.Popup, e = function() {
                function e(e) { this.place = e }
                return e.prototype.run = function(e) { var t; { if (!is_browser_mobile()) return this.popup = new n({ buttonText: Card.__meta.supports.require_100_percent_zoom_popup.button }), this.popup.view.appendTo(this.place), this.popup.view.hide(), this.popup.view.fadeIn(300, (t = this, function() { return t.popup.onClick = function() { return t.popup.view.fadeOut(300, function() { return t.popup.destroy(), t.popup.view.remove(), "function" == typeof e ? e() : void 0 }) } })); "function" == typeof e && e() } }, e
            }(), r.Runner = e
        }()
    }.call(this),
    function() {
        var c;
        this.Card || (this.Card = {}), (c = this.Card).Messaging = { _started: !1, run: function() { return this._locationOriginPolyfill(), this._ASSERT(!this._started, "[messaging] already starded"), this._started = !0, addEventListener("message", this._messageHandler, !1) }, clear: function() { if (this._started) return removeEventListener("message", this._messageHandler, !1), this._started = !1 }, _ASSERT: function(e, t) { var n; if (null == t && (t = null), !e) throw n = new Error("dummy"), console.log(n.stack), "Runtime Error: " + t }, _messageHandler: function(e) { var t, n, r, s, i, o, a; if (location.origin && e.origin === location.origin && (s = e.source, r = e.origin, n = e.data, _.isObject(n) && (o = n.kind, t = n.data, null != o))) return (a = o.match(/^uchi\.card\.player\.(.*)$/)) && (i = a[1]) ? c.Player.event(i, t, { postMessage: function(e, t) { return s.postMessage({ kind: "uchi.card.player." + e, data: t }, r) } }, function() {}) : void 0 }, _locationOriginPolyfill: function() { if (null == location.origin) return location.origin = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") } }, c.Messaging._messageHandler = c.Messaging._messageHandler.bind(c.Messaging)
    }.call(this),
    function(e) {
        var t;
        (e.Player1 || (e.Player1 = {})).MessageTunnel = (function(e) {
            function o(e) { if (e) return { name: e.name, message: e.message } }

            function n(e) { if (e) { var t = new Error(e.message); return t.name = e.name, t } }

            function t() { return window.self !== window.top ? s(window.parent) : undefined }

            function s(e) { for (var t = 0, n = u; t < n.length; t++) { var r = n[t]; if (r.getTarget() === e) return r } var s = new _(e); return u.push(s), s }

            function r(e, t, n) { s(e).setListener(t, n) }

            function i(e, t) { s(e).removeListener(t) }

            function a(e, t, n, r) { s(e).sendMessage(t, n, r) }

            function c(e) { e.data instanceof Object && "MessageTunnel" === e.data.via && ("_pong" === e.data.name ? s(e.source).pongReceived(e.data) : s(e.source).messageReceived(e.data, e.origin)) }
            var u = [],
                _ = function() {
                    function e(e) { this._listeners = {}, this._pings = {}, this._nextPingId = 0, this._target = e }
                    return e.prototype.getTarget = function() { return this._target }, e.prototype.setListener = function(e, t) { e && t ? this._listeners[e] = t : console.log("Warning: Cannot add listener.") }, e.prototype.removeListener = function(e) { delete this._listeners[e] }, e.prototype.sendMessage = function(e, t, n) {
                        if (!e || "_pong" === e) throw new Error("Name is invalid.");
                        var r = { name: e, id: this._addPing(n), payload: t, via: "MessageTunnel" };
                        this._target.postMessage(r, "*")
                    }, e.prototype.messageReceived = function(r, s) {
                        var i = this,
                            e = this._listeners[r.name];
                        e && e(r.payload, function(e, t) {
                            var n = { name: "_pong", id: r.id, error: o(e), payload: t, via: "MessageTunnel" };
                            i._target.postMessage(n, s)
                        })
                    }, e.prototype.pongReceived = function(e) {
                        var t = this._pings[e.id];
                        t && t(n(e.error), e.payload), delete this._pings[e.id]
                    }, e.prototype._pingTimeout = function(e) {
                        var t = this._pings[e];
                        if (t) {
                            var n = new Error("Message timed out.");
                            n.name = "TimeoutError", t(n)
                        }
                        delete this._pings[e]
                    }, e.prototype._addPing = function(e) { var t = this; if (e) { var n = this._nextPingId; return this._nextPingId++, this._pings[n] = e, setTimeout(function() { t._pingTimeout(n) }, 4e3), n } }, e
                }();
            e.Portal = _, e.getParentPortal = t, e.getPortal = s, e.setListener = r, e.removeListener = i, e.sendMessage = a, window.addEventListener("message", c)
        }(t || (t = {})), t)
    }(this.Card),
    function() {
        var e, t, n;
        e = this.Card, n = null != e.Player1 ? e.Player1 : e.Player1 = {}, t = function() {
            function e(e) {
                var t, n, r, s, i;
                t = e.cardMeta, s = e.localStorageKey, r = e.eventsUrl, n = e.data, this._key = s, this._eventsUrl = r, this._data = _.extend({}, null != (i = t.game) ? i.data : void 0, n), console.log("[GAME] gameData", this.data)
            }
            return e.prototype.store = function(e) { var t; if ((t = this._key) && window.localStorage) try { return window.localStorage[t] = JSON.stringify(e) } catch (n) {} }, e.prototype.restore = function() {
                var e, t;
                if (e = null, (t = this._key) && window.localStorage && window.localStorage[t]) try { e = JSON.parse(window.localStorage[t]) } catch (n) { console.log("Bad news: couldn't restore from localStorage"), e = null }
                return e
            }, e.prototype.navigateToUrl = function(e) { return window.location = e }, e.prototype.event = function(e, t, r) {
                if (null == t && (t = {}), _.isFunction(t) && (_ASSERT(_.isUndefined(r)), r = t, t = {}), console.log("[GAME] event:", e, t), this._eventsUrl) return $.ajax({ url: this._eventsUrl, type: "POST", timeout: 5e3, contentType: "application/json", dataType: "json", data: JSON.stringify(t), success: function(e, t) { var n; return "ok" === (n = e.status) ? r(null) : (console.log("[GAME] event wrongStatus: ", e, t), r(n || "wrong_status")) }, error: function(e, t) { return console.log("[GAME] event ajaxError: ", e.responseJSON, t), r("ajax_error") } });
                r(null)
            }, e.prototype.destroy = function() {}, Object.defineProperties(e.prototype, { data: { get: function() { return this._data } } }), e
        }(), n.Game = t
    }.call(this),
    function() {
        var e, r, t, n, s;
        e = this.Card, s = null != (n = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? n.IframeScript : n.IframeScript = {}, t = n.MessageTunnel, r = { Event: { onEvent: null }, emit: function(e, t) { var n; return "function" == typeof(n = this.Event).onEvent ? n.onEvent(e, t) : void 0 } }, Object.defineProperties(r, { onEvent: { get: function() { return this.Event.onEvent }, set: function(e) { return this.Event.onEvent = e } } }), r.initMessaging = function(e) { return t.setListener(e, "Player.Event.emit", function(e) { var t, n; return t = e.kind, n = e.params, r.emit(t, n) }) }, r.destroyMessaging = function(e) { return t.removeListener(e, "Player.Event.emit") }, s.Event = r
    }.call(this),
    function() {
        var e, r, s, t, n;
        e = this.Card, n = null != (t = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? t.IframeScript : t.IframeScript = {}, r = t.MessageTunnel, s = { PlayButton: { onEvent: null }, run: function(e) { var t; return "function" == typeof(t = this.PlayButton).onEvent ? t.onEvent("__play_button", { mode: "request", cb: e }) : void 0 } }, Object.defineProperties(s, { onEvent: { get: function() { return this.PlayButton.onEvent }, set: function(e) { return this.PlayButton.onEvent = e } } }), s.initMessaging = function(n) { return r.setListener(n, "Player.PlayButton.run", function(e, t) { return s.run(function(e) { return r.sendMessage(n, "Player.PlayButton.run#callback", { options: e }) }), t(null) }) }, s.destroyMessaging = function(e) { return r.removeListener(e, "Player.PlayButton.run") }, n.PlayButton = s
    }.call(this),
    function() {
        var e, s, i, t, n;
        e = this.Card, n = null != (t = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? t.IframeScript : t.IframeScript = {}, i = t.MessageTunnel, s = { Keypad: { onEvent: null }, addTargetElement: function(e) { var t, n; return e.on("keydown.__playerIframeDynamic__keypad__addTargetElement", (t = this, function(e) { return t.emitKeydown("keydown", { metaKey: e.metaKey, keyCode: e.keyCode, stopPropagation: function() { return e.stopPropagation() } }) })), e.on("keypress.__playerIframeDynamic__keypad__addTargetElement", (n = this, function(e) { return n.emitKeypress("keypress", { metaKey: e.metaKey, which: e.which, stopPropagation: function() { return e.stopPropagation() } }) })) }, removeTargetElement: function(e) { return e.off("keydown.__playerIframeDynamic__keypad__addTargetElement"), e.off("keypress.__playerIframeDynamic__keypad__addTargetElement") }, start: function(e, t, n) { var r; return null == t && (t = {}), "function" == typeof(r = this.Keypad).onEvent ? r.onEvent("__keypad_3_start", { roles: e, opt: t, callback: n }) : void 0 }, finish: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_finish") : void 0 }, buttonOkToggle: function(e) { var t; return "function" == typeof(t = this.Keypad).onEvent ? t.onEvent("__keypad_3_button_ok_toggle", { enabled: e }) : void 0 }, buttonOkWrong: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_button_ok_wrong") : void 0 }, buttonOkRight: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_button_ok_right") : void 0 }, buttonOkClear: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_button_ok_clear") : void 0 }, activate: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_activate") : void 0 }, deactivate: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_deactivate") : void 0 }, preventDefaultInit: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_prevent_default_init") : void 0 }, preventDefaultDestroy: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_prevent_default_destroy") : void 0 }, emitKeydown: function(e, t) { var n; return "function" == typeof(n = this.Keypad).onEvent ? n.onEvent("__keypad_3_emit", { event: e, eventData: t }) : void 0 }, emitKeypress: function(e, t) { var n; return "function" == typeof(n = this.Keypad).onEvent ? n.onEvent("__keypad_3_emit", { event: e, eventData: t }) : void 0 } }, Object.defineProperties(s, { onEvent: { get: function() { return this.Keypad.onEvent }, set: function(e) { return this.Keypad.onEvent = e } } }), s.initMessaging = function(r) { return i.setListener(r, "Player.Keypad.emitKeydown", function(e) { var t, n; return t = e.event, n = e.eventData, n = _.extend({}, n, { stopPropagation: function() { return i.sendMessage(r, "Player.Keypad.emitKeydown#stopPropagation") } }), s.emitKeydown(t, n) }), i.setListener(r, "Player.Keypad.emitKeypress", function(e) { var t, n; return t = e.event, n = e.eventData, n = _.extend({}, n, { stopPropagation: function() { return i.sendMessage(r, "Player.Keypad.emitKeypress#stopPropagation") } }), s.emitKeypress(t, n) }), i.setListener(r, "Player.Keypad.start", function(e) { var t, n; return n = e.roles, t = e.opt, s.start(n, t, function(e) { return i.sendMessage(r, "Player.Keypad.start#callback", { "char": e }) }) }), i.setListener(r, "Player.Keypad.finish", function() { return s.finish() }), i.setListener(r, "Player.Keypad.buttonOkToggle", function(e) { var t; return t = e.enabled, s.buttonOkToggle(t) }), i.setListener(r, "Player.Keypad.buttonOkWrong", function() { return s.buttonOkWrong() }), i.setListener(r, "Player.Keypad.buttonOkRight", function() { return s.buttonOkRight() }), i.setListener(r, "Player.Keypad.buttonOkClear", function() { return s.buttonOkClear() }), i.setListener(r, "Player.Keypad.activate", function() { return s.activate() }), i.setListener(r, "Player.Keypad.deactivate", function() { return s.deactivate() }), i.setListener(r, "Player.Keypad.preventDefaultInit", function() { return s.preventDefaultInit() }), i.setListener(r, "Player.Keypad.preventDefaultDestroy", function() { return s.preventDefaultDestroy() }) }, s.destroyMessaging = function(e) { return i.removeListener(e, "Player.Keypad.emitKeydown"), i.removeListener(e, "Player.Keypad.emitKeypress"), i.removeListener(e, "Player.Keypad.start"), i.removeListener(e, "Player.Keypad.finish"), i.removeListener(e, "Player.Keypad.buttonOkToggle"), i.removeListener(e, "Player.Keypad.buttonOkWrong"), i.removeListener(e, "Player.Keypad.buttonOkRight"), i.removeListener(e, "Player.Keypad.buttonOkClear"), i.removeListener(e, "Player.Keypad.activate"), i.removeListener(e, "Player.Keypad.deactivate"), i.removeListener(e, "Player.Keypad.preventDefaultInit"), i.removeListener(e, "Player.Keypad.preventDefaultDestroy") }, n.Keypad = s
    }.call(this),
    function() {
        var e, t, r, n, s;
        e = this.Card, s = null != (n = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? n.IframeScript : n.IframeScript = {}, t = n.MessageTunnel, r = {
            store: function(e) { if (window.__olymp && window.localStorage) { try { window.localStorage[window.__olymp.key] = JSON.stringify(e) } catch (t) {} return window.__olymp.answer = JSON.stringify(e) } },
            restore: function() {
                var e;
                if (e = null, window.__olymp && window.localStorage && window.localStorage[window.__olymp.key]) try { e = JSON.parse(window.localStorage[window.__olymp.key]) } catch (t) { console.log("Bad news: couldn't restore from localStorage"), e = null }
                return e
            },
            userEvent: function(e, t) { if (null == t && (t = {}), window.__olymp && window.__olymp.cb) return window.__olymp.cb(e, t) },
            wasSolvedOnce: function() { var t; return t = this.restore() || {}, !! function() { try { return null != t.answer } catch (e) {} }() },
            initMessaging: function(e) { return t.setListener(e, "Player.Olymp.store", function(e) { var t; return t = e.data, r.store(t) }), t.setListener(e, "Player.Olymp.restore", function(e, t) { return t(null, { data: r.restore() }) }), t.setListener(e, "Player.Olymp.userEvent", function(e) { var t, n; return t = e.kind, n = e.options, r.userEvent(t, n) }), t.setListener(e, "Player.Olymp.wasSolvedOnce", function(e, t) { return t(null, { res: r.wasSolvedOnce() }) }) },
            destroyMessaging: function(e) { return t.removeListener(e, "Player.Olymp.store"), t.removeListener(e, "Player.Olymp.restore"), t.removeListener(e, "Player.Olymp.userEvent"), t.removeListener(e, "Player.Olymp.wasSolvedOnce") }
        }, s.Olymp = r
    }.call(this),
    function() {
        var e, s, i, t, n;
        e = this.Card, n = null != (t = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? t.IframeScript : t.IframeScript = {}, i = t.MessageTunnel, s = { AudioManager: { onEvent: null, audioManager: null, _sounds: {} }, play: function(e, t) { return this.AudioManager.audioManager.play(e, t) }, unload: function() { return this.AudioManager.audioManager.unload() } }, Object.defineProperties(s, { onEvent: { get: function() { return this.AudioManager.onEvent }, set: function(e) { return this.AudioManager.onEvent = e } }, audioManager: { get: function() { return this.AudioManager.audioManager }, set: function(e) { return this.AudioManager.audioManager = e } } }), s.initMessaging = function(r) { return i.setListener(r, "Player.AudioManager.play", function(e) { var t, n; return t = e.name, n = e.seqNum, s.play(t, function() { return i.sendMessage(r, "Player.AudioManager.play#callback", { seqNum: n }) }) }), i.setListener(r, "Player.AudioManager.unload", function() { return s.unload() }) }, s.destroyMessaging = function(e) { return i.removeListener(e, "Player.AudioManager.play"), i.removeListener(e, "Player.AudioManager.unload") }, n.AudioManager = s
    }.call(this),
    function() {
        var e, i, t, o, n;
        e = this.Card, n = null != (t = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? t.IframeScript : t.IframeScript = {}, i = t.MessageTunnel, o = { SpeakerManager: { onEvent: null, speakerManager: null }, say: function(e, t, n) { return null == t && (t = {}), this.SpeakerManager.speakerManager.say(e, t, n) }, speaking: function() { return this.SpeakerManager.speakerManager.speaking() }, stop: function() { return this.SpeakerManager.speakerManager.stop() }, destroy: function() { return this.SpeakerManager.speakerManager.destroy() } }, Object.defineProperties(o, { onEvent: { get: function() { return this.SpeakerManager.onEvent }, set: function(e) { return this.SpeakerManager.onEvent = e } }, speakerManager: { get: function() { return this.SpeakerManager.speakerManager }, set: function(e) { return this.SpeakerManager.speakerManager = e } } }), o.initMessaging = function(s) { return i.setListener(s, "Player.SpeakerManager.say", function(e) { var t, n, r; return t = e.label, n = e.opt, r = e.seqNum, o.say(t, n, function() { return i.sendMessage(s, "Player.SpeakerManager.say#callback", { seqNum: r }) }) }), i.setListener(s, "Player.SpeakerManager.speaking", function(e, t) { return t(null, { speaking: o.speaking() }) }), i.setListener(s, "Player.SpeakerManager.stop", function() { return o.stop() }), i.setListener(s, "Player.SpeakerManager.destroy", function() { return o.destroy() }) }, o.destroyMessaging = function(e) { return i.removeListener(e, "Player.SpeakerManager.say"), i.removeListener(e, "Player.SpeakerManager.speaking"), i.removeListener(e, "Player.SpeakerManager.stop"), i.removeListener(e, "Player.SpeakerManager.destroy") }, n.SpeakerManager = o
    }.call(this),
    function() {
        var e, f, m, t, y, g, v, b, k, n, A, r, s = function(e, t) { return function() { return e.apply(t, arguments) } };
        e = this.Card, r = null != (k = null != e.Player1 ? e.Player1 : e.Player1 = {}).IframeScript ? k.IframeScript : k.IframeScript = {}, g = k.MessageTunnel, t = k.IframeScript, m = t.Event, b = t.PlayButton, y = t.Keypad, v = t.Olymp, f = t.AudioManager, A = t.SpeakerManager, n = function() {
            function e(e, t) {
                var n;
                this.place = e, null == t && (t = {}), this._onEvent = s(this._onEvent, this), this._options = t, _ASSERT(null != this._options.locale), _ASSERT(null != this._options.publicPath), _ASSERT(null != this._options.isRenderIframeScriptFromCard), _ASSERT(null != this._options.cardId), _ASSERT(null != this._options.scriptId), _ASSERT(null != this._options.version), _ASSERT(null != this._options.onExerciseSoftEnd), _ASSERT(null != this._options.onExerciseEnd), _ASSERT(null != this._options.onEvent), n = this._options, this.speechManager = n.speechManager, this.audioManager = n.audioManager, this.speakerManager = n.speakerManager, this.softEndExecuted = !1, m.onEvent = this._onEvent, y.onEvent = this._onEvent, b.onEvent = this._onEvent, f.audioManager = this.audioManager, A.speakerManager = this.speakerManager
            }
            return e.prototype.run = function(e, t) { var n, r, s, i, o, a, c; return this.salt = e, null == t && (t = null), s = (i = this._options).publicPath, a = i.version, n = i.cardId, o = i.scriptId, r = this._prepareOptions(this.salt), this._runScript(this.place, s, a, n, o, r, (c = this, function() { return c.exerciseEnd(), "function" == typeof t ? t() : void 0 })) }, e.prototype.exerciseSoftEnd = function() { var e; return e = this._options.onExerciseSoftEnd, this.softEndExecuted = !0, e() }, e.prototype.exerciseEnd = function() { var e, t, n; return t = (n = this._options).onExerciseSoftEnd, e = n.onExerciseEnd, this.softEndExecuted || (this.softEndExecuted = !0, t()), e() }, e.prototype._onEvent = function(e, t) { return this._options.onEvent(e, t) }, e.prototype._prepareOptions = function(e) { var t; return (t = {}).salt = e, t.scriptId = this._options.scriptId, t.locale = this._options.locale, null != this._options.cardMeta && (t.cardMeta = this._options.cardMeta), t.speechOn = this._options.speechOn, t.studentName = this._options.studentName, this._options.olymp_answer && (t.olymp_answer = this._options.olymp_answer, t.olymp_answer_value = this._options.olymp_answer_value), t }, e.prototype._iframeSrc = function(e, t, n, r) { return this._options.isRenderIframeScriptFromCard ? e + "/" + t + "/" + n + "/" + r + "_script/index.html" : e + "/" + t + "/" + r + "_script/index.html" }, e.prototype._runScript = function(n, e, t, r, s, i, o) {
                var a, c, u, _, l, d, p, h;
                return this._clearPlace(n), l = this._getSize(i), (c = $("<div>").prependTo(n)).css({ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, background: "white" }), a = $("<iframe>", { src: this._iframeSrc(e, t, r, s), "class": "uchi-frame", scrolling: "no", frameborder: 0, width: l.width, height: l.height }).prependTo(n)[0], $(a).css({ verticalAlign: "top" }), p = this, _ = function() { return p._resize(a, n, i) }, console.log("Player.uchiruPlaceCurrentLoader?", null != k.uchiruPlaceCurrentLoader), null != k.uchiruPlaceCurrentLoader || (u = setTimeout(function() { return u = null, k.uchiruPlaceAddLoader(n) }, 600)), m.initMessaging(this._getContent(a)), b.initMessaging(this._getContent(a)), y.initMessaging(this._getContent(a)), v.initMessaging(this._getContent(a)), f.initMessaging(this._getContent(a)), A.initMessaging(this._getContent(a)), d = !1, a.onload = (h = this, function() {
                    var t;
                    if (!d) return d = !0, h._ScriptResize.scriptResize(_), h._showContainer(n, i), g.sendMessage(h._getContent(a), "Player.focus"), g.sendMessage(h._getContent(a), "Player.onbeforeunload"), g.setListener(h._getContent(a), "Player.onbeforeunload#callback", function(e) { return e.err, e.res, window.location.reload() }), t = function() { return g.removeListener(h._getContent(a), "Player.onbeforeunload#callback") }, window.addEventListener("beforeunload", t), g.sendMessage(h._getContent(a), "Player.play", { options: i }, function() { return _(), null != u && clearTimeout(u), (u = null) != k.uchiruPlaceCurrentLoader && k.uchiruPlaceRemoveLoader(n), c.animate({ opacity: 0 }, 300).promise().done(function() { return c.remove() }) }), g.setListener(h._getContent(a), "Player.play#exerciseSoftEnd", function(e) { return e.err, e.res, h.exerciseSoftEnd() }), g.setListener(h._getContent(a), "Player.play#callback", function(e) { return e.err, e.res, h._hideContainer(n, i, function() { return g.removeListener(h._getContent(a), "Player.play#callback"), g.removeListener(h._getContent(a), "Player.play#exerciseSoftEnd"), window.removeEventListener("beforeunload", t), A.destroyMessaging(h._getContent(a)), f.destroyMessaging(h._getContent(a)), v.destroyMessaging(h._getContent(a)), y.destroyMessaging(h._getContent(a)), b.destroyMessaging(h._getContent(a)), m.destroyMessaging(h._getContent(a)), o(null) }) });
                    window.location.reload()
                })
            }, e.prototype._clearPlace = function(e) { return _(e.children()).chain().map(function(e) { return $(e) }).filter(function(e) { return !(null != k.uchiruPlaceCurrentLoader && e.is(k.uchiruPlaceCurrentLoader)) }).each(function(e) { return e.remove() }) }, e.prototype._getContent = function(e) { return e.contentWindow || e.contentDocument.document || e.contentDocument }, e.prototype._getSize = function(e) { var t, n; return e.olymp_answer ? (n = 620, t = 250) : e.fullscreen ? (n = 1024, t = 640) : (n = 1024, t = 560), { width: n, height: t } }, e.prototype._resize = function(e, t, n) { var r, s, i; return s = this._getSize(n), n.olymp_answer ? (i = this._getContent(e).document.body.scrollWidth, r = this._getContent(e).document.body.scrollHeight) : (i = s.width, r = s.height), $(e).width(Math.max(i, t.width())), $(e).height(Math.max(r, t.height())) }, e.prototype._ScriptResize = { scriptResize: function(e) { return $(window).resize(e), $(window).on("orientationchange", e), e() }, scriptResizeClear: function(e) { return $(window).off("orientationchange", e), $(window).off("resize", e) } }, e.prototype._showContainer = function(e, t, n) { var r; return "test" === (r = t.progress) || "beads" === r || "grade_test" === r || "grade_test_v2" === r || "grade_test_hn" === r || "adaptive" === r ? e.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { return e.css({ opacity: "" }), "function" == typeof n ? n(null) : void 0 }) : "function" == typeof n ? n(null) : void 0 }, e.prototype._hideContainer = function(e, t, n) { return "beads" === t.progress ? setTimeout(function() { return e.animate({ opacity: 0 }, 300, function() { return e.css({ opacity: "" }), "function" == typeof n ? n(null) : void 0 }) }, 500) : "function" == typeof n ? n(null) : void 0 }, e
        }(), r.Script = n
    }.call(this),
    function(e, t) { e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {}), e.uchiru.progressors["default"] = { isClearing: !0, callbackName: "on_beads", placeClassName: function() { return "uchiru-place" }, fixedPlaceClassName: function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, draw_sbs: function() { console.log("TODO: impl it") }, showWelcomeScreen: function() { var e = t.Deferred(); return e.resolve(), e.promise() }, afterPlayOneExercise: function() { var e = t.Deferred(); return e.resolve(), e.promise() }, beforeNextRun: function(e, t) { t() }, lessonStartParams: function(e, t, n, r) { return n ? { total: r, amount: n.current } : { total: r, amount: 0 } }, getScoreSubscriberConstructor: function(e) { return window.uchiru.scoreSubscribers[e] }, cardStart: function() {}, loaderClass: function() { return "" }, extendSingleChunk: function() {} } }(window, jQuery),
    function(e, t) {
        e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.callbackName = "on_adaptive", n.fixedPlaceClassName = function(e) { e.addClass("fixed"), e.addClass("fixed_height_560") }, n.lessonStartParams = function() { return undefined }, n.beforeNextRun = function(e, t) { t() }, n.extendSingleChunk = function(e, t) { e.strategy = t.strategy }, e.uchiru.progressors.adaptive = n
    }(window, jQuery),
    function(e, n) {
        var s = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = n.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_beads", t.placeClassName = function(e) { return -1 < ["v1", "v2"].indexOf(e.supports.beads) ? "uchiru-place" : "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { "uchiru-place" === this.placeClassName(t) ? (e.addClass("fixed"), "v2" === t.supports.beads && e.addClass("fixed_height_560")) : e.addClass(this.placeClassName(t) + "_fixed") }, t.draw_sbs = function(e, t, n) {
            var r = new s.ScriptSbs(e, t);
            _(n).each(function(e) { return r.on_event(e.kind, e.data) })
        }, t.loaderClass = function(e) { return e.supports.beads && "v4" === e.supports.beads ? "high-math" : "dino-apple" }, t.lessonStartParams = function(e, t, n, r) { var s = this._isModern(e.supports.beads); return n ? s ? { chunks: _(t).map(function(e) { return { amount: e.amount } }), amount: n.current } : { total: r, amount: n.current } : s ? { chunks: _(t).map(function(e) { return { amount: e.amount } }), amount: 0 } : { total: r, amount: 0 } }, t.cardStart = function(e, t, n) { this._isModern(e.supports.beads) && s._is_card_start({ archive: n }) && "none" !== t[0].play_button_type && s._emitFpEvent("__beads_under_start") }, t.beforeNextRun = function(e, t) { n.delay(400, t) }, t._isModern = function(e) { return -1 < ["v2", "v3", "v4"].indexOf(e) }, e.uchiru.progressors.beads = t
    }(window, jQuery),
    function(e, s) {
        var i = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = s.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_ege", t.placeClassName = function() { return "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = s.Deferred(),
                n = i._place;
            return null != i.uchiruPlaceCurrentLoader && i.uchiruPlaceRemoveLoader(n), i._is_card_start({ archive: e }) ? i.on_ege("__ege_welcome", { cb: function() { t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e, t, n) { var r = s.Deferred(); return e ? i.on_ege("__ege_congrat", { total: n, results: t.results, cb: function() { r.resolve() } }) : r.resolve(), r.promise() }, t.beforeNextRun = function(e, t) { s.delay(400, t) }, t.loaderClass = function() { return "high-math" }, e.uchiru.progressors.ege = t
    }(window, jQuery),
    function(e, s) {
        var i = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = s.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_english_test", t.placeClassName = function() { return "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = s.Deferred(),
                n = i._cardMeta,
                r = i._place;
            return null != i.uchiruPlaceCurrentLoader && i.uchiruPlaceRemoveLoader(r), i._is_card_start({ archive: e, without_results: !0 }) ? i.on_english_test("__english_test_welcome", { cb: function(e) { "classic_with_introduction" === n.supports.english_test.mode ? e.back ? (i._emitFpEvent("english_test_introduction_back"), i._emitSignal("english_test_introduction_back"), i.on_english_test("__congrat")) : (i._emitFpEvent("english_test_introduction_start"), i._emitSignal("english_test_introduction_start"), t.resolve()) : t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e, t, n) { var r = s.Deferred(); return e ? i.on_english_test("__english_test_congrat", { total: n, results: t.results, recommend_level: t.recommend_level, cb: function(e) { return e && (i._emitFpEvent("english_test_review_results", e), i._emitSignal("english_test_review_results", e)), r.resolve() } }) : r.resolve(), r.promise() }, t.beforeNextRun = function(e, t) { s.delay(400, t) }, t.loaderClass = function() { return "dino-apple" }, e.uchiru.progressors.english_test = t
    }(window, jQuery),
    function(e, t) {
        e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.isClearing = !1, n.placeClassName = function() { return "uchiru-place-2" }, n.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, e.uchiru.progressors.game = n
    }(window, jQuery),
    function(e, t) {
        var i = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.callbackName = "on_lamps", n.isClearing = !1, n.placeClassName = function(e) { return "v1" === e.supports.lamps.version ? "uchiru-place" : "uchiru-place-2" }, n.fixedPlaceClassName = function(e, t) { "uchiru-place" === this.placeClassName(t) ? e.addClass("fixed") : e.addClass(this.placeClassName(t) + "_fixed") }, n.lessonStartParams = function(e, t, n) {
            var r = i._cardMeta,
                s = null;
            return r.supports.lamps && r.supports.lamps.with_hint && (s = !1), n ? { lamps: n.lamps, lamps_hint: n.lamps_hint } : { lamps: 0, lamps_hint: s }
        }, n.beforeNextRun = function(e, t) {
            var n = i._playOptions;
            i.on_lamps("fail_popup", { lamps: e.lamps, lamps_hint: e.lamps_hint, under_glass: null != n.lamps ? n.lamps.under_glass : void 0, cb: t })
        }, n.extendSingleChunk = function(e, t) { e.strategy = t.strategy }, n.loaderClass = function() { return "dino-apple" }, e.uchiru.progressors.lamps = n
    }(window, jQuery),
    function(e, t) {
        e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.isClearing = !1, n.placeClassName = function() { return "uchiru-place-2" }, n.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, n.loaderClass = function() { return "dino-apple" }, e.uchiru.progressors.olymp = n
    }(window, jQuery),
    function(e, t) {
        e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.placeClassName = function() { return "uchiru_place" }, n.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, e.uchiru.progressors.olymp_answer = n
    }(window, jQuery),
    function(e, t) {
        var s = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var n = t.extend({}, e.uchiru.progressors["default"]);
        n.callbackName = "on_beads", n.isClearing = !1, n.placeClassName = function(e) { return "v1" === e.supports.fullscreen ? "uchiru-place" : "uchiru-place-2" }, n.draw_sbs = function(e, t, n) {
            var r = new s.ScriptSbs(e, t);
            _(n).each(function(e) { r.on_event(e.kind, e.data) })
        }, n.fixedPlaceClassName = function(e, t) { "uchiru-place" == this.placeClassName(t) ? e.addClass("fixed") : e.addClass(this.placeClassName(t) + "_fixed") }, n.beforeNextRun = function(e, t) { t() }, e.uchiru.progressors.progress = n
    }(window, jQuery),
    function(e, i) {
        var o = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = i.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_test", t.placeClassName = function(e) { return "v1" === e.supports.test.version ? "uchiru-place" : "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { "uchiru-place" == this.placeClassName(t) ? (e.addClass("fixed"), "v1" === t.supports.test.version && e.addClass("fixed_height_560")) : e.addClass(this.placeClassName(t) + "_fixed") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = i.Deferred(),
                n = o._place;
            return null != o.uchiruPlaceCurrentLoader && o.uchiruPlaceRemoveLoader(n), o._is_card_start({ archive: e }) ? o.on_test("__test_welcome", { cb: function() { t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e, t, n) {
            var r = i.Deferred(),
                s = o._cardMeta;
            return e ? s.supports.test.show_result ? o.on_test("__test_congrat", { total: n, success: t.test_success_count, cb: function() { r.resolve() } }) : o.on_test("__test_congrat", { cb: function() { r.resolve() } }) : r.resolve(), r.promise()
        }, t.beforeNextRun = function(e, t) { i.delay(400, t) }, t.loaderClass = function(e) { return e.supports.test && e.supports.test.version && "v2" === e.supports.test.version ? "dino-apple" : "" }, e.uchiru.progressors.test = t
    }(window, jQuery),
    function(e, r) {
        var s = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = r.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_grade_test_hn", t.placeClassName = function() { return "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = r.Deferred(),
                n = s._place;
            return null != s.uchiruPlaceCurrentLoader && s.uchiruPlaceRemoveLoader(n), s._is_card_start({ archive: e }) ? s.on_grade_test_hn("__grade_test_hn_welcome", { cb: function() { t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e) { var t = r.Deferred(); return e ? s.on_grade_test_hn("__grade_test_hn_congrat", { cb: function() { t.resolve() } }) : t.resolve(), t.promise() }, t.beforeNextRun = function(e, t) { r.delay(400, t) }, e.uchiru.progressors.grade_test_hn = t
    }(window, jQuery),
    function(e, i) {
        var o = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = i.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_grade_test_v2", t.placeClassName = function() { return "uchiru-place-2" }, t.fixedPlaceClassName = function(e, t) { e.addClass(this.placeClassName(t) + "_fixed") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = i.Deferred(),
                n = o._cardMeta,
                r = o._place;
            return null != o.uchiruPlaceCurrentLoader && o.uchiruPlaceRemoveLoader(r), o._is_card_start({ archive: e }) && n.supports.grade_test_v2 && n.supports.grade_test_v2.show_welcome_screen ? o.on_grade_test_v2("__grade_test_v2_welcome", { image_type: n.supports.grade_test_v2.image_type, cb: function() { t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e, t, n) {
            var r = i.Deferred(),
                s = o._cardMeta;
            o._place;
            return e && s.supports.grade_test_v2 && s.supports.grade_test_v2.show_congrat_screen ? s.supports.grade_test_v2.show_result ? o.on_grade_test_v2("__grade_test_v2_congrat", {
                image_type: s.supports.grade_test_v2.image_type,
                total: n,
                success: t.test_success_count,
                cb: function() { r.resolve() }
            }) : s.supports.grade_test_v2.show_training_result ? o.on_grade_test_v2("__grade_test_v2_congrat", { training: !0, image_type: s.supports.grade_test_v2.image_type, total: n, success: t.test_success_count, cb: function() { r.resolve() } }) : s.supports.grade_test_v2.show_result_with_answers ? o.on_grade_test_v2("__grade_test_v2_congrat", { with_answers: !0, image_type: s.supports.grade_test_v2.image_type, total: n, success: t.test_success_count, results: t.results, cb: function() { r.resolve() } }) : o.on_grade_test_v2("__grade_test_v2_congrat", { image_type: s.supports.grade_test_v2.image_type, cb: function() { r.resolve() } }) : r.resolve(), r.promise()
        }, t.beforeNextRun = function(e, t) { i.delay(400, t) }, t.lessonStartParams = function(e, t, n, r) {
            var s = o._cardMeta,
                i = { total: r, colors: this._getColorsFromComplexities(s.chunks) };
            return i.amount = n ? n.current : 0, i
        }, t._getColorsFromComplexities = function(e) {
            var t = e.reduce(function(e, t) {
                var n = "a" + t.complexity,
                    r = e[n];
                return e[n] = null != r ? r + t.amount : t.amount, e
            }, {});
            return Object.values(t)
        }, t.loaderClass = function() { return "dino-apple" }, e.uchiru.progressors.grade_test_v2 = t
    }(window, jQuery),
    function(e, s) {
        var i = e.Card.Player1;
        e.uchiru || (e.uchiru = {}), e.uchiru.progressors || (e.uchiru.progressors = {});
        var t = s.extend({}, e.uchiru.progressors["default"]);
        t.callbackName = "on_grade_test", t.placeClassName = function() { return "uchiru-place" }, t.fixedPlaceClassName = function(e) { e.addClass("fixed"), e.addClass("fixed_height_560") }, t.extendSingleChunk = function(e, t) { e.test = t.test }, t.showWelcomeScreen = function(e) {
            var t = s.Deferred(),
                n = i._place;
            return null != i.uchiruPlaceCurrentLoader && i.uchiruPlaceRemoveLoader(n), i._is_card_start({ archive: e }) ? i.on_grade_test("__show_welcome_screen", { cb: function() { t.resolve() } }) : t.resolve(), t.promise()
        }, t.afterPlayOneExercise = function(e, t) {
            var n = s.Deferred(),
                r = (i._place, new LevelWalkerGradeTest);
            return r.load(JSON.parse(t.level_walker.json)), e ? i.on_grade_test("__show_congrat_screen", { is_correct: r.are_all_topics_solved_correctly(), cb: function() { n.resolve() } }) : n.resolve(), n.promise()
        }, t.lessonStartParams = function() { return undefined }, e.uchiru.progressors.grade_test = t
    }(window, jQuery),
    function() {
        var s = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        this.Card || (this.Card = {}),
            function(a) {
                var d, r, c;
                null == a.Player1 && (a.Player1 = {}), d = a.Player1, r = (this.UchiruPopups || {}).Require100PercentZoom, c = function(e) { return _.isFunction(e) ? e : null }, d.event = function(e, t, n, r) { var s, i, o, a; return null == n && (n = {}), r = c(arguments[arguments.length - 1]), n = null == n || _.isFunction(n) ? {} : n, "subscribe" === e ? (i = null != t ? t.channels : void 0, a = n.postMessage, null == d.__pub_sub_channels && (d.__pub_sub_channels = {}), _(i).each(function(e) { return d.__pub_sub_channels[e] = _(d.__pub_sub_channels[e] || []).union(a) }), "function" == typeof r ? r(null) : void 0) : "unsubscribe" === e ? (i = null != t ? t.channels : void 0, a = n.postMessage, null == d.__pub_sub_channels && (d.__pub_sub_channels = {}), _(i).each(function(e) { if (d.__pub_sub_channels[e] = _(d.__pub_sub_channels[e] || []).difference(a), 0 === _.size(d.__pub_sub_channels[e])) return delete d.__pub_sub_channels[e] }), "function" == typeof r ? r(null) : void 0) : "publish" === e ? (s = null != t ? t.channel : void 0, o = null != t ? t.message : void 0, null == d.__pub_sub_channels && (d.__pub_sub_channels = {}), null != d.__pub_sub_channels[s] && _(d.__pub_sub_channels[s]).each(function(e) { return e("pub_sub_message", { channel: s, message: o }) }), "function" == typeof r ? r(null) : void 0) : "manage" === e ? (d.manage(null != t ? t.cmd : void 0, null != t ? t.options : void 0), "function" == typeof r ? r(null) : void 0) : "function" == typeof r ? r({ notImplemented: e }) : void 0 }, d.draw_sbs = function(e, t, n) { return this._getProgressor().draw_sbs(e, t, n) }, d.manage = function(e, t) { if (null == t && (t = {}), "set_sound_autoplay" === e) return d.__sound_autoplay = t.value, d._emitSignal("set_sound_autoplay", { value: t.value }) }, d.play = function(r, e, s, i) {
                    var o, a, c, t, u, _, n, l;
                    return null == i && (i = {}), d._place = r, d._cardMeta = s, d._playOptions = i, c = "card player-1", _ASSERT("ru" === (n = i.locale) || "en" === n || "ua" === n || "tat" === n || "es" === n || "hi" === n || "ch" === n || "ind" === n || "pt" === n || "kk" === n || "be" === n || "vi" === n || "ar" === n || "jp" === n || "en_za" === n || "st" === n || "nso" === n || "ts" === n || "af" === n || "tn" === n || "ss" === n || "zu" === n || "nr" === n || "xh" === n || "ve" === n), d.__public_path = e, d.__locale = i.locale, d.__sound_autoplay = i.sound_autoplay, d._validateScriptVersions(), d._syncGenerationsWithPlayOptions(), d._syncTranslationsWithPlayOptions(), (_ = this._getProgressor()) ? (a = d._chunks(s, i), l = d._getTotal(a), d._prepareOnCallbacks(), d._prepareKeypadManager(r), d._prepareBiAdaptive(), d._prepareListeners(), o = i.archive && d.unwrapArchive(i.archive), d._cardStart(a, o, l), u = function() {
                        var t, n;
                        return n = d._createScore(r, a, l, c), d.__score = n, o ? (n.load(o), d._ipc && (t = setInterval(function() { return d._ipc.heartbeat() }, 3e3)), $.when(d._beforePlayOneExercise(r, o), d._scoreBeforePlayOneExercise(n)).done(function() {
                            return n.play_one_exercise(function(e) {
                                return d._ipc && (d._ipc.cardFinish = e, clearInterval(t)), o = {}, n.save(o), d._emitSignal("$store", d.wrapArchive(o)), e && (d._emitSignal("card_finish"), d._emitSignal("$lesson_finish")), _.isClearing && r.attr("class", d._uchiruPlaceClassName(s)).addClass(c).empty(), i.fullscreen || d._uchiruPlaceAddFixedClassName(r, s), d._afterPlayOneExercise(e, o, l).done(function() {
                                    if (!e) return d._beforeNextRun(o, function() { return u() });
                                    d._waitIpcStore(r, function() { return d._emitFpEvent("lesson_finish") })
                                })
                            })
                        })) : (i.fullscreen || d._uchiruPlaceAddFixedClassName(r, s), o = {}, n.save(o), d._emitSignal("$store", d.wrapArchive(o)), u())
                    }, d._init_load_assets(r, s, { css_namespace: c, play_options: i }), r.attr("class", d._uchiruPlaceClassName(s)).addClass(c).empty(), t = "by_script" === s.supports.load_assets ? null : "none" === s.supports.load_assets ? null : (d.uchiruPlaceAddLoader(r), d.load_assets()), $.when(t).done(function() { return r.attr("class", d._uchiruPlaceClassName(s)).addClass(c), d._emitSignal("card_loaded"), u() })) : console.log("TODO: impl it")
                }, d.wrapArchive = function(e) { return { json: JSON.stringify(e) } }, d.unwrapArchive = function(e) { var t; return e.json ? (t = JSON.parse(e.json), null != e.lamps && (t.lamps = e.lamps), t) : e }, d.card_scripts = function(e) { var t; return t = [], _(e.chunks).each(function(e) { return "script" in e && t.push(e.script), "values" in e.generations ? _(e.generations.values).each(function(e) { return _(e).each(function(e) { if ("_script" in e) return t.push(e._script) }) }) : _(e.generations).each(function(e) { if ("_script" in e) return t.push(e._script) }) }), _(_(t).sort()).uniq() }, d._isDataURLRegex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i, d.isDataURL = function(e) { return d._isDataURLRegex.test(e) }, d.jsonTruncateDataUrls = function(t, n, r) { var s; return null == n && (n = 2), null == r && (r = 0), _.isString(t) && (d.isDataURL(t) || 31 < t.length) ? t.slice(0, 31) + "..." : (_.isArray(t) || _.isObject(t)) && n < r ? t.toString() : _.isArray(t) ? _.map(t, function(e) { return d.jsonTruncateDataUrls(e, n, r + 1) }) : _.isObject(t) ? (s = {}, _.each(_.keys(t), function(e) { return s[e] = d.jsonTruncateDataUrls(t[e], n, r + 1) }), s) : t }, d._validateScriptVersions = function() { var n, r; return n = d._cardMeta, r = d._playOptions, _(d.card_scripts(n)).each(function(e) { var t; if (null == a["Script" + e] && !n.supports.iframe_scripts) return _ASSERT(null != (null != (t = r.script_versions) ? t[e + "_script"] : void 0), "[player] script_version expected for script#" + e) }) }, d._is_card_start = function(e) { var t; return null == e && (e = {}), null == (t = e.archive) || (e.without_results ? !e.archive.results || 0 === e.archive.results.length : 0 === t._chunk_indexes[0]) }, d._uchiruPlaceAddFixedClassName = function(e, t) { return this._getProgressor().fixedPlaceClassName(e, t) }, d._uchiruPlaceClassName = function(e) { return this._getProgressor().placeClassName(e) }, d.uchiruPlaceCurrentLoader = null, d.uchiruPlaceAddLoader = function(e) { var t, n, r; return _ASSERT(null == d.uchiruPlaceCurrentLoader), n = d._cardMeta, r = this._getProgressor(), d._playOptions && d._playOptions.olymp_answer ? t = $("<img>").css({ position: "absolute", display: "block", width: 100, height: 100, top: "50%", left: "50%", marginTop: -50, marginLeft: -50 }).attr("src", window.fp_asset_host + "/fat_player/players/player-1/src/ajax-92e99575b8f9428edaab71b3e5e59562a9271b52da269a052c4511c6910e3df5.gif") : (e.css({ minHeight: 483 }), "uchiru-place" === d._uchiruPlaceClassName(n) ? t = $("<img>").css({ position: "absolute", display: "block", width: 100, height: 100, top: 190, left: "50%", marginLeft: -50 }).attr("src", window.fp_asset_host + "/fat_player/players/player-1/src/ajax-92e99575b8f9428edaab71b3e5e59562a9271b52da269a052c4511c6910e3df5.gif") : (t = $.div("ajax-loader")).addClass(r.loaderClass(n))), e.append(t), d.uchiruPlaceCurrentLoader = t, d.uchiruPlaceCurrentLoader }, d.uchiruPlaceRemoveLoader = function(e) { var t; return _ASSERT(null != d.uchiruPlaceCurrentLoader), t = d.uchiruPlaceCurrentLoader, d.uchiruPlaceCurrentLoader = null, t.remove(), e.css({ minHeight: "" }) }, d._init_load_assets = function(t, n, e) { var r, c; return null == e && (e = {}), r = e.css_namespace, c = e.play_options, this._getProgressor(), _ASSERT(r), _ASSERT(c), d.load_assets = function(e) { var s, i, o, a; return s = $.Deferred(), null != e && _ASSERT("number" == typeof e), c.fullscreen || d._uchiruPlaceAddFixedClassName(t, n), (a = $.div().appendTo(t)).css({ width: 0, height: 0, overflow: "hidden" }), o = function(e) { var t, n; return t = $.Deferred(), (n = $("<img></img>")).attr("src", e), n.unbind("load"), n.bind("load", function() { return t.resolve() }), n.appendTo(a), t.promise() }, i = function(e) { var t, n, r, s; return t = $.Deferred(), n = e.substring(e.lastIndexOf(".") + 1), (s = {})[n] = e, (r = new d.Sound(s)).on("load", function() { return t.resolve() }), r.on("loaderror", function() { return r.unload(), console.log("Error occured when loading " + JSON.stringify(s) + "."), t.resolve() }), t.promise() }, d._fetchAllReqs(n, e).done(function(e) { var t, n, r; return r = e.reqs, n = e.preloading_audios, t = [], _.chain(r).uniq().filter(function(e) { return e.match(/(\.png|\.gif|\.jpg|\.svg)$/) }).each(function(e) { return t.push(o(d.__public_path + e)) }), _.chain(n).uniq().filter(function(e) { return e.match(/(\.mp3|\.ogg|\.wav)$/) }).each(function(e) { return t.push(i(d.__public_path + e)) }), $.when.apply(null, t).done(function() { return a.remove(), s.resolve() }) }), s.promise() } }, d._fetchAllReqs = function(e, t) { var n, i, r, o; return n = $.Deferred(), o = a.__assets, i = [], r = _(d.card_scripts(e)).map(function(r) { var s; return s = $.Deferred(), null != t && t !== r ? s.resolve() : d._fetchScriptAssets(e, r).done(function(e) { var t, n; return t = e.assets, o = o.concat(t), (null != (n = d._scriptMeta(r).supports.audio) ? n.preload : void 0) && (i = i.concat(t)), s.resolve() }), s.promise() }), $.when.apply(null, r).done(function() { return n.resolve({ reqs: o, preloading_audios: i }) }), n.promise() }, d._mapObject = function(e, n) { var r; return r = {}, _.each(e, function(e, t) { return r[t] = n(e, t) }), r }, d._scriptMeta = function(e) { return null != a["Script" + e] ? { "const": a["Script" + e].__const, supports: a["Script" + e].__supports, translations: a["Script" + e].__translations, assets: a["Script" + e].__assets } : { "const": d._addScriptPathToConst(d._scriptMetaJson["const"], e), supports: d._scriptMetaJson.supports } }, d._addScriptPathToConst = function(e, t) { var s, i; return s = d.__public_path, i = d._scriptPath(t), d._mapObject(e, function(e) { return d._mapObject(e, function(r) { return d._mapObject(r, function(e, t) { var n; return n = e, "audio" === t && (n = r.audio_with_options ? d._mapObject(e, function(e) { return d._mapObject(e, function(e) { return s + i + e }) }) : d._mapObject(e, function(e) { return s + i + e })), n }) }) }) }, d._fetchScriptAssets = function(e, t) { var n, r, s; return r = $.Deferred(), null != a["Script" + t] ? (n = d._scriptMeta(t).assets, d._scriptMeta(t).supports["package"] ? (s = n, d._fetchPackageScriptAssets(e, t).done(function(e) { var t; return t = e.assets, s = s.concat(t), r.resolve({ assets: s }) })) : r.resolve({ assets: n })) : d._fetchIframeScriptAssets(e, t).done(function(e) { var t; return t = e.assets, r.resolve({ assets: t }) }), r.promise() }, d._scriptPath = function(e) { var t, n, r, s; return d._cardMeta, r = d._playOptions, d.__public_path, n = d._isRenderIframeScriptFromCard(e), t = r.content_card_id, s = n ? r.version : r.script_versions[e + "_script"], n ? "/" + s + "/" + t + "/" + e + "_script/" : "/" + s + "/" + e + "_script/" }, d._isRenderIframeScriptFromCard = function(e) { var t, n; return !!(t = d._cardMeta).supports.iframe_scripts && (null != (n = t.script_metas) ? n["script_" + e] : void 0) }, d._fetchPackageScriptAssets = function(e, t) { var n, r, s, i, o, a, c; return i = d._playOptions, o = d.__public_path, s = $.Deferred(), n = [], c = i.version, r = i.content_card_id, a = "/" + c + "/" + r + "/script-" + t + "/", d._fetchJson(o + a + "asset-manifest.json", function(e, t) { return null !== e ? (console.warn(e), void s.resolve({ assets: n })) : (n = n.concat(_.map(_.values(t), function(e) { return a + e })), s.resolve({ assets: n })) }), s.promise() }, d._fetchIframeScriptAssets = function(e, t) { var n, r, s, i, o; return d._playOptions, i = d.__public_path, r = $.Deferred(), n = [], s = d._isRenderIframeScriptFromCard(t), o = d._scriptPath(t), d._cacheScriptIframe(t).always(function() { return d._fetchScriptMetaJson(t).always(function() { return d._fetchJson(i + o + "script-manifest.json", function(e, t) { return null !== e ? (console.warn(e), void r.resolve({ assets: n })) : (n = n.concat(_.map(_.values(t), function(e) { return o + e })), s ? d._fetchJson(i + o + "script-assets.json", function(e, t) { return null !== e ? (console.warn(e), void r.resolve({ assets: n })) : (n = n.concat(_.map(_.values(t), function(e) { return o + e })), r.resolve({ assets: n })) }) : r.resolve({ assets: n })) }) }) }), r.promise() }, d._cacheScriptIframe = function(e) {
                    var t, n, r, s, i;
                    return s = d.__public_path, n = d._place, t = $.Deferred(), i = d._scriptPath(e), (r = $.div().appendTo(n)).css({ width: 0, height: 0, overflow: "hidden" }),
                        function(e) { var t, n; return t = $.Deferred(), (n = $("<iframe>")).attr("src", e), n.unbind("load"), n.bind("load", function() { return t.resolve() }), n.appendTo(r), t.promise() }(s + i + "index.html").always(function() { return r.remove(), t.resolve() }), t.promise()
                }, d._fetchScriptIndexHtml = function(e) { var t, n, r; return n = d.__public_path, t = $.Deferred(), r = d._scriptPath(e), d._fetchHtml(n + r + "index.html", function(e) { return null !== e ? (console.warn(e), void t.reject()) : t.resolve() }), t.promise() }, d._fetchScriptMetaJson = function(e) { var n, t, r; return t = d.__public_path, n = $.Deferred(), r = d._scriptPath(e), d._fetchJson(t + r + "script-meta.json", function(e, t) { return null !== e ? (console.warn(e), d._scriptMetaJson = { supports: {} }, void n.reject()) : (d._scriptMetaJson = t, n.resolve()) }), n.promise() }, d._fetchJson = function(e, t) { return $.ajax({ url: e, type: "GET", dataType: "json", error: (n = this, function() { var e; return console.log("[" + (null != (e = n.constructor) ? e.name : void 0) + "] AJAX error"), t("ajax_error") }), success: function(e) { return t(null, e) } }); var n }, d._fetchHtml = function(e, t) { return $.ajax({ url: e, type: "GET", error: (n = this, function() { var e; return console.log("[" + (null != (e = n.constructor) ? e.name : void 0) + "] AJAX error"), t("ajax_error") }), success: function(e) { return t(null, e) } }); var n }, d._fetchAsset = function(e, t) { return $.ajax({ url: e, type: "GET", converters: { "text script": function(e) { return e } }, error: (n = this, function() { var e; return console.log("[" + (null != (e = n.constructor) ? e.name : void 0) + "] AJAX error"), "function" == typeof t ? t("ajax_error") : void 0 }), success: function(e) { return "function" == typeof t ? t(null, e) : void 0 } }); var n }, d.load_assets = function() { throw new Error("You should call Player._init_load_assets().") }, d._syncGenerationsWithPlayOptions = function() { var e, t, n, r; if (e = d._cardMeta, (n = d._playOptions).generations && "chunk" in n) return (t = e.chunks[n.chunk].generations).values && (r = n.pool_name, 0 <= s.call(t.values, r)) ? e.chunks[n.chunk].generations.values[n.pool_name] = n.generations : e.chunks[n.chunk].generations = n.generations }, d._syncTranslationsWithPlayOptions = function() { var t, n; if (t = d._cardMeta, (n = d._playOptions).translations && "chunk" in n && function() { var e; if (null != a["Script" + e]) e = t.chunks[n.chunk].script, d._scriptMeta(e).translations[d.__locale] = n.translations }(), n.translations2 && "chunk" in n) return _(n.translations2).each(function(e, i) { if (null != a["Script" + i]) return "v2" === d._scriptMeta(i).supports.resources ? _(e).each(function(e, t) { var n, r, s; return null == (n = d._scriptMeta(i)["const"])[t] && (n[t] = {}), null == (r = d._scriptMeta(i)["const"][t])[s = d.__locale] && (r[s] = {}), d._scriptMeta(i)["const"][t][d.__locale].text = e }) : d._scriptMeta(i).translations[d.__locale] = e }) }, d._chunks = function(e, t) { var n, r, s, i, o, a; return n = null, a = this, "chunk" in t ? t.pool_name && "value_index" in t ? (s = e.chunks[t.chunk], o = a._getProgressor(), i = "values" in s.generations && t.pool_name in s.generations.values ? s.generations.values[t.pool_name][t.value_index] : s.generations[t.value_index], r = $.extend({}, s, { amount: 1, strategy: "stack", generations: [i] }), o.extendSingleChunk(r, s), n = [r]) : n = [e.chunks[t.chunk]] : n = e.chunks, n }, d._getTotal = function(e) { return _.reduce(e, function(e, t) { return e + t.amount }, 0) }, d._prepareOnCallbacks = function() { var e, t; return d._cardMeta, e = d._playOptions, t = this._getProgressor(), d[t.callbackName] = e[t.callbackName] || function() {} }, d._prepareKeypadManager = function(e) { var t, n; return d._cardMeta, n = d._playOptions, t = new d.KeypadManager(e, { interactive_whiteboard: !!n.interactive_whiteboard, interactive_whiteboard_2: n.interactive_whiteboard_2, show_keypad_on_desktop: !!n.show_keypad_on_desktop }), n.register_keypad_manager_in_global_space && (window.keypad_manager = t), d.keypadManager = t }, d._prepareBiAdaptive = function() { var e; if (d._cardMeta, (e = d._playOptions).bi_adaptive_base_request_url && e.bi_adaptive_list_end_point && e.session_id && e.content_card_id && e.card_id && e.student_id) return d.BiAdaptiveDataManager.sharedInstance.config = { baseRequestUrl: e.bi_adaptive_base_request_url, listEndPoint: e.bi_adaptive_list_end_point, sessionId: e.session_id, contentCardId: e.content_card_id, cardId: e.card_id, studentId: e.student_id } }, d._prepareListeners = function() { var e, t, n, r; return e = d._cardMeta, n = [], (r = d._playOptions).sbs ? n.push(new d.ScriptSbs(sbs, e)) : r.sbs_only_send_events && n.push(new d.ScriptSbs(null, e)), r.chart && n.push(new d.ScriptChart(r.chart, total)), r.ipc_host && r.session_id && ((t = new d.Ipc(r.ipc_host, r.session_id, r.access_token, function() { return d._emitFpEvent("terminated") })).seq_num = r.seq_num, n.push(t), d._ipc = t), n.push(new d.SignalListener(e)), d.listeners = n }, d._emitSignal = function(t, n) { return null == n && (n = {}), n = $.extend({ at: (new Date).getTime() / 1e3, _signal: !0 }, n), _(d.listeners).each(function(e) { return e.on_event(t, n) }) }, d._createScore = function(e, t, n, r) { var s, i, o; return s = d._cardMeta, i = {}, (o = d._playOptions).uchi_lab && "firefox" !== get_browser() && (i.uchi_lab = o.uchi_lab), new d.Score(e, t, n, o.locale, d.keypadManager, d.listeners, d.on_beads, d.on_lamps, d.on_test, d.on_ege, d.on_english_test, d.on_grade_test, d.on_grade_test_v2, d.on_grade_test_hn, d.on_adaptive, !!o.fullscreen, i, !!o.speech_on, r, o.graph_dev || {}, s.progress, o.card_name, s, !!o.pool_name, { lamps: o.lamps, speech: o.speech, keypad: "v3", olymp: o.olymp, olymp_answer: o.olymp_answer, olymp_answer_value: o.olymp_answer_value, game: o.game, student_name: o.student_name, websolver: o.websolver, content_card_id: o.content_card_id, version: o.version, script_versions: o.script_versions, reward: o.reward }) }, d._beforePlayOneExercise = function(e, t) { var n; return n = $.Deferred(), d._showRequire100PercentZoomPopup(e).done(function() { return d._showWelcomeScreen(t).done(function() { return n.resolve() }) }), n.promise() }, d._showRequire100PercentZoomPopup = function(e) { var t, n; return null == (t = d._cardMeta).supports.require_100_percent_zoom_popup ? $.Deferred().resolve().promise() : "v1" !== t.supports.require_100_percent_zoom_popup.version ? $.Deferred().resolve().promise() : (_ASSERT(null != r), n = $.Deferred(), null != d.uchiruPlaceCurrentLoader && d.uchiruPlaceRemoveLoader(e), new r.Runner(e).run(function() { return n.resolve() }), n.promise()) }, d._showWelcomeScreen = function(e) { return d._cardMeta, this._getProgressor().showWelcomeScreen(e) }, d._scoreBeforePlayOneExercise = function(e) { var t; return t = $.Deferred(), e.before_play_one_exercise(function() { return t.resolve() }), t.promise() }, d._afterPlayOneExercise = function(e, t, n) { return d._cardMeta, this._getProgressor().afterPlayOneExercise(e, t, n) }, d._beforeNextRun = function(e, t) { return d._cardMeta, this._getProgressor().beforeNextRun(e, t) }, d._waitIpcStore = function(e, t) { var n; return d._cardMeta, d._ipc ? (n = 2, d._ipc.store(function() { if (0 == (n -= 1)) return t() }), $.delay(400, function() { return 0 == (n -= 1) ? t() : d.uchiruPlaceAddLoader(e) })) : $.delay(400, function() { return t() }) }, d._cardStart = function(e, t, n) { var r; return r = d._cardMeta, d._emitFpEventLessonStart(e, t, n), this._getProgressor().cardStart(r, e, t, n), t ? d._emitSignal("card_start_after_restore", { card_id: parseInt(r.id.split("_v")[0]), commit_id: parseInt(r.id.split("_v")[1]) }) : d._emitSignal("card_start", { card_id: parseInt(r.id.split("_v")[0]), commit_id: parseInt(r.id.split("_v")[1]) }) }, d._emitFpEventLessonStart = function(e, t, n) { var r, s; return r = d._cardMeta, s = this._getProgressor().lessonStartParams(r, e, t, n), d._emitFpEvent("lesson_start", s) }, d._emitFpEvent = function(e, t) { var n; return d._cardMeta, n = this._getProgressor(), d[n.callbackName](e, t) }, d._getProgressor = function() { var e; return e = d._cardMeta, d._playOptions.olymp_answer ? uchiru.progressors.olymp_answer : uchiru.progressors[e.progress] ? uchiru.progressors[e.progress] : uchiru.progressors["default"] }
            }(this.Card)
    }.call(this),
    function() {
        "use strict";

        function i(e, t, n) { this.fn = e, this.context = t, this.once = n || !1 }

        function e() {}
        var t = this.Card.Player1,
            p = "function" != typeof Object.create && "~";
        e.prototype._events = undefined, e.prototype.listeners = function a(e, t) {
            var n = p ? p + e : e,
                r = this._events && this._events[n];
            if (t) return !!r;
            if (!r) return [];
            if (r.fn) return [r.fn];
            for (var s = 0, i = r.length, o = new Array(i); s < i; s++) o[s] = r[s].fn;
            return o
        }, e.prototype.emit = function h(e, t, n, r, s, i) {
            var o = p ? p + e : e;
            if (!this._events || !this._events[o]) return !1;
            var a, c, u = this._events[o],
                _ = arguments.length;
            if ("function" == typeof u.fn) {
                switch (u.once && this.removeListener(e, u.fn, undefined, !0), _) {
                    case 1:
                        return u.fn.call(u.context), !0;
                    case 2:
                        return u.fn.call(u.context, t), !0;
                    case 3:
                        return u.fn.call(u.context, t, n), !0;
                    case 4:
                        return u.fn.call(u.context, t, n, r), !0;
                    case 5:
                        return u.fn.call(u.context, t, n, r, s), !0;
                    case 6:
                        return u.fn.call(u.context, t, n, r, s, i), !0
                }
                for (c = 1, a = new Array(_ - 1); c < _; c++) a[c - 1] = arguments[c];
                u.fn.apply(u.context, a)
            } else {
                var l, d = u.length;
                for (c = 0; c < d; c++) switch (u[c].once && this.removeListener(e, u[c].fn, undefined, !0), _) {
                    case 1:
                        u[c].fn.call(u[c].context);
                        break;
                    case 2:
                        u[c].fn.call(u[c].context, t);
                        break;
                    case 3:
                        u[c].fn.call(u[c].context, t, n);
                        break;
                    default:
                        if (!a)
                            for (l = 1, a = new Array(_ - 1); l < _; l++) a[l - 1] = arguments[l];
                        u[c].fn.apply(u[c].context, a)
                }
            }
            return !0
        }, e.prototype.on = function o(e, t, n) {
            var r = new i(t, n || this),
                s = p ? p + e : e;
            return this._events || (this._events = p ? {} : Object.create(null)), this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], r] : this._events[s].push(r) : this._events[s] = r, this
        }, e.prototype.once = function c(e, t, n) {
            var r = new i(t, n || this, !0),
                s = p ? p + e : e;
            return this._events || (this._events = p ? {} : Object.create(null)), this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], r] : this._events[s].push(r) : this._events[s] = r, this
        }, e.prototype.removeListener = function u(e, t, n, r) {
            var s = p ? p + e : e;
            if (!this._events || !this._events[s]) return this;
            var i = this._events[s],
                o = [];
            if (t)
                if (i.fn)(i.fn !== t || r && !i.once || n && i.context !== n) && o.push(i);
                else
                    for (var a = 0, c = i.length; a < c; a++)(i[a].fn !== t || r && !i[a].once || n && i[a].context !== n) && o.push(i[a]);
            return o.length ? this._events[s] = 1 === o.length ? o[0] : o : delete this._events[s], this
        }, e.prototype.removeAllListeners = function n(e) { return this._events && (e ? delete this._events[p ? p + e : e] : this._events = p ? {} : Object.create(null)), this }, e.prototype.off = e.prototype.removeListener, e.prototype.addListener = e.prototype.on, e.prototype.setMaxListeners = function r() { return this }, e.prefixed = p, "undefined" != typeof module && (module.exports = e), t.EventEmitter3 = e
    }.call(this),
    function() {
        this.Card.Player1.SpeechManager = function() {
            function e(e, t, n) {
                var r, s;
                this.place = e, this.locale = t, this.translations_array = _.chain(n).map((s = this, function(e) { return s._clean_string(e) })).map(function(e) { return e.replace(/(\$(\d+))/gi, "((\\w|\\s)+)") }).map((r = this, function(e) { return r._replace_pluralize_specifier(e) })).filter(function(e) { return "((\\w|\\s)+)" !== e && "()" !== e }).map(function(e) { return new RegExp("^" + e + "$") }).value()
            }
            return e.prototype.UTTERANCE_PITCH = .9, e.prototype.UTTERANCE_RATE_DESTOP = .95, e.prototype.UTTERANCE_RATE_MOBILE = .35, e.prototype.UTTERANCE_VOLUME = 1, e.prototype.NOT_SPEECHABLE = ["start", "Ready to go!", "This one?", "This one!", "OK"], e.prototype.run = function() { if (this._runable()) return this.place.on("click", this._click_handler.bind(this)) }, e.prototype.detach = function() { if (this._runable()) return this.place.off("click") }, e.prototype._runable = function() { return window.speechSynthesis }, e.prototype._click_handler = function(e) { var t, n; if (!1 !== (t = $(e.target)).data("speechable") && this._check_visibility(t)) { if ("string" == typeof t.data("speechable")) return this._synth_speech(this._clean_string(t.data("speechable"))); if ((n = t.clone().find("br").replaceWith(" ").end().text().trim()) && this._speechable(n)) return this._synth_speech(n) } }, e.prototype._synth_speech = function(e) { var t; if (!speechSynthesis.speaking) return e = this._handle_signs(e), t = new SpeechSynthesisUtterance(e), "ru" === this.locale ? t.lang = "ru-RU" : "ua" === this.locale ? t.lang = "uk-UA" : t.lang = "en-US", t.pitch = this.UTTERANCE_PITCH, t.volume = this.UTTERANCE_VOLUME, t.rate = this._is_mobile() ? this.UTTERANCE_RATE_MOBILE : this.UTTERANCE_RATE_DESTOP, speechSynthesis.speak(t) }, e.prototype._handle_signs = function(e) { return e.replace(/-|\u2212|&minus;/, "minus").replace("+", "plus") }, e.prototype._is_mobile = function() { return /iPad/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent) }, e.prototype._speechable = function(t) { return !_.contains(this.NOT_SPEECHABLE, t) && _(this.translations_array).detect(function(e) { return t.match(e) }) }, e.prototype._clean_string = function(e) { return e.replace(/<br \/>|<br>|<br\/>/g, " ").replace(/<[^>]*>/g, "").replace("&minus;", "\u2212").replace(/[\+\-\[\]\{\}\(\)\*\?\.\^\|]/g, "\\$&") }, e.prototype._replace_pluralize_specifier = function(e) { return e.replace(/%(\d+)((\\{.*?\\})+)/g, function(e, t, n) { return "(" + n.slice(2, -2).split("\\}\\{").filter(function(e) { return 0 !== e.length }).map(function(e) { return "(" + e + ")" }).join("|") + ")" }) }, e.prototype._check_visibility = function(e) { return !_.find(e.add(e.parents()), function(e) { return Math.abs(parseFloat($(e).css("opacity"))) < .1 }) }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.SpeechManagerV2 = function() {
            function e(e) { null == e && (e = {}), this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this.locale), this.current_say_cb = null, this.timeout_id = null, this._speaking = !1 }
            return e.prototype.UTTERANCE_PITCH = .9, e.prototype.UTTERANCE_RATE_DESTOP = .95, e.prototype.UTTERANCE_RATE_MOBILE = .35, e.prototype.UTTERANCE_VOLUME = 1, e.prototype.speaking = function() { return this._speaking }, e.prototype.say = function(e, t) { var n, r; return this._runable() ? (this.stop(), this.current_say_cb = t || function() {}, e = this._handle_signs(e), console.log("SpeechManager#say: " + e), n = new SpeechSynthesisUtterance(e), "ru" === this.locale ? n.lang = "ru-RU" : "ua" === this.locale ? n.lang = "uk-UA" : n.lang = "en-US", n.pitch = this.UTTERANCE_PITCH, n.volume = this.UTTERANCE_VOLUME, n.rate = this._is_mobile() ? this.UTTERANCE_RATE_MOBILE : this.UTTERANCE_RATE_DESTOP, this.timeout_id = setTimeoutOrig((r = this, function() { return r.timeout_id = null, r._speaking = !1, r._call_current_cb() }), 77 * e.length), this._speaking = !0, speechSynthesis.speak(n)) : ("function" == typeof this.on_event && this.on_event("speech_synthesis_not_supported_by_browser"), void(t && t())) }, e.prototype.stop = function() { if (this._runable() && (speechSynthesis.speaking || this._speaking)) return this.timeout_id && (clearTimeout(this.timeout_id), this.timeout_id = null), speechSynthesis.cancel(), this._speaking = !1, this._call_current_cb() }, e.prototype._call_current_cb = function() { if (this.current_say_cb) return this.current_say_cb(), this.current_say_cb = null }, e.prototype._runable = function() { return window.speechSynthesis }, e.prototype._handle_signs = function(e) { return e.replace(/-|\u2212|&minus;/, "minus").replace("+", "plus") }, e.prototype._is_mobile = function() { return /iPad/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent) }, e
        }()
    }.call(this),
    function() {
        var n = this.Card;
        n.Player1;
        ! function() {
            "use strict";
            var m = setTimeoutOrig || m,
                e = function() { this.init() };
            e.prototype = {
                init: function() { var e = this || y; return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e },
                volume: function(e) {
                    var t = this || y;
                    if (e = parseFloat(e), t.ctx || l(), void 0 !== e && 0 <= e && e <= 1) {
                        if (t._volume = e, t._muted) return t;
                        t.usingWebAudio && t.masterGain.gain.setValueAtTime(e, y.ctx.currentTime);
                        for (var n = 0; n < t._howls.length; n++)
                            if (!t._howls[n]._webAudio)
                                for (var r = t._howls[n]._getSoundIds(), s = 0; s < r.length; s++) {
                                    var i = t._howls[n]._soundById(r[s]);
                                    i && i._node && (i._node.volume = i._volume * e)
                                }
                        return t
                    }
                    return t._volume
                },
                mute: function(e) {
                    var t = this || y;
                    t.ctx || l(), t._muted = e, t.usingWebAudio && t.masterGain.gain.setValueAtTime(e ? 0 : t._volume, y.ctx.currentTime);
                    for (var n = 0; n < t._howls.length; n++)
                        if (!t._howls[n]._webAudio)
                            for (var r = t._howls[n]._getSoundIds(), s = 0; s < r.length; s++) {
                                var i = t._howls[n]._soundById(r[s]);
                                i && i._node && (i._node.muted = !!e || i._muted)
                            }
                    return t
                },
                unload: function() { for (var e = this || y, t = e._howls.length - 1; 0 <= t; t--) e._howls[t].unload(); return e.usingWebAudio && e.ctx && "undefined" != typeof e.ctx.close && (e.ctx.close(), e.ctx = null, l()), e },
                codecs: function(e) { return (this || y)._codecs[e.replace(/^x-/, "")] },
                _setup: function() {
                    var e = this || y;
                    if (e.state = e.ctx && e.ctx.state || "running", e._autoSuspend(), !e.usingWebAudio)
                        if ("undefined" != typeof Audio) try { "undefined" == typeof(new Audio).oncanplaythrough && (e._canPlayEvent = "canplay") } catch (t) { e.noAudio = !0 } else e.noAudio = !0;
                    try {
                        (new Audio).muted && (e.noAudio = !0)
                    } catch (t) {}
                    return e.noAudio || e._setupCodecs(), e
                },
                _setupCodecs: function() {
                    var e = this || y,
                        t = null;
                    try { t = "undefined" != typeof Audio ? new Audio : null } catch (i) { return e }
                    if (!t || "function" != typeof t.canPlayType) return e;
                    var n = t.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                        r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                        s = r && parseInt(r[0].split("/")[1], 10) < 33;
                    return e._codecs = { mp3: !(s || !n && !t.canPlayType("audio/mp3;").replace(/^no$/, "")), mpeg: !!n, opus: !!t.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""), ogg: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), oga: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), wav: !!t.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), aac: !!t.canPlayType("audio/aac;").replace(/^no$/, ""), caf: !!t.canPlayType("audio/x-caf;").replace(/^no$/, ""), m4a: !!(t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), mp4: !!(t.canPlayType("audio/x-mp4;") || t.canPlayType("audio/mp4;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""), weba: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), webm: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), dolby: !!t.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""), flac: !!(t.canPlayType("audio/x-flac;") || t.canPlayType("audio/flac;")).replace(/^no$/, "") }, e
                },
                _enableMobileAudio: function() {
                    var t = this || y,
                        e = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(t._navigator && t._navigator.userAgent),
                        n = !!("ontouchend" in window || t._navigator && 0 < t._navigator.maxTouchPoints || t._navigator && 0 < t._navigator.msMaxTouchPoints);
                    if (!t._mobileEnabled && t.ctx && (e || n)) {
                        t._mobileEnabled = !1, t._mobileUnloaded || 44100 === t.ctx.sampleRate || (t._mobileUnloaded = !0, t.unload()), t._scratchBuffer = t.ctx.createBuffer(1, 1, 22050);
                        var r = function() {
                            y._autoResume();
                            var e = t.ctx.createBufferSource();
                            e.buffer = t._scratchBuffer, e.connect(t.ctx.destination), "undefined" == typeof e.start ? e.noteOn(0) : e.start(0), "function" == typeof t.ctx.resume && t.ctx.resume(), e.onended = function() { e.disconnect(0), t._mobileEnabled = !0, t.mobileAutoEnable = !1, document.removeEventListener("touchstart", r, !0), document.removeEventListener("touchend", r, !0) }
                        };
                        return document.addEventListener("touchstart", r, !0), document.addEventListener("touchend", r, !0), t
                    }
                },
                _autoSuspend: function() {
                    var e = this;
                    if (e.autoSuspend && e.ctx && "undefined" != typeof e.ctx.suspend && y.usingWebAudio) {
                        for (var t = 0; t < e._howls.length; t++)
                            if (e._howls[t]._webAudio)
                                for (var n = 0; n < e._howls[t]._sounds.length; n++)
                                    if (!e._howls[t]._sounds[n]._paused) return e;
                        return e._suspendTimer && (clearTimeout(e._suspendTimer), clearTimeout(e._notPlayedTimer)), e._suspendTimer = m(function() { e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function() { e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume()) })) }, 3e4), e
                    }
                },
                _autoResume: function() {
                    var t = this;
                    if (t.ctx && "undefined" != typeof t.ctx.resume && y.usingWebAudio) return "running" === t.state && t._suspendTimer ? (clearTimeout(t._suspendTimer), clearTimeout(t._notPlayedTimer), t._suspendTimer = null) : "suspended" === t.state ? (t.ctx.resume().then(function() { t.state = "running"; for (var e = 0; e < t._howls.length; e++) t._howls[e]._emit("resume") }), t._suspendTimer && (
                        clearTimeout(t._suspendTimer), clearTimeout(t._notPlayedTimer), t._suspendTimer = null)) : "suspending" === t.state && (t._resumeAfterSuspend = !0), t
                }
            };
            var y = new e,
                t = function(e) {
                    var t = this;
                    e.src && 0 !== e.src.length ? t.init(e) : console.error("An array of source files must be passed with any new Howl.")
                };
            t.prototype = {
                init: function(e) { var t = this; return y.ctx || l(), t._autoplay = e.autoplay || !1, t._format = "string" != typeof e.format ? e.format : [e.format], t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = "boolean" != typeof e.preload || e.preload, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = "string" != typeof e.src ? e.src : [e.src], t._volume = e.volume !== undefined ? e.volume : 1, t._xhrWithCredentials = e.xhrWithCredentials || !1, t._duration = 0, t._state = "unloaded", t._sounds = [], t._endTimers = {}, t._queue = [], t._playLock = !1, t._onend = e.onend ? [{ fn: e.onend }] : [], t._onfade = e.onfade ? [{ fn: e.onfade }] : [], t._onload = e.onload ? [{ fn: e.onload }] : [], t._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : [], t._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : [], t._onpause = e.onpause ? [{ fn: e.onpause }] : [], t._onplay = e.onplay ? [{ fn: e.onplay }] : [], t._onstop = e.onstop ? [{ fn: e.onstop }] : [], t._onmute = e.onmute ? [{ fn: e.onmute }] : [], t._onvolume = e.onvolume ? [{ fn: e.onvolume }] : [], t._onrate = e.onrate ? [{ fn: e.onrate }] : [], t._onseek = e.onseek ? [{ fn: e.onseek }] : [], t._onresume = [], t._webAudio = y.usingWebAudio && !t._html5, "undefined" != typeof y.ctx && y.ctx && y.mobileAutoEnable && y._enableMobileAudio(), y._howls.push(t), t._autoplay && t._queue.push({ event: "play", action: function() { t.play() } }), t._preload && t.load(), t },
                load: function() {
                    var e = this,
                        t = null;
                    if (y.noAudio) e._emit("loaderror", null, "No audio support.");
                    else {
                        "string" == typeof e._src && (e._src = [e._src]);
                        for (var n = 0; n < e._src.length; n++) {
                            var r, s;
                            if (e._format && e._format[n]) r = e._format[n];
                            else { if ("string" != typeof(s = e._src[n])) { e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring."); continue }(r = /^data:audio\/([^;,]+);/i.exec(s)) || (r = /\.([^.]+)$/.exec(s.split("?", 1)[0])), r && (r = r[1].toLowerCase()) }
                            if (r || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), r && y.codecs(r)) { t = e._src[n]; break }
                        }
                        if (t) return e._src = t, e._state = "loading", "https:" === window.location.protocol && "http:" === t.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new i(e), e._webAudio && a(e), e;
                        e._emit("loaderror", null, "No codec support for selected audio sources.")
                    }
                },
                play: function(r, s) {
                    var i = this,
                        e = null;
                    if ("number" == typeof r) e = r, r = null;
                    else {
                        if ("string" == typeof r && "loaded" === i._state && !i._sprite[r]) return null;
                        if (void 0 === r) {
                            r = "__default";
                            for (var t = 0, n = 0; n < i._sounds.length; n++) i._sounds[n]._paused && !i._sounds[n]._ended && (t++, e = i._sounds[n]._id);
                            1 === t ? r = null : e = null
                        }
                    }
                    var o = e ? i._soundById(e) : i._inactiveSound();
                    if (!o) return null;
                    if (e && !r && (r = o._sprite || "__default"), "loaded" !== i._state) { o._sprite = r, o._ended = !1; var a = o._id; return i._queue.push({ event: "play", action: function() { i.play(a) } }), a }
                    if (e && !o._paused) return s || i._loadQueue("play"), o._id;
                    i._webAudio && y._autoResume();
                    var c = Math.max(0, 0 < o._seek ? o._seek : i._sprite[r][0] / 1e3),
                        u = Math.max(0, (i._sprite[r][0] + i._sprite[r][1]) / 1e3 - c),
                        _ = 1e3 * u / Math.abs(o._rate);
                    o._paused = !1, o._ended = !1, o._sprite = r, o._seek = c, o._start = i._sprite[r][0] / 1e3, o._stop = (i._sprite[r][0] + i._sprite[r][1]) / 1e3, o._loop = !(!o._loop && !i._sprite[r][2]);
                    var l = o._node;
                    if (i._webAudio) {
                        var d = function() {
                            i._refreshBuffer(o);
                            var e = o._muted || i._muted ? 0 : o._volume;
                            l.gain.setValueAtTime(e, y.ctx.currentTime), o._playStart = y.ctx.currentTime, "undefined" == typeof l.bufferSource.start ? o._loop ? l.bufferSource.noteGrainOn(0, c, 86400) : l.bufferSource.noteGrainOn(0, c, u) : o._loop ? l.bufferSource.start(0, c, 86400) : l.bufferSource.start(0, c, u), _ !== Infinity && (i._endTimers[o._id] = m(i._ended.bind(i, o), _)), s || m(function() { i._emit("play", o._id) }, 0)
                        };
                        "running" === y.state ? d() : (i._notPlayedTimer = m(function() { "suspended" !== y.state || o._paused || o._ended || (i.off("resume", d), i._emit("playerror", o._id, "Playback was unable to start.")) }, 100), i.once("resume", d), i._clearTimer(o._id))
                    } else {
                        var p = function() {
                                l.currentTime = c, l.muted = o._muted || i._muted || y._muted || l.muted, l.volume = o._volume * y.volume(), l.playbackRate = o._rate;
                                try {
                                    var e = l.play();
                                    if ("undefined" != typeof Promise && e instanceof Promise) {
                                        i._playLock = !0;
                                        var t = function() { i._playLock = !1, s || i._emit("play", o._id) };
                                        e.then(t, t)
                                    } else s || i._emit("play", o._id);
                                    if (l.playbackRate = o._rate, l.paused) return void i._emit("playerror", o._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");
                                    "__default" !== r || o._loop ? i._endTimers[o._id] = m(i._ended.bind(i, o), _) : (i._endTimers[o._id] = function() { i._ended(o), l.removeEventListener("ended", i._endTimers[o._id], !1) }, l.addEventListener("ended", i._endTimers[o._id], !1))
                                } catch (n) { i._emit("playerror", o._id, n) }
                            },
                            h = window && window.ejecta || !l.readyState && y._navigator.isCocoonJS;
                        if (3 <= l.readyState || h) p();
                        else {
                            var f = function() { p(), l.removeEventListener(y._canPlayEvent, f, !1) };
                            l.addEventListener(y._canPlayEvent, f, !1), i._clearTimer(o._id)
                        }
                    }
                    return o._id
                },
                pause: function(e, t) {
                    var n = this;
                    if ("loaded" !== n._state || n._playLock) return n._queue.push({ event: "pause", action: function() { n.pause(e) } }), n;
                    for (var r = n._getSoundIds(e), s = 0; s < r.length; s++) {
                        n._clearTimer(r[s]);
                        var i = n._soundById(r[s]);
                        if (i && !i._paused && (i._seek = n.seek(r[s]), i._rateSeek = 0, i._paused = !0, n._stopFade(r[s]), i._node))
                            if (n._webAudio) { if (!i._node.bufferSource) continue; "undefined" == typeof i._node.bufferSource.stop ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0), n._cleanBuffer(i._node) } else isNaN(i._node.duration) && i._node.duration !== Infinity || i._node.pause();
                        t || n._emit("pause", i ? i._id : null)
                    }
                    return n
                },
                stop: function(e, t) {
                    var n = this;
                    if ("loaded" !== n._state) return n._queue.push({ event: "stop", action: function() { n.stop(e) } }), n;
                    for (var r = n._getSoundIds(e), s = 0; s < r.length; s++) {
                        n._clearTimer(r[s]);
                        var i = n._soundById(r[s]);
                        i && (i._seek = i._start || 0, i._rateSeek = 0, i._paused = !0, i._ended = !0, n._stopFade(r[s]), i._node && (n._webAudio ? i._node.bufferSource && ("undefined" == typeof i._node.bufferSource.stop ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0), n._cleanBuffer(i._node)) : isNaN(i._node.duration) && i._node.duration !== Infinity || (i._node.currentTime = i._start || 0, i._node.pause())), t || n._emit("stop", i._id))
                    }
                    return n
                },
                mute: function(e, t) {
                    var n = this;
                    if ("loaded" !== n._state) return n._queue.push({ event: "mute", action: function() { n.mute(e, t) } }), n;
                    if (void 0 === t) {
                        if ("boolean" != typeof e) return n._muted;
                        n._muted = e
                    }
                    for (var r = n._getSoundIds(t), s = 0; s < r.length; s++) {
                        var i = n._soundById(r[s]);
                        i && (i._muted = e, i._interval && n._stopFade(i._id), n._webAudio && i._node ? i._node.gain.setValueAtTime(e ? 0 : i._volume, y.ctx.currentTime) : i._node && (i._node.muted = !!y._muted || e), n._emit("mute", i._id))
                    }
                    return n
                },
                volume: function() {
                    var e, t, n, r = this,
                        s = arguments;
                    if (0 === s.length) return r._volume;
                    if (1 === s.length || 2 === s.length && "undefined" == typeof s[1] ? 0 <= r._getSoundIds().indexOf(s[0]) ? t = parseInt(s[0], 10) : e = parseFloat(s[0]) : 2 <= s.length && (e = parseFloat(s[0]), t = parseInt(s[1], 10)), !(void 0 !== e && 0 <= e && e <= 1)) return (n = t ? r._soundById(t) : r._sounds[0]) ? n._volume : 0;
                    if ("loaded" !== r._state) return r._queue.push({ event: "volume", action: function() { r.volume.apply(r, s) } }), r;
                    void 0 === t && (r._volume = e), t = r._getSoundIds(t);
                    for (var i = 0; i < t.length; i++)(n = r._soundById(t[i])) && (n._volume = e, s[2] || r._stopFade(t[i]), r._webAudio && n._node && !n._muted ? n._node.gain.setValueAtTime(e, y.ctx.currentTime) : n._node && !n._muted && (n._node.volume = e * y.volume()), r._emit("volume", n._id));
                    return r
                },
                fade: function(e, t, n, r) {
                    var s = this;
                    if ("loaded" !== s._state) return s._queue.push({ event: "fade", action: function() { s.fade(e, t, n, r) } }), s;
                    s.volume(e, r);
                    for (var i = s._getSoundIds(r), o = 0; o < i.length; o++) {
                        var a = s._soundById(i[o]);
                        if (a) {
                            if (r || s._stopFade(i[o]), s._webAudio && !a._muted) {
                                var c = y.ctx.currentTime,
                                    u = c + n / 1e3;
                                a._volume = e, a._node.gain.setValueAtTime(e, c), a._node.gain.linearRampToValueAtTime(t, u)
                            }
                            s._startFadeInterval(a, e, t, n, i[o], void 0 === r)
                        }
                    }
                    return s
                },
                _startFadeInterval: function(t, n, r, s, e, i) {
                    var o = this,
                        a = n,
                        c = r - n,
                        u = Math.abs(c / .01),
                        _ = Math.max(4, 0 < u ? s / u : s),
                        l = Date.now();
                    t._fadeTo = r, t._interval = setInterval(function() {
                        var e = (Date.now() - l) / s;
                        l = Date.now(), a += c * e, a = Math.max(0, a), a = Math.min(1, a), a = Math.round(100 * a) / 100, o._webAudio ? t._volume = a : o.volume(a, t._id, !0), i && (o._volume = a), (r < n && a <= r || n < r && r <= a) && (clearInterval(t._interval), t._interval = null, t._fadeTo = null, o.volume(r, t._id), o._emit("fade", t._id))
                    }, _)
                },
                _stopFade: function(e) {
                    var t = this,
                        n = t._soundById(e);
                    return n && n._interval && (t._webAudio && n._node.gain.cancelScheduledValues(y.ctx.currentTime), clearInterval(n._interval), n._interval = null, t.volume(n._fadeTo, e), n._fadeTo = null, t._emit("fade", e)), t
                },
                loop: function() {
                    var e, t, n, r = this,
                        s = arguments;
                    if (0 === s.length) return r._loop;
                    if (1 === s.length) {
                        if ("boolean" != typeof s[0]) return !!(n = r._soundById(parseInt(s[0], 10))) && n._loop;
                        e = s[0], r._loop = e
                    } else 2 === s.length && (e = s[0], t = parseInt(s[1], 10));
                    for (var i = r._getSoundIds(t), o = 0; o < i.length; o++)(n = r._soundById(i[o])) && (n._loop = e, r._webAudio && n._node && n._node.bufferSource && (n._node.bufferSource.loop = e) && (n._node.bufferSource.loopStart = n._start || 0, n._node.bufferSource.loopEnd = n._stop));
                    return r
                },
                rate: function() {
                    var e, t, n, r = this,
                        s = arguments;
                    if (0 === s.length) t = r._sounds[0]._id;
                    else if (1 === s.length) { 0 <= r._getSoundIds().indexOf(s[0]) ? t = parseInt(s[0], 10) : e = parseFloat(s[0]) } else 2 === s.length && (e = parseFloat(s[0]), t = parseInt(s[1], 10));
                    if ("number" != typeof e) return (n = r._soundById(t)) ? n._rate : r._rate;
                    if ("loaded" !== r._state) return r._queue.push({ event: "rate", action: function() { r.rate.apply(r, s) } }), r;
                    void 0 === t && (r._rate = e), t = r._getSoundIds(t);
                    for (var i = 0; i < t.length; i++)
                        if (n = r._soundById(t[i])) {
                            n._rateSeek = r.seek(t[i]), n._playStart = r._webAudio ? y.ctx.currentTime : n._playStart, n._rate = e, r._webAudio && n._node && n._node.bufferSource ? n._node.bufferSource.playbackRate.setValueAtTime(e, y.ctx.currentTime) : n._node && (n._node.playbackRate = e);
                            var o = r.seek(t[i]),
                                a = 1e3 * ((r._sprite[n._sprite][0] + r._sprite[n._sprite][1]) / 1e3 - o) / Math.abs(n._rate);
                            !r._endTimers[t[i]] && n._paused || (r._clearTimer(t[i]), r._endTimers[t[i]] = m(r._ended.bind(r, n), a)), r._emit("rate", n._id)
                        }
                    return r
                },
                seek: function() {
                    var e, t, n = this,
                        r = arguments;
                    if (0 === r.length) t = n._sounds[0]._id;
                    else if (1 === r.length) { 0 <= n._getSoundIds().indexOf(r[0]) ? t = parseInt(r[0], 10) : n._sounds.length && (t = n._sounds[0]._id, e = parseFloat(r[0])) } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10));
                    if (void 0 === t) return n;
                    if ("loaded" !== n._state) return n._queue.push({ event: "seek", action: function() { n.seek.apply(n, r) } }), n;
                    var s = n._soundById(t);
                    if (s) {
                        if (!("number" == typeof e && 0 <= e)) {
                            if (n._webAudio) {
                                var i = n.playing(t) ? y.ctx.currentTime - s._playStart : 0,
                                    o = s._rateSeek ? s._rateSeek - s._seek : 0;
                                return s._seek + (o + i * Math.abs(s._rate))
                            }
                            return s._node.currentTime
                        }
                        var a = n.playing(t);
                        if (a && n.pause(t, !0), s._seek = e, s._ended = !1, n._clearTimer(t), a && n.play(t, !0), !n._webAudio && s._node && (s._node.currentTime = e), a && !n._webAudio) {
                            var c = function() { n._playLock ? m(c, 0) : n._emit("seek", t) };
                            m(c, 0)
                        } else n._emit("seek", t)
                    }
                    return n
                },
                playing: function(e) {
                    var t = this;
                    if ("number" == typeof e) { var n = t._soundById(e); return !!n && !n._paused }
                    for (var r = 0; r < t._sounds.length; r++)
                        if (!t._sounds[r]._paused) return !0;
                    return !1
                },
                duration: function(e) {
                    var t = this,
                        n = t._duration,
                        r = t._soundById(e);
                    return r && (n = t._sprite[r._sprite][1] / 1e3), n
                },
                state: function() { return this._state },
                unload: function() {
                    for (var e = this, t = e._sounds, n = 0; n < t.length; n++) {
                        if (t[n]._paused || e.stop(t[n]._id), !e._webAudio) /MSIE |Trident\//.test(y._navigator && y._navigator.userAgent) || (t[n]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), t[n]._node.removeEventListener("error", t[n]._errorFn, !1), t[n]._node.removeEventListener(y._canPlayEvent, t[n]._loadFn, !1);
                        delete t[n]._node, e._clearTimer(t[n]._id);
                        var r = y._howls.indexOf(e);
                        0 <= r && y._howls.splice(r, 1)
                    }
                    var s = !0;
                    for (n = 0; n < y._howls.length; n++)
                        if (y._howls[n]._src === e._src) { s = !1; break }
                    return o && s && delete o[e._src], y.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null
                },
                on: function(e, t, n, r) {
                    var s = this,
                        i = s["_on" + e];
                    return "function" == typeof t && i.push(r ? { id: n, fn: t, once: r } : { id: n, fn: t }), s
                },
                off: function(e, t, n) {
                    var r = this,
                        s = r["_on" + e],
                        i = 0;
                    if ("number" == typeof t && (n = t, t = null), t || n)
                        for (i = 0; i < s.length; i++) { var o = n === s[i].id; if (t === s[i].fn && o || !t && o) { s.splice(i, 1); break } } else if (e) r["_on" + e] = [];
                        else { var a = Object.keys(r); for (i = 0; i < a.length; i++) 0 === a[i].indexOf("_on") && Array.isArray(r[a[i]]) && (r[a[i]] = []) }
                    return r
                },
                once: function(e, t, n) { var r = this; return r.on(e, t, n, 1), r },
                _emit: function(e, t, n) { for (var r = this, s = r["_on" + e], i = s.length - 1; 0 <= i; i--) s[i].id && s[i].id !== t && "load" !== e || (m(function(e) { e.call(this, t, n) }.bind(r, s[i].fn), 0), s[i].once && r.off(e, s[i].fn, s[i].id)); return r._loadQueue(e), r },
                _loadQueue: function(e) {
                    var t = this;
                    if (0 < t._queue.length) {
                        var n = t._queue[0];
                        n.event === e && (t._queue.shift(), t._loadQueue()), e || n.action()
                    }
                    return t
                },
                _ended: function(e) {
                    var t = this,
                        n = e._sprite;
                    if (!t._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return m(t._ended.bind(t, e), 100), t;
                    var r = !(!e._loop && !t._sprite[n][2]);
                    if (t._emit("end", e._id), !t._webAudio && r && t.stop(e._id, !0).play(e._id), t._webAudio && r) {
                        t._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = y.ctx.currentTime;
                        var s = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                        t._endTimers[e._id] = m(t._ended.bind(t, e), s)
                    }
                    return t._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, t._clearTimer(e._id), t._cleanBuffer(e._node), y._autoSuspend()), t._webAudio || r || t.stop(e._id), t
                },
                _clearTimer: function(e) {
                    var t = this;
                    if (t._endTimers[e]) {
                        if ("function" != typeof t._endTimers[e]) clearTimeout(t._endTimers[e]);
                        else {
                            var n = t._soundById(e);
                            n && n._node && n._node.removeEventListener("ended", t._endTimers[e], !1)
                        }
                        delete t._endTimers[e]
                    }
                    return t
                },
                _soundById: function(e) {
                    for (var t = this, n = 0; n < t._sounds.length; n++)
                        if (e === t._sounds[n]._id) return t._sounds[n];
                    return null
                },
                _inactiveSound: function() {
                    var e = this;
                    e._drain();
                    for (var t = 0; t < e._sounds.length; t++)
                        if (e._sounds[t]._ended) return e._sounds[t].reset();
                    return new i(e)
                },
                _drain: function() {
                    var e = this,
                        t = e._pool,
                        n = 0,
                        r = 0;
                    if (!(e._sounds.length < t)) {
                        for (r = 0; r < e._sounds.length; r++) e._sounds[r]._ended && n++;
                        for (r = e._sounds.length - 1; 0 <= r; r--) {
                            if (n <= t) return;
                            e._sounds[r]._ended && (e._webAudio && e._sounds[r]._node && e._sounds[r]._node.disconnect(0), e._sounds.splice(r, 1), n--)
                        }
                    }
                },
                _getSoundIds: function(e) { var t = this; if (void 0 !== e) return [e]; for (var n = [], r = 0; r < t._sounds.length; r++) n.push(t._sounds[r]._id); return n },
                _refreshBuffer: function(e) { var t = this; return e._node.bufferSource = y.ctx.createBufferSource(), e._node.bufferSource.buffer = o[t._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.setValueAtTime(e._rate, y.ctx.currentTime), t },
                _cleanBuffer: function(e) { var t = this; if (y._scratchBuffer) { e.bufferSource.onended = null, e.bufferSource.disconnect(0); try { e.bufferSource.buffer = y._scratchBuffer } catch (n) {} } return e.bufferSource = null, t }
            };
            var i = function(e) { this._parent = e, this.init() };
            i.prototype = {
                init: function() {
                    var e = this,
                        t = e._parent;
                    return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++y._counter, t._sounds.push(e), e.create(), e
                },
                create: function() {
                    var e = this,
                        t = e._parent,
                        n = y._muted || e._muted || e._parent._muted ? 0 : e._volume;
                    return t._webAudio ? (e._node = "undefined" == typeof y.ctx.createGain ? y.ctx.createGainNode() : y.ctx.createGain(), e._node.gain.setValueAtTime(n, y.ctx.currentTime), e._node.paused = !0, e._node.connect(y.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(y._canPlayEvent, e._loadFn, !1), e._node.src = t._src, e._node.preload = "auto", e._node.volume = n * y.volume(), e._node.load()), e
                },
                reset: function() {
                    var e = this,
                        t = e._parent;
                    return e._muted = t._muted, e._loop = t._loop, e._volume = t._volume, e._rate = t._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++y._counter, e
                },
                _errorListener: function() {
                    var e = this;
                    e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1)
                },
                _loadListener: function() {
                    var e = this,
                        t = e._parent;
                    t._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(t._sprite).length && (t._sprite = { __default: [0, 1e3 * t._duration] }), "loaded" !== t._state && (t._state = "loaded", t._emit("load"), t._loadQueue()), e._node.removeEventListener(y._canPlayEvent, e._loadFn, !1)
                }
            };
            var o = {},
                a = function(t) {
                    var e = t._src;
                    if (o[e]) return t._duration = o[e].duration, void _(t);
                    if (/^data:[^;]+;base64,/.test(e)) {
                        for (var n = atob(e.split(",")[1]), r = new Uint8Array(n.length), s = 0; s < n.length; ++s) r[s] = n.charCodeAt(s);
                        u(r.buffer, t)
                    } else {
                        var i = new XMLHttpRequest;
                        i.open("GET", e, !0), i.withCredentials = t._xhrWithCredentials, i.responseType = "arraybuffer", i.onload = function() { var e = (i.status + "")[0]; "0" === e || "2" === e || "3" === e ? u(i.response, t) : t._emit("loaderror", null, "Failed loading audio file with status: " + i.status + ".") }, i.onerror = function() { t._webAudio && (t._html5 = !0, t._webAudio = !1, t._sounds = [], delete o[e], t.load()) }, c(i)
                    }
                },
                c = function(e) { try { e.send() } catch (t) { e.onerror() } },
                u = function(e, t) { y.ctx.decodeAudioData(e, function(e) { e && 0 < t._sounds.length && (o[t._src] = e, _(t, e)) }, function() { t._emit("loaderror", null, "Decoding audio data failed.") }) },
                _ = function(e, t) { t && !e._duration && (e._duration = t.duration), 0 === Object.keys(e._sprite).length && (e._sprite = { __default: [0, 1e3 * e._duration] }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue()) },
                l = function() {
                    try { "undefined" != typeof AudioContext ? y.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? y.ctx = new webkitAudioContext : y.usingWebAudio = !1 } catch (s) { y.usingWebAudio = !1 }
                    var e = /iP(hone|od|ad)/.test(y._navigator && y._navigator.platform),
                        t = y._navigator && y._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                        n = t ? parseInt(t[1], 10) : null;
                    if (e && n && n < 9) {
                        var r = /safari/.test(y._navigator && y._navigator.userAgent.toLowerCase());
                        (y._navigator && y._navigator.standalone && !r || y._navigator && !y._navigator.standalone && !r) && (y.usingWebAudio = !1)
                    }
                    y.usingWebAudio && (y.masterGain = "undefined" == typeof y.ctx.createGain ? y.ctx.createGainNode() : y.ctx.createGain(), y.masterGain.gain.setValueAtTime(y._muted ? 0 : 1, y.ctx.currentTime), y.masterGain.connect(y.ctx.destination)), y._setup()
                };
            n.Player1.Howler = y, n.Player1.Howl = t
        }()
    }.call(this),
    function() {
        var e, t, a, n, r, s = function(e, t) { return function() { return e.apply(t, arguments) } },
            i = function(e, t) {
                function n() { this.constructor = e }
                for (var r in t) o.call(t, r) && (e[r] = t[r]);
                return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
            },
            o = {}.hasOwnProperty;
        e = this.Card, t = (r = e.Player1).EventEmitter3, n = r.Howler, a = r.Howl, r.Sound = function() {
            function e(e) { this.source = e, this._onstop = s(this._onstop, this), this._onended = s(this._onended, this), this._onpause = s(this._onpause, this), this._onplayerror = s(this._onplayerror, this), this._onplay = s(this._onplay, this), this._onloaderror = s(this._onloaderror, this), this._onload = s(this._onload, this), this._sound = null, this._loaded = !1, this._loaderror = !1, this.supported_formats = ["mp3", "wav", "ogg"], this.load() }
            return i(e, t), e.prototype._onload = function() { return this._loaded = !0, this.emit("load", this) }, e.prototype._onloaderror = function() { return this._loaderror = !0, this.emit("loaderror", this) }, e.prototype._onplay = function() { return this.emit("play", this) }, e.prototype._onplayerror = function() { return this.emit("playerror", this) }, e.prototype._onpause = function() { return this.emit("pause", this) }, e.prototype._onended = function() { return this.emit("ended", this) }, e.prototype._onstop = function() { return this.emit("stop", this) }, e.prototype.play = function() { return this._sound.play() }, e.prototype.pause = function() { return this._sound.pause() }, e.prototype.stop = function() { return this._sound.stop(), this._onstop() }, e.prototype.playing = function() { return this._sound.playing() }, e.prototype.reload = function() { return this.unload(!1), this.load() }, e.prototype.load = function() { var e, t, n, r, s, i, o; for (i = [], e = [], n = 0, r = (s = this.supported_formats).length; n < r; n++) t = s[n], (o = this.source[t]) && (i.push(o), e.push(t)); return this._sound = new a({ src: i, ext: e, onload: this._onload, onloaderror: this._onloaderror, onplay: this._onplay, onplayerror: this._onplayerror, onpause: this._onpause, onend: this._onended }), this }, e.prototype.unload = function(e) { return null == e && (e = !0), e && (this.off("load"), this.off("loaderror"), this.off("play"), this.off("playerror"), this.off("pause"), this.off("ended"), this.off("stop")), this._sound = null, this._loaded = !1, this._loaderror = !1, this }, e
        }(), r.AudioManager = function() {
            function e(e) { null == e && (e = {}), this["const"] = e["const"], this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this["const"]), _ASSERT(null != this.locale), this.sounds = {}, n._enableMobileAudio() }
            return e.prototype.play = function(e, t) { var n, r; return (r = this.sound(e)) ? (n = function() { return r.off("ended", n), r.off("loaderror", n), r.off("playerror", n), "function" == typeof t ? t() : void 0 }, r.once("ended", n), r.once("loaderror", n), r.once("playerror", n), r.play()) : "function" == typeof t ? t() : void 0 }, e.prototype.sound = function(e, t) { var n, r, s, i; return null == t && (t = {}), n = e + (null != t.option ? "--" + t.option : ""), null == this.sounds[n] && (null == (i = this._get_audio(e, t.option)) && "function" == typeof this.on_event && this.on_event("missed_audio_constant", { label: e, option: t.option }), i && (s = this._makeSound(i)) && (s.name = n, this.sounds[s.name] = s)), (null != (r = this.sounds[n]) ? r._loaderror : void 0) && this.sounds[n].reload(), this.sounds[n] }, e.prototype.unload = function() { return _(this.sounds).each(function(e) { return null != e ? e.unload() : void 0 }), this }, e.prototype._makeSound = function(e) { return this._runnable() ? new r.Sound(e) : null }, e.prototype._runnable = function() { return !n.noAudio }, e.prototype._get_audio = function(e, t) { var n, r; return null == (r = this["const"][e][this.locale].audio_with_options) && (r = this["const"][e].base.audio_with_options), n = this["const"][e][this.locale].audio || this["const"][e].base.audio, r ? n[t] : n }, e
        }()
    }.call(this),
    function() {
        var e, u, t = function(e, t) { return function() { return e.apply(t, arguments) } };
        e = this.Card, (u = e.Player1).SpeakerManager = function() {
            function e(e) { null == e && (e = {}), this.speech_handler = t(this.speech_handler, this), this.sound_handler = t(this.sound_handler, this), this.script_name = e.script_name, this["const"] = e["const"], this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this.script_name), _ASSERT(null != this["const"]), _ASSERT(null != this.locale), this.with_synthesis_fallback = e.with_synthesis_fallback, null == this.with_synthesis_fallback && (this.with_synthesis_fallback = "en" === this.locale), this.current_say_cb = null, this.speech_manager = null, this.audio_manager = null, this.currently_playing_sounds = {}, this._speaking = !1, this.was_said = {} }
            return e.prototype.sound_handler = function(e) { return this._sound_remove_all_listeners(e), delete this.currently_playing_sounds[e.name], this._call_current_cb() }, e.prototype.speech_handler = function() { return this._call_current_cb() }, e.prototype.say = function(e, t, n) {
                var r, s, i, o, a, c;
                if (null == t && (t = {}), null == n && _.isFunction(t) && (n = t, t = {}), t = _.extend({ option: null, agrs: [], mode: "on_demand" }, t), s = this._get_mode(e), _ASSERT("on_demand" === (i = t.mode) || "auto" === i, "unknown mode: " + t.mode), _ASSERT("never" === s || "on_demand" === s || "first_time" === s || "every_time" === s, "unknown const_mode: " + s), this._speaking = !0, this.stop(), this._speaking = !1, this.current_say_cb = n || function() {}, !("never" === s || "on_demand" === s && "auto" === t.mode || "first_time" === s && "auto" === t.mode && 0 < this.was_said[e])) return null == (r = this.was_said)[e] && (r[e] = 0), this.was_said[e] += 1, (a = null != (o = this.audio_manager) ? o.sound(e, { option: t.option }) : void 0) ? (this.currently_playing_sounds[a.name] = a, this._sound_add_all_listeners(a), a.play()) : this.with_synthesis_fallback && null != this.speech_manager ? (c = u.__i18n_s(this.script_name, e, t.args, this.locale)) ? this.speech_manager.say(c, this.speech_handler) : ("function" == typeof this.on_event && this.on_event("missed_speech_constant", { label: e, option: t.option }), void this._call_current_cb()) : this._call_current_cb();
                this._call_current_cb()
            }, e.prototype.speaking = function() { var e; return 0 !== _.size(this.currently_playing_sounds) || (null != (e = this.speech_manager) ? e.speaking() : void 0) || this._speaking }, e.prototype.stop = function() { var e; return _(this.currently_playing_sounds).each(function(e) { return e.stop() }), null != (e = this.speech_manager) ? e.stop() : void 0 }, e.prototype.destroy = function() { return this.current_say_cb = null, this.stop() }, e.prototype._call_current_cb = function() { var e; return e = this.current_say_cb, this.current_say_cb = null, "function" == typeof e ? e() : void 0 }, e.prototype._sound_add_all_listeners = function(e) { return e.once("stop", this.sound_handler), e.once("pause", this.sound_handler), e.once("ended", this.sound_handler), e.once("loaderror", this.sound_handler), e.once("playerror", this.sound_handler) }, e.prototype._sound_remove_all_listeners = function(e) { return e.off("stop", this.sound_handler), e.off("pause", this.sound_handler), e.off("ended", this.sound_handler), e.off("loaderror", this.sound_handler), e.off("playerror", this.sound_handler) }, e.prototype._get_mode = function(e) { var t; return null == (t = this["const"][e][this.locale].speaker_say) && (t = this["const"][e].base.speaker_say), t }, e
        }()
    }.call(this),
    function() {
        var e, f, m = [].slice;
        e = this.Card, (f = e.Player1).SpeakerV2 = function() {
            function e(e) { null == e && (e = {}), this.script_name = e.script_name, this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this.script_name), _ASSERT(null != this.locale), this.speaker_manager = null }
            return e.prototype.speaker = function(e, t) { var n, r, s, i, o, a, c, u, l, d, p; return null == t && (t = {}), 3 <= arguments.length ? (console.log('[deprecated] speaker function arguments  |  Usage:  @tutor.speaker(line, size:"m", label:"task_all")'), this._speaker_1.apply(this, arguments)) : (_ASSERT(null == t.arg || null == t.args, "'arg' & 'args' are mutually exclusive"), u = t.size, r = t.color || "blue", a = t.label, i = t.ev || "click", l = t.stopPropagation || !1, c = t.option, n = null != t.arg ? [t.arg] : t.args || [], _ASSERT(null == u || "m" === u || "s" === u, "wrong speaker icon size: " + u), _ASSERT("blue" === r || "white" === r, "wrong speaker icon color: " + r), _ASSERT("click" === i || "mousedown" === i, "wrong speaker icon ev: " + i), _ASSERT(!0 === l || !1 === l, "wrong speaker stopPropagation option: " + l), _ASSERT(_.isArray(n), "wrong args type (Array expected)"), d = f.__i18n_s(this.script_name, a, n, this.locale), this.speaker_manager ? (s = this._process_elem(e), _ASSERT(!s.hasClass("with-sound")), null != u && (o = $.span().addClass("speaker"), "s" === u && o.addClass("small"), "white" === r && o.addClass("white"), s.data("speaker_icon", o), s.prepend(s.data("speaker_icon"))), s.addClass("with-sound").data("text", d).data("label", a).data("option", c).data("args", n), s.data("speaker_handler", (p = this, function() { var e; if (!s.data().disabled) return "function" == typeof p.on_event && p.on_event("sound_v2", { mode: "click", label: s.data("label"), args: s.data("args"), locale: p.locale }), p.speaker_manager.stop(), null != (e = s.data("speaker_icon")) && e.addClass("active"), p.speaker_manager.say(a, { option: c, args: n }, function() { var e; return null != (e = s.data("speaker_icon")) ? e.removeClass("active") : void 0 }) })), s.data("speaker_handler_for_stop_propagation", function(e) { if (l) return e.stopPropagation() }), "mousedown" === i ? (s.on(f.buttonDown(), s.data("speaker_handler")), s.on("mousedown touchstart", s.data("speaker_handler_for_stop_propagation"))) : (s.click(s.data("speaker_handler")), s.click(s.data("speaker_handler_for_stop_propagation")))) : void 0) }, e.prototype.speaker_disabled = function(e, t) { var n; return e.data().disabled = t, null != (n = e.data().speaker_icon) ? n.toggleClass("disabled", t) : void 0 }, e.prototype.speaker_clear = function(e) { var t; if (this.speaker_manager && (t = this._process_elem(e), _ASSERT(t.hasClass("with-sound")), this.speaker_manager.stop(), t.off("click", t.data("speaker_handler")), t.off("mousedown", t.data("speaker_handler")), t.off("touchstart", t.data("speaker_handler")), t.off("click", t.data("speaker_handler_for_stop_propagation")), t.off("mousedown", t.data("speaker_handler_for_stop_propagation")), t.off("touchstart", t.data("speaker_handler_for_stop_propagation")), t.removeData("speaker_handler"), t.removeData("speaker_handler_for_stop_propagation"), t.removeClass("with-sound").removeData("text").removeData("label").removeData("option").removeData("args"), null != t.data("speaker_icon"))) return t.data("speaker_icon").remove(), t.removeData("speaker_icon") }, e.prototype.say = function(e, t) { var n, r; return this.speaker_manager && f.__sound_autoplay ? (n = this._process_elem(e), _ASSERT(n.hasClass("with-sound")), "function" == typeof this.on_event && this.on_event("sound_v2", { mode: "autoplay", label: n.data("label"), args: n.data("args"), locale: this.locale }), this.speaker_manager.stop(), null != (r = n.data("speaker_icon")) && r.addClass("active"), this.speaker_manager.say(n.data("label"), { option: n.data("option"), args: n.data("args"), mode: "auto" }, function() { var e; return null != (e = n.data("speaker_icon")) && e.removeClass("active"), "function" == typeof t ? t() : void 0 })) : t ? t() : void 0 }, e.prototype._speaker_1 = function(e, t, n, r) { var s, i, o, a, c, u, l, d, p, h; if (d = e, o = t, c = n, u = r, s = 5 <= arguments.length ? m.call(arguments, 4) : [], _ASSERT("m" === d || "s" === d, "wrong speaker icon size: " + d), null == (l = _.isObject(u) ? u.option : null) && s.unshift(u), p = f.__i18n_s(this.script_name, c, s, this.locale), this.speaker_manager) return a = $.span().addClass("speaker"), "s" === d && a.addClass("small"), (i = this._process_elem(o)).data("speaker_icon", a), i.prepend(a), i.addClass("with-sound").data("text", p).data("label", c).data("option", l).data("args", s), i.click((h = this, function() { return "function" == typeof h.on_event && h.on_event("sound_v2", { mode: "click", label: i.data("label"), args: i.data("args"), locale: h.locale }), h.speaker_manager.stop(), a.addClass("active"), h.speaker_manager.say(c, { option: l, args: s }, function() { return a.removeClass("active") }) })) }, e.prototype._process_elem = function(e) { return e.children() && 2 === e.children().length && $(e.children()[0]).hasClass("hint_content") && $(e.children()[1]).hasClass("corner") ? e.find(".hint_content") : e }, e
        }()
    }.call(this),
    function() {
        var e, g;
        e = this.Card, (g = e.Player1).SpeakerV3 = function() {
            function e(e) { null == e && (e = {}), this.script_name = e.script_name, this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this.script_name), _ASSERT(null != this.locale), this.speaker_manager = null }
            return e.prototype.speaker = function(e, t, n) { var r, s, i, o, a, c, u, l, d, p, h, f, m, y; return null == t && (t = {}), _ASSERT(null == t.arg || null == t.args, "'arg' & 'args' are mutually exclusive"), h = t.size, s = t.color || "blue", p = t.pos || "before", l = t.label, a = t.ev || "click", f = t.stopPropagation || !1, d = t.option, r = null != t.arg ? [t.arg] : t.args || [], _ASSERT(null == h || "m" === h || "s" === h, "wrong speaker icon size: " + h), _ASSERT("blue" === s || "white" === s, "wrong speaker icon color: " + s), _ASSERT("before" === p || "after" === p, "wrong speaker position: " + p), _ASSERT("click" === a || "mousedown" === a, "wrong speaker icon ev: " + a), _ASSERT(!0 === f || !1 === f, "wrong speaker stopPropagation option: " + f), _ASSERT(_.isArray(r), "wrong args type (Array expected)"), m = g.__i18n_s(this.script_name, l, r, this.locale), this.speaker_manager ? (i = this._process_elem(e), _ASSERT(!i.hasClass("with-sound")), null != h ? (u = $.span("speaker-v3_wrapper"), c = $.span("speaker-v3").appendTo(u), "s" === h && c.addClass("small"), "white" === s && c.addClass("white"), i.data({ speaker_icon: c, speaker_icon_wrapper: u }), "before" === p ? i.prepend(i.data("speaker_icon_wrapper")) : i.append(i.data("speaker_icon_wrapper")), "" !== i.text() && this._position_speaker(i, p), o = c) : o = i, i.addClass("with-sound").data("text", m).data("label", l).data("option", d).data("args", r), i.data("speaker_handler", (y = this, function() { var e; if (!i.data().disabled) return "function" == typeof y.on_event && y.on_event("sound_v2", { mode: "click", label: i.data("label"), args: i.data("args"), locale: y.locale }), y.speaker_manager.stop(), null != (e = i.data("speaker_icon")) && e.addClass("active"), y.speaker_manager.say(l, { option: d, args: r }, function() { var e; if (null != (e = i.data("speaker_icon")) && e.removeClass("active"), n) return n() }) })), i.data("speaker_handler_for_stop_propagation", function(e) { if (f) return e.stopPropagation() }), "mousedown" === a ? (o.on(g.buttonDown(), i.data("speaker_handler")), o.on("mousedown touchstart", i.data("speaker_handler_for_stop_propagation"))) : (o.click(i.data("speaker_handler")), o.click(i.data("speaker_handler_for_stop_propagation")))) : n ? n() : void 0 }, e.prototype._position_speaker = function(e, t) { var n, r, s, i; return s = e.text(), "before" === t ? (e.data("speaker_icon_wrapper").addClass("with-margin-right"), r = 0) : (e.data("speaker_icon_wrapper").addClass("with-margin-left"), r = s.length - 1), n = s.charCodeAt(r) === s.toUpperCase().charCodeAt(r) ? .725 : .475, i = (e.data("speaker_icon").height() - parseInt(e.css("font-size")) * n) / 2, e.data("speaker_icon").css({ top: i }) }, e.prototype.speaker_disabled = function(e, t) { var n; return e.data().disabled = t, null != (n = e.data().speaker_icon) ? n.toggleClass("disabled", t) : void 0 },
                e.prototype.speaker_clear = function(e) { var t; if (this.speaker_manager && (t = this._process_elem(e), _ASSERT(t.hasClass("with-sound")), this.speaker_manager.stop(), t.off("click", t.data("speaker_handler")), t.off("mousedown", t.data("speaker_handler")), t.off("touchstart", t.data("speaker_handler")), t.off("click", t.data("speaker_handler_for_stop_propagation")), t.off("mousedown", t.data("speaker_handler_for_stop_propagation")), t.off("touchstart", t.data("speaker_handler_for_stop_propagation")), t.removeData("speaker_handler"), t.removeData("speaker_handler_for_stop_propagation"), t.removeClass("with-sound").removeData("text").removeData("label").removeData("option").removeData("args"), null != t.data("speaker_icon"))) return t.data("speaker_icon").remove(), t.data("speaker_icon_wrapper").remove(), t.removeData("speaker_icon"), t.removeData("speaker_icon_wrapper") }, e.prototype.say = function(e, t) { var n, r; return this.speaker_manager && g.__sound_autoplay ? (n = this._process_elem(e), _ASSERT(n.hasClass("with-sound")), "function" == typeof this.on_event && this.on_event("sound_v2", { mode: "autoplay", label: n.data("label"), args: n.data("args"), locale: this.locale }), this.speaker_manager.stop(), null != (r = n.data("speaker_icon")) && r.addClass("active"), this.speaker_manager.say(n.data("label"), { option: n.data("option"), args: n.data("args"), mode: "auto" }, function() { var e; return null != (e = n.data("speaker_icon")) && e.removeClass("active"), "function" == typeof t ? t() : void 0 })) : t ? t() : void 0 }, e.prototype._process_elem = function(e) { return e.children() && 2 === e.children().length && $(e.children()[0]).hasClass("hint_content") && $(e.children()[1]).hasClass("corner") ? e.find(".hint_content") : e }, e
        }()
    }.call(this),
    function() {
        var e, y;
        e = this.Card, (y = e.Player1).SpeakerV4 = function() {
            function e(e) { null == e && (e = {}), this.script_name = e.script_name, this.locale = e.locale, this.on_event = e.on_event, _ASSERT(null != this.script_name), _ASSERT(null != this.locale), this.elem = e.elem, this.speaker_manager = e.speaker_manager || null, this._speaker_elem(e.keys_for_speaker_elem) }
            return e.prototype.say = function(t) { var n, e; return this.speaker_manager && y.__sound_autoplay ? (n = this._process_elem(this.elem), _ASSERT(n.hasClass("with-sound")), "function" == typeof this.on_event && this.on_event("sound_v2", { mode: "autoplay", label: n.data("label"), args: n.data("args"), locale: this.locale }), this.speaker_manager.stop(), null != (e = n.data("speaker_icon")) && e.addClass("active"), this.speaker_manager.say(n.data("label"), { option: n.data("option"), args: n.data("args"), mode: "auto" }, function() { var e; return null != (e = n.data("speaker_icon")) && e.removeClass("active"), "function" == typeof t ? t() : void 0 })) : t ? t() : void 0 }, e.prototype.stop = function(e) { if (this.speaker_manager && this.speaker_manager.stop(), e) return e() }, e.prototype.clear = function() { return this._speaker_clear() }, e.prototype.disable = function(e) { return this._speaker_disabled(this.elem, e) }, e.prototype.start_pulsation = function() { var e, t; return (e = this.elem.find(".speaker-v4")).addClass("speaker-v4_pulsation"), e.on("mousedown touchstart", (t = this, function() { return t.stop_pulsation() })) }, e.prototype.stop_pulsation = function() { return this.elem.find(".speaker-v4").removeClass("speaker-v4_pulsation") }, e.prototype._speaker_elem = function(e, t) {
                var n, r, s, i, o, a, c, u, l, d, p, h, f, m;
                switch (null == e && (e = {}), _ASSERT(null == e.arg || null == e.args, "'arg' & 'args' are mutually exclusive"), p = e.size || "m", r = e.color || "blue", d = e.pos || "before", u = e.label, o = e.ev || "click", h = e.stopPropagation || !1, l = e.option, n = null != e.arg ? [e.arg] : e.args || [], p) {
                    case "s":
                        this.icon_width = 25, this.icon_height = 25, this.icon_size = "s";
                        break;
                    case "m":
                        this.icon_width = 35, this.icon_height = 35, this.icon_size = "m";
                        break;
                    case "l":
                        this.icon_width = 70, this.icon_height = 70, this.icon_size = "l"
                }
                return _ASSERT(null == p || "m" === p || "s" === p || "l" === p, "wrong speaker icon size: " + p), _ASSERT("blue" === r || "white" === r, "wrong speaker icon color: " + r), _ASSERT("before" === d || "after" === d, "wrong speaker position: " + d), _ASSERT("click" === o || "mousedown" === o, "wrong speaker icon ev: " + o), _ASSERT(!0 === h || !1 === h, "wrong speaker stopPropagation option: " + h), _ASSERT(_.isArray(n), "wrong args type (Array expected)"), f = y.__i18n_s(this.script_name, u, n, this.locale), this.speaker_manager ? (s = this._process_elem(this.elem), _ASSERT(!s.hasClass("with-sound")), null != p ? (c = $.span("speaker-v4_wrapper"), a = $.span("speaker-v4").appendTo(c), "s" === p && a.addClass("small"), "l" === p && a.addClass("large"), "white" === r && a.addClass("white"), s.data({ speaker_icon: a, speaker_icon_wrapper: c }), "before" === d ? s.prepend(s.data("speaker_icon_wrapper")) : s.append(s.data("speaker_icon_wrapper")), "" !== s.text() && this._position_speaker(s, d), i = a) : i = s, s.addClass("with-sound").data("text", f).data("label", u).data("option", l).data("args", n), s.data("speaker_handler", (m = this, function() { var e; if (!s.data().disabled) return "function" == typeof m.on_event && m.on_event("sound_v2", { mode: "click", label: s.data("label"), args: s.data("args"), locale: m.locale }), m.speaker_manager.stop(), null != (e = s.data("speaker_icon")) && e.addClass("active"), m.speaker_manager.say(u, { option: l, args: n }, function() { var e; if (null != (e = s.data("speaker_icon")) && e.removeClass("active"), t) return t() }) })), s.data("speaker_handler_for_stop_propagation", function(e) { if (h) return e.stopPropagation() }), "mousedown" === o ? (i.on(y.buttonDown(), s.data("speaker_handler")), i.on("mousedown touchstart", s.data("speaker_handler_for_stop_propagation"))) : (i.click(s.data("speaker_handler")), i.click(s.data("speaker_handler_for_stop_propagation"))), this) : t ? t() : void 0
            }, e.prototype._process_elem = function(e) { return e.children() && 2 === e.children().length && $(e.children()[0]).hasClass("hint_content") && $(e.children()[1]).hasClass("corner") ? e.find(".hint_content") : e }, e.prototype._position_speaker = function(e, t) { var n, r, s, i; return s = e.text(), "before" === t ? (e.data("speaker_icon_wrapper").addClass("with-margin-right"), r = 0) : (e.data("speaker_icon_wrapper").addClass("with-margin-left"), r = s.length - 1), n = s.charCodeAt(r) === s.toUpperCase().charCodeAt(r) ? .725 : .475, i = (e.data("speaker_icon").height() - parseInt(e.css("font-size")) * n) / 2, e.data("speaker_icon").css({ top: i }) }, e.prototype._speaker_disabled = function(e, t) { var n; return e.data().disabled = t, null != (n = e.data().speaker_icon) ? n.toggleClass("disabled", t) : void 0 }, e.prototype._speaker_clear = function() { var e; if (this.speaker_manager && (e = this._process_elem(this.elem), _ASSERT(e.hasClass("with-sound")), this.speaker_manager.stop(), e.off("click", e.data("speaker_handler")), e.off("mousedown", e.data("speaker_handler")), e.off("touchstart", e.data("speaker_handler")), e.off("click", e.data("speaker_handler_for_stop_propagation")), e.off("mousedown", e.data("speaker_handler_for_stop_propagation")), e.off("touchstart", e.data("speaker_handler_for_stop_propagation")), e.removeData("speaker_handler"), e.removeData("speaker_handler_for_stop_propagation"), e.removeClass("with-sound").removeData("text").removeData("label").removeData("option").removeData("args"), null != e.data("speaker_icon"))) return e.data("speaker_icon").remove(), e.data("speaker_icon_wrapper").remove(), e.removeData("speaker_icon"), e.removeData("speaker_icon_wrapper") }, e
        }()
    }.call(this),
    function() {
        var e, s, i, m, y, o, g, t, a, n, v, c, u, l, d, p, h, r, f, b, k, A, w, x, S, E = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        e = this.Card, x = e.Player1, r = ["active", "disabled"], h = "active", s = o = !(i = l = null), c = "blue", d = "before", p = !(u = "click"), v = ["small", "s", w = 24], t = [a = "medium", "m", A = 28], g = ["large", "l", k = 34], y = ["extra-large", "xl", b = 54], m = ["extra-extra-large", "xxl", f = 70], n = [].concat(v).concat(t).concat(g).concat(y).concat(m), x.SpeakerV5 = function() {
            function e(e) {
                var t, n, r;
                null == e && (e = {}), t = { color: c, position: d, eventType: u, stopPropagation: p, state: h, element: i, size: a, inline: o, createIcon: s }, r = e.keys_for_speaker_elem, _ASSERT(null == r.arg || null == r.args, "'arg' & 'args' are mutually exclusive"), this._options = $.extend(!0, {}, t, r), this._options.args = null != r.arg ? [r.arg] : r.args || [], this._options.createIcon || (this._options.size = null), this.state = this._options.state, this.scriptName = e.script_name, this.locale = e.locale, _ASSERT(null != this.scriptName), _ASSERT(null != this.locale), n = this._options.size, 0 <= E.call(m, n) && (null != this._options.element && console.warn("Speaker | speaker with size " + this._options.size + " only for manually placement(Option element: not supported with this size)."), this._options.element = null), this.onEvent = e.on_event, this.element = this._options.element, this.view = null, this._const = x._scriptMeta(this.scriptName)["const"], this.speakerManager = e.speaker_manager || l, this._speakerInit(this._options)
            }
            return e.meta = { type: "Atom", name: "Speaker", version: "5" }, e.prototype.say = function(t) { var n, e; return this.speakerManager && x.__sound_autoplay ? (n = this._getElementWithData(), _ASSERT(n.hasClass("with-sound")), "function" == typeof this.onEvent && this.onEvent("sound_v2", { mode: "autoplay", label: n.data("label"), args: n.data("args"), locale: this.locale }), this.speakerManager.stop(), null != (e = n.data("speakerIcon")) && e.addClass("active"), this.speakerManager.say(n.data("label"), { option: n.data("option"), args: n.data("args"), mode: "auto" }, function() { var e; return null != (e = n.data("speakerIcon")) && e.removeClass("active"), "function" == typeof t ? t() : void 0 })) : t ? t() : void 0 }, e.prototype.stop = function(e) { if (this.speakerManager && this.speakerManager.stop(), e) return e() }, e.prototype.clear = function() { return this._speakerClear() }, e.prototype.startPulsation = function() { var e, t; return (e = this.element ? this.element.find(".speaker-v5") : this.view).addClass("speaker-v5_pulsation"), e.on("mousedown touchstart", (t = this, function() { return t.stopPulsation() })) }, e.prototype.changeAudio = function(e) { var t, n; return _ASSERT(this._const[e], "not correct label for audio"), t = this._getElementWithData(), this._clearEventsHandlers(this._getElementWithHandlers()), (n = t.data()).label = e, this._addEventsHandlers(this._getElementWithHandlers(), n) }, e.prototype.stopPulsation = function() { return (this.element ? this.element.find(".speaker-v5") : this.view).removeClass("speaker-v5_pulsation") }, e.prototype.setState = function(e) { return null == e && (e = h), this.state = e, this }, e.prototype.getState = function() { return this.state }, Object.defineProperties(e.prototype, { element: { get: function() { return this._options.element }, set: function() {} }, states: { get: function() { return r }, set: function() {} }, inactive: { get: function() { var e; return null != (e = this._getElementWithHandlers()) ? e.hasClass("inactive") : void 0 }, set: function(e) { var t; return null == e && (e = !1), _ASSERT("boolean" == typeof e, "Speaker | inactive value must be 'boolean' type"), null != (t = this._getElementWithHandlers()) ? t.toggleClass("inactive", e) : void 0 } }, state: { get: function() { return this._options.state }, set: function(e) { var t, n; if (null == e && (e = h), _ASSERT(0 <= E.call(this.states, e), "Speaker | state must be in " + this.states.join(", ")), null != this.view) return e !== this._options.state ? "disabled" === (this._options.state = e) ? (this._options.state = "disabled", null != (t = this._getElementWithHandlers()) ? t.addClass("disabled") : void 0) : (this._options.state = "active", null != (n = this._getElementWithHandlers()) && n.removeClass("disabled"), this.inactive = !1) : void 0 } } }), e.prototype._getElementWithData = function() { return this.element ? this.element : this.view }, e.prototype._getElementWithHandlers = function() { var e; return this.element ? null != (null != (e = this.element.data()) ? e.speakerIcon : void 0) ? this.element.data().speakerIcon : this.element : this.view }, e.prototype._speakerInit = function(e, t) { var n, r, s, i, o, a, c, u, l, d, p, h, f; return null == e && (e = {}), p = this._getSpeakerSizeAndSetProps(e.size), d = e.position, o = e.eventType, h = e.stopPropagation, r = e.color, l = e.option, _ASSERT(p || this.element, "Speaker | Not correct parameters: you must set element or option createIcon must be true"), _ASSERT("before" === d || "after" === d, "Speaker | wrong speaker position: " + d), _ASSERT("click" === o || "mousedown" === o, "Speaker | wrong speaker icon ev: " + o), _ASSERT(!0 === h || !1 === h, "Speaker | wrong speaker stopPropagation option: " + h), _ASSERT("blue" === r || "white" === r, "Speaker | wrong speaker icon color: " + r), u = e.label, n = e.args, _ASSERT(_.isArray(n), "wrong args type (Array expected)"), f = x.__i18n_s(this.scriptName, u, n, this.locale), this.speakerManager ? (this.element && (s = this.element, _ASSERT(!s.hasClass("with-sound"))), null != p ? (this.element ? (c = $.span("speaker-v5__wrapper").data("instance", this), e.inline || c.addClass("verse-layout_size_" + p), a = $.span("speaker-v5").appendTo(c).data("instance", this)) : a = $.div("speaker-v5 with-sound").data("instance", this), $(S()).appendTo(a), 0 <= E.call(v, p) && a.addClass("speaker-v5_size_small"), 0 <= E.call(g, p) && a.addClass("speaker-v5_size_large"), 0 <= E.call(y, p) && a.addClass("speaker-v5_size_extra-large"), 0 <= E.call(m, p) && a.addClass("speaker-v5_size_extra-extra-large"), "white" === r && a.addClass("speaker-v5_color_white"), this.element ? (s.data({ speakerIcon: a, speakerIconWrapper: c || null }), "before" === d ? s.prepend(s.data("speakerIconWrapper")) : s.append(s.data("speakerIconWrapper")), "" !== s.text() && this._setSpeakerPosition(s, d), this.view = c) : (this.view = s = a, this.view.data().speakerIcon = a), i = a) : i = s, s.addClass("with-sound").data("text", f).data("label", u).data("option", l).data("args", n).data("eventType", o).data("stopPropagation", h).data("instance", this), e = s.data(), this._addEventsHandlers(i, e), this) : t ? t() : void 0 }, e.prototype._getSpeakerSizeAndSetProps = function(e) {
                switch (_ASSERT(0 <= E.call(n.concat([null, void 0]), e), "Speaker | wrong speaker icon size : " + e), !0) {
                    case 0 <= E.call(v, e):
                        this.iconWidth = w, this.iconHeight = w, this.iconSize = e = "small";
                        break;
                    case 0 <= E.call(t, e):
                        this.iconWidth = A, this.iconHeight = A, this.iconSize = e = "medium";
                        break;
                    case 0 <= E.call(g, e):
                        this.iconWidth = k, this.iconHeight = k, this.iconSize = e = "large";
                        break;
                    case 0 <= E.call(y, e):
                        this.iconWidth = b, this.iconHeight = b, this.iconSize = e = "extra-large";
                        break;
                    case 0 <= E.call(m, e):
                        this.iconWidth = f, this.iconHeight = f, this.iconSize = e = "extra-extra-large"
                }
                return e
            }, e.prototype._setSpeakerPosition = function(e, t) { var n, r; return e.text(), "before" === t ? e.data("speakerIconWrapper").addClass("with-margin-right") : e.data("speakerIconWrapper").addClass("with-margin-left"), n = .725, r = (e.data("speakerIcon").height() - parseInt(e.css("font-size")) * n) / 2, e.data("speakerIcon").css({ top: r }) }, e.prototype._addEventsHandlers = function(n, r) { var s, i, o, t, a; return null == r && (r = {}), i = r.label, s = r.args, o = r.option, t = r.stopPropagation, n.data().speakerHandler = (a = this, function() { var e, t; return e = { mode: "click", locale: a.locale, args: s, label: i }, "function" == typeof a.onEvent && a.onEvent("sound_v2", e), a.speakerManager.stop(), null != (t = r.speakerIcon) && t.addClass("active"), a.speakerManager.say(i, { option: o, args: s }, function() { return n.removeClass("active") }) }), n.data().speakerHandlerForStopPropagation = function(e) { if (t) return e.stopPropagation() }, "mousedown" === r.eventType ? (n.on(x.buttonDown(), n.data("speakerHandler")), n.on("mousedown touchstart", n.data("speakerHandlerForStopPropagation"))) : (n.click(n.data("speakerHandler")), n.click(n.data("speakerHandlerForStopPropagation"))) }, e.prototype._clearEventsHandlers = function(e) { return e.off("click", e.data("speakerHandler")), e.off("mousedown", e.data("speakerHandler")), e.off("touchstart", e.data("speakerHandler")), e.off("click", e.data("speakerHandlerForStopPropagation")), e.off("mousedown", e.data("speakerHandlerForStopPropagation")), e.off("touchstart", e.data("speakerHandlerForStopPropagation")) }, e.prototype._speakerClear = function() { var e, t; if (this.speakerManager && (e = this._getElementWithData(), _ASSERT(e.hasClass("with-sound")), this.speakerManager.stop(), this._clearEventsHandlers(this._getElementWithHandlers()), e.removeData("speakerHandler"), e.removeData("speakerHandlerForStopPropagation"), e.removeClass("with-sound").removeData("text").removeData("label").removeData("option").removeData("args").removeData("eventType").removeData("stopPropagation").removeData("instance"), null != e.data("speakerIcon"))) return e.data("speakerIcon").remove(), null != (t = e.data("speakerIconWrapper")) && t.remove(), e.removeData("speakerIcon"), e.removeData("speakerIconWrapper") }, e
        }(), S = function() { return '<svg width="70" height="70" viewBox="0 0 70 70" fill="none" class="speaker-icon" xmlns="http://www.w3.org/2000/svg"> <path d="M35 70C54.33 70 70 54.33 70 35C70 15.6701 54.33 4.88281e-05 35 4.88281e-05C15.67 4.88281e-05 0 15.6701 0 35C0 54.33 15.67 70 35 70Z" fill="#56C3EA" class="speaker-icon__round"/> <path d="M22.5 32.9688C22 32.9688 21.6 32.7687 21.2 32.5687L13.8 26.7688H2.10002C1.00002 26.7688 -1.2207e-05 25.8688 -1.2207e-05 24.6688V8.76885C-1.2207e-05 7.66885 0.900024 6.66875 2.10002 6.66875H13.8L21.2 0.468799C21.8 -0.0312012 22.7 -0.13125 23.4 0.16875C24.1 0.46875 24.6 1.26865 24.6 2.06865V30.8687C24.6 31.6687 24.1 32.3688 23.4 32.7688C23.1 32.8688 22.8 32.9688 22.5 32.9688ZM4.2 22.5687H14.6C15.1 22.5687 15.5 22.7688 15.9 22.9688L20.5 26.5687V6.4688L16 10.2688C15.6 10.5688 15.2 10.7688 14.7 10.7688H4.2V22.5687Z" transform="translate(10.7998 18.5312)" fill="white" class="speaker-icon__dynamic"/> <path d="M1.81673 15.8725C1.51673 15.8725 1.11673 15.7727 0.816733 15.5727C0.0167326 15.0727 -0.283267 13.9727 0.316733 13.0727C3.61673 7.87269 0.316733 2.77265 0.316733 2.77265C-0.183267 1.97265 0.0167326 0.872645 0.816733 0.272645C1.61673 -0.227355 2.71673 -0.0273549 3.31673 0.772645C3.51673 1.07265 7.91673 7.8726 3.31673 14.9726C2.91673 15.5726 2.31673 15.8725 1.81673 15.8725Z" transform="translate(37.2832 27.2273)" fill="white" class="speaker-icon__dynamic"/> <path d="M1.81671 27.7726C1.51671 27.7726 1.11671 27.6726 0.816708 27.4726C0.0167082 26.9726 -0.283292 25.8726 0.316708 24.9726C7.41671 13.9726 0.616708 3.17265 0.316708 2.77265C-0.183292 1.97265 0.0167082 0.872645 0.816708 0.272645C1.61671 -0.227355 2.71671 -0.0273549 3.31671 0.772645C3.61671 1.27265 11.7167 13.8725 3.31671 26.8725C3.01671 27.4725 2.41671 27.7726 1.81671 27.7726Z" transform="translate(51.8828 21.2273)" fill="white" class="speaker-icon__dynamic"/> <path d="M1.81678 24.1726C1.51678 24.1726 1.11678 24.0725 0.816781 23.8725C0.0167814 23.3725 -0.283219 22.2725 0.316781 21.3725C6.31678 12.0725 0.416781 2.77269 0.316781 2.77269C-0.183219 1.97269 0.0167814 0.872694 0.816781 0.272694C1.61678 -0.227306 2.71678 -0.027306 3.31678 0.772694C3.61678 1.27269 10.6168 12.0727 3.31678 23.2727C2.91678 23.8727 2.41678 24.1726 1.81678 24.1726Z" transform="translate(44.083 23.0273)" fill="white" class="speaker-icon__dynamic"/> </svg>' }
    }.call(this),
    function() {
        var e, S, i = function(e, t) { return function() { return e.apply(t, arguments) } },
            E = [].indexOf || function(e) {
                for (var t = 0, n = this.length; t < n; t++)
                    if (t in this && this[t] === e) return t;
                return -1
            };
        e = this.Card, (S = e.Player1).KeypadManager = function() {
            function e(e, t) {
                var n, r, s;
                this.place = e, this.options = null != t ? t : {}, this._on_keydown = i(this._on_keydown, this), this._on_keypress = i(this._on_keypress, this), this.keypad_show = !!is_browser_mobile() || this.options.show_keypad_on_desktop, this._keypad_callback = null, this._keypad_started = !1, this._roles = [], this._keypad_iwb_2_position = (null != (n = this.options.interactive_whiteboard_2) ? n.position : void 0) || "right", this._keypad = null, this._prevent_default_initialized = !1, $(document).bind("keydown", (r = this, function(e) { return r._on_keydown(e) })), $(document).bind("keypress", (s = this, function(e) { return s._on_keypress(e) })), this.keypad_show && $("body").addClass("overflow-y-scroll"), this.mouse_down_action = "mousedown", this.mouse_up_action = "mouseup", this.mouse_out_action = "mouseout", "ie10_touch" === get_browser_version() ? (this.touch_start_action = "MSPointerDown", this.touch_end_action = "MSPointerUp") : (this.touch_start_action = "touchstart", this.touch_end_action = "touchend")
            }
            return e.prototype.keypad_pause = function() { return this._keypad_paused = !0 }, e.prototype.keypad_resume = function() { return this._keypad_paused = !1 }, e.prototype.keypad_start = function(e, t, n) { var r, s, i, o, a, c, u; return null == t && (t = {}), _.isFunction(t) && (_ASSERT(_.isUndefined(n)), n = t, t = {}), _ASSERT("array" === $.type(e)), _ASSERT(0 < e.length), _ASSERT(!this._keypad_started, "keypad_start() should be called only once"), this._roles = e, this._keypad_callback = n, o = this._roles, this.options.interactive_whiteboard_2 && (o = ["numeric", "operation", "input"]), (this.keypad_show && !(0 <= E.call(this._roles, "button")) || this.options.interactive_whiteboard || this.options.interactive_whiteboard_2) && ($("body").addClass("keypaded"), this._keypad = $.div().appendTo(this.place), this.options.interactive_whiteboard ? ($.div().addClass("keypad_buttons_holder").appendTo(this._keypad), this._keypad.addClass("keypad keypad-iwb"), 1 === e.length && 0 <= E.call(e, "operation") && this._keypad.addClass("extended"), this._keypad.addClass("keypad-iwb-right")) : this.options.interactive_whiteboard_2 ? (s = this.options.interactive_whiteboard_2.on_position_changed || function() {}, i = this._keypad_iwb_2_position, _ASSERT("left" === i || "right" === i), $.div().addClass("keypad_buttons_holder").appendTo(this._keypad), this._keypad.addClass("keypad keypad-iwb-2"), r = $.div().addClass("keypad-move").html("&nbsp;").appendTo(this._keypad), u = this, a = function(e) { return u._keypad.toggleClass("keypad-iwb-2-right", "right" === e), u._keypad_iwb_2_position = e, s(e) }, r.click((c = this, function() { return "right" === c._keypad_iwb_2_position ? a("left") : a("right"), !1 })), a(i)) : ($.div().addClass("keypad_background").append($.div().addClass("keypad_background_blured")).appendTo(this._keypad), $.div().addClass("keypad_buttons_holder").appendTo(this._keypad), this._keypad.addClass("keypad_ios7")), this._fill_keypad(this._keypad, o, { keypad_ios7: t.keypad_ios7 })), this._keypad_started = !0 }, e.prototype.keypad_finish = function() { return _ASSERT(this._keypad_started, "Call keypad_finish() only after keypad_start()"), (this.keypad_show && !(0 <= E.call(this._roles, "button")) || this.options.interactive_whiteboard || this.options.interactive_whiteboard_2) && ($("body").removeClass("keypaded"), this._keypad.remove(), this._keypad = null), this._keypad_callback = null, this._roles = [], this._keypad_started = !1 }, e.prototype.button_ok_toggle = function(e) { if (this.keypad_show) return this._keypad.find(".enter_button").toggleClass("__disabled", !e) }, e.prototype.prevent_default_init = function() { return _ASSERT(!this._prevent_default_initialized, "prevent_default_init() should be called only once"), $(document).on("keydown.__keypad_manager__prevent_default", function(e) { var t; if (t = e.target || e.srcElement, !$(t).is('input[type="text"]') && !$(t).is("textarea") && 8 === e.keyCode) return e.preventDefault() }), this._prevent_default_initialized = !0 }, e.prototype.prevent_default_destroy = function() { return _ASSERT(this._prevent_default_initialized, "Call prevent_default_destroy() only after prevent_default_init()"), $(document).off("keydown.__keypad_manager__prevent_default"), this._prevent_default_initialized = !1 }, e.prototype._fill_keypad = function(e, t, n) {
                var r, s, i, o, a, c, u, _, l, d, p, h, f, m, y, g, v, b, k, A, w, x;
                for (null == t && (t = this._roles), null == n && (n = {}), k = this, l = 0, p = t.length; l < p; l++)
                    for (b = t[l], d = 0, h = (f = this.__chars[b]).length; d < h; d++)
                        if (a = f[d], !(e.hasClass("keypad_ios7") && "enter" === a && (null != (m = n.keypad_ios7) && null != (y = m.button_enter) ? y.without : void 0))) {
                            if (r = $.div().addClass("keypad_button").data("char", a).appendTo(e.find(".keypad_buttons_holder")), e.hasClass("keypad_ios7") && r.attr({ style: "font-family: 'Helvetica-Light' !important" }), this.options.interactive_whiteboard_2) switch (!0) {
                                    case "backspace" === a:
                                        r.html("&nbsp;"), r.addClass("keypad_button_" + a);
                                        break;
                                    case "enter" === a:
                                        r.html("OK"), r.addClass("keypad_button_" + a);
                                        break;
                                    case 0 <= E.call(this.__chars.numeric, a):
                                        r.html(S.typograph(a)), r.addClass("keypad_button_" + a);
                                        break;
                                    case 0 <= E.call(this.__chars.operation, a):
                                        r.html("&nbsp;"), x = { "+": "plus", "-": "minus", "*": "multiply", "/": "divide" }[a], _ASSERT(null != x, "wrong operation: " + a), r.addClass("keypad_button_" + x);
                                        break;
                                    default:
                                        r.html(S.typograph(a))
                                } else if (this.options.interactive_whiteboard) switch (a) {
                                    case "backspace":
                                        r.addClass("left-delay system_button backspace-button"), r.html("&nbsp;");
                                        break;
                                    case "enter":
                                        r.addClass("left-delay green system_button enter_button"), r.html("OK");
                                        break;
                                    case "0":
                                        r.addClass("zero"), r.html(a);
                                        break;
                                    default:
                                        r.html(S.typograph(a))
                                } else switch (a) {
                                    case "backspace":
                                        r.addClass("left-delay system_button backspace-button"), r.html("&nbsp;");
                                        break;
                                    case "enter":
                                        x = (s = (null != (g = n.keypad_ios7) ? g.button_enter : void 0) || {}).type || "ok", A = s.text || "OK", c = s.color || ("done" === x ? "blue" : "blue-intense"), _ASSERT("ok" === x || "done" === x), _ASSERT("blue-intense" === c || "blue" === c), r.data({ type: x, text: A, color: c }), r.addClass("left-delay system_button enter_button enter_button_type_" + x + " enter_button_color_" + c), r.html(A);
                                        break;
                                    case "0":
                                        r.addClass("zero"), r.html(a);
                                        break;
                                    default:
                                        r.html(S.typograph(a))
                                }
                            r.on(this.mouse_down_action + " " + this.touch_start_action, function(t) { return function(e) { return e.type === t.mouse_down_action && 1 !== e.which || $(e.target).hasClass("__disabled") || $(e.target).addClass("active"), !1 } }(this)), r.on(this.mouse_up_action + " " + this.touch_end_action, function() { return $(this).hasClass("__disabled") || ($(this).removeClass("active"), k._on_keypadclick($(this).data("char"))), !1 }), r.on(this.mouse_out_action, function() { if (!$(this).hasClass("__disabled")) return $(this).removeClass("active") })
                        }
                if (this.options.interactive_whiteboard_2 || r && r.addClass("last_button"), e.hasClass("keypad_ios7"))
                    if ("done" === (null != (v = (u = e.find(".keypad_button.enter_button").eq(0)).data()) ? v.type : void 0)) { if (10 < (o = e.find(".keypad_button:not(.enter_button)")).length) return w = 917, _ = u.outerWidth() + (parseInt(u.css("marginLeft"), 10) - 22), i = Math.floor((w - _ - 117) / o.length), o.css({ width: i }) } else if (10 < (o = e.find(".keypad_button")).length) return w = 917, i = Math.floor((w - 117) / o.length), o.css({ width: i })
            }, e.prototype._on_char = function(e) { if (null != this._keypad_callback) return this._keypad_callback(e) }, e.prototype._key_code2char = { numeric: { 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 48: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 96: "0" }, compare: { 187: "=", 188: "<", 190: ">", 61: "=", 60: "<", 62: ">" }, operation: { 106: "*", 56: "*", 59: "/", 111: "/", 191: "/", 107: "+", 61: "+", 187: "+", 109: "-", 189: "-", 173: "-" }, input: { 13: "enter", 8: "backspace", 9: "tab" }, enter: { 13: "enter" }, backspace: { 8: "backspace" }, tab: { 9: "tab" }, arrows: { 37: "left", 38: "up", 39: "right", 40: "down" }, button: { 13: "enter" }, minus: { 109: "-", 189: "-", 173: "-" } }, e.prototype.__chars = { numeric: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], compare: ["<", "=", ">"], operation: ["+", "-", "*", "/"], input: ["backspace", "enter"], backspace: ["backspace"], enter: ["enter"], tab: [], arrows: [], button: [], minus: ["-"] }, e.prototype._on_keypadclick = function(e) {
                var t, n, r, s;
                if (this._keypad_started && !this._keypad_paused)
                    for (t = 0, n = (r = this._roles).length; t < n; t++)
                        if (s = r[t], -1 !== this.__chars[s].indexOf(e)) return void this._on_char(e)
            }, e.prototype._on_keypress = function(e) { if (this._keypad_started && !this._keypad_paused && 0 <= E.call(this._roles, "compare") && (0 === e.keyCode || 1073 === e.keyCode || 1041 === e.keyCode || 1102 === e.keyCode || 1070 === e.keyCode)) { if ("\u0431" === String.fromCharCode(e.charCode) || "\u0411" === String.fromCharCode(e.charCode)) return null != this._keypad_callback && this._keypad_callback("<"), !1; if ("\u044e" === String.fromCharCode(e.charCode) || "\u042e" === String.fromCharCode(e.charCode)) return null != this._keypad_callback && this._keypad_callback(">"), !1 } }, e.prototype._on_keydown = function(e) {
                var t, n, r, s, i;
                if (this._keypad_started && !this._keypad_paused)
                    for (n = 0, r = (s = this._roles).length; n < r; n++)
                        if (i = s[n], !e.metaKey && (t = this._key_code2char[i][e.keyCode])) return null != this._keypad_callback && this._keypad_callback(t), !1;
                return !0
            }, e
        }()
    }.call(this),
    function() {
        var o, d, a = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        o = this.Card, (d = o.Player1).ScriptSbs = function() {
            function e(e, t) { this.sbs = e, this.card_meta = t, this.start = null, this.script_class = null, this.current_script_id = null }
            return e.prototype.IGNORED_SIGNALS = ["$store", "$lesson_finish"], e.prototype.on_event = function(e, t) {
                var n, r, s, i;
                if (n = "<b style='color:rgb(13, 171, 253);'>&middot;</b> ", "card_start" === e) return this.start || (this.start = t.at), this.add(t.at, n + "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 " + t.card_id + "#" + t.commit_id + " \u043d\u0430\u0447\u0430\u043b\u0430\u0441\u044c");
                if ("card_start_after_restore" === e) return this.start || (this.start = t.at), this.add(t.at, n + "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 " + t.card_id + "#" + t.commit_id + " \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0430 \u0438\u0437 \u0430\u0440\u0445\u0438\u0432\u0430");
                if ("card_loaded" === e) return this.add(t.at, n + "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u0430");
                if ("level_start" === e) return this.add(t.at, n + "\u0423\u0440\u043e\u0432\u0435\u043d\u044c " + t.num + " \u043d\u0430\u0447\u0430\u043b\u0441\u044f");
                if ("exercise_start" === e) return this.add(t.at, n + "\u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u043b\u043e\u0441\u044c (\u0441\u043a\u0440\u0438\u043f\u0442 " + t.script_name + "): " + JSON.stringify(t.salt)), this.current_script_id = t.script_name;
                if ("exercise_finish" === e) return this.current_script_id = null, t.correctly ? this.add(t.at, n + "\u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e (\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e)") : this.add(t.at, n + "\u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e (\u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438)");
                if ("level_finish" === e) return this.add(t.at, n + "\u0423\u0440\u043e\u0432\u0435\u043d\u044c " + t.num + " \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d");
                if ("card_finish" === e) return this.add(t.at, n + "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u0430! \u0412\u0441\u0435 \u0431\u0443\u0441\u0438\u043d\u044b \u0441\u043f\u0440\u0430\u0432\u0430");
                if ("beads_start_script" === e) return o["Script" + t.script_name] ? this.script_class = o["Script" + t.script_name]["Script" + parseInt(t.script_name)] : this.script_class = null, this.add(t.at, "[BEADS] \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u0442\u043e");
                if ("beads_fail" === e) return this.add(t.at, "[BEADS] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u0443\u0441\u0438\u043d\u0430 \u043d\u0435 \u043e\u0442\u043a\u0430\u0442\u0438\u043b\u0430\u0441\u044c \u043d\u0430\u0437\u0430\u0434. \u0421\u0435\u0439\u0447\u0430\u0441 \u0431\u0443\u0441\u0438\u043d \u0441\u043f\u0440\u0430\u0432\u0430: " + t.amount + " \u0438\u0437 " + t.total);
                if ("beads_fail_minus_one" === e) return this.add(t.at, "[BEADS] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430, \u0431\u0443\u0441\u0438\u043d\u0430 \u043e\u0442\u043a\u0430\u0442\u0438\u043b\u0430\u0441\u044c \u043d\u0430\u0437\u0430\u0434. \u0421\u0435\u0439\u0447\u0430\u0441 \u0431\u0443\u0441\u0438\u043d \u0441\u043f\u0440\u0430\u0432\u0430: " + t.amount + " \u0438\u0437 " + t.total);
                if ("beads_exercise_finish_succ" === e) return this.add(t.at, "<span style='background-color:#A5E037;'>[BEADS] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0441\u0434\u0435\u043b\u0430\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e - " + t.amount + " \u0438\u0437 " + t.total + "</span>"), this.script_class = null;
                if ("beads_exercise_finish_force_succ" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[BEADS] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d\u043e \u043a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total + "</span>"), this.script_class = null;
                if ("beads_exercise_finish_failed" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[BEADS] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total + "</span>"), this.script_class = null;
                if ("beads_lesson_finish" === e) return this.add(t.at, "[BEADS] \u0443\u0440\u043e\u043a \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d! \u0412\u0441\u0435 \u0431\u0443\u0441\u0438\u043d\u044b (" + t.total + ") \u0441\u043f\u0440\u0430\u0432\u0430"), this.script_class = null;
                if ("beads_fail" === e) return t.minus_one ? this.add(t.at,
                    "[BEADS] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430, \u0431\u0443\u0441\u0438\u043d\u0430 \u043e\u0442\u043a\u0430\u0442\u0438\u043b\u0430\u0441\u044c \u043d\u0430\u0437\u0430\u0434. \u0421\u0435\u0439\u0447\u0430\u0441 \u0431\u0443\u0441\u0438\u043d \u0441\u043f\u0440\u0430\u0432\u0430: " + t.amount + " \u0438\u0437 " + t.total) : this.add(t.at, "[BEADS] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u0443\u0441\u0438\u043d\u0430 \u043d\u0435 \u043e\u0442\u043a\u0430\u0442\u0438\u043b\u0430\u0441\u044c \u043d\u0430\u0437\u0430\u0434. \u0421\u0435\u0439\u0447\u0430\u0441 \u0431\u0443\u0441\u0438\u043d \u0441\u043f\u0440\u0430\u0432\u0430: " + t.amount + " \u0438\u0437 " + t.total);
                if ("save_progress" === e) return this.add(t.at, "[Score] \u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d");
                if ("grade_test_v2__save_results" === e) return this.add(t.at, "[Score] \u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d");
                if ("english_test_recommend_level" === e) return this.add(t.at, "[ENGLISH_TEST] \u041f\u043e \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430\u043c \u0442\u0435\u0441\u0442\u0430 \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u043e\u0432\u0430\u043d: " + t.grade + " Grade");
                if ("english_test_review_results" === e) return this.add(t.at, "[ENGLISH_TEST] \u0423\u0447\u0435\u043d\u0438\u043a " + (t.review_results ? "\u043d\u0430\u0436\u0438\u043c\u0430\u043b" : "\u043d\u0435 \u043d\u0430\u0436\u0438\u043c\u0430\u043b") + " \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432");
                if ("english_test_introduction_back" === e) return this.add(t.at, "[ENGLISH_TEST] \u0423\u0447\u0435\u043d\u0438\u043a \u043d\u0430\u0436\u0430\u043b \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 '\u0417\u0430\u043d\u0438\u043c\u0430\u0442\u044c\u0441\u044f'");
                if ("english_test_introduction_start" === e) return this.add(t.at, "[ENGLISH_TEST] \u0423\u0447\u0435\u043d\u0438\u043a \u043d\u0430\u0436\u0430\u043b \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 '\u041d\u0430\u0447\u0430\u0442\u044c'");
                if ("test_start_script" === e) return this.add(t.at, "\u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u0442\u043e");
                if ("test_exercise_finish_succ" === e) return this.add(t.at, "<span style='background-color:#A5E037;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0441\u0434\u0435\u043b\u0430\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e - " + t.amount + " \u0438\u0437 " + t.total);
                if ("test_exercise_finish_force_succ" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d\u043e \u043a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total);
                if ("test_exercise_finish_failed" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total);
                if ("test_fail" === e) return this.add(t.at, "[TEST] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 '" + t.kind + ":" + t.name + "' \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430. \u0417\u0430\u0434\u0430\u043d\u0438\u0435 " + (t.amount + 1) + " \u0438\u0437 " + t.total);
                if ("__grade_test_v2_start_script" === e) return this.add(t.at, "\u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u0442\u043e");
                if ("__grade_test_v2_exercise_finish_succ" === e) return i = t.currentLevel ? "\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0443\u0447\u0435\u043d\u0438\u043a\u0430: " + t.currentLevel + ", \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u0435: " + t.delta : "", this.add(t.at, "<span style='background-color:#A5E037;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0441\u0434\u0435\u043b\u0430\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e - " + t.amount + " \u0438\u0437 " + t.total + "." + i);
                if ("__grade_test_v2_exercise_finish_force_succ" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d\u043e \u043a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total);
                if ("__grade_test_v2_exercise_finish_failed" === e) return i = t.currentLevel ? "\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0443\u0447\u0435\u043d\u0438\u043a\u0430: " + t.currentLevel + ", \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u0435: " + t.delta : "", this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total + ". " + i);
                if ("__grade_test_v2_fail" === e) return this.add(t.at, "[TEST] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 '" + t.kind + ":" + t.name + "' \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430. \u0417\u0430\u0434\u0430\u043d\u0438\u0435 " + (t.amount + 1) + " \u0438\u0437 " + t.total);
                if ("__grade_test_hn_start_script" === e) return this.add(t.at, "\u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u0442\u043e");
                if ("__grade_test_hn_exercise_finish_succ" === e) return this.add(t.at, "<span style='background-color:#A5E037;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0441\u0434\u0435\u043b\u0430\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e - " + t.amount + " \u0438\u0437 " + t.total);
                if ("__grade_test_hn_exercise_finish_force_succ" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d\u043e \u043a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total);
                if ("__grade_test_hn_exercise_finish_failed" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 '" + t.kind + ":" + t.name + "' \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.amount + " \u0438\u0437 " + t.total);
                if ("__grade_test_hn_fail" === e) return this.add(t.at, "[TEST] \u0432 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0438 '" + t.kind + ":" + t.name + "' \u0434\u043e\u043f\u0443\u0449\u0435\u043d\u0430 \u043e\u0448\u0438\u0431\u043a\u0430. \u0417\u0430\u0434\u0430\u043d\u0438\u0435 " + (t.amount + 1) + " \u0438\u0437 " + t.total);
                if ("__adaptive_start_script" === e) return this.add(t.at, "[ADAPTIVE] \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u0447\u0430\u0442\u043e");
                if ("__adaptive_exercise_finish_succ" === e) return this.add(t.at, "<span style='background-color:#A5E037;'>[ADAPTIVE] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0441\u0434\u0435\u043b\u0430\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e - " + t.progress_factor);
                if ("__adaptive_exercise_finish_force_succ" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[ADAPTIVE] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043d\u043e \u043a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.progress_factor);
                if ("__adaptive_exercise_finish_failed" === e) return this.add(t.at, "<span style='background-color:#F28888;'>[ADAPTIVE] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u043e\u0434\u043d\u0430\u043a\u043e \u0431\u044b\u043b\u0438 \u043e\u0448\u0438\u0431\u043a\u0438 - " + t.progress_factor);
                if ("__grade_test_exercise_finish" === e) return this.add(t.at, "[GRADE_TEST] \u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 " + (t.exercise + 1) + " \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e.");
                if ("__grade_test_status" === e) return this.add(t.at, "[GRADE_TEST] \u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430.");
                if ("__grade_test_v2_status" === e) return this.add(t.at, "[GRADE_TEST_v2] \u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430.");
                if ("__grade_test_hn_status" === e) return this.add(t.at, "[GRADE_TEST_hn] \u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430.");
                if (t._obsolete) return this.add(t.at, t._obsolete);
                if ("sound_v2" === e) return "autoplay" === t.mode ? this.add(t.at, "[SOUND] \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u043f\u0440\u043e\u0438\u0433\u0440\u0430\u043d\u043e: " + d.__i18n_s(this.current_script_id, t.label, t.args, t.locale)) : this.add(t.at, "[SOUND] \u043f\u0440\u043e\u0438\u0433\u0440\u0430\u043d\u043e \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443: " + d.__i18n_s(this.current_script_id, t.label, t.args, t.locale));
                if ("set_sound_autoplay" === e) return t.value ? this.add(t.at, "[SOUND] \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0432\u043a\u043b\u044e\u0447\u0438\u043b \u0430\u0432\u0442\u043e\u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u043d\u0438\u0435") : this.add(t.at, "[SOUND] \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u043e\u0442\u043a\u043b\u044e\u0447\u0438\u043b \u0430\u0432\u0442\u043e\u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u043d\u0438\u0435");
                if ("__missed_audio_constant" === e) return this.add(t.at, "[SOUND] Missed audio constant script_" + t.script_name + ": " + JSON.stringify({ label: t.label, option: t.option }));
                if ("__missed_speech_constant" === e) return this.add(t.at, "<font color=red>[WARNING]</font>[SOUND] Missed speech constant script_" + t.script_name + ": " + JSON.stringify({ label: t.label, option: t.option }));
                if ("__speaker_manager_say_log" === e);
                else if ("__play_button" === e) {
                    if (console.log(t), "request" === t.mode);
                    else if ("skip" === t.mode);
                    else if ("click" === t.mode) return this.add(t.at, "[PLAY_BUTTON] \u041d\u0430\u0436\u0430\u043b \u043d\u0430 \u043a\u043d\u043e\u043f\u043a\u0443 '\u0421\u0442\u0430\u0440\u0442'")
                } else { if (this.card_meta.supports.structure && this.current_script_id && this._script_events(this.current_script_id)) return e in this._script_events(this.current_script_id).actions ? (r = this._colorify(d.format2(this._script_events(this.current_script_id).actions[e].name, t).split("\n"), t), this.add(t.at, "[ACTION] " + r[0], r.slice(1))) : e in this._script_events(this.current_script_id).signals ? (r = this._colorify(d.format2(this._script_events(this.current_script_id).signals[e].name, t).split("\n"), t), this.add(t.at, "[SIGNAL] " + r[0], r.slice(1))) : this.add(t.at, "<font color=red>[WARNING]</font> Missed signal '" + e + "'"); if ("__keypad_3_start" === e || "__keypad_3_finish" === e || "__keypad_3_button_ok_toggle" === e || "__keypad_3_button_ok_wrong" === e || "__keypad_3_button_ok_clear" === e || "__keypad_3_button_ok_right" === e || "__keypad_3_activate" === e || "__keypad_3_deactivate" === e || "__keypad_3_prevent_default_init" === e || "__keypad_3_prevent_default_destroy" === e || "__keypad_3_emit" === e) return this.add(t.at, "[KEYPAD_3] '" + e + "'" + (t.event ? " '" + t.event + "'" : "")); if (this.current_script_id && this._script_events(this.current_script_id) && e.match(/^user-event\./) && e in this._script_events(this.current_script_id).actions) return r = this._colorify(d.format2(this._script_events(this.current_script_id).actions[e].name, t).split("\n"), t), this.add(t.at, "[ACTION] " + r[0], r.slice(1)); if (!(0 <= a.call(this.IGNORED_SIGNALS, e))) return (s = o["Script" + this.current_script_id] ? o["Script" + this.current_script_id]["Script" + parseInt(this.current_script_id)] : null) && s.SBS && e in s.SBS ? (r = this._colorify(d.format2(s.SBS[e], t).split("\n"), t), this.add(t.at, r[0], r.slice(1))) : (this.add(t.at, "<font color=red>[WARNING]</font> Missed SBS event '" + e + "'"), console.log("missed SBS event '" + e + "'", t)), null }
            }, e.prototype.add = function(e, t, n) { var r, s, i, o, a, c, u, _, l; for (null == n && (n = []), a = $.div(), c = t.replace(/\<red\>.*?\<\/red\>/g, function(e) { return "<b><font color=red>" + e + "</font></b>" }).replace(/\<green\>.*?\<\/green\>/g, function(e) { return "<b><font color=green>" + e + "</font></b>" }), r = 0, u = 7 - ((l = "") + sprintf("%.1f", e - this.start)).length; 0 <= u ? r < u : u < r; 0 <= u ? ++r : --r) l += "&nbsp;"; for (a.append("<tt><b>" + l + sprintf("%.1f", e - this.start) + "</b> - " + c + "</tt>"), s = 0, i = n.length; s < i; s++) o = n[s], a.append("<br><tt>&nbsp;&nbsp;" + o + "</tt>"); return null != (_ = this.sbs) && _.prepend(a), d.event("publish", { channel: "__sbs", message: a.html() }) }, e.prototype._colorify = function(e, t) { var n; return 0 !== t._event_type && (1 === t._event_type ? n = "red" : 2 === t._event_type && (n = "#f77c7c"), e = _.map(e, function(e) { return "<span style='color:" + n + ";'>" + e + "</span>" })), e }, e.prototype._script_events = function(e) { return this.card_meta.events[e] }, e
        }()
    }.call(this),
    function() {
        var i, a, c, u, t, s, o = [].slice;
        i = this.Card, a = i.Player1, s = a.SpeakerV5, t = a.SpeakerV4, u = a.SpeakerV3, c = a.SpeakerV2, a.Tutor = function() {
            function e(e) {
                var t, n, r, s, i, o;
                this.script_name = e.script_name, this.locale = e.locale, this.keypad_manager = e.keypad_manager, this.on_exercise_soft_end = e.on_exercise_soft_end, this.on_exercise_end = e.on_exercise_end, this.on_event = e.on_event, this.card_meta = e.card_meta, r = e.student_name, s = e.websolver, n = e.reward, this.event_prefix = "", this.i18n_prefix = "", this.event_processor = null, this.soft_end_executed = !1, this.speech_manager = null, this.audio_manager = null, this.speaker_manager = null, this._student_name = r, this._websolver = s, this.reward = n, this.speakers = "v4" === (t = this._script_supports().speaker) || "v5" === t ? null : "v3" === this._script_supports().speaker ? new u({ script_name: this.script_name, locale: this.locale, on_event: (o = this, function(e, t) { return o._sys_event(e, t) }) }) : new c({ script_name: this.script_name, locale: this.locale, on_event: (i = this, function(e, t) { return i._sys_event(e, t) }) }), this.user_tracker = new a.UchiUserTracker(this)
            }
            return e.prototype._name = "Player.Tutor", e.prototype.set_prefix = function(e) { return this.event_prefix = e + "_", this.i18n_prefix = e + "." }, e.prototype.set_event_processor = function(e) { return this.event_processor = e }, e.prototype.event = function(e, t) { if (this.card_meta.supports.structure && "graph.wrong" === e && t.wrong) throw "\u043d\u0435\u043b\u044c\u0437\u044f \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0441\u0432\u044f\u0437\u0438 :err \u0432 \u0433\u0440\u0430\u0444\u043e\u0432\u043e\u0439 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u043e\u0439 \u0441 \u043d\u043e\u0432\u043e\u0439 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u043e\u0439. \u0412\u043c\u0435\u0441\u0442\u043e \u044d\u0442\u043e\u0433\u043e \u043d\u0443\u0436\u043d\u043e \u044f\u0432\u043d\u043e \u0432\u044b\u0437\u044b\u0432\u0430\u0442\u044c tutor.event/tutor.wrong"; if (!this.card_meta.supports.structure || !/^graph\./.test(e)) return this.event_processor && (t = $.extend({ _obsolete: this.event_processor(e, t) }, t)), this._sys_event("" + this.event_prefix + e, t) }, e.prototype.wrong = function(e, t) { return this.event(e, $.extend({ wrong: !0 }, t)) }, e.prototype.the_soft_end = function() { return this.soft_end_executed = !0, this.on_exercise_soft_end(), this.user_tracker.destroy() }, e.prototype.the_end = function(e) { return this.soft_end_executed || (this.soft_end_executed = !0, this.on_exercise_soft_end()), this.on_exercise_end(e), this.user_tracker.destroy() }, e.prototype.back = function() { return this._sys_event("__back") }, e.prototype.play_button = function(e, n) { var t, r; return null == e && (e = {}), _.isFunction(e) && (_ASSERT(_.isUndefined(n)), n = e, e = {}), t = { mode: "request", cb: (r = this, function(e) { var t; return null == e && (e = {}), "skip" !== (t = e.result) && "click" !== t || r._sys_event("__play_button", { mode: t }), n() }) }, this._sys_event("__play_button", t) }, e.prototype.speaker = function() { var e, n, r; return e = 1 <= arguments.length ? o.call(arguments, 0) : [], "v5" === this._script_supports().speaker ? new s({ script_name: this.script_name, locale: this.locale, on_event: (r = this, function(e, t) { return r._sys_event(e, t) }), keys_for_speaker_elem: e[0], onSayByClick: e[1], speaker_manager: this.speaker_manager }) : "v4" === this._script_supports().speaker ? new t({ script_name: this.script_name, locale: this.locale, on_event: (n = this, function(e, t) { return n._sys_event(e, t) }), elem: e[0], keys_for_speaker_elem: e[1], onSayByClick: e[2], speaker_manager: this.speaker_manager }) : (this.speakers.speaker_manager = this.speaker_manager, this.speakers.speaker.apply(this.speakers, e)) }, e.prototype.speaker_disabled = function() { var e; return e = 1 <= arguments.length ? o.call(arguments, 0) : [], this.speakers.speaker_disabled.apply(this.speakers, e) }, e.prototype.speaker_clear = function() { var e; return e = 1 <= arguments.length ? o.call(arguments, 0) : [], this.speakers.speaker_clear.apply(this.speakers, e) }, e.prototype.say = function() { var e; return e = 1 <= arguments.length ? o.call(arguments, 0) : [], this.speakers.say.apply(this.speakers, e) }, e.prototype.t = function() { var e, t; return e = 1 <= arguments.length ? o.call(arguments, 0) : [], t = "" + this.i18n_prefix + e.shift(), a.__i18n_t(this.script_name, t, e, this.locale, "__translations") || function() { throw "missed translation constant `" + t + "`" }() }, e.prototype._t = function(e, t, n, r) { var s; return null == r && (r = !0), s = "ru" === this.locale ? "en" : "ru", e in i["Script" + this.script_name][n][this.locale] ? a.format(i["Script" + this.script_name][n][this.locale][e], t) : r && e in i["Script" + this.script_name][n][s] ? a.format(s + ": " + i["Script" + this.script_name][n][s][e], t) : void 0 }, e.prototype.keypad_start = function(e, t, n) { return null == t && (t = {}), "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_start", { roles: e, opt: t, callback: n }) : this.keypad_manager.keypad_start(e, t, n) }, e.prototype.keypad_finish = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_finish") : this.keypad_manager.keypad_finish() }, e.prototype.button_ok_toggle = function(e) { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_button_ok_toggle", { enabled: e }) : this.keypad_manager.button_ok_toggle(e) }, e.prototype.keypad_ok_wrong = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_button_ok_wrong") : _ASSERT(!1) }, e.prototype.keypad_ok_right = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_button_ok_right") : _ASSERT(!1) }, e.prototype.keypad_ok_clear = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_button_ok_clear") : _ASSERT(!1) }, e.prototype.keypad_activate = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_activate") : _ASSERT(!1, "not implemented") }, e.prototype.keypad_deactivate = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_deactivate") : _ASSERT(!1, "not implemented") }, e.prototype.prevent_default_init = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_prevent_default_init") : this.keypad_manager.prevent_default_init() }, e.prototype.prevent_default_destroy = function() { return "v3" === this._script_supports().keypad ? this._sys_event("__keypad_3_prevent_default_destroy") : this.keypad_manager.prevent_default_destroy() }, e.prototype.game = function() { return _ASSERT("game" === this.card_meta.progress), null }, Object.defineProperties(e.prototype, { student_name: { get: function() { return this._student_name } }, websolver: { get: function() { return _ASSERT("v1" === this._script_supports().websolver), this._websolver } } }), e.prototype._sys_event = function(e, t) { return this.on_event(e, t) }, e.prototype._script_supports = function() { return i["Script" + this.script_name].__supports }, e
        }()
    }.call(this),
    function() {
        var e, o;
        e = this.Card, (o = e.Player1).format = function(e, i) { return e.replace(/\$(\d+)/g, function(e, t) { return null == i[t - 1] ? e : i[t - 1] }).replace(/%(\d+)(({.*?})+)/g, function(e, t, n) { var r, s; return null == (s = i[t - 1]) || "number" != typeof s || Math.floor(s) !== s ? e : (r = n.slice(1, -1).split("}{"), o.pluralize(s, r)) }) }, o.format2 = function(e, r) { return e.replace(/%(.*?)%/g, function(e, t) { var n; return n = r[t], _.isObject(n) && function() { try { return JSON.stringify(n) } catch (e) {} }() || n }) }
    }.call(this),
    function() {
        var e, a, c, u, l, t;
        e = this.Card, a = e.Player1, c = function() {
            function e(e) { this.dtime = e.dtime, _ASSERT(null != this.dtime), this.text = l($.div(), t.timerText).html(this.t("remaining")), this.box = l($.div(), t.timerBox).html("&nbsp;"), this.view = l($.div(), t.timer).append(this.text).append(this.box), this.view, this.startTime = Date.now(), this.addAllEvents(), this.update() }
            return e.prototype.update = function() {
                var e, t, n, r, s;
                if (t = Date.now() - this.startTime, r = Math.max(this.dtime - t, 0), e = Math.floor(r / 1e3 / 60), n = Math.floor(r / 1e3) % 60, !(5 < e)) return this.view.css({ visibility: "" }), s = 0 < e ? e + " " + this.t("min") : "0 : " + n + " " + this.t("sec"), this.box.html(s);
                this.view.css({ visibility: "hidden" })
            }, e.prototype.destroy = function() { return this.removeAllEvents() }, e.prototype.addAllEvents = function() { var e, t; return t = this, (e = function() { return t.update(), t.timeoutId = setTimeoutOrig(e, 500) })() }, e.prototype.removeAllEvents = function() { return null != this.timeoutId && clearTimeout(this.timeoutId), this.timeoutId = null }, e.translations = { remaining: { ru: "\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c", en: "Remaining", ch: "\u8fd8\u6709", pt: "Restam", hi: "Remaining", ts: "Leswi saleke", af: "Oorblywende", sw: "Kusele ", xh: "Kuhlala", st: "Ho setse", nr: "Okuseleko", ve: "Zwo salaho!", zu: "Remaining", nso: "Se se \u0161et\u0161ego.", tn: "Remaining" }, min: { ru: "\u043c\u0438\u043d.", en: "min.", ch: "\u5206\u949f", pt: "min.", hi: "min.", ts: "minete", af: "min", sw: "Umz.", xh: "imizi.", st: "metsotso.", nr: " umzuzu.", ve: "Minete. ", zu: "min.", nso: "motsotso", tn: "min." }, sec: { ru: "\u0441\u0435\u043a.", en: "sec.", ch: "\u79d2", pt: "seg.", hi: "sec.", ts: "sekondi", af: "sek", sw: "Umzz ", xh: "Isibi", st: "metsotswana.", nr: "umzuzwana.", ve: "Muthethe.", zu: "sec.", nso: "motsotswana.", tn: "sec." } }, e.prototype.t = function(e) { return this.constructor.translations[e][a.__locale] || this.constructor.translations[e].en }, e
        }(), t = { timer: { position: "relative", whiteSpace: "no-wrap" }, timerText: { position: "relative", display: "inline-block", verticalAlign: "top", paddingTop: 10, paddingRight: 10, fontFamily: "Noto Sans", fontSize: 15, lineHeight: "15px", color: "#727A78", MozOsxFontSmoothing: "grayscale", WebkitFontSmoothing: "antialiased" }, timerBox: { position: "relative", display: "inline-block", backgroundColor: "rgb(248,98,30)", width: 89, height: 34, verticalAlign: "top", textAlign: "center", paddingTop: 10, fontFamily: "Noto Sans", fontSize: 15, lineHeight: "15px", color: "white", MozBoxSizing: "border-box", boxSizing: "border-box" } }, a.OlympProgress = function() {
            function e(e) { this.place = e.place, this.cardName = e.cardName, this.cardMeta = e.cardMeta, this.dtime = e.dtime, this.onBack = e.onBack, _ASSERT(null != this.place), _ASSERT(null != this.cardMeta), _ASSERT(null != this.onBack) }
            return e.prototype.init = function() { var e, t, n, r, s, i, o; if (t = l($.div(), u.header).appendTo(this.place), n = this.cardName ? this.cardName : this.t("name"), this.name = l($.div(), u.cardName).html(n).appendTo(t), e = this.t("back"), this.back = this.constructor._buttonBack(e).appendTo(t), this.back.on(a.buttonDown("up"), (o = this, function() { return o.onBack() })), this.back.on("click", function() { return !1 }), null != this.dtime) return this.m_timer = new c({ dtime: this.dtime }), (s = $(".uchiru-head__right-group")).length ? (i = s, r = u.timerRightGroup) : (i = t, r = u.timer), l(this.m_timer.view, r).appendTo(i) }, e.translations = { name: { en: "name", ch: "\u540d\u5b57", pt: "nome", hi: "name", ts: "vito", af: "naam", sw: "Ligama ", xh: "Igama", st: "lebitso", nr: "Igama", ve: "Dzina", zu: "name", nso: "leina", tn: "name" }, back: { ru: "\u041a \u0441\u043f\u0438\u0441\u043a\u0443 \u0437\u0430\u0434\u0430\u0447", en: "Back", hi: "\u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0924\u094d\u0930 \u0915\u0940 \u0913\u0930 \u091c\u093e\u090f\u0902", ch: "\u8fd4\u56de", pt: "Voltar", st: "Back", ss: "Back", af: "Back", sw: "Back", zu: "Back", nso: "Back", ve: "Back", xh: "Back", tn: "Back", ts: "Back", nr: "Back" } }, e.prototype.t = function(e) { return this.constructor.translations[e][a.__locale] || this.constructor.translations[e].en }, e._buttonBack = function(e) { var t, n; return t = l($.div(), u.arrowLeft), (n = l($("<a />"), u.backLink).attr({ href: "#" }).append(t).append(l($.span(), u.backLinkText).html(e))).hover(function() { return l(n, [u.backLink, u.backLinkHover]), l(t, [u.arrowLeft, u.arrowLeftHover]) }, function() { return l(n, u.backLink), l(t, u.arrowLeft) }), n }, e._buttonBackClear = function(e) { return e.off("mouseenter mouseleave") }, e
        }(), l = function(e, t) { var n; return n = Array.isArray(t) ? _.extend.apply(_, [{}].concat(t)) : t, e.css(n) }, u = { header: { position: "absolute", zIndex: 1e3, backgroundColor: "white", width: "100%", height: 50, top: 0, left: 0 }, backLink: { position: "absolute", zIndex: 1, left: 18, top: 14, fontFamily: "Noto Sans", fontSize: 15, fontWeight: "bold", lineHeight: "15px", color: "#727A78", textDecoration: "none", MozOsxFontSmoothing: "grayscale", WebkitFontSmoothing: "antialiased" }, backLinkHover: { color: "#8f8f8f" }, backLinkText: { position: "relative", lineHeight: "15px" }, arrowLeft: { position: "relative", display: "inline-block", verticalAlign: "middle", backgroundImage: "url(" + window.fp_asset_host + "/fat_player/players/player-1/src/progresses/img/back_red-90341319dbbe8d9bb794f45266ec84a9a710992d4760ab42514b00a04a4cb1c6.svg)", backgroundRepeat: "no-repeat", width: 24, height: 24, marginRight: 7, marginBottom: 1, backgroundPosition: "0 center" }, arrowLeftHover: { backgroundPosition: "-24px center" }, cardName: { position: "relative", fontFamily: "Noto Sans", fontSize: 15, fontWeight: "bold", lineHeight: "15px", textAlign: "center", paddingTop: 18, MozOsxFontSmoothing: "grayscale", WebkitFontSmoothing: "antialiased" }, timer: { position: "absolute", right: 18, top: 8 }, timerRightGroup: { position: "relative", top: 0, display: "inline" } }
    }.call(this),
    function() {
        var e, h;
        e = this.Card, (h = e.Player1).ProgressProgress = function() {
            function e(e) { this.place = e.place, this.card_name = e.card_name, this.card_meta = e.card_meta, this.current = e.current, this.total = e.total, this.onBack = e.onBack, _ASSERT(null != this.place), _ASSERT(null != this.card_meta), _ASSERT(null != this.current), _ASSERT(null != this.total), _ASSERT(null != this.onBack) }
            return e.prototype.createCardWrapper = function() { var e, t, n, r, s, i, o, a, c, u, _, l, d, p; for (a = this.place.width(), r = $.div().addClass("card_wrapper").css("width", a).appendTo(this.place), i = $.div().addClass("card_header").appendTo(r), u = this.card_name ? this.card_name : this.t("name"), $.div().addClass("card_name").html(u).appendTo(i), t = this.t("back"), (e = this.constructor._buttonBack(t, this.card_meta).appendTo(i)).on(h.buttonDown("up"), (p = this, function() { return p.onBack() })), e.on("click", function() { return !1 }), l = $.div().addClass("score_wrapper").appendTo(i), d = Math.floor(l.width() / this.total), o = c = 0, _ = this.total; 0 <= _ ? c < _ : _ < c; o = 0 <= _ ? ++c : --c) n = $.div().addClass("bead").width(d).appendTo(l), s = $.div().addClass("fill").appendTo(n), o < this.current && s.css({ width: "100%" }), o < this.total - 1 && $.div().addClass("tick").appendTo(n); return r }, e.prototype.cardWrapper = function() { if (this.place.find(".card_header").length) return this.place.find(".card_wrapper") }, e.prototype.setCurrent = function(e) { return e > this.current ? (_ASSERT(e - this.current == 1), this.place.find(".score_wrapper .bead").eq(e - 1).find(".fill").animate_orig({ width: "100%" }, 500)) : e < this.current && (_ASSERT(this.current - e == 1), this.place.find(".score_wrapper .bead").eq(e).find(".fill").animate_orig({ width: "0%" }, 500)), this.current = e }, e.translations = { name: { en: "name", ch: "\u540d\u5b57", pt: "nome", hi: "name", ts: "vito", af: "naam", sw: "Ligama ", xh: "Igama", st: "lebitso", nr: "Igama", ve: "Dzina", zu: "name", nso: "leina", tn: "name" }, back: { ru: "\u043d\u0430\u0437\u0430\u0434", en: "back", ua: "\u043d\u0430\u0437\u0430\u0434", tat: "\u044d\u043b\u0435\u043a", es: "salir", ch: "\u8fd4\u56de", hi: "back", ind: "kembali", pt: "voltar", kk: "back", be: "back", vi: "tr\u1edf l\u1ea1i", ar: "back", jp: "back", en_za: "back", st: "back", ss: "back", af: "back", sw: "emuva", zu: "back", nso: "back", ve: "back", xh: "back", tn: "back", ts: "back", nr: "back" } }, e.prototype.t = function(e) { return this.constructor.translations[e][h.__locale] || this.constructor.translations[e].en }, e._buttonBack = function(e, t) { var n; return "v2" === t.supports.button_back ? (e = e[0].toUpperCase() + e.slice(1), n = $("<a />").addClass("back-link").attr({ href: "#" }).append($.div("arrow-left")).append($.span().html(e))) : n = $("<a />").addClass("card_back").attr({ href: "#" }).html(e).append($.div("pointer")), n }, e
        }()
    }.call(this),
    function(e) {
        function t(e, t) { this.log = !1, this.score = e, this.callback = t }
        t.prototype.construct = function() { this.log && console.log("score subscriber abstract: construct") }, t.prototype.save = function() { this.log && console.log("score subscriber abstract: save") }, t.prototype.load = function() { this.log && console.log("score subscriber abstract: load") }, t.prototype.play_one_exercise = function() { this.log && console.log("score subscriber abstract: play_one_exercise") }, t.prototype.start_script = function() { this.log && console.log("score subscriber abstract: start_script") }, t.prototype.on_exercise_soft_finish = function() { this.log && console.log("score subscriber abstract: on_exercise_soft_finish"), this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1 }, t.prototype.on_exercise_finish = function() { this.log && console.log("score subscriber abstract: on_exercise_finish") }, t.prototype.on_exercise_finish_finish = function() { this.log && console.log("score subscriber abstract: _on_exercise_finish_finish") }, t.prototype.on_event = function() { this.log && console.log("score subscriber abstract: on_event") }, t.prototype.on_fp_event = function(e, t) { this.callback(e, t) }, t.prototype.additionalSalt = function() { return this.log && console.log("score subscriber abstract: extendedSalt"), {} }, t.prototype.cleanSalt = function(e) { this.log && console.log("score subscriber abstract: extendedSalt"); var t = _.extend({}, e); return "_chunk_start" in e && delete t._chunk_start, t }, t.prototype.firstDraw = function() { return !1 }, e.uchiru || (e.uchiru = {}), e.uchiru.ScoreSubscriberAbstract = t
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) { this.level_walker = new LevelWalkerGradeTest, this.level_walker.init(e, this.score.card_meta.supports.grade_test.topics) }, e.prototype.save = function(e) {
            var t = {};
            this.level_walker.save(t), e.level_walker = { json: JSON.stringify(t) }
        }, e.prototype.load = function(e) {
            var t = JSON.parse(e.level_walker.json);
            this.level_walker.load(t)
        }, e.prototype.play_one_exercise = function() { this.score.current = this.level_walker.get_current_level(), this.callback("__update_progress_bar", { factor: this.level_walker.get_progress_factor() }) }, e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("beads_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_finish = function() {
            var e = this;
            e.callback("__update_progress_bar", { factor: e.level_walker.get_progress_factor(), cb: function() { e.score.place.animate({ opacity: 0 }, 500, function() { e.level_walker.are_exercises_of_current_topic_finished() ? (e.level_walker.go_to_next_topic(), e.level_walker.should_finish_card() ? e.callback("__update_progress_bar", { factor: 1, cb: function() { e.score._on_exercise_finish_finish() } }) : e.score._on_exercise_finish_finish()) : (e.level_walker.go_to_next_exercise(), e.score._on_exercise_finish_finish()) }) } })
        }, e.prototype.on_exercise_soft_finish = function() {
            this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake() ? this.level_walker.change_exercise_state("success") : this.level_walker.change_exercise_state("fail")
        }, e.prototype.on_exercise_finish_finish = function() {
            var e;
            this.score.current_exercise_solved ? this.score._onEvent("exercise_finish", { correctly: !0 }) : this.score._onEvent("exercise_finish", { correctly: !1 }), this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), e = this.level_walker.should_finish_card(), this.score._onEvent("__grade_test_exercise_finish", { exercise: this.score.current }), this.score._onEvent("__grade_test_status", this.level_walker.get_state_for_sys_event(e)), this.level_walker.print_status(), this.score.on_exercise_finish(e)
        }, e.prototype.on_event = function(e, t) { t && t.wrong && (this.score.current_exercise_solved = !1) }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.grade_test = e
    }(window, jQuery),
    function(n, t) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) { this.test_labels = _.map(e, function(e) { return { kind: e.test.kind, name: e.test.name } }), this.test_label = null, this.test_success_count = 0 }, e.prototype.save = function(e) { e.test_success_count = this.test_success_count }, e.prototype.load = function(e) { this.test_success_count = e.test_success_count }, e.prototype.play_one_exercise = function() { this.test_label = this.test_labels[this.score.current] }, e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("test_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_finish = function() {
            var e = this;
            t.delay(500, function() { e.score.place.animate({ opacity: 0 }, 300, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake() ? (this.score.current += 1, this.test_success_count += 1) : this.score.current += 1 }, e.prototype.on_exercise_finish_finish = function(e) { this.score.current_exercise_solved ? (this.score._onEvent("test_exercise_finish_succ", this._onEventParams()), this.callback("exercise_finish_succ", this._callbackParams()), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("test_exercise_finish_force_succ", this._onEventParams()), this.callback("exercise_finish_force_succ", this._callbackParams())) : (this.score._onEvent("test_exercise_finish_failed", this._onEventParams()), this.callback("exercise_finish_failed", this._callbackParams())), this.score._onEvent("exercise_finish", { correctly: !1 })), this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), this.score.on_exercise_finish(this.score.current == this.score.total) }, e.prototype.on_event = function(e, t) { t && t.wrong && (this.score.current_exercise_solved && (this.score._onEvent("test_fail", this._onEventParams()), this.callback("fail", this._callbackParams())), this.score.current_exercise_solved = !1) }, e.prototype._onEventParams = function() { return { kind: this.test_label.kind, name: this.test_label.name, amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, total: this.score.total } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.test = e
    }(window, jQuery),
    function(n, t) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) { this.test_labels = _.map(e, function(e) { return { kind: e.test.kind, name: e.test.name } }), this.test_label = null, this.results = [] }, e.prototype.save = function(e) { e.results = this.results }, e.prototype.load = function(e) { this.results = e.results }, e.prototype.play_one_exercise = function() { this.test_label = this.test_labels[this.score.current] }, e.prototype.start_script = function(e) { this.score._onEvent("ege_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total }) }, e.prototype.on_exercise_finish = function() {
            var e = this;
            t.delay(500, function() { e.score.place.animate({ opacity: 0 }, 300, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, this.score.current += 1 }, e.prototype.on_exercise_finish_finish = function(e) { this.score.current_exercise_solved ? (this.results.push({ name: this.test_label.name, is_right: !0 }), this.score._onEvent("ege_exercise_finish_succ", this._onEventParams()), this.callback("exercise_finish_succ", this._onEventParams()), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.results.push({ name: this.test_label.name, is_right: !1 }), this.score._onEvent("ege_exercise_finish_force_succ", this._onEventParams()), this.callback("exercise_finish_force_succ", this._onEventParams())) : (this.results.push({ name: this.test_label.name, is_right: !1 }), this.score._onEvent("ege_exercise_finish_failed", this._onEventParams()), this.callback("exercise_finish_failed", this._callbackParams())), this.score._onEvent("exercise_finish", { correctly: !1 })), this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), this.score.on_exercise_finish(this.score.current == this.score.total) }, e.prototype.on_event = function(e, t) { t && t.wrong && (this.score.current_exercise_solved && (this.score._onEvent("ege_fail", this._onEventParams()), this.callback("fail", this._callbackParams())), this.score.current_exercise_solved = !1) }, e.prototype._onEventParams = function() { return { kind: this.test_label.kind, name: this.test_label.name, amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, total: this.score.total } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.ege_default = e
    }(window, jQuery),
    function(n, r) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        Player = Card.Player1, e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) { this.test_labels = _.map(e, function(e) { return { type: e.test.type, next: r.extend(!0, {}, e.test.next), "class": r.extend(!0, {}, e.test["class"]) } }), this.test_label = null, this.results = [], this.next_label = null, this.percentageProgress = 0, this.recommend_level = null }, e.prototype.save = function(e) { e.results = this.results, e.recommend_level = this.recommend_level, e.percentageProgress = this.percentageProgress }, e.prototype.load = function(e) { this.results = e.results, this.recommend_level = e.recommend_level, this.percentageProgress = e.percentageProgress }, e.prototype.play_one_exercise = function() { this.test_label = this.test_labels[this.score.current] }, e.prototype.start_script = function(e) { this.score._onEvent("english_test_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total }) }, e.prototype.on_exercise_soft_finish = function() {
            var e, t, n, r, s, i, o = this;
            for (r in this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, t = this.results.filter(function(e) { return !e.type }).map(function(e) { return e.type = o.test_label.type, e }), i = this.test_labels.map(function(e) { return e.type }), e = t.filter(function(e) { return e.answer === e.rightAnswer }).length, this.test_label.next)
                if (e >= this.test_label.next[r].range[0] && e <= this.test_label.next[r].range[1]) { s = r; break }
            if (-1 !== (n = i.indexOf(s))) this.score.current = n, this.next_label = this.test_label.next[s];
            else
                for (r in this.score.current = this.score.total, this.next_label = null, this.test_label["class"])
                    if (e >= this.test_label["class"][r].range[0] && e <= this.test_label["class"][r].range[1]) { this.recommend_level = r; break }
        }, e.prototype.on_exercise_finish = function() {
            var e = this,
                t = this.next_label ? this.next_label.progress : 100,
                n = { next: this.test_label.next, type: this.test_label.type, progress: t, amount: this.score.current, total: this.score.total, prevProgress: this.percentageProgress, cb: function() { r.delay(500, function() { e.score.place.animate({ opacity: 0 }, 300, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) }) } };
            this.percentageProgress = t, this.callback("exercise_congrat", n)
        }, e.prototype.on_exercise_finish_finish = function(e) {
            var t;
            this.score.current_exercise_solved ? (this.score._onEvent("english_test_exercise_finish_succ", this._onEventParams()), this.callback("exercise_finish_succ", this._onEventParams()), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("english_test_exercise_finish_force_succ", this._onEventParams()), this.callback("exercise_finish_force_succ", this._onEventParams())) : (this.score._onEvent("english_test_exercise_finish_failed", this._onEventParams()), this.callback("exercise_finish_failed", this._callbackParams())), this.score._onEvent("exercise_finish", { correctly: !1 })), this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), (t = this.score.current == this.score.total) && this.score._onEvent("english_test_recommend_level", { grade: this.recommend_level, results: this.results }), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) {
            if ("english_test__save_results" == e) {
                var n = {};
                this.results.push(t), this.score.save(n), Player._emitSignal("$store", Player.wrapArchive(n))
            }
            t && t.wrong && (this.score.current_exercise_solved && (this.score._onEvent("english_test_fail", this._onEventParams()), this.callback("fail", this._callbackParams())), this.score.current_exercise_solved = !1)
        }, e.prototype._onEventParams = function() { return { kind: this.test_label.next, name: this.test_label.type, amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, total: this.score.total } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.english_test_default = e
    }(window, jQuery),
    function(n, t) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments), this.isShowResult = this.score.card_meta.supports.grade_test_v2 && !0 === this.score.card_meta.supports.grade_test_v2.show_result_with_answers }
        Player = Card.Player1, e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) {
            var t = this;
            this.slugs = [], this.test_labels = [], _(e).forEach(function(e) { return _.range(e.amount).map(function() { return t.test_labels.push({ slug: e.test.slug, amount: e.amount }) }) }), this.test_label = null, this.test_success_count = 0, this.isShowResult && (this.results = [])
        }, e.prototype.save = function(e) { this.isShowResult && (e.results = this.results), e.slugs = this.slugs, e.test_success_count = this.test_success_count }, e.prototype.load = function(e) { this.isShowResult && (this.results = e.results), this.slugs = e.slugs, this.test_success_count = e.test_success_count }, e.prototype.play_one_exercise = function() { this.test_label = this.test_labels[this._get_test_label_index(this.score.current)] }, e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("__grade_test_v2_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake() ? (this.score.current += 1, this.test_success_count += 1) : this.score.current += 1 }, e.prototype.on_exercise_finish = function() {
            var e = this;
            t.delay(500, function() { e.score.place.animate({ opacity: 0 }, 300, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) })
        }, e.prototype.on_exercise_finish_finish = function(e, t) {
            var n;
            if (this.score.current_exercise_solved) { var r = { slug: this.test_label.slug, amount: this.score.current, total: this.score.total }; "StrategyTestAdaptive" === t.name && (r.currentLevel = t.mean, r.delta = t.s), this.score._onEvent("__grade_test_v2_exercise_finish_succ", r), this.callback("exercise_finish_succ", r), this.score._onEvent("exercise_finish", { correctly: !0 }) } else if (e) this.score._onEvent("__grade_test_v2_exercise_finish_force_succ", { slug: this.test_label.slug, amount: this.score.current, total: this.score.total }), this.callback("exercise_finish_force_succ", { amount: this.score.current, total: this.score.total }), this.score._onEvent("exercise_finish", { correctly: !1 });
            else { r = { slug: this.test_label.slug, amount: this.score.current, total: this.score.total }; "StrategyTestAdaptive" === t.name && (r.currentLevel = t.mean, r.delta = t.s), this.score._onEvent("__grade_test_v2_exercise_finish_failed", r), this.callback("exercise_finish_failed", r), this.score._onEvent("exercise_finish", { correctly: !1 }) }
            this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), n = this.score.current === this.score.total, this.slugs = [].concat(this.slugs), this.slugs[this.score.current - 1] = { slug: this.test_label.slug, correct: this.score.current_exercise_solved }, this.score._onEvent("__grade_test_v2_status", { chunk_info: this.slugs, is_lesson_finished: n }), this.score.on_exercise_finish(n)
        }, e.prototype.on_event = function(e, t) {
            if ("grade_test_v2__save_results" == e) {
                var n = {};
                this.results.push(t), this.score.save(n), Player._emitSignal("$store", Player.wrapArchive(n))
            }
            t && t.wrong && this.score.current_exercise_solved && (this.score._onEvent("__grade_test_v2_fail", { slug: this.test_label.slug, amount: this.score.current, total: this.score.total }), this.callback("fail", { amount: this.score.current, total: this.score.total }), this.score.current_exercise_solved = !1)
        }, e.prototype._get_test_label_index = function(e) { var t = 0; for (_ASSERT(e <= this.score.total); e >= this.test_labels[t].amount;) e -= this.test_labels[t].amount, t += 1; return t }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.grade_test_v2 = e
    }(window, jQuery),
    function(n, t) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("__grade_test_hn_start_script", { script_name: this.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, this.score.current += 1 }, e.prototype.on_exercise_finish = function() {
            var e = this;
            t.delay(500, function() { e.score.place.animate({ opacity: 0 }, 300, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) })
        }, e.prototype.on_exercise_finish_finish = function(e, t) {
            var n, r = t.get_test_data(),
                s = this._eventParams();
            this.score.current_exercise_solved ? (this.score._onEvent("__grade_test_hn_exercise_finish_succ", s), this.callback("exercise_finish_succ", s), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("__grade_test_hn_exercise_finish_force_succ", s), this.callback("exercise_finish_force_succ", this._eventParams())) : (this.score._onEvent("__grade_test_hn_exercise_finish_failed", s), this.callback("exercise_finish_failed", this._eventParams())), this.score._onEvent("exercise_finish", { correctly: !1 })), this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), n = this.score.current === this.score.total, this.score._onEvent("__grade_test_hn_status", _.extend({}, r, { is_lesson_finished: n })), this.score.on_exercise_finish(n)
        }, e.prototype.on_event = function(e, t) { "__grade_test_hn_answer" === e && this.score.strategy.onTestAnswer(t) }, e.prototype._eventParams = function() { return { amount: this.score.current, total: this.score.total } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.grade_test_hn = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.play_one_exercise = function() { this.callback("__update_progress_bar", { factor: this.score.strategy.get_progress_factor() }) }, e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("__adaptive_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_finish = function() {
            var e = this,
                t = this.score.strategy.without_mistake();
            this.callback("__update_progress_bar", { factor: e.score.strategy.get_next_progress_factor(this.score.current_exercise_solved || t), cb: function() { e.score.place.animate({ opacity: 0 }, 500, function() { e.score.place.css({ opacity: 1 }), e.score._on_exercise_finish_finish() }) } })
        }, e.prototype.on_exercise_finish_finish = function(e, t) {
            var n = t.progressFactor,
                r = 1 === n;
            this.score.current_exercise_solved ? (this.score._onEvent("__adaptive_exercise_finish_succ", { progress_factor: n }), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? this.score._onEvent("__adaptive_exercise_finish_force_succ", { progress_factor: n }) : this.score._onEvent("__adaptive_exercise_finish_failed", { progress_factor: n }), this.score._onEvent("exercise_finish", { correctly: !1 })), r && this.score._onEvent("level_finish", { num: 1 }), this.score.on_exercise_finish(r)
        }, e.prototype.on_event = function(e, t) { t && t.wrong && (this.score.current_exercise_solved = !1) }, e.prototype.on_fp_event = function() { this.log && console.log("score subscriber absctract: on_event") }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.adaptive = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function() { this.lamps = 0; try { score.card_meta.supports.lamps.with_hint ? this.lamps_hint = !1 : this.lamps_hint = null } catch (e) { this.lamps_hint = null } }, e.prototype.save = function(e) { e.lamps = this.lamps, e.lamps_hint = this.lamps_hint }, e.prototype.load = function(e) { this.lamps = e.lamps, this.lamps_hint = e.lamps_hint }, e.prototype.additionalSalt = function() { var e, t, n, r = {}; return null !== this.lamps_hint ? (r._lamps_glass = !!(null != (e = this.score.score_options.lamps) ? e.under_glass : void 0) || !!this.lamps_hint && 3 === this.lamps, r._lamps_hint = !!(null != (t = this.score.score_options.lamps) ? t.lamps_hint : void 0) || !!this.lamps_hint) : r._lamps_glass = !!(null != (n = this.score.score_options.lamps) ? n.under_glass : void 0) || 3 === this.lamps, r }, e.prototype.cleanSalt = function(e) { var t = _.extend({}, e); return "_chunk_start" in e && delete t._chunk_start, "_lamps_glass" in e && delete t._lamps_glass, "_lamps_hint" in e && delete t._lamps_hint, t }, e.prototype.on_exercise_finish = function() { this.score._on_exercise_finish_finish() }, e.prototype.on_exercise_finish_finish = function(e) {
            var t, n = this.score.current_exercise_solved || e,
                r = this.score.score_options.lamps;
            this.score.current_exercise_solved ? (this.score._onEvent("__lamps_exercise_finish_succ", this._onEventParams()), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? this.score._onEvent("__lamps_exercise_finish_force_succ", this._onEventParams()) : this.score._onEvent("__lamps_exercise_finish_failed", this._onEventParams()), this.score._onEvent("exercise_finish", { correctly: !1 })), n && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), t = n && 3 !== this.lamps && !(null != r ? r.under_glass : void 0), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) { t && t.wrong && (this.score.current_exercise_solved && this.lamps < 3 && (this.lamps += 1, 3 === this.lamps && !1 === this.lamps_hint && (this.lamps = 0, this.lamps_hint = !0, this.score._onEvent("lamps_fail", this._onEventParams()), this.callback("fail", this._onEventParams()))), this.score.current_exercise_solved = !1) }, e.prototype.on_fp_event = function(e, t) { this.callback(e, t) }, e.prototype._onEventParams = function() { return { lamps: this.lamps, lamps_hint: this.lamps_hint } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.lamps = e
    }(window, jQuery),
    function(n, l) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function(e) { this.interbeads_congrats = _.map(e, function(e) { return e.congrat }) }, e.prototype.start_script = function(e) {
            var t = this;
            Card && Card["Script" + this.score.script_name] && (this.score.place.empty(), this.score.place.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { t.score.place.css({ opacity: "" }) })), this.score._onEvent("beads_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, (this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake()) && (this.score.current += 1) }, e.prototype.on_exercise_finish = function(e) {
            var t, n = this,
                r = this.score.card_meta.supports,
                s = r.beads,
                i = r.interbeads_congrat,
                o = r.play_button,
                a = this.score.strategy.without_mistake(),
                c = this.score.current_exercise_solved || a,
                u = this.score._get_strategy_index(c ? this.score.current - 1 : this.score.current); - 1 < ["v1", "v2", "v3", "v4"].indexOf(s) && -1 < ["v1", "v2"].indexOf(i) ? (-1 < ["v1", "v4"].indexOf(s) && ("v1" === i ? t = "no" : o && o.kind && "ege" === o.kind && "skip_interbeads" === e ? t = "no" : o && o.kind && "english_test" === o.kind && "skip_interbeads" === e && (t = "no")), this.callback("__interbeads_congrat", { current_exercise_solved: c, chunk_idx: u, chunk_end: c && this.score._chunk_ended(), interbeads_congrat: this.interbeads_congrats[u] || t, interbeads_congrat_sound: r.interbeads_congrat_sound, interbeads_congrat_locale: r.interbeads_congrat_locale, cb: function() { l.delay(500, function() { n.score.place.animate({ opacity: 0 }, 300, function() { n.score.place.css({ opacity: 1 }), n.score._on_exercise_finish_finish() }) }) } })) : l.delay(500, function() { n.score.place.animate({ opacity: 0 }, 300, function() { n.score.place.css({ opacity: 1 }), n.score._on_exercise_finish_finish() }) })
        }, e.prototype.on_exercise_finish_finish = function(e) {
            var t, n = this.score.card_meta.supports.beads,
                r = -1 < ["v2", "v3", "v4"].indexOf(n) ? this._callbackParams() : this._onEventParams();
            this.score.current_exercise_solved ? (this.score._onEvent("beads_exercise_finish_succ", this._onEventParams()), this.callback("exercise_finish_succ", r), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("beads_exercise_finish_force_succ", this._onEventParams()), this.callback("exercise_finish_force_succ", r)) : (this.score._onEvent("beads_exercise_finish_failed", this._onEventParams()), this.callback("exercise_finish_failed", r)), this.score._onEvent("exercise_finish", { correctly: !1 })), (this.score.current_exercise_solved || e) && this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), (t = (this.score.current_exercise_solved || e) && this.score.current === this.score.total) && this.score._onEvent("beads_lesson_finish", this._onEventParams()), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) {
            var n, r, s, i = this.score.card_meta.supports.beads,
                o = -1 < ["v2", "v3", "v4"].indexOf(i);
            t && t.wrong && (s = this.score._get_strategy(this.score.current), this.score.current_exercise_solved && (s.without_penalty() || s.without_mistake() ? this.score._onEvent("beads_fail", this._onEventParams()) : (n = this.score._get_strategy_index(this.score.current - 1), r = this.score._get_strategy_index(this.score.current), 0 < this.score.current && n === r ? (this.score.current -= 1, this.score._onEvent("beads_fail_minus_one", this._onEventParams()), this.callback("bead_move_left", o ? this._callbackParams() : this._onEventParams())) : this.score._onEvent("beads_fail", this._onEventParams()))), this.score.current_exercise_solved = !1)
        }, e.prototype.firstDraw = function() { return !0 }, e.prototype._onEventParams = function() { return { amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, chunks: _(this.score.strategies).map(function(e) { return { amount: e.amount() } }) } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.beads = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.construct = function() { this.progressProgress = null, this.cardWrapper = null }, e.prototype.start_script = function(e) {
            var t = this;
            this.progressProgress = new Card.Player1.ProgressProgress({ place: this.score.place, card_name: this.score.card_name, card_meta: this.score.card_meta, current: this.score.current, total: this.score.total, onBack: function() { t.callback("back") } }), this.cardWrapper = this.progressProgress.cardWrapper(), null == this.cardWrapper && (this.cardWrapper = this.progressProgress.createCardWrapper()), this.score.place = this.cardWrapper, this.score._onEvent("beads_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, (this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake()) && (this.score.current += 1, this.progressProgress.setCurrent(this.score.current)) }, e.prototype.on_exercise_finish = function() { this.score._on_exercise_finish_finish() }, e.prototype.on_exercise_finish_finish = function(e) {
            var t, n = this._onEventParams();
            this.score.current_exercise_solved ? (this.score._onEvent("beads_exercise_finish_succ", n), this.callback("exercise_finish_succ", n), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("beads_exercise_finish_force_succ", n), this.callback("exercise_finish_force_succ", n)) : (this.score._onEvent("beads_exercise_finish_failed", n), this.callback("exercise_finish_failed", n)), this.score._onEvent("exercise_finish", { correctly: !1 })), (this.score.current_exercise_solved || e) && this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), (t = (this.score.current_exercise_solved || e) && this.score.current === this.score.total) && this.score._onEvent("beads_lesson_finish", this._onEventParams()), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) {
            var n, r, s;
            t && t.wrong && (s = this.score._get_strategy(this.score.current), this.score.current_exercise_solved && (s.without_penalty() || s.without_mistake() ? this.score._onEvent("beads_fail", this._onEventParams()) : (n = this.score._get_strategy_index(this.score.current - 1), r = this.score._get_strategy_index(this.score.current), 0 < this.score.current && n === r ? (this.score.current -= 1, this.score._onEvent("beads_fail_minus_one", this._onEventParams()), this.callback("bead_move_left", this._onEventParams()), this.progressProgress.setCurrent(this.score.current)) : this.score._onEvent("beads_fail", this._onEventParams()))), this.score.current_exercise_solved = !1)
        }, e.prototype.firstDraw = function() { return null == this.cardWrapper }, e.prototype._onEventParams = function() { return { amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, chunks: _(this.score.strategies).map(function(e) { return { amount: e.amount() } }) } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.progress = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.start_script = function(e) {
            var t = this,
                n = { place: t.score.place, cardName: t.score.card_name, cardMeta: t.score.card_meta, onBack: function() { t.callback("back") } };
            this.score.score_options.olymp && (n.dtime = this.score.score_options.olymp.dtime), this.olympProgress = new Card.Player1.OlympProgress(n), this.olympProgress.init(), this.score._onEvent("beads_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total })
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, (this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake()) && (this.score.current += 1) }, e.prototype.on_exercise_finish = function() { this.score._on_exercise_finish_finish() }, e.prototype.on_exercise_finish_finish = function(e) {
            var t, n = this._onEventParams();
            this.score.current_exercise_solved ? (this.score._onEvent("beads_exercise_finish_succ", n), this.callback("exercise_finish_succ", n), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("beads_exercise_finish_force_succ", n), this.callback("exercise_finish_force_succ", n)) : (this.score._onEvent("beads_exercise_finish_failed", n), this.callback("exercise_finish_failed", n)), this.score._onEvent("exercise_finish", { correctly: !1 })), (this.score.current_exercise_solved || e) && this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), (t = (this.score.current_exercise_solved || e) && this.score.current === this.score.total) && this._onEvent("beads_lesson_finish", this._onEventParams()), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) {
            var n, r, s = this.score._get_strategy(this.score.current);
            t && t.wrong && (this.score.current_exercise_solved && (s.without_penalty() || s.without_mistake() ? this.score._onEvent("beads_fail", this._onEventParams()) : (n = this.score._get_strategy_index(this.score.current - 1), r = this.score._get_strategy_index(this.score.current), 0 < this.score.current && n === r ? (this.score.current -= 1, this.score._onEvent("beads_fail_minus_one", this._onEventParams()), this.callback("bead_move_left", this._onEventParams())) : this.score._onEvent("beads_fail", this._onEventParams()))), this.score.current_exercise_solved = !1)
        }, e.prototype.firstDraw = function() { return !0 }, e.prototype._onEventParams = function() { return { amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, chunks: _(this.score.strategies).map(function(e) { return { amount: e.amount() } }) } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.olymp = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.start_script = function() {}, e.prototype.on_exercise_soft_finish = function() {}, e.prototype.on_exercise_finish = function() {}, e.prototype.on_exercise_finish_finish = function() {}, e.prototype.on_event = function() {}, e.prototype.on_fp_event = function() {}, e.prototype.cleanSalt = function(e) { return e }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.olymp_answer = e
    }(window, jQuery),
    function(n) {
        function e(e, t) { n.uchiru.ScoreSubscriberAbstract.apply(this, arguments) }
        e.prototype = Object.create(n.uchiru.ScoreSubscriberAbstract.prototype), e.prototype.start_script = function(e) {
            var t = this.score.score_options.game,
                n = { cardMeta: this.score.card_meta };
            t && (n.localStorageKey = t.local_storage_key, n.eventsUrl = t.events_url, n.data = t.data), this.game = new Card.Player1.Game(n), this.score._onEvent("beads_start_script", { script_name: this.score.script_name, salt: e, amount: this.score.current, total: this.score.total }), this.score.tutor && (this.score.tutor.game = this.game)
        }, e.prototype.on_exercise_soft_finish = function() { this.score._chunk_indexes[this.score._get_strategy_index(this.score.current)] += 1, (this.score.current_exercise_solved || this.score._get_strategy(this.score.current).without_mistake()) && (this.score.current += 1) }, e.prototype.on_exercise_finish = function() { this.score._on_exercise_finish_finish() }, e.prototype.on_exercise_finish_finish = function(e) {
            var t, n = this._onEventParams();
            this.game && (this.game.destroy(), this.game = null), this.score.tutor && (this.score.tutor.game = null), this.score.current_exercise_solved ? (this.score._onEvent(
                "beads_exercise_finish_succ", n), this.callback("exercise_finish_succ", n), this.score._onEvent("exercise_finish", { correctly: !0 })) : (e ? (this.score._onEvent("beads_exercise_finish_force_succ", n), this.callback("exercise_finish_force_succ", n)) : (this.score._onEvent("beads_exercise_finish_failed", n), this.callback("exercise_finish_failed", n)), this.score._onEvent("exercise_finish", { correctly: !1 })), (this.score.current_exercise_solved || e) && this.score._chunk_ended() && this.score._onEvent("level_finish", { num: this.score._get_strategy_index(this.score.current - 1) + 1 }), (t = (this.score.current_exercise_solved || e) && this.score.current === this.score.total) && this._onEvent("beads_lesson_finish", this._onEventParams()), this.score.on_exercise_finish(t)
        }, e.prototype.on_event = function(e, t) {
            var n, r, s = this.score._get_strategy(this.score.current);
            t && t.wrong && (this.score.current_exercise_solved && (s.without_penalty() || s.without_mistake() ? this.score._onEvent("beads_fail", this._onEventParams()) : (n = this.score._get_strategy_index(this.score.current - 1), r = this.score._get_strategy_index(this.score.current), 0 < this.score.current && n === r ? (this.score.current -= 1, this.score._onEvent("beads_fail_minus_one", this._onEventParams()), this.callback("bead_move_left", this._onEventParams())) : this.score._onEvent("beads_fail", this._onEventParams()))), this.score.current_exercise_solved = !1)
        }, e.prototype.firstDraw = function() { return !0 }, e.prototype._onEventParams = function() { return { amount: this.score.current, total: this.score.total } }, e.prototype._callbackParams = function() { return { amount: this.score.current, chunks: _(this.score.strategies).map(function(e) { return { amount: e.amount() } }) } }, n.uchiru || (n.uchiru = {}), n.uchiru.scoreSubscribers || (n.uchiru.scoreSubscribers = {}), n.uchiru.scoreSubscribers.game = e
    }(window, jQuery),
    function() {
        var E, C, T, P = function(e, t) { return function() { return e.apply(t, arguments) } };
        E = this.Card, (T = E.Player1).OlympProgress, T.ProgressProgress, C = T.IframeScript, T.Game, T.Score = function() {
            function e(e, t, n, r, s, i, o, a, c, u, l, d, p, h, f, m, y, g, v, b, k, A, w, x, S) {
                var E;
                this.place = e, this.total = n, this.locale = r, this.keypad_manager = s, this.listeners = i, this.on_beads = o, this.on_lamps = a, this.on_test = c, this.on_ege = u, this.on_english_test = l, this.on_grade_test = d, this.on_grade_test_v2 = p, this.on_grade_test_hn = h, this.on_adaptive = f, this.fullscreen = m, this.lab_options = y, this.speech_on = g, this.css_namespace = v, this.graph_dev = b, this.progress = k, this.card_name = A, this.card_meta = w, this.dont_pass_chunk_start = x, this.score_options = null != S ? S : {}, this.load = P(this.load, this), this.save = P(this.save, this), this.current = 0, this.current_exercise_solved = null, this._index = 0, this._chunk_indexes = _.map(t, function() { return 0 }), this.strategies = _.map(t, (E = this, function(e) { return new(T[("strategy_" + e.strategy).camelize()])(e, { chunks: t, card_meta: E.card_meta }) })), this.subscriber = this._getSubscriber(this.progress), this.play_button_types = _.map(t, function(e) { return e.play_button_type }), this.strategy = null, this.on_exercise_finish = null, this.savedProgress = null, this.subscriber.construct(t)
            }
            return e.prototype.save = function(n) { return n.current = this.current, n.current_exercise_solved = this.current_exercise_solved, n._index = this._index, n._chunk_indexes = this._chunk_indexes, n.strategies = [], n.savedProgress = this.savedProgress, _(this.strategies).each(function(e) { var t; return t = {}, e.save(t), n.strategies.push(t) }), this.subscriber.save(n) }, e.prototype.load = function(e) { var t, n, r, s; for (this.current = e.current, this.current_exercise_solved = e.current_exercise_solved, this._index = e._index, this._chunk_indexes = e._chunk_indexes, this.savedProgress = e.savedProgress, n = r = 0, s = this.strategies.length; 0 <= s ? r < s : s < r; n = 0 <= s ? ++r : --r) t = e.strategies[n], this.strategies[n].load(t); return this.subscriber.load(e) }, e.prototype.before_play_one_exercise = function(e) { return this.strategy = this._get_strategy(this.current), null != this.strategy.setup ? this.strategy.setup(function() { return e() }) : e() }, e.prototype.play_one_exercise = function(e) { var t, n, r, s, i, o, a, c, u, l; return this.subscriber.play_one_exercise(), this.on_exercise_finish = e, this.strategy = this._get_strategy(this.current), t = 0 === this._chunk_indexes[this._get_strategy_index(this.current)], a = this.strategy.salt(this._index), _.isObject(a) && !_.isArray(a) ? (r = {}, this.dont_pass_chunk_start || (r._chunk_start = t), s = _.extend(r, this.subscriber.additionalSalt()), n = _.extend(s, a), r = null) : n = a, c = _(n).has("_script") ? n._script : this.strategy.script_name(), this.script_name = c, t && this._on_event("level_start", { _signal: !0, at: (new Date).getTime() / 1e3, num: this._get_strategy_index(this.current) + 1 }), "by_script" === this.card_meta.supports.load_assets ? (T.uchiruPlaceAddLoader(this.place), i = T.load_assets(this.script_name), o = setTimeout((l = this, function() { return o = null, l.place.css({ opacity: 1 }) }), 300), $.when(i).done((u = this, function() { return null != o && clearTimeout(o), (o = null) != T.uchiruPlaceCurrentLoader && T.uchiruPlaceRemoveLoader(u.place), u._start_script(n) }))) : this._start_script(n) }, e.prototype._getSubscriber = function(e) { var t, n; if (this.score_options.olymp_answer) return t = this.on_beads, new window.uchiru.scoreSubscribers.olymp_answer(this, t); try { return t = "progress" === (n = e) || "olymp" === e || "game" === e ? this.on_beads : this["on_" + e], "ege" !== e && "english_test" !== e || this.card_meta.supports[e] && (n += "_" + this.card_meta.supports[e].type), new window.uchiru.scoreSubscribers[n](this, t) } catch (r) { return console.warn("Score subscriber not set for progress: " + e), null } }, e.prototype._start_script = function(e) { var t, n, r, s, i, o, a, c, u, l, d, p, h, f, m, y, g, v, b, k, A, w, x, S; return this.current_exercise_solved = !0, this.place.attr("class", T._uchiruPlaceClassName(this.card_meta)).addClass(this.css_namespace).addClass("script" + this.script_name), E["Script" + this.script_name] && null != T.uchiruPlaceCurrentLoader && T.uchiruPlaceRemoveLoader(this.place), this.fullscreen || T._uchiruPlaceAddFixedClassName(this.place, this.card_meta), m = "v1" === T._scriptMeta(this.script_name).supports.websolver ? this.score_options.websolver : void 0, E["Script" + this.script_name] ? (h = E["Script" + this.script_name]["Script" + parseInt(this.script_name)], E["Script" + this.script_name].__locale = T.__locale, E["Script" + this.script_name].__public_path = T.__public_path, this.tutor = new T.Tutor({ script_name: this.script_name, locale: this.locale, keypad_manager: this.keypad_manager, on_exercise_soft_end: (v = this, function() { return v._on_exercise_soft_finish() }), on_exercise_end: (g = this, function(e) { return g._on_exercise_finish(e) }), on_event: (y = this, function(e, t) { return y._onEvent(e, t) }), card_meta: this.card_meta, student_name: this.score_options.student_name, websolver: m })) : (h = C.Script, this.tutor = null), s = this.subscriber.firstDraw(), r = _.isObject(e) && !_.isArray(e) ? _.extend({ _first_draw: s }, e) : e, E["Script" + this.script_name] && this.speech_on && ("v2" === this.card_meta.supports.sound ? this.speech_manager = new T.SpeechManagerV2({ locale: T.__locale, on_event: (b = this, function(e, t) { if ("speech_synthesis_not_supported_by_browser" === e) return b._on_fp_event("__speech_synthesis_not_supported_by_browser", t) }) }) : (this.speech_manager = new T.SpeechManager(this.place, T.__locale, T._scriptMeta(this.script_name).translations[T.__locale]), this.speech_manager.run())), this.speech_on && "v2" === this.card_meta.supports.sound && "v2" === T._scriptMeta(this.script_name).supports.resources && (this.audio_manager = new T.AudioManager({ "const": T._scriptMeta(this.script_name)["const"], locale: T.__locale, on_event: (k = this, function(e, t) { if ("missed_audio_constant" === e) return k._onEvent("__missed_audio_constant", _.extend({ script_name: k.script_name }, t)) }) })), this.speech_on && "v2" === this.card_meta.supports.sound && "v2" === T._scriptMeta(this.script_name).supports.resources && (this.speaker_manager = new T.SpeakerManager({ script_name: this.script_name, "const": T._scriptMeta(this.script_name)["const"], locale: T.__locale, on_event: (A = this, function(e, t) { if ("missed_speech_constant" === e) return A._onEvent("__missed_speech_constant", _.extend({ script_name: A.script_name }, t)) }), with_synthesis_fallback: null != (c = this.score_options.speech) ? c.with_synthesis_fallback : void 0 }), this.speaker_manager.speech_manager = this.speech_manager, this.speaker_manager.audio_manager = this.audio_manager), E["Script" + this.script_name] || this.place.css({ overflow: "hidden" }), this.score_options.reward && (this.reward = { data: null != (u = this.score_options.reward) ? u.data : void 0 }), null != this.tutor && (this.tutor.speech_manager = this.speech_manager, this.tutor.audio_manager = this.audio_manager, this.tutor.speaker_manager = this.speaker_manager, this.tutor.reward = this.reward), this.subscriber.start_script(T.jsonTruncateDataUrls(r)), h === C.Script ? (o = !!this.card_meta.supports.iframe_scripts && (null != (l = this.card_meta.script_metas) ? l["script_" + this.script_name] : void 0), t = this.score_options.content_card_id, p = this.script_name, f = o ? this.score_options.version : this.score_options.script_versions[this.script_name + "_script"], d = new h(this.place, { locale: T.__locale, publicPath: T.__public_path, isRenderIframeScriptFromCard: o, cardId: t, scriptId: p, version: f, onExerciseSoftEnd: (S = this, function() { return S._on_exercise_soft_finish() }), onExerciseEnd: (x = this, function() { return x._on_exercise_finish() }), onEvent: (w = this, function(e, t) { return w._onEvent(e, t) }), speechManager: this.speech_manager, audioManager: this.audio_manager, speakerManager: this.speaker_manager, cardMeta: o ? this.card_meta : null, speechOn: this.speech_on, studentName: this.score_options.student_name, websolver: this.score_options.websolver, olymp_answer: this.score_options.olymp_answer, olymp_answer_value: this.score_options.olymp_answer_value })) : h.steps ? (this.rt = new T.StepsRT, d = new h(this.place, this.tutor, this.rt), this.rt.attach(d, this.lab_options)) : h.__is_graph ? ((i = {}).supports = T._scriptMeta(this.script_name).supports.graph || {}, d = new h(this.place, this.tutor, this.graph_dev, i), i = null) : d = new h(this.place, this.tutor), n = _.isObject(e) && !_.isArray(e) ? this.subscriber.cleanSalt(e) : e, this._onEvent("exercise_start", { script_name: this.script_name, salt: T.jsonTruncateDataUrls(n), salt_ex: T.jsonTruncateDataUrls(r), amount: this.current, total: this.total }), this._script = d, this.score_options.olymp_answer ? h === C.Script ? this._script.run(_.clone(r)) : E["Script" + this.script_name].olymp_draw_answer(this.place, this.score_options.olymp_answer_value, this.tutor) : (a = $.extend({}, _.clone(r), { saved_progress: this.savedProgress }), this._script.run(a)), T.MessageTunnel.sendMessage(window, "FatPlayer.cardResize") }, e.prototype._on_exercise_soft_finish = function() { return this._index += 1, this.subscriber.on_exercise_soft_finish() }, e.prototype._on_exercise_finish = function(e) { return this.subscriber.on_exercise_finish(e) }, e.prototype._on_exercise_finish_finish = function() { var e, t, n, r; return T._scriptMeta(this.script_name).supports.destroy && this._script.destroy(), this._script = null, this.rt = null, r = this.strategy.without_mistake(), null != this.tutor && this._nullify_tutor(), E["Script" + this.script_name] ? (this.speech_on && "v2" === this.card_meta.supports.sound && "v2" === T._scriptMeta(this.script_name).supports.resources && (null != (t = this.speaker_manager) && t.destroy(), this.speaker_manager = null), this.speech_on && "v2" === this.card_meta.supports.sound && "v2" === T._scriptMeta(this.script_name).supports.resources && (null != (n = this.audio_manager) && n.unload(), this.audio_manager = null), this.speech_on && ("v2" !== this.card_meta.supports.sound && this.speech_manager.detach(), this.speech_manager = null)) : this.place.css({ overflow: "" }), this.script_name = null, this.strategy.on_exercise_finish(this.current_exercise_solved || r), e = this.strategy, this.strategy = null, this.subscriber.on_exercise_finish_finish(r, e) }, e.prototype._onEvent = function(e, t) { var n; return n = this._timestampify(t), this._on_event(e, n) }, e.prototype._timestampify = function(e) { return $.extend({ at: (new Date).getTime() / 1e3 }, e) }, e.prototype._on_event = function(t, e) { var n, r, s, i; return "save_progress" === t && (this.savedProgress = $.extend({}, this.savedProgress, e), this.save(n = {}), T._emitSignal("$store", T.wrapArchive(n))), e.wrong ? (r = this.current_exercise_solved ? { _event_type: 1 } : { _event_type: 2 }, i = $.extend(r, e)) : i = $.extend({ _event_type: 0 }, e), _(this.listeners).each(function(e) { return e.on_event(t, i) }), "__play_button" === t && "request" === e.mode && (s = this._get_strategy_index(this.current), this.on_beads("__play_button", _.extend({ card_start: 0 === this._chunk_indexes[0], chunk_start: 0 === this._chunk_indexes[s], chunk_idx: s, play_button_type: this.play_button_types[s] }, e)), s = null), "__keypad_3_start" !== t && "__keypad_3_finish" !== t && "__keypad_3_button_ok_toggle" !== t && "__keypad_3_button_ok_wrong" !== t && "__keypad_3_button_ok_clear" !== t && "__keypad_3_button_ok_right" !== t && "__keypad_3_activate" !== t && "__keypad_3_deactivate" !== t && "__keypad_3_prevent_default_init" !== t && "__keypad_3_prevent_default_destroy" !== t && "__keypad_3_emit" !== t && "__back" !== t && "user-event.check" !== t || this._on_fp_event(t, e), this.subscriber.on_event(t, e) }, e.prototype._on_fp_event = function(e, t) { return this.subscriber.on_fp_event(e, t) }, e.prototype._get_strategy_index = function(e) { var t; for (_ASSERT(e <= this.total), t = 0; e >= this.strategies[t].amount();) e -= this.strategies[t].amount(), t += 1; return t }, e.prototype._get_strategy = function(e) { return this.strategies[this._get_strategy_index(e)] }, e.prototype._chunk_ended = function() { return this.current === this.total || this._get_strategy_index(this.current - 1) < this._get_strategy_index(this.current) }, e.prototype._nullify_tutor = function() { return this.tutor.speaker_manager = null, this.tutor.audio_manager = null, this.tutor.speech_manager = null }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.ScriptChart = function() {
            function e(e, t) {
                var n, r, s, i, o, a, c, u, _, l;
                this.chart = e, this.total = t, "undefined" != typeof d3 && null !== d3 && (this.path = null, this.circles = null, s = { top: 10, right: 10, bottom: 30, left: 20 }, o = (i = 30) * i, n = 30 * this.total, a = o + s.left + s.right, r = n + s.top + s.bottom, this.svg = d3.select("#" + this.chart.attr("id")).append("svg").attr("width", a).attr("height", r).append("g").attr("transform", "translate(" + s.left + ", " + s.top + ")"), this.x_scale = d3.scale.linear().domain([0, i]).range([0, o]), this.y_scale = d3.scale.linear().domain([0, this.total]).range([n, 0]), c = d3.svg.axis().scale(this.x_scale).orient("bottom"), u = d3.svg.axis().scale(this.y_scale).orient("left").ticks(this.total), this.line = d3.svg.line().x((l = this, function(e) { return l.x_scale(e[0]) })).y((_ = this, function(e) { return _.y_scale(e[1]) })), this.svg.append("g").attr("transform", "translate(0," + n + ")").call(c).selectAll("line, path").attr("fill", "none").attr("stroke", "black").attr("shape-rendering", "crispEdges"), this.svg.append("g").call(u).selectAll("line, path").attr("fill", "none").attr("stroke", "black").attr("shape-rendering", "crispEdges"), this.dataset = [
                    [0, 0]
                ])
            }
            return e.prototype.on_event = function(e, t) { if ("undefined" != typeof d3 && null !== d3) return "beads_exercise_finish_succ" === e || "beads_fail" === e || "beads_fail_minus_one" === e ? (this.dataset.push([this.dataset.length, t.amount]), this.draw_path()) : void 0 }, e.prototype.draw_path = function() { return this.path && this.path.remove(), this.circles && this.circles.remove(), this.path = this.svg.append("path").datum(this.dataset).attr("d", this.line).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 3), this.circles = this.svg.selectAll("circle").data(this.dataset).enter().append("circle").attr("cx", (n = this, function(e) { return n.x_scale(e[0]) })).attr("cy", (t = this, function(e) { return t.y_scale(e[1]) })).attr("r", 4).attr("fill", "steelblue"); var t, n }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyShuffle = function() {
            function e(e) {
                var n;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.indexes = _.shuffle(function() { n = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this)), this.index = 0
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.index = this.index, e.indexes = this.indexes }, e.prototype.load = function(e) { return this.index = e.index, this.indexes = e.indexes }, e.prototype.salt = function() { var e; return e = this.indexes[this.index % this.indexes.length], this._generations[e] }, e.prototype.on_exercise_finish = function() { return this.index += 1 }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyStack = function() {
            function e(e) { this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.index = 0 }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.index = this.index }, e.prototype.load = function(e) { return this.index = e.index }, e.prototype.salt = function() { return this._generations[this.index % this._generations.length] }, e.prototype.on_exercise_finish = function() { return this.index += 1 }, e
        }()
    }.call(this),
    function() {
        var e, t;
        e = this.Card, (t = e.Player1).StrategyShift = function() {
            function e(e) { this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this._max_gen = this._generations.length - 1, this._mid_gen = Math.ceil(this._max_gen / 2), Object.defineProperties(this, { index: { configurable: !1, get: function() { var e; return (e = this._mid_gen + t.StrategyShift.shift) < 0 && (e = 0), e > this._max_gen && (e = this._max_gen), e } } }) }
            return e.shift = 0, e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.index = this.index }, e.prototype.load = function(e) { return this.index = e.index }, e.prototype.salt = function() { return this._generations[this.index % this._generations.length] }, e.prototype.on_exercise_finish = function(e) { return e && t.StrategyShift.shift < this._mid_gen ? t.StrategyShift.shift += 1 : !e && t.StrategyShift.shift > -this._mid_gen && (t.StrategyShift.shift -= 1), this.index += 1 }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyGradeTestHn = function() {
            function e(e, t) {
                var n;
                n = (null != t ? t : {}).card_meta, this._part_length = Math.floor(n.chunks[0].amount / 2), this._second_part_conditions = n.supports.grade_test_hn.second_part_conditions, this._second_part = 0, this._first_part_result = 0, this._test_data = [], this._script_name = e.script, this._amount = e.amount, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this._generations = e.generations, this.index = 0
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.onTestAnswer = function(e) { var t; if (t = { student_answer: e.student_answer, right_answer: e.right_answer, task_id: e.task_id }, this._test_data.push(t), this._test_data.length <= this._part_length && t.student_answer === t.right_answer) return this._first_part_result += 1 }, e.prototype.get_test_data = function() { return { part_length: this._part_length, second_part: this._second_part, first_part_result: this._first_part_result, test_data: this._test_data } }, e.prototype.save = function(e) { var t; return (t = {}).index = this.index, t._test_data = this._test_data, t._second_part = this._second_part, t._first_part_result = this._first_part_result, e.json = JSON.stringify(t) }, e.prototype.load = function(e) { var t; return t = JSON.parse(e.json), this.index = t.index, this._test_data = t._test_data, this._second_part = t._second_part, this._first_part_result = t._first_part_result }, e.prototype.salt = function() {
                var e, t, n, r, s;
                if (this._test_data.length === this._part_length)
                    for (t = e = 0, n = (r = this._second_part_conditions).length; e < n && (s = r[t], this._first_part_result > s); t = ++e) this._second_part++;
                return this._generations[(this.index + this._second_part * this._part_length) % this._generations.length]
            }, e.prototype.on_exercise_finish = function() { return this.index += 1 }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyStackAdaptive = function() {
            function e(e) {
                var n;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.indexes = function() { n = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.counter = Array.rep(this._generations.length, 0), null != e.stack_adaptive_beads && (this._beads = e.stack_adaptive_beads)
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.indexes = this.indexes, e.counter = this.counter }, e.prototype.load = function(e) { return this.indexes = e.indexes, this.counter = e.counter }, e.prototype.salt = function(e) { var t; return t = this._generations[this.indexes.first()], _.isObject(t) && !_.isArray(t) ? _.extend({ _amount: this.counter[this.indexes.first()], _index: e }, t) : t }, e.prototype.on_exercise_finish = function(e) { var t, n, r, s; return this.counter[this.indexes.first()] += 1, e ? (s = this.indexes.shift(), 0 === this.indexes.length && (this.indexes = function() { n = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), s === this.indexes.first()) ? this.indexes.shift() : void 0) : (s = this.indexes.shift(), 0 < this.indexes.length ? (t = null != this._beads ? this._beads : _.random(2, 3), this.indexes.splice(t, 0, s)) : (this.indexes = function() { r = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this), s === this.indexes.first() && this.indexes.shift(), this.indexes.splice(1, 0, s))) }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyStackAdaptiveWithVariations = function() {
            function e(e) {
                var n, s;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.indexes = function() { n = []; for (var e = 0, t = this._generations.stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.values = this.indexes.map((s = this, function(n) { var r; return function() { r = []; for (var e = 0, t = s._generations.values[s._generations.stack[n]].length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this) })), null != e.stack_adaptive_with_variations_beads && (this._beads = e.stack_adaptive_with_variations_beads)
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.indexes = this.indexes, e.values = this.values }, e.prototype.load = function(e) { return this.indexes = e.indexes, this.values = e.values }, e.prototype.salt = function() { return this._generations.values[this._generations.stack[this.indexes[0]]][this.values[this.indexes[0]][0]] }, e.prototype.on_exercise_finish = function(e) { var t, n, r, s; return this.values[this.indexes[0]].push(this.values[this.indexes[0]].shift()), e ? (s = this.indexes.shift(), 0 === this.indexes.length && (this.indexes = function() { n = []; for (var e = 0, t = this._generations.stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), s === this.indexes.first()) ? this.indexes.shift() : void 0) : (s = this.indexes.shift(), 0 < this.indexes.length ? (t = null != this._beads ? this._beads : _.random(2, 3), this.indexes.splice(t, 0, s)) : (this.indexes = function() { r = []; for (var e = 0, t = this._generations.stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this), s === this.indexes.first() && this.indexes.shift(), this.indexes.splice(1, 0, s))) }, e
        }()
    }.call(this),
    function() {
        var e, p;
        e = this.Card, (p = e.Player1).StrategyBiStackAdaptiveWithVariations = function() {
            function e(e, t) {
                var n, r, s, i, o, a, c, u, l, d;
                r = (i = null != t ? t : {}).chunks, n = i.card_meta, this.on_event = i.on_event, _ASSERT(r), _ASSERT(n), this.cardInfo = { id: parseInt(n.id, 10) || 0, card_id: null != (o = p.BiAdaptiveDataManager.sharedInstance.config) ? o.cardId : void 0, content_card_id: null != (a = p.BiAdaptiveDataManager.sharedInstance.config) ? a.contentCardId : void 0, info: _.clone(r[0]) }, this._script_name = e.script, this._amount = e.amount, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this._generations = e.generations, this._values = _.groupBy(this._generations, function(e) { return e._chunk + "____" + e._pool_name }), this._stack = _.keys(this._values).sort(), s = _.groupBy(this._generations, function(e) { return e._chunk }), _.each(s, function(e, t) { return s[t] = _.groupBy(s[t], function(e) { return e._pool_name }) }), this.indexes = function() { l = []; for (var e = 0, t = this._stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) l.push(e); return l }.apply(this), this.values = this.indexes.map((d = this, function(n) { var r; return function() { r = []; for (var e = 0, t = d._values[d._stack[n]].length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this) })), this.progressFactor = 0, this.index = 0, this.outcomesArr = [], this.progress = { student_id: null != (c = p.BiAdaptiveDataManager.sharedInstance.config) ? c.studentId : void 0, session_id: null != (u = p.BiAdaptiveDataManager.sharedInstance.config) ? u.sessionId : void 0, attempts: [] }, this.nextGen = null
            }
            return e.firstTime = !0, e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { var t; return (t = {}).indexes = this.indexes, t.values = this.values, t.index = this.index, t.nextGen = this.nextGen, t.progressFactor = this.progressFactor, t.outcomesArr = _.clone(this.outcomesArr), t.progress = _.clone(this.progress), e.json = JSON.stringify(t) }, e.prototype.load = function(e) { var t; return t = JSON.parse(e.json), this.indexes = t.indexes, this.values = t.values, this.index = t.index, this.nextGen = t.nextGen, this.progressFactor = t.progressFactor, this.outcomesArr = _.clone(t.outcomesArr), this.progress = _.clone(t.progress) }, e.prototype.get_progress_factor = function() { return this.progressFactor }, e.prototype.get_next_progress_factor = function(e) { return this._getNextProgressFactor(e) }, e.prototype.salt = function() { var e; return e = this.nextGen ? this.nextGen : this._values[this._stack[this.indexes[0]]][this.values[this.indexes[0]][0]], this.progress.attempts.push({ correct: null, generation: e, progress_value: null, start_time: Date.now() / 1e3, end_time: null }), this._getNextGeneration(this.index, function() {}), e }, e.prototype.setup = function(e) { return this._getList((t = this, function() { return t.constructor.firstTime ? (t.constructor.firstTime = !1, t._getFirstGeneration(t.index, function() { return e() })) : e() })); var t }, e.prototype.on_exercise_finish = function(e) { var t, n, r, s, i, o, a, c, u, l; return this.progressFactor = this._getNextProgressFactor(e), r = this._getOutcome(e), this.index += 1, this.nextGen = null, (t = this.progress.attempts[this.progress.attempts.length - 1]).correct = e, t.progress_value = this.progressFactor, t.end_time = Date.now() / 1e3, null != r ? (this.indexes = _.reject(this.indexes, (l = this, function(e) { return e < l.progressFactor * (l._stack.length - 1) })), 0 === this.indexes.length && (this.indexes = _.reject(function() { i = []; for (var e = 0, t = this._stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) i.push(e); return i }.apply(this), (u = this, function(e) { return e < u.progressFactor * (u._stack.length - 1) }))), this.nextGen = r.generation) : (this.values[this.indexes[0]].push(this.values[this.indexes[0]].shift()), e ? (c = this.indexes.shift(), 0 === this.indexes.length && (this.indexes = function() { o = []; for (var e = 0, t = this._stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) o.push(e); return o }.apply(this), 1 < this.indexes.length && c === this.indexes.first() && this.indexes.shift())) : (c = this.indexes.shift(), 0 < this.indexes.length ? (n = _.random(2, 3), this.indexes.splice(n, 0, c)) : (this.indexes = function() { a = []; for (var e = 0, t = this._stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) a.push(e); return a }.apply(this), c === this.indexes.first() && this.indexes.shift(), this.indexes.splice(1, 0, c)))), console.log("[" + (null != (s = this.constructor) ? s.name : void 0) + "] indexes: " + this.indexes) }, e.prototype._getNextProgressFactor = function(e) { var t, n, r, s; return null != (n = null != (s = this._getOutcome(e)) ? s.progress_value : void 0) ? n : e ? (t = Math.ceil(this._amount * this.progressFactor - .001), r = Math.min(this._amount, t + 1), Math.floor(r / this._amount * 100) / 100) : this.progressFactor }, e.prototype._getOutcome = function(e) { var t; if (t = this.outcomesArr[this.index]) return e ? _.find(t, function(e) { return "success" === e.outcome }) : _.find(t, function(e) { return "fail" === e.outcome }) }, e.prototype._getFirstGeneration = function(e, r) { return p.BiAdaptiveDataManager.sharedInstance.getFirstGeneration(this.cardInfo, this.progress, (s = this, function(e, t) { var n; return null === e ? s.nextGen = null != t ? t.generation : void 0 : console.log("[" + (null != (n = s.constructor) ? n.name : void 0) + "] BiAdaptiveDataManager#getFirstGeneration error: " + e), r() })); var s }, e.prototype._getNextGeneration = function(r, s) { return p.BiAdaptiveDataManager.sharedInstance.getNextGeneration(this.cardInfo, this.progress, (i = this, function(e, t) { var n; return null === e ? i.outcomesArr[r] = null != t ? t.outcomes : void 0 : console.log("[" + (null != (n = i.constructor) ? n.name : void 0) + "] BiAdaptiveDataManager#getNextGeneration error: " + e), s() })); var i }, e.prototype._getList = function(n) { return p.BiAdaptiveDataManager.sharedInstance.getList((r = this, function(e) { var t; return null === e || console.log("[" + (null != (t = r.constructor) ? t.name : void 0) + "] BiAdaptiveDataManager#getList error: " + e), n() })); var r }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyIncreasingStack = function() {
            function e(e) {
                var t;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.stacks = this._generations.stack, this.values = this._generations.values, t = this.values, this.indexes_length = this._generations.stack.map(function(e) { return t[e].length }), this.indexes_positions = this._generations.stack.map(function() { return 0 }), this.now_position_stack = 0
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.indexes_length = this.indexes_length, e.indexes_positions = this.indexes_positions, e.now_position_stack = this.now_position_stack }, e.prototype.load = function(e) { return this.indexes_positions = e.indexes_positions, this.indexes_length = e.indexes_length, this.now_position_stack = e.now_position_stack }, e.prototype.salt = function() { var e, t, n; return this.indexes_positions, t = this.now_position_stack, n = this.stacks[t], e = this.indexes_positions[t], this.values[n][e] }, e.prototype.on_exercise_finish = function(e) { var t; if (t = this.now_position_stack, e) { if (this.indexes_positions[t] += 1, this.indexes_positions[t] >= this.indexes_length[t] && (this.indexes_positions[t] = 0), this.now_position_stack++, this.now_position_stack >= this.stacks.length) return this.now_position_stack = 0 } else if (0 === this.now_position_stack ? this.indexes_positions[t] += 1 : (this.indexes_positions[t] += 1, this.now_position_stack--), this.indexes_positions[t] >= this.indexes_length[t]) return this.indexes_positions[t] = 0 }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyStackWithVariations = function() {
            function e(e) {
                var n, s;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.indexes = function() { n = []; for (var e = 0, t = this._generations.stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.values = this.indexes.map((s = this, function(n) { var r; return function() { r = []; for (var e = 0, t = s._generations.values[s._generations.stack[n]].length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this) }))
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.indexes = this.indexes, e.values = this.values }, e.prototype.load = function(e) { return this.indexes = e.indexes, this.values = e.values }, e.prototype.salt = function() { return this._generations.values[this._generations.stack[this.indexes[0]]][this.values[this.indexes[0]][0]] }, e.prototype.on_exercise_finish = function(e) {
                var n, r, t;
                return this.values[this.indexes[0]].shift(), 0 === this.values[this.indexes[0]].length && (this.values[this.indexes[0]] = function() {
                    n = [];
                    for (var e = 0,
                            t = this._generations.values[this._generations.stack[this.indexes[0]]].length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e);
                    return n
                }.apply(this)), e ? (t = this.indexes.shift(), 0 === this.indexes.length && (this.indexes = function() { r = []; for (var e = 0, t = this._generations.stack.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this)), t === this.indexes.first() ? this.indexes.shift() : void 0) : this.indexes
            }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyFixMistakes = function() {
            function e(e) {
                var n;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this.indexes = function() { n = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this.counter = Array.rep(this._generations.length, 0)
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.indexes = this.indexes, e.counter = this.counter }, e.prototype.load = function(e) { return this.indexes = e.indexes, this.counter = e.counter }, e.prototype.salt = function(e) { var t; return t = this._generations[this.indexes.first()], _.isObject(t) && !_.isArray(t) ? _.extend({ _amount: this.counter[this.indexes.first()], _index: e }, t) : t }, e.prototype.on_exercise_finish = function(e) { var t, n, r; return this.counter[this.indexes.first()] += 1, e ? (r = this.indexes.shift(), 0 === this.indexes.length && (this.indexes = function() { n = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), r === this.indexes.first()) ? this.indexes.shift() : void 0) : (r = this.indexes.shift(), t = 0, this.indexes.splice(t, 0, r)) }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyFixAllMistakes = function() {
            function e(e) {
                var n, r;
                this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this._amount <= this._generations.length ? this.solving_generations_indexes = function() { n = []; for (var e = 0, t = this._amount; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this) : this.solving_generations_indexes = function() { r = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this), this.wrong_solutions_indexes = [], this.counter = Array.rep(this._generations.length, 0), this.delta = this._amount - this._generations.length
            }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { return e.solving_generations_indexes = this.solving_generations_indexes, e.wrong_solutions_indexes = this.wrong_solutions_indexes, e.counter = this.counter, e.delta = this.delta }, e.prototype.load = function(e) { return this.solving_generations_indexes = e.solving_generations_indexes, this.wrong_solutions_indexes = e.wrong_solutions_indexes, this.counter = e.counter, this.delta = e.delta }, e.prototype.salt = function() { var n, r, s, e; return e = 0 < this.solving_generations_indexes.length ? this._generations[this.solving_generations_indexes.first()] : this._without_penalty ? (this.solving_generations_indexes = function() { n = []; for (var e = 0, t = this.delta; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) n.push(e); return n }.apply(this), this._generations[this._amount - this._generations.length - this.delta--]) : (this._amount <= this._generations.length ? this.solving_generations_indexes = function() { r = []; for (var e = 0, t = this._amount; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) r.push(e); return r }.apply(this) : this.solving_generations_indexes = function() { s = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) s.push(e); return s }.apply(this), this._generations[this.solving_generations_indexes.first()]), _.isObject(e) && !_.isArray(e) ? _.extend({ _index: this.counter[this.solving_generations_indexes.first()] }, e) : e }, e.prototype.on_exercise_finish = function(e) { if (e ? this.solving_generations_indexes.shift() : 0 < this.solving_generations_indexes.length && (this.counter[this.solving_generations_indexes.first()]++, this.wrong_solutions_indexes.push(this.solving_generations_indexes.shift())), 0 === this.solving_generations_indexes.length) return this.solving_generations_indexes = this.wrong_solutions_indexes, this.wrong_solutions_indexes = [] }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StrategyTestAdaptive = function() {
            function e(e, t) {
                var n, r, s, i, o, a, c;
                n = (null != t ? t : {}).card_meta, this._part_length = Math.floor(n.chunks[0].amount / 2), this._second_part_conditions = n.supports.grade_test_v2, this._second_part = 0, this._first_part_result = 0, this._test_data = [], this._script_name = e.script, this._amount = e.amount, this._without_penalty = !!e.without_penalty, this._without_mistake = !!e.without_mistake, this._generations = e.generations, this.solving_generations_indexes = function() { o = []; for (var e = 0, t = this._generations.length; 0 <= t ? e < t : t < e; 0 <= t ? e++ : e--) o.push(e); return o }.apply(this), this.index = 0, r = null != (i = this._second_part_conditions) ? i.initial_student_level : void 0, this.m = r || 0, this.s = 1, this.name = "StrategyTestAdaptive", s = this.m, a = this.s, c = _.range(-8, 8, .008), this.L = c.map(function(e) { return -1 * Math.pow(e - s, 2) / (2 * a) })
            }
            var c;
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.without_mistake = function() { return this._without_mistake }, e.prototype.save = function(e) { var t; return (t = {}).index = this.index, t.m = this.m, t.s = this.s, t.a = this.a, t.b = this.b, t.mean = this.mean, t.std = this.std, t.solving_generations_indexes = this.solving_generations_indexes, t.L = this.L, e.json = JSON.stringify(t) }, e.prototype.load = function(e) { var t; return t = JSON.parse(e.json), this.index = t.index, this.solving_generations_indexes = t.solving_generations_indexes, this.m = t.m, this.s = t.s, this.a = t.a, this.b = t.b, this.std = t.std, this.mean = t.mean, this.L = t.L }, c = function(t, n, e, r, s) { var i, o, a, c; return i = (a = (c = _.range(-8, 8, .008)).map(function(e) { return 1 / (1 + Math.exp(-t * (e - n))) })).map(function(e, t) { return s[t] + Math.log(e) }), o = a.map(function(e, t, n) { var r; return r = Math.log(1 - e), isFinite(r) ? Math.log(1 - e) : n[t - 1] }), { x: c, LWrong: a.map(function(e, t) { return s[t] + o[t] }), LRight: i, p: a } }, e.prototype.salt = function() { var e, t, n, s, i, o, a, r; return t = null != (r = this._second_part_conditions) ? r.decision_possibility : void 0, a = t || .7, o = +(.02 * Math.random() - .01).toFixed(9), i = this.m, n = { currVal: (s = this._generations)[0].b - Math.log(1 / (a + o) - 1) / s[0].a, index: 0 }, e = this.solving_generations_indexes.reduce(function(e, t, n) { var r; return r = s[t].b - Math.log(1 / (a + o) - 1) / s[t].a, Math.abs(r - i) < Math.abs(e.currVal - i) ? { currVal: r, index: n } : e }, n), this.index = this.solving_generations_indexes[e.index], this.a = this._generations[this.index].a, this.b = this._generations[this.index].b, this.all = c(this.a, this.b, this.m, this.s, this.L), _.extend({ _student_level: i, p: 1 / (1 + Math.exp(-this.a * (this.m - this.b))) }, this._generations[this.index]) }, e.prototype.on_exercise_finish = function(e) { var t, n, r, s, i, o; return this.L = e ? this.all.LRight : this.all.LWrong, t = Math.max.apply(null, this.L), this.pdf = this.L.map(function(e) { return Math.exp(e - t) }), s = this.pdf.reduce(function(e, t) { return e + t }), this.newPdf = this.pdf.map(function(e) { return e / s }), o = this.all.x, this.mean = this.newPdf.reduce(function(e, t, n) { return e + t * o[n] }), r = this.newPdf, this.newExercise = this.all.p.reduce(function(e, t, n) { return e + t * r[n] }), n = this.mean, i = this.newPdf.reduce(function(e, t, n) { return e + t * o[n] * o[n] }), this.std = Math.sqrt(i - n * n), this.m = this.mean, this.s = this.std, this.solving_generations_indexes.splice(this.solving_generations_indexes.indexOf(this.index), 1) }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.StepsRT = function() {
            function e() {}
            return e.prototype.attach = function(e, t) { var n, u, l, r, d, s, p, i, h, o, a, f, m, c, y, g, v, b; if (this.obj = e, this.lab_options = t, this.steps = this.obj.constructor.steps, this.current_sections = {}, this.args = [], this.lab_options.uchi_lab) return b = 100, p = 50, c = 140, y = 60, l = 20, u = 10, m = 5, f = [], _(this.steps.nodes).each(function(e) { var t, n, r; return f.push({ id: e.name, level: e.level, index: e.index, same_level_count: e.same_level_count, forked: e.forked, end: e.end }), t = _(f).last(), n = -(b + c) * (t.same_level_count - 1) / 2 + t.index * (b + c), r = t.level * (p + y), t.w = b, t.h = p, t.x = n + b / 2, t.y = r + p / 2 }), h = [], d = [], _(this.steps.rules).each(function(t) { var e, n, r, s, i, o, a, c; if (n = _(f).find(function(e) { return e.id === t.from }), s = _(f).find(function(e) { return e.id === t.to }), n.level < s.level) { if (i = n.x, a = n.y + p / 2, o = s.x, c = s.y - p / 2, d.push([i, a, o, c]), !_.isNull(t.cond)) return r = .4, h.push({ x: i + r * (o - i), y: a + r * (c - a), text: t.cond }) } else if (n.x === s.x) { if (d.push([n.x + m, n.y + p / 2, n.x + m, n.y + p / 2 + l, s.x + b / 2 + u, n.y + p / 2 + l, s.x + b / 2 + u, s.y - p / 2 - l, s.x + m, s.y - p / 2 - l, s.x + m, s.y - p / 2]), !_.isNull(t.cond)) return h.push({ x: s.x + b / 2 + u, y: (s.y + n.y) / 2, text: t.cond }) } else if (e = n.x > s.x ? -m : m, d.push([n.x + e, n.y + p / 2, n.x + e, n.y + p / 2 + l, (s.x + n.x) / 2, n.y + p / 2 + l, (s.x + n.x) / 2, s.y - p / 2 - l, s.x - e, s.y - p / 2 - l, s.x - e, s.y - p / 2]), !_.isNull(t.cond)) return h.push({ x: (s.x + n.x) / 2, y: (s.y + n.y) / 2, text: t.cond }) }), i = "svg-" + Math.round(1e5 * Math.random()), (r = document.createElementNS("http://www.w3.org/2000/svg", "svg")).setAttribute("width", _(f).max(function(e) { return e.x }).x - _(f).min(function(e) { return e.x }).x + 50 + b), r.setAttribute("height", 50 + _(f).max(function(e) { return e.y }).y + p / 2), r.setAttribute("id", i), r.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), this.lab_options.uchi_lab[0].appendChild(r), this.lab_sbs = $.div().appendTo(this.lab_options.uchi_lab), n = (g = Snap("#" + i)).g(), (v = new Snap.Matrix).translate(25, 25), n.transform(v), s = n.g(), o = g.path("M0,-5L10,0L0,5").marker().attr({ markerUnits: "userSpaceOnUse", refX: 10 }), _(f).each(function(e) { return e.end ? (e.svg_rect = s.rect(e.x - p / 2, e.y - p / 2, e.h, e.h).attr({ fill: "white", stroke: "black", strokeWidth: 2 }), s.polyline([e.x - p / 2, e.y - p / 2, e.x + p / 2, e.y + e.h / 2]).attr({ stroke: "black", strokeWidth: 1, fill: "none" }), s.polyline([e.x - p / 2, e.y + p / 2, e.x + p / 2, e.y - e.h / 2]).attr({ stroke: "black", strokeWidth: 1, fill: "none" })) : (e.svg_rect = s.rect(e.x - b / 2, e.y - p / 2, e.w, e.h).attr({ fill: "white", stroke: "black", strokeWidth: 2 }), s.text(e.x - b / 2 + 10, e.y - p / 2 + 10, e.id).attr("dominant-baseline", "text-before-edge")) }), _(d).each(function(e) { return s.polyline(e).attr({ stroke: "black", strokeWidth: 2, "marker-end": o, fill: "none" }) }), _(f).each(function(e) { if (e.forked) return s.circle(e.x, e.y + p / 2, 10) }), _(h).each(function(e) { return s.circle(e.x, e.y, 8).attr({ fill: "white" }), s.text(e.x, e.y, "" + e.text).attr({ "text-anchor": "middle", "alignment-baseline": "middle" }) }), v = new Snap.Matrix, a = _.chain(f).map(function(e) { return e.same_level_count }).max().value(), v.translate((b + c) * (a - 1) / 2, 0), s.transform(v), this.nodes = f }, e.prototype._create_div = function(e) { var t, n, r; return this.lab_sbs ? (r = this.nodes, (n = $.div().css({ "margin-bottom": 5 }).data({ step: e }).appendTo(this.lab_sbs)).append(e + " - " + this.steps.desc(e) + " - " + JSON.stringify(this.args)), n.bind("mouseenter", function() { return n.css({ "background-color": "#ffe" }), _(r).find(function(e) { return e.id === n.data("step") }).svg_rect.attr({ stroke: "red" }) }), n.bind("mouseleave", function() { return n.css({ "background-color": "transparent" }), _(r).find(function(e) { return e.id === n.data("step") }).svg_rect.attr({ stroke: "black" }) }), (t = $.div().appendTo(n)).hide(), t) : null }, e.prototype.run = function() { var n, r; return n = this.steps.rules[0].from, this._create_div(n), _(this.steps.nodes[n].sections).each((r = this, function(e, t) { if (0 === e) return r.current_sections[t] = [n] })), this.steps.find(n).func.apply(this.obj) }, e.prototype.next = function(n, e, t) { var r, s, i, o, a, c, u, l; return _.isArray(e) && (t = e, e = void 0), _.isUndefined(t) && (t = []), r = this.steps.next_ids(n, e), _(this.current_sections).each((i = this, function(e, t) { return i.current_sections[t] = _(e).filter(function(e) { return e !== n }) })), _(r).each((o = this, function(n) { return _(o.current_sections).each(function(e, t) { if (1 === o.steps.nodes[n].sections[t] && -1 === _(e).indexOf(n)) return o.current_sections[t].push(n) }) })), this.args = t, 0 < _(r).filter((l = this, function(e) { return l.steps.nodes[e].end })).length ? (s = [], _(this.current_sections).each(function(e) { return _(e).each(function(e) { if (-1 === _(s).indexOf(e)) return s.push(e) }) }), _(s).each((u = this, function(e) { return u.steps.find_on_terminate(e).func.apply(u.obj) })), this.obj.tutor.the_end()) : (_(r).each((c = this, function(e) { return _(c.steps.nodes[e].sections).each(function(e, t) { var n; if (2 === e && _(c.current_sections).has(t)) return n = [], _(c.current_sections[t]).each(function(e) { return n.push(e), c.steps.find_on_terminate(e).func.apply(c.obj) }), delete c.current_sections[t], _(n).each(function(n) { return _(c.current_sections).each(function(e, t) { return c.current_sections[t] = _(e).filter(function(e) { return e !== n }) }) }), _(c.current_sections).each(function(e, t) { if (0 === e.length) return delete c.current_sections[t] }) }) })), _(r).each((a = this, function(e) { return a._create_div(e), a.steps.find(e).func.apply(a.obj, t) }))) }, e
        }()
    }.call(this),
    function() {
        var e, a;
        e = this.Card, (a = e.Player1).typograph = function(e, t) { var n, s, r, i, o; return null == t && (t = {}), i = "(\\s+|^|$)", r = function(e, t, r) { return e.replace(s("" + i + t + i), function(e, t, n) { return "" !== t && (t = "&nbsp;"), "" !== n && (n = "&nbsp;"), "" + t + r + n }) }, n = (s = function(e) { return new RegExp(e, "ig") })((o = "([^\\d\\s]+)") + "\\s+\\-\\-\\s+" + o), e = (e = r(e = (e = "ru" === a.__locale ? e.replace(n, "$1&nbsp;&mdash;&nbsp;$2") : "ua" === a.__locale ? e.replace(n, "$1&nbsp;&mdash;&nbsp;$2") : "tat" === a.__locale ? e.replace(n, "$1&nbsp;&mdash;&nbsp;$2") : e.replace(n, "$1&nbsp;&ndash;&nbsp;$2")).replace(s(o + "\\-" + o), "$1&#8208;$2"), "\\-", "&minus;")).replace(/\-(\d+)/g, "&minus;$1"), e = r(e = r(e = r(e = r(e = r(e = t.multiplication_sign_is_times ? r(e, "\\*", "&times;") : r(e, "\\*", "&middot;"), "/", ":"), ">", "&gt;"), "<", "&lt;"), ">=", "&ge;"), "<=", "&le;") }
    }.call(this),
    function() {
        this.Card.Player1.Ipc = function() {
            function e(e, t, n, r) { this.stats_host = e, this.session_id = t, this.access_token = n, this.on_access_denied = r, this.seq_num = 0, this.events = [], this.send_now = !1, this.terminated = !1, this.after_send_callback = null, this.cardFinish = !1 }
            return e.prototype.store = function(e) { return this.after_send_callback = e, this.__try_send() }, e.prototype.heartbeat = function() {}, e.prototype.on_event = function(e, t) { var n; return n = { seq_num: this.seq_num++, kind: e, data: t }, this.events.push(n), this.__try_send() }, e.prototype.__try_send = function() { var e, t, n, r; if (!this.terminated && !this.send_now) return 0 === this.events.length ? (this.after_send_callback && this.after_send_callback(), this.after_send_callback = null) : (this.send_now = !0, t = this.events, this.events = [], console.log("AJAX send: " + JSON.stringify(_(t).map(function(e) { return e.seq_num }))), e = $.__long_action_hook, $.__long_action_hook = null, $.ajax({ url: this.stats_host + "/sessions/" + this.session_id + "/events", type: "POST", contentType: "application/json; charset=utf-8", timeout: 5e3, data: JSON.stringify({ events: t, access_token: this.access_token }), dataType: "json", error: (r = this, function() { return console.log("AJAX error"), r.send_now = !1, r.events = t.concat(r.events), $.delay(5e3, function() { return r.__try_send() }) }), success: (n = this, function(e) { return n.send_now = !1, "ok" === e.status ? n.__try_send() : "no_free_beads_left" === e.status && null != e.redirect_to ? n.cardFinish ? void n.__try_send() : (n.events = n.events.filter(function(e) { return "$store" === e.kind }), n.__try_send(), n.terminated = !0, window.location = e.redirect_to) : "session_completed" === e.status ? n.cardFinish ? void n.__try_send() : n.terminated = !1 : (n.terminated = !0, n.on_access_denied()) }) }), $.__long_action_hook = e) }, e
        }()
    }.call(this),
    function() {
        var e, t;
        e = this.Card, (t = e.Player1).BiAdaptiveDataManager = function() {
            function e() { this._config = null, this.xhrList = null, this.xhrFirstGeneration = null, this.xhrNextGeneration = null, this.firstGenerationUrl = null, this.nextGenerationUrl = null }
            return e._instance = null, e.prototype.getFirstGeneration = function(e, t, n) { return null == this.config ? n("config_not_set") : null == this.firstGenerationUrl ? n("call_getList_first") : (null != this.xhrFirstGeneration && (this.xhrFirstGeneration.abort(), this.xhrFirstGeneration = null), this.xhrFirstGeneration = $.ajax({ url: this.firstGenerationUrl, type: "POST", contentType: "application/json", timeout: 5e3, data: JSON.stringify({ card: e, progress: t }), dataType: "json", error: (s = this, function() { var e; return s.xhrFirstGeneration = null, console.log("[" + (null != (e = s.constructor) ? e.name : void 0) + "] AJAX error"), n("ajax_error") }), success: (r = this, function(e) { return r.xhrFirstGeneration = null, n(null, e) }) })); var r, s }, e.prototype.getNextGeneration = function(e, t, n) { return null == this.config ? n("config_not_set") : null == this.nextGenerationUrl ? n("call_getList_first") : (null != this.xhrNextGeneration && (this.xhrNextGeneration.abort(), this.xhrNextGeneration = null), this.xhrNextGeneration = $.ajax({ url: this.nextGenerationUrl, type: "POST", contentType: "application/json", timeout: 5e3, data: JSON.stringify({ card: e, progress: t }), dataType: "json", error: (s = this, function() { var e; return s.xhrNextGeneration = null, console.log("[" + (null != (e = s.constructor) ? e.name : void 0) + "] AJAX error"), n("ajax_error") }), success: (r = this, function(e) { return r.xhrNextGeneration = null, n(null, e) }) })); var r, s }, e.prototype.getList = function(t) { return null == this.config ? t("config_not_set") : null != this.firstGenerationUrl && null != this.nextGenerationUrl ? t(null) : null == this.xhrList || this.xhrListCompleted ? (null != this.xhrList && (this.xhrList.abort(), this.xhrList = null), this.xhrList = $.ajax({ url: this.baseRequestUrl + "/" + this.listEndPoint, type: "GET", timeout: 5e3, dataType: "json", error: (r = this, function() { var e; return r.xhrList = null, console.log("[" + (null != (e = r.constructor) ? e.name : void 0) + "] AJAX error"), t("ajax_error") }), success: (n = this, function(e) { return n.xhrList = null, n.firstGenerationUrl = e.first_generation, n.nextGenerationUrl = e.next_generation, t(null) }), complete: (e = this, function() { return e.xhrListCompleted = !0 }) })) : t("already_in_progress"); var e, n, r }, Object.defineProperties(e, { sharedInstance: { get: function() { return null == this._instance && (this._instance = new t.BiAdaptiveDataManager), this._instance } } }), Object.defineProperties(e.prototype, { config: { get: function() { return this._config }, set: function(e) { return _ASSERT(null != e.baseRequestUrl), _ASSERT(null != e.listEndPoint), _ASSERT(null != e.sessionId), _ASSERT(null != e.contentCardId), _ASSERT(null != e.cardId), _ASSERT(null != e.studentId), this._config !== e && (this._config = e), this._config } }, baseRequestUrl: { get: function() { return this._config.baseRequestUrl } }, listEndPoint: { get: function() { return this._config.listEndPoint } }, sessionId: { get: function() { return this._config.sessionId } }, contentCardId: { get: function() { return this._config.contentCardId } }, cardId: { get: function() { return this._config.cardId } }, studentId: { get: function() { return this._config.studentId } } }), e
        }()
    }.call(this),
    function() {
        var s = this.Card.Player1;
        s.pluralize = function(e, t) {
            switch (s.__locale) {
                case "ind":
                case "ch":
                case "kk":
                case "be":
                case "ar":
                case "vi":
                case "st":
                case "nso":
                case "ts":
                case "af":
                case "ss":
                case "nr":
                case "xh":
                case "ve":
                case "jp":
                    return t[0];
                case "hi":
                    if (t.length < 2) throw new Error("wrong number of words for " + s.__locale + " locale.");
                    return 0 == e || 1 == e ? t[0] : t[1];
                case "en":
                case "en_za":
                case "es":
                case "pt":
                case "tn":
                case "zu":
                    if (t.length < 2) throw new Error("wrong number of words for " + s.__locale + " locale.");
                    return 1 == e ? t[0] : t[1];
                case "ru":
                case "ua":
                case "tat":
                    if (t.length < 3) throw new Error("wrong number of words for " + s.__locale + " locale");
                    var n = e % 100,
                        r = e % 10;
                    return 11 <= n && n <= 14 || 5 <= r && r <= 9 || 0 == r ? t[2] : 1 == r ? t[0] : t[1];
                default:
                    throw new Error("unknown locale " + s.__locale)
            }
        }
    }.call(this),
    function() { this.Card.Player1.buttonDown = function(e) { return /iPad/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) ? "touchstart" : "up" === e ? "mouseup" : "mousedown" } }.call(this),
    function() {
        var e, n, r = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        e = this.Card, (n = e.Player1).SignalListener = function() {
            function e(e) { this.card_meta = e, this.history = [], this.current_status = "before_card_start", this.exercise_validator = null }
            return e.prototype.PROGRESS_SIGNALS = ["beads_start_script", "beads_exercise_finish_succ", "beads_exercise_finish_failed", "beads_lesson_finish", "beads_fail", "beads_fail_minus_one", "test_start_script", "ege_start_script", "english_test_start_script", "english_test_recommend_level", "english_test_review_results", "english_test_introduction_back", "english_test_introduction_start", "grade_test_v2__save_results", "__grade_test_v2_start_script", "__grade_test_hn_start_script", "__adaptive_start_script", "__grade_test_status", "__grade_test_v2_status", "__grade_test_v2_fail", "__grade_test_v2_exercise_finish_succ", "__grade_test_v2_exercise_finish_failed", "__grade_test_hn_status", "__grade_test_hn_fail", "__grade_test_hn_exercise_finish_succ", "__grade_test_hn_exercise_finish_failed", "__grade_test_exercise_finish"], e.prototype.IGNORED_SIGNALS = ["$store", "$lesson_finish", "sound_v2", "set_sound_autoplay", "__missed_audio_constant", "__missed_speech_constant", "__play_button", "__keypad_3_start", "__keypad_3_finish", "__keypad_3_button_ok_toggle", "__keypad_3_button_ok_wrong", "__keypad_3_button_ok_right", "__keypad_3_button_ok_clear", "__keypad_3_activate", "__keypad_3_deactivate", "__keypad_3_prevent_default_init", "__keypad_3_prevent_default_destroy", "__keypad_3_emit", "__back"], e.prototype.SYSTEM_SIGNALS = ["card_start", "card_start_after_restore", "card_loaded", "level_start", "exercise_start", "exercise_finish", "level_finish", "card_finish", "store"], e.prototype.on_event = function(e, t) {
                if (!(0 <= r.call(this.PROGRESS_SIGNALS, e) || 0 <= r.call(this.IGNORED_SIGNALS, e)))
                    if (0 <= r.call(this.SYSTEM_SIGNALS, e) ? this._validate_system_signal(e) : (this._ASSERT_status(["in_exercise"], e, "\u041b\u044e\u0431\u043e\u0439 \u043d\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u044b\u0439 \u0441\u0438\u0433\u043d\u0430\u043b \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043f\u043e\u0441\u043b\u0430\u043d \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u044f"), this.exercise_validator && this.exercise_validator.validate(e, t)), "exercise_start" === e) { if (this.card_meta.supports.structure) return this.exercise_validator = new n.ExerciseValidator(this.card_meta.events[t.script_name]) } else if ("exercise_finish" === e) return this.exercise_validator = null
            }, e.prototype._validate_system_signal = function(e) { if ("card_start_after_restore" === e) return this._ASSERT_status(["before_card_start"], e, "First signal must be card_start"), this.current_status = "card_restored"; if ("card_start" === e) return this._ASSERT_status(["before_card_start"], e, "First signal must be card_start"), this.current_status = "card_started"; if ("card_loaded" === e) { if (this._ASSERT_status(["card_started", "card_restored"], e), "card_started" === this.current_status) return this.current_status = "card_loaded"; if ("card_restored" === this.current_status) return this.current_status = "card_loaded_after_restore" } else { if ("level_start" === e) return this._ASSERT_status(["card_loaded", "card_loaded_after_restore"], e, "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0443\u0436\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u0430, \u0430 \u043e\u043d\u0430 '" + this.current_status + "'"), this.current_status = "in_level"; if ("exercise_start" === e) return this._ASSERT_status(["in_level", "card_loaded_after_restore"], e, "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u0440\u043e\u0432\u043d\u044f, \u0430 \u043e\u043d\u0430 '" + this.current_status + "'"), this.current_status = "in_exercise"; if ("exercise_finish" === e) return this._ASSERT_status(["in_exercise"], e, "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u044f, \u0430 \u043e\u043d\u0430 '" + this.current_status + "'"), this.current_status = "in_level"; if ("level_finish" === e) return this._ASSERT_status(["in_level"], e, "\u0423\u043f\u0440\u0430\u0436\u043d\u0435\u043d\u0438\u0435 \u0434\u043e\u043b\u0436\u043d\u043e \u0431\u044b\u0442\u044c \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d\u043e, \u0430 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0432 '" + this.current_status + "'"), this.current_status = "card_loaded"; if ("card_finish" === e) return this._ASSERT_status(["card_loaded"], e, "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u0432\u043d\u0443\u0442\u0440\u0438 \u0443\u0440\u043e\u0432\u043d\u044f, \u0430 \u043e\u043d\u0430 '" + this.current_status + "'"), this.current_status = "card_finished" } }, e.prototype._ASSERT_status = function(e, t, n) { return null == n && (n = ""), _ASSERT(-1 !== _.indexOf(e, this.current_status), "Unexpected '" + t + "'. " + n) }, e
        }()
    }.call(this),
    function() {
        this.Card.Player1.ExerciseValidator = function() {
            function e(e) { this.event_metas = e }
            return e.prototype.validate = function(e, t) { if (this.event_metas) return e in this.event_metas.actions ? this._validate_event("action", e, t, this.event_metas.actions[e]) : e in this.event_metas.signals ? this._validate_event("signal", e, t, this.event_metas.signals[e]) : _ASSERT(!1, e + " - \u043d\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0438\u043b\u0438 \u0441\u0438\u0433\u043d\u0430\u043b") }, e.prototype._validate_event = function(e, t, n, r) { var s, i, o, a, c, u, l; for (c = [], s = 0, i = (u = _.keys(n)).length; s < i; s++) "_event_type" !== (a = u[s]) && "at" !== a && "wrong" !== a && c.push(a); if (o = _.difference(r.params, c), l = _.difference(c, r.params), _ASSERT(0 === o.length, "[" + e + "] " + t + " - missed params: " + JSON.stringify(o)), "action" === e) return _ASSERT(0 === l.length, "[" + e + "] " + t + " - unknown params: " + JSON.stringify(l)) }, e
        }()
    }.call(this),
    function() {
        var s, h;
        s = this.Card, (h = s.Player1).__i18n_t = function(e, t, n, r) { return null == s["Script" + e] ? "" : "v2" === h._scriptMeta(e).supports.resources ? h.__i18n_fetch2(e, t, n, r, "text") || function() { throw "missed translation constant `" + t + "`" }() : h.__i18n_fetch(e, t, n, r, "translations") || function() { throw "missed translation constant `" + t + "`" }() }, h.__i18n_s = function(e, t, n, r) { var s; return "v2" === h._scriptMeta(e).supports.resources || function() { throw "speech works only with script resources v2" }(), (s = h.__i18n_fetch2(e, t, n, r, "speech", !1) || h.__i18n_fetch2(e, t, n, r, "text", !1)) ? s.replace(/<br\s*\/?>/g, " ").replace(/\s+/g, " ") : null }, h.__i18n_fetch = function(e, t, n, r, s, i) { var o, a; return null == i && (i = !0), o = h.__i18n_fallback_for_locale(r), a = h.__i18n_fallback2_for_locale(r), t in h._scriptMeta(e)[s][r] ? h.format(h._scriptMeta(e)[s][r][t], n) : i && t in h._scriptMeta(e)[s][o] ? h.format(o + ": " + h._scriptMeta(e)[s][o][t], n) : i && t in h._scriptMeta(e)[s][a] ? h.format(a + ": " + h._scriptMeta(e)[s][a][t], n) : void 0 }, h.__i18n_fetch2 = function(e, t, n, r, s, i) { var o, a, c, u, _, l, d, p; if (null == i && (i = !0), a = h.__i18n_fallback_for_locale(r), c = h.__i18n_fallback2_for_locale(r), o = h._scriptMeta(e)["const"][t]) { if (p = (null != (u = o[r]) ? u[s] : void 0) || (null != (_ = o.base) ? _[s] : void 0)) return h.format(p, n); if (i && (p = null != (l = o[a]) ? l[s] : void 0)) return h.format(a + ": " + p, n); if (i && (p = null != (d = o[c]) ? d[s] : void 0)) return h.format(c + ": " + p, n) } }, h.__i18n_fallback_for_locale = function(e) { return "ru" === e || "en_za" === e || "st" === e || "nso" === e || "ts" === e || "af" === e || "tn" === e || "ss" === e || "zu" === e || "nr" === e || "xh" === e || "ve" === e ? "en" : "ru" }, h.__i18n_fallback2_for_locale = function(e) { return "ru" === e ? "en" : "ru" }
    }.call(this),
    function() {
        var r, s, i = [].slice;
        r = this.Card, (s = r.Player1).UchiUserTracker = function() {
            function e(e) {
                var t, n;
                this.prefix = "user-event", this._set_tutor(e), this.place = null != (t = s.__score) ? t.place : void 0, this.events = null != (n = r.__meta) ? n.events : void 0, this._shout_up()
            }
            return e.prototype.destroy = function() { if (this.card_user_tracker) return this.card_user_tracker.destroy() }, e.prototype._shout_up = function() { return $(window).trigger("fp_user_tracker_created", [this]) }, e.prototype.event = function(e) { var t, n, r; if (t = e, n = 2 <= arguments.length ? i.call(arguments, 1) : [], this.tutor) return null != (r = this.tutor) ? r.event.apply(r, [this.prefix + "." + t].concat(i.call(n))) : void 0 }, e.prototype._set_tutor = function(e) { if (null != e && e instanceof Object && "Player.Tutor" === e._name) return this.tutor = e }, e
        }()
    }.call(this),
    function() {
        var e;
        this.Card || (this.Card = {}), (e = this.Card).PlayerIFrame = {}, e.PlayerIFrame.play = function(e, t, n, r) { var s, i, o; return null == r && (r = {}), i = "card player-iframe", e.addClass(i), s = $("<div>", { "class": "uchi-container" }).appendTo(e), o = $("<div>", { "class": "uchi-scoring" }).appendTo(s), run_card(s, o) }
    }.call(this),
    function() {
        this.Card || (this.Card = {}),
            function(e) {
                var p, t, r;
                (p = e.PlayerIFrameDynamic = {
                    event: function(e, t, n, r) { return null == n && (n = {}), "function" == typeof r ? r({ notImplemented: e }) : void 0 },
                    play: function(e, t, r, n) { var s, i, o; return null == n && (n = {}), this._playOptions = n, this._preparePlace(e, r), this._prepareState(r), this._prepareListeners(r), s = this._playOptions.archive || this._dumpState(), this._onEvent("$store", s), this._loadState(s), this._cardStart(r), o = this, (i = function() { return o._loadState(s), o._prepareOptionsAndRunScript(e, t, r, function(e, t) { var n; return n = t.cardFinish, s = o._dumpState(), o._onEvent("$store", s), n ? (o._onEvent("$lesson_finish"), void o._waitIpcStore(function() { return o._cardFinish() })) : o._beforeNextRun(r, function() { return i() }) }) })() },
                    _preparePlace: function(e, t) { var n; return n = "card player-iframe-dynamic", e.attr("class", "uchiru-place-2").addClass(n), t.fullscreen ? e.css({ height: "100%" }) : e.addClass("uchiru-place-2_fixed").css({ overflow: "hidden" }) },
                    _prepareState: function(e) { var t; return this._current = 0, t = this._chunks(e, this._playOptions), this._total = this._getTotal(t), this._index = 0, this._chunkIndexes = _.map(t, function() { return 0 }), this._strategies = this._getStrategies(t), this._playButtonTypes = _.map(t, function(e) { return e.play_button_type }), p.Event.onEvent = this._onEvent, p.Keypad.onEvent = this._playOptions.on_beads, p.PlayButton.onEvent = this._onPlayButtonEvent },
                    _prepareListeners: function(t) { var n; return this.listeners = [], this._playOptions.ipc_events_url && this._playOptions.session_id && (this._ipc = new p.Ipc({ url: this._playOptions.ipc_events_url, sessionId: this._playOptions.session_id, accessToken: this._playOptions.access_token, onAccessDenied: (n = this, function() { var e; if ("beads" === t.progress) return "function" == typeof(e = n._playOptions).on_beads ? e.on_beads("terminated") : void 0 }) }), this._ipc.seq_num = this._playOptions.seq_num, this.listeners.push(this._ipc)), this.listeners },
                    _dumpState: (r = this, function() { var n, e, t; return e = {}, (n = {})._current = r._current, n._isScriptSolved = r._isScriptSolved, n._index = r._index, n._chunkIndexes = r._chunkIndexes, "grade_test" === r.progress && (t = {}, r.level_walker.save(t), n.level_walker = { json: JSON.stringify(t) }), n._strategies = [], _(r._strategies).each(function(e) { var t; return t = {}, e.save(t), n._strategies.push(t) }), e.json = JSON.stringify(n), e }),
                    _loadState: (t = this, function(e) { var r; return r = JSON.parse(e.json), t._current = r._current, t._isScriptSolved = r._isScriptSolved, t._index = r._index, t._chunkIndexes = r._chunkIndexes, _(t._strategies).each(function(e, t) { var n; return n = r._strategies[t], e.load(n) }) }),
                    _cardStart: function(e) { var t, n; if ("beads" === e.progress && ("function" == typeof(t = this._playOptions).on_beads && t.on_beads("lesson_start", { chunks: _(this._strategies).map(function(e) { return { amount: e.amount() } }), amount: this._current }), this._isChunkStart(this._chunkIndexes))) return "function" == typeof(n = this._playOptions).on_beads ? n.on_beads("__beads_under_start") : void 0 },
                    _cardFinish: function() { var e; return "function" == typeof(e = this._playOptions).on_beads ? e.on_beads("lesson_finish") : void 0 },
                    _scriptStart: function(e, t) { return this._onEvent("beads_start_script", { script_name: e, salt: t, amount: this._current, total: this._total }) },
                    _onEvent: function(e, t) { var n; if (n = this._timestampify(t), this._sendEventToListeners(e, n), n.wrong) return this._processWrong() },
                    _timestampify: function(e) { return _.extend({ at: Date.now() / 1e3 }, e) },
                    _sendEventToListeners: function(t, n) { return _(this.listeners).each(function(e) { return e.onEvent(t, n) }) },
                    _processWrong: function() { var e, t; return t = this._getStrategy(this._strategies, this._current, this._total), this._isScriptSolved && (t.without_penalty() || t.without_mistake() || 0 < this._current && this._getStrategyIndex(this._strategies, this._current - 1, this._total) === this._getStrategyIndex(this._strategies, this._current, this._total) && (this._current -= 1, "function" == typeof(e = this._playOptions).on_beads && e.on_beads("bead_move_left", { amount: this._current, chunks: _(this._strategies).map(function(e) { return { amount: e.amount() } }) }))), this._isScriptSolved = !1 },
                    _prepareOptionsAndRunScript: function(e, t, o, a) {
                        var n, r, s, c, i, u;
                        return s = (r = (c = this._getStrategy(this._strategies, this._current, this._total)).salt(this._index))._script || c.script_name(), i = o.script_versions[s + "_script"], n = this._prepareOptions(o, r), this._scriptStart(s, r), this._runScript(e, t, i,
                            s, n, (u = this, function(e, t) { var n, r, s, i; return i = null != t ? t.solved : void 0, u._index += 1, u._chunkIndexes[u._getStrategyIndex(u._strategies, u._current, u._total)] += 1, i && (u._current += 1), c.on_exercise_finish(i), c = null, "beads" === o.progress && (i ? (u._onEvent("beads_exercise_finish_succ", { amount: u._current, total: u._total }), "function" == typeof(n = u._playOptions).on_beads && n.on_beads("exercise_finish_succ", { amount: u._current, chunks: _(u._strategies).map(function(e) { return { amount: e.amount() } }) })) : (u._onEvent("beads_exercise_finish_failed", { amount: u._current, total: u._total }), "function" == typeof(r = u._playOptions).on_beads && r.on_beads("exercise_finish_failed", { amount: u._current, chunks: _(u._strategies).map(function(e) { return { amount: e.amount() } }) }))), s = i && u._current === u._total, a(null, { cardFinish: s }) }))
                    },
                    _prepareOptions: function(e, t) { var n; return (n = {}).salt = t, this._playOptions.olymp_answer && (n.olymp_answer = this._playOptions.olymp_answer, n.olymp_answer_value = this._playOptions.olymp_answer_value), n.progress = e.progress, n },
                    _runScript: function(n, e, t, r, s, i) {
                        var o, a, c, u, _, l, d;
                        return u = this._getSize(s), o = $("<iframe>", { src: e + "/" + t + "/" + r + "_script/index.html", "class": "uchi-frame", scrolling: "no", frameborder: 0, width: u.width, height: u.height }).appendTo(n)[0], $(o).css({ verticalAlign: "top" }), l = this, c = function() { return l._resize(o, n, s) }, (a = $("<div>").appendTo(n)).css({ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }), a.append($("<div>").css({ position: "absolute", display: "inline-block", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }).html("Loading...")), p.Event.initMessaging(this._getContent(o)), p.PlayButton.initMessaging(this._getContent(o)), p.Keypad.initMessaging(this._getContent(o)), p.Olymp.initMessaging(this._getContent(o)), _ = !1, o.onload = (d = this, function() {
                            var t;
                            if (!_) return _ = !0, a.remove(), d._ScriptResize.scriptResize(c), d._showContainer(n, s), p.MessageTunnel.sendMessage(d._getContent(o), "Script.focus"), p.MessageTunnel.sendMessage(d._getContent(o), "Script.onbeforeunload"), p.MessageTunnel.setListener(d._getContent(o), "Script.onbeforeunload#callback", function(e) { return e.err, e.res, window.location.reload() }), t = function() { return p.MessageTunnel.removeListener(d._getContent(o), "Script.onbeforeunload#callback") }, window.addEventListener("beforeunload", t), d._isScriptSolved = !0, p.MessageTunnel.sendMessage(d._getContent(o), "Script.play", { options: s }, function() { return c() }), p.MessageTunnel.setListener(d._getContent(o), "Script.play#callback", function(e) { return e.err, e.res, d._hideContainer(n, s, function() { return p.MessageTunnel.removeListener(d._getContent(o), "Script.play#callback"), window.removeEventListener("beforeunload", t), p.Olymp.destroyMessaging(d._getContent(o)), p.Keypad.destroyMessaging(d._getContent(o)), p.PlayButton.destroyMessaging(d._getContent(o)), p.Event.destroyMessaging(d._getContent(o)), $(o).remove(), i(null, { solved: d._isScriptSolved }) }) });
                            window.location.reload()
                        })
                    },
                    _beforeNextRun: function(e, t) { return "beads" === e.progress ? setTimeout(function() { return t() }, 400) : t },
                    _waitIpcStore: function(e) { var t; return this._ipc ? (t = 2, this._ipc.store(function() { if (0 == (t -= 1)) return e(null) }), setTimeout(function() { if (0 == (t -= 1)) return e(null) }, 400)) : setTimeout(function() { return e(null) }, 400) },
                    _onPlayButtonEvent: function(e, t) { var n, r; return r = this._getStrategyIndex(this._strategies, this._current, this._total), "function" == typeof(n = this._playOptions).on_beads ? n.on_beads(e, _.extend({ card_start: 0 === this._chunkIndexes[0], chunk_start: 0 === this._chunkIndexes[r], chunk_idx: r, play_button_type: this._playButtonTypes[r] }, t)) : void 0 },
                    _getContent: function(e) { return e.contentWindow || e.contentDocument.document || e.contentDocument },
                    _getSize: function(e) { var t, n; return e.olymp_answer ? (n = 620, t = 250) : e.fullscreen ? (n = 1024, t = 640) : (n = 1024, t = 560), { width: n, height: t } },
                    _resize: function(e, t, n) { var r, s, i; return s = this._getSize(n), n.olymp_answer ? (i = this._getContent(e).document.body.scrollWidth, r = this._getContent(e).document.body.scrollHeight) : (i = s.width, r = s.height), $(e).width(Math.max(i, t.width())), $(e).height(Math.max(r, t.height())) },
                    _ScriptResize: { scriptResize: function(e) { return $(window).resize(e), $(window).on("orientationchange", e), e() }, scriptResizeClear: function(e) { return $(window).off("orientationchange", e), $(window).off("resize", e) } },
                    _showContainer: function(e, t, n) { var r; return "test" === (r = t.progress) || "beads" === r || "grade_test" === r || "grade_test_v2" === r || "grade_test_hn" === r ? e.css({ opacity: 0 }).animate({ opacity: 1 }, 300).promise().done(function() { return e.css({ opacity: "" }), "function" == typeof n ? n(null) : void 0 }) : "function" == typeof n ? n(null) : void 0 },
                    _hideContainer: function(e, t, n) { return "beads" === t.progress ? setTimeout(function() { return e.animate({ opacity: 0 }, 300, function() { return e.css({ opacity: "" }), "function" == typeof n ? n(null) : void 0 }) }, 500) : "function" == typeof n ? n(null) : void 0 },
                    _chunks: function(e, t) { var n, r, s, i; return s = null, "chunk" in t ? t.pool_name && "value_index" in t ? (i = "values" in (r = e.chunks[t.chunk]).generations && t.pool_name in r.generations.values ? r.generations.values[t.pool_name][t.value_index] : r.generations[t.value_index], n = { script: r.script, amount: 1, strategy: "stack", generations: [i], play_button_type: r.play_button_type }, "test" === e.progress && (n.test = r.test), "grade_test_v2" === e.progress && (n.test = r.test), "grade_test_hn" === e.progress && (n.test = r.test), s = [n]) : s = [e.chunks[t.chunk]] : s = e.chunks, s },
                    _getTotal: function(e) { return _.reduce(e, function(e, t) { return e + t.amount }, 0) },
                    _getStrategies: function(e) { return _.map(e, (t = this, function(e) { return new(t[t._camelize("strategy_" + e.strategy)])(e) })); var t },
                    _camelize: function(e) { return e.replace(/(?:^|[-_])(\w)/g, function(e, t) { return t ? t.toUpperCase() : "" }) },
                    _getStrategyIndex: function(e, t, n) { var r; for (_ASSERT(t <= n), r = 0; t >= e[r].amount();) t -= e[r].amount(), r += 1; return r },
                    _getStrategy: function(e, t, n) { return e[this._getStrategyIndex(e, t, n)] },
                    _isChunkStart: function(e) { return 0 === e[0] }
                })._onEvent = p._onEvent.bind(p), p._onPlayButtonEvent = p._onPlayButtonEvent.bind(p)
            }(this.Card)
    }.call(this),
    function(e) {
        var t;
        e.PlayerIFrameDynamic.MessageTunnel = (function(e) {
            function o(e) { if (e) return { name: e.name, message: e.message } }

            function n(e) { if (e) { var t = new Error(e.message); return t.name = e.name, t } }

            function t() { return window.self !== window.top ? s(window.parent) : undefined }

            function s(e) { for (var t = 0, n = u; t < n.length; t++) { var r = n[t]; if (r.getTarget() === e) return r } var s = new _(e); return u.push(s), s }

            function r(e, t, n) { s(e).setListener(t, n) }

            function i(e, t) { s(e).removeListener(t) }

            function a(e, t, n, r) { s(e).sendMessage(t, n, r) }

            function c(e) { e.data instanceof Object && "MessageTunnel" === e.data.via && ("_pong" === e.data.name ? s(e.source).pongReceived(e.data) : s(e.source).messageReceived(e.data, e.origin)) }
            var u = [],
                _ = function() {
                    function e(e) { this._listeners = {}, this._pings = {}, this._nextPingId = 0, this._target = e }
                    return e.prototype.getTarget = function() { return this._target }, e.prototype.setListener = function(e, t) { e && t ? this._listeners[e] = t : console.log("Warning: Cannot add listener.") }, e.prototype.removeListener = function(e) { delete this._listeners[e] }, e.prototype.sendMessage = function(e, t, n) {
                        if (!e || "_pong" === e) throw new Error("Name is invalid.");
                        var r = { name: e, id: this._addPing(n), payload: t, via: "MessageTunnel" };
                        this._target.postMessage(r, "*")
                    }, e.prototype.messageReceived = function(r, s) {
                        var i = this,
                            e = this._listeners[r.name];
                        e && e(r.payload, function(e, t) {
                            var n = { name: "_pong", id: r.id, error: o(e), payload: t, via: "MessageTunnel" };
                            i._target.postMessage(n, s)
                        })
                    }, e.prototype.pongReceived = function(e) {
                        var t = this._pings[e.id];
                        t && t(n(e.error), e.payload), delete this._pings[e.id]
                    }, e.prototype._pingTimeout = function(e) {
                        var t = this._pings[e];
                        if (t) {
                            var n = new Error("Message timed out.");
                            n.name = "TimeoutError", t(n)
                        }
                        delete this._pings[e]
                    }, e.prototype._addPing = function(e) { var t = this; if (e) { var n = this._nextPingId; return this._nextPingId++, this._pings[n] = e, setTimeout(function() { t._pingTimeout(n) }, 4e3), n } }, e
                }();
            e.Portal = _, e.getParentPortal = t, e.getPortal = s, e.setListener = r, e.removeListener = i, e.sendMessage = a, window.addEventListener("message", c)
        }(t || (t = {})), t)
    }(this.Card),
    function() {
        this.Card.PlayerIFrameDynamic.StrategyStack = function() {
            function e(e) { this._script_name = e.script, this._amount = e.amount, this._generations = e.generations, this._without_penalty = e.without_penalty, this.index = 0 }
            return e.prototype.script_name = function() { return this._script_name }, e.prototype.amount = function() { return this._amount }, e.prototype.without_penalty = function() { return this._without_penalty }, e.prototype.save = function(e) { return e.index = this.index }, e.prototype.load = function(e) { return this.index = e.index }, e.prototype.salt = function() { return this._generations[this.index % this._generations.length] }, e.prototype.on_exercise_finish = function() { return this.index += 1 }, e
        }()
    }.call(this),
    function() {
        var e, r;
        e = this.Card, (r = e.PlayerIFrameDynamic).Event = { Event: { onEvent: null }, emit: function(e, t) { var n; return "function" == typeof(n = this.Event).onEvent ? n.onEvent(e, t) : void 0 } }, Object.defineProperties(r.Event, { onEvent: { get: function() { return this.Event.onEvent }, set: function(e) { return this.Event.onEvent = e } } }), r.Event.initMessaging = function(e) { return r.MessageTunnel.setListener(e, "Player.Event.emit", function(e) { var t, n; return t = e.kind, n = e.params, r.Event.emit(t, n) }) }, r.Event.destroyMessaging = function(e) { return r.MessageTunnel.removeListener(e, "Player.Event.emit") }
    }.call(this),
    function() {
        var e, s;
        e = this.Card, (s = e.PlayerIFrameDynamic).Keypad = { Keypad: { onEvent: null }, addTargetElement: function(e) { var t, n; return e.on("keydown.__playerIframeDynamic__keypad__addTargetElement", (t = this, function(e) { return t.emitKeydown("keydown", { metaKey: e.metaKey, keyCode: e.keyCode, stopPropagation: function() { return e.stopPropagation() } }) })), e.on("keypress.__playerIframeDynamic__keypad__addTargetElement", (n = this, function(e) { return n.emitKeypress("keypress", { metaKey: e.metaKey, which: e.which, stopPropagation: function() { return e.stopPropagation() } }) })) }, removeTargetElement: function(e) { return e.off("keydown.__playerIframeDynamic__keypad__addTargetElement"), e.off("keypress.__playerIframeDynamic__keypad__addTargetElement") }, start: function(e, t, n) { var r; return null == t && (t = {}), "function" == typeof(r = this.Keypad).onEvent ? r.onEvent("__keypad_3_start", { roles: e, opt: t, callback: n }) : void 0 }, finish: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_finish") : void 0 }, buttonOkToggle: function(e) { var t; return "function" == typeof(t = this.Keypad).onEvent ? t.onEvent("__keypad_3_button_ok_toggle", { enabled: e }) : void 0 }, preventDefaultInit: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_prevent_default_init") : void 0 }, preventDefaultDestroy: function() { var e; return "function" == typeof(e = this.Keypad).onEvent ? e.onEvent("__keypad_3_prevent_default_destroy") : void 0 }, emitKeydown: function(e, t) { var n; return "function" == typeof(n = this.Keypad).onEvent ? n.onEvent("__keypad_3_emit", { event: e, eventData: t }) : void 0 }, emitKeypress: function(e, t) { var n; return "function" == typeof(n = this.Keypad).onEvent ? n.onEvent("__keypad_3_emit", { event: e, eventData: t }) : void 0 } }, Object.defineProperties(s.Keypad, { onEvent: { get: function() { return this.Keypad.onEvent }, set: function(e) { return this.Keypad.onEvent = e } } }), s.Keypad.initMessaging = function(r) { return s.MessageTunnel.setListener(r, "Player.Keypad.emitKeydown", function(e) { var t, n; return t = e.event, n = e.eventData, n = _.extend({}, n, { stopPropagation: function() { return s.MessageTunnel.sendMessage(r, "Player.Keypad.emitKeydown#stopPropagation") } }), s.Keypad.emitKeydown(t, n) }), s.MessageTunnel.setListener(r, "Player.Keypad.emitKeypress", function(e) { var t, n; return t = e.event, n = e.eventData, n = _.extend({}, n, { stopPropagation: function() { return s.MessageTunnel.sendMessage(r, "Player.Keypad.emitKeypress#stopPropagation") } }), s.Keypad.emitKeypress(t, n) }), s.MessageTunnel.setListener(r, "Player.Keypad.start", function(e) { var t, n; return n = e.roles, t = e.opt, s.Keypad.start(n, t, function(e) { return s.MessageTunnel.sendMessage(r, "Player.Keypad.start#callback", { "char": e }) }) }), s.MessageTunnel.setListener(r, "Player.Keypad.finish", function() { return s.Keypad.finish() }), s.MessageTunnel.setListener(r, "Player.Keypad.buttonOkToggle", function(e) { var t; return t = e.enabled, s.Keypad.buttonOkToggle(t) }), s.MessageTunnel.setListener(r, "Player.Keypad.preventDefaultInit", function() { return s.Keypad.preventDefaultInit() }), s.MessageTunnel.setListener(r, "Player.Keypad.preventDefaultDestroy", function() { return s.Keypad.preventDefaultDestroy() }) }, s.Keypad.destroyMessaging = function(e) { return s.MessageTunnel.removeListener(e, "Player.Keypad.emitKeydown"), s.MessageTunnel.removeListener(e, "Player.Keypad.emitKeypress"), s.MessageTunnel.removeListener(e, "Player.Keypad.start"), s.MessageTunnel.removeListener(e, "Player.Keypad.finish"), s.MessageTunnel.removeListener(e, "Player.Keypad.buttonOkToggle"), s.MessageTunnel.removeListener(e, "Player.Keypad.preventDefaultInit"), s.MessageTunnel.removeListener(e, "Player.Keypad.preventDefaultDestroy") }
    }.call(this),
    function() {
        var e, r;
        e = this.Card, (r = e.PlayerIFrameDynamic).Olymp = {
            store: function(e) { if (window.__olymp && window.localStorage) { try { window.localStorage[window.__olymp.key] = JSON.stringify(e) } catch (t) {} return window.__olymp.answer = JSON.stringify(e) } },
            restore: function() {
                var e;
                if (e = null, window.__olymp && window.localStorage && window.localStorage[window.__olymp.key]) try { e = JSON.parse(window.localStorage[window.__olymp.key]) } catch (t) { console.log("Bad news: couldn't restore from localStorage"), e = null }
                return e
            },
            userEvent: function(e, t) { if (null == t && (t = {}), window.__olymp && window.__olymp.cb) return window.__olymp.cb(e, t) },
            wasSolvedOnce: function() { var t; return t = this.restore() || {}, !! function() { try { return null != t.answer } catch (e) {} }() }
        }, r.Olymp.initMessaging = function(e) { return r.MessageTunnel.setListener(e, "Player.Olymp.store", function(e) { var t; return t = e.data, r.Olymp.store(t) }), r.MessageTunnel.setListener(e, "Player.Olymp.restore", function(e, t) { return t(null, { data: r.Olymp.restore() }) }), r.MessageTunnel.setListener(e, "Player.Olymp.userEvent", function(e) { var t, n; return t = e.kind, n = e.options, r.Olymp.userEvent(t, n) }), r.MessageTunnel.setListener(e, "Player.Olymp.wasSolvedOnce", function(e, t) { return t(null, { res: r.Olymp.wasSolvedOnce() }) }) }, r.Olymp.destroyMessaging = function(e) { return r.MessageTunnel.removeListener(e, "Player.Olymp.store"), r.MessageTunnel.removeListener(e, "Player.Olymp.restore"), r.MessageTunnel.removeListener(e, "Player.Olymp.userEvent"), r.MessageTunnel.removeListener(e, "Player.Olymp.wasSolvedOnce") }
    }.call(this),
    function() {
        var e, n;
        e = this.Card, (n = e.PlayerIFrameDynamic).PlayButton = { PlayButton: { onEvent: null }, run: function(e) { var t; return "function" == typeof(t = this.PlayButton).onEvent ? t.onEvent("__play_button", { mode: "request", cb: e }) : void 0 } }, Object.defineProperties(n.PlayButton, { onEvent: { get: function() { return this.PlayButton.onEvent }, set: function(e) { return this.PlayButton.onEvent = e } } }), n.PlayButton.initMessaging = function(t) { return n.MessageTunnel.setListener(t, "Player.PlayButton.run", function() { return n.PlayButton.run(function(e) { return n.MessageTunnel.sendMessage(t, "Player.PlayButton.run#callback", { options: e }) }) }) }, n.PlayButton.destroyMessaging = function(e) { return n.MessageTunnel.removeListener(e, "Player.PlayButton.run") }
    }.call(this),
    function() {
        this.Card.PlayerIFrameDynamic.Ipc = function() {
            function e(e) { this.url = e.url, this.sessionId = e.sessionId, this.accessToken = e.accessToken, this.onAccessDenied = e.onAccessDenied, this.seqNum = 0, this.events = [], this.sendNow = !1, this.terminated = !1, this.afterSendCallback = null }
            return e.prototype.store = function(e) { return this.afterSendCallback = e, this._trySend() }, e.prototype.heartbeat = function() {}, e.prototype.onEvent = function(e, t) { var n; return n = { seq_num: this.seqNum++, kind: e, data: t }, this.events.push(n), this._trySend() }, e.prototype._trySend = function() { var e, t, n; if (!this.terminated && !this.sendNow) return 0 === this.events.length ? (this.afterSendCallback && this.afterSendCallback(), this.afterSendCallback = null) : (this.sendNow = !0, e = this.events, this.events = [], console.log("AJAX send: " + JSON.stringify(_(e).map(function(e) { return e.seq_num }))), $.ajax({ url: this.url, type: "POST", contentType: "application/json; charset=utf-8", timeout: 5e3, data: JSON.stringify({ events: e, accessToken: this.accessToken }), dataType: "json", error: (n = this, function() { return console.log("AJAX error"), n.sendNow = !1, n.events = e.concat(n.events), setTimeout(function() { return n._trySend() }, 5e3) }), success: (t = this, function(e) { return t.sendNow = !1, "ok" === e.status ? t._trySend() : (t.terminated = !0, t.onAccessDenied()) }) })) }, e
        }()
    }.call(this), $("document").ready(function() {
        var t = function() { try { new Card.Player1.Howl({ src: "data:audio/mpeg;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+7RAAAAEkABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7QEsQAAAAAAAEX/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+7RAwAAP/ABLgAAACByACXAAAAEAAAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" }).play(), $(document.body).off("touchstart mousedown", t) } catch (e) {} };
        $(document.body).one("touchstart mousedown", t)
    }), $(function() {
        var e = $(".uchiru-locale-dropdown__toggle"),
            t = $(".uchiru-locale-dropdown__menu");
        e.length && t.length && new UchiruLocaleDropdown(e, t).run()
    });