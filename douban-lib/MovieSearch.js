const Common = new require('./Common');

class Search extends Common {
    /**
     * 解析数据
     * @param dom
     * @returns {{originalName: string, image: string, year: string, link: string, name: (boolean|void|*|undefined|string), rating: (*|string), main: string, id: *, content: *}}
     */
    parseSearchData(dom) {
        const $content = this.cheerio.load(dom);
        let sid = new URL($content('.nbg').attr('href')).searchParams.get('url');
        sid = sid.replace('https://movie.douban.com/', '').split('/').filter(v => v).pop();
        let name = $content('a').text().replace(/\s/g, "");
        let rating = $content('.rating_nums').text() || '0.0';
        let img = this.toImage($content('img').attr('src'));
        let subject = $content('.subject-cast').text().replace(/\s/g, "");
        let subjectArray = subject.split('/');
        let year = subjectArray.pop();
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
        const url = 'https://www.douban.com/j/search?q=' + this.encodeURL(keyword) + '&start=' + start + '&cat=1002';
        const res = await this.request(url, {
            method: 'GET',
            headers: {
                'referer': url
            }
        }, true).catch(e => {});

        if (!res) return finalList;
        try {
            let items = res.items;
            finalList.push(this.parseSearchData(items[0]))
        } catch (e) {
            console.log(e)
        }

        return finalList;
    }




}

module.exports = Search;