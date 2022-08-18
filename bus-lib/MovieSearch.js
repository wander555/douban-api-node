const Common = new require('../douban-lib/Common');

class Search extends Common {
    /**
     * 解析数据
     * @param dom
     * @returns {{originalName: string, image: string, year: string, link: string, name: (boolean|void|*|undefined|string), rating: (*|string), main: string, id: *, content: *}}
     */
    parseSearchData(dom, keyword) {
        const $content = this.cheerio.load(dom);
        let sid = keyword;
        let name = $content('.photo-frame>img').attr('title')
        let img = 'https://www.javbus.com'+$content('.photo-frame>img').attr('src').replace("thumb","cover").replace(".jpg","_b.jpg")
        let year = $content('.photo-info>span>date').text()
        year = year.replace(keyword, '')
        let rating = '10.0'
        return {
            sid,
            name,
            rating,
            img,
            year
        };
    }

    /**
     * 获取数据
     * @param keyword
     * @param pageNo
     * @returns array
     */
    async getSearchData(keyword) {
        let start = 0;
        let finalList = [];
        // const url = 'https://www.javbus.com/search/' + this.encodeURL(keyword) + '&type=&parent=ce';
        const url = 'https://www.javbus.com/search/' + this.encodeURL(keyword);
        const res = await this.request(url, {
            method: 'GET',
            headers: {
                'referer': url
            }
        }, true).catch(e => {});

        if (!res) {
            console.log('res is empty...');
            return finalList;
        }
        try {
            finalList.push(this.parseSearchData(res, keyword))
        } catch (e) {
            console.log(e)
        }

        return finalList;
    }




}

module.exports = Search;