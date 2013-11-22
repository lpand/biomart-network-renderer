var concat = Array.prototype.push
var slice = Array.prototype.slice

function assign(obj) {
    slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop]
            }
        }
    })
    return obj;
}

function extend (protoProps, staticProps) {
    var parent = this
    var child

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor
    } else {
      child = function(){ return parent.apply(this, arguments) }
    }

    assign(child, parent, staticProps)

    var Surrogate = function(){ this.constructor = child }
    Surrogate.prototype = parent.prototype
    child.prototype = new Surrogate()

    if (protoProps) assign(child.prototype, protoProps)

    child.super_ = parent.prototype

    return child
}

////////////////////////////////////////////////////////////////////////////////
// NOTE!!
//
// Just for now ignore renderInvalid Option!
////////////////////////////////////////////////////////////////////////////////
function BaseNetworkRenderer () {}
BaseNetworkRenderer.extend = extend

BaseNetworkRenderer.prototype = assign({}, biomart.renderer.results.plain, {
    // The wrap container
    tagName: 'div',

    /**
     *
     * @param {String} value
     */
    addProp: function (node, key, value) {
        if (value.indexOf('<a') >= 0) {
            value = $(value)
            node[key] = value.text()
            node._link = value.attr('href')
        } else {
            node[key] = value
        }

        return node
    },

    init: function () {
        this.nodes = []
        this.edges = []
        this.rowBuffer = []
        this.neighbors = []
        this.header = null
    },

    /**
     * Creates and inserts new nodes within BaseNetworkRenderer#nodes. If the
     * nodes that are supposed to be created are already present within
     * BaseNetworkRenderer#nodes, then returns those nodes and the new ones.
     *
     * NOTE: A node must have a _id property for which will be compared for identity
     * with an other node, and an index property representing the its own index
     * within the nodes array.
     *
     * @param {Array.<string>} row - a row
     * @param {Array.<string>} header - the header of incoming data
     * @param {Array.<Object>} - array of new or already present nodes
     */
    insertNodes: function (row, header) {
        throw new Error("BaseNetworkRenderer#insertNodes not implemented")
    },

    /**
     * Creates and insert new edges within BaseNetworkRenderer#edges. Duplicated edges will
     * not be added to the collection.
     *
     * NOTE: An edge must have a _id property for which will be compared for identity
     * with an other edge.
     *
     * @param {Array.<Object>} nodes - nodes returned by the last invokation of
     * BaseNetworkRenderer#insertNodes
     * @param {Array.<string>} row - a row
     * @param {Array.<string>} header - the header of incoming data
     * @return {Array.<Object>} - the inserted edges
     */
    insertEdges: function (nodes, row, header) {
        throw new Error("BaseNetworkRenderer#insertEdges not implemented")
    },

    /**
     * Given a node index returns its adjacency.
     * @param {number} nodeIndex - index of the node within BaseNetworkRenderer#nodes
     * @return the adjacency of the node
     */
    getNeighbors: function (nodeIndex) {
        // throw new Error("BaseNetworkRenderer#neighbors not implemented")
        // From d3's src/layout/force.js
        var ne = this.neighbors, n, m, j, nodes = this.nodes, links = this.edges
        if (! ne) {
            n = nodes.length
            m = links.length
            ne = new Array(n)
            for (j = 0; j < n; ++j) {
                ne[j] = []
            }
            for (j = 0; j < m; ++j) {
                var o = links[j]
                ne[o.source.index].push(o.target);
                ne[o.target.index].push(o.source);
            }
        }
        return ne[nodeIndex]
    },

    findIndex: function (collection, cb) {
        for (var i = 0, len = collection.length; i < len; ++i) {
            if (cb(collection[i]))
                return i
        }
        return -1
    },

    /**
     * Creates the proper nodes and edges and populates BaseNetworkRenderer#nodes and
     * BaseNetworkRenderer#edges.
     * @param {Array.<string>} rows - all the rows retrieved
     */
    makeNE: function (rows) {
        var h = this.header, e = this.edges, i = 0, rLen = rows.length, r

        for (; i < rLen && (r = rows[i]); ++i) {
            this.insertEdges(this.insertNodes(r, h), r, h)
        }
    },

    // rows : array of arrays
    parse: function (rows, writee) {
        concat.apply(this.rowBuffer, rows)
    },

    /**
     * Adds a new tab.
     * Initializes the tab widget at the first invokation.
     *
     * @param {jQuery} $container - it's the element on which to invoke the tab widget.
     * @param {jQuery} $tabs - it's the tab headers container, usually a list.
     * @return a jQuery object representing the newly create tab.
     */
    newTab: function($container, $tabs) {
        var item, tabNum, svg

        tabNum = $tabs.children().size() + 1
        if (tabNum === 1)
            $container.tabs()

        itemIdSelector = '#item-'+ tabNum
        // For each attribute list create a tab
        $container.tabs('add', itemIdSelector, Object.keys(biomart._state.queryMart.attributes)[tabNum-1])

        return $(itemIdSelector)
    },

    /**
     * It creates and appends a new svg to the specified container.
     * To the svg it's going to be appended a group.
     *
     * @param {Object} config .
     * @param {DOMElement} config.container - the element where append the new svg.
     * @param {number} config.w - width of the svg.
     * @param {number} config.h - height of the svg.
     * @param {string} [config.idName] - id for the svg.
     * @param {string} [config.className] - class for the svg.
     * @return the group appended to the new svg.
     */
    newSVG: function (config) {
        var w = config.w, h = config.h, container = config.container, group, svg

        // Playground for the new network
        svg = d3.select(container)
            .append('svg:svg')
            .attr({ width: w, height: h })

        if ("idName" in config)
            svg.attr("id", config.idName)
        if ("className" in config)
            svg.attr("class", config.className)

        group = svg.append('g')
            .call(d3.behavior.zoom().scaleExtent([0, 20]).on('zoom', function () {
                group.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")") }))
            .append('g')

        group.append("rect")
            .attr('class', 'zoom-container')
            .attr('x', -2.5 * w)
            .attr('y', -4 * h)
            .attr("width", w * 5)
            .attr("height", h * 8)

        return group
    },

    printHeader: function(header, writee) {
        this.header = header
    },

    draw: function (writee) {

    },

    clear: function () {
        // Now that we're submitting only one query i can safely implement this m.
        this.init()
    },

    destroy: function () {
        this.init()
    }
})


