

function resizeHandler () {
        var w, h
        if (this._svg && !this._svg.empty()) {
                w = $(window).width()
                h = $(window).height()
                this._svg.attr({
                        width: w,
                        height: h
                })
                this._visualization.force.size([w, h])
        }
}

function resize (listener, interval) {
    var resizeTimeout

    window.addEventListener('resize', function() {
        if (! resizeTimeout) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null
                listener.apply(null, arguments)
            }, interval || 66)
        }
    })
}
