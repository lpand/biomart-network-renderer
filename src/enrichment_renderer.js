var EnrichmentRenderer = NetworkRenderer.extend({

    config: biomart.enrichmentRendererConfig,

    init: function () {
        NetworkRenderer.prototype.init.call(this)
        this.annCount = -1
    },

    makeTable: function (wrapper) {
        // $elem.append('<div id="network-report-table" class="network-report-table"></div>')
        this.table = new Table({
            wrapper: wrapper,
            className: "",
            header: this.header.slice(0, -2).concat([this.header[4]]),
            numCol: 4,
            tooltip: function (data) {
                var i = 0, d = data[4].split(","), len = d.length, b = ""
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

        this.makeTable($('<div class="network-report-table">').appendTo($(domItem))[0])

        this.makeNE(this.rowBuffer)
        this.rowBuffer = []

        fociDraw.call(this)
        $.publish('network.completed')
    },

    // makeNE: function (rows) {
    //     NetworkRenderer.prototype.makeNE.call(this, rows)
    //     for (var i = 0, rLen = rows.length, r; i < rLen && (r = rows[i]); ++i) {
    //         this.table.addRow(this.makeRow(r))
    //     }
    // },

    makeRow: function (row) {
        return row.slice(0, -2).concat([row[4], row[3]])
    },

    insertNodes: function (row, header) {
        var ann, gs, res, index, g, gid, annIdx = 0, genesIdx = 3,
            // p-value index, bonferroni p-value
            pvIdx = 1, bpvIdx = 2, descIdx = 4

        if (++this.annCount >= 5) return []
        //row: [annotation, score, gene list]
        ann = this.findElem(this.nodes, row[annIdx])
        gs = row[genesIdx].split(",")
        res = []

        if (! ann) {
            index = this.nodes.push(ann = this.addProp({}, header[annIdx], row[annIdx])) - 1
            this.addProp(ann, header[pvIdx], row[pvIdx])
            this.addProp(ann, "description", row[descIdx])
            // this.addProp(ann, header[bpvIdx], row[bpvIdx])
            this.addId(ann, row[annIdx])
            ann.index = index
            ann.isHub = true
            // Nodes are sorted by score
            // ann.radius = (row[1] / this.nodes[0][header[1]]) / 700  + 15
        }
        res.push(ann)
        for (var i = 0, len = gs.length; i < len; ++i) {
            g = this.findElem(this.nodes, gid = gs[i])
            if (! g) {
                index = this.nodes.push(g = this.addProp({}, header[genesIdx], gid)) - 1
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
        if (!nodes.length) return []
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
        NetworkRenderer.prototype.clear.call(this)
        // this.table && this.table.destroy()
        // this.table = null
    }
})

biomart.renderer.results.enrichment = new EnrichmentRenderer()
