(function (a) {
    a.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var b = this;
            this.element.bind("mousedown." + this.widgetName, function (c) {
                return b._mouseDown(c)
            }).bind("click." + this.widgetName, function (c) {
                if (b._preventClickEvent) {
                    b._preventClickEvent = false;
                    c.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function (d) {
            d.originalEvent = d.originalEvent || {};
            if (!d.originalEvent.mouseHandled) {
                this._mouseStarted && this._mouseUp(d);
                this._mouseDownEvent = d;
                var c = this,
                    h = d.which == 1,
                    g = typeof this.options.cancel == "string" ? a(d.target).parents().add(d.target).filter(this.options.cancel).length : false;
                if (!h || g || !this._mouseCapture(d)) {
                    return true
                }
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) {
                    this._mouseDelayTimer = setTimeout(function () {
                        c.mouseDelayMet = true
                    }, this.options.delay)
                }
                if (this._mouseDistanceMet(d) && this._mouseDelayMet(d)) {
                    this._mouseStarted = this._mouseStart(d) !== false;
                    if (!this._mouseStarted) {
                        d.preventDefault();
                        return true
                    }
                }
                this._mouseMoveDelegate = function (b) {
                    return c._mouseMove(b)
                };
                this._mouseUpDelegate = function (b) {
                    return c._mouseUp(b)
                };
                a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                a.browser.safari || d.preventDefault();
                return d.originalEvent.mouseHandled = true
            }
        },
        _mouseMove: function (b) {
            if (a.browser.msie && !b.button) {
                return this._mouseUp(b)
            }
            if (this._mouseStarted) {
                this._mouseDrag(b);
                return b.preventDefault()
            }
            if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
                (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== false) ? this._mouseDrag(b): this._mouseUp(b)
            }
            return !this._mouseStarted
        },
        _mouseUp: function (b) {
            a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                this._preventClickEvent = b.target == this._mouseDownEvent.target;
                this._mouseStop(b)
            }
            return false
        },
        _mouseDistanceMet: function (b) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - b.pageX), Math.abs(this._mouseDownEvent.pageY - b.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet
        },
        _mouseStart: function () {},
        _mouseDrag: function () {},
        _mouseStop: function () {},
        _mouseCapture: function () {
            return true
        }
    })
})(jQuery);
(function (f) {
    f.ui = f.ui || {};
    var a = /left|center|right/,
        e = /top|center|bottom/,
        d = f.fn.position,
        b = f.fn.offset;
    f.fn.position = function (j) {
        if (!j || !j.of) {
            return d.apply(this, arguments)
        }
        j = f.extend({}, j);
        var c = f(j.of),
            o = (j.collision || "flip").split(" "),
            n = j.offset ? j.offset.split(" ") : [0, 0],
            m, l, k;
        if (j.of.nodeType === 9) {
            m = c.width();
            l = c.height();
            k = {
                top: 0,
                left: 0
            }
        } else {
            if (j.of.scrollTo && j.of.document) {
                m = c.width();
                l = c.height();
                k = {
                    top: c.scrollTop(),
                    left: c.scrollLeft()
                }
            } else {
                if (j.of.preventDefault) {
                    j.at = "left top";
                    m = l = 0;
                    k = {
                        top: j.of.pageY,
                        left: j.of.pageX
                    }
                } else {
                    m = c.outerWidth();
                    l = c.outerHeight();
                    k = c.offset()
                }
            }
        }
        f.each(["my", "at"], function () {
            var g = (j[this] || "").split(" ");
            if (g.length === 1) {
                g = a.test(g[0]) ? g.concat(["center"]) : e.test(g[0]) ? ["center"].concat(g) : ["center", "center"]
            }
            g[0] = a.test(g[0]) ? g[0] : "center";
            g[1] = e.test(g[1]) ? g[1] : "center";
            j[this] = g
        });
        if (o.length === 1) {
            o[1] = o[0]
        }
        n[0] = parseInt(n[0], 10) || 0;
        if (n.length === 1) {
            n[1] = n[0]
        }
        n[1] = parseInt(n[1], 10) || 0;
        if (j.at[0] === "right") {
            k.left += m
        } else {
            if (j.at[0] === "center") {
                k.left += m / 2
            }
        } if (j.at[1] === "bottom") {
            k.top += l
        } else {
            if (j.at[1] === "center") {
                k.top += l / 2
            }
        }
        k.left += n[0];
        k.top += n[1];
        return this.each(function () {
            var p = f(this),
                h = p.outerWidth(),
                g = p.outerHeight(),
                i = f.extend({}, k);
            if (j.my[0] === "right") {
                i.left -= h
            } else {
                if (j.my[0] === "center") {
                    i.left -= h / 2
                }
            } if (j.my[1] === "bottom") {
                i.top -= g
            } else {
                if (j.my[1] === "center") {
                    i.top -= g / 2
                }
            }
            i.left = parseInt(i.left);
            i.top = parseInt(i.top);
            f.each(["left", "top"], function (s, q) {
                f.ui.position[o[s]] && f.ui.position[o[s]][q](i, {
                    targetWidth: m,
                    targetHeight: l,
                    elemWidth: h,
                    elemHeight: g,
                    offset: n,
                    my: j.my,
                    at: j.at
                })
            });
            f.fn.bgiframe && p.bgiframe();
            p.offset(f.extend(i, {
                using: j.using
            }))
        })
    };
    f.ui.position = {
        fit: {
            left: function (g, c) {
                var h = f(window);
                c = g.left + c.elemWidth - h.width() - h.scrollLeft();
                g.left = c > 0 ? g.left - c : Math.max(0, g.left)
            },
            top: function (g, c) {
                var h = f(window);
                c = g.top + c.elemHeight - h.height() - h.scrollTop();
                g.top = c > 0 ? g.top - c : Math.max(0, g.top)
            }
        },
        flip: {
            left: function (h, c) {
                if (c.at[0] !== "center") {
                    var k = f(window);
                    k = h.left + c.elemWidth - k.width() - k.scrollLeft();
                    var j = c.my[0] === "left" ? -c.elemWidth : c.my[0] === "right" ? c.elemWidth : 0,
                        i = -2 * c.offset[0];
                    h.left += h.left < 0 ? j + c.targetWidth + i : k > 0 ? j - c.targetWidth + i : 0
                }
            },
            top: function (i, c) {
                if (c.at[1] !== "center") {
                    var m = f(window);
                    m = i.top + c.elemHeight - m.height() - m.scrollTop();
                    var l = c.my[1] === "top" ? -c.elemHeight : c.my[1] === "bottom" ? c.elemHeight : 0,
                        k = c.at[1] === "top" ? c.targetHeight : -c.targetHeight,
                        j = -2 * c.offset[1];
                    i.top += i.top < 0 ? l + c.targetHeight + j : m > 0 ? l + k + j : 0
                }
            }
        }
    };
    if (!f.offset.setOffset) {
        f.offset.setOffset = function (i, c) {
            if (/static/.test(f.curCSS(i, "position"))) {
                i.style.position = "relative"
            }
            var m = f(i),
                l = m.offset(),
                k = parseInt(f.curCSS(i, "top", true), 10) || 0,
                j = parseInt(f.curCSS(i, "left", true), 10) || 0;
            l = {
                top: c.top - l.top + k,
                left: c.left - l.left + j
            };
            "using" in c ? c.using.call(i, l) : m.css(l)
        };
        f.fn.offset = function (g) {
            var c = this[0];
            if (!c || !c.ownerDocument) {
                return null
            }
            if (g) {
                return this.each(function () {
                    f.offset.setOffset(this, g)
                })
            }
            return b.call(this)
        }
    }
})(jQuery);
(function (a) {
    a.widget("ui.slider", a.ui.mouse, {
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null
        },
        _create: function () {
            var c = this,
                d = this.options;
            this._mouseSliding = this._keySliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            d.disabled && this.element.addClass("ui-slider-disabled ui-disabled");
            this.range = a([]);
            if (d.range) {
                if (d.range === true) {
                    this.range = a("<div></div>");
                    if (!d.values) {
                        d.values = [this._valueMin(), this._valueMin()]
                    }
                    if (d.values.length && d.values.length !== 2) {
                        d.values = [d.values[0], d.values[0]]
                    }
                } else {
                    this.range = a("<div></div>")
                }
                this.range.appendTo(this.element).addClass("ui-slider-range");
                if (d.range === "min" || d.range === "max") {
                    this.range.addClass("ui-slider-range-" + d.range)
                }
                this.range.addClass("ui-widget-header")
            }
            a(".ui-slider-handle", this.element).length === 0 && a("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
            if (d.values && d.values.length) {
                for (; a(".ui-slider-handle", this.element).length < d.values.length;) {
                    a("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle")
                }
            }
            this.handles = a(".ui-slider-handle", this.element).addClass("ui-state-default ui-corner-all");
            this.handle = this.handles.eq(0);
            this.handles.add(this.range).filter("a").click(function (b) {
                b.preventDefault()
            }).hover(function () {
                d.disabled || a(this).addClass("ui-state-hover")
            }, function () {
                a(this).removeClass("ui-state-hover")
            }).focus(function () {
                if (d.disabled) {
                    a(this).blur()
                } else {
                    a(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                    a(this).addClass("ui-state-focus")
                }
            }).blur(function () {
                a(this).removeClass("ui-state-focus")
            });
            this.handles.each(function (b) {
                a(this).data("index.ui-slider-handle", b)
            });
            this.handles.keydown(function (n) {
                var m = true,
                    l = a(this).data("index.ui-slider-handle"),
                    k, j, b;
                if (!c.options.disabled) {
                    switch (n.keyCode) {
                    case a.ui.keyCode.HOME:
                    case a.ui.keyCode.END:
                    case a.ui.keyCode.PAGE_UP:
                    case a.ui.keyCode.PAGE_DOWN:
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        m = false;
                        if (!c._keySliding) {
                            c._keySliding = true;
                            a(this).addClass("ui-state-active");
                            k = c._start(n, l);
                            if (k === false) {
                                return
                            }
                        }
                        break
                    }
                    b = c.options.step;
                    k = c.options.values && c.options.values.length ? (j = c.values(l)) : (j = c.value());
                    switch (n.keyCode) {
                    case a.ui.keyCode.HOME:
                        j = c._valueMin();
                        break;
                    case a.ui.keyCode.END:
                        j = c._valueMax();
                        break;
                    case a.ui.keyCode.PAGE_UP:
                        j = k + (c._valueMax() - c._valueMin()) / 5;
                        break;
                    case a.ui.keyCode.PAGE_DOWN:
                        j = k - (c._valueMax() - c._valueMin()) / 5;
                        break;
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                        if (k === c._valueMax()) {
                            return
                        }
                        j = k + b;
                        break;
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        if (k === c._valueMin()) {
                            return
                        }
                        j = k - b;
                        break
                    }
                    c._slide(n, l, j);
                    return m
                }
            }).keyup(function (f) {
                var b = a(this).data("index.ui-slider-handle");
                if (c._keySliding) {
                    c._keySliding = false;
                    c._stop(f, b);
                    c._change(f, b);
                    a(this).removeClass("ui-state-active")
                }
            });
            this._refreshValue();
            this._animateOff = false
        },
        destroy: function () {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
            this._mouseDestroy();
            return this
        },
        _mouseCapture: function (d) {
            var j = this.options,
                p, o, n, m, l, k;
            if (j.disabled) {
                return false
            }
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            p = {
                x: d.pageX,
                y: d.pageY
            };
            o = this._normValueFromMouse(p);
            n = this._valueMax() - this._valueMin() + 1;
            l = this;
            this.handles.each(function (c) {
                var b = Math.abs(o - l.values(c));
                if (n > b) {
                    n = b;
                    m = a(this);
                    k = c
                }
            });
            if (j.range === true && this.values(1) === j.min) {
                k += 1;
                m = a(this.handles[k])
            }
            if (this._start(d, k) === false) {
                return false
            }
            this._mouseSliding = true;
            l._handleIndex = k;
            m.addClass("ui-state-active").focus();
            j = m.offset();
            this._clickOffset = !a(d.target).parents().andSelf().is(".ui-slider-handle") ? {
                left: 0,
                top: 0
            } : {
                left: d.pageX - j.left - m.width() / 2,
                top: d.pageY - j.top - m.height() / 2 - (parseInt(m.css("borderTopWidth"), 10) || 0) - (parseInt(m.css("borderBottomWidth"), 10) || 0) + (parseInt(m.css("marginTop"), 10) || 0)
            };
            o = this._normValueFromMouse(p);
            this._slide(d, k, o);
            return this._animateOff = true
        },
        _mouseStart: function () {
            return true
        },
        _mouseDrag: function (c) {
            var d = this._normValueFromMouse({
                x: c.pageX,
                y: c.pageY
            });
            this._slide(c, this._handleIndex, d);
            return false
        },
        _mouseStop: function (c) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(c, this._handleIndex);
            this._change(c, this._handleIndex);
            this._clickOffset = this._handleIndex = null;
            return this._animateOff = false
        },
        _detectOrientation: function () {
            this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (c) {
            var d;
            if (this.orientation === "horizontal") {
                d = this.elementSize.width;
                c = c.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                d = this.elementSize.height;
                c = c.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            d = c / d;
            if (d > 1) {
                d = 1
            }
            if (d < 0) {
                d = 0
            }
            if (this.orientation === "vertical") {
                d = 1 - d
            }
            c = this._valueMax() - this._valueMin();
            return this._trimAlignValue(this._valueMin() + d * c)
        },
        _start: function (d, e) {
            var f = {
                handle: this.handles[e],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                f.value = this.values(e);
                f.values = this.values()
            }
            return this._trigger("start", d, f)
        },
        _slide: function (d, f, h) {
            var g;
            if (this.options.values && this.options.values.length) {
                g = this.values(f ? 0 : 1);
                if (this.options.values.length === 2 && this.options.range === true && (f === 0 && h > g || f === 1 && h < g)) {
                    h = g
                }
                if (h !== this.values(f)) {
                    g = this.values();
                    g[f] = h;
                    d = this._trigger("slide", d, {
                        handle: this.handles[f],
                        value: h,
                        values: g
                    });
                    this.values(f ? 0 : 1);
                    d !== false && this.values(f, h, true)
                }
            } else {
                if (h !== this.value()) {
                    d = this._trigger("slide", d, {
                        handle: this.handles[f],
                        value: h
                    });
                    d !== false && this.value(h)
                }
            }
        },
        _stop: function (d, e) {
            var f = {
                handle: this.handles[e],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                f.value = this.values(e);
                f.values = this.values()
            }
            this._trigger("stop", d, f)
        },
        _change: function (d, e) {
            if (!this._keySliding && !this._mouseSliding) {
                var f = {
                    handle: this.handles[e],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    f.value = this.values(e);
                    f.values = this.values()
                }
                this._trigger("change", d, f)
            }
        },
        value: function (c) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(c);
                this._refreshValue();
                this._change(null, 0)
            }
            return this._value()
        },
        values: function (d, g) {
            var j, i, h;
            if (arguments.length > 1) {
                this.options.values[d] = this._trimAlignValue(g);
                this._refreshValue();
                this._change(null, d)
            }
            if (arguments.length) {
                if (a.isArray(arguments[0])) {
                    j = this.options.values;
                    i = arguments[0];
                    for (h = 0; h < j.length; h += 1) {
                        j[h] = this._trimAlignValue(i[h]);
                        this._change(null, h)
                    }
                    this._refreshValue()
                } else {
                    return this.options.values && this.options.values.length ? this._values(d) : this.value()
                }
            } else {
                return this._values()
            }
        },
        _setOption: function (d, f) {
            var h, g = 0;
            if (a.isArray(this.options.values)) {
                g = this.options.values.length
            }
            a.Widget.prototype._setOption.apply(this, arguments);
            switch (d) {
            case "disabled":
                if (f) {
                    this.handles.filter(".ui-state-focus").blur();
                    this.handles.removeClass("ui-state-hover");
                    this.handles.attr("disabled", "disabled");
                    this.element.addClass("ui-disabled")
                } else {
                    this.handles.removeAttr("disabled");
                    this.element.removeClass("ui-disabled")
                }
                break;
            case "orientation":
                this._detectOrientation();
                this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                this._refreshValue();
                break;
            case "value":
                this._animateOff = true;
                this._refreshValue();
                this._change(null, 0);
                this._animateOff = false;
                break;
            case "values":
                this._animateOff = true;
                this._refreshValue();
                for (h = 0; h < g; h += 1) {
                    this._change(null, h)
                }
                this._animateOff = false;
                break
            }
        },
        _value: function () {
            var c = this.options.value;
            return c = this._trimAlignValue(c)
        },
        _values: function (d) {
            var e, f;
            if (arguments.length) {
                e = this.options.values[d];
                return e = this._trimAlignValue(e)
            } else {
                e = this.options.values.slice();
                for (f = 0; f < e.length; f += 1) {
                    e[f] = this._trimAlignValue(e[f])
                }
                return e
            }
        },
        _trimAlignValue: function (d) {
            if (d < this._valueMin()) {
                return this._valueMin()
            }
            if (d > this._valueMax()) {
                return this._valueMax()
            }
            var e = this.options.step,
                f = d % e;
            d = d - f;
            if (f >= e / 2) {
                d += e
            }
            return parseFloat(d.toFixed(5))
        },
        _valueMin: function () {
            return this.options.min
        },
        _valueMax: function () {
            return this.options.max
        },
        _refreshValue: function () {
            var s = this.options.range,
                t = this.options,
                r = this,
                q = !this._animateOff ? t.animate : false,
                p, o = {},
                n, m, l, d;
            if (this.options.values && this.options.values.length) {
                this.handles.each(function (b) {
                    p = (r.values(b) - r._valueMin()) / (r._valueMax() - r._valueMin()) * 100;
                    o[r.orientation === "horizontal" ? "left" : "bottom"] = p + "%";
                    a(this).stop(1, 1)[q ? "animate" : "css"](o, t.animate);
                    if (r.options.range === true) {
                        if (r.orientation === "horizontal") {
                            if (b === 0) {
                                r.range.stop(1, 1)[q ? "animate" : "css"]({
                                    left: p + "%"
                                }, t.animate)
                            }
                            if (b === 1) {
                                r.range[q ? "animate" : "css"]({
                                    width: p - n + "%"
                                }, {
                                    queue: false,
                                    duration: t.animate
                                })
                            }
                        } else {
                            if (b === 0) {
                                r.range.stop(1, 1)[q ? "animate" : "css"]({
                                    bottom: p + "%"
                                }, t.animate)
                            }
                            if (b === 1) {
                                r.range[q ? "animate" : "css"]({
                                    height: p - n + "%"
                                }, {
                                    queue: false,
                                    duration: t.animate
                                })
                            }
                        }
                    }
                    n = p
                })
            } else {
                m = this.value();
                l = this._valueMin();
                d = this._valueMax();
                p = d !== l ? (m - l) / (d - l) * 100 : 0;
                o[r.orientation === "horizontal" ? "left" : "bottom"] = p + "%";
                this.handle.stop(1, 1)[q ? "animate" : "css"](o, t.animate);
                if (s === "min" && this.orientation === "horizontal") {
                    this.range.stop(1, 1)[q ? "animate" : "css"]({
                        width: p + "%"
                    }, t.animate)
                }
                if (s === "max" && this.orientation === "horizontal") {
                    this.range[q ? "animate" : "css"]({
                        width: 100 - p + "%"
                    }, {
                        queue: false,
                        duration: t.animate
                    })
                }
                if (s === "min" && this.orientation === "vertical") {
                    this.range.stop(1, 1)[q ? "animate" : "css"]({
                        height: p + "%"
                    }, t.animate)
                }
                if (s === "max" && this.orientation === "vertical") {
                    this.range[q ? "animate" : "css"]({
                        height: 100 - p + "%"
                    }, {
                        queue: false,
                        duration: t.animate
                    })
                }
            }
        }
    });
    a.extend(a.ui.slider, {
        version: "1.8.1"
    })
})(jQuery);
jQuery.effects || function (p) {
    function h(j) {
        var f;
        if (j && j.constructor == Array && j.length == 3) {
            return j
        }
        if (f = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(j)) {
            return [parseInt(f[1], 10), parseInt(f[2], 10), parseInt(f[3], 10)]
        }
        if (f = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(j)) {
            return [parseFloat(f[1]) * 2.55, parseFloat(f[2]) * 2.55, parseFloat(f[3]) * 2.55]
        }
        if (f = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(j)) {
            return [parseInt(f[1], 16), parseInt(f[2], 16), parseInt(f[3], 16)]
        }
        if (f = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(j)) {
            return [parseInt(f[1] + f[1], 16), parseInt(f[2] + f[2], 16), parseInt(f[3] + f[3], 16)]
        }
        if (/rgba\(0, 0, 0, 0\)/.exec(j)) {
            return g.transparent
        }
        return g[p.trim(j).toLowerCase()]
    }

    function b(k, j) {
        var f;
        do {
            f = p.curCSS(k, j);
            if (f != "" && f != "transparent" || p.nodeName(k, "body")) {
                break
            }
            j = "backgroundColor"
        } while (k = k.parentNode);
        return h(f)
    }

    function e() {
        var m = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
            j = {},
            f, l;
        if (m && m.length && m[0] && m[m[0]]) {
            for (var k = m.length; k--;) {
                f = m[k];
                if (typeof m[f] == "string") {
                    l = f.replace(/\-(\w)/g, function (o, n) {
                        return n.toUpperCase()
                    });
                    j[l] = m[f]
                }
            }
        } else {
            for (f in m) {
                if (typeof m[f] === "string") {
                    j[f] = m[f]
                }
            }
        }
        return j
    }

    function d(k) {
        var j, f;
        for (j in k) {
            f = k[j];
            if (f == null || p.isFunction(f) || j in a || /scrollbar/.test(j) || !/color/i.test(j) && isNaN(parseFloat(f))) {
                delete k[j]
            }
        }
        return k
    }

    function t(l, j) {
        var f = {
                _: 0
            },
            k;
        for (k in j) {
            if (l[k] != j[k]) {
                f[k] = j[k]
            }
        }
        return f
    }

    function i(l, j, f, k) {
        if (typeof l == "object") {
            k = j;
            f = null;
            j = l;
            l = j.effect
        }
        if (p.isFunction(j)) {
            k = j;
            f = null;
            j = {}
        }
        if (p.isFunction(f)) {
            k = f;
            f = null
        }
        if (typeof j == "number" || p.fx.speeds[j]) {
            k = f;
            f = j;
            j = {}
        }
        j = j || {};
        f = f || j.duration;
        f = p.fx.off ? 0 : typeof f == "number" ? f : p.fx.speeds[f] || p.fx.speeds._default;
        k = k || j.complete;
        return [l, j, f, k]
    }
    p.effects = {};
    p.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"], function (j, f) {
        p.fx.step[f] = function (k) {
            if (!k.colorInit) {
                k.start = b(k.elem, f);
                k.end = h(k.end);
                k.colorInit = true
            }
            k.elem.style[f] = "rgb(" + Math.max(Math.min(parseInt(k.pos * (k.end[0] - k.start[0]) + k.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(k.pos * (k.end[1] - k.start[1]) + k.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(k.pos * (k.end[2] - k.start[2]) + k.start[2], 10), 255), 0) + ")"
        }
    });
    var g = {
            aqua: [0, 255, 255],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            black: [0, 0, 0],
            blue: [0, 0, 255],
            brown: [165, 42, 42],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgrey: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkviolet: [148, 0, 211],
            fuchsia: [255, 0, 255],
            gold: [255, 215, 0],
            green: [0, 128, 0],
            indigo: [75, 0, 130],
            khaki: [240, 230, 140],
            lightblue: [173, 216, 230],
            lightcyan: [224, 255, 255],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            navy: [0, 0, 128],
            olive: [128, 128, 0],
            orange: [255, 165, 0],
            pink: [255, 192, 203],
            purple: [128, 0, 128],
            violet: [128, 0, 128],
            red: [255, 0, 0],
            silver: [192, 192, 192],
            white: [255, 255, 255],
            yellow: [255, 255, 0],
            transparent: [255, 255, 255]
        },
        c = ["add", "remove", "toggle"],
        a = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
    p.effects.animateClass = function (l, j, f, k) {
        if (p.isFunction(f)) {
            k = f;
            f = null
        }
        return this.each(function () {
            var r = p(this),
                o = r.attr("style") || " ",
                n = d(e.call(this)),
                q, m = r.attr("className");
            p.each(c, function (s, v) {
                l[v] && r[v + "Class"](l[v])
            });
            q = d(e.call(this));
            r.attr("className", m);
            r.animate(t(n, q), j, f, function () {
                p.each(c, function (s, v) {
                    l[v] && r[v + "Class"](l[v])
                });
                if (typeof r.attr("style") == "object") {
                    r.attr("style").cssText = "";
                    r.attr("style").cssText = o
                } else {
                    r.attr("style", o)
                }
                k && k.apply(this, arguments)
            })
        })
    };
    p.fn.extend({
        _addClass: p.fn.addClass,
        addClass: function (l, j, f, k) {
            return j ? p.effects.animateClass.apply(this, [{
                    add: l
                },
                j, f, k
            ]) : this._addClass(l)
        },
        _removeClass: p.fn.removeClass,
        removeClass: function (l, j, f, k) {
            return j ? p.effects.animateClass.apply(this, [{
                    remove: l
                },
                j, f, k
            ]) : this._removeClass(l)
        },
        _toggleClass: p.fn.toggleClass,
        toggleClass: function (m, j, f, l, k) {
            return typeof j == "boolean" || j === undefined ? f ? p.effects.animateClass.apply(this, [j ? {
                    add: m
                } : {
                    remove: m
                },
                f, l, k
            ]) : this._toggleClass(m, j) : p.effects.animateClass.apply(this, [{
                    toggle: m
                },
                j, f, l
            ])
        },
        switchClass: function (m, j, f, l, k) {
            return p.effects.animateClass.apply(this, [{
                    add: j,
                    remove: m
                },
                f, l, k
            ])
        }
    });
    p.extend(p.effects, {
        version: "1.8.1",
        save: function (k, j) {
            for (var f = 0; f < j.length; f++) {
                j[f] !== null && k.data("ec.storage." + j[f], k[0].style[j[f]])
            }
        },
        restore: function (k, j) {
            for (var f = 0; f < j.length; f++) {
                j[f] !== null && k.css(j[f], k.data("ec.storage." + j[f]))
            }
        },
        setMode: function (j, f) {
            if (f == "toggle") {
                f = j.is(":hidden") ? "show" : "hide"
            }
            return f
        },
        getBaseline: function (k, j) {
            var f;
            switch (k[0]) {
            case "top":
                f = 0;
                break;
            case "middle":
                f = 0.5;
                break;
            case "bottom":
                f = 1;
                break;
            default:
                f = k[0] / j.height
            }
            switch (k[1]) {
            case "left":
                k = 0;
                break;
            case "center":
                k = 0.5;
                break;
            case "right":
                k = 1;
                break;
            default:
                k = k[1] / j.width
            }
            return {
                x: k,
                y: f
            }
        },
        createWrapper: function (k) {
            if (k.parent().is(".ui-effects-wrapper")) {
                return k.parent()
            }
            var j = {
                    width: k.outerWidth(true),
                    height: k.outerHeight(true),
                    "float": k.css("float")
                },
                f = p("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                });
            k.wrap(f);
            f = k.parent();
            if (k.css("position") == "static") {
                f.css({
                    position: "relative"
                });
                k.css({
                    position: "relative"
                })
            } else {
                p.extend(j, {
                    position: k.css("position"),
                    zIndex: k.css("z-index")
                });
                p.each(["top", "left", "bottom", "right"], function (m, l) {
                    j[l] = k.css(l);
                    if (isNaN(parseInt(j[l], 10))) {
                        j[l] = "auto"
                    }
                });
                k.css({
                    position: "relative",
                    top: 0,
                    left: 0
                })
            }
            return f.css(j).show()
        },
        removeWrapper: function (f) {
            if (f.parent().is(".ui-effects-wrapper")) {
                return f.parent().replaceWith(f)
            }
            return f
        },
        setTransition: function (l, j, f, k) {
            k = k || {};
            p.each(j, function (n, m) {
                unit = l.cssUnit(m);
                if (unit[0] > 0) {
                    k[m] = unit[0] * f + unit[1]
                }
            });
            return k
        }
    });
    p.fn.extend({
        effect: function (k) {
            var j = i.apply(this, arguments);
            j = {
                options: j[1],
                duration: j[2],
                callback: j[3]
            };
            var f = p.effects[k];
            return f && !p.fx.off ? f.call(this, j) : this
        },
        _show: p.fn.show,
        show: function (j) {
            if (!j || typeof j == "number" || p.fx.speeds[j]) {
                return this._show.apply(this, arguments)
            } else {
                var f = i.apply(this, arguments);
                f[1].mode = "show";
                return this.effect.apply(this, f)
            }
        },
        _hide: p.fn.hide,
        hide: function (j) {
            if (!j || typeof j == "number" || p.fx.speeds[j]) {
                return this._hide.apply(this, arguments)
            } else {
                var f = i.apply(this, arguments);
                f[1].mode = "hide";
                return this.effect.apply(this, f)
            }
        },
        __toggle: p.fn.toggle,
        toggle: function (j) {
            if (!j || typeof j == "number" || p.fx.speeds[j] || typeof j == "boolean" || p.isFunction(j)) {
                return this.__toggle.apply(this, arguments)
            } else {
                var f = i.apply(this, arguments);
                f[1].mode = "toggle";
                return this.effect.apply(this, f)
            }
        },
        cssUnit: function (k) {
            var j = this.css(k),
                f = [];
            p.each(["em", "px", "%", "pt"], function (m, l) {
                if (j.indexOf(l) > 0) {
                    f = [parseFloat(j), l]
                }
            });
            return f
        }
    });
    p.easing.jswing = p.easing.swing;
    p.extend(p.easing, {
        def: "easeOutQuad",
        swing: function (m, j, f, l, k) {
            return p.easing[p.easing.def](m, j, f, l, k)
        },
        easeInQuad: function (m, j, f, l, k) {
            return l * (j /= k) * j + f
        },
        easeOutQuad: function (m, j, f, l, k) {
            return -l * (j /= k) * (j - 2) + f
        },
        easeInOutQuad: function (m, j, f, l, k) {
            if ((j /= k / 2) < 1) {
                return l / 2 * j * j + f
            }
            return -l / 2 * (--j * (j - 2) - 1) + f
        },
        easeInCubic: function (m, j, f, l, k) {
            return l * (j /= k) * j * j + f
        },
        easeOutCubic: function (m, j, f, l, k) {
            return l * ((j = j / k - 1) * j * j + 1) + f
        },
        easeInOutCubic: function (m, j, f, l, k) {
            if ((j /= k / 2) < 1) {
                return l / 2 * j * j * j + f
            }
            return l / 2 * ((j -= 2) * j * j + 2) + f
        },
        easeInQuart: function (m, j, f, l, k) {
            return l * (j /= k) * j * j * j + f
        },
        easeOutQuart: function (m, j, f, l, k) {
            return -l * ((j = j / k - 1) * j * j * j - 1) + f
        },
        easeInOutQuart: function (m, j, f, l, k) {
            if ((j /= k / 2) < 1) {
                return l / 2 * j * j * j * j + f
            }
            return -l / 2 * ((j -= 2) * j * j * j - 2) + f
        },
        easeInQuint: function (m, j, f, l, k) {
            return l * (j /= k) * j * j * j * j + f
        },
        easeOutQuint: function (m, j, f, l, k) {
            return l * ((j = j / k - 1) * j * j * j * j + 1) + f
        },
        easeInOutQuint: function (m, j, f, l, k) {
            if ((j /= k / 2) < 1) {
                return l / 2 * j * j * j * j * j + f
            }
            return l / 2 * ((j -= 2) * j * j * j * j + 2) + f
        },
        easeInSine: function (m, j, f, l, k) {
            return -l * Math.cos(j / k * (Math.PI / 2)) + l + f
        },
        easeOutSine: function (m, j, f, l, k) {
            return l * Math.sin(j / k * (Math.PI / 2)) + f
        },
        easeInOutSine: function (m, j, f, l, k) {
            return -l / 2 * (Math.cos(Math.PI * j / k) - 1) + f
        },
        easeInExpo: function (m, j, f, l, k) {
            return j == 0 ? f : l * Math.pow(2, 10 * (j / k - 1)) + f
        },
        easeOutExpo: function (m, j, f, l, k) {
            return j == k ? f + l : l * (-Math.pow(2, -10 * j / k) + 1) + f
        },
        easeInOutExpo: function (m, j, f, l, k) {
            if (j == 0) {
                return f
            }
            if (j == k) {
                return f + l
            }
            if ((j /= k / 2) < 1) {
                return l / 2 * Math.pow(2, 10 * (j - 1)) + f
            }
            return l / 2 * (-Math.pow(2, -10 * --j) + 2) + f
        },
        easeInCirc: function (m, j, f, l, k) {
            return -l * (Math.sqrt(1 - (j /= k) * j) - 1) + f
        },
        easeOutCirc: function (m, j, f, l, k) {
            return l * Math.sqrt(1 - (j = j / k - 1) * j) + f
        },
        easeInOutCirc: function (m, j, f, l, k) {
            if ((j /= k / 2) < 1) {
                return -l / 2 * (Math.sqrt(1 - j * j) - 1) + f
            }
            return l / 2 * (Math.sqrt(1 - (j -= 2) * j) + 1) + f
        },
        easeInElastic: function (o, j, f, n, m) {
            o = 1.70158;
            var l = 0,
                k = n;
            if (j == 0) {
                return f
            }
            if ((j /= m) == 1) {
                return f + n
            }
            l || (l = m * 0.3);
            if (k < Math.abs(n)) {
                k = n;
                o = l / 4
            } else {
                o = l / (2 * Math.PI) * Math.asin(n / k)
            }
            return -(k * Math.pow(2, 10 * (j -= 1)) * Math.sin((j * m - o) * 2 * Math.PI / l)) + f
        },
        easeOutElastic: function (o, j, f, n, m) {
            o = 1.70158;
            var l = 0,
                k = n;
            if (j == 0) {
                return f
            }
            if ((j /= m) == 1) {
                return f + n
            }
            l || (l = m * 0.3);
            if (k < Math.abs(n)) {
                k = n;
                o = l / 4
            } else {
                o = l / (2 * Math.PI) * Math.asin(n / k)
            }
            return k * Math.pow(2, -10 * j) * Math.sin((j * m - o) * 2 * Math.PI / l) + n + f
        },
        easeInOutElastic: function (o, j, f, n, m) {
            o = 1.70158;
            var l = 0,
                k = n;
            if (j == 0) {
                return f
            }
            if ((j /= m / 2) == 2) {
                return f + n
            }
            l || (l = m * 0.3 * 1.5);
            if (k < Math.abs(n)) {
                k = n;
                o = l / 4
            } else {
                o = l / (2 * Math.PI) * Math.asin(n / k)
            } if (j < 1) {
                return -0.5 * k * Math.pow(2, 10 * (j -= 1)) * Math.sin((j * m - o) * 2 * Math.PI / l) + f
            }
            return k * Math.pow(2, -10 * (j -= 1)) * Math.sin((j * m - o) * 2 * Math.PI / l) * 0.5 + n + f
        },
        easeInBack: function (n, j, f, m, l, k) {
            if (k == undefined) {
                k = 1.70158
            }
            return m * (j /= l) * j * ((k + 1) * j - k) + f
        },
        easeOutBack: function (n, j, f, m, l, k) {
            if (k == undefined) {
                k = 1.70158
            }
            return m * ((j = j / l - 1) * j * ((k + 1) * j + k) + 1) + f
        },
        easeInOutBack: function (n, j, f, m, l, k) {
            if (k == undefined) {
                k = 1.70158
            }
            if ((j /= l / 2) < 1) {
                return m / 2 * j * j * (((k *= 1.525) + 1) * j - k) + f
            }
            return m / 2 * ((j -= 2) * j * (((k *= 1.525) + 1) * j + k) + 2) + f
        },
        easeInBounce: function (m, j, f, l, k) {
            return l - p.easing.easeOutBounce(m, k - j, 0, l, k) + f
        },
        easeOutBounce: function (m, j, f, l, k) {
            return (j /= k) < 1 / 2.75 ? l * 7.5625 * j * j + f : j < 2 / 2.75 ? l * (7.5625 * (j -= 1.5 / 2.75) * j + 0.75) + f : j < 2.5 / 2.75 ? l * (7.5625 * (j -= 2.25 / 2.75) * j + 0.9375) + f : l * (7.5625 * (j -= 2.625 / 2.75) * j + 0.984375) + f
        },
        easeInOutBounce: function (m, j, f, l, k) {
            if (j < k / 2) {
                return p.easing.easeInBounce(m, j * 2, 0, l, k) * 0.5 + f
            }
            return p.easing.easeOutBounce(m, j * 2 - k, 0, l, k) * 0.5 + l * 0.5 + f
        }
    })
}(jQuery);
(function (a) {
    a.effects.blind = function (b) {
        return this.queue(function () {
            var c = a(this),
                l = ["position", "top", "left"],
                m = a.effects.setMode(c, b.options.mode || "hide"),
                o = b.options.direction || "vertical";
            a.effects.save(c, l);
            c.show();
            var n = a.effects.createWrapper(c).css({
                    overflow: "hidden"
                }),
                k = o == "vertical" ? "height" : "width";
            o = o == "vertical" ? n.height() : n.width();
            m == "show" && n.css(k, 0);
            var j = {};
            j[k] = m == "show" ? o : 0;
            n.animate(j, b.duration, b.options.easing, function () {
                m == "hide" && c.hide();
                a.effects.restore(c, l);
                a.effects.removeWrapper(c);
                b.callback && b.callback.apply(c[0], arguments);
                c.dequeue()
            })
        })
    }
})(jQuery);
(function () {
    var w = this;
    var s = w._;
    var b = {};
    var j = Array.prototype,
        C = Object.prototype,
        F = Function.prototype;
    var u = j.slice,
        y = j.unshift,
        x = C.toString,
        p = C.hasOwnProperty;
    var n = j.forEach,
        i = j.map,
        A = j.reduce,
        e = j.reduceRight,
        m = j.filter,
        a = j.every,
        z = j.some,
        v = j.indexOf,
        f = j.lastIndexOf,
        c = Array.isArray,
        B = Object.keys,
        k = F.bind;
    var E = function (H) {
        return new g(H)
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = E
        }
        exports._ = E
    } else {
        w._ = E
    }
    E.VERSION = "1.3.0";
    var d = E.each = E.forEach = function (M, L, K) {
        if (M == null) {
            return
        }
        if (n && M.forEach === n) {
            M.forEach(L, K)
        } else {
            if (M.length === +M.length) {
                for (var J = 0, H = M.length; J < H; J++) {
                    if (J in M && L.call(K, M[J], J, M) === b) {
                        return
                    }
                }
            } else {
                for (var I in M) {
                    if (p.call(M, I)) {
                        if (L.call(K, M[I], I, M) === b) {
                            return
                        }
                    }
                }
            }
        }
    };
    E.map = function (K, J, I) {
        var H = [];
        if (K == null) {
            return H
        }
        if (i && K.map === i) {
            return K.map(J, I)
        }
        d(K, function (N, L, M) {
            H[H.length] = J.call(I, N, L, M)
        });
        if (K.length === +K.length) {
            H.length = K.length
        }
        return H
    };
    E.reduce = E.foldl = E.inject = function (L, K, H, J) {
        var I = arguments.length > 2;
        if (L == null) {
            L = []
        }
        if (A && L.reduce === A) {
            if (J) {
                K = E.bind(K, J)
            }
            return I ? L.reduce(K, H) : L.reduce(K)
        }
        d(L, function (O, M, N) {
            if (!I) {
                H = O;
                I = true
            } else {
                H = K.call(J, H, O, M, N)
            }
        });
        if (!I) {
            throw new TypeError("Reduce of empty array with no initial value")
        }
        return H
    };
    E.reduceRight = E.foldr = function (L, K, H, J) {
        var I = arguments.length > 2;
        if (L == null) {
            L = []
        }
        if (e && L.reduceRight === e) {
            if (J) {
                K = E.bind(K, J)
            }
            return I ? L.reduceRight(K, H) : L.reduceRight(K)
        }
        var M = E.toArray(L).reverse();
        if (J && !I) {
            K = E.bind(K, J)
        }
        return I ? E.reduce(M, K, H, J) : E.reduce(M, K)
    };
    E.find = E.detect = function (K, J, I) {
        var H;
        q(K, function (N, L, M) {
            if (J.call(I, N, L, M)) {
                H = N;
                return true
            }
        });
        return H
    };
    E.filter = E.select = function (K, J, I) {
        var H = [];
        if (K == null) {
            return H
        }
        if (m && K.filter === m) {
            return K.filter(J, I)
        }
        d(K, function (N, L, M) {
            if (J.call(I, N, L, M)) {
                H[H.length] = N
            }
        });
        return H
    };
    E.reject = function (K, J, I) {
        var H = [];
        if (K == null) {
            return H
        }
        d(K, function (N, L, M) {
            if (!J.call(I, N, L, M)) {
                H[H.length] = N
            }
        });
        return H
    };
    E.every = E.all = function (K, J, I) {
        var H = true;
        if (K == null) {
            return H
        }
        if (a && K.every === a) {
            return K.every(J, I)
        }
        d(K, function (N, L, M) {
            if (!(H = H && J.call(I, N, L, M))) {
                return b
            }
        });
        return H
    };
    var q = E.some = E.any = function (K, J, I) {
        J || (J = E.identity);
        var H = false;
        if (K == null) {
            return H
        }
        if (z && K.some === z) {
            return K.some(J, I)
        }
        d(K, function (N, L, M) {
            if (H || (H = J.call(I, N, L, M))) {
                return b
            }
        });
        return !!H
    };
    E.include = E.contains = function (J, I) {
        var H = false;
        if (J == null) {
            return H
        }
        if (v && J.indexOf === v) {
            return J.indexOf(I) != -1
        }
        H = q(J, function (K) {
            return K === I
        });
        return H
    };
    E.invoke = function (I, J) {
        var H = u.call(arguments, 2);
        return E.map(I, function (K) {
            return (E.isFunction(J) ? J || K : K[J]).apply(K, H)
        })
    };
    E.pluck = function (I, H) {
        return E.map(I, function (J) {
            return J[H]
        })
    };
    E.max = function (K, J, I) {
        if (!J && E.isArray(K)) {
            return Math.max.apply(Math, K)
        }
        if (!J && E.isEmpty(K)) {
            return -Infinity
        }
        var H = {
            computed: -Infinity
        };
        d(K, function (O, L, N) {
            var M = J ? J.call(I, O, L, N) : O;
            M >= H.computed && (H = {
                value: O,
                computed: M
            })
        });
        return H.value
    };
    E.min = function (K, J, I) {
        if (!J && E.isArray(K)) {
            return Math.min.apply(Math, K)
        }
        if (!J && E.isEmpty(K)) {
            return Infinity
        }
        var H = {
            computed: Infinity
        };
        d(K, function (O, L, N) {
            var M = J ? J.call(I, O, L, N) : O;
            M < H.computed && (H = {
                value: O,
                computed: M
            })
        });
        return H.value
    };
    E.shuffle = function (J) {
        var H = [],
            I;
        d(J, function (M, K, L) {
            if (K == 0) {
                H[0] = M
            } else {
                I = Math.floor(Math.random() * (K + 1));
                H[K] = H[I];
                H[I] = M
            }
        });
        return H
    };
    E.sortBy = function (J, I, H) {
        return E.pluck(E.map(J, function (M, K, L) {
            return {
                value: M,
                criteria: I.call(H, M, K, L)
            }
        }).sort(function (N, M) {
            var L = N.criteria,
                K = M.criteria;
            return L < K ? -1 : L > K ? 1 : 0
        }), "value")
    };
    E.groupBy = function (J, K) {
        var H = {};
        var I = E.isFunction(K) ? K : function (L) {
            return L[K]
        };
        d(J, function (N, L) {
            var M = I(N, L);
            (H[M] || (H[M] = [])).push(N)
        });
        return H
    };
    E.sortedIndex = function (M, L, J) {
        J || (J = E.identity);
        var H = 0,
            K = M.length;
        while (H < K) {
            var I = (H + K) >> 1;
            J(M[I]) < J(L) ? H = I + 1 : K = I
        }
        return H
    };
    E.toArray = function (H) {
        if (!H) {
            return []
        }
        if (H.toArray) {
            return H.toArray()
        }
        if (E.isArray(H)) {
            return u.call(H)
        }
        if (E.isArguments(H)) {
            return u.call(H)
        }
        return E.values(H)
    };
    E.size = function (H) {
        return E.toArray(H).length
    };
    E.first = E.head = function (J, I, H) {
        return (I != null) && !H ? u.call(J, 0, I) : J[0]
    };
    E.initial = function (J, I, H) {
        return u.call(J, 0, J.length - ((I == null) || H ? 1 : I))
    };
    E.last = function (J, I, H) {
        if ((I != null) && !H) {
            return u.call(J, Math.max(J.length - I, 0))
        } else {
            return J[J.length - 1]
        }
    };
    E.rest = E.tail = function (J, H, I) {
        return u.call(J, (H == null) || I ? 1 : H)
    };
    E.compact = function (H) {
        return E.filter(H, function (I) {
            return !!I
        })
    };
    E.flatten = function (I, H) {
        return E.reduce(I, function (J, K) {
            if (E.isArray(K)) {
                return J.concat(H ? K : E.flatten(K))
            }
            J[J.length] = K;
            return J
        }, [])
    };
    E.without = function (H) {
        return E.difference(H, u.call(arguments, 1))
    };
    E.uniq = E.unique = function (L, K, J) {
        var I = J ? E.map(L, J) : L;
        var H = [];
        E.reduce(I, function (M, O, N) {
            if (0 == N || (K === true ? E.last(M) != O : !E.include(M, O))) {
                M[M.length] = O;
                H[H.length] = L[N]
            }
            return M
        }, []);
        return H
    };
    E.union = function () {
        return E.uniq(E.flatten(arguments, true))
    };
    E.intersection = E.intersect = function (I) {
        var H = u.call(arguments, 1);
        return E.filter(E.uniq(I), function (J) {
            return E.every(H, function (K) {
                return E.indexOf(K, J) >= 0
            })
        })
    };
    E.difference = function (I) {
        var H = E.flatten(u.call(arguments, 1));
        return E.filter(I, function (J) {
            return !E.include(H, J)
        })
    };
    E.zip = function () {
        var H = u.call(arguments);
        var K = E.max(E.pluck(H, "length"));
        var J = new Array(K);
        for (var I = 0; I < K; I++) {
            J[I] = E.pluck(H, "" + I)
        }
        return J
    };
    E.indexOf = function (L, J, K) {
        if (L == null) {
            return -1
        }
        var I, H;
        if (K) {
            I = E.sortedIndex(L, J);
            return L[I] === J ? I : -1
        }
        if (v && L.indexOf === v) {
            return L.indexOf(J)
        }
        for (I = 0, H = L.length; I < H; I++) {
            if (I in L && L[I] === J) {
                return I
            }
        }
        return -1
    };
    E.lastIndexOf = function (J, I) {
        if (J == null) {
            return -1
        }
        if (f && J.lastIndexOf === f) {
            return J.lastIndexOf(I)
        }
        var H = J.length;
        while (H--) {
            if (H in J && J[H] === I) {
                return H
            }
        }
        return -1
    };
    E.range = function (M, K, L) {
        if (arguments.length <= 1) {
            K = M || 0;
            M = 0
        }
        L = arguments[2] || 1;
        var I = Math.max(Math.ceil((K - M) / L), 0);
        var H = 0;
        var J = new Array(I);
        while (H < I) {
            J[H++] = M;
            M += L
        }
        return J
    };
    var h = function () {};
    E.bind = function G(K, I) {
        var J, H;
        if (K.bind === k && k) {
            return k.apply(K, u.call(arguments, 1))
        }
        if (!E.isFunction(K)) {
            throw new TypeError
        }
        H = u.call(arguments, 2);
        return J = function () {
            if (!(this instanceof J)) {
                return K.apply(I, H.concat(u.call(arguments)))
            }
            h.prototype = K.prototype;
            var M = new h;
            var L = K.apply(M, H.concat(u.call(arguments)));
            if (Object(L) === L) {
                return L
            }
            return M
        }
    };
    E.bindAll = function (I) {
        var H = u.call(arguments, 1);
        if (H.length == 0) {
            H = E.functions(I)
        }
        d(H, function (J) {
            I[J] = E.bind(I[J], I)
        });
        return I
    };
    E.memoize = function (J, I) {
        var H = {};
        I || (I = E.identity);
        return function () {
            var K = I.apply(this, arguments);
            return p.call(H, K) ? H[K] : (H[K] = J.apply(this, arguments))
        }
    };
    E.delay = function (I, J) {
        var H = u.call(arguments, 2);
        return setTimeout(function () {
            return I.apply(I, H)
        }, J)
    };
    E.defer = function (H) {
        return E.delay.apply(E, [H, 1].concat(u.call(arguments, 1)))
    };
    E.throttle = function (M, O) {
        var K, H, N, L, J;
        var I = E.debounce(function () {
            J = L = false
        }, O);
        return function () {
            K = this;
            H = arguments;
            var P = function () {
                N = null;
                if (J) {
                    M.apply(K, H)
                }
                I()
            };
            if (!N) {
                N = setTimeout(P, O)
            }
            if (L) {
                J = true
            } else {
                M.apply(K, H)
            }
            I();
            L = true
        }
    };
    E.debounce = function (H, J) {
        var I;
        return function () {
            var M = this,
                L = arguments;
            var K = function () {
                I = null;
                H.apply(M, L)
            };
            clearTimeout(I);
            I = setTimeout(K, J)
        }
    };
    E.once = function (J) {
        var H = false,
            I;
        return function () {
            if (H) {
                return I
            }
            H = true;
            return I = J.apply(this, arguments)
        }
    };
    E.wrap = function (H, I) {
        return function () {
            var J = [H].concat(u.call(arguments, 0));
            return I.apply(this, J)
        }
    };
    E.compose = function () {
        var H = arguments;
        return function () {
            var I = arguments;
            for (var J = H.length - 1; J >= 0; J--) {
                I = [H[J].apply(this, I)]
            }
            return I[0]
        }
    };
    E.after = function (I, H) {
        if (I <= 0) {
            return H()
        }
        return function () {
            if (--I < 1) {
                return H.apply(this, arguments)
            }
        }
    };
    E.keys = B || function (J) {
        if (J !== Object(J)) {
            throw new TypeError("Invalid object")
        }
        var I = [];
        for (var H in J) {
            if (p.call(J, H)) {
                I[I.length] = H
            }
        }
        return I
    };
    E.values = function (H) {
        return E.map(H, E.identity)
    };
    E.functions = E.methods = function (J) {
        var I = [];
        for (var H in J) {
            if (E.isFunction(J[H])) {
                I.push(H)
            }
        }
        return I.sort()
    };
    E.extend = function (H) {
        d(u.call(arguments, 1), function (I) {
            for (var J in I) {
                if (I[J] !== void 0) {
                    H[J] = I[J]
                }
            }
        });
        return H
    };
    E.defaults = function (H) {
        d(u.call(arguments, 1), function (I) {
            for (var J in I) {
                if (H[J] == null) {
                    H[J] = I[J]
                }
            }
        });
        return H
    };
    E.clone = function (H) {
        if (!E.isObject(H)) {
            return H
        }
        return E.isArray(H) ? H.slice() : E.extend({}, H)
    };
    E.tap = function (I, H) {
        H(I);
        return I
    };

    function D(K, J, I) {
        if (K === J) {
            return K !== 0 || 1 / K == 1 / J
        }
        if (K == null || J == null) {
            return K === J
        }
        if (K._chain) {
            K = K._wrapped
        }
        if (J._chain) {
            J = J._wrapped
        }
        if (K.isEqual && E.isFunction(K.isEqual)) {
            return K.isEqual(J)
        }
        if (J.isEqual && E.isFunction(J.isEqual)) {
            return J.isEqual(K)
        }
        var N = x.call(K);
        if (N != x.call(J)) {
            return false
        }
        switch (N) {
        case "[object String]":
            return K == String(J);
        case "[object Number]":
            return K != +K ? J != +J : (K == 0 ? 1 / K == 1 / J : K == +J);
        case "[object Date]":
        case "[object Boolean]":
            return +K == +J;
        case "[object RegExp]":
            return K.source == J.source && K.global == J.global && K.multiline == J.multiline && K.ignoreCase == J.ignoreCase
        }
        if (typeof K != "object" || typeof J != "object") {
            return false
        }
        var O = I.length;
        while (O--) {
            if (I[O] == K) {
                return true
            }
        }
        I.push(K);
        var M = 0,
            H = true;
        if (N == "[object Array]") {
            M = K.length;
            H = M == J.length;
            if (H) {
                while (M--) {
                    if (!(H = M in K == M in J && D(K[M], J[M], I))) {
                        break
                    }
                }
            }
        } else {
            if ("constructor" in K != "constructor" in J || K.constructor != J.constructor) {
                return false
            }
            for (var L in K) {
                if (p.call(K, L)) {
                    M++;
                    if (!(H = p.call(J, L) && D(K[L], J[L], I))) {
                        break
                    }
                }
            }
            if (H) {
                for (L in J) {
                    if (p.call(J, L) && !(M--)) {
                        break
                    }
                }
                H = !M
            }
        }
        I.pop();
        return H
    }
    E.isEqual = function (I, H) {
        return D(I, H, [])
    };
    E.isEmpty = function (I) {
        if (E.isArray(I) || E.isString(I)) {
            return I.length === 0
        }
        for (var H in I) {
            if (p.call(I, H)) {
                return false
            }
        }
        return true
    };
    E.isElement = function (H) {
        return !!(H && H.nodeType == 1)
    };
    E.isArray = c || function (H) {
        return x.call(H) == "[object Array]"
    };
    E.isObject = function (H) {
        return H === Object(H)
    };
    E.isArguments = function (H) {
        return x.call(H) == "[object Arguments]"
    };
    if (!E.isArguments(arguments)) {
        E.isArguments = function (H) {
            return !!(H && p.call(H, "callee"))
        }
    }
    E.isFunction = function (H) {
        return x.call(H) == "[object Function]"
    };
    E.isString = function (H) {
        return x.call(H) == "[object String]"
    };
    E.isNumber = function (H) {
        return x.call(H) == "[object Number]"
    };
    E.isNaN = function (H) {
        return H !== H
    };
    E.isBoolean = function (H) {
        return H === true || H === false || x.call(H) == "[object Boolean]"
    };
    E.isDate = function (H) {
        return x.call(H) == "[object Date]"
    };
    E.isRegExp = function (H) {
        return x.call(H) == "[object RegExp]"
    };
    E.isNull = function (H) {
        return H === null
    };
    E.isUndefined = function (H) {
        return H === void 0
    };
    E.noConflict = function () {
        w._ = s;
        return this
    };
    E.identity = function (H) {
        return H
    };
    E.times = function (K, J, I) {
        for (var H = 0; H < K; H++) {
            J.call(I, H)
        }
    };
    E.escape = function (H) {
        return ("" + H).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
    };
    E.mixin = function (H) {
        d(E.functions(H), function (I) {
            r(I, E[I] = H[I])
        })
    };
    var l = 0;
    E.uniqueId = function (H) {
        var I = l++;
        return H ? H + I : I
    };
    E.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var t = /.^/;
    E.template = function (K, J) {
        var L = E.templateSettings;
        var H = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + K.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(L.escape || t, function (M, N) {
            return "',_.escape(" + N.replace(/\\'/g, "'") + "),'"
        }).replace(L.interpolate || t, function (M, N) {
            return "'," + N.replace(/\\'/g, "'") + ",'"
        }).replace(L.evaluate || t, function (M, N) {
            return "');" + N.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ").replace(/\\\\/g, "\\") + ";__p.push('"
        }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');";
        var I = new Function("obj", "_", H);
        if (J) {
            return I(J, E)
        }
        return function (M) {
            return I.call(this, M, E)
        }
    };
    E.chain = function (H) {
        return E(H).chain()
    };
    var g = function (H) {
        this._wrapped = H
    };
    E.prototype = g.prototype;
    var o = function (I, H) {
        return H ? E(I).chain() : I
    };
    var r = function (H, I) {
        g.prototype[H] = function () {
            var J = u.call(arguments);
            y.call(J, this._wrapped);
            return o(I.apply(E, J), this._chain)
        }
    };
    E.mixin(E);
    d(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (H) {
        var I = j[H];
        g.prototype[H] = function () {
            var J = this._wrapped;
            I.apply(J, arguments);
            var K = J.length;
            if ((H == "shift" || H == "splice") && K === 0) {
                delete J[0]
            }
            return o(J, this._chain)
        }
    });
    d(["concat", "join", "slice"], function (H) {
        var I = j[H];
        g.prototype[H] = function () {
            return o(I.apply(this._wrapped, arguments), this._chain)
        }
    });
    g.prototype.chain = function () {
        this._chain = true;
        return this
    };
    g.prototype.value = function () {
        return this._wrapped
    }
}).call(this);
(function () {
    jQuery.fn.autohide = function (a) {
        var b = this;
        a = _.extend({
            clickable: null,
            onHide: null
        }, a || {});
        b._autoignore = true;
        setTimeout(function () {
            delete b._autoignore
        }, 0);
        if (!b._autohider) {
            b.forceHide = function (c) {
                if (!c && a.onHide) {
                    a.onHide()
                }
                b.hide();
                DV.jQuery(document).unbind("click", b._autohider);
                DV.jQuery(document).unbind("keypress", b._autohider);
                b._autohider = null;
                b.forceHide = null
            };
            b._autohider = function (c) {
                if (b._autoignore) {
                    return
                }
                if (a.clickable && (b[0] == c.target || _.include(DV.jQuery(c.target).parents(), b[0]))) {
                    return
                }
                if (a.onHide && !a.onHide(c)) {
                    return
                }
                b.forceHide(c)
            };
            DV.jQuery(document).bind("click", this._autohider);
            DV.jQuery(document).bind("keypress", this._autohider)
        }
    };
    jQuery.fn.acceptInput = function (b) {
        var a = {
            delay: 1000,
            callback: null,
            className: "acceptInput",
            initialStateClassName: "acceptInput-awaitingActivity",
            typingStateClassName: "acceptInput-acceptingInput",
            inputClassName: "acceptInput-textField"
        };
        if (b) {
            DV.jQuery.extend(a, b)
        }
        this.editTimer = null;
        this.deny = function () {
            this.parent().addClass("stopAcceptingInput")
        };
        this.allow = function () {
            this.parent().removeClass("stopAcceptingInput")
        };
        this.each(function (d, e) {
            if (DV.jQuery(e).parent().hasClass(a.initialStateClassName)) {
                return true
            }
            e = DV.jQuery(e);
            var c = e.wrap('<span class="' + a.initialStateClassName + '"></span>');
            c = c.parent();
            var f = DV.jQuery('<input type="text" class="' + a.inputClassName + '" style="display:none;" />').appendTo(c);
            f.bind("blur", function () {
                c.addClass(a.initialStateClassName).removeClass(a.typingStateClassName);
                f.hide();
                e.show()
            });
            f.bind("keyup", function () {
                var g = f.attr("value");
                e.text(g);
                if (a.changeCallBack) {
                    DV.jQuery.fn.acceptInput.editTimer = setTimeout(a.changeCallBack, 500)
                }
            });
            f.bind("keydown", function () {
                if (DV.jQuery.fn.acceptInput.editTimer) {
                    clearTimeout(DV.jQuery.fn.acceptInput.editTimer)
                }
            });
            c.bind("click", function () {
                if (c.hasClass("stopAcceptingInput")) {
                    return
                }
                if (c.hasClass(a.initialStateClassName)) {
                    var g = function () {
                        c.addClass(a.initialStateClassName).removeClass(a.typingStateClassName)
                    };
                    DV.jQuery(f).autohide({
                        clickable: true,
                        onHide: DV.jQuery.proxy(g, this)
                    });
                    e.hide();
                    f.attr("value", e.text()).show()[0].focus();
                    f[0].select();
                    c.addClass(a.typingStateClassName).removeClass(a.initialStateClassName)
                }
            })
        });
        return this
    }
}).call(this);
(function (a) {
    a.fn.placeholder = function (d) {
        var e = {
            message: "...",
            className: "placeholder",
            clearClassName: "show_cancel_search"
        };
        var b = a.extend({}, e, d);
        var c = function (f) {
            f.val(f.attr("placeholder") || b.message);
            f.addClass(b.className)
        };
        return this.each(function () {
            var f = a(this);
            if (f.attr("type") == "search") {
                return
            }
            f.bind("blur", function () {
                if (f.val() == "") {
                    c(f)
                }
            }).bind("focus", function () {
                if (f.val() == (f.attr("placeholder") || b.message)) {
                    f.val("")
                }
                f.removeClass(b.className)
            }).bind("keyup", function () {
                var g = f.val();
                if (g != "" && g != b.message) {
                    f.parent().addClass(b.clearClassName)
                } else {
                    f.parent().removeClass(b.clearClassName)
                }
            });
            _.defer(function () {
                f.keyup().blur()
            })
        })
    }
})(jQuery);
window.console || (window.console = {});
console.log || (console.log = _.identity);
window.DV = window.DV || {};
DV.jQuery = jQuery.noConflict(true);
DV.viewers = DV.viewers || {};
DV.model = DV.model || {};
DV.Annotation = function (a) {
    this.position = {
        top: a.top,
        left: a.left
    };
    this.dimensions = {
        width: a.width,
        height: a.height
    };
    this.page = a.page;
    this.pageEl = a.pageEl;
    this.annotationContainerEl = a.annotationContainerEl;
    this.viewer = this.page.set.viewer;
    this.annotationEl = null;
    this.renderedHTML = a.renderedHTML;
    this.type = a.type;
    this.id = a.id;
    this.model = this.viewer.models.annotations.getAnnotation(this.id);
    this.state = "collapsed";
    this.active = false;
    this.remove();
    this.add();
    if (a.active) {
        this.viewer.helpers.setActiveAnnotationLimits(this);
        this.viewer.events.resetTracker();
        this.active = null;
        this.show();
        if (a.showEdit) {
            this.showEdit()
        }
    }
};
DV.Annotation.prototype.add = function () {
    if (this.type === "page") {
        this.annotationEl = this.renderedHTML.insertBefore(this.annotationContainerEl)
    } else {
        if (this.page.annotations.length > 0) {
            for (var b = 0, a = this.page.annotations.length; b < a; b++) {
                if (this.page.annotations[b].id === this.id) {
                    return false
                } else {
                    this.annotationEl = this.renderedHTML.appendTo(this.annotationContainerEl)
                }
            }
        } else {
            this.annotationEl = this.renderedHTML.appendTo(this.annotationContainerEl)
        }
    }
};
DV.Annotation.prototype.next = function () {
    this.hide.preventRemovalOfCoverClass = true;
    var a = this.viewer.models.annotations.getNextAnnotation(this.id);
    if (!a) {
        return
    }
    this.page.set.showAnnotation({
        index: a.index,
        id: a.id,
        top: a.top
    })
};
DV.Annotation.prototype.previous = function () {
    this.hide.preventRemovalOfCoverClass = true;
    var a = this.viewer.models.annotations.getPreviousAnnotation(this.id);
    if (!a) {
        return
    }
    this.page.set.showAnnotation({
        index: a.index,
        id: a.id,
        top: a.top
    })
};
DV.Annotation.prototype.show = function (a) {
    if (this.viewer.activeAnnotation && this.viewer.activeAnnotation.id != this.id) {
        this.viewer.activeAnnotation.hide()
    }
    this.viewer.annotationToLoadId = null;
    this.viewer.elements.window.addClass("DV-coverVisible");
    this.annotationEl.find("div.DV-annotationBG").css({
        display: "block",
        opacity: 1
    });
    this.annotationEl.addClass("DV-activeAnnotation");
    this.viewer.activeAnnotation = this;
    this.viewer.helpers.addObserver("trackAnnotation");
    this.viewer.helpers.setActiveAnnotationInNav(this.id);
    this.active = true;
    this.pageEl.parent(".DV-set").addClass("DV-activePage");
    if (a && a.edit) {
        this.showEdit()
    }
};
DV.Annotation.prototype.hide = function (b) {
    var a = parseInt(this.viewer.elements.currentPage.text(), 10);
    if (this.type !== "page") {
        this.annotationEl.find("div.DV-annotationBG").css({
            opacity: 0,
            display: "none"
        })
    }
    var c = this.annotationEl.hasClass("DV-editing");
    this.annotationEl.removeClass("DV-editing DV-activeAnnotation");
    if (b === true) {
        this.viewer.elements.window.removeClass("DV-coverVisible")
    }
    if (this.hide.preventRemovalOfCoverClass === false || !this.hide.preventRemovalOfCoverClass) {
        this.viewer.elements.window.removeClass("DV-coverVisible");
        this.hide.preventRemovalOfCoverClass = false
    }
    this.viewer.activeAnnotation = null;
    this.viewer.events.trackAnnotation.h = null;
    this.viewer.events.trackAnnotation.id = null;
    this.viewer.events.trackAnnotation.combined = null;
    this.active = false;
    this.viewer.pageSet.setActiveAnnotation(null);
    this.viewer.helpers.removeObserver("trackAnnotation");
    this.viewer.helpers.setActiveAnnotationInNav();
    this.pageEl.parent(".DV-set").removeClass("DV-activePage");
    this.removeConnector(true);
    if (c) {
        this.viewer.helpers.saveAnnotation({
            target: this.annotationEl
        }, "onlyIfText")
    }
};
DV.Annotation.prototype.toggle = function (a) {
    if (this.viewer.activeAnnotation && (this.viewer.activeAnnotation != this)) {
        this.viewer.activeAnnotation.hide()
    }
    if (this.type === "page") {
        return
    }
    this.annotationEl.toggleClass("DV-activeAnnotation");
    if (this.active == true) {
        this.hide(true)
    } else {
        this.show()
    }
};
DV.Annotation.prototype.drawConnector = function () {
    if (this.active != true) {
        this.viewer.elements.window.addClass("DV-annotationActivated");
        this.annotationEl.addClass("DV-annotationHover")
    }
};
DV.Annotation.prototype.removeConnector = function (a) {
    if (this.active != true) {
        this.viewer.elements.window.removeClass("DV-annotationActivated");
        this.annotationEl.removeClass("DV-annotationHover")
    }
};
DV.Annotation.prototype.showEdit = function () {
    this.annotationEl.addClass("DV-editing");
    this.viewer.$(".DV-annotationTitleInput", this.annotationEl).focus()
};
DV.Annotation.prototype.remove = function () {
    DV.jQuery("#DV-annotation-" + this.id).remove()
};
DV.DragReporter = function (d, a, c, b) {
    this.viewer = d;
    this.dragClassName = "DV-dragging";
    this.sensitivityY = 1;
    this.sensitivityX = 1;
    this.oldPageY = 0;
    _.extend(this, b);
    this.dispatcher = c;
    this.toWatch = this.viewer.$(a);
    this.boundReporter = _.bind(this.mouseMoveReporter, this);
    this.boundMouseUpReporter = _.bind(this.mouseUpReporter, this);
    this.boundMouseDownReporter = _.bind(this.mouseDownReporter, this);
    this.setBinding()
};
DV.DragReporter.prototype.shouldIgnore = function (b) {
    if (!this.ignoreSelector) {
        return false
    }
    var a = this.viewer.$(b.target);
    return a.parents().is(this.ignoreSelector) || a.is(this.ignoreSelector)
};
DV.DragReporter.prototype.mouseUpReporter = function (a) {
    if (this.shouldIgnore(a)) {
        return true
    }
    a.preventDefault();
    clearInterval(this.updateTimer);
    this.stop()
};
DV.DragReporter.prototype.oldPositionUpdater = function () {
    this.oldPageY = this.pageY
};
DV.DragReporter.prototype.stop = function () {
    this.toWatch.removeClass(this.dragClassName);
    this.toWatch.unbind("mousemove")
};
DV.DragReporter.prototype.setBinding = function () {
    this.toWatch.mouseup(this.boundMouseUpReporter);
    this.toWatch.mousedown(this.boundMouseDownReporter)
};
DV.DragReporter.prototype.unBind = function () {
    this.toWatch.unbind("mouseup", this.boundMouseUpReporter);
    this.toWatch.unbind("mousedown", this.boundMouseDownReporter)
};
DV.DragReporter.prototype.destroy = function () {
    this.unBind();
    this.toWatch = null
};
DV.DragReporter.prototype.mouseDownReporter = function (a) {
    if (this.shouldIgnore(a)) {
        return true
    }
    a.preventDefault();
    this.pageY = a.pageY;
    this.pageX = a.pageX;
    this.oldPageY = a.pageY;
    this.updateTimer = setInterval(_.bind(this.oldPositionUpdater, this), 1200);
    this.toWatch.addClass(this.dragClassName);
    this.toWatch.mousemove(this.boundReporter)
};
DV.DragReporter.prototype.mouseMoveReporter = function (f) {
    if (this.shouldIgnore(f)) {
        return true
    }
    f.preventDefault();
    var b = Math.round(this.sensitivityX * (this.pageX - f.pageX));
    var a = Math.round(this.sensitivityY * (this.pageY - f.pageY));
    var d = (b > 0) ? "right" : "left";
    var c = (a > 0) ? "down" : "up";
    this.pageY = f.pageY;
    this.pageX = f.pageX;
    if (a === 0 && b === 0) {
        return
    }
    this.dispatcher({
        event: f,
        deltaX: b,
        deltaY: a,
        directionX: d,
        directionY: c
    })
};
DV.Elements = function (d) {
    this._viewer = d;
    var c = DV.Schema.elements;
    for (var b = 0, a = c.length; b < a; b++) {
        this.getElement(c[b])
    }
};
DV.Elements.prototype.getElement = function (b, a) {
    this[b.name] = this._viewer.$(b.query)
};
DV.History = function (a) {
    this.viewer = a;
    DV.History.count++;
    this.URL_CHECK_INTERVAL = 500;
    this.USE_IFRAME = DV.jQuery.browser.msie && DV.jQuery.browser.version < "8.0";
    this.handlers = [];
    this.defaultCallback = null;
    this.hash = window.location.hash;
    _.bindAll(this, "checkURL");
    if (DV.History.count > 1) {
        return
    }
    DV.jQuery(_.bind(function () {
        if (this.USE_IFRAME) {
            this.iframe = DV.jQuery('<iframe src="javascript:0"/>').hide().appendTo("body")[0].contentWindow
        }
        if ("onhashchange" in window) {
            window.onhashchange = this.checkURL
        } else {
            setInterval(this.checkURL, this.URL_CHECK_INTERVAL)
        }
    }, this))
};
DV.History.count = 0;
DV.History.prototype = {
    register: function (a, b) {
        this.handlers.push({
            matcher: a,
            callback: b
        })
    },
    save: function (a) {
        if (DV.History.count > 1) {
            return
        }
        window.location.hash = this.hash = (a ? "#" + a : "");
        if (this.USE_IFRAME && (this.iframe && (this.hash != this.iframe.location.hash))) {
            this.iframe.document.open().close();
            this.iframe.location.hash = this.hash
        }
    },
    checkURL: function () {
        if (DV.History.count > 1) {
            return
        }
        try {
            var b = (this.USE_IFRAME ? this.iframe : window).location.hash
        } catch (a) {}
        if (!b || b == this.hash || "#" + b == this.hash || b == decodeURIComponent(this.hash)) {
            return false
        }
        if (this.USE_IFRAME) {
            window.location.hash = b
        }
        this.loadURL(true)
    },
    loadURL: function (c) {
        var d = this.hash = window.location.hash;
        for (var b = this.handlers.length - 1; b >= 0; b--) {
            var a = d.match(this.handlers[b].matcher);
            if (a) {
                if (c === true) {
                    this.handlers[b].callback.apply(this.handlers[b].callback, a.slice(1, a.length))
                }
                return true
            }
        }
        if (this.defaultCallback != null && c === true) {
            this.defaultCallback()
        } else {
            return false
        }
    }
};
DV.Page = function (d, c) {
    this.viewer = d;
    this.index = c.index;
    for (var b in c) {
        this[b] = c[b]
    }
    this.el = this.viewer.$(this.el);
    this.parent = this.el.parent();
    this.pageNumberEl = this.el.find("span.DV-pageNumber");
    this.pageInsertEl = this.el.find(".DV-pageNoteInsert");
    this.removedOverlayEl = this.el.find(".DV-overlay");
    this.pageImageEl = this.getPageImage();
    this.pageEl = this.el.find("div.DV-page");
    this.annotationContainerEl = this.el.find("div.DV-annotations");
    this.coverEl = this.el.find("div.DV-cover");
    this.loadTimer = null;
    this.hasLayerPage = false;
    this.hasLayerRegional = false;
    this.imgSource = null;
    this.offset = null;
    this.pageNumber = null;
    this.zoom = 1;
    this.annotations = [];
    var a = this.viewer.models;
    this.model_document = a.document;
    this.model_pages = a.pages;
    this.model_annotations = a.annotations;
    this.model_chapters = a.chapters
};
DV.Page.prototype.setPageImage = function () {
    this.pageImageEl = this.getPageImage()
};
DV.Page.prototype.getPageImage = function () {
    return this.el.find("img.DV-pageImage")
};
DV.Page.prototype.getOffset = function () {
    return this.model_document.offsets[this.index]
};
DV.Page.prototype.getPageNoteHeight = function () {
    return this.model_pages.pageNoteHeights[this.index]
};
DV.Page.prototype.draw = function (d) {
    if (this.index === d.index && !d.force && this.imgSource == this.model_pages.imageURL(this.index)) {
        return
    }
    this.index = (d.force === true) ? this.index : d.index;
    var j = [];
    var a = this.model_pages.imageURL(this.index);
    this.el[0].className = this.el[0].className.replace(/\s*DV-page-\d+/, "") + " DV-page-" + (this.index + 1);
    if (this.imgSource != a) {
        this.imgSource = a;
        this.loadImage()
    }
    this.sizeImage();
    this.position();
    if (this.pageNumber != this.index + 1 || d.forceAnnotationRedraw === true) {
        for (var e = 0; e < this.annotations.length; e++) {
            this.annotations[e].remove();
            delete this.annotations[e];
            this.hasLayerRegional = false;
            this.hasLayerPage = false
        }
        this.annotations = [];
        var h = this.model_annotations.byPage[this.index];
        if (h) {
            for (var e = 0; e < h.length; e++) {
                var g = h[e];
                if (g.id === this.viewer.annotationToLoadId) {
                    var c = true;
                    if (g.id === this.viewer.annotationToLoadEdit) {
                        d.edit = true
                    }
                    if (this.viewer.openingAnnotationFromHash) {
                        this.viewer.helpers.jump(this.index, (g.top || 0) - 37);
                        this.viewer.openingAnnotationFromHash = false
                    }
                } else {
                    var c = false
                } if (g.type == "page") {
                    this.hasLayerPage = true
                } else {
                    if (g.type == "regional") {
                        this.hasLayerRegional = true
                    }
                }
                var f = this.viewer.$(".DV-allAnnotations .DV-annotation[rel=aid-" + g.id + "]").clone();
                f.attr("id", "DV-annotation-" + g.id);
                f.find(".DV-img").each(function () {
                    var i = DV.jQuery(this);
                    i.attr("src", i.attr("data-src"))
                });
                var b = new DV.Annotation({
                    renderedHTML: f,
                    id: g.id,
                    page: this,
                    pageEl: this.pageEl,
                    annotationContainerEl: this.annotationContainerEl,
                    pageNumber: this.pageNumber,
                    state: "collapsed",
                    top: g.y1,
                    left: g.x1,
                    width: g.x1 + g.x2,
                    height: g.y1 + g.y2,
                    active: c,
                    showEdit: d.edit,
                    type: g.type
                });
                this.annotations.push(b)
            }
        }
        this.pageInsertEl.toggleClass("visible", !this.hasLayerPage);
        this.renderMeta({
            pageNumber: this.index + 1
        });
        this.drawRemoveOverlay()
    }
    this.setPageType()
};
DV.Page.prototype.drawRemoveOverlay = function () {
    this.removedOverlayEl.toggleClass("visible", !!this.viewer.models.removedPages[this.index + 1])
};
DV.Page.prototype.setPageType = function () {
    if (this.annotations.length > 0) {
        if (this.hasLayerPage === true) {
            this.el.addClass("DV-layer-page")
        }
        if (this.hasLayerRegional === true) {
            this.el.addClass("DV-layer-page")
        }
    } else {
        this.el.removeClass("DV-layer-page DV-layer-regional")
    }
};
DV.Page.prototype.position = function (a) {
    this.el.css({
        top: this.model_document.offsets[this.index]
    });
    this.offset = this.getOffset()
};
DV.Page.prototype.renderMeta = function (a) {
    this.pageNumberEl.text("p. " + a.pageNumber);
    this.pageNumber = a.pageNumber
};
DV.Page.prototype.loadImage = function (c) {
    if (this.loadTimer) {
        clearTimeout(this.loadTimer);
        delete this.loadTimer
    }
    this.el.removeClass("DV-loaded").addClass("DV-loading");
    var a = this.model_pages;
    var b = DV.jQuery(new Image);
    var d = this;
    var e = function () {
        if (d.loadTimer) {
            clearTimeout(d.loadTimer);
            delete d.loadTimer
        }
        b.bind("load readystatechange", function (g) {
            if (this.complete || (this.readyState == "complete" && g.type == "readystatechange")) {
                if (b != d._currentLoader) {
                    return
                }
                a.updateHeight(b[0], d.index);
                d.drawImage(b[0].src);
                clearTimeout(d.loadTimer);
                delete d.loadTimer
            }
        });
        var f = d.model_pages.imageURL(d.index);
        d._currentLoader = b;
        b[0].src = f
    };
    this.loadTimer = setTimeout(e, 150);
    this.viewer.pageSet.redraw()
};
DV.Page.prototype.sizeImage = function () {
    var b = this.model_pages.width;
    var a = this.model_pages.getPageHeight(this.index);
    this.coverEl.css({
        width: b,
        height: a
    });
    this.pageImageEl.css({
        width: b,
        height: a
    });
    this.el.css({
        height: a,
        width: b
    });
    this.pageEl.css({
        height: a,
        width: b
    })
};
DV.Page.prototype.drawImage = function (b) {
    var a = this.model_pages.getPageHeight(this.index);
    if (b == this.pageImageEl.attr("src") && a == this.pageImageEl.attr("height")) {
        this.el.addClass("DV-loaded").removeClass("DV-loading");
        return
    }
    this.pageImageEl.replaceWith('<img width="' + this.model_pages.width + '" height="' + a + '" class="DV-pageImage" src="' + b + '" />');
    this.setPageImage();
    this.sizeImage();
    this.el.addClass("DV-loaded").removeClass("DV-loading")
};
DV.PageSet = function (a) {
    this.currentPage = null;
    this.pages = {};
    this.viewer = a;
    this.zoomText()
};
DV.PageSet.prototype.execute = function (a, b) {
    this.pages.each(function (c) {
        c[a].apply(c, b)
    })
};
DV.PageSet.prototype.buildPages = function (b) {
    b = b || {};
    var a = this.getPages();
    for (var c = 0; c < a.length; c++) {
        var d = a[c];
        d.set = this;
        d.index = c;
        this.pages[d.label] = new DV.Page(this.viewer, d);
        if (d.currentPage == true) {
            this.currentPage = this.pages[d.label]
        }
    }
    this.viewer.models.annotations.renderAnnotations()
};
DV.PageSet.prototype.getPages = function () {
    var a = [];
    this.viewer.elements.sets.each(function (d, c) {
        var b = (d == 0) ? true : false;
        a.push({
            label: "p" + d,
            el: c,
            index: d,
            pageNumber: d + 1,
            currentPage: b
        })
    });
    return a
};
DV.PageSet.prototype.reflowPages = function () {
    this.viewer.models.pages.resize();
    this.viewer.helpers.setActiveAnnotationLimits();
    this.redraw(false, true)
};
DV.PageSet.prototype.simpleReflowPages = function () {
    this.viewer.helpers.setActiveAnnotationLimits();
    this.redraw(false, false)
};
DV.PageSet.prototype.cleanUp = function () {
    if (this.viewer.activeAnnotation) {
        this.viewer.activeAnnotation.hide(true)
    }
};
DV.PageSet.prototype.zoom = function (d) {
    if (this.viewer.models.document.zoomLevel === d.zoomLevel) {
        return
    }
    var e = this.viewer.models.document.currentIndex();
    var c = this.viewer.models.document.offsets[e];
    var j = this.viewer.models.document.zoomLevel * 1;
    var f = d.zoomLevel / j;
    var b = this.viewer.elements.window.scrollTop();
    this.viewer.models.document.zoom(d.zoomLevel);
    var h = (parseInt(b, 10) > parseInt(c, 10)) ? b - c : c - b;
    var a = h / this.viewer.models.pages.height;
    this.reflowPages();
    this.zoomText();
    if (this.viewer.state === "ViewThumbnails") {
        this.viewer.thumbnails.setZoom(d.zoomLevel);
        this.viewer.thumbnails.lazyloadThumbnails()
    }
    if (this.viewer.state === "ViewDocument") {
        this.viewer.$(".DV-annotationRegion.DV-accessRedact").each(function () {
            var k = DV.jQuery(this);
            k.css({
                top: Math.round(k.position().top * f),
                left: Math.round(k.position().left * f),
                width: Math.round(k.width() * f),
                height: Math.round(k.height() * f)
            })
        })
    }
    if (this.viewer.activeAnnotation != null) {
        var g = {
            index: this.viewer.models.document.currentIndex(),
            top: this.viewer.activeAnnotation.top,
            id: this.viewer.activeAnnotation.id
        };
        this.viewer.activeAnnotation = null;
        this.showAnnotation(g);
        this.viewer.helpers.setActiveAnnotationLimits(this.viewer.activeAnnotation)
    } else {
        var i = Math.round(this.viewer.models.pages.height * a);
        this.viewer.helpers.jump(this.viewer.models.document.currentIndex(), i)
    }
};
DV.PageSet.prototype.zoomText = function () {
    var b = this.viewer.models.pages.getPadding();
    var a = this.viewer.models.pages.zoomLevel;
    this.viewer.$(".DV-textContents").width(a - b);
    this.viewer.$(".DV-textPage").width(a);
    this.viewer.elements.collection.css({
        width: a + b
    })
};
DV.PageSet.prototype.draw = function (a) {
    for (var c = 0, b = a.length; c < b; c++) {
        var d = this.pages[a[c].label];
        if (d) {
            d.draw({
                index: a[c].index,
                pageNumber: a[c].index + 1
            })
        }
    }
};
DV.PageSet.prototype.redraw = function (a, b) {
    if (this.pages.p0) {
        this.pages.p0.draw({
            force: true,
            forceAnnotationRedraw: b
        })
    }
    if (this.pages.p1) {
        this.pages.p1.draw({
            force: true,
            forceAnnotationRedraw: b
        })
    }
    if (this.pages.p2) {
        this.pages.p2.draw({
            force: true,
            forceAnnotationRedraw: b
        })
    }
    if (b && this.viewer.activeAnnotation) {
        this.viewer.helpers.jump(this.viewer.activeAnnotation.page.index, this.viewer.activeAnnotation.position.top - 37)
    }
};
DV.PageSet.prototype.setActiveAnnotation = function (b, a) {
    this.viewer.annotationToLoadId = b;
    this.viewer.annotationToLoadEdit = a ? b : null
};
DV.PageSet.prototype.showAnnotation = function (d, b) {
    b = b || {};
    if (this.viewer.state === "ViewAnnotation") {
        var f = this.viewer.$(".DV-allAnnotations div[rel=aid-" + d.id + "]")[0].offsetTop;
        this.viewer.elements.window.scrollTop(f + 10, "fast");
        this.viewer.helpers.setActiveAnnotationInNav(d.id);
        this.viewer.activeAnnotationId = d.id;
        return
    } else {
        this.viewer.helpers.removeObserver("trackAnnotation");
        this.viewer.activeAnnotationId = null;
        if (this.viewer.activeAnnotation != null) {
            this.viewer.activeAnnotation.hide()
        }
        this.setActiveAnnotation(d.id, b.edit);
        var e = this.viewer.models.annotations.byId[d.id].type == "page";
        var a = e ? -7 : 36;
        var f = d.top - a;
        for (var c = 0; c <= 2; c++) {
            if (this.pages["p" + c]) {
                for (var g = 0; g < this.pages["p" + c].annotations.length; g++) {
                    if (this.pages["p" + c].annotations[g].id === d.id) {
                        this.viewer.helpers.jump(d.index, f);
                        this.pages["p" + c].annotations[g].show(b);
                        return
                    }
                }
            }
        }
        this.viewer.helpers.jump(d.index, f)
    }
};
DV.Thumbnails = function (a) {
    this.currentIndex = 0;
    this.zoomLevel = null;
    this.scrollTimer = null;
    this.imageUrl = a.schema.document.resources.page.image.replace(/\{size\}/, "small");
    this.pageCount = a.schema.document.pages;
    this.viewer = a;
    this.resizeId = _.uniqueId();
    this.sizes = {
        "0": {
            w: 60,
            h: 75
        },
        "1": {
            w: 90,
            h: 112
        },
        "2": {
            w: 120,
            h: 150
        },
        "3": {
            w: 150,
            h: 188
        },
        "4": {
            w: 180,
            h: 225
        }
    };
    _.bindAll(this, "lazyloadThumbnails", "loadThumbnails")
};
DV.Thumbnails.prototype.render = function () {
    this.el = this.viewer.$(".DV-thumbnails");
    this.getCurrentIndex();
    this.getZoom();
    this.buildThumbnails(1, this.pageCount);
    this.setZoom();
    this.viewer.elements.window.unbind("scroll.thumbnails").bind("scroll.thumbnails", this.lazyloadThumbnails);
    var a = "resize.thumbnails-" + this.resizeId;
    DV.jQuery(window).unbind(a).bind(a, this.lazyloadThumbnails)
};
DV.Thumbnails.prototype.buildThumbnails = function (b, a) {
    if (b == 1) {
        this.el.empty()
    }
    var c = JST.thumbnails({
        page: b,
        endPage: a,
        zoom: this.zoomLevel,
        imageUrl: this.imageUrl
    });
    this.el.html(this.el.html() + c);
    this.highlightCurrentPage();
    _.defer(this.loadThumbnails)
};
DV.Thumbnails.prototype.getCurrentIndex = function () {
    this.currentIndex = this.viewer.models.document.currentIndex()
};
DV.Thumbnails.prototype.highlightCurrentPage = function () {
    this.currentIndex = this.viewer.models.document.currentIndex();
    this.viewer.$(".DV-thumbnail.DV-selected").removeClass("DV-selected");
    var b = this.viewer.$(".DV-thumbnail:eq(" + this.currentIndex + ")");
    if (b.length) {
        b.addClass("DV-selected");
        var a = this.viewer.$(".DV-pages");
        a.scrollTop(a.scrollTop() + b.position().top - 12)
    }
};
DV.Thumbnails.prototype.setZoom = function (b) {
    this.getZoom(b);
    var a = this.sizes[this.zoomLevel];
    this.viewer.$(".DV-hasHeight").each(function (c) {
        var d = a.w / this.width;
        DV.jQuery(this).css({
            height: this.height * d
        })
    });
    this.viewer.$(".DV-hasWidth").each(function (c) {
        var d = a.h / this.height;
        var e = DV.jQuery(this);
        e.add(e.prev(".DV-thumbnail-shadow")).css({
            width: this.width * d
        })
    });
    this.el[0].className = this.el[0].className.replace(/DV-zoom-\d\s*/, "");
    this.el.addClass("DV-zoom-" + this.zoomLevel)
};
DV.Thumbnails.prototype.getZoom = function (a) {
    if (a != null) {
        return this.zoomLevel = _.indexOf(this.viewer.models.document.ZOOM_RANGES, a)
    } else {
        return this.zoomLevel = this.viewer.slider.slider("value")
    }
};
DV.Thumbnails.prototype.setImageSize = function (f, g) {
    var c = this.sizes[this.zoomLevel];
    var d = c.w / f.width;
    var a = f.height * d;
    if (Math.abs(c.h - a) > 10 || (/DV-has/).test(g[0].className)) {
        if (a < c.h) {
            g.addClass("DV-hasHeight").css({
                height: a
            })
        } else {
            var b = a / c.h;
            var e = c.w / b;
            g.add(g.prev(".DV-thumbnail-shadow")).addClass("DV-hasWidth").css({
                width: e
            })
        }
    }
    g.attr({
        src: f.src
    })
};
DV.Thumbnails.prototype.lazyloadThumbnails = function () {
    if (this.viewer.state != "ViewThumbnails") {
        return
    }
    if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
    }
    this.scrollTimer = setTimeout(this.loadThumbnails, 100)
};
DV.Thumbnails.prototype.loadThumbnails = function () {
    var e = this.viewer;
    var b = e.$(".DV-thumbnails").width();
    var k = e.elements.window.height();
    var d = e.elements.window.scrollTop();
    var a = d + k;
    var f = e.$(".DV-thumbnail:first-child");
    var c = f.outerHeight(true);
    var h = f.outerWidth(true);
    var i = Math.floor(b / h);
    var g = Math.floor(d / c * i);
    var j = Math.ceil(a / c * i);
    g -= (g % i) + 1;
    j += i - (j % i);
    this.loadImages(g, j)
};
DV.Thumbnails.prototype.loadImages = function (e, c) {
    var d = this;
    var f = this.viewer;
    var b = e > 0 ? ":gt(" + e + ")" : "";
    var a = c <= this.pageCount ? ":lt(" + c + ")" : "";
    f.$(".DV-thumbnail" + a + b).each(function (g) {
        var h = f.$(this);
        if (!h.attr("src")) {
            var k = f.$(".DV-thumbnail-image", h);
            var j = new Image();
            DV.jQuery(j).bind("load", _.bind(d.setImageSize, d, j, k)).attr({
                src: k.attr("data-src")
            })
        }
    })
};
DV.Schema = function () {
    this.models = {};
    this.views = {};
    this.states = {};
    this.helpers = {};
    this.events = {};
    this.elements = {};
    this.text = {};
    this.data = {
        zoomLevel: 700,
        pageWidthPadding: 20,
        additionalPaddingOnPage: 30,
        state: {
            page: {
                previous: 0,
                current: 0,
                next: 1
            }
        }
    }
};
DV.Schema.prototype.importCanonicalDocument = function (a) {
    _.uniqueId();
    a.sections = _.sortBy(a.sections || [], function (b) {
        return b.page
    });
    a.annotations = a.annotations || [];
    a.canonicalURL = a.canonical_url;
    this.document = DV.jQuery.extend(true, {}, a);
    this.data.title = a.title;
    this.data.totalPages = a.pages;
    this.data.totalAnnotations = a.annotations.length;
    this.data.sections = a.sections;
    this.data.chapters = [];
    this.data.annotationsById = {};
    this.data.annotationsByPage = {};
    _.each(a.annotations, DV.jQuery.proxy(this.loadAnnotation, this))
};
DV.Schema.prototype.loadAnnotation = function (b) {
    if (b.id) {
        b.server_id = b.id
    }
    var a = b.page - 1;
    b.id = b.id || _.uniqueId();
    b.title = b.title || "Untitled Note";
    b.text = b.content || "";
    b.access = b.access || "public";
    b.type = b.location && b.location.image ? "region" : "page";
    if (b.type === "region") {
        var e = DV.jQuery.map(b.location.image.split(","), function (g, f) {
            return parseInt(g, 10)
        });
        b.y1 = e[0];
        b.x2 = e[1];
        b.y2 = e[2];
        b.x1 = e[3]
    } else {
        if (b.type === "page") {
            b.y1 = 0;
            b.x2 = 0;
            b.y2 = 0;
            b.x1 = 0
        }
    }
    this.data.annotationsById[b.id] = b;
    var d = this.data.annotationsByPage[a] = this.data.annotationsByPage[a] || [];
    var c = _.sortedIndex(d, b, function (f) {
        return f.y1
    });
    d.splice(c, 0, b);
    return b
};
DV.Schema.elements = [{
    name: "browserDocument",
    query: document
}, {
    name: "browserWindow",
    query: window
}, {
    name: "header",
    query: "div.DV-header"
}, {
    name: "viewer",
    query: "div.DV-docViewer"
}, {
    name: "window",
    query: "div.DV-pages"
}, {
    name: "sets",
    query: "div.DV-set"
}, {
    name: "pages",
    query: "div.DV-page"
}, {
    name: "metas",
    query: "div.DV-pageMeta"
}, {
    name: "bar",
    query: "div.DV-bar"
}, {
    name: "currentPage",
    query: "span.DV-currentPage"
}, {
    name: "well",
    query: "div.DV-well"
}, {
    name: "collection",
    query: "div.DV-pageCollection"
}, {
    name: "annotations",
    query: "div.DV-allAnnotations"
}, {
    name: "navigation",
    query: "div.DV-navigation"
}, {
    name: "chaptersContainer",
    query: "div.DV-chaptersContainer"
}, {
    name: "searchInput",
    query: "input.DV-searchInput"
}, {
    name: "textCurrentPage",
    query: "span.DV-textCurrentPage"
}, {
    name: "coverPages",
    query: "div.DV-cover"
}, {
    name: "fullscreen",
    query: "div.DV-fullscreen"
}];
DV.model.Annotations = function (a) {
    this.LEFT_MARGIN = 25;
    this.PAGE_NOTE_FUDGE = window.dc && dc.account && (dc.account.isOwner || dc.account.isReviewer) ? 46 : 26;
    this.viewer = a;
    this.offsetsAdjustments = [];
    this.offsetAdjustmentSum = 0;
    this.saveCallbacks = [];
    this.deleteCallbacks = [];
    this.byId = this.viewer.schema.data.annotationsById;
    this.byPage = this.viewer.schema.data.annotationsByPage;
    this.bySortOrder = this.sortAnnotations()
};
DV.model.Annotations.prototype = {
    render: function (e) {
        var c = this.viewer.models.document;
        var d = this.viewer.models.pages;
        var i = d.zoomFactor();
        var j = e;
        var b, a, g, f;
        if (j.type === "page") {
            b = a = g = f = 0;
            j.top = 0
        } else {
            g = Math.round(j.y1 * i);
            f = Math.round(j.y2 * i);
            if (b < this.LEFT_MARGIN) {
                b = this.LEFT_MARGIN
            }
            b = Math.round(j.x1 * i);
            a = Math.round(j.x2 * i);
            j.top = g - 5
        }
        j.owns_note = j.owns_note || false;
        j.width = d.width;
        j.pageNumber = j.page;
        j.author = j.author || "";
        j.author_organization = j.author_organization || "";
        j.bgWidth = j.width;
        j.bWidth = j.width - 16;
        j.excerptWidth = (a - b) - 8;
        j.excerptMarginLeft = b - 3;
        j.excerptHeight = f - g;
        j.index = j.page - 1;
        j.image = d.imageURL(j.index);
        j.imageTop = g + 1;
        j.tabTop = (g < 35 ? 35 - g : 0) + 8;
        j.imageWidth = d.width;
        j.imageHeight = Math.round(d.height * i);
        j.regionLeft = b;
        j.regionWidth = a - b;
        j.regionHeight = f - g;
        j.excerptDSHeight = j.excerptHeight - 6;
        j.DSOffset = 3;
        if (j.access == "public") {
            j.accessClass = "DV-accessPublic"
        } else {
            if (j.access == "exclusive") {
                j.accessClass = "DV-accessExclusive"
            } else {
                if (j.access == "private") {
                    j.accessClass = "DV-accessPrivate"
                }
            }
        }
        j.orderClass = "";
        j.options = this.viewer.options;
        if (j.position == 1) {
            j.orderClass += " DV-firstAnnotation"
        }
        if (j.position == this.bySortOrder.length) {
            j.orderClass += " DV-lastAnnotation"
        }
        var h = (j.type === "page") ? "pageAnnotation" : "annotation";
        return JST[h](j)
    },
    sortAnnotations: function () {
        return this.bySortOrder = _.sortBy(_.values(this.byId), function (a) {
            return a.page * 10000 + a.y1
        })
    },
    renderAnnotations: function () {
        if (this.viewer.options.showAnnotations === false) {
            return
        }
        for (var b = 0; b < this.bySortOrder.length; b++) {
            var a = this.bySortOrder[b];
            a.of = _.indexOf(this.byPage[a.page - 1], a);
            a.position = b + 1;
            a.html = this.render(a)
        }
        this.renderAnnotationsByIndex()
    },
    renderAnnotationsByIndex: function () {
        var b = _.map(this.bySortOrder, function (c) {
            return c.html
        });
        var a = b.join("").replace(/class="DV-img" src="/g, 'class="DV-img" data-src="').replace(/id="DV-annotation-(\d+)"/g, function (c, d) {
            return 'id="DV-listAnnotation-' + d + '" rel="aid-' + d + '"'
        });
        this.viewer.$("div.DV-allAnnotations").html(a);
        this.renderAnnotationsByIndex.rendered = true;
        this.renderAnnotationsByIndex.zoomLevel = this.zoomLevel;
        this.updateAnnotationOffsets();
        _.defer(_.bind(this.updateAnnotationOffsets, this))
    },
    refreshAnnotation: function (a) {
        var b = this.viewer;
        a.html = this.render(a);
        DV.jQuery.$("#DV-annotation-" + a.id).replaceWith(a.html)
    },
    removeAnnotation: function (b) {
        delete this.byId[b.id];
        var a = b.page - 1;
        this.byPage[a] = _.without(this.byPage[a], b);
        this.sortAnnotations();
        DV.jQuery("#DV-annotation-" + b.id + ", #DV-listAnnotation-" + b.id).remove();
        this.viewer.api.redraw(true);
        if (_.isEmpty(this.byId)) {
            this.viewer.open("ViewDocument")
        }
    },
    updateAnnotationOffsets: function () {
        this.offsetsAdjustments = [];
        this.offsetAdjustmentSum = 0;
        var a = this.viewer.models.document;
        var b = this.viewer.$("div.DV-allAnnotations");
        var g = b.find(".DV-pageNote");
        var c = this.viewer.models.pages.pageNoteHeights;
        var f = this;
        if (this.viewer.$("div.DV-docViewer").hasClass("DV-viewAnnotations") == false) {
            b.addClass("DV-getHeights")
        }
        var h = [];
        _.each(_.select(this.bySortOrder, function (i) {
            return i.type == "page"
        }), function (l, k) {
            l.el = g[k];
            h[l.pageNumber] = l
        });
        for (var d = 0, e = a.totalPages; d <= e; d++) {
            c[d] = 0;
            if (h[d]) {
                var j = (this.viewer.$(h[d].el).height() + this.PAGE_NOTE_FUDGE);
                c[d - 1] = j;
                this.offsetAdjustmentSum += j
            }
            this.offsetsAdjustments[d] = this.offsetAdjustmentSum
        }
        b.removeClass("DV-getHeights")
    },
    fireSaveCallbacks: function (a) {
        _.each(this.saveCallbacks, function (b) {
            b(a)
        })
    },
    fireDeleteCallbacks: function (a) {
        _.each(this.deleteCallbacks, function (b) {
            b(a)
        })
    },
    getAnnotations: function (a) {
        return this.byPage[a]
    },
    getFirstAnnotation: function () {
        return _.first(this.bySortOrder)
    },
    getNextAnnotation: function (a) {
        var b = this.byId[a];
        return this.bySortOrder[_.indexOf(this.bySortOrder, b) + 1]
    },
    getPreviousAnnotation: function (a) {
        var b = this.byId[a];
        return this.bySortOrder[_.indexOf(this.bySortOrder, b) - 1]
    },
    getAnnotation: function (a) {
        if (a.id) {
            return this.byId[a.id]
        }
        if (a.index && !a.id) {
            throw new Error("looked up an annotation without an id")
        }
        return this.byId[a]
    }
};
DV.model.Chapters = function (a) {
    this.viewer = a;
    this.loadChapters()
};
DV.model.Chapters.prototype = {
    loadChapters: function () {
        var g = this.viewer.schema.data.sections;
        var c = this.chapters = this.viewer.schema.data.chapters = [];
        _.each(g, function (h) {
            h.id || (h.id = _.uniqueId())
        });
        var e = 0;
        for (var b = 0, a = this.viewer.schema.data.totalPages; b < a; b++) {
            var d = g[e];
            var f = g[e + 1];
            if (f && (b >= (f.page - 1))) {
                e += 1;
                d = f
            }
            if (d && !(d.page > b + 1)) {
                c[b] = d.id
            }
        }
    },
    getChapterId: function (a) {
        return this.chapters[a]
    },
    getChapterPosition: function (c) {
        for (var b = 0, a = this.chapters.length; b < a; b++) {
            if (this.chapters[b] === c) {
                return b
            }
        }
    }
};
DV.model.Document = function (d) {
    this.viewer = d;
    this.currentPageIndex = 0;
    this.offsets = [];
    this.baseHeightsPortion = [];
    this.baseHeightsPortionOffsets = [];
    this.paddedOffsets = [];
    this.originalPageText = {};
    this.totalDocumentHeight = 0;
    this.totalPages = 0;
    this.additionalPaddingOnPage = 0;
    this.ZOOM_RANGES = [500, 700, 800, 900, 1000];
    var c = this.viewer.schema.data;
    this.state = c.state;
    this.baseImageURL = c.baseImageURL;
    this.canonicalURL = c.canonicalURL;
    this.additionalPaddingOnPage = c.additionalPaddingOnPage;
    this.pageWidthPadding = c.pageWidthPadding;
    this.totalPages = c.totalPages;
    this.onPageChangeCallbacks = [];
    var b = this.zoomLevel = this.viewer.options.zoom || c.zoomLevel;
    if (b == "auto") {
        this.zoomLevel = c.zoomLevel
    }
    var a = _.last(this.ZOOM_RANGES);
    if (this.zoomLevel > a) {
        this.zoomLevel = a
    }
};
DV.model.Document.prototype = {
    setPageIndex: function (a) {
        this.currentPageIndex = a;
        this.viewer.elements.currentPage.text(this.currentPage());
        this.viewer.helpers.setActiveChapter(this.viewer.models.chapters.getChapterId(a));
        _.each(this.onPageChangeCallbacks, function (b) {
            b()
        });
        return a
    },
    currentPage: function () {
        return this.currentPageIndex + 1
    },
    currentIndex: function () {
        return this.currentPageIndex
    },
    nextPage: function () {
        var a = this.currentIndex() + 1;
        if (a >= this.totalPages) {
            return this.currentIndex()
        }
        return this.setPageIndex(a)
    },
    previousPage: function () {
        var a = this.currentIndex() - 1;
        if (a < 0) {
            return this.currentIndex()
        }
        return this.setPageIndex(a)
    },
    zoom: function (b, a) {
        if (this.zoomLevel != b || a === true) {
            this.zoomLevel = b;
            this.viewer.models.pages.resize(this.zoomLevel);
            this.viewer.models.annotations.renderAnnotations();
            this.computeOffsets()
        }
    },
    computeOffsets: function () {
        var m = this.viewer.models.annotations;
        var j = 0;
        var f = 0;
        var e = this.totalPages;
        var k = 0;
        var a = this.viewer.elements.window[0].scrollTop;
        for (var c = 0; c < e; c++) {
            if (m.offsetsAdjustments[c]) {
                f = m.offsetsAdjustments[c]
            }
            var b = this.viewer.models.pages.getPageHeight(c);
            var g = this.offsets[c] || 0;
            var d = this.offsets[c] = f + j;
            if ((g !== d) && (d < a)) {
                var l = d - g - k;
                a += l;
                k += l
            }
            this.baseHeightsPortion[c] = Math.round((b + this.additionalPaddingOnPage) / 3);
            this.baseHeightsPortionOffsets[c] = (c == 0) ? 0 : d - this.baseHeightsPortion[c];
            j += (b + this.additionalPaddingOnPage)
        }
        j += f;
        if (j != this.totalDocumentHeight) {
            k = (this.totalDocumentHeight != 0) ? k : j - this.totalDocumentHeight;
            this.viewer.helpers.setDocHeight(j, k);
            this.totalDocumentHeight = j
        }
    },
    getOffset: function (a) {
        return this.offsets[a]
    },
    resetRemovedPages: function () {
        this.viewer.models.removedPages = {}
    },
    addPageToRemovedPages: function (a) {
        this.viewer.models.removedPages[a] = true
    },
    removePageFromRemovedPages: function (a) {
        this.viewer.models.removedPages[a] = false
    },
    redrawPages: function () {
        _.each(this.viewer.pageSet.pages, function (a) {
            a.drawRemoveOverlay()
        });
        if (this.viewer.thumbnails) {
            this.viewer.thumbnails.render()
        }
    },
    redrawReorderedPages: function () {
        if (this.viewer.thumbnails) {
            this.viewer.thumbnails.render()
        }
    }
};
DV.model.Pages = function (a) {
    this.viewer = a;
    this.averageHeight = 0;
    this.pageHeights = [];
    this.pageNoteHeights = [];
    this.BASE_WIDTH = 700;
    this.BASE_HEIGHT = 906;
    this.SCALE_FACTORS = {
        "500": 0.714,
        "700": 1,
        "800": 0.8,
        "900": 0.9,
        "1000": 1
    };
    this.DEFAULT_PADDING = 100;
    this.REDUCED_PADDING = 44;
    this.MINI_PADDING = 18;
    this.zoomLevel = this.viewer.models.document.zoomLevel;
    this.baseWidth = this.BASE_WIDTH;
    this.baseHeight = this.BASE_HEIGHT;
    this.width = this.zoomLevel;
    this.height = this.baseHeight * this.zoomFactor();
    this.numPagesLoaded = 0
};
DV.model.Pages.prototype = {
    imageURL: function (c) {
        var b = this.viewer.schema.document.resources.page.image;
        var d = this.zoomLevel > this.BASE_WIDTH ? "large" : "normal";
        var a = c + 1;
        if (this.viewer.schema.document.resources.page.zeropad) {
            a = this.zeroPad(a, 5)
        }
        b = b.replace(/\{size\}/, d);
        b = b.replace(/\{page\}/, a);
        return b
    },
    zeroPad: function (b, c) {
        var a = b.toString();
        while (a.length < c) {
            a = "0" + a
        }
        return a
    },
    getPadding: function () {
        if (this.viewer.options.mini) {
            return this.MINI_PADDING
        } else {
            if (this.viewer.options.zoom == "auto") {
                return this.REDUCED_PADDING
            } else {
                return this.DEFAULT_PADDING
            }
        }
    },
    zoomFactor: function () {
        return this.zoomLevel / this.BASE_WIDTH
    },
    resize: function (d) {
        var b = this.viewer.models.pages.DEFAULT_PADDING;
        if (d) {
            if (d == this.zoomLevel) {
                return
            }
            var a = this.zoomFactor();
            this.zoomLevel = d || this.zoomLevel;
            var c = this.zoomFactor() / a;
            this.width = Math.round(this.baseWidth * this.zoomFactor());
            this.height = Math.round(this.height * c);
            this.averageHeight = Math.round(this.averageHeight * c)
        }
        this.viewer.elements.sets.width(this.zoomLevel);
        this.viewer.elements.collection.css({
            width: this.width + b
        });
        this.viewer.$(".DV-textContents").css({
            "font-size": this.zoomLevel * 0.02 + "px"
        })
    },
    updateHeight: function (e, b) {
        var c = this.getPageHeight(b);
        var a = e.height * (this.zoomLevel > this.BASE_WIDTH ? 0.7 : 1);
        if (e.width < this.baseWidth) {
            a *= (this.baseWidth / e.width)
        }
        this.setPageHeight(b, a);
        this.averageHeight = ((this.averageHeight * this.numPagesLoaded) + a) / (this.numPagesLoaded + 1);
        this.numPagesLoaded += 1;
        if (c === a) {
            return
        }
        this.viewer.models.document.computeOffsets();
        this.viewer.pageSet.simpleReflowPages();
        if (!this.viewer.activeAnnotation && (b < this.viewer.models.document.currentIndex())) {
            var d = Math.round(a * this.zoomFactor() - c);
            this.viewer.elements.window[0].scrollTop += d
        }
    },
    setPageHeight: function (a, b) {
        this.pageHeights[a] = Math.round(b)
    },
    getPageHeight: function (a) {
        var b = this.pageHeights[a];
        return Math.round(b ? b * this.zoomFactor() : this.height)
    }
};
DV.Schema.events = {
    zoom: function (c) {
        var b = this.viewer;
        var a = function () {
            b.pageSet.zoom({
                zoomLevel: c
            });
            var d = b.models.document.ZOOM_RANGES;
            b.dragReporter.sensitivity = d[d.length - 1] == c ? 1.5 : 1;
            b.notifyChangedState();
            return true
        };
        b.confirmStateChange ? b.confirmStateChange(a) : a()
    },
    drawPages: function () {
        if (this.viewer.state != "ViewDocument") {
            return
        }
        var g = this.models.document;
        var e = this.elements.window[0];
        var c = g.baseHeightsPortionOffsets;
        var a = this.viewer.scrollPosition = e.scrollTop;
        var i = a + (this.viewer.$(e).height() / 3);
        var d = _.sortedIndex(c, a);
        var h = _.sortedIndex(c, i);
        if (c[d] == a) {
            d++ && h++
        }
        var b = this.helpers.sortPages(h - 1);
        var f = g.totalPages;
        if (g.currentPage() != d) {
            g.setPageIndex(d - 1)
        }
        this.drawPageAt(b, h - 1)
    },
    drawPageAt: function (e, b) {
        var d = b == 0;
        var c = b == this.models.document.totalPages - 1;
        if (d) {
            b += 1
        }
        var a = [{
            label: e[0],
            index: b - 1
        }, {
            label: e[1],
            index: b
        }, {
            label: e[2],
            index: b + 1
        }];
        if (c) {
            a.pop()
        }
        a[d ? 0 : a.length - 1].currentPage = true;
        this.viewer.pageSet.draw(a)
    },
    check: function () {
        var b = this.viewer;
        if (b.busy === false) {
            b.busy = true;
            for (var a = 0; a < this.viewer.observers.length; a++) {
                this[b.observers[a]].call(this)
            }
            b.busy = false
        }
    },
    loadText: function (a, f) {
        a = (!a) ? this.models.document.currentIndex() : parseInt(a, 10);
        this._previousTextIndex = a;
        var d = this;
        var b = function (i) {
            var h = parseInt(a, 10) + 1;
            d.viewer.$(".DV-textContents").replaceWith('<pre class="DV-textContents">' + i + "</pre>");
            d.elements.currentPage.text(h);
            d.elements.textCurrentPage.text("p. " + (h));
            d.models.document.setPageIndex(a);
            d.helpers.setActiveChapter(d.models.chapters.getChapterId(a));
            if (d.viewer.openEditor == "editText" && !(h in d.models.document.originalPageText)) {
                d.models.document.originalPageText[h] = i
            }
            if (d.viewer.openEditor == "editText") {
                d.viewer.$(".DV-textContents").attr("contentEditable", true).addClass("DV-editing")
            }
            if (f) {
                f.call(d.helpers)
            }
        };
        if (d.viewer.schema.text[a]) {
            return b(d.viewer.schema.text[a])
        }
        var c = DV.jQuery.proxy(function (h) {
            b(d.viewer.schema.text[a] = h)
        }, this);
        this.viewer.$(".DV-textContents").text("");
        var g = d.viewer.schema.document.resources.page.text.replace("{page}", a + 1);
        var e = this.helpers.isCrossDomain(g);
        if (e) {
            g += "?callback=?"
        }
        DV.jQuery[e ? "getJSON" : "get"](g, {}, c)
    },
    resetTracker: function () {
        this.viewer.activeAnnotation = null;
        this.trackAnnotation.combined = null;
        this.trackAnnotation.h = null
    },
    trackAnnotation: function () {
        var e = this.viewer;
        var d = this.helpers;
        var b = this.elements.window[0].scrollTop;
        if (e.activeAnnotation) {
            var a = e.activeAnnotation;
            var c = this.trackAnnotation;
            if (c.id != a.id) {
                c.id = a.id;
                d.setActiveAnnotationLimits(a)
            }
            if (!e.activeAnnotation.annotationEl.hasClass("DV-editing") && (b > (c.h) || b < c.combined)) {
                a.hide(true);
                e.pageSet.setActiveAnnotation(null);
                e.activeAnnotation = null;
                c.h = null;
                c.id = null;
                c.combined = null
            }
        } else {
            e.pageSet.setActiveAnnotation(null);
            e.activeAnnotation = null;
            c.h = null;
            c.id = null;
            c.combined = null;
            d.removeObserver("trackAnnotation")
        }
    }
};
DV.Schema.events.ViewAnnotation = {
    next: function (d) {
        var f = this.viewer;
        var b = f.activeAnnotationId;
        var a = this.models.annotations;
        var c = (b === null) ? a.getFirstAnnotation() : a.getNextAnnotation(b);
        if (!c) {
            return false
        }
        f.pageSet.showAnnotation(c);
        this.helpers.setAnnotationPosition(c.position)
    },
    previous: function (d) {
        var f = this.viewer;
        var c = f.activeAnnotationId;
        var a = this.models.annotations;
        var b = (!c) ? a.getFirstAnnotation() : a.getPreviousAnnotation(c);
        if (!b) {
            return false
        }
        f.pageSet.showAnnotation(b);
        this.helpers.setAnnotationPosition(b.position)
    },
    search: function (a) {
        a.preventDefault();
        this.viewer.open("ViewSearch");
        return false
    }
};
DV.Schema.events.ViewDocument = {
    next: function () {
        var a = this.models.document.nextPage();
        this.helpers.jump(a)
    },
    previous: function (b) {
        var a = this.models.document.previousPage();
        this.helpers.jump(a)
    },
    search: function (a) {
        a.preventDefault();
        this.viewer.open("ViewSearch");
        return false
    }
};
DV.Schema.events.ViewSearch = {
    next: function (b) {
        var a = this.models.document.nextPage();
        this.loadText(a);
        this.viewer.open("ViewText")
    },
    previous: function (b) {
        var a = this.models.document.previousPage();
        this.loadText(a);
        this.viewer.open("ViewText")
    },
    search: function (a) {
        a.preventDefault();
        this.helpers.getSearchResponse(this.elements.searchInput.val());
        return false
    }
};
DV.Schema.events.ViewText = {
    next: function (b) {
        var a = this.models.document.nextPage();
        this.loadText(a)
    },
    previous: function (b) {
        var a = this.models.document.previousPage();
        this.loadText(a)
    },
    search: function (a) {
        a.preventDefault();
        this.viewer.open("ViewSearch");
        return false
    }
};
DV.Schema.events.ViewThumbnails = {
    next: function () {
        var a = this.models.document.nextPage();
        this.helpers.jump(a)
    },
    previous: function (b) {
        var a = this.models.document.previousPage();
        this.helpers.jump(a)
    },
    search: function (a) {
        a.preventDefault();
        this.viewer.open("ViewSearch");
        return false
    }
};
_.extend(DV.Schema.events, {
    handleHashChangeViewDocumentPage: function (b) {
        var a = parseInt(b, 10) - 1;
        if (this.viewer.state === "ViewDocument") {
            this.viewer.pageSet.cleanUp();
            this.helpers.jump(a)
        } else {
            this.models.document.setPageIndex(a);
            this.viewer.open("ViewDocument")
        }
    },
    handleHashChangeLegacyViewDocumentPage: function (b) {
        var a = parseInt(b, 10) - 1;
        this.handleHashChangeViewDocumentPage(b)
    },
    handleHashChangeViewDocumentAnnotation: function (c, b) {
        var a = parseInt(c, 10) - 1;
        var b = parseInt(b, 10);
        if (this.viewer.state === "ViewDocument") {
            this.viewer.pageSet.showAnnotation(this.viewer.models.annotations.byId[b])
        } else {
            this.models.document.setPageIndex(a);
            this.viewer.pageSet.setActiveAnnotation(b);
            this.viewer.openingAnnotationFromHash = true;
            this.viewer.open("ViewDocument")
        }
    },
    handleHashChangeViewAnnotationAnnotation: function (a) {
        var a = parseInt(a, 10);
        var b = this.viewer;
        if (b.state === "ViewAnnotation") {
            b.pageSet.showAnnotation(this.viewer.models.annotations.byId[a])
        } else {
            b.activeAnnotationId = a;
            this.viewer.open("ViewAnnotation")
        }
    },
    handleHashChangeDefault: function () {
        this.viewer.pageSet.cleanUp();
        this.models.document.setPageIndex(0);
        if (this.viewer.state === "ViewDocument") {
            this.helpers.jump(0)
        } else {
            this.viewer.open("ViewDocument")
        }
    },
    handleHashChangeViewText: function (b) {
        var a = parseInt(b, 10) - 1;
        if (this.viewer.state === "ViewText") {
            this.events.loadText(a)
        } else {
            this.models.document.setPageIndex(a);
            this.viewer.open("ViewText")
        }
    },
    handleHashChangeViewPages: function () {
        if (this.viewer.state == "ViewThumbnails") {
            return
        }
        this.viewer.open("ViewThumbnails")
    },
    handleHashChangeViewSearchRequest: function (c, b) {
        var a = parseInt(c, 10) - 1;
        this.elements.searchInput.val(decodeURIComponent(b));
        if (this.viewer.state !== "ViewSearch") {
            this.models.document.setPageIndex(a)
        }
        this.viewer.open("ViewSearch")
    },
    handleHashChangeViewEntity: function (c, a, d, b) {
        c = parseInt(c, 10) - 1;
        a = decodeURIComponent(a);
        this.elements.searchInput.val(a);
        this.models.document.setPageIndex(c);
        this.states.ViewEntity(a, parseInt(d, 10), parseInt(b, 10))
    }
});
_.extend(DV.Schema.events, {
    handleNavigation: function (g) {
        var c = this.viewer.$(g.target);
        var k = c.closest(".DV-trigger");
        var b = c.closest(".DV-annotationMarker");
        var i = c.closest(".DV-chapter");
        if (!k.length) {
            return
        }
        if (c.hasClass("DV-expander")) {
            return i.toggleClass("DV-collapsed")
        } else {
            if (b.length) {
                var d = b[0].id.replace("DV-annotationMarker-", "");
                var f = this.models.annotations.getAnnotation(d);
                var j = parseInt(f.index, 10) + 1;
                if (this.viewer.state === "ViewText") {
                    this.loadText(f.index)
                } else {
                    if (this.viewer.state === "ViewThumbnails") {
                        this.viewer.open("ViewDocument")
                    }
                    this.viewer.pageSet.showAnnotation(f)
                }
            } else {
                if (i.length) {
                    i.removeClass("DV-collapsed");
                    var h = parseInt(i[0].id.replace("DV-chapter-", ""), 10);
                    var a = parseInt(this.models.chapters.getChapterPosition(h), 10);
                    var j = parseInt(a, 10) + 1;
                    if (this.viewer.state === "ViewText") {
                        this.loadText(a)
                    } else {
                        if (this.viewer.state === "ViewDocument" || this.viewer.state === "ViewThumbnails") {
                            this.helpers.jump(a);
                            if (this.viewer.state === "ViewThumbnails") {
                                this.viewer.open("ViewDocument")
                            }
                        } else {
                            return false
                        }
                    }
                } else {
                    return false
                }
            }
        }
    }
});
DV.Schema.helpers = {
    HOST_EXTRACTOR: (/https?:\/\/([^\/]+)\//),
    annotationClassName: ".DV-annotation",
    bindEvents: function (b) {
        var d = this.events.compile("zoom");
        var j = b.models.document;
        var k = _.indexOf(j.ZOOM_RANGES, j.zoomLevel);
        var e = this.viewer;
        e.slider = e.$(".DV-zoomBox").slider({
            step: 1,
            min: 0,
            max: 4,
            value: k,
            slide: function (m, n) {
                d(b.models.document.ZOOM_RANGES[parseInt(n.value, 10)])
            },
            change: function (m, n) {
                d(b.models.document.ZOOM_RANGES[parseInt(n.value, 10)])
            }
        });
        var g = e.history;
        var h = e.compiled;
        h.next = this.events.compile("next");
        h.previous = this.events.compile("previous");
        var l = b.states;
        e.$(".DV-navControls").delegate("span.DV-next", "click", h.next);
        e.$(".DV-navControls").delegate("span.DV-previous", "click", h.previous);
        e.$(".DV-annotationView").delegate(".DV-trigger", "click", function (m) {
            m.preventDefault();
            b.open("ViewAnnotation")
        });
        e.$(".DV-documentView").delegate(".DV-trigger", "click", function (m) {
            b.open("ViewDocument")
        });
        e.$(".DV-thumbnailsView").delegate(".DV-trigger", "click", function (m) {
            b.open("ViewThumbnails")
        });
        e.$(".DV-textView").delegate(".DV-trigger", "click", function (m) {
            b.open("ViewText")
        });
        e.$(".DV-allAnnotations").delegate(".DV-annotationGoto .DV-trigger", "click", DV.jQuery.proxy(this.gotoPage, this));
        e.$("form.DV-searchDocument").submit(this.events.compile("search"));
        e.$(".DV-searchBar").delegate(".DV-closeSearch", "click", function (m) {
            m.preventDefault();
            b.open("ViewText")
        });
        e.$(".DV-searchBox").delegate(".DV-searchInput-cancel", "click", DV.jQuery.proxy(this.clearSearch, this));
        e.$(".DV-searchResults").delegate("span.DV-resultPrevious", "click", DV.jQuery.proxy(this.highlightPreviousMatch, this));
        e.$(".DV-searchResults").delegate("span.DV-resultNext", "click", DV.jQuery.proxy(this.highlightNextMatch, this));
        e.$(".DV-trigger").bind("selectstart", function () {
            return false
        });
        this.elements.viewer.delegate(".DV-fullscreen", "click", _.bind(this.openFullScreen, this));
        var i = DV.jQuery.proxy(this.annotationBridgeToggle, this);
        var f = this.elements.collection;
        f.delegate(".DV-annotationTab", "click", i);
        f.delegate(".DV-annotationRegion", "click", DV.jQuery.proxy(this.annotationBridgeShow, this));
        f.delegate(".DV-annotationNext", "click", DV.jQuery.proxy(this.annotationBridgeNext, this));
        f.delegate(".DV-annotationPrevious", "click", DV.jQuery.proxy(this.annotationBridgePrevious, this));
        f.delegate(".DV-showEdit", "click", DV.jQuery.proxy(this.showAnnotationEdit, this));
        f.delegate(".DV-cancelEdit", "click", DV.jQuery.proxy(this.cancelAnnotationEdit, this));
        f.delegate(".DV-saveAnnotation", "click", DV.jQuery.proxy(this.saveAnnotation, this));
        f.delegate(".DV-saveAnnotationDraft", "click", DV.jQuery.proxy(this.saveAnnotation, this));
        f.delegate(".DV-deleteAnnotation", "click", DV.jQuery.proxy(this.deleteAnnotation, this));
        f.delegate(".DV-pageNumber", "click", _.bind(this.permalinkPage, this, "document"));
        f.delegate(".DV-textCurrentPage", "click", _.bind(this.permalinkPage, this, "text"));
        f.delegate(".DV-annotationTitle", "click", _.bind(this.permalinkAnnotation, this));
        f.delegate(".DV-permalink", "click", _.bind(this.permalinkAnnotation, this));
        e.$(".DV-thumbnails").delegate(".DV-thumbnail-page", "click", function (o) {
            var n = e.$(o.currentTarget);
            if (!e.openEditor) {
                var m = n.closest(".DV-thumbnail").attr("data-pageNumber") - 1;
                e.models.document.setPageIndex(m);
                e.open("ViewDocument")
            }
        });
        _.bindAll(this, "touchStart", "touchMove", "touchEnd");
        this.elements.window[0].ontouchstart = this.touchStart;
        this.elements.window[0].ontouchmove = this.touchMove;
        this.elements.window[0].ontouchend = this.touchEnd;
        this.elements.well[0].ontouchstart = this.touchStart;
        this.elements.well[0].ontouchmove = this.touchMove;
        this.elements.well[0].ontouchend = this.touchEnd;
        e.$(".DV-descriptionToggle").live("click", function (m) {
            m.preventDefault();
            m.stopPropagation();
            e.$(".DV-descriptionText").toggle();
            e.$(".DV-descriptionToggle").toggleClass("DV-showDescription")
        });
        var c = DV.jQuery.proxy(e.pageSet.cleanUp, this);
        this.elements.window.live("mousedown", function (n) {
            var m = e.$(n.target);
            if (m.parents().is(".DV-annotation") || m.is(".DV-annotation")) {
                return true
            }
            if (b.elements.window.hasClass("DV-coverVisible")) {
                if ((m.width() - parseInt(n.clientX, 10)) >= 15) {
                    c()
                }
            }
        });
        var a = e.schema.document.id;
        if (DV.jQuery.browser.msie == true) {
            this.elements.browserDocument.bind("focus." + a, DV.jQuery.proxy(this.focusWindow, this));
            this.elements.browserDocument.bind("focusout." + a, DV.jQuery.proxy(this.focusOut, this))
        } else {
            this.elements.browserWindow.bind("focus." + a, DV.jQuery.proxy(this.focusWindow, this));
            this.elements.browserWindow.bind("blur." + a, DV.jQuery.proxy(this.blurWindow, this))
        }
        this.elements.window.bind("scroll." + a, DV.jQuery.proxy(this.focusWindow, this));
        this.elements.coverPages.live("mousedown", c);
        e.acceptInput = this.elements.currentPage.acceptInput({
            changeCallBack: DV.jQuery.proxy(this.acceptInputCallBack, this)
        })
    },
    unbindEvents: function () {
        var b = this.viewer;
        var a = b.schema.document.id;
        if (DV.jQuery.browser.msie == true) {
            this.elements.browserDocument.unbind("focus." + a);
            this.elements.browserDocument.unbind("focusout." + a)
        } else {
            b.helpers.elements.browserWindow.unbind("focus." + a);
            b.helpers.elements.browserWindow.unbind("blur." + a)
        }
        b.helpers.elements.browserWindow.unbind("scroll." + a);
        _.each(b.observers, function (c) {
            b.helpers.removeObserver(c)
        })
    },
    ensureAnnotationImages: function () {
        this.viewer.$(".DV-img[data-src]").each(function () {
            var a = DV.jQuery(this);
            a.attr("src", a.attr("data-src"))
        })
    },
    startCheckTimer: function () {
        var b = this.viewer;
        var a = function () {
            b.events.check()
        };
        this.viewer.checkTimer = setInterval(a, 100)
    },
    stopCheckTimer: function () {
        clearInterval(this.viewer.checkTimer)
    },
    blurWindow: function () {
        if (this.viewer.isFocus === true) {
            this.viewer.isFocus = false;
            this.stopCheckTimer()
        } else {
            return
        }
    },
    focusOut: function () {
        if (this.viewer.activeElement != document.activeElement) {
            this.viewer.activeElement = document.activeElement;
            this.viewer.isFocus = true
        } else {
            this.viewer.isFocus = false;
            this.viewer.helpers.stopCheckTimer();
            return
        }
    },
    focusWindow: function () {
        if (this.viewer.isFocus === true) {
            return
        } else {
            this.viewer.isFocus = true;
            this.startCheckTimer()
        }
    },
    touchStart: function (a) {
        a.stopPropagation();
        a.preventDefault();
        var b = a.changedTouches[0];
        this._moved = false;
        this._touchX = b.pageX;
        this._touchY = b.pageY
    },
    touchMove: function (c) {
        var b = c.currentTarget;
        var f = c.changedTouches[0];
        var d = this._touchX - f.pageX;
        var a = this._touchY - f.pageY;
        b.scrollLeft += d;
        b.scrollTop += a;
        this._touchX -= d;
        this._touchY -= a;
        if (a != 0 || d != 0) {
            this._moved = true
        }
    },
    touchEnd: function (b) {
        if (!this._moved) {
            var d = b.changedTouches[0];
            var a = d.target;
            var c = document.createEvent("MouseEvent");
            while (a.nodeType !== 1) {
                a = a.parentNode
            }
            c.initMouseEvent("click", true, true, d.view, 1, d.screenX, d.screenY, d.clientX, d.clientY, false, false, false, false, 0, null);
            a.dispatchEvent(c)
        }
        this._moved = false
    },
    permalinkPage: function (f, d) {
        if (f == "text") {
            var b = this.viewer.models.document.currentPage()
        } else {
            var a = this.viewer.$(d.target).closest(".DV-set").attr("data-id");
            var c = this.viewer.pageSet.pages[a];
            var b = c.pageNumber;
            this.jump(c.index)
        }
        this.viewer.history.save(f + "/p" + b)
    },
    permalinkAnnotation: function (c) {
        var d = this.viewer.$(c.target).closest(".DV-annotation").attr("data-id");
        var b = this.viewer.models.annotations.getAnnotation(d);
        var a = b.server_id || b.id;
        if (this.viewer.state == "ViewDocument") {
            this.viewer.pageSet.showAnnotation(b);
            this.viewer.history.save("document/p" + b.pageNumber + "/a" + a)
        } else {
            this.viewer.history.save("annotation/a" + a)
        }
    },
    setDocHeight: function (a, b) {
        this.elements.bar.css("height", a);
        this.elements.window[0].scrollTop += b
    },
    getWindowDimensions: function () {
        var a = {
            height: window.innerHeight ? window.innerHeight : this.elements.browserWindow.height(),
            width: this.elements.browserWindow.width()
        };
        return a
    },
    isCrossDomain: function (b) {
        var a = b.match(this.HOST_EXTRACTOR);
        return a && (a[1] != window.location.host)
    },
    resetScrollState: function () {
        this.elements.window.scrollTop(0)
    },
    gotoPage: function (c) {
        c.preventDefault();
        var b = this.viewer.$(c.target).parents(".DV-annotation").attr("rel").replace("aid-", "");
        var a = this.models.annotations.getAnnotation(b);
        var d = this.viewer;
        if (d.state !== "ViewDocument") {
            this.models.document.setPageIndex(a.index);
            d.open("ViewDocument")
        }
    },
    openFullScreen: function () {
        var c = this.viewer.schema.document;
        var a = c.canonicalURL.replace(/#\S+$/, "");
        var b = this.models.document.currentPage();
        switch (this.viewer.state) {
        case "ViewAnnotation":
            a += "#annotation/a" + this.viewer.activeAnnotationId;
            break;
        case "ViewDocument":
            a += "#document/p" + b;
            break;
        case "ViewSearch":
            a += "#search/p" + b + "/" + encodeURIComponent(this.elements.searchInput.val());
            break;
        case "ViewText":
            a += "#text/p" + b;
            break;
        case "ViewThumbnails":
            a += "#pages/p" + b;
            break
        }
        window.open(a, "documentviewer", "toolbar=no,resizable=yes,scrollbars=no,status=no")
    },
    sortPages: function (a) {
        if (a == 0 || a % 3 == 1) {
            return ["p0", "p1", "p2"]
        }
        if (a % 3 == 2) {
            return ["p1", "p2", "p0"]
        }
        if (a % 3 == 0) {
            return ["p2", "p0", "p1"]
        }
    },
    addObserver: function (a) {
        this.removeObserver(a);
        this.viewer.observers.push(a)
    },
    removeObserver: function (b) {
        var d = this.viewer.observers;
        for (var c = 0, a = d.length; c < a; c++) {
            if (b === d[c]) {
                d.splice(c, 1)
            }
        }
    },
    toggleContent: function (a) {
        this.elements.viewer.removeClass("DV-viewText DV-viewSearch DV-viewDocument DV-viewAnnotations DV-viewThumbnails").addClass("DV-" + a)
    },
    jump: function (c, b, d) {
        b = (b) ? parseInt(b, 10) : 0;
        var a = this.models.document.getOffset(parseInt(c, 10)) + b;
        this.elements.window[0].scrollTop = a;
        this.models.document.setPageIndex(c);
        if (d) {
            this.viewer.pageSet.redraw(true)
        }
        if (this.viewer.state === "ViewThumbnails") {
            this.viewer.thumbnails.highlightCurrentPage()
        }
    },
    shift: function (a) {
        var d = this.elements.window;
        var c = d.scrollTop() + a.deltaY;
        var b = d.scrollLeft() + a.deltaX;
        d.scrollTop(c);
        d.scrollLeft(b)
    },
    getAppState: function () {
        var a = this.models.document;
        var b = (a.currentIndex() == 0) ? 1 : a.currentPage();
        return {
            page: b,
            zoom: a.zoomLevel,
            view: this.viewer.state
        }
    },
    constructPages: function () {
        var b = [];
        var d = (this.viewer.schema.data.totalPages < 3) ? this.viewer.schema.data.totalPages : 3;
        var a = this.models.pages.height;
        for (var c = 0; c < d; c++) {
            b.push(JST.pages({
                pageNumber: c + 1,
                pageIndex: c,
                pageImageSource: null,
                baseHeight: a
            }))
        }
        return b.join("")
    },
    positionViewer: function () {
        var a = this.elements.viewer.position();
        this.elements.viewer.css({
            position: "absolute",
            top: a.top,
            bottom: 0,
            left: a.left,
            right: a.left
        })
    },
    unsupportedBrowser: function () {
        if (!(DV.jQuery.browser.msie && DV.jQuery.browser.version <= "6.0")) {
            return false
        }
        DV.jQuery(this.viewer.options.container).html(JST.unsupported({
            viewer: this.viewer
        }));
        return true
    },
    registerHashChangeEvents: function () {
        var a = this.events;
        var b = this.viewer.history;
        b.defaultCallback = _.bind(a.handleHashChangeDefault, this.events);
        b.register(/document\/p(\d*)$/, _.bind(a.handleHashChangeViewDocumentPage, this.events));
        b.register(/p(\d*)$/, _.bind(a.handleHashChangeLegacyViewDocumentPage, this.events));
        b.register(/p=(\d*)$/, _.bind(a.handleHashChangeLegacyViewDocumentPage, this.events));
        b.register(/document\/p(\d*)\/a(\d*)$/, _.bind(a.handleHashChangeViewDocumentAnnotation, this.events));
        b.register(/annotation\/a(\d*)$/, _.bind(a.handleHashChangeViewAnnotationAnnotation, this.events));
        b.register(/pages$/, _.bind(a.handleHashChangeViewPages, a));
        b.register(/text\/p(\d*)$/, _.bind(a.handleHashChangeViewText, this.events));
        b.register(/entity\/p(\d*)\/(.*)\/(\d+):(\d+)$/, _.bind(a.handleHashChangeViewEntity, this.events));
        b.register(/search\/p(\d*)\/(.*)$/, _.bind(a.handleHashChangeViewSearchRequest, this.events))
    },
    autoZoomPage: function () {
        var d = this.elements.window.outerWidth(true);
        var e;
        if (this.viewer.options.zoom == "auto") {
            e = Math.min(700, d - (this.viewer.models.pages.getPadding() * 2))
        } else {
            e = this.viewer.options.zoom
        }
        var c = [];
        if (e <= 500) {
            var b = (e + 700) / 2;
            c = [e, b, 700, 850, 1000]
        } else {
            if (e <= 750) {
                var b = ((1000 - 700) / 3) + e;
                var a = ((1000 - 700) / 3) * 2 + e;
                c = [0.66 * e, e, b, a, 1000]
            } else {
                if (750 < e && e <= 850) {
                    var b = ((1000 - e) / 2) + e;
                    c = [0.66 * e, 700, e, b, 1000]
                } else {
                    if (850 < e && e < 1000) {
                        var b = ((e - 700) / 2) + 700;
                        c = [0.66 * e, 700, b, e, 1000]
                    } else {
                        if (e >= 1000) {
                            e = 1000;
                            c = this.viewer.models.document.ZOOM_RANGES
                        }
                    }
                }
            }
        }
        this.viewer.models.document.ZOOM_RANGES = c;
        this.viewer.slider.slider({
            value: parseInt(_.indexOf(c, e), 10)
        });
        this.events.zoom(e)
    },
    handleInitialState: function () {
        var a = this.viewer.history.loadURL(true);
        if (!a) {
            var b = this.viewer.options;
            this.viewer.open("ViewDocument");
            if (b.note) {
                this.viewer.pageSet.showAnnotation(this.viewer.models.annotations.byId[b.note])
            } else {
                if (b.page) {
                    this.jump(b.page - 1)
                }
            }
        }
    }
};
_.extend(DV.Schema.helpers, {
    getAnnotationModel: function (b) {
        var a = parseInt(b.attr("rel").match(/\d+/), 10);
        return this.models.annotations.getAnnotation(a)
    },
    getAnnotationObject: function (a) {
        var a = this.viewer.$(a);
        var d = a.attr("id").replace(/DV\-annotation\-|DV\-listAnnotation\-/, "");
        var b = a.closest("div.DV-set").attr("data-id");
        for (var c = 0;
            (annotationObject = this.viewer.pageSet.pages[b].annotations[c]); c++) {
            if (annotationObject.id == d) {
                a = null;
                return annotationObject
            }
        }
        return false
    },
    annotationBridgeToggle: function (b) {
        b.preventDefault();
        var a = this.getAnnotationObject(this.viewer.$(b.target).closest(this.annotationClassName));
        a.toggle()
    },
    annotationBridgeShow: function (b) {
        b.preventDefault();
        var a = this.getAnnotationObject(this.viewer.$(b.target).closest(this.annotationClassName));
        a.show()
    },
    annotationBridgeHide: function (b) {
        b.preventDefault();
        var a = this.getAnnotationObject(this.viewer.$(b.target).closest(this.annotationClassName));
        a.hide(true)
    },
    annotationBridgeNext: function (b) {
        b.preventDefault();
        var a = this.getAnnotationObject(this.viewer.$(b.target).closest(this.annotationClassName));
        a.next()
    },
    annotationBridgePrevious: function (b) {
        b.preventDefault();
        var a = this.getAnnotationObject(this.viewer.$(b.target).closest(this.annotationClassName));
        a.previous()
    },
    setAnnotationPosition: function (a) {
        this.elements.currentPage.text(a)
    },
    setActiveAnnotationLimits: function (a) {
        var a = (a) ? a : this.viewer.activeAnnotation;
        if (!a || a == null) {
            return
        }
        var e = this.elements;
        var b = a.page;
        var d = a.annotationEl;
        var c = a.position.top * this.models.pages.zoomFactor();
        var f = this.events.trackAnnotation;
        if (a.type === "page") {
            f.h = d.outerHeight() + b.getOffset();
            f.combined = (b.getOffset()) - e.window.height()
        } else {
            f.h = d.height() + c - 20 + b.getOffset() + b.getPageNoteHeight();
            f.combined = (c - 20 + b.getOffset() + b.getPageNoteHeight()) - e.window.height()
        }
    }
});
_.extend(DV.Schema.helpers, {
    showAnnotations: function () {
        if (this.viewer.options.showAnnotations === false) {
            return false
        }
        return _.size(this.models.annotations.byId) > 0
    },
    renderViewer: function () {
        var l = this.viewer.schema.document;
        var c = this.constructPages();
        var m = (l.description) ? l.description : null;
        var f = l.resources.related_article;
        var j = JST.header({
            options: this.viewer.options,
            id: l.id,
            story_url: f,
            title: l.title || ""
        });
        var d = JST.footer({
            options: this.viewer.options
        });
        var k = l.resources.pdf;
        k = k && this.viewer.options.pdf !== false ? '<a target="_blank" href="' + k + '">Original Document &raquo;</a>' : "";
        var i = "" + this.viewer.schema.document.contributor + ", " + this.viewer.schema.document.contributor_organization;
        var e = this.showAnnotations();
        var o = (e) && l.resources.print_annotations;
        var g = {
            options: this.viewer.options,
            pages: c,
            header: j,
            footer: d,
            pdf_url: k,
            contributors: i,
            story_url: f,
            print_notes_url: o,
            descriptionContainer: JST.descriptionContainer({
                description: m
            }),
            autoZoom: this.viewer.options.zoom == "auto",
            mini: false
        };
        var b = this.viewer.options.width;
        var n = this.viewer.options.height;
        if (b && n) {
            if (b < 500) {
                this.viewer.options.mini = true;
                g.mini = true
            }
            DV.jQuery(this.viewer.options.container).css({
                position: "relative",
                width: this.viewer.options.width,
                height: this.viewer.options.height
            })
        }
        var a = this.viewer.options.container;
        var h = DV.jQuery(a);
        if (!h.length) {
            throw "Document Viewer container element not found: " + a
        }
        h.html(JST.viewer(g))
    },
    displayNavigation: function () {
        var b = this.viewer.schema.document;
        var a = (!b.description && !_.size(this.viewer.schema.data.annotationsById) && !this.viewer.schema.data.sections.length);
        this.viewer.$(".DV-supplemental").toggleClass("DV-noNavigation", a)
    },
    renderSpecificPageCss: function () {
        var e = [];
        for (var d = 1, a = this.models.document.totalPages; d <= a; d++) {
            e.push(".DV-page-" + d + " .DV-pageSpecific-" + d)
        }
        var c = e.join(", ") + " { display: block; }";
        var b = '<style type="text/css" media="all">\n' + c + "\n</style>";
        DV.jQuery("head").append(b)
    },
    renderNavigation: function () {
        var w = this;
        var c = [],
            h = [],
            e = [],
            r = [],
            o = JST.navigationExpander({}),
            j = [],
            k = [],
            f = [];
        var p = this.viewer.models.boldsId || (this.viewer.models.boldsId = _.uniqueId());
        var s = function (B, A) {
            var C = [];
            for (var z = B, y = A; z < y; z++) {
                if (k[z]) {
                    C.push(k[z]);
                    j[z] = ""
                }
            }
            return C.join("")
        };
        var b = function (i) {
            var y = "#DV-selectedChapter-" + i.id + " #DV-chapter-" + i.id;
            h.push(y + " .DV-navChapterTitle");
            return (JST.chapterNav(i))
        };
        var d = function (z) {
            var A = [];
            var B = w.viewer.schema.data.annotationsByPage[z];
            for (var y = 0; y < B.length; y++) {
                var i = B[y];
                A.push(JST.annotationNav(i));
                h.push("#DV-selectedAnnotation-" + i.id + " #DV-annotationMarker-" + i.id + " .DV-navAnnotationTitle")
            }
            return A.join("")
        };
        if (this.showAnnotations()) {
            for (var t = 0, u = this.models.document.totalPages; t < u; t++) {
                if (this.viewer.schema.data.annotationsByPage[t]) {
                    j[t] = d(t);
                    k[t] = j[t]
                }
            }
        }
        var n = this.viewer.schema.data.sections;
        if (n.length) {
            for (var t = 0; t < n.length; t++) {
                var g = n[t];
                var v = n[t + 1];
                g.id = g.id || _.uniqueId();
                g.pageNumber = g.page;
                g.endPage = v ? v.page - 1 : this.viewer.schema.data.totalPages;
                var a = s(g.pageNumber - 1, g.endPage);
                if (a != "") {
                    g.navigationExpander = o;
                    g.navigationExpanderClass = "DV-hasChildren";
                    g.noteViews = a;
                    j[g.pageNumber - 1] = b(g)
                } else {
                    g.navigationExpanderClass = "DV-noChildren";
                    g.noteViews = "";
                    g.navigationExpander = "";
                    j[g.pageNumber - 1] = b(g)
                }
            }
        }
        var x = j.join("");
        var m = this.viewer.$("div.DV-chaptersContainer");
        m.html(x);
        m.unbind("click").bind("click", this.events.compile("handleNavigation"));
        this.viewer.schema.data.sections.length || _.size(this.viewer.schema.data.annotationsById) ? m.show() : m.hide();
        this.displayNavigation();
        DV.jQuery("#DV-navigationBolds-" + p, DV.jQuery("head")).remove();
        var q = h.join(", ") + " { font-weight:bold; color:#000 !important; }";
        var l = '<style id="DV-navigationBolds-' + p + '" type="text/css" media="screen,print">\n' + q + "\n</style>";
        DV.jQuery("head").append(l);
        m = null
    },
    renderComponents: function () {
        var g = DV.jQuery(this.viewer.options.container);
        var e = g.css("position");
        if (e != "relative" && e != "absolute" && !this.viewer.options.fixedSize) {
            DV.jQuery("html, body").css({
                overflow: "hidden"
            });
            if (g.offset().top == 0) {
                this.viewer.elements.viewer.css({
                    border: 0
                })
            }
        }
        var d = this.showAnnotations();
        var j = this.models.document.totalPages > 1;
        var a = (this.viewer.options.search !== false) && (this.viewer.options.text !== false) && (!this.viewer.options.width || this.viewer.options.width >= 540);
        var f = (!d && !j && !a && !this.viewer.options.sidebar);
        var c = this.viewer.$(".DV-annotationView");
        c[d ? "show" : "hide"]();
        if (a) {
            this.elements.viewer.addClass("DV-searchable");
            this.viewer.$("input.DV-searchInput", g).placeholder({
                message: "Search",
                clearClassName: "DV-searchInput-show-search-cancel"
            })
        } else {
            this.viewer.$(".DV-textView").hide()
        } if (!j) {
            this.viewer.$(".DV-thumbnailsView").hide()
        }
        if (!d && !j && !a) {
            this.viewer.$(".DV-views").hide()
        }
        this.viewer.api.roundTabCorners();
        var b = this.models.chapters.chapters.length > 0;
        this.viewer.$(".DV-navControls").remove();
        if (j || this.viewer.options.sidebar) {
            var h = JST.navControls({
                totalPages: this.viewer.schema.data.totalPages,
                totalAnnotations: this.viewer.schema.data.totalAnnotations
            });
            this.viewer.$(".DV-navControlsContainer").html(h)
        }
        this.viewer.$(".DV-fullscreenControl").remove();
        if (this.viewer.schema.document.canonicalURL) {
            var i = JST.fullscreenControl({});
            if (f) {
                this.viewer.$(".DV-collapsibleControls").prepend(i);
                this.elements.viewer.addClass("DV-hideFooter")
            } else {
                this.viewer.$(".DV-fullscreenContainer").html(i)
            }
        }
        if (this.viewer.options.sidebar) {
            this.viewer.$(".DV-sidebar").show()
        }
        _.defer(_.bind(function () {
            if ((this.elements.viewer.width() <= 700) && (d || j || a)) {
                this.viewer.$(".DV-controls").addClass("DV-narrowControls")
            }
        }, this));
        this.elements.currentPage = this.viewer.$("span.DV-currentPage");
        this.models.document.setPageIndex(this.models.document.currentIndex())
    },
    reset: function () {
        this.resetNavigationState();
        this.cleanUpSearch();
        this.viewer.pageSet.cleanUp();
        this.removeObserver("drawPages");
        this.viewer.dragReporter.unBind();
        this.elements.window.scrollTop(0)
    }
});
_.extend(DV.Schema.helpers, {
    showAnnotationEdit: function (c) {
        var b = this.viewer.$(c.target).closest(this.annotationClassName);
        var a = this.viewer.$(".DV-annotationTextArea", b);
        b.addClass("DV-editing");
        a.focus()
    },
    cancelAnnotationEdit: function (c) {
        var b = this.viewer.$(c.target).closest(this.annotationClassName);
        var a = this.getAnnotationModel(b);
        this.viewer.$(".DV-annotationTitleInput", b).val(a.title);
        this.viewer.$(".DV-annotationTextArea", b).val(a.text);
        if (a.unsaved) {
            this.models.annotations.removeAnnotation(a)
        } else {
            b.removeClass("DV-editing")
        }
    },
    saveAnnotation: function (f, b) {
        var d = this.viewer.$(f.target);
        var c = d.closest(this.annotationClassName);
        var a = this.getAnnotationModel(c);
        if (!a) {
            return
        }
        a.title = this.viewer.$(".DV-annotationTitleInput", c).val();
        a.text = this.viewer.$(".DV-annotationTextArea", c).val();
        a.owns_note = a.unsaved ? true : a.owns_note;
        if (a.owns_note) {
            a.author = a.author || dc.account.name;
            a.author_organization = a.author_organization || (dc.account.isReal && dc.account.organization.name)
        }
        if (d.hasClass("DV-saveAnnotationDraft")) {
            a.access = "exclusive"
        } else {
            if (c.hasClass("DV-accessExclusive")) {
                a.access = "public"
            }
        } if (b == "onlyIfText" && (!a.title || a.title == "Untitled Note") && !a.text && !a.server_id) {
            return this.models.annotations.removeAnnotation(a)
        }
        c.removeClass("DV-editing");
        this.models.annotations.fireSaveCallbacks(a);
        this.viewer.api.redraw(true);
        if (this.viewer.activeAnnotation) {
            this.viewer.pageSet.showAnnotation(a)
        }
    },
    deleteAnnotation: function (c) {
        var b = this.viewer.$(c.target).closest(this.annotationClassName);
        var a = this.getAnnotationModel(b);
        this.models.annotations.removeAnnotation(a);
        this.models.annotations.fireDeleteCallbacks(a)
    }
});
_.extend(DV.Schema.helpers, {
    resetNavigationState: function () {
        var a = this.elements;
        if (a.chaptersContainer.length) {
            a.chaptersContainer[0].id = ""
        }
        if (a.navigation.length) {
            a.navigation[0].id = ""
        }
    },
    setActiveChapter: function (a) {
        if (a) {
            this.elements.chaptersContainer.attr("id", "DV-selectedChapter-" + a)
        }
    },
    setActiveAnnotationInNav: function (a) {
        if (a != null) {
            this.elements.navigation.attr("id", "DV-selectedAnnotation-" + a)
        } else {
            this.elements.navigation.attr("id", "")
        }
    }
});
_.extend(DV.Schema.helpers, {
    getSearchResponse: function (d) {
        var c = DV.jQuery.proxy(function (e) {
            this.viewer.searchResponse = e;
            var i = (e.results.length > 0) ? true : false;
            var h = i ? "of " + e.results.length + " " : " ";
            this.viewer.$("span.DV-totalSearchResult").text(h);
            this.viewer.$("span.DV-searchQuery").text(e.query);
            if (i) {
                var f = this.viewer.models.document.currentPage();
                var g = (_.include(e.results, f)) ? f : e.results[0];
                this.events.loadText(g - 1, this.highlightSearchResponses)
            } else {
                this.highlightSearchResponses()
            }
        }, this);
        var b = function () {
            this.viewer.$(".DV-currentSearchResult").text("Search is not available at this time");
            this.viewer.$("span.DV-searchQuery").text(d);
            this.viewer.$(".DV-searchResults").addClass("DV-noResults")
        };
        var a = this.viewer.schema.document.resources.search.replace("{query}", encodeURIComponent(d));
        if (this.viewer.helpers.isCrossDomain(a)) {
            a += "&callback=?"
        }
        DV.jQuery.ajax({
            url: a,
            dataType: "json",
            success: c,
            error: b
        })
    },
    acceptInputCallBack: function () {
        var a = parseInt(this.elements.currentPage.text(), 10) - 1;
        a = (a === "") ? 0 : a;
        a = (a < 0) ? 0 : a;
        a = (a + 1 > this.models.document.totalPages) ? this.models.document.totalPages - 1 : a;
        var b = a + 1;
        this.elements.currentPage.text(b);
        this.viewer.$(".DV-pageNumberContainer input").val(b);
        if (this.viewer.state === "ViewDocument" || this.viewer.state === "ViewThumbnails") {
            this.jump(a)
        } else {
            if (this.viewer.state === "ViewText") {
                this.events.loadText(a)
            }
        }
    },
    highlightSearchResponses: function () {
        var g = this.viewer;
        var c = g.searchResponse;
        if (!c) {
            return false
        }
        var e = c.results;
        var h = this.viewer.$(".DV-currentSearchResult");
        if (e.length == 0) {
            h.text("No Results");
            this.viewer.$(".DV-searchResults").addClass("DV-noResults")
        } else {
            this.viewer.$(".DV-searchResults").removeClass("DV-noResults")
        }
        for (var f = 0; f < c.results.length; f++) {
            if (this.models.document.currentPage() === c.results[f]) {
                h.text("Page " + (f + 1) + " ");
                break
            }
        }
        var l = "\\b" + c.query.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&").replace(/\s+/g, "\\s+") + "\\b";
        var j = this.viewer.$(".DV-textContents");
        var d = j.text();
        var k = new RegExp(l, "ig");
        var b = d.replace(k, '<span class="DV-searchMatch">$&</span>');
        j.html(b);
        var a = (g.toHighLight) ? g.toHighLight : 0;
        this.highlightMatch(a);
        h = null;
        j = null
    },
    highlightEntity: function (g, d) {
        this.viewer.$(".DV-searchResults").addClass("DV-noResults");
        var c = this.viewer.$(".DV-textContents");
        var f = c.text();
        var e = f.substr(0, g);
        var a = f.substr(g, d);
        var b = f.substr(g + d);
        f = [e, '<span class="DV-searchMatch">', a, "</span>", b].join("");
        c.html(f);
        this.highlightMatch(0)
    },
    highlightMatch: function (c) {
        var d = this.viewer.$(".DV-textContents span.DV-searchMatch");
        if (d.length == 0) {
            return false
        }
        var f = this.getCurrentSearchPageIndex();
        var a = this.viewer.toHighLight;
        if (a) {
            if (a !== false) {
                if (a === "last") {
                    c = d.length - 1
                } else {
                    if (a === "first") {
                        c = 0
                    } else {
                        c = a
                    }
                }
            }
            a = false
        }
        var e = this.viewer.searchResponse;
        if (e) {
            if (c === (d.length)) {
                if (e.results.length === f + 1) {
                    return
                }
                a = "first";
                this.events.loadText(e.results[f + 1] - 1, this.highlightSearchResponses);
                return
            } else {
                if (c === -1) {
                    if (f - 1 < 0) {
                        return false
                    }
                    a = "last";
                    this.events.loadText(e.results[f - 1] - 1, this.highlightSearchResponses);
                    return
                }
            }
            d.removeClass("DV-highlightedMatch")
        }
        var b = this.viewer.$(".DV-textContents span.DV-searchMatch:eq(" + c + ")");
        b.addClass("DV-highlightedMatch");
        this.elements.window[0].scrollTop = b.position().top - 50;
        if (e) {
            e.highlighted = c
        }
        d = null;
        b = null
    },
    getCurrentSearchPageIndex: function () {
        var d = this.viewer.searchResponse;
        if (!d) {
            return false
        }
        var b = this.models.document;
        for (var c = 0, a = d.results.length; c < a; c++) {
            if (d.results[c] === b.currentPage()) {
                return c
            }
        }
    },
    highlightPreviousMatch: function (a) {
        a.preventDefault();
        this.highlightMatch(this.viewer.searchResponse.highlighted - 1)
    },
    highlightNextMatch: function (a) {
        a.preventDefault(a);
        this.highlightMatch(this.viewer.searchResponse.highlighted + 1)
    },
    clearSearch: function (a) {
        this.elements.searchInput.val("").keyup().focus()
    },
    showEntity: function (a, c, b) {
        this.viewer.$("span.DV-totalSearchResult").text("");
        this.viewer.$("span.DV-searchQuery").text(a);
        this.viewer.$("span.DV-currentSearchResult").text("Searching");
        this.events.loadText(this.models.document.currentIndex(), _.bind(this.viewer.helpers.highlightEntity, this.viewer.helpers, c, b))
    },
    cleanUpSearch: function () {
        var a = this.viewer;
        a.searchResponse = null;
        a.toHighLight = null;
        if (this.elements) {
            this.elements.searchInput.keyup().blur()
        }
    }
});
DV.Schema.states = {
    InitialLoad: function () {
        if (this.helpers.unsupportedBrowser()) {
            return
        }
        this.helpers.renderViewer();
        this.events.elements = this.helpers.elements = this.elements = new DV.Elements(this);
        this.helpers.renderComponents();
        this.helpers.renderNavigation();
        this.helpers.renderSpecificPageCss();
        this.pageSet = new DV.PageSet(this);
        this.pageSet.buildPages();
        this.helpers.bindEvents(this);
        this.helpers.positionViewer();
        this.models.document.computeOffsets();
        this.helpers.addObserver("drawPages");
        this.helpers.registerHashChangeEvents();
        this.dragReporter = new DV.DragReporter(this, ".DV-pageCollection", DV.jQuery.proxy(this.helpers.shift, this), {
            ignoreSelector: ".DV-annotationContent"
        });
        this.helpers.startCheckTimer();
        this.helpers.handleInitialState();
        _.defer(_.bind(this.helpers.autoZoomPage, this.helpers))
    },
    ViewAnnotation: function () {
        this.helpers.reset();
        this.helpers.ensureAnnotationImages();
        this.activeAnnotationId = null;
        this.acceptInput.deny();
        if (DV.jQuery.browser.msie) {
            this.elements.annotations.css({
                zoom: 0
            });
            this.elements.annotations.css({
                zoom: 1
            })
        }
        this.helpers.toggleContent("viewAnnotations");
        this.compiled.next();
        return true
    },
    ViewDocument: function () {
        this.helpers.reset();
        this.helpers.addObserver("drawPages");
        this.dragReporter.setBinding();
        this.elements.window.mouseleave(DV.jQuery.proxy(this.dragReporter.stop, this.dragReporter));
        this.acceptInput.allow();
        this.helpers.toggleContent("viewDocument");
        this.helpers.setActiveChapter(this.models.chapters.getChapterId(this.models.document.currentIndex()));
        this.helpers.jump(this.models.document.currentIndex());
        return true
    },
    ViewEntity: function (a, c, b) {
        this.helpers.reset();
        this.helpers.toggleContent("viewSearch");
        this.helpers.showEntity(a, c, b)
    },
    ViewSearch: function () {
        this.helpers.reset();
        if (this.elements.searchInput.val() == "") {
            this.elements.searchInput.val(a)
        } else {
            var a = this.elements.searchInput.val()
        }
        this.helpers.getSearchResponse(a);
        this.acceptInput.deny();
        this.helpers.toggleContent("viewSearch");
        return true
    },
    ViewText: function () {
        this.helpers.reset();
        this.acceptInput.allow();
        this.pageSet.zoomText();
        this.helpers.toggleContent("viewText");
        this.events.loadText();
        return true
    },
    ViewThumbnails: function () {
        this.helpers.reset();
        this.helpers.toggleContent("viewThumbnails");
        this.thumbnails = new DV.Thumbnails(this);
        this.thumbnails.render();
        return true
    }
};
DV.Api = function (a) {
    this.viewer = a
};
DV.Api.prototype = {
    currentPage: function () {
        return this.viewer.models.document.currentPage()
    },
    setCurrentPage: function (a) {
        this.viewer.helpers.jump(a - 1)
    },
    onPageChange: function (a) {
        this.viewer.models.document.onPageChangeCallbacks.push(a)
    },
    getPageNumberForId: function (b) {
        var a = this.viewer.pageSet.pages[b];
        return a.index + 1
    },
    getSchema: function () {
        return this.viewer.schema.document
    },
    getId: function () {
        return this.viewer.schema.document.id
    },
    getModelId: function () {
        return parseInt(this.getId(), 10)
    },
    currentZoom: function () {
        var a = this.viewer.models.document;
        return a.zoomLevel / a.ZOOM_RANGES[1]
    },
    relativeZoom: function () {
        var b = this.viewer.models;
        var a = this.currentZoom();
        return a * (b.document.ZOOM_RANGES[1] / b.pages.BASE_WIDTH)
    },
    numberOfPages: function () {
        return this.viewer.models.document.totalPages
    },
    getContributor: function () {
        return this.viewer.schema.document.contributor
    },
    getContributorOrganization: function () {
        return this.viewer.schema.document.contributor_organization
    },
    setSections: function (a) {
        a = _.sortBy(a, function (b) {
            return b.page
        });
        this.viewer.schema.data.sections = a;
        this.viewer.models.chapters.loadChapters();
        this.redraw()
    },
    getSections: function () {
        return _.clone(this.viewer.schema.data.sections || [])
    },
    getDescription: function () {
        return this.viewer.schema.document.description
    },
    setDescription: function (a) {
        this.viewer.schema.document.description = a;
        this.viewer.$(".DV-description").remove();
        this.viewer.$(".DV-navigation").prepend(JST.descriptionContainer({
            description: a
        }));
        this.viewer.helpers.displayNavigation()
    },
    getRelatedArticle: function () {
        return this.viewer.schema.document.resources.related_article
    },
    setRelatedArticle: function (a) {
        this.viewer.schema.document.resources.related_article = a;
        this.viewer.$(".DV-storyLink a").attr({
            href: a
        });
        this.viewer.$(".DV-storyLink").toggle(!!a)
    },
    getPublishedUrl: function () {
        return this.viewer.schema.document.resources.published_url
    },
    setPublishedUrl: function (a) {
        this.viewer.schema.document.resources.published_url = a
    },
    getTitle: function () {
        return this.viewer.schema.document.title
    },
    setTitle: function (a) {
        this.viewer.schema.document.title = a;
        document.title = a
    },
    getSource: function () {
        return this.viewer.schema.document.source
    },
    setSource: function (a) {
        this.viewer.schema.document.source = a
    },
    getPageText: function (a) {
        return this.viewer.schema.text[a - 1]
    },
    setPageText: function (b, a) {
        this.viewer.schema.text[a - 1] = b
    },
    resetPageText: function (c) {
        var a = this;
        var b = this.viewer.schema.text;
        if (c) {
            this.viewer.models.document.originalPageText = {}
        } else {
            _.each(this.viewer.models.document.originalPageText, function (d, e) {
                e = parseInt(e, 10);
                if (d != b[e - 1]) {
                    a.setPageText(d, e);
                    if (e == a.currentPage()) {
                        a.viewer.events.loadText()
                    }
                }
            })
        } if (this.viewer.openEditor == "editText") {
            this.viewer.$(".DV-textContents").attr("contentEditable", true).addClass("DV-editing")
        }
    },
    redraw: function (a) {
        if (a) {
            this.viewer.models.annotations.renderAnnotations();
            this.viewer.models.document.computeOffsets()
        }
        this.viewer.helpers.renderNavigation();
        this.viewer.helpers.renderComponents();
        if (a) {
            this.viewer.elements.window.removeClass("DV-coverVisible");
            this.viewer.pageSet.buildPages({
                noNotes: true
            });
            this.viewer.pageSet.reflowPages()
        }
    },
    getAnnotationsBySortOrder: function () {
        return this.viewer.models.annotations.sortAnnotations()
    },
    getAnnotationsByPageIndex: function (a) {
        return this.viewer.models.annotations.getAnnotations(a)
    },
    getAnnotation: function (a) {
        return this.viewer.models.annotations.getAnnotation(a)
    },
    addAnnotation: function (a) {
        a = this.viewer.schema.loadAnnotation(a);
        this.viewer.models.annotations.sortAnnotations();
        this.redraw(true);
        this.viewer.pageSet.showAnnotation(a, {
            active: true,
            edit: true
        });
        return a
    },
    onAnnotationSave: function (a) {
        this.viewer.models.annotations.saveCallbacks.push(a)
    },
    onAnnotationDelete: function (a) {
        this.viewer.models.annotations.deleteCallbacks.push(a)
    },
    setConfirmStateChange: function (a) {
        this.viewer.confirmStateChange = a
    },
    onChangeState: function (a) {
        this.viewer.onStateChangeCallbacks.push(a)
    },
    getState: function () {
        return this.viewer.state
    },
    setState: function (a) {
        this.viewer.open(a)
    },
    resetRemovedPages: function () {
        this.viewer.models.document.resetRemovedPages()
    },
    addPageToRemovedPages: function (a) {
        this.viewer.models.document.addPageToRemovedPages(a)
    },
    removePageFromRemovedPages: function (a) {
        this.viewer.models.document.removePageFromRemovedPages(a)
    },
    resetReorderedPages: function () {
        this.viewer.models.document.redrawReorderedPages()
    },
    reorderPages: function (c, b) {
        var a = this.getModelId();
        this.viewer.models.document.reorderPages(a, c, b)
    },
    loadJS: function (a, b) {
        DV.jQuery.getScript(a, b)
    },
    roundTabCorners: function () {
        var a = this.viewer.$(".DV-views > div:visible");
        a.first().addClass("DV-first");
        a.last().addClass("DV-last")
    },
    registerHashListener: function (a, b) {
        this.viewer.history.register(a, b)
    },
    clearHashListeners: function () {
        this.viewer.history.defaultCallback = null;
        this.viewer.history.handlers = []
    },
    unload: function (a) {
        this.viewer.helpers.unbindEvents();
        DV.jQuery(".DV-docViewer", this.viewer.options.container).remove();
        this.viewer.helpers.stopCheckTimer();
        delete DV.viewers[this.viewer.schema.document.id]
    },
    enterRemovePagesMode: function () {
        this.viewer.openEditor = "removePages"
    },
    leaveRemovePagesMode: function () {
        this.viewer.openEditor = null
    },
    enterAddPagesMode: function () {
        this.viewer.openEditor = "addPages"
    },
    leaveAddPagesMode: function () {
        this.viewer.openEditor = null
    },
    enterReplacePagesMode: function () {
        this.viewer.openEditor = "replacePages"
    },
    leaveReplacePagesMode: function () {
        this.viewer.openEditor = null
    },
    enterReorderPagesMode: function () {
        this.viewer.openEditor = "reorderPages";
        this.viewer.elements.viewer.addClass("DV-reorderPages")
    },
    leaveReorderPagesMode: function () {
        this.resetReorderedPages();
        this.viewer.openEditor = null;
        this.viewer.elements.viewer.removeClass("DV-reorderPages")
    },
    enterEditPageTextMode: function () {
        this.viewer.openEditor = "editText";
        this.viewer.events.loadText()
    },
    leaveEditPageTextMode: function () {
        this.viewer.openEditor = null;
        this.resetPageText()
    }
};
DV.DocumentViewer = function (a) {
    this.options = a;
    this.window = window;
    this.$ = this.jQuery;
    this.schema = new DV.Schema();
    this.api = new DV.Api(this);
    this.history = new DV.History(this);
    this.models = this.schema.models;
    this.events = _.extend({}, DV.Schema.events);
    this.helpers = _.extend({}, DV.Schema.helpers);
    this.states = _.extend({}, DV.Schema.states);
    this.isFocus = true;
    this.openEditor = null;
    this.confirmStateChange = null;
    this.activeElement = null;
    this.observers = [];
    this.windowDimensions = {};
    this.scrollPosition = null;
    this.checkTimer = {};
    this.busy = false;
    this.annotationToLoadId = null;
    this.dragReporter = null;
    this.compiled = {};
    this.tracker = {};
    this.onStateChangeCallbacks = [];
    this.events = _.extend(this.events, {
        viewer: this,
        states: this.states,
        elements: this.elements,
        helpers: this.helpers,
        models: this.models,
        compile: function () {
            var b = this.viewer;
            var c = arguments[0];
            return function () {
                if (!b.events[b.state][c]) {
                    b.events[c].apply(b.events, arguments)
                } else {
                    b.events[b.state][c].apply(b.events, arguments)
                }
            }
        }
    });
    this.helpers = _.extend(this.helpers, {
        viewer: this,
        states: this.states,
        elements: this.elements,
        events: this.events,
        models: this.models
    });
    this.states = _.extend(this.states, {
        viewer: this,
        helpers: this.helpers,
        elements: this.elements,
        events: this.events,
        models: this.models
    })
};
DV.DocumentViewer.prototype.loadModels = function () {
    this.models.chapters = new DV.model.Chapters(this);
    this.models.document = new DV.model.Document(this);
    this.models.pages = new DV.model.Pages(this);
    this.models.annotations = new DV.model.Annotations(this);
    this.models.removedPages = {}
};
DV.DocumentViewer.prototype.open = function (b) {
    if (this.state == b) {
        return
    }
    var a = _.bind(function () {
        this.state = b;
        this.states[b].apply(this, arguments);
        this.slapIE();
        this.notifyChangedState();
        return true
    }, this);
    this.confirmStateChange ? this.confirmStateChange(a) : a()
};
DV.DocumentViewer.prototype.slapIE = function () {
    DV.jQuery(this.options.container).css({
        zoom: 0.99
    }).css({
        zoom: 1
    })
};
DV.DocumentViewer.prototype.notifyChangedState = function () {
    _.each(this.onStateChangeCallbacks, function (a) {
        a()
    })
};
DV.DocumentViewer.prototype.recordHit = function (b) {
    var d = window.location;
    var a = d.protocol + "//" + d.host + d.pathname;
    if (a.match(/^file:/)) {
        return false
    }
    a = a.replace(/[\/]+$/, "");
    var e = parseInt(this.api.getId(), 10);
    var c = encodeURIComponent("document:" + e + ":" + a);
    DV.jQuery(document.body).append('<img alt="" width="1" height="1" src="' + b + "?key=" + c + '" />')
};
DV.DocumentViewer.prototype.jQuery = function (a, b) {
    b = b || this.options.container;
    return DV.jQuery.call(DV.jQuery, a, b)
};
DV.load = function (a, c) {
    c = c || {};
    var g = a.id || a.match(/([^\/]+)(\.js|\.json)$/)[1];
    if ("showSidebar" in c) {
        c.sidebar = c.showSidebar
    }
    var e = {
        container: document.body,
        zoom: "auto",
        sidebar: true
    };
    c = _.extend({}, e, c);
    c.fixedSize = !!(c.width || c.height);
    var f = new DV.DocumentViewer(c);
    DV.viewers[g] = f;
    var b = DV.loadJSON = function (h) {
        var i = DV.viewers[h.id];
        i.schema.importCanonicalDocument(h);
        i.loadModels();
        DV.jQuery(function () {
            i.open("InitialLoad");
            if (c.afterLoad) {
                c.afterLoad(i)
            }
            if (DV.afterLoad) {
                DV.afterLoad(i)
            }
            if (DV.recordHit) {
                i.recordHit(DV.recordHit)
            }
        })
    };
    var d = function () {
        if (_.isString(a)) {
            if (a.match(/\.js$/)) {
                DV.jQuery.getScript(a)
            } else {
                var h = f.helpers.isCrossDomain(a);
                if (h) {
                    a = a + "?callback=?"
                }
                DV.jQuery.getJSON(a, b)
            }
        } else {
            b(a)
        }
    };
    if (c.templates) {
        DV.jQuery.getScript(c.templates, d)
    } else {
        d()
    }
    return f
};
if (DV.onload) {
    _.defer(DV.onload)
};
(function () {
    window.JST = window.JST || {};
    window.JST.annotation = _.template('<div class="DV-annotation <%= orderClass %> <%= accessClass %> <% if (owns_note) { %>DV-ownsAnnotation<% } %>" style="top:<%= top %>px;" id="DV-annotation-<%= id %>" data-id="<%= id %>">\n\n  <div class="DV-annotationTab" style="top:<%= tabTop %>px;">\n    <div class="DV-annotationClose DV-trigger">\n      <% if (access == \'exclusive\') { %>\n        <div class="DV-annotationDraftDot DV-editHidden"></div>\n      <% } %>\n    </div>\n  </div>\n\n  <div class="DV-annotationRegion" style="margin-left:<%= excerptMarginLeft - 4 %>px; height:<%= excerptHeight %>px; width:<%= excerptWidth - 1 %>px;">\n    <div class="<%= accessClass %>">\n      <div class="DV-annotationEdge DV-annotationEdgeTop"></div>\n      <div class="DV-annotationEdge DV-annotationEdgeRight"></div>\n      <div class="DV-annotationEdge DV-annotationEdgeBottom"></div>\n      <div class="DV-annotationEdge DV-annotationEdgeLeft"></div>\n      <div class="DV-annotationCorner DV-annotationCornerTopLeft"></div>\n      <div class="DV-annotationCorner DV-annotationCornerTopRight"></div>\n      <div class="DV-annotationCorner DV-annotationCornerBottomLeft"></div>\n      <div class="DV-annotationCorner DV-annotationCornerBottomRight"></div>\n    </div>\n    <div class="DV-annotationRegionExclusive"></div>\n  </div>\n\n\n  <div class="DV-annotationContent">\n\n    <div class="DV-annotationHeader DV-clearfix">\n      <div class="DV-pagination DV-editHidden">\n        <span class="DV-trigger DV-annotationPrevious" title="Previous Annotation">Previous</span>\n        <span class="DV-trigger DV-annotationNext" title="Next Annotation">Next</span>\n      </div>\n      <div class="DV-annotationGoto DV-editHidden"><div class="DV-trigger">p. <%= pageNumber %></div></div>\n      <div class="DV-annotationTitle DV-editHidden"><%= title %></div>\n      <input class="DV-annotationTitleInput DV-editVisible" type="text" placeholder="Annotation Title" value="<%= title.replace(/"/g, \'&quot;\') %>" />\n      <% if (access == \'exclusive\') { %>\n        <div class="DV-annotationDraftLabel DV-editHidden DV-interface">Draft</div>\n      <% } else if (access == \'private\') { %>\n        <div class="DV-privateLock DV-editHidden" title="Private note"></div>\n      <% } %>\n      <span class="DV-permalink DV-editHidden" title="Link to this note"></span>\n      <div class="DV-showEdit DV-editHidden <%= accessClass %>"></div>\n    </div>\n\n\n    <div class="DV-annotationExcerpt" style="height:<%= excerptHeight %>px;">\n      <div class="DV-annotationExcerptImageTop" style="height:<%= excerptHeight %>px; width:<%= excerptWidth %>px;left:<%= excerptMarginLeft - 1 %>px;">\n\n        <img class="DV-img" src="<%= image %>" style="left:<%= -(excerptMarginLeft + 1) %>px; top:-<%= imageTop %>px;" width="<%= imageWidth %>" />\n\n      </div>\n      <div class="DV-annotationExcerptImage" style="height:<%= excerptHeight %>px;">\n        <img class="DV-img" src="<%= image %>" style="top:-<%= imageTop %>px;" width="<%= imageWidth %>" />\n      </div>\n    </div>\n\n    <div class="DV-annotationBody DV-editHidden">\n      <%= text %>\n    </div>\n    <textarea class="DV-annotationTextArea DV-editVisible" style="width: <%= bWidth %>px;"><%= text %></textarea>\n\n    <div class="DV-annotationMeta <%= accessClass %>">\n      <% if (author) { %>\n        <div class="DV-annotationAuthor DV-interface DV-editHidden">\n          Annotated by: <%= author %><% if (author_organization) { %>, <i><%= author_organization %></i><% } %>\n        </div>\n      <% } %>\n      <% if (access == \'exclusive\') { %>\n        <div class="DV-annotationWarning DV-interface DV-editHidden">\n          This draft is only visible to you and collaborators.\n        </div>\n      <% } else if (access == \'private\') { %>\n        <div class="DV-annotationWarning DV-interface DV-editHidden">\n          This private note is only visible to you.\n        </div>\n      <% } %>\n      <div class="DV-annotationEditControls DV-editVisible">\n        <div class="DV-clearfix">\n          <div class="minibutton warn DV-deleteAnnotation float_left">Delete</div>\n          <div class="minibutton default DV-saveAnnotation float_right">\n            <% if (access == \'exclusive\') { %>\n              Publish\n            <% } else { %>\n              Save\n            <% } %>\n          </div>\n          <% if (access == \'public\' || access == \'exclusive\') { %>\n            <div class="minibutton DV-saveAnnotationDraft float_right">Save as Draft</div>\n          <% } %>\n          <div class="minibutton DV-cancelEdit float_right">Cancel</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n');
    window.JST.annotationNav = _.template('<div class="DV-annotationMarker" id="DV-annotationMarker-<%= id %>">\n  <span class="DV-trigger">\n    <span class="DV-navAnnotationTitle"><%= title %></span>&nbsp;<span class="DV-navPageNumber">p.<%= page %></span>\n  </span>\n</div>');
    window.JST.chapterNav = _.template('<div id="DV-chapter-<%= id %>" class="DV-chapter <%= navigationExpanderClass %>">\n  <div class="DV-first">\n    <%= navigationExpander %>\n    <span class="DV-trigger">\n      <span class="DV-navChapterTitle"><%= title %></span>&nbsp;<span class="DV-navPageNumber">p.&nbsp;<%= pageNumber %></span>\n    </span>\n  </div>\n  <%= noteViews %>\n</div>');
    window.JST.descriptionContainer = _.template('<% if (description) { %>\n  <div class="DV-description">\n    <div class="DV-descriptionHead">\n      <span class="DV-descriptionToggle DV-showDescription DV-trigger"> Toggle Description</span>\n      Description\n    </div>\n    <div class="DV-descriptionText"><%= description %></div>\n  </div>\n<% } %>\n');
    window.JST.footer = _.template('<% if (!options.sidebar) { %>\n  <div class="DV-footer">\n    <div class="DV-fullscreenContainer"></div>\n    <div class="DV-navControlsContainer"></div>\n  </div>\n<% } %>');
    window.JST.fullscreenControl = _.template('<div class="DV-fullscreen" title="View Document in Fullscreen"></div>\n');
    window.JST.header = _.template('<div class="DV-header">\n  <div class="DV-headerHat" class="DV-clearfix">\n    <div class="DV-branding">\n      <% if (story_url) { %>\n        <span class="DV-storyLink"><%= story_url %></span>\n      <% } %>\n    </div>\n    <div class="DV-title">\n      <%= title %>\n    </div>\n  </div>\n\n  <div class="DV-controls">\n    \n    <div class="DV-views">\n      <div class="DV-documentView"><span class="DV-trigger DV-selected">Document</span></div>\n      <div class="DV-thumbnailsView"><span class="DV-trigger">Pages</span></div>\n      <div style="display:none;" class="DV-annotationView"><span class="DV-trigger">Notes</span></div>\n      <div class="DV-textView"><span class="DV-trigger">Text</span></div>\n    </div>\n\n    <div class="DV-collapsibleControls">\n\n      <div class="DV-searchBox DV-clearfix">\n        <form action="#" method="get" class="DV-searchDocument">\n          <div class="DV-searchInputWrap">\n            <div class="DV-searchInput-cancel"></div>\n            <input class="DV-searchInput" type="text" autosave="DV-<%= id %>" results="10" placeholder="Search" />\n          </div>\n        </form>\n      </div>\n      \n      <div class="DV-zoomControls">\n        <span class="DV-zoomLabel">Zoom</span>\n        <div class="DV-zoomBox"></div>\n      </div>\n      \n    </div>\n    \n  </div>\n\n</div>');
    window.JST.navControls = _.template('<div class="DV-navControls DV-clearfix">\n  <span class="DV-trigger DV-previous">&laquo;</span>\n  <div class="DV-clearfix DV-pageNumberContainer">\n    <span class="DV-currentPagePrefix">Page</span>\n    <span class="DV-currentAnnotationPrefix">Note&nbsp;</span>\n    <span class="DV-currentPage">1</span>\n    <span class="DV-currentPageSuffix">of&nbsp;\n      <span class="DV-totalPages"><%= totalPages %></span>\n      <span class="DV-totalAnnotations"><%= totalAnnotations %></span>                        \n    </span>\n  </div>\n  <span class="DV-trigger DV-next">&raquo;</span>\n</div>');
    window.JST.navigationExpander = _.template('<span class="DV-trigger DV-expander">Expand</span>');
    window.JST.pageAnnotation = _.template('<div class="DV-annotation DV-pageNote <%= orderClass %> <%= accessClass %> <% if (owns_note) { %>DV-ownsAnnotation<% } %>" style="top:<%= top %>px;" id="DV-annotation-<%= id %>" data-id="<%= id %>">\n  <div class="DV-annotationTab">\n    <div class="DV-annotationClose DV-trigger">p. <%= pageNumber %></div>\n  </div>\n\n  <div class="DV-annotationContent">\n    <!-- Header -->\n    <div class="DV-annotationHeader DV-clearfix">\n      <div class="DV-pagination DV-editHidden">\n        <span class="DV-trigger DV-annotationPrevious" title="Previous Annotation">Previous</span>\n        <span class="DV-trigger DV-annotationNext" title="Next Annotation">Next</span>\n      </div>\n      <div class="DV-annotationGoto DV-editHidden"><div class="DV-trigger">p. <%= pageNumber %></div></div>\n      <div class="DV-annotationTitle DV-editHidden"><%= title %></div>\n      <input class="DV-annotationTitleInput DV-editVisible" type="text" placeholder="Annotation Title" value="<%= title.replace(/"/g, \'&quot;\') %>" />\n      <% if (access == \'exclusive\') { %>\n        <div class="DV-annotationDraftLabel DV-editHidden DV-interface">Draft</div>\n      <% } else if (access == \'private\') { %>\n        <div class="DV-privateLock DV-editHidden" title="Private note"></div>\n      <% } %>\n      <span class="DV-permalink DV-editHidden" title="Link to this note"></span>\n      <div class="DV-showEdit DV-editHidden <%= accessClass %>"></div>\n    </div>\n\n    <div class="DV-annotationBody DV-editHidden">\n      <%= text %>\n    </div>\n    <textarea class="DV-annotationTextArea DV-editVisible" style="width: <%= bWidth %>px;"><%= text %></textarea>\n\n    <div class="DV-annotationMeta <%= accessClass %>">\n      <% if (author) { %>\n        <div class="DV-annotationAuthor DV-interface DV-editHidden">\n          Annotated by: <%= author %><% if (author_organization) { %>, <i><%= author_organization %></i><% } %>\n        </div>\n      <% } %>\n      <% if (access == \'exclusive\') { %>\n        <div class="DV-annotationWarning DV-interface DV-editHidden">\n          This draft is only visible to you and collaborators.\n        </div>\n      <% } else if (access == \'private\') { %>\n        <div class="DV-annotationWarning DV-interface DV-editHidden">\n          This private note is only visible to you.\n        </div>\n      <% } %>\n      <div class="DV-annotationEditControls DV-editVisible">\n        <div class="DV-clearfix">\n          <div class="minibutton warn DV-deleteAnnotation float_left">Delete</div>\n          <div class="minibutton default DV-saveAnnotation float_right">\n            <% if (access == \'exclusive\') { %>\n              Publish\n            <% } else { %>\n              Save\n            <% } %>\n          </div>\n          <% if (access == \'public\' || access == \'exclusive\') { %>\n            <div class="minibutton DV-saveAnnotationDraft float_right">Save as Draft</div>\n          <% } %>\n          <div class="minibutton DV-cancelEdit float_right">Cancel</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n');
    window.JST.pages = _.template('<div class="DV-set p<%= pageIndex %>" data-id="p<%= pageIndex %>" style="top:0;left:0px;height:893px;width:700px;">\n  <div class="DV-overlay"></div>\n  <div class="DV-pageNoteInsert" title="Click to Add a Page Note">\n    <div class="DV-annotationTab">\n      <div class="DV-annotationClose"></div>\n    </div>\n    <div class="DV-annotationDivider"></div>\n  </div>\n  <div class="DV-pageMeta"><span class="DV-pageNumber">p. <%= pageNumber %></span></div>\n  <div class="DV-annotations"></div>\n  <div class="DV-page" style="height:863px;width:700px;">\n    <span class="DV-loading-top">Loading</span>\n    <span class="DV-loading-bottom">Loading</span>\n    <div class="DV-cover"></div>\n    <img class="DV-pageImage" <%= pageImageSource ? \'src="\' + pageImageSource + \'"\' : \'\' %> height="863" />\n  </div>\n</div>');
    window.JST.thumbnails = _.template('<% for (; page <= endPage; page++) { %>\n  <% var url = imageUrl.replace(/{page}/, page) ; %>\n  <div class="DV-thumbnail" id="DV-thumbnail-<%= page %>" data-pageNumber="<%= page %>">\n    <div class="DV-overlay">\n      <div class=\'DV-caret\'></div>\n    </div>\n    <div class="DV-thumbnail-page">\n      <div class="DV-thumbnail-select">\n        <div class="DV-thumbnail-shadow"></div>\n        <img class="DV-thumbnail-image" data-src="<%= url %>" />\n      </div>\n      <div class="DV-pageNumber DV-pageMeta"><span class="DV-pageNumberText"><span class="DV-pageNumberTextUnderline">p. <%= page %></span></span></div>\n    </div>\n  </div>\n<% } %>\n');
    window.JST.unsupported = _.template('<div class="DV-unsupported">\n  <div class="DV-intro">\n    <% if (viewer.schema.document.resources && viewer.schema.document.resources.pdf) { %>\n      <a href="<%= viewer.schema.document.resources.pdf %>">Download this document as a PDF</a>\n    <% } %>\n    <br />\n    <br />\n    To use the Document Viewer you need to<br /> upgrade your browser:\n  </div>\n  <div class="DV-browsers">\n    <div class="DV-browser">\n      <a href="http://www.google.com/chrome">\n        <div class="DV-image DV-chrome"> </div>Chrome\n      </a>\n    </div>\n    <div class="DV-browser">\n      <a href="http://www.apple.com/safari/download/">\n        <div class="DV-image DV-safari"> </div>Safari\n      </a>\n    </div>\n    <div class="DV-browser">\n      <a href="http://www.mozilla.com/en-US/firefox/firefox.html">\n        <div class="DV-image DV-firefox"> </div>Firefox\n      </a>\n    </div>\n    <br style="clear:both;" />\n  </div>\n  <div class="DV-after">\n    Or, if you\'d like to continue using Internet Explorer 6,<br /> you can\n    <a href="http://www.google.com/chromeframe">install Google Chrome Frame</a>.\n  </div>\n</div>\n');
    window.JST.viewer = _.template('<!--[if lte IE 8]><div class="DV-docViewer DV-clearfix DV-viewDocument DV-ie <% if (autoZoom) { %>DV-autoZoom<% } %> <% if (mini) { %>DV-mini<% } %> <% if (!options.sidebar) { %>DV-hideSidebar<% } else { %>DV-hideFooter<% } %>"><![endif]-->\n<!--[if (!IE)|(gte IE 9)]><!--><div class="DV-docViewer DV-clearfix DV-viewDocument <% if (autoZoom) { %>DV-autoZoom<% } %> <% if (mini) { %>DV-mini<% } %> <% if (!options.sidebar) { %>DV-hideSidebar<% } else { %>DV-hideFooter<% } %>"><!-- <![endif]-->\n  \n  <div class="DV-docViewerWrapper">\n  \n    <%= header %>\n    <div class="DV-docViewer-Container">\n    \n      <div class="DV-searchBarWrapper">\n        <div class="DV-searchBar">\n          <span class="DV-trigger DV-closeSearch">CLOSE</span>\n          <div class="DV-searchPagination DV-foundResult">\n            <div class="DV-searchResults">\n              <span class="DV-resultPrevious DV-trigger">Previous</span>\n              <span class="DV-currentSearchResult"></span>\n              <span class="DV-totalSearchResult"></span>\n              <span> for &ldquo;<span class="DV-searchQuery"></span>&rdquo;</span>\n              <span class="DV-resultNext DV-trigger">Next</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    \n      <div class="DV-pages <% if (!options.sidebar) { %>DV-hide-sidebar<% } %>">\n        <div class="DV-paper">\n          <div class="DV-thumbnails"></div>\n          <div class="DV-pageCollection">\n            <div class="DV-bar" style=""></div>\n            <div class="DV-allAnnotations">\n            </div>\n            <div class="DV-text">\n              <div class="DV-textSearch DV-clearfix">\n          \n              </div>\n              <div class="DV-textPage">\n                <span class="DV-textCurrentPage"></span>\n                <pre class="DV-textContents"></pre>\n              </div>\n            </div>\n            <%= pages %>\n          </div>\n        </div>\n      </div>\n    \n      <div width="265px" class="DV-sidebar <% if (!options.sidebar) { %>DV-hide<% } %>" style="display:none;">\n        <div class="DV-well">\n    \n          <div class="DV-sidebarSpacer"></div>\n          \n          <% if (options.sidebar) { %>\n            <div class="DV-navControlsContainer">\n            </div>\n          <% } %>\n              \n          <div class="DV-navigation">\n            <%= descriptionContainer %>\n            <div class="DV-contentsHeader">Contents</div>\n            <div class="DV-chaptersContainer">\n            </div>\n            <div class="DV-supplemental">\n        <div class="DV-fullscreen" title="View Document in Fullscreen"></div><a class="close-fullscreen" href="#" title="Close Fullscreen">Close Fullscreen</a>      <% if (pdf_url) { %>\n                <div class="DV-pdfLink"><%= pdf_url %></div>\n              <% } %>\n              <% if (print_notes_url) { %>\n                <div class="DV-printNotesLink">\n                  <a target="_blank" href="<%= print_notes_url %>">Print Notes &raquo;</a>\n                </div>\n              <% } %>\n              <div class="DV-storyLink" style="<%= story_url ? \'\' : \'display:none\' %>">\n                <a target="_blank" href="<%= story_url %>">Related Article &raquo;</a>\n              </div>\n        <% if (contributors) { %>\n                <div class="DV-contributor">Contributed by: <%= contributors %></div>\n              <% } %>\n            </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \n    <%= footer %>\n    \n  </div>\n  \n  <div class="DV-printMessage">\n    To print the document, click the "Original Document" link to open the original \n    PDF. At this time it is not possible to print the document with annotations.\n  </div>\n\n</div>\n')
})();