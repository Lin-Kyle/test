[![Build Status](https://secure.travis-ci.org/alexfernandez/loadtest.svg)](http://travis-ci.org/alexfernandez/loadtest)

[![NPM](https://nodei.co/npm/loadtest.png?downloads=true)](https://nodei.co/npm/loadtest/)

[![Package quality](http://packagequality.com/badge/loadtest.png)](http://packagequality.com/#?package=loadtest)

# loadtest

> Runs a load test on the selected HTTP or WebSockets URL. The API allows for easy integration in your own tests.

在选定的HTTP或者WebSockets URL上进行负载测试，API允许在你自己的测试里轻松集成。

## Installation
>Install globally as root:

全局安装

    # npm install -g loadtest

> On Ubuntu or Mac OS X systems install using sudo:

在Ubuntu 或者 Mac OS X系统安装使用 sudo

    $ sudo npm install -g loadtest

>For access to the API just add package `loadtest` to your `package.json` devDependencies:

想要访问API只需要在package.json里的devDependencies添加loadtest

```json
{
	...
	"devDependencies": {
		"loadtest": "*"
	},
	...
}
```

## 用法

>Why use `loadtest` instead of any other of the available tools, notably Apache `ab`?
`loadtest` allows you to configure and tweak requests to simulate real world loads.

为什么使用loadtest替代其他的可用工具，尤其是Apache `ab`？
`loadtest` 允许你配置和调整请求去模拟真实世界的负载。


### 基础用法

> Run as a script to load test a URL:

作为脚本执行去负载测试URL:

    $ loadtest [-n requests] [-c concurrency] [-k] URL

>The URL can be "http://", "https://" or "ws://".
Set the max number of requests with `-n`, and the desired level of concurrency with the `-c` parameter.
Use keep-alive connections with `-k` whenever it makes sense,
which should be always except when you are testing opening and closing connections.

URL可以是"http://", "https://" 或者 "ws://".
`-n`设置最大请求数，
`-c`设置并发级别，
除了测试打开和关闭连接以外有意义的时候可以用`-k`做长连接。

>Single-dash parameters (e.g. `-n`) are designed to be compatible with
[Apache `ab`](http://httpd.apache.org/docs/2.2/programs/ab.html),
except that here you can add the parameters after the URL.

单破折号参数（例如`-n`）被设计为可兼容[Apache `ab`](http://httpd.apache.org/docs/2.2/programs/ab.html)，除了你可以在URL后面添加参数。

> To get online help, run loadtest without parameters:

想要获取线上帮助，运行loadtest不带参数：

    $ loadtest

### 用法文档

> The set of basic options are designed to be compatible with Apache `ab`.
But while `ab` can only set a concurrency level and lets the server adjust to it,
`loadtest` allows you to set a rate or requests per second with the `--rps` option.

基本设置选项被设计为可兼容Apache `ab`，然而`ab`只能设置并发级别让服务端调整它。`loadtest`允许你用`--rps`选项设置每秒速率或请求数（后面统称rps）。

Example:


    loadtest -c 10 --rps 200 http://mysite.com/

> This command sends exactly 200 requests per second with concurrency 10,
so you can see how your server copes with sustained rps.
Even if `ab` reported a rate of 200 rps,
you will be surprised to see how a constant rate of requests per second affects performance:
no longer are the requests adjusted to the server, but the server must adjust to the requests!
Rps rates are usually lowered dramatically, at least 20~25% (in our example from 200 to 150 rps),
but the resulting figure is much more robust.

这个命令在10并发量情况下每秒发送200个请求，所以你能看到你的服务端怎么处理持续的rps。即使是`ab`报告的速率是200rps，你也会惊奇地看到每秒请求的恒定速率怎么影响性能；不再调整请求到服务器，但是服务器必须调整到请求!
Rps率通常会大幅降低至少20~25%（在我们的例子200-150rps），但由此得出的数据要稳健得多。

> `loadtest` is also quite extensible.
Using the provided API it is very easy to integrate loadtest with your package, and run programmatic load tests.
loadtest makes it very easy to run load tests as part of systems tests, before deploying a new version of your software.
The results include mean response times and percentiles,
so that you can abort deployment e.g. if 99% of the requests don't finish in 10 ms or less.

`loadtest`是可扩展的。
使用提供的API非常容易整合loadtest到你的包里进行负载测试。
在部署新版本软件之前，loadtest使运行负载测试成为系统测试的一部分变得非常容易。
结果包括平均响应时间和百分比，例如，如果99%的请求在10毫秒或更短的时间内没有完成。


### 注意事项

`loadtest` saturates a single CPU pretty quickly.
Do not use `loadtest` if the Node.js process is above 100% usage in `top`, which happens approx. when your load is above 1000~4000 rps.
(You can measure the practical limits of `loadtest` on your specific test machines by running it against a simple
Apache or nginx process and seeing when it reaches 100% CPU.)
`loadtest`会很快使单个CPU饱和。
如果Node.js使用率已经超过100%不要使用`loadtest`，当你负载超过1000~4000rps会发生类似的事。
（你可以运行指定的测试机器测量`loadtest`的实际极限通过简单的Apache 或者 nginx程序查看什么时候达到100%CPU。

There are better tools for that use case:
这些是使用示例更好的工具

* [Apache `ab`](http://httpd.apache.org/docs/2.2/programs/ab.html)
has great performance, but it is also limited by a single CPU performance.
Its practical limit is somewhere around ~40 krps.
性能优异，但是总是限制单个CPU性能。
它的实际极限大概40krps。
* [weighttp](http://redmine.lighttpd.net/projects/weighttp/wiki) is also `ab`-compatible
and is supposed to be very fast (the author has not personally used it).
可以兼容`ab`并且快速支持（作者已经没有亲自维护了）

* [wrk](https://github.com/wg/wrk) is multithreaded and fit for use when multiple CPUs are required or available.
It may need installing from source though, and its interface is not `ab`-compatible.
当多个CPU需要或者可用的时候可用，它可能需要安装源文件并且不兼容`ab`。

### 常规用法

The following parameters are compatible with Apache ab.
下面参数兼容Apache ab.

#### `-n requests`

Number of requests to send out.
发送请求数量

Note: the total number of requests sent can be bigger than the parameter if there is a concurrency parameter;
loadtest will report just the first `n`.
注意：如果这是一个并发参数请求发送总数量可能超过参数，loadtest会只报告第一个`n`.

#### `-c concurrency`

loadtest will create a certain number of clients; this parameter controls how many.
Requests from them will arrive concurrently to the server.
loadtest会创建一定数量的客户端，这参数控制具体多少。
它们的请求会同时到达服务端。

Note: requests are not sent in parallel (from different processes),
but concurrently (a second request may be sent before the first has been answered).
注意：请求实际上没有发送（来自不同的进程），
但是同时（一秒钟请求可能在第一个响应之前发送）

#### `-t timelimit`

Max number of seconds to wait until requests no longer go out.
等待直到请求不再发送的时间

Note: this is different than Apache `ab`, which stops _receiving_ requests after the given seconds.
注意：这里不同于`ab`，后者会在给定时间后停止接收请求。

#### `-k` or `--keepalive`

Open connections using keep-alive: use header 'Connection: Keep-alive' instead of 'Connection: Close'.
使用长连接打开，使用请求头 'Connection: Keep-alive' instead of 'Connection: Close'.

Note: Uses [agentkeepalive](https://npmjs.org/package/agentkeepalive),
which performs better than the default node.js agent.
注意：使用[agentkeepalive](https://npmjs.org/package/agentkeepalive)会好过默认的node.js代理。

#### `-C cookie-name=value`

Send a cookie with the request. The cookie `name=value` is then sent to the server.
This parameter can be repeated as many times as needed.
发送请求cookie，`name=value`会被发送到服务端。
这个参数能够重复多次使用。

#### `-H header:value`

Send a custom header with the request. The line `header:value` is then sent to the server.
This parameter can be repeated as many times as needed.
发送定制请求头，这行的`header:value`会被发送到服务端。
这个参数能够重复多次使用。
Example:


    $ loadtest -H user-agent:tester/0.4 ...

Note: if not present, loadtest will add a few headers on its own: the "host" header parsed from the URL,
a custom user agent "loadtest/" plus version (`loadtest/1.1.0`), and an accept header for "\*/\*".
注意：如果没有发送，loadtest会附加一些自己的头信息。从URL解析出来的“host”头，一个定制的代理"loadtest/"附加版本(`loadtest/1.1.0`)，可接受"\*/\*"头。

Note: when the same header is sent several times, only the last value will be considered.
If you want to send multiple values with a header, separate them with semicolons:
注意：当同一个头发送给服务端几次，只有最后的值会被考虑。
如果你想一个头发送多个值，使用分号分割。

    $ loadtest -H accept:text/plain;text-html ...

Note: if you need to add a header with spaces, be sure to surround both header and value with quotes:
注意：如果你需要添加空格头，确保引号包裹着两个头和值；

    $ loadtest -H "Authorization: Basic xxx=="

#### `-T content-type`

Set the MIME content type for POST data. Default: `text/plain`.
设置POST提交数据的MIME内容类型，默认: `text/plain`.

#### `-P POST-body`

Send the string as the POST body. E.g.: `-P '{"key": "a9acf03f"}'`
发送一段字符串作为POST请求体，例如: `-P '{"key": "a9acf03f"}'`

#### `-A PATCH-body`

Send the string as the PATCH body. E.g.: `-A '{"key": "a9acf03f"}'`
发送一段字符串作为PATCH请求体，例如: `-A '{"key": "a9acf03f"}'`


#### `-m method`

Send method to link. Accept: [GET, POST, PUT, DELETE, PATCH, get, post, put, delete, patch], Default is GET
E.g.: -m POST
发送连接链接。可接受[GET, POST, PUT, DELETE, PATCH, get, post, put, delete, patch]，默认是GET，例如：-m POST

#### `--data POST some variables`

Send some data. It does not support method GET.
发送一些数据，不支持方法GET
E.g: `--data '{"username": "test", "password": "test"}' -T 'application/x-www-form-urlencoded' -m POST`

It required `-m` and `-T 'application/x-www-form-urlencoded'`

#### `-p POST-file`

Send the data contained in the given file in the POST body.
Remember to set `-T` to the correct content-type.
发送数据包含在POST请求体的给定文件。
记住设置`-T` 正确的内容类型。

If `POST-file` has `.js` extension it will be `require`d. It should be a valid node module and it
should `export` a single function, which is invoked with an automatically generated request identifier
to provide the body of each request.
This is useful if you want to generate request bodies dynamically and vary them for each request.
如果 `POST-file` 有 `.js`后缀会被引入，它应该“导出”使用自动生成的请求标识符调用的单个函数提供每个请求的主体

Example:


```javascript
module.exports = function(requestId) {
  // this object will be serialized to JSON and sent in the body of the request
  return {
	key: 'value',
	requestId: requestId
  };
};
```

#### `-u PUT-file`

Send the data contained in the given file as a PUT request.
Remember to set `-T` to the correct content-type.
发送数据包含在POST请求体的给定文件。
记住设置`-T` 正确的内容类型。



If `PUT-file` has `.js` extension it will be `require`d. It should be a valid node module and it
should `export` a single function, which is invoked with an automatically generated request identifier
to provide the body of each request.
This is useful if you want to generate request bodies dynamically and vary them for each request.
For an example function see above for `-p`.
如果 `POST-file` 有 `.js`后缀会被引入，它应该“导出”使用自动生成的请求标识符调用的单个函数提供每个请求的主体。
如果您想动态地生成请求体并为每个请求更改它们，那么这是非常有用的。
对于一个示例函数，请参见上面的“-p”。

#### `-a PATCH-file`

Send the data contained in the given file as a PATCH request.
Remember to set `-T` to the correct content-type.
发送数据包含在POST请求体的给定文件。
记住设置`-T` 正确的内容类型。


If `PATCH-file` has `.js` extension it will be `require`d. It should be a valid node module and it
should `export` a single function, which is invoked with an automatically generated request identifier
to provide the body of each request.
This is useful if you want to generate request bodies dynamically and vary them for each request.
For an example function see above for `-p`.
如果 `POST-file` 有 `.js`后缀会被引入，它应该“导出”使用自动生成的请求标识符调用的单个函数提供每个请求的主体。
如果您想动态地生成请求体并为每个请求更改它们，那么这是非常有用的。
对于一个示例函数，请参见上面的“-p”。

##### `-r`

Recover from errors. Always active: loadtest does not stop on errors.
After the tests are finished, if there were errors a report with all error codes will be shown.
从错误中回复，总是处于活跃之中：loadtest不会从错误中停止。
在测试完成之后，如果出现错误，将显示一个包含所有错误代码的报告。

#### `-s`

The TLS/SSL method to use. (e.g. TLSv1_method)
使用TLS/SSL方法，（例如TLSv1_method）

Example:


    $ loadtest -n 1000 -s TLSv1_method https://www.example.com

#### `-V`

Show version number and exit.
显示版本号并且退出

### Advanced Usage

The following parameters are _not_ compatible with Apache ab.
下面参数并不兼容Apache ab.

#### `--rps requestsPerSecond`

Controls the number of requests per second that are sent.
Can be fractional, e.g. `--rps 0.5` sends one request every two seconds.
控制每秒发送请求的数量。
可以是小数，例如`--rps 0.5` 两秒发送一个请求。

Note: Concurrency doesn't affect the final number of requests per second,
since rps will be shared by all the clients. E.g.:
注意：兼容性不影响最终每秒发送的请求数，
因为rps会被所有客户端共享，例如

    loadtest <url> -c 10 --rps 10

will send a total of 10 rps to the given URL, from 10 different clients
(each client will send 1 request per second).
会从10个不同的客户端向给定的URL发送10rps（每个客户端将每秒发送一个请求）

Beware: if concurrency is too low then it is possible that there will not be enough clients
to send all of the rps, adjust it with `-c` if needed.
注意：如果并发低于可能会导致没有足够的客户端发送所有的rps，需要的话可以使用`-c`调整。

Note: --rps is not supported for websockets.
注意：--rps不支持websockets

#### `--timeout milliseconds`

Timeout for each generated request in milliseconds.
Setting this to 0 disables timeout (default).
每个自动请求过时毫秒
设置为0禁止超时（默认）

#### `-R requestGeneratorModule.js`

Use custom request generator function from an external file.
使用外部文件的定制请求生成函数

Example request generator module could look like this:
外部文件的定制请求生成函数可能如下：

```javascript
module.exports = function(params, options, client, callback) {
  generateMessageAsync(function(message) {

    if (message)
    {
      options.headers['Content-Length'] = message.length;
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    request = client(options, callback);
    if (message){
      request.write(message);
    }

    return request;
  }
}
```

See [`sample/request-generator.js`](https://github.com/alexfernandez/loadtest/blob/master/sample/request-generator.js)
for some sample code including a body.

#### `--agent` (deprecated)

Open connections using keep-alive.
使用长连接打开

Note: instead of using the default agent, this option is now an alias for `-k`.
注意:这个选项不是使用默认代理，而是“-k”的别名。

#### `--quiet`

Do not show any messages.
不展示任何信息

#### `--debug`

Show debug messages.
展示debug信息

#### `--insecure`

Allow invalid and self-signed certificates over https.
允许无效和自签名证书通过https。

#### `--cert path/to/cert.pem`

Sets the certificate for the http client to use. Must be used with `--key`.
设置http客户端使用的证书，必须使用`--key`.

#### `--key path/to/key.pem`

Sets the key for the http client to use. Must be used with `--cert`.
设置http客户端使用的key，必须使用`--cert`.


### Server

loadtest bundles a test server. To run it:
loadtest捆绑一个测试服务器，运行：

    $ testserver-loadtest [--delay ms] [error 5xx] [percent yy] [port]

This command will show the number of requests received per second,
the latency in answering requests and the headers for selected requests.
这个命令将显示每秒接收的请求数，
响应请求的延迟和所选请求的头。


The server returns a short text 'OK' for every request,
so that latency measurements don't have to take into account request processing.
服务器会为每个请求返回短文`OK`。
所以延迟测量不需要考虑进去处理请求。

If no port is given then default port 7357 will be used.
The optional delay instructs the server to wait for the given number of milliseconds
before answering each request, to simulate a busy server.
You can also simulate errors on a given percent of requests.
如果没有给定端口默认使用7357.
延迟可选项命令服务器在每个请求响应之前等待给定的毫秒数，模仿繁忙的服务器。你可以在给定的请求模仿错误。


### Complete Example

Let us now see how to measure the performance of the test server.
让我们看看怎么测量测试服务器的性能

First we install `loadtest` globally:
首先全局安装loadtest

    $ sudo npm install -g loadtest

Now we start the test server:
现在我们开启测试服务器

    $ testserver-loadtest
    Listening on port 7357

On a different console window we run a load test against it for 20 seconds
with concurrency 10 (only relevant results are shown):
在不同的终端我们启动运行测试代理在20秒内并发数量10（只有相关结果会展示）

    $ loadtest http://localhost:7357/ -t 20 -c 10
    ...
    Requests: 9589, requests per second: 1915, mean latency: 10 ms
    Requests: 16375, requests per second: 1359, mean latency: 10 ms
    Requests: 16375, requests per second: 0, mean latency: 0 ms
    ...
    Completed requests:  16376
    Requests per second: 368
    Total time:          44.503181166000005 s

    Percentage of the requests served within a certain time
      50%      4 ms
      90%      5 ms
      95%      6 ms
      99%      14 ms
     100%      35997 ms (longest request)

Results were quite erratic, with some requests taking up to 36 seconds;
this suggests that Node.js is queueing some requests for a long time, and answering them irregularly.
Now we will try a fixed rate of 1000 rps:
结果相当不稳定，有些请求占用了36秒；
这按时Nodejs需要长时间内队列排序一些请求不规则响应它们。
现在我们尝试1000个rps的固定速率。

    $ loadtest http://localhost:7357/ -t 20 -c 10 --rps 1000
    ...
    Requests: 4551, requests per second: 910, mean latency: 0 ms
    Requests: 9546, requests per second: 1000, mean latency: 0 ms
    Requests: 14549, requests per second: 1000, mean latency: 20 ms
    ...
    Percentage of the requests served within a certain time
      50%      1 ms
      90%      2 ms
      95%      8 ms
      99%      133 ms
     100%      1246 ms (longest request)

Again erratic results. In fact if we leave the test running for 50 seconds we start seeing errors:
再次不稳定，事实上如果我们看测试运行50秒后就开始报错。

    $ loadtest http://localhost:7357/ -t 50 -c 10 --rps 1000
    ...
    Requests: 29212, requests per second: 496, mean latency: 14500 ms
    Errors: 426, accumulated errors: 428, 1.5% of total requests

Let us lower the rate to 500 rps:
让我们低于500rps运行看看

    $ loadtest http://localhost:7357/ -t 20 -c 10 --rps 500
    ...
    Requests: 0, requests per second: 0, mean latency: 0 ms
    Requests: 2258, requests per second: 452, mean latency: 0 ms
    Requests: 4757, requests per second: 500, mean latency: 0 ms
    Requests: 7258, requests per second: 500, mean latency: 0 ms
    Requests: 9757, requests per second: 500, mean latency: 0 ms
    ...
    Requests per second: 500
    Completed requests:  9758
    Total errors:        0
    Total time:          20.002735398000002 s
    Requests per second: 488
    Total time:          20.002735398000002 s

    Percentage of the requests served within a certain time
      50%      1 ms
      90%      1 ms
      95%      1 ms
      99%      14 ms
     100%      148 ms (longest request)

Much better: a sustained rate of 500 rps is seen most of the time,
488 rps average, and 99% of requests answered within 14 ms.
好很多：一个大多数时间都持续在500rps速率
平均488rps和99%请求响应在14毫秒内。

We now know that our server can accept 500 rps without problems.
Not bad for a single-process naïve Node.js server...
We may refine our results further to find at which point from 500 to 1000 rps our server breaks down.
我们现在知道我们的服务器在500rps内没有问题。
对一个单进程纯Node.js服务器不差。。。
我们可以进一步细化我们的结果，以发现在哪个点，我们的服务器从500到1000 rps崩溃。

But instead let us research how to improve the results.
One obvious candidate is to add keep-alive to the requests so we don't have to create
a new connection for every request.
The results (with the same test server) are impressive:
而是让我们研究怎么提升结果。
一个明显的候补是添加长连接请求让我们不需要为每个请求创建新的连接。
结果（同一个测试服务器）令人印象深刻。

    $ loadtest http://localhost:7357/ -t 20 -c 10 -k
    ...
    Requests per second: 4099

    Percentage of the requests served within a certain time
    50%      2 ms
    90%      3 ms
    95%      3 ms
    99%      10 ms
    100%      25 ms (longest request)

Now you're talking! The steady rate also goes up to 2 krps:
现在你们讨论的，这稳定比率总是达到2rps；

    $ loadtest http://localhost:7357/ -t 20 -c 10 --keepalive --rps 2000
    ...
    Requests per second: 1950

    Percentage of the requests served within a certain time
      50%      1 ms
      90%      2 ms
      95%      2 ms
      99%      7 ms
     100%      20 ms (longest request)

Not bad at all: 2 krps with a single core, sustained.
However, it you try to push it beyond that, at 3 krps it will fail miserably.
一点也不差：单核2krps，稳定。
然而，如果你试图推上3krps会失败地很惨。

## API

`loadtest` is not limited to running from the command line; it can be controlled using an API,
thus allowing you to load test your application in your own tests.
`loadtest`运行命令行没有限制；它能够使用API控制，因此允许你在自己的测试里s去负载测试你的应用程序。

### 执行负载测试

To run a load test, just call the exported function `loadTest()` with a set of options and an optional callback:
运行负载测试，只要调用导出函数`loadTest()`设置一些可选项和回调函数：

```javascript
const loadtest = require('loadtest');
const options = {
	url: 'http://localhost:8000',
	maxRequests: 1000,
};
loadtest.loadTest(options, function(error, result)
{
	if (error)
	{
		return console.error('Got an error: %s', error);
	}
	console.log('Tests run successfully');
});
```

The callback `function(error, result)` will be invoked when the max number of requests is reached,
or when the max number of seconds has elapsed.
当最大请求数已经达到或者最大时间数已经过去之后回调函数 `function(error, result)` 会被执行。


Beware: if there are no `maxRequests` and no `maxSeconds`, then tests will run forever
and will not call the callback.
注意：如果没有`maxRequests` 和 `maxSeconds`，测试会一直运行不执行回调。

### Options

All options but `url` are, as their name implies, optional.
除了url所有可选项都是复数形式，可选

#### `url`

The URL to invoke. Mandatory.
URL请求地址，必须

#### `concurrency`

How many clients to start in parallel.
并行启动客户端数量。

#### `maxRequests`

A max number of requests; after they are reached the test will end.
请求最大量；当达到之后测试会结束

Note: the actual number of requests sent can be bigger if there is a concurrency level;
loadtest will report just on the max number of requests.
注意：如果是并发级别实际发送请求数量更加大；loadtest只会报出最大的请求量。

#### `maxSeconds`

Max number of seconds to run the tests.
测试运行时间

Note: after the given number of seconds `loadtest` will stop sending requests,
but may continue receiving tests afterwards.
注意：loadtest会在给定的时间之后停止发送请求，但是会继续接收后续测试。

#### `timeout`

Timeout for each generated request in milliseconds. Setting this to 0 disables timeout (default).
每个生成请求的超时时间，0为禁止超时（默认）。

#### `cookies`

An array of cookies to send. Each cookie should be a string of the form name=value.
发送一组cookies，每个cookie应该是表单名称=值字符串。

#### `headers`

A map of headers. Each header should be an entry in the map with the value given as a string.
If you want to have several values for a header, write a single value separated by semicolons,
like this:
头映射，每个头应该是映射的一个条目，其值是字符串输出。如果你想要有一个条目多个值，使用分号切割：

    {
        accept: "text/plain;text/html"
    }

Note: when using the API, the "host" header is not inferred from the URL but needs to be sent
explicitly.
注意：当使用API，"host"不会从URL推导出来，需要明确传输过来

#### `method`

The method to use: POST, PUT. Default: GET.
使用POST, PUT，默认GET。

#### `body`

The contents to send in the body of the message, for POST or PUT requests.
Can be a string or an object (which will be converted to JSON).
POST 或者 PUT 的发送请求体信息内容，可以是字符串或者对象（需要转译成JSON）

#### `contentType`

The MIME type to use for the body. Default content type is `text/plain`.
请求体使用的MIME类型，默认`text/plain`.

#### `requestsPerSecond`

How many requests each client will send per second.
每个客户端每秒发送多少请求

#### `requestGenerator`

Custom request generator function.
自定义请求生成器函数。

Example request generator function could look like this:
自定义请求生成器函数可能如下：

```javascript
function(params, options, client, callback) {
  generateMessageAsync(function(message)) {
    request = client(options, callback);

    if (message)
    {
      options.headers['Content-Length'] = message.length;
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      request.write(message);
    }

    request.end();
  }
}
```

#### `agentKeepAlive`

Use an agent with 'Connection: Keep-alive'.
使用`Connection: Keep-alive`代理

Note: Uses [agentkeepalive](https://npmjs.org/package/agentkeepalive),
which performs better than the default node.js agent.
注意：使用[agentkeepalive](https://npmjs.org/package/agentkeepalive)性能更加优异于默认nodejs代理。


#### `quiet`

Do not show any messages.
不显示任何信息

#### `indexParam`

The given string will be replaced in the final URL with a unique index.
E.g.: if URL is `http://test.com/value` and `indexParam=value`, then the URL
will be:
给定字符串会替换最终URL的唯一索引。
例如：如果URL是 `http://test.com/value` 和 `indexParam=value`，之后URl会是

* http://test.com/1
* http://test.com/2
* ...
* body will also be replaced `body:{ userid: id_value }` will be `body:{ userid: id_1 }`

#### `insecure`

Allow invalid and self-signed certificates over https.
允许无效和自签名证书通过https。

#### `secureProtocol`

The TLS/SSL method to use. (e.g. TLSv1_method)
使用TLS/SSL方法，（例如TLSv1_method）


Example:

```javascript
const loadtest = require('loadtest');

const options = {
	url: 'https://www.example.com',
    maxRequests: 100,
    secureProtocol: 'TLSv1_method'
};

loadtest.loadTest(options, function(error) {
	if (error) {
		return console.error('Got an error: %s', error);
	}
	console.log('Tests run successfully');
});
```

#### `statusCallback`

Execution this function after every request operation completes. Provides immediate access to test results while the
test batch is still running. This can be used for more detailed custom logging or developing your own spreadsheet or
statistical analysis of results.
每次请求操作完成后执行此函数。提供对测试结果的即时访问
测试批处理仍在运行。这可以用于更详细的自定义日志记录或开发您自己的电子表格或
统计分析的结果。

The results and error passed to the callback are in the same format as the results passed to the final callback.
错误和结果会经过同意的格式化输出到回调函数。

In addition, the following three properties are added to the `result` object:
需要注意的是，下面三个属性值被添加到result对象：

- `requestElapsed`: time in milliseconds it took to complete this individual request.
- `requestIndex`: 0-based index of this particular request in the sequence of all requests to be made.
- `instanceIndex`: the `loadtest(...)` instance index. This is useful if you call `loadtest()` more than once.

You will need to check if `error` is populated in order to determine which object to check for these properties.
您需要检查是否填充了“error”，以确定要检查哪些对象来检查这些属性。

Example:

```javascript
const loadtest = require('loadtest');

function statusCallback(error, result, latency) {
    console.log('Current latency %j, result %j, error %j', latency, result, error);
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
}

const options = {
    url: 'http://localhost:8000',
    maxRequests: 1000,
    statusCallback: statusCallback
};

loadtest.loadTest(options, function(error) {
    if (error) {
        return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
});
```

**Warning**: The format for `statusCallback` has changed in version 2.0.0 onwards.
It used to be `statusCallback(latency, result, error)`,
it has been changed to conform to the usual Node.js standard.
警告： statusCallback 格式在2.0.0版本已经改变。
它曾经用 `statusCallback(latency, result, error)`，
它已经改成Nodejs常用标准

### Results

The latency results passed to your callback at the end of the load test contains a full set of data, including:
mean latency, number of errors and percentiles.
An example follows:
延迟结果会在负载测试的最后传递给你的回调函数包含完整的数据，包括：延迟, 错误数量 和 百分比.

```javascript
{
  totalRequests: 1000,
  percentiles: {
	'50': 7,
	'90': 10,
	'95': 11,
	'99': 15
  },
  rps: 2824,
  totalTimeSeconds: 0.354108,
  meanLatencyMs: 7.72,
  maxLatencyMs: 20,
  totalErrors: 3,
  errors: {
	'0': 1,
	'500': 2
  }
}
```

The second parameter contains info about the current request:
第二个参数包含当前请求信息

```javascript
{
	host: 'localhost',
	path: '/',
	method: 'GET',
	statusCode: 200,
	body: '<html><body>hi</body></html>',
	headers: [...]
}
```

### Start Test Server

To start the test server use the exported function `startServer()` with a set of options and an optional callback:
使用自定义函数`startServer()` 开始测试服务器，带上可选配置和回调函数；

```javascript
const testserver = require('testserver');
const server = testserver.startServer({ port: 8000 });
```

This function returns an HTTP server which can be `close()`d when it is no longer useful.
函数返回一个HTTP服务器当它不在需要的时候能够使用 `close()`关闭

The following options are available.
下面可配置项。

#### `port`

Optional port to use for the server.
可选端口

Note: the default port is 7357, since port 80 requires special privileges.
注意默认端口为7357，因为80需要特权

#### `delay`

Wait the given number of milliseconds to answer each request.
每个请求响应前需要延迟多久

#### `error`

Return an HTTP error code.
返回HTTP错误代码

#### `percent`

Return an HTTP error code only for the given % of requests.
If no error code was specified, default is 500.
返回百分比数量的HTTP错误代码。
如果没有设置默认500

### Complete Example

The file `lib/integration.js` shows a complete example, which is also a full integration test:
it starts the server, send 1000 requests, waits for the callback and closes down the server.
`lib/integration.js`展示完整样例，是一个集成测试；
启动服务器会发送1000个请求等待回调函数然后关闭服务器。

## Versioning

Version 3.x uses ES2015 (ES6) features,
such as `const` or `let` and arrow functions.
For ES5 support please use versions 2.x.
3.x支持ES6,2.x支持ES5.

## Licensed under The MIT License

Copyright (c) 2013-4 Alex Fernández <alexfernandeznpm@gmail.com>
and [contributors](https://github.com/alexfernandez/loadtest/graphs/contributors).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
特此授予许可,免费的,任何人获得这个软件和相关的文档文件的副本(“软件”),解决在软件没有限制,包括但不限于权利使用、复制、修改、合并、出版、发行、有偿、和/或销售的软件副本,并允许他们软件摆设,应当具备下列条件:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
上述版权通知和本许可通知应包含在本软件的所有副本或大部分内容中。

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
本软件是“按原样”提供的，没有任何明示或暗示的保证，包括但不限于适销性、特定用途的适用性和不侵权的保证。在任何情况下，作者或版权持有人均不应对任何索赔、损害或其他责任承担责任，无论是在合同、侵权或其他行为中，由本软件引起、由本软件引起或与本软件的使用或其他交易有关。
