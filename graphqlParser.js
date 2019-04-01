function parse(inputQuery) {
    let lines = inputQuery.split('\n');
    let type = lines[0].replace(/(\w+) \{/, function(input, type) {
        return type;
    });
    lines.shift();
    lines.pop();
    lines = lines.map(function(line) {
        return ltrim(line).replace(',', '');
    });
    return {type, fields: lines};
}

function ltrim(str) {
    if(str == null) return str;
    return str.replace(/^\s+/g, '');
}