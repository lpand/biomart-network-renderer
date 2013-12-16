
var biomart = {
    renderer: {
        results: {
            plain: {
                getElement: function () {
                    return $("#playground")
                }
            }
        }
    },

    _state: {
        queryMart: {
            attributes: ["TAB1", "TAB2", "TAB3"]
        }
    }
}

function getData(dataId) { // "enrichment-data-2"
    var data = JSON.parse(document.getElementById(dataId).textContent)
    var rowstrings = data.split("\n")
    var rows = rowstrings.map(function (r) {
        return r.split("\t")
    })
    return rows
}

$.publish = function(){}

function run() {
    // 'Ensembl Gene ID\tGene b 105\tWeight 105\n
    var nt = biomart.renderer.results.network
    var writee = nt.getElement()
    var rows = getData("ss_data")
    nt.printHeader(["Ensembl Gene ID","Gene b 105","Weight 105"])
    nt.parse(rows, writee)
    nt.draw(writee)
}
