
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
                console.log('test')
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

        it ('creates nodes and edges when rows are provided', function () {
                var rows = [
                        ['frank', '34'],
                        ['jack', '53']
                ]

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
})