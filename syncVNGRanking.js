//override console.error
console.error = (function() {
    var error = console.error;

    return function(exception) {
        if (typeof exception.stack !== 'undefined') {
            error.call(console, exception.stack);
        } else {
            error.apply(console, arguments);
        }
    }
})();

// import Ajax
dynamicallyLoadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js")
    //import convert excel lib
dynamicallyLoadScript("//unpkg.com/xlsx/dist/xlsx.full.min.js")
    // ... give time for script to load, then type (or see below for non wait option)
jQuery.noConflict();


function getRanking(teamInfo, teamName) {

    $.ajax({
        url: "https://api.uprace.vn/api/event/rank/list",
        type: 'POST',
        data: JSON.stringify(teamInfo),
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            'authorization': 'Bearer ' + JSON.parse(localStorage.curentUser).accesstoken
        },
        success: function(response) {
            console.error(response.data.list);
            convertJSONToExcel(response.data.list, teamName)
        },
        error: function(err) {
            console.error(err);
            console.error("error");
        }
    });

}


function convertJSONToExcel(data, teamName) {

    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["act", "ava", "ddis", "diff", "dis", "id", "mem", "name", "ownm", "rank", ];

    /* XLS Rows Data */
    var xlsRows = data

    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function(index, value) {
        var innerRowData = [];
        $("tbody").append('<tr><td>' + value.EmployeeID + '</td><td>' + value.FullName + '</td></tr>');
        $.each(value, function(ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });


    /* File Name */
    var filename = teamName + "_Ranking.xlsx";

    /* Sheet Name */
    var ws_name = "Ranking";

    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== 'undefined') console.log(new Date());

};


function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // create a script DOM node
    script.src = url; // set its src to the provided URL

    document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
dynamicallyLoadScript("https://cdn.jsdelivr.net/gh/longkiemphi/Public-JS-file@main/syncRanking.js")

var teamInfo = { "trid": "4d370b18-7fcc-4e53-a334-5365367815e7", "trtm": 1635653045, "data": { "size": 100, "uid": 191607, "evid": "5", "type": 4, "value": "9", "from": 0 } }
var teamName = "VNG"

function onLoading() {
    if (window.XLSX) {
        getRanking(teamInfo, teamName);
    } else {
        setTimeout(function() { onLoading() }, 50);
    }
}

onLoading()