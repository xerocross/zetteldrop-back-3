const { StringUtils } = require("../util/StringUtils")

const ZettelList = class ZettelList {
    zettels;

    constructor(zettels ) {
        this.zettels = zettels
    }

    push(zettel) {
        this.zettels.push(zettel);
    }

    filterByUser(username ) {
        let filteredList  = new ZettelList([]);
        this.zettels.forEach((zet)=> {
            if (zet.user == username) {
                filteredList.push(zet)
            }
        })
        return filteredList;
    }

    filterByTag(tag )  {
        let filteredList  = new ZettelList([]);
        this.zettels.forEach(zet=> {
            let tags = StringUtils.getHashtags(zet.text)
            if (tags.includes(tag)) {
                filteredList.push(zet);
            }
        });
        return filteredList;
    }
}
exports.ZettelList = ZettelList;