class StringUtils {
    static getHashtags (text) {
        let re = /\B(\#[a-zA-Z]+\b)(?!;)/g
        let matches = text.matchAll(re)
        console.log(matches);
        let ids = [];
        for (let match of matches) {
            ids.push(match[1]);
        }
        return ids;
    }
}
module.exports.StringUtils = StringUtils