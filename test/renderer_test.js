var expect = chai.expect

describe ('biomart.renderer.results', function () {
        "use strict";

        it ('has a property called network', function () {
                expect(biomart.renderer.results.network).to.exist
        })
})

describe ('biomart.renderer.results.network', function () {
        "use strict";

        var res = biomart.renderer.results
        var nt = res.network

        it ('has biomart.renderer.results.plain as prototype', function () {
                expect(res.network.__proto__).to.eq(res.plain)
        })

        it ('caches the header and creates the node accessors when printHeader() is invoked', function () {
                nt.printHeader('name age'.split(' '))
                expect(nt.header).to.eql(['name', 'age'])

                expect(nt.node0).to.exist
                expect(nt.node0.key).to.eq('name')
                expect(nt.node0.value({'name': 'foo' })).to.eq('foo')
                expect(nt.node1).to.exist
                expect(nt.node1.key).to.eq('age')
                expect(nt.node1.value({'age': 'bar' })).to.eq('bar')
        })

        it ('does nothing when clear() is invoked', function() {
                nt.clear()
                expect(nt._nodes).to.exist
                expect(nt._edges).to.exist
        })

        it ('get back to a clean state after destroy() is invoked', function () {
                nt.destroy()
                expect(nt._nodes).to.be.null
                expect(nt._edges).to.be.null
                expect(nt._svg).to.be.null
                expect(nt._visualization).to.be.null
        })

        describe ('draw()', function () {
                beforeEach(function () {
                        nt.printHeader('name age'.split(' '))
                })

                afterEach(function () {
                        nt.destroy()
                })

                describe ('invoked with all values', function () {
                        it ('produces right nodes and edges', function () {
                                var rows = [
                                        ['frank', '34'],
                                        ['frank', '19'],
                                        ['pam', '53'],
                                        ['fay', '19']
                                ]
                                nt.parse(rows)
                                nt.draw($('body'))

                                expect(nt._nodes.length).to.have.length.eq(6)
                                expect(nt._nodes).to.have.deep.property('[0].name', 'frank')
                                expect(nt._nodes).to.have.deep.property('[1].age', '34')
                                expect(nt._nodes).to.have.deep.property('[2].age', '19')
                                expect(nt._nodes).to.have.deep.property('[3].name', 'pam')
                                expect(nt._nodes).to.have.deep.property('[4].age', '53')
                                expect(nt._nodes).to.have.deep.property('[5].name', 'fay')

                                expect(nt._edges.length).to.have.length.eq(4)
                                var a = [[0,1],[0,2],[3,4],[5,2]]
                                for (var i = 0; i < a.length; ++i) {
                                        expect(nt._edges).to.have.deep.property('['+i+'].source', nt._nodes[a[i][0]])
                                        expect(nt._edges).to.have.deep.property('['+i+'].target', nt._nodes[a[i][1]])
                                }
                        })

                        it ('if hyperlinks are present produces the right nodes', function () {
                                var rows = [
                                        ['jack', '<a href="alink0">cont0</a>'],
                                        ['jack', '<a href="alink1">cont1</a>'],
                                        ['jack', '76']
                                ]

                                nt.parse(rows)
                                nt.draw($('body'))
                                expect(nt._nodes.length).to.have.length.eq(4)
                                expect(nt._nodes).to.have.deep.property('[0].name', 'jack')
                                expect(nt._nodes).to.have.deep.property('[1].age', 'cont0')
                                expect(nt._nodes).to.have.deep.property('[1]._link', 'alink0')
                                expect(nt._nodes).to.have.deep.property('[2].age', 'cont1')
                                expect(nt._nodes).to.have.deep.property('[2]._link', 'alink1')
                                expect(nt._nodes).to.have.deep.property('[3].age', '76')
                        })
                })

                describe ('invoked with missing values', function () {
                        it ('produces proper nodes and edges', function () {
                                var rows = [
                                        ['frank', '34'],
                                        ['pam', '53'],
                                        ['skylar', ''],
                                        ['fay', ''],
                                        ['juliet', '19']
                                ]
                                nt.parse(rows)
                                nt.draw($('body'))
                                expect(nt._nodes.length).to.have.length.eq(8)
                                expect(nt._nodes).to.have.deep.property('[0].name', 'frank')
                                expect(nt._nodes).to.have.deep.property('[1].age', '34')
                                expect(nt._nodes).to.have.deep.property('[2].name', 'pam')
                                expect(nt._nodes).to.have.deep.property('[3].age', '53')
                                expect(nt._nodes).to.have.deep.property('[4].name', 'skylar')
                                expect(nt._nodes).to.have.deep.property('[5].age', '19')
                                expect(nt._nodes).to.have.deep.property('[6].name', 'fay')
                                expect(nt._nodes).to.have.deep.property('[7].name', 'juliet')
                                expect(nt._edges.length).to.have.length.eq(5)
                                var a = [[0,1],[2,3],[4,5],[6,5], [7, 5]]
                                for (var i = 0; i < a.length; ++i) {
                                        expect(nt._edges).to.have.deep.property('['+i+'].source', nt._nodes[a[i][0]])
                                        expect(nt._edges).to.have.deep.property('['+i+'].target', nt._nodes[a[i][1]])
                                }
                        })
                })
        })

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