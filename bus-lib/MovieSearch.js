const Common = new require('../douban-lib/Common');

class Search extends Common {
    /**
     * 解析数据
     * @param dom
     * @returns {{originalName: string, image: string, year: string, link: string, name: (boolean|void|*|undefined|string), rating: (*|string), main: string, id: *, content: *}}
     */
    parseSearchData(dom, keyword) {
        const $content = this.cheerio.load(dom);
        // console.log($content.html())
        // let sid = new URL($content('.movie-box').attr('href')).searchParams.get('url');
        // sid = sid.replace('https://movie.douban.com/', '').split('/').filter(v => v).pop();
        let sid = keyword;
        let name = $content('.photo-frame>img').attr('title')
        let img = $content('.photo-frame>img').attr('src')
        let year = $content('.photo-info>span>date').text()
        year = year.replace(keyword, '')
        // let rating = $content('.rating_nums').text() || '0.0';

        // let img = this.toImage($content('img').attr('src'));
        // let subject = $content('.subject-cast').text().replace(/\s/g, "");
        // let subjectArray = subject.split('/');
        // let year = subjectArray.pop();
        return {
            sid,
            name,
            // rating,
            img,
            year
        };
        // console.log(name)
        // console.log(img)
        // console.log(year)

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
            let items = res.item;
            // console.log(res);


            finalList.push(this.parseSearchData(res, keyword))
        } catch (e) {
            console.log(e)
        }

        return finalList;
    }




}

module.exports = Search;