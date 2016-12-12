function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    {name: "Export JSON for this sheet", functionName: "exportSheet"},
  ];
  ss.addMenu("Export JSON", menuEntries);
}

function exportSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rowsData = getRowsData_(sheet);
  var json = makeJSON_(rowsData);
  //displayText_(json);
  var filename = ss.getSheetName() + ".json";
  DriveApp.createFile(filename, json);
}

function displayText_(text) {
  var app = UiApp.createApplication().setTitle('Exported JSON');
  app.add(makeTextBox(app, 'json'));
  app.getElementById('json').setText(text);
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  ss.show(app);
  return app; 
}

function makeTextBox(app, name) { 
  var textArea    = app.createTextArea().setWidth('100%').setHeight('200px').setId(name).setName(name);
  return textArea;
}

function makeJSON_(object) {
  return JSON.stringify(object, null, 4);
}

// getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData_(sheet) {
  var headersRange = sheet.getRange(1, 1, sheet.getFrozenRows(), sheet.getMaxColumns());
  var headers = headersRange.getValues()[0]; 
  var dataRange = sheet.getRange(sheet.getFrozenRows() + 1, 1, sheet.getMaxRows(), sheet.getMaxColumns()); 
  var objects = getObjects_(dataRange.getValues(), normalizeHeaders_(headers));
  return objects;
}

// For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects_(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      
      if (isCellEmpty_(cellData)) {
        continue;
      }
      
      if(keys[j].isArray) {
        if(Array.isArray(object[keys[j].key])) {
          object[keys[j].key].push(cellData);
        } else {
          var arrayData = [];
          arrayData.push(cellData);
          object[keys[j].key] = arrayData;
        }
      } else {
        object[keys[j].key] = cellData;
      }
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

// Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders_(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader_(headers[i]);
    if (key.key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}
 
// Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader_(header) {
  var item = {
    key: "",
    isArray: false
  }
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    
    if(isSquareBrackets(letter)) {
      item.isArray = true;
    }
    
    if (!isAlnum_(letter)) {
      continue;
    }
    
    if (key.length == 0 && isDigit_(letter)) {
      continue; // first character must be a letter
    }
    
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  item.key = key;
  return item;
}
 
// Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty_(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}
 
// Returns true if the character char is alphabetical, false otherwise.
function isAlnum_(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit_(char);
}
 
// Returns true if the character char is a digit, false otherwise.
function isDigit_(char) {
  return char >= '0' && char <= '9';
}

function isSquareBrackets(char) {
  return char == '[' || char == ']';
}
