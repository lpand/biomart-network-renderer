var EnrichmentRenderer = NetworkRenderer.extend({

    config: biomart.enrichmentRendererConfig,

    makeTable: function (wrapper) {
        // $elem.append('<div id="network-report-table" class="network-report-table"></div>')
        this.table = new Table({
            wrapper: wrapper,
            className: "network-report-table",
            header: this.header.slice(0, -1),
            numCol: 2,
            tooltip: function (data) {
                var i = 0, d = data[2].split(","), len = d.length, b = ""
                for (; i < len; ++i) {
                    b += d[i]+"<br>"
                }
                return b
            }
        })
    },

    draw: function (writee) {
        var domItem = this.newTab(writee, $(this.tabSelector))[0]
        this.group = this.newSVG({
            container: domItem,
            w: "100%",
            h: "100%",
            className: "network-wrapper"
        })
        this.makeTable(domItem)
        this.drawNetwork(this.config)
        // Reset the status for the next draw (tab)
        this.init()

        $.publish('network.completed')
    },

    makeNE: function (rows) {
        this.super_.makeNE.call(this, rows)
        for (var i = 0, rLen = rows.length, r; i < rLen && (r = rows[i]); ++i) {
            this.table.addRow(r)
        }
    },

    insertNodes: function (row, header) {
        //row: [annotation, score, gene list]
        var ann = this.findElem(this.nodes, row[0]),
            gs = row[2].split(","), res = [], index, g, gid
        if (! ann) {
            index = this.nodes.push(ann = this.addProp({}, header[0], row[0])) - 1
            this.addId(ann, row[0])
            ann.index = index
            ann.radius = row[1] * 50
        }
        res.push(ann)
        for (var i = 0, len = gs.length; i < len; ++i) {
            g = this.findElem(this.nodes, gid = gs[i])
            if (! g) {
                index = this.nodes.push(g = this.addProp({}, header[2], gid)) - 1
                this.addId(g, gid)
                g.index = index
                g.radius = 8
            }
            res.push(g)
        }
        return res
    },

    insertEdges: function (nodes, row, header) {
        //nodes: [ann, g0, g1, ...]
        //row/header: [annotation, score, gene list]
        var ann = nodes[0], annId = ann._id, eid, g, e, res = []
        for (var i = 1, len = nodes.length; i < len; ++i) {
            e = this.findElem(this.edges, eid = annId + (g = nodes[i])._id)
            if (! e) {
                this.edges.push(e = {source: ann, target: g, _id: annId+g._id })
                res.push(e)
            }
        }
        return res
    },

    clustering: function (struct) {
        struct.wk = 7
        cluster(struct)
    },

    clear: function () {
        this.super_.clear.call(this)
        this.table && this.table.destroy()
        this.table = null
    }
})

biomart.renderer.results.enrichment = new EnrichmentRenderer()
