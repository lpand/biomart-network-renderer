var expect = chai.expect
var width = 600
var height = 500

describe ('Graph', function () {
        "use strict";

        beforeEach(function () {
                this.graphConfig = {
                        nodeClassName: 'gene',
                        edgeClassName: 'graph-chart-edge',
                        radius: 20,
                        fill: '#bcbd22',
                        'id': function (d) {
                                return d.name },
                        'groupId': 'bubbles-lines-group'
                }

                this.group = d3.select('body')
                        .append('svg:svg')
                        .attr({
                                id: 'graph',
                                width: width,
                                height: height })
                        .append('g')
                        .attr({id: 'graph-group'})

                this.nodes = [0,1,2,3,4].map(function (i) { return { name: "node"+ i, value: i }})
                this.edges = [
                        { source: this.nodes[0], target: this.nodes[1] },
                        { source: this.nodes[3], target: this.nodes[2] },
                        { source: this.nodes[3], target: this.nodes[0] },
                        { source: this.nodes[2], target: this.nodes[3] }
                ]

                Graph(this.group, this.nodes, this.edges, this.graphConfig)
        })

        afterEach(function () {
                this.group.remove()
                d3.select('svg').remove()
                this.group = this.graphConfig = null
        })

        it ('creates a group with the right name when provided', function () {
                expect(d3.select('#bubbles-lines-group').empty()).to.be.false
        })

        it ('use the svg as canvas when groupId is undefined', function () {
                d3.select('#bubbles-lines-group').remove()
                delete this.graphConfig.groupId
                Graph(this.group, this.nodes, this.edges, this.graphConfig)
                // TODO: bubbles presence wasn't tested yet
                expect(d3.select('circle').node().parentNode.id).to.equal(this.group.node().id)
        })

        it('creates the proper number of lines', function () {
                expect(this.graphConfig).to.have.property('groupId')
                var lines = d3.select('#bubbles-lines-group').selectAll('line')
                expect(lines.size()).to.equal(this.edges.length)
        })

        it('creates lines with the proper attributes applied', function () {
                var lines = d3.selectAll('line'), conf = this.graphConfig
                lines.each(function () {
                        expect(this.getAttribute('class')).to.equal(conf.edgeClassName)
                })
        })

        it ('creates the proper number of bubbles', function () {
                var circles = d3.select('#bubbles-lines-group').selectAll('circle')
                var conf = this.graphConfig
                expect(circles.size()).to.equal(this.nodes.length)
                circles.each(function () {
                        expect(this.getAttribute('class')).to.equal(conf.nodeClassName)
                })
        })

        it ('creates the proper number of bubbles with right attributes', function () {
                var circles = d3.select('#graph-group').selectAll('g').selectAll('circle')
                var conf = this.graphConfig
                expect(circles.size()).to.equal(this.nodes.length)
                circles.each(function (d, i) {
                        expect(this.getAttribute('fill')).to.equal(conf.fill)
                        expect(+this.getAttribute('r')).to.equal(conf.radius)
                        expect(this.id).to.equal(conf.id(d))
                })
        })
})