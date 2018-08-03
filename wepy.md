## [wepy-plugin-autopages](https://www.npmjs.com/package/wepy-plugin-autopages)
使用 wepy 开发项目时不需要手动配置 app.wpy 下的 config.pages，autopages 插件会自动监控 pages 目录下文件的变化，自动生成更新对应 app.json 下的 pages。
```
plugins: [
    autopages: {}
]
```


## [wepy-plugin-px2units](https://github.com/yingye/postcss-px2units)
将 px 单位转换为 rpx 单位，或者其他单位的 PostCSS插件。
```
plugins: {
        px2units: {
            filter: /.wxss$/
        }
},
```
根据实验所得只对wxss文件起作用，在wxml的行内样式不改变。
```
//输入
.userinfo-nickname {
    width: 200px;
    height: 200px;/*no*/
    margin: 200rpx;
}
```
```
//输出
.userinfo-nickname {
  width: 200rpx;
  height: 200px;
  margin: 200rpx;
}
```



## [wepy-plugin-replace](https://www.npmjs.com/package/wepy-plugin-replace)
文本替换,为 plugins 添加 replace 对象，支持单个或者多个规则，多个规则可以以 Array 或者 Object 实现，filter 的对象为生成后文件的路径， 例如'dist/app.js'，每个规则也同时支持多个替换条目，同样是以 Array 或者 Object 实现。
```
module.exports.plugins = {
    'replace': {
        filter: /moment\.js$/,
        config: {
            find: /([\w\[\]a-d\.]+)\s*instanceof Function/g,
            replace: function (matchs, word) {
                return ' typeof ' + word + " ==='function' ";
            }
        }
    }
};
```


## [wepy-plugin-uglifyjs](https://www.npmjs.com/package/wepy-plugin-uglifyjs)
JS压缩插件
```
module.exports.plugins = {
    'uglifyjs': {
        filter: /\.js$/,
        config: {
        }
    },
};
```
使用前|使用后|压缩率
-|-|-
6.04M | 2.76M  |  45.69%

## [wepy-plugin-filemin](https://www.npmjs.com/package/wepy-plugin-filemin)
文件压缩插件支持css，xml，json
```
module.exports.plugins = {
    'filemin': {
        filter: /\.(json|wxml|xml)$/
    }
};
```
使用前|使用后|压缩率
-|-|-
2.76M  | 2.72M  |  98.55%

## [wepy-plugin-imagemin](https://www.npmjs.com/package/wepy-plugin-imagemin)
图片压缩插件
```
module.exports.plugins = {
    'imagemin': {
        filter: /\.(jpg|png|jpeg)$/,
        config: {
            'jpg': {
                quality: 80
            },
            'png': {
                quality: 80
            }
        }
    }
};
```
使用前|使用后|压缩率
-|-|-
2.72M  | 2.24M  |  82.35%


## [ WeCOS ](https://cloud.tencent.com/developer/article/1007054?fromSource=gwzcw.706043.706043.706043)
腾讯推出的小程序瘦身工具，通过 WeCOS，小程序项目中的图片资源会自动上传到 COS 上，且 WeCOS 自动替换代码中图片资源地址的引用为线上地址，移除项目目录中的图片资源，从而减小代码包大小，解决包大小超过限制的问题。
前期准备工作：
* 进入 腾讯云官网，注册腾讯云账户，指引参考 注册腾讯云。
* 登录 对象存储控制台，开通对象存储服务，创建存储桶，指引参考 创建存储桶
* 通过 GitHub 地址 下载 WeCOS 工具。
* 在 Node.js 官网下载环境并安装。

使用前|使用后|压缩率
-|-|-
2.72M  | 1.46M  |  53.67%
