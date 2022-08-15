const Common = new require('./Common');

class Photos extends Common {
    /**
     * 获取数据
     * @param dbId
     * @param pageNo
     * @returns {Promise<[]>}
     */
    async getPhotoData(dbId) {
        let start = 0;
        let result = [];
        let url = 'https://movie.douban.com/subject/' + dbId + '/photos?type=S&start=' + start + '&sortby=like&size=a&subtype=a';
        result.push(await this.request(url, {
            headers: {
                referer: url
            }
        }));
        let url2 = 'https://movie.douban.com/subject/' + dbId + '/photos?type=R&start=' + start + '&sortby=like&size=a&subtype=a';
        result.push(await this.request(url2, {
            headers: {
                referer: url2
            }
        }));
        let list = [];
        for (let i = 0; i < result.length; i++) {
            const $ = this.cheerio.load(result[i]);
            $('li').each(function(i, el) {
                let id = $(this).attr('data-id');
                if (id) {
                    let image = $(this).find('img').attr('src');
                    image = 'https://img1.doubanio.com' + new URL(image).pathname;
                    let prop = $(this).find('.prop').text().trim();
                    list.push({
                        id,
                        small: image.replace('/m/', '/s/'),
                        medium: image,
                        large: image.replace('/m/', '/l/'),
                        size: prop,
                        width: prop.split('x')[0],
                        height: prop.split('x')[1]
                    });
                }
            });
        }
        return list;
    }
}


module.exports = Photos;