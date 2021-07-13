const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const createCsvWriter = require('csv-writer').createArrayCsvWriter;     //for csv

async function getData(){
    const response = await fetch('https://in.finance.yahoo.com/most-active?offset=0&count=200');
    const text = await response.text();
    const dom = await new JSDOM(text);

    const tableRows=dom.window.document.querySelectorAll('tr');
    const rowCount=tableRows.length;

    const tableData=[];
    flag='th';
    for(var i=0;i<rowCount;i++)
    {
        if(i>0) flag='td';
        var tableCells=tableRows[i].querySelectorAll(flag);
        var cellCount=tableCells.length;

        var cells=[];
        for(var j=1;j<8;j++)
        {
            cells.push(tableCells[j].textContent);
        }
        tableData.push(cells);
    }

    console.log(tableData[0]);
    data=tableData.splice(1);
    console.log("---------------------------------------------------------")
    console.log(data);
    console.log(rowCount);
    writeToCSV(tableData[0],data);

    return tableData;
}
getData();

function writeToCSV(header,data){

    const csvWriter = createCsvWriter({
        header: header,
        path: 'data.csv'
    });
     
    const records = data;
     
    csvWriter.writeRecords(records)      
        .then(() => {
            console.log('Sucessfully written to Csv File\nDone...');
    });
}