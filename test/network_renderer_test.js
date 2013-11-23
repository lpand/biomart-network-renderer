var assert = chai.assert

describe("NetworkRenderer", function () {
    "use strict";

    var ren = null

    beforeEach(function () {
        ren = new NetworkRenderer()
    })

    describe ("creates nodes and edges", function () {
        var header = ["g0", "g1", "score"],
            rows = [ ["a", "b", "0.4"], ["b", "c", "0.3"] ],
            nodes = [
                {g0:"a", _id:"a", index: 0},
                {g1:"b", _id:"b", index: 1},
                {g1:"c", _id:"c", index: 2}
            ],
            edges = [
                { _id: nodes[0]._id+nodes[1]._id,
                    source: nodes[0], target: nodes[1], value: "0.4"},
                { _id: nodes[1]._id+nodes[2]._id,
                    source: nodes[1], target: nodes[2], value: "0.3"},
            ]

        beforeEach(function () {
            ren.printHeader(header)
        })

        it ("#insertNodes stores proper nodes", function () {
            for (var r = 0, res; r < rows.length; ++r) {
                res = ren.insertNodes(rows[r], header)
                assert.deepEqual(res, [nodes[r], nodes[r+1]], "returns the proper nodes")
            }
            assert.deepEqual(ren.nodes, nodes, "appended the right nodes")
        })
        it ("#insertEdges creates the proper edges", function () {
            for (var r = 0, res; r < rows.length; ++r) {
                res = ren.insertNodes(rows[r], header)
                res = ren.insertEdges(res, rows[r], header)
                assert.deepEqual(res, [edges[r]])
            }
        })
    })
})