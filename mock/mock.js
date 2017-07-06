let Mock = require('mockjs');
let Random = Mock.Random;

module.exports = function(){
  // 扩展方法
  Random.extend({
    constellation: function(date) {
      var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
      return this.pick(constellations)
    }
  })
  
  // var data = {
  //   users: [],
  //   news: []
  // };

  // var images = [1, 2, 3].map(x=>Random.image('200x100', Random.color(), Random.word(2, 6)));

  // for(let i = 0; i < 50; i ++){
  //   data.users.push({
  //     id: i,
  //     name: Random.cname(),
  //     password: Random.string(6, 10),
  //     birthday: Random.date(),
  //     address: Random.county(true)
  //   })
  // }

  // for(let i = 0; i < 100; i ++){
  //   var content = Random.cparagraph(0, 10);

  //   data.news.push({
  //     id: i,
  //     title: Random.cword(8, 20),
  //     desc: content.substr(0, 40),
  //     tag: Random.cword(2, 6),
  //     views: Random.integer(100, 5000),
  //     images: images.slice(0, Random.integer(1, 3)),
  //     author: Random.pick(data.users).name
  //   });
  // }

  // var data = {
  //   user: [],
  //   article: []
  // }

  // var userTemplate = {
  //   'id|+1': 1,
  //   'name': '@CNAME',
  //   'constellation': '@CONSTELLATION'
  // }

  // for(let i = 0; i < 10; i ++){
  //   data.user.push(Mock.mock(userTemplate))
  // }

  // var articleTemplate = {
  //   'id|+1': 1,
  //   'title': '@CTITLE',
  //   'author': function(){
  //     let user = Random.pick(data.user)
  //     return user.name
  //   }
  // }

  // for(let j = 0; j < 10; j ++){
  //   data.article.push(Mock.mock(articleTemplate))
  // }

  var template = {
   'user|10': [
     {
       'id|+1': 001,
       'name': '@CNAME',
       'constellation': '@CONSTELLATION'
     }
   ],
   'article|10': [
     {
       'id|+1': 001,
       'title': '@CTITLE',
       'author': '@PICK(@../../user)'
     }
   ]
  }

  var data = Mock.mock(template)
  return data;
};