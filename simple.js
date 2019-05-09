const rp = require("request-promise");
const cheerio = require("cheerio");
var Crawler = require("crawler");

const baseURL = "https://techterms.com/category/software";
const getSoftwareTerms = async () => {
	const html = await rp(baseURL);
	let list = [];
	const $ = cheerio.load(html);
	$("tbody td a").each(function(index, element) {
		list.push($(element).text());
	});
	//console.log(list);
	//let test = list.splice(0, 20);
	//console.log(test);
	var baseAlmaany = "https://www.almaany.com/ar/dict/ar-en/";
	list.map(val => {
		var url = baseAlmaany + val.replace(" ", "-");
		c.queue({ uri: url, p1: val });
	});
};
getSoftwareTerms();

var c = new Crawler({
	rateLimit: 4000,
	callback: function(err, res, done) {
		let $ = cheerio.load(res.body);

		var word = `<td> ${res.options.p1} </td>`;
		var textList = "";
		var searchedV = res.options.p1.toLowerCase();
		$(".panel-body tbody tr").each(function(index, element) {
			var text = $(element)
				.text()
				.toLowerCase();
			//console.log(text);
			if (text.replace(/\s\s+/g, " ").includes(searchedV)) {
				textList = textList + text;
			}
		});
		var translations = `<td> ${textList} </td>`;
		htmlout("table").append("<tr>" + word + translations + "</tr>");
		done();
	}
});

c.on("drain", function() {
	console.log(htmlout.html());
});


var CSS = `
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #bbb;
  text-align: left;
  padding: 8px;
  white-space: pre-line;
}

tr:nth-child(even) {
  background-color: #eee;
}

td:nth-child(2) {
  direction: rtl;
} 
</style>`;

var htmlout = cheerio.load(`${CSS} <table> </table>`);