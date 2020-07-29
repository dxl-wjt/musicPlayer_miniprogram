// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化云函数
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return await cloud.database().collection('musicList')
    .get({
      success:function(res){
        return res;
      },
      fail:function(err){
        return err
      }
    });
}