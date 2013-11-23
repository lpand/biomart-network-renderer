var assert = chai.assert

describe("EnrichmentRenderer", function () {
    "use strict";

    var ren, header, nodes, edges, rows

    function setUp () {
        ren = new EnrichmentRenderer()
        header = ["ann", "score", "glist"]
        rows = [
            [   "cytoplasm",
                "0.7988158230958072",
                "ENSG00000152213,ENSG00000125877,ENSG00000160224"
            ]
        ]
        nodes = [
            {   _id: "cytoplasm",
                ann:"cytoplasm",
                radius: rows[0][1] * 50,
                index: 0
            },
            {   _id: "ENSG00000152213",
                glist: "ENSG00000152213",
                radius: 8,
                index: 1
            },
            {   _id: "ENSG00000125877",
                glist: "ENSG00000125877",
                radius: 8,
                index: 2
            },
            {   _id: "ENSG00000160224",
                glist: "ENSG00000160224",
                radius: 8,
                index: 3
            }
        ]
        edges = nodes.slice(1).map(function (node, i) {
            return {
                _id: nodes[0]._id+node._id,
                source: nodes[0], target: node
            }
        })
        ren.printHeader(header)
    }

    describe ("creates nodes and edges", function () {
        beforeEach(function() {
            setUp()
        })
        it ("#insertNodes stores and returns proper nodes", function () {
            var res = ren.insertNodes(rows[0], header)
            assert.deepEqual(res, nodes, "returns right nodes")
            assert.deepEqual(ren.nodes, nodes, "it stored the right nodes")
        })
        it ("#insertEdges stores and returns proper edges", function () {
            var res = ren.insertEdges(nodes, rows[0], header)
            assert.deepEqual(res, edges, "returns right edges")
            assert.deepEqual(ren.edges, edges, "it stored the right edges")
        })
        describe("with duplicates", function () {

            beforeEach(function() {
                setUp()
                rows.push([
                    "cytoplasm",
                    "0.7988158230958072",
                    "ENSG00000152213,ENSG00000125877,ENSG00000160224,ENSG00000152210"
                ])
                nodes.push({
                    _id: "ENSG00000152210",
                    glist: "ENSG00000152210",
                    radius: 8,
                    index: 4
                })
                edges.push({source:nodes[0], target:nodes[4],
                    _id:nodes[0]._id+nodes[4]._id})
            })

            it ("#insertNodes stores only the new nodes", function () {
                var res = ren.insertNodes(rows[0], header)
                assert.deepEqual(res, nodes.slice(0, -1))
                res = ren.insertNodes(rows[1], header)
                assert.deepEqual(res, nodes)
                assert.deepEqual(ren.nodes, nodes,
                    "the stored nodes corresponds")
            })
            it ("#insertEdges creates only the missing edges", function () {
                var res = ren.insertEdges(nodes.slice(0, -1), rows[0], header)
                assert.deepEqual(res, edges.slice(0, -1))
                res = ren.insertEdges(nodes, rows[1], header)
                assert.deepEqual(res, [edges[edges.length-1]],
                    "inserts and returns only the missing edges")
                assert.deepEqual(ren.edges, edges,
                    "the stored edges corresponds")
            })
        })
    })
})