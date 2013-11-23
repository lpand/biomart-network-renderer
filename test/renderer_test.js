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

    // it ('caches the header and creates the node accessors when printHeader() is invoked', function () {
    //     nt.printHeader('name age'.split(' '))
    //     expect(nt.header).to.eql(['name', 'age'])

    //     expect(nt.node0).to.exist
    //     expect(nt.node0.key).to.eq('name')
    //     expect(nt.node0.value({'name': 'foo' })).to.eq('foo')
    //     expect(nt.node1).to.exist
    //     expect(nt.node1.key).to.eq('age')
    //     expect(nt.node1.value({'age': 'bar' })).to.eq('bar')
    // })

    // it ('does nothing when clear() is invoked', function() {
    //     nt.clear()
    //     expect(nt._nodes).to.exist
    //     expect(nt._edges).to.exist
    // })

    // it ('get back to a clean state after destroy() is invoked', function () {
    //     nt.destroy()
    //     expect(nt._nodes).to.be.null
    //     expect(nt._edges).to.be.null
    //     expect(nt._svg).to.be.null
    //     expect(nt._visualization).to.be.null
    // })

    // describe ('draw()', function () {
    //     beforeEach(function () {
    //         nt.printHeader('name age'.split(' '))
    //     })

    //     afterEach(function () {
    //         nt.destroy()
    //     })

    //     describe ('invoked with all values', function () {
    //         it ('produces right nodes and edges', function () {
    //             var rows = [
    //                 ['frank', '34'],
    //                 ['frank', '19'],
    //                 ['pam', '53'],
    //                 ['fay', '19']
    //             ]
    //             nt.parse(rows)
    //             nt.draw($('body'))

    //             expect(nt._nodes.length).to.have.length.eq(6)
    //             expect(nt._nodes).to.have.deep.property('[0].name', 'frank')
    //             expect(nt._nodes).to.have.deep.property('[1].age', '34')
    //             expect(nt._nodes).to.have.deep.property('[2].age', '19')
    //             expect(nt._nodes).to.have.deep.property('[3].name', 'pam')
    //             expect(nt._nodes).to.have.deep.property('[4].age', '53')
    //             expect(nt._nodes).to.have.deep.property('[5].name', 'fay')

    //             expect(nt._edges.length).to.have.length.eq(4)
    //             var a = [[0,1],[0,2],[3,4],[5,2]]
    //             for (var i = 0; i < a.length; ++i) {
    //                 expect(nt._edges).to.have.deep.property('['+i+'].source', nt._nodes[a[i][0]])
    //                 expect(nt._edges).to.have.deep.property('['+i+'].target', nt._nodes[a[i][1]])
    //             }
    //         })

    //         it ('if hyperlinks are present produces the right nodes', function () {
    //             var rows = [
    //                 ['jack', '<a href="alink0">cont0</a>'],
    //                 ['jack', '<a href="alink1">cont1</a>'],
    //                 ['jack', '76']
    //             ]

    //             nt.parse(rows)
    //             nt.draw($('body'))
    //             expect(nt._nodes.length).to.have.length.eq(4)
    //             expect(nt._nodes).to.have.deep.property('[0].name', 'jack')
    //             expect(nt._nodes).to.have.deep.property('[1].age', 'cont0')
    //             expect(nt._nodes).to.have.deep.property('[1]._link', 'alink0')
    //             expect(nt._nodes).to.have.deep.property('[2].age', 'cont1')
    //             expect(nt._nodes).to.have.deep.property('[2]._link', 'alink1')
    //             expect(nt._nodes).to.have.deep.property('[3].age', '76')
    //         })
    //     })

    //     describe ('invoked with missing values', function () {
    //         it ('produces proper nodes and edges', function () {
    //             var rows = [
    //                 ['frank', '34'],
    //                 ['pam', '53'],
    //                 ['skylar', ''],
    //                 ['fay', ''],
    //                 ['juliet', '19']
    //             ]
    //             nt.parse(rows)
    //             nt.draw($('body'))
    //             expect(nt._nodes.length).to.have.length.eq(8)
    //             expect(nt._nodes).to.have.deep.property('[0].name', 'frank')
    //             expect(nt._nodes).to.have.deep.property('[1].age', '34')
    //             expect(nt._nodes).to.have.deep.property('[2].name', 'pam')
    //             expect(nt._nodes).to.have.deep.property('[3].age', '53')
    //             expect(nt._nodes).to.have.deep.property('[4].name', 'skylar')
    //             expect(nt._nodes).to.have.deep.property('[5].age', '19')
    //             expect(nt._nodes).to.have.deep.property('[6].name', 'fay')
    //             expect(nt._nodes).to.have.deep.property('[7].name', 'juliet')
    //             expect(nt._edges.length).to.have.length.eq(5)
    //             var a = [[0,1],[2,3],[4,5],[6,5], [7, 5]]
    //             for (var i = 0; i < a.length; ++i) {
    //                 expect(nt._edges).to.have.deep.property('['+i+'].source', nt._nodes[a[i][0]])
    //                 expect(nt._edges).to.have.deep.property('['+i+'].target', nt._nodes[a[i][1]])
    //             }
    //         })
    //     })
    // })

    // it ('creates nodes and edges when rows are provided', function () {
    //         var rows = [
    //                 ['frank', '34'],
    //                 ['jack', '53']
    //         ]

    //         nt.printHeader('name age'.split(' '))
    //         nt.parse(rows)

    //         // I shouldn't test the internals
    //         expect(nt._nodes).toEqual([
    //                 {'name': 'frank'},
    //                 {'age': '34'},
    //                 {'name': 'jack'},
    //                 {'age': '53'}
    //         ])

    //         expect(nt._edges).toEqual([
    //                 { source: nt._nodes[0], target: nt._nodes[1] },
    //                 { source: nt._nodes[2], target: nt._nodes[3] }
    //         ])
    // })

    // it ('correct nodes and edges are created with multiple edges per node', function () {
    //         var rows = [
    //                 ['jack', '53'],
    //                 ['jack', '76']
    //         ]

    //         nt.clear()
    //         nt.printHeader('name age'.split(' '))
    //         nt.parse(rows)

    //         // I shouldn't test the internals
    //         expect(nt._nodes).toEqual([
    //                 {'name': 'jack'},
    //                 {'age': '53'},
    //                 {'age': '76'}
    //         ])

    //         expect(nt._edges).toEqual([
    //                 { source: nt._nodes[0], target: nt._nodes[1] },
    //                 { source: nt._nodes[0], target: nt._nodes[2] }
    //         ])
    // })


    // it ('has an svg and visualization when draw() is invoked', function () {
    //         var rows = [
    //                 ['jack', '53'],
    //                 ['jack', '76']
    //         ]
    //         nt.printHeader('name age'.split(' '))
    //         nt.parse(rows)
    //         nt.draw($('body'))
    //         expect(nt._svg.empty()).toBe(false)
    //         expect(nt._visualization).to.exist
    // })

})

// describe('hyperlinks', function () {
//         var s = d3.select('body').append('sgv:svg')
//         var data = [
//                 {  }
//         ]
// })