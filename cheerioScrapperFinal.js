const cheerio = require("cheerio");
const fs = require("fs");
const fetch = require("node-fetch");
const mysql = require('mysql');


// ----------------- Database ---------------------- //

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "technofelia"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// ------------------------------------------------- //
// ------------------------------------------------- //

// recursive function to fetch all the
// page links of the videos on each page
async function main(i) {

    // stops reccurance when reached 0th page 
    if (!i) return 0;

    let url = `https://vidnext.net/?page=${i}`;
    await fetch(url)
    .then(r => r.text())
    .then(r => {
        let $ = cheerio.load(r);
        let a = $(".video-block a");
        a.each(function (i, e) {
            let link = "https://vidnext.net" + $(e).attr("href");
            getTitle(link);
        });
    })
    .catch(e => {
        console.log("error at : " + i);
        fs.appendFileSync("notfetched.txt", i + "\n");
        main(i - 1);
    });

    // reccursively invokes main funtion 
    setTimeout(main(i - 1), 1000);
}

// since there are 1330 total pages
main(1300);


function getTitle(url) {
    fetch(url)
        .then(r => r.text())
        .then(r => {
            let $ = cheerio.load(r);
            $(".video-info-left h1").each(async function (i, e) {
                let title = $(e).text();
                let dlink = $("iframe").first().attr("src").match(/id=.*?&/ig)[0].split("");
                dlink.pop();
                dlink = dlink.join("");
                dlink = await fetch(`https://vidembed.net/download?${dlink}`)
                    .then(r => r.text())
                    .then(r => {
                        let $ = cheerio.load(r);
                        return $(".dowload a").attr("href");
                    });
                
                // sql query to insert data into the db
                var sql = `INSERT INTO videos (name, source) VALUES ("${title}", "${dlink}")`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            });
        })
        .catch(function (e) {
            console.log(e);
        });
}