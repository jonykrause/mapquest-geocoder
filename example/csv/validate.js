'use strict';


// Custom input transformation


var accents = {
  'À': 'A',
  'Á': 'A',
  'Â': 'A',
  'Ã': 'A',
  'Ä': 'A',
  'Å': 'AA',
  'Æ': 'AE',
  'Ç': 'C',
  'È': 'E',
  'É': 'E',
  'Ê': 'E',
  'Ë': 'E',
  'Ì': 'I',
  'Í': 'I',
  'Î': 'I',
  'Ï': 'I',
  'Ð': 'D',
  'Ł': 'L',
  'Ñ': 'N',
  'Ò': 'O',
  'Ó': 'O',
  'Ô': 'O',
  'Õ': 'O',
  'Ö': 'O',
  'Ø': 'OE',
  'Ù': 'U',
  'Ú': 'U',
  'Ü': 'U',
  'Û': 'U',
  'Ý': 'Y',
  'Þ': 'Th',
  'ß': 'sz',
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'å': 'aa',
  'æ': 'ae',
  'ç': 'c',
  'è': 'e',
  'é': 'e',
  'ê': 'e',
  'ë': 'e',
  'ì': 'i',
  'í': 'i',
  'î': 'i',
  'ï': 'i',
  'ð': 'd',
  'ł': 'l',
  'ñ': 'n',
  'ń': 'n',
  'ò': 'o',
  'ó': 'o',
  'ô': 'o',
  'õ': 'o',
  'ō': 'o',
  'ö': 'o',
  'ø': 'oe',
  'ś': 's',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ū': 'u',
  'ü': 'u',
  'ý': 'y',
  'þ': 'th',
  'ÿ': 'y',
  'ż': 'z',
  'Œ': 'OE',
  'œ': 'oe',
  '&': 'and'
  };


function applyMap(str, map) {
  var result = [];
  for(var i = 0, len = str.length; i < len; i++) {
    var repl = map[str[i]];
    result.push(repl === undefined ? str[i] : repl);
  }
  return result.join("");
}


module.exports = function validate(row){
  var validRow = [];
  if (row.length > 2) row.splice(1, 1);
  for(var i = 0, len = row.length; i < len; i++) {
    validRow.push(applyMap(row[i].trim(), accents));
  }
  return validRow.join(',');
}
