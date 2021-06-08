const cheerio = require("cheerio");
const fs = require("fs");
const fetch = require("node-fetch");
var mysql = require('mysql');


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
// var sql = `INSERT INTO videos (name, source) VALUES (kxdfgnxkdj, fkgjhfk)`;
// con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
// });


// ------------------------------------------------- //
// ------------------------------------------------- //

async function main(i) {
    if (!i) {

        return 0;
    }
    let linkList = [];
    let url = `https://vidnext.net/?page=${i}`;
    let link = await fetch(url)
        .then(r => r.text())
        .then(r => {
            let $ = cheerio.load(r);
            let a = $(".video-block a");
            let tmp = [];
            a.each(function (i, e) {
                let link = "https://vidnext.net" + $(e).attr("href");
                tmp.push(link);
                getTitle(link);
            });
            return tmp;
        })
        .catch(e => {
            console.log("error at : " + i);
            fs.appendFileSync("notfetched.txt", i + "\n" );
            main(i - 1);
        });
        fs.appendFileSync("videolinks.txt", link.join("\n"));
        fs.appendFileSync("videolinks.txt", "\n");
        // console.log(link);
        setTimeout(main(i - 1), 3000);
} main(1300);


function getTitle ( url ) {

    fetch(url)
    .then(r => r.text())
    .then(r => {
        let $ = cheerio.load(r);
        $(".video-info-left h1").each(async function(i,e){
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

            console.log(title, dlink);
            var sql = `INSERT INTO videos (name, source) VALUES ("${title}", "${dlink}")`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
    })
    .catch(function(e){
        console.log("___________________________");
    });

}