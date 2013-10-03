
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

        it ('caches the header and creates the node accessors when printHeader() is called', function () {
                nt.printHeader('name age'.split(' '))
                expect(nt.header).toEqual(['name', 'age'])

                expect(nt.node0).toBeDefined()
                expect(nt.node0.key).toBe('name')
                expect(nt.node0.value({'name': 'foo' })).toBe('foo')
                expect(nt.node1).toBeDefined()
                expect(nt.node1.key).toBe('age')
                expect(nt.node1.value({'age': 'bar' })).toBe('bar')
        })

        it ('does nothing when clear() is called', function() {
                nt.clear()
                expect(nt._nodes).toBeDefined()
                expect(nt._edges).toBeDefined()
        })

        it ('get back to a clean state after destroy() is called', function () {
                nt.destroy()
                expect(nt._nodes).toBe(null)
                expect(nt._edges).toBe(null)
                expect(nt._svg).toBe(null)
                expect(nt._visualization).toBe(null)
        })

        it ('creates nodes and edges when rows are provided', function () {
                var rows = [
                        ['frank', '34'],
                        ['jack', '53']
                ]

                nt.printHeader('name age'.split(' '))
                nt.parse(rows)

                // I shouldn't test the internals
                expect(nt._nodes).toEqual([
                        {'name': 'frank'},
                        {'age': '34'},
                        {'name': 'jack'},
                        {'age': '53'}
                ])

                expect(nt._edges).toEqual([
                        { source: nt._nodes[0], target: nt._nodes[1] },
                        { source: nt._nodes[2], target: nt._nodes[3] }
                ])
        })

        it ('correct nodes and edges are created with multiple edges per node', function () {
                var rows = [
                        ['jack', '53'],
                        ['jack', '76']
                ]

                nt.clear()
                nt.printHeader('name age'.split(' '))
                nt.parse(rows)

                // I shouldn't test the internals
                expect(nt._nodes).toEqual([
                        {'name': 'jack'},
                        {'age': '53'},
                        {'age': '76'}
                ])

                expect(nt._edges).toEqual([
                        { source: nt._nodes[0], target: nt._nodes[1] },
                        { source: nt._nodes[0], target: nt._nodes[2] }
                ])
        })

        it ('when value is an hyperlink creates proper nodes', function () {
                var rows = [
                        ['jack', '<a href="alink0">cont0</a>'],
                        ['jack', '<a href="alink1">cont1</a>'],
                        ['jack', '76']
                ]

                nt.clear()
                nt.printHeader('name age'.split(' '))
                nt.parse(rows)
                expect(nt._nodes).toEqual([
                        {'name': 'jack'},
                        {'age': 'cont0', _link: 'alink0'},
                        {'age': 'cont1', _link: 'alink1'},
                        {'age': '76'}
                ])
        })

        it ('has an svg and visualization when draw() is called', function () {
                var rows = [
                        ['jack', '53'],
                        ['jack', '76']
                ]
                nt.printHeader('name age'.split(' '))
                nt.parse(rows)
                nt.draw($('body'))
                expect(nt._svg.empty()).toBe(false)
                expect(nt._visualization).toBeDefined()
        })

})

// describe('hyperlinks', function () {
//         var s = d3.select('body').append('sgv:svg')
//         var data = [
//                 {  }
//         ]
// })