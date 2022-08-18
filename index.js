const express = require('express');
const app = express();
const cors = require('cors');
const port = 6502;

// API异常处理
const ApiException = (message, errorCode = 999, status = 500) => {
    throw JSON.stringify({
        errorCode,
        message,
        status
    });
};

// 全局返回头
app.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});

// 全局报错处理
app.use((err, req, res, next) => {
    err = JSON.parse(err);
    res.status(err.status || 500);
    res.json(err);
});

//跨域
app.use(cors());


// movies?type=partial&q=Harry%20Potter
app.get('/bus', async (req, res, next) => {
    console.log("/bus")
    const search = new require('./bus-lib/MovieSearch');
    // let { q } = req.params;
    let { q } = req.query;

    let i = 0;


    for (let i = 0; i < 8; i++) {
        let data = await new search().getSearchData(q.toUpperCase());
        if (data.length == 0) {
            // data = await new search().getSearchData(q.toUpperCase());
            i++;
        } else {
            res.send(data);
            break;
        }
        console.log("i=", i)
    }

});



// movies?type=partial&q=Harry%20Potter
app.get('/movies', async (req, res, next) => {
    console.log("/movies")
    const search = new require('./douban-lib/MovieSearch');
    // let { q } = req.params;
    let { q } = req.query;
    let data = await new search().getSearchData(q);
    res.send(data);
});


// movies/1295038
app.get('/movies/:id', async (req, res, next) => {
    console.log("/movies/id")
    const handle = new require('./douban-lib/MovieDetail');
    let { id } = req.params;
    let data = await new handle().getMovieData(id);
    res.send(data);
});


//movies/2043546/celebrities
app.get('/movies/:id/celebrities', async (req, res, next) => {
    console.log("/movies/:id/celebrities")
    const handle = new require('./douban-lib/MovieDetail');
    let { id } = req.params;
    let data = await new handle().getCelibritiesData(id);
    res.send(data);
});

//movies/2043546/celebrities
app.get('/photo/:id', async (req, res, next) => {
    console.log("/photo/:id")
    const handle = new require('./douban-lib/MoviePhotos');
    let { id } = req.params;
    let data = await new handle().getPhotoData(id);
    res.send(data);
});



app.listen(port, () => {
    console.log(`douban app listening on port ${port}`)
});