module.exports = class UnescapeString {
   unescapeApostrophe(string){
       var escapedApostrophe = "&#39;";
       if(string.includes(escapedApostrophe)){
            var newString = string.replace(/&#39;/g, "'");
            return newString;
       }
       else{
           return string;
       }
   }
    
  
  }