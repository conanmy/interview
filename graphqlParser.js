function parse(inputQuery) {
    let lines = typeof inputQuery === 'string' ? inputQuery.split('\n') : inputQuery;
    let type, dataStr;
    lines[0].replace(/(\w+)(\(.+\)):?\s?\{/, function(input, sType, sDataStr) {
        type = sType;
        dataStr = sDataStr.trim();
    });
    let data = dataStr.split(',').map(seg => {
        let [key, value] = seg.split(':');
        return {key: value};
    });
    lines.shift();
    lines.pop();
    let fields = [];
    let relations = [];
    let relationLineStartIndex = null;
    let i = 0;
    while (i < lines.length) {
        if (lines[i].indexOf('{') > 0) {
            relationLineStartIndex = i;
            i ++;
        } else if (lines[i].indexOf('}') > 0) {
            let relationLines = lines.slice(relationLineStartIndex, i + 1);
            relations.push(parse(relationLines));
            relationLineStartIndex = null;
            i++;
        } else if (relationLineStartIndex) {
            i ++;
        } else {
            fields.push(lines[i].trim().replace(',', ''));
            i++;
        }
    };
    return {type, fields, attrs: { data }, relations};
}