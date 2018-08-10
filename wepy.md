# 开发
## [wepy-plugin-autopages](https://www.npmjs.com/package/wepy-plugin-autopages)
> 使用 wepy 开发项目时不需要手动配置 app.wpy 下的 config.pages，autopages 插件会自动监控 pages 目录下文件的变化，自动生成更新对应 app.json 下的 pages。

注意：该插件只会对编译文件dist里配置添加，源文件是不会改动的。

这插件看情况使用吧，如果是个人项目的话我觉得还是值得用的，毕竟每次新增页面都要手动添加很繁琐，但是如果是合作项目开发到某个阶段的时候还是手动填上去吧，因为便于其他人可以知道你项目的所有跳转路径有哪些。
```
plugins: [
    autopages: {}
]
```


## [wepy-plugin-px2units](https://github.com/yingye/postcss-px2units)
> 将 px 单位转换为 rpx 单位，或者其他单位的 PostCSS插件。
```
plugins: {
    px2units: {
        filter: /.wxss$/
    }
},
```
注意：根据实验所得只对wxss文件起作用，在wxml的行内样式不改变。
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
略微有点鸡肋，虽然会节省一点微不足道的代码量，但是它本身还是有些可能需要用到的配置项的。
* divisor(Number): 除数，转换后的值 等于 pixel / divisor
* multiple(Number): 倍数，转换后的值 等于 pixel * multiple
* decimalPlaces(Number): 小数点后保留的位数，例如, width: 100px 中的100，将会被转换成 Number(100 / divisor * multiple).toFixed(decimalPlaces)
* comment(String): 不转换px单位的注释，默认为 /*no*/。如果设置 comment 的值为 'not replace', width: 100px; /* not replace */ 中的100px将不会被转换为 rpx。
* targetUnits(String): 转换单位，默认值为 rpx，如果设置其值为 'rem'，px将会被转换为rem。



## [wepy-plugin-replace](https://www.npmjs.com/package/wepy-plugin-replace)
> 文本替换,为 plugins 添加 replace 对象，支持单个或者多个规则，多个规则可以以 Array 或者 Object 实现，filter 的对象为生成后文件的路径， 例如'dist/app.js'，每个规则也同时支持多个替换条目，同样是以 Array 或者 Object 实现。
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
用法很简单，指定后缀文件匹配规则替换函数。


# 生产
就以我的一个项目为例，在不用插件的情况下打包体积是6.04M。
然后看看怎么一步步将其体积减少。

## [wepy-plugin-uglifyjs](https://www.npmjs.com/package/wepy-plugin-uglifyjs)
> JS压缩插件
```
module.exports.plugins = {
    'uglifyjs': {
        filter: /\.js$/,
        config: {
        }
    },
};
```
因为小程序基本JS代码为主，所以这个效果非常可观，文档只写了这个用法，还有很多自定义选项需要自己去研究，文档给出的参数说明链接是
[UglifyJS2](https://github.com/mishoo/UglifyJS2)，即使如此，单单JS一项都好厉害。

|使用前|使用后|压缩率|
| ------ | ------ | ------ |
|6.04M | 2.76M  |  45.69%|

## [wepy-plugin-filemin](https://www.npmjs.com/package/wepy-plugin-filemin)
> 文件压缩插件支持css，xml，json
```
module.exports.plugins = {
    'filemin': {
        filter: /\.(json|wxml|xml)$/
    }
};
```

使用前|使用后|压缩率
| ------ | ------ | ------ |
2.76M  | 2.72M  |  98.55%

唔。。。
有点尴尬，那点体积真的微不足道，一来样式本来就不多，二来css本身压缩空间有限，不可能把样式属性简化吧，聊胜于无。

## [wepy-plugin-imagemin](https://www.npmjs.com/package/wepy-plugin-imagemin)
> 图片压缩插件
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
参数说明请看[imagemin](https://github.com/imagemin/imagemin)

使用前|使用后|压缩率
| ------ | ------ | ------ |
2.72M  | 2.24M  |  82.35%
不得不说还是可以的，基本用法大家用过打包器都不陌生就不说了,直到某一天腾讯出了一款重量大杀器，请看看下面----



## [ WeCOS ](https://cloud.tencent.com/developer/article/1007054?fromSource=gwzcw.706043.706043.706043)
> 腾讯推出的小程序瘦身工具，通过 WeCOS，小程序项目中的图片资源会自动上传到 COS 上，且 WeCOS 自动替换代码中图片资源地址的引用为线上地址，移除项目目录中的图片资源，从而减小代码包大小，解决包大小超过限制的问题。

前期准备工作：
* 进入 腾讯云官网，注册腾讯云账户，指引参考 注册腾讯云。
* 登录 对象存储控制台，开通对象存储服务，创建存储桶，指引参考 创建存储桶
* 通过 GitHub 地址 下载 WeCOS 工具。
* 在 Node.js 官网下载环境并安装。

我就默认你们都搞好了前期，然后我们先安装插件
> npm install wecos -g

在与开发目录app 同目录下创建一个 wecos.config.json 配置文件，在配置里填写基本的配置信息。
* appDir 指定了小程序开发目录。
* appid 为腾讯云账号的appid。
* bucketname 是为存储图片创建的 bucket 的名称，这里是名为 weixintest 的 bucket。
* folder 可以指定到 bucket 下的某个目录，本文指定到 /wxtest 目录下。
* region 是指定上传到 COS 的指定地区，这里指定为 tj ，即天津。目前COS 支持天津、上海、广州。
* secret_key、secret_id是账户密钥，用户可以自行到腾讯云 COS 控制台上获取。

之后直接运行命令
> wecos

命令行显示项目中的图片上传成功。翻看项目目录，发现图片已经被删除，代码中的图片引用也被换成了线上的地址，项目包一下子小了。同时，WeCOS 很贴心的在开发项目外生成了个 wecos_backup 目录，来保存原来的图片作为备份。除此之外，WeCOS 默认启用监听模式，这是为了让开发过程中无感知，当我们不再进行项目开发，停止运行 WeCOS 即可。

和wepy-plugin-imagemin相比。

使用前|使用后|压缩率
| ------ | ------ | ------ |
2.72M  | 1.46M  |  53.67%

前者操作简单无额外依赖，后者效率惊人，具体取舍看项目需要吧。
