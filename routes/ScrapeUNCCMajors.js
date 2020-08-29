var express = require('express');
var router = express.Router();
var majorsDB = require('../models/Database/UNCC_Majors');
console.log("CRAWL")
var request = require('request');
var cheerio = require('cheerio');
var url = ("https://academics.uncc.edu/undergraduate-programs");
var maj = new majorsDB();

var majors = [];
var degrees = [];
var concentrations = [];
    request(url, function(err, response, html){
    if(!err){
        var $ = cheerio.load(html);
        var allItems = $("tbody").children();
        
        allItems.each(function(index){
                var major = $("tbody").children().eq(index).children().eq(0).children().eq(0).text();
                var tempMajorArray = major.split(/,(.+)/);
               // maj.addMajor(tempMajorArray[0].trim(), tempMajorArray[1].trim())
               
            
           
        })
    }
   // console.log(response)
// console.log(majors)
})


module.exports = router;