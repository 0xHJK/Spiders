/**
 * https://github.com/0xHJK/
 * HJKdev+Public@gmail.com
 *
 * Usage: node douban-album.js [url]
 * 
 */

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url     = process.argv.splice(2)[0];
// 5秒延迟
var delay   = 5;
var options = {
  url: url,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
  }
};

if(!url){
  console.log('请输入豆瓣相册url'); 
  console.log('Example: node douban-album.js http://www.douban.com/photos/album/92660757');
  return false;
}

console.log('＝＝＝＝＝＝开始下载豆瓣相册＝＝＝＝＝＝');
console.log('＝＝＝＝＝＝By HJK＝＝＝＝＝＝');

getPhoto(url);

// 获取图片地址
function getPhoto(url) {
  options.url = url;

  request(options, function(err, res, body){
    if(!err && res.statusCode == 200){
      var $ = cheerio.load(body);
      var nextUrl = $('.next a').attr('href');
      var dir = $('h1').text().split('-')[1];
      var current = $('.thispage').text();
      var total = $('.thispage').data('totalPage');
      var count = $('.count').text();
      $('.photolst_photo img').each(function(i, e){
        var thumb = $(e).attr('src');
        var photo = thumb.split('thumb')[0] + 'photo' + thumb.split('thumb')[1];
        console.log('开始下载... ' + photo);
        download(photo, dir, photo.substr(-15, 15));
      });
      if(current != total) {
        console.log('＝＝＝＝＝＝已完成' + current + '页，共' + total + '页' + count + '＝＝＝＝＝＝');
      } else {
        console.log('＝＝＝＝＝＝已完成' + count + '＝＝＝＝＝＝');
      }
      if (nextUrl) {
        console.log('＝＝＝＝＝＝准备下载第' + (current + 1) + '页(已设置' + delay + '秒延迟)＝＝＝＝＝＝');
        var timer = setTimeout(function(){
          getPhoto(nextUrl)
        }, delay * 1000);
      }
    } else {
      console.log('发生错误'+ err);
    }
  });
}

// 新建文件夹并下载图片
function download(url, dir, filename){
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream('./' + dir + '/' + filename));
  });
}
