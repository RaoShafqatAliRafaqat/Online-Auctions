tinymce.PluginManager.add("toc", function(e) {
    function t(t) {
        return e.schema.isValidChild("div", t)
    }

    function n(t) {
        return t && e.dom.is(t, "." + d.className) && e.getBody().contains(t)
    }

    function r() {
        var t = this;
        t.disabled(e.readonly || !o()), e.on("LoadContent SetContent change", function() {
            t.disabled(e.readonly || !o())
        })
    }

    function i(e) {
        var t, n = [];
        for (t = 1; t <= e; t++) n.push("h" + t);
        return n.join(",")
    }

    function o() {
        return !(!d || !a(d).length)
    }

    function a(t) {
        var n = i(t.depth),
            r = f(n);
        return r.length && /^h[1-9]$/i.test(t.headerTag) && (r = r.filter(function(n, r) {
            return !e.dom.hasClass(r.parentNode, t.className)
        })), tinymce.map(r, function(e) {
            return e.id || (e.id = g()), {
                id: e.id,
                level: parseInt(e.nodeName.replace(/^H/i, ""), 10),
                title: f.text(e)
            }
        })
    }

    function s(e) {
        var t, n = 9;
        for (t = 0; t < e.length; t++)
            if (e[t].level < n && (n = e[t].level), 1 == n) return n;
        return n
    }

    function l(t, n) {
        var r = "<" + t + ' contenteditable="true">',
            i = "</" + t + ">";
        return r + e.dom.encode(n) + i
    }

    function c(e) {
        var t = u(e);
        return '<div class="' + e.className + '" contenteditable="false">' + t + "</div>"
    }

    function u(e) {
        var t, n, r, i, o = "",
            c = a(e),
            u = s(c) - 1;
        if (!c.length) return "";
        for (o += l(e.headerTag, tinymce.translate("Table of Contents")), t = 0; t < c.length; t++) {
            if (r = c[t], i = c[t + 1] && c[t + 1].level, u === r.level) o += "<li>";
            else
                for (n = u; n < r.level; n++) o += "<ul><li>";
            if (o += '<a href="#' + r.id + '">' + r.title + "</a>", i !== r.level && i)
                for (n = r.level; n > i; n--) o += "</li></ul><li>";
            else o += "</li>", i || (o += "</ul>");
            u = r.level
        }
        return o
    }
    var d, f = e.$,
        p = {
            depth: 3,
            headerTag: "h2",
            className: "mce-toc"
        },
        m = function(e) {
            var t = 0;
            return function() {
                var n = (new Date).getTime().toString(32);
                return e + n + (t++).toString(32)
            }
        },
        g = m("mcetoc_");
    e.on("PreInit", function() {
        var n = e.settings,
            r = parseInt(n.toc_depth, 10) || 0;
        d = {
            depth: r >= 1 && r <= 9 ? r : p.depth,
            headerTag: t(n.toc_header) ? n.toc_header : p.headerTag,
            className: n.toc_class ? e.dom.encode(n.toc_class) : p.className
        }
    }), e.on("PreProcess", function(e) {
        var t = f("." + d.className, e.node);
        t.length && (t.removeAttr("contentEditable"), t.find("[contenteditable]").removeAttr("contentEditable"))
    }), e.on("SetContent", function() {
        var e = f("." + d.className);
        e.length && (e.attr("contentEditable", !1), e.children(":first-child").attr("contentEditable", !0))
    });
    var h = function(t) {
        return !t.length || e.dom.getParents(t[0], ".mce-offscreen-selection").length > 0
    };
    e.addCommand("mceInsertToc", function() {
        var t = f("." + d.className);
        h(t) ? e.insertContent(c(d)) : e.execCommand("mceUpdateToc")
    }), e.addCommand("mceUpdateToc", function() {
        var t = f("." + d.className);
        t.length && e.undoManager.transact(function() {
            t.html(u(d))
        })
    }), e.addButton("toc", {
        tooltip: "Table of Contents",
        cmd: "mceInsertToc",
        icon: "toc",
        onPostRender: r
    }), e.addButton("tocupdate", {
        tooltip: "Update",
        cmd: "mceUpdateToc",
        icon: "reload"
    }), e.addContextToolbar(n, "tocupdate"), e.addMenuItem("toc", {
        text: "Table of Contents",
        context: "insert",
        cmd: "mceInsertToc",
        onPostRender: r
    })
});
