var assert = chai.assert

describe("NetworkRenderer", function () {
    "use strict";

    var ren = null

    beforeEach(function () {
        ren = new NetworkRenderer()
    })

    describe ("creates nodes and edges", function () {
        var header, rows, nodes, edges
        beforeEach(function () {
            header = ["g0", "g1", "score"],
            rows = [ ["a", "b", "0.4"], ["b", "c", "0.3"] ],
            nodes = [
                {g0:"a", _id:"a", index: 0, radius: 3},
                {g1:"b", _id:"b", index: 1, radius: 3},
                {g1:"c", _id:"c", index: 2, radius: 3}
            ],
            edges = [
                { _id: nodes[0]._id+nodes[1]._id,
                    source: nodes[0], target: nodes[1], value: "0.4"},
                { _id: nodes[1]._id+nodes[2]._id,
                    source: nodes[1], target: nodes[2], value: "0.3"},
            ]

            ren.printHeader(header)
        })

        it ("#insertNodes stores proper nodes", function () {
            var res = ren.insertNodes(rows[0], header)
            assert.deepEqual(res, [nodes[0], nodes[1]], "returns the proper nodes")
            res = ren.insertNodes(rows[1], header)
            nodes[1].radius += 3
            assert.deepEqual(res, [nodes[1], nodes[2]], "returns the proper nodes")
            assert.deepEqual(ren.nodes, nodes, "appended the right nodes")
        })
        it ("#insertEdges creates the proper edges", function () {
            // for (var r = 0, res; r < rows.length; ++r) {
                var res = ren.insertNodes(rows[0], header)
                res = ren.insertEdges(res, rows[0], header)
                assert.deepEqual(res, [edges[0]])
                res = ren.insertNodes(rows[1], header)
                res = ren.insertEdges(res, rows[1], header)
                nodes[1].radius += 3
                assert.deepEqual(res, [edges[1]])
            // }
        })
    })
})