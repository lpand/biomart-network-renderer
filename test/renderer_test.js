
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

        it ('after calling parseHeader() it caches the header', function () {
                nt.printHeader('this is a header')
                expect(nt.header).toEqual('this is a header')
        })
})