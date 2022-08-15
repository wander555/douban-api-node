const Common = new require('./Common');

class Subject extends Common {
    /**
     * 获取数据
     * @param dbId
     * @returns {Promise<{}>}
     */
    async getMovieData(dbId) {
        let url = 'https://movie.douban.com/subject/' + dbId;
        this.html = await this.request(url, {
            headers: {
                referer: url
            }
        });
        this.dom = this.cheerio.load(this.html);
        let releaseDate = this.getReleaseDate();
        return {
            name: this.getName(),
            originalName: this.getFullName(),
            rating: this.getRating(),
            img: this.getImage(),
            sid: dbId,
            year: releaseDate.year,
            intro: this.getDesc(),
            director: this.getDirectors(),
            writer: this.getWriters(),
            actor: this.getActors(),
            genre: this.getGenre(),
            site: '',
            country: this.getRegion(),
            language: this.getLanguage(),
            screen: releaseDate.full.join('/'),
            duration: this.getDuration(),
            subname: this.getOtherName(),
            imdb: this.getIMDB(),
            celebrities: this.getMainActorsInfo()
        };
    }


    /**
     * 获取演员列表
     */
    async getCelibritiesData(dbId) {
        let url = 'https://movie.douban.com/subject/' + dbId;
        this.html = await this.request(url, {
            headers: {
                referer: url
            }
        });
        this.dom = this.cheerio.load(this.html);
        return this.getMainActorsInfo();
    }




    /**
     * 影片名
     * @returns {string}
     */
    getName() {
        return this.preg(this.html, /<title>([\s\S]*?)<\/title>/g).trim().replace('(豆瓣)', '').trim();
    }

    /**
     * 完整名称
     * @returns {*[]}
     */
    getFullName() {
        return this.preg(this.html, /<meta property="og:title" content="([\s\S]*?)" \/>/g);
    }

    /**
     * 其它名称
     * @returns {string[]}
     */
    getOtherName() {
        let data = this.preg(this.html, /又名:<\/span>([\s\S]*?)<br\/>/g).trim();
        return data.replace(/\s/g, "").split('/').join("/");
    }

    /**
     * 图片
     * @returns {string}
     */
    getImage() {
        return this.toImage(this.preg(this.html, /<meta property="og:image" content="([\s\S]*?)" \/>/g).trim());
    }

    /**
     * 演员
     * @returns {string}
     */
    getActors() {
        let $ = this.dom;
        let list = [];
        $('a[rel="v:starring"]').each(function(i, el) {
            let name = $(el).text();
            if (name) {
                list.push(name);
            }
        });
        return list.join('/');
    }

    /**
     * 编剧
     * @returns {string}
     */
    getWriters() {
        let $ = this.dom;
        let list = [];
        $('span[class="attrs"] a:not([rel])').each(function(i, el) {
            let name = $(el).text();
            if (name) {
                list.push(name);
            }
        });
        return list.join('/');
    }

    /**
     * 导演
     * @returns {string}
     */
    getDirectors() {
        let $ = this.dom;
        let list = [];
        $('a[rel="v:directedBy"]').each(function(i, el) {
            let name = $(el).text();
            if (name) {
                list.push(name);
            }
        });
        return list.join('/');
    }

    /**
     * 获取地区
     * @returns {*[]}
     */
    getRegion() {
        let data = this.preg(this.html, /<span class="pl">制片国家\/地区:<\/span> ([\s\S]*?)<br\/>/g);
        if (!data) return [];
        return data.replace(/\s/g, "").split('/').join("/");
    }

    /**
     * 语言
     * @returns {string[]|*[]}
     */
    getLanguage() {
        let data = this.preg(this.html, /语言:<\/span>([\s\S]*?)<br\/>/g);
        if (!data) return [];
        return data.replace(/\s/g, "").split('/').join("/");
    }

    /**
     * 出版日期
     * @returns {{}}
     */
    getReleaseDate() {
        let full = this.preg(this.html, /<span property="v:initialReleaseDate" content="([\s\S]*?)">/g, true);
        if (!full.length) return { full: '', year: '' };
        let year = full[0].split('-')[0];
        return { full, year };
    }

    /**
     * IMDB
     * @returns {string}
     */
    getIMDB() {
        return this.preg(this.html, /IMDb:<\/span>([\s\S]*?)<br>/g).trim();
    }

    /**
     * 单集时长
     * @returns {string}
     */
    getEpisodeLength() {
        return this.preg(this.html, /单集片长:<\/span>([\s\S]*?)<br\/>/g).trim();
    }

    /**
     * 影片片长
     */
    getMovieLength() {
        return this.preg(this.html, /<span property="v:runtime" content="([\s\S]*?)">([\s\S]*?)<\/span>/g).trim();
    }

    /**
     * 获取时长
     * @returns {string|*}
     */
    getDuration() {
        return (this.getEpisodeLength() || this.getMovieLength()).replace('分钟', '') + '分钟';
    }

    /**
     * 主要人员信息
     * @returns {[]}
     */
    getMainActorsInfo() {
        let $ = this.cheerio.load(this.html);
        let that = this;
        let list = [];
        $('li[class="celebrity"]').each(function(i, el) {
            let html = $(el).find('.avatar').attr('style');
            let images = html.split(',');
            let image = images.length > 1 ? images[1] : images[0];
            let img = that.preg(image, /url\(([\s\S]*?)\)/g).trim();
            let name = $(el).find('a[class="name"]').text();
            let role = $(el).find('span[class="role"]').text();
            let link = $(el).find('a').attr('href');
            list.push({
                id: that.getDouBan(link),
                name,
                img,
                role
            });
        });
        return list;
    }

    /**
     * 其它推荐
     */
    getRecommend() {
        let $ = this.dom;
        let that = this;
        let list = [];
        $('dl').each(function(i, el) {
            let link = $(el).find('a').attr('href');
            let id = that.getDouBan(link);
            let name = $(el).find('img').attr('alt');
            let image = that.toImage($(el).find('img').attr('src'));
            list.push({ id, name, image });
        });
        return list
    }

    /**
     * 剧情分类
     * @returns {*[]}
     */
    getGenre() {
        return this.preg(this.html, /<span property="v:genre">([\s\S]*?)<\/span>/g, true).join("/");
    }

    /**
     * 评分
     * @returns {*[]}
     */
    getRating() {
        return this.preg(this.html, /property="v:average">([\s\S]*?)<\/strong>/g);
    }

    /**
     * 描述
     * @returns {string}
     */
    getDesc() {
        return this.preg(this.html, /<span property="v:summary" class="">([\s\S]*?)<\/span>/g).trim().replace(/\s/g, "");
    }
}

// new Subject().getData('35207856');
module.exports = Subject;