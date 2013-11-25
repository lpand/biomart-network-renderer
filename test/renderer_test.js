var assert = chai.assert

describe ('BaseNetworkRenderer', function () {
    "use strict";

    // console.log("BaseNetworkRenderer.prototype = ", BaseNetworkRenderer.prototype.addProp)

    var ren = null

    beforeEach(function () {
        ren = new BaseNetworkRenderer()
    })

    it ("has default tagName equal to div", function () {
        assert(ren.tagName === "div")
    })

    describe("#addProp", function () {
        it ("append a new property to the submitted object and returns the object",
            function () {
                var o = {}, oo = ren.addProp(o, 'foo', "42")
                assert.strictEqual(o, oo)
                assert(o.foo === "42")
                assert.isUndefined(o._link, "no other properties added")
        })

        it ("IIF value is a string representig a link, the property value will be the link content and it appends a prop _link with the URL",
            function () {
                var o = {}, oo = ren.addProp(o, 'foo', '<a href="http://google.com/">bar</a>')
                assert.strictEqual(o, oo)
                assert(o.foo === "bar")
                assert(o._link === "http://google.com/")
        })
    })

    describe("#getNeighbors", function () {
        it ("returns the proper list of nodes", function () {
            ren.init()
            var nodes = ren.nodes = [{index: 0}, {index: 1}, {index: 2}]
            ren.edges = [
                { source: nodes[0], target: nodes[1] },
                { source: nodes[0], target: nodes[2] }
            ]

            var adj0 = ren.getNeighbors(0), adj1 = ren.getNeighbors(1),
                adj2 = ren.getNeighbors(2)
            assert.lengthOf(adj0, 2, "proper adjacency length of 1st node")
            assert.include(adj0, nodes[1])
            assert.include(adj0, nodes[2])
            assert.lengthOf(adj1, 1, "proper adjacency length of 2nd node")
            assert.include(adj1, nodes[0])
            assert.lengthOf(adj2, 1, "proper adjacency length of 3rd node")
            assert.include(adj2, nodes[0])
        })
    })

    describe("#printHeader", function () {
        it ("stores the header into a namesake property", function () {
            var h = ["foo", "bar"]
            ren.printHeader(h)
            assert.deepEqual(ren.header, h)
        })
    })

    describe("#makeNE", function () {
        var rows = [["a", "0"], ["b", "1"]]
        var header = ["letter", "number"]
        it ("invokes #insertNodes, #insertEdges with proper args", function () {
            sinon.stub(ren, "insertNodes", function (row, header) {
                var n = {}, m = {}
                this.nodes.push(n)
                this.nodes.push(m)
                n[header[0]] = row[0]
                m[header[1]] = row[1]
                return [n,m]
            })
            sinon.stub(ren, "insertEdges", function (nodes, row, header) {
                this.edges.push({ source: nodes[0], target: nodes[1] })
            })

            ren.init()
            ren.printHeader(header)
            ren.makeNE(rows)
            assert(ren.insertNodes.callCount === rows.length)
            assert(ren.insertEdges.callCount === rows.length)
            assert.deepEqual(ren.nodes, [
                {letter: rows[0][0]}, {number: rows[0][1]},
                {letter: rows[1][0]}, {number: rows[1][1]}
            ], "right nodes")
            assert.deepEqual(ren.edges, [
                {source: ren.nodes[0], target: ren.nodes[1] },
                {source: ren.nodes[2], target: ren.nodes[3] }
            ], "right edges")
        })
    })

    describe("#parse", function () {
        var rows = [["a", "0"], ["b", "1"]], v = [[""]]
        it ("stores rows into a buffer", function () {
            ren.init()
            ren.parse(rows)
            assert.deepEqual(ren.rowBuffer, rows)
            ren.parse(v);
            assert.deepEqual(ren.rowBuffer, rows.concat(v))
        })
    })

    xdescribe("#newTab", function () {
        var $cont = $("div"), $list = $("ul")
    })

    describe("#newSVG", function () {
        var conf = { // dunno why i can't find body
            container: d3.select("html").append("div").node(),
            w: 100, h: 100,
            idName: "ugo", className:"tognazzi"
        }
        it ("creates and appends a new svg, returning a group", function () {
            ren.init()
            var group = ren.newSVG(conf)
            var svg = d3.selectAll("svg")
            assert.equal(svg.size(), 1, "there is only one <svg>")
            assert.equal(svg.attr("id"), conf.idName, "exact id")
            assert.equal(svg.attr("class"), conf.className, "exact class")
            assert.equal(svg.attr("width"), conf.w)
            assert.equal(svg.attr("height"), conf.h)
            assert.equal(group.property("tagName").toLowerCase(), "g", "the element returned is a group")
            assert(group.node().nearestViewportElement === svg.node(),
                "returned element is descendant of the newly create svg")
        })
    })
})

// describe('hyperlinks', function () {
//         var s = d3.select('body').append('sgv:svg')
//         var data = [
//                 {  }
//         ]
// })