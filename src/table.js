var Table = (function (d3) {
    "use strict"

    var toString = Object.prototype.toString

    function Table (config) {
        this.init(config)
    }

    Table.prototype = {
        init: function (config) {
            this.config = config
            this.tooltip = config.tooltip
            this.numCol = config.numCol
            this.header = config.header
            this.table = this.body = this.tp = this.tooltip = null
            config.className || (config.className = "rtb")
            this._makeTable(config.wrapper)
            if (_isFunction(config.tooltip)) {
                this.tooltip = config.tooltip
                this.makeTooltip()
            }
        },

        _makeTable: function (wrapper) {
            // make table
            var t = this.table = _make("table", null, this.config.className)
            var h

            // append header
            t.appendChild(h = _make("thead"))
            // header is of one row
            h.appendChild(_makeRow(this.header))
            t.appendChild(this.body = _make("tbody"))
            wrapper.appendChild(this.table)
        },

        addRow: function (content) {
            var r = _makeRow(content, this.numCol)
            r.__data__ = content
            this.body.appendChild(r)
            return r
        },

        makeTooltip: function () {
            this.tp = _make("div", "rtb-tooltip", "rtp-tooltip-hidden")
            this.table.parentNode.appendChild(this.tp)
            this.body.addEventListener("mouseover", tpMouseover(this.tooltip))
            this.body.addEventListener("mouseout", tpMouseout)
        },

        clear: function () {
            this.table.removeChild(this.body)
            this.tp && this.tp.parentNode.removeChild(this.tp)
            this.body = this.tp = null
        },

        destroy: function () {
            this.table.parentNode.removeChild(this.table)
            this.tp && this.tp.parentNode.removeChild(this.tp)
            this.table = this.body = this.header = this.config = this.tp = null
        }
    }

    function _isFunction (obj) {
        return toString.call(obj) === "[object Function]"
    }

    function tpMouseout (e) {
        if (e.target.tagName.toLowerCase() !== "td")
            return
        var t = document.getElementById("rtb-tooltip")
        // t.innerHTML = ''
        t.className = 'rtb-tooltip-hidden'
        t.setAttribute("style", "")
    }

    function tpMouseover (cb) {
        return function (e) {
            if (e.target.tagName.toLowerCase() !== "td")
                return
            var t = document.getElementById("rtb-tooltip")
            // data attached to the row
            t.innerHTML = cb(e.target.parentNode.__data__)
            t.className = "rtb-tooltip"
            t.setAttribute("style", "position:fixed;top:"+e.pageY+"px;left:"+e.pageX+"px;")
        }
    }

    function _makeRow (content, c) {
        var i = 0, len = c || content.length, r = _make("tr")
        for (; i < len; ++i) {
            r.appendChild(_makeCol(content[i]))
        }
        return r
    }


    function _makeCol (text) {
        var t = _make("td")
        t.textContent = text
        return t
    }

    function _make (el, idName, className) {
        var e = document.createElement(el)
        if (idName) e.id = idName
        if (className) e.className = className
        return e
    }

    return Table
}) (d3)