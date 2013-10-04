
describe ('biomart.renderer.results', function () {
        "use strict";

        it ('has a property called network', function () {
                expect(biomart.renderer.results.network).toBeDefined()
        })
})

describe ('biomart.renderer.results.network', function () {
        "use strict";

        var res = biomart.renderer.results
        var nt = res.network

        it ('has biomart.renderer.results.plain as prototype', function () {
                expect(res.network.__proto__).toEqual(res.plain)
        })

        it ('caches the header and creates the node accessors when printHeader() is invoked', function () {
                nt.printHeader('name age'.split(' '))
                expect(nt.header).toEqual(['name', 'age'])

                expect(nt.node0).toBeDefined()
                expect(nt.node0.key).toBe('name')
                expect(nt.node0.value({'name': 'foo' })).toBe('foo')
                expect(nt.node1).toBeDefined()
                expect(nt.node1.key).toBe('age')
                expect(nt.node1.value({'age': 'bar' })).toBe('bar')
        })

        it ('does nothing when clear() is invoked', function() {
                nt.clear()
                expect(nt._nodes).toBeDefined()
                expect(nt._edges).toBeDefined()
        })

        it ('get back to a clean state after destroy() is invoked', function () {
                nt.destroy()
                expect(nt._nodes).toBe(null)
                expect(nt._edges).toBe(null)
                expect(nt._svg).toBe(null)
                expect(nt._visualization).toBe(null)
        })

        describe ('draw()', function () {
                beforeEach(function () {
                        nt.printHeader('name age'.split(' '))
                })

                afterEach(function () {
                        nt.destroy()
                })
                
                describe ('all rows have values', function () {
                        it ('has the right nodes and edges', function () {
                                var rows = [
                                        ['frank', '34'],
                                        ['frank', '19'],
                                        ['pam', '53'],
                                        ['fay', '19']
                                ]
                                nt.parse(rows)
                                nt.draw($('body'))

                                expect(nt._nodes).toEqual([
                                        {'name': 'frank'},
                                        {'age': '34'},
                                        {'age': '19'},
                                        {'name': 'pam'},
                                        {'age': '53'},
                                        {'name': 'fay'}
                                ])

                                expect(nt._edges).toEqual([
                                        { source: nt._nodes[0], target: nt._nodes[1] },
                                        { source: nt._nodes[0], target: nt._nodes[2] },
                                        { source: nt._nodes[3], target: nt._nodes[4] },
                                        { source: nt._nodes[5], target: nt._nodes[2] }
                                ])
                        })
                })

                describe ('all rows have values', function () {
                        it ('when value is an hyperlink creates proper nodes', function () {
                                var rows = [
                                        ['jack', '<a href="alink0">cont0</a>'],
                                        ['jack', '<a href="alink1">cont1</a>'],
                                        ['jack', '76']
                                ]

                                nt.parse(rows)
                                nt.draw($('body'))
                                expect(nt._nodes).toEqual([
                                        {'name': 'jack'},
                                        {'age': 'cont0', _link: 'alink0'},
                                        {'age': 'cont1', _link: 'alink1'},
                                        {'age': '76'}
                                ])
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
        //         expect(nt._visualization).toBeDefined()
        // })

})

// describe('hyperlinks', function () {
//         var s = d3.select('body').append('sgv:svg')
//         var data = [
//                 {  }
//         ]
// })