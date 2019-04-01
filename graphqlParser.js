function parse(inputQuery) {
    let queryRegex = /^(\w+)\{(\w+,)*\}$/;
    return inputQuery.replace(queryRegex, function(input, type, ...fields) {
        return { type, fields };
    });
}