## 前言

本文需对`js`、`es6`、`webpack`、`网络请求`等基础知识有基本了解

相信`axios`大家都用过或者什么其他的`网络请求`相关的库，什么`ajax`、`fly.js`等等等等，光我用过的请求库就七八个，都大同小异

本文并不是要完完全全一个字不差的实现`axios`所有功能，没有意义，但是也会实现的七七八八，主要是感受一下这个流程和架子、以及 这个项目怎么才能易于拓展、是不是易于测试的、可读性怎么样等等等等

废话不多说，开搞～

## 搭建项目

老规矩先建一个空目录，然后打开命令行执行

`yarn init -y` 

或

`cnpm init -y`

### webpack

然后是引入`webpack`，虽然本节不主讲`webpack`，这里我稍微提一嘴，`webpack`和`webpack-cli`不光项目里要下载，全局也要下载，也就是
`yarn global add webpack webpack-cli`

### 安装依赖包

执行命令，主要就需要这几个包，帮忙编译和调试的，`babel`帮助**尽量**兼容浏览器的，毕竟咱们写代码肯定充满了`es6`

`yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env`

### 配置webpack

接下来再在根目录创建`webpack.config.js`来配置一下`webpack`，然后再建一个`src`目录，来存放咱们这个库的代码，现在的目录就会是这个样子

![](https://user-gold-cdn.xitu.io/2020/1/9/16f899589e7d9fb7?w=2048&h=1536&f=png&s=167126)


先简单配置一下，后续有需求在加，这里就直接上代码了

~ webpack.config.js

``` js
const path = require('path');

module.exports = function() {
  const dev = true;

  return {
    mode: dev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev ? 'axios.js' : 'axios.min.js',
      sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
  };
};


```

这时候在`src`里面，建一个`index.js`，然后随便写点东西，像这样

![](https://user-gold-cdn.xitu.io/2020/1/9/16f899dabcdf6b6f?w=1126&h=792&f=png&s=79180)

然后终端执行`webpack`命令


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89a94a977642c?w=2014&h=1484&f=gif&s=3878379)

当然了，现在肯定是不兼容的，要不咱们一开始也不用下`babel`了，咱们可以试试，比如我现在`index.js`加一句话

![](https://user-gold-cdn.xitu.io/2020/1/9/16f89afe84bce9df?w=1046&h=520&f=png&s=29492)

然后编译完可以看到结果也还是`let`，这肯定不行

![](https://user-gold-cdn.xitu.io/2020/1/9/16f89b03e9ee4556?w=1364&h=714&f=png&s=133526)

好的，那么接下来就是配置`babel`，没什么可说的，这里直接放代码了，没什么可说的
```js
const path = require('path');

module.exports = function() {
  const dev = true;

  return {
    mode: dev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev ? 'axios.js' : 'axios.min.js',
      sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};

```

然后，大家肯定不希望每次修改手动的去`webpack`一下对吧？把`webpack-dev-server`引进来

~ webpack.config.js

```js
const path = require('path');

module.exports = function() {
  const dev = true;

  return {
    mode: dev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev ? 'axios.js' : 'axios.min.js',
      sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    devServer: {
      port: 8000,
      open: true,
    },
  };
};

```

这时候，直接终端里运行`webpack-dev-server`的话其实他会自动去找全局的模块，这样不好，所以。。。你懂的

直接`package.json`里加上命令

~ package.json
```json
{
  "name": "axios",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "webpack-dev-server"
  },
  "dependencies": {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "babel-loader": "^8.0.6",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.10.1"
  }
}
```

然后`yarn start`


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89b9ab4736934?w=2014&h=1484&f=gif&s=901662)


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89c1be9ea5882?w=1734&h=910&f=png&s=476990)

这时候会弹出一个`html`

![](https://user-gold-cdn.xitu.io/2020/1/9/16f89c2b42813231?w=3282&h=2054&f=png&s=268510)

当然了，默认是去找根下的`index.html`，咱们没有，所以在根下建一个,然后引入咱们的`axios.js`


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89cc9516edfc6?w=1938&h=1978&f=png&s=513000)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>axios</title>
</head>
<body>
  <script src="/axios.js"></script>
</body>
</html>
```
刷新页面就会看到`src/index.js`里的`alert`生效了

![](https://user-gold-cdn.xitu.io/2020/1/9/16f89cbe02d4b02a?w=2582&h=950&f=png&s=137455)


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89d0843ca7623?w=2906&h=1638&f=gif&s=3373870)

并且 `webpack-dev-server`也是可以的，改了代码页面会自动刷新

然后，咱们就来陪一下`build`

这里就不多废话了，直接上代码了

~ package.json

```json
{
  "name": "axios",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "webpack-dev-server --env.dev",
    "build": "webpack --env.prod"
  },
  "dependencies": {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "babel-loader": "^8.0.6",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.10.1"
  }
}

```

~ webpack.config.json

```js
const path = require('path');

module.exports = function(env={}) {
  const dev = env.dev;

  return {
    mode: dev ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev ? 'axios.js' : 'axios.min.js',
      sourceMapFilename: dev ? 'axios.map' : 'axios.min.map',
      libraryTarget: 'umd',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    devServer: {
      port: 8000,
      open: true,
    },
  };
};

```


![](https://user-gold-cdn.xitu.io/2020/1/9/16f89d9ac95da24e?w=1654&h=1664&f=gif&s=2983983)

可以看到也是没问题的～

好的到这我本算是把`webpack`相关的东西搭的差不多了，接下来就要开始忙正事了～

## Axios 项目代码

首先咱们先来建一个`common.js`，用来放公共的方法，先写一个断言

~ /src/common.js

```js
export function assert(exp, msg = 'assert faild') {
  if (!exp) {
    throw new Error(msg);
  }
}
```

然后再建一个文件（个人习惯）`/src/axios` 主要的文件放在这

然后大家来看看`axios`正经怎么用，是不是可以直接 `axios({...})`或者`axios.get`等等

在`index.js`引入直接写一下结果，把期望用法写上，然后来补充内部怎么写

~ index.js

```js
import axios from './axios';

console.log(axios);
axios({ url: '1.txt', method: 'post' });
axios.get('1.txt', { headers: { aaa: 123 } });
axios.post(
  '1.txt',
  { data: 123 },
  {
    headers: {
      bbb: 123,
    },
  },
);

```

这时候就要考虑考虑了，咱们可以直接写函数，这个没问题，不过那样太散了，个人不喜欢，不过也是可以的，所以这里我就写成类了，由于改成类了那么输出出去的肯定得是一个`实例`,既然是实例的话，那么肯定也不能直接像函数一样直接()运行

没错，这时候就可以用到咱们的`proxy`了，`js`的`class`里的`constructor`里是可以`return`东西的，如果对这东西不太熟，建议先去看看`js`的`class`，这里就不多赘述，主要说明思想

简单来说，咱们可以`return`一个`proxy`对象，来代理咱们返回的结果，从而达到咱们既可以直接用`class`的方式写，用的时候也可以直接跟函数一样`()`调用

然后先来打印一下看看

～ 


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ccc8ae47db3e?w=1396&h=1174&f=png&s=141721)

这时候看页面的`console`，这时候可以看到`axios`就是一个`proxy`对象，像这样


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ccd6820706c9?w=964&h=670&f=png&s=81769)

这时候还能看到一个报错，因为咱们现在返回的是`proxy`对象，不是实例类了，没有`get`也是理所应当

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ccdbb22d26e1?w=786&h=594&f=png&s=98729)

可能有人会奇怪，为什么这个`proxy`监听的对象非要单独监听一个`proxy`函数呢，直接监听`this`不就行了么，注意，这其实是不行的，了解`proxy`的朋友应该知道，`proxy`你用什么监听创建的这事儿很重要，如果你监听的是一个对象，那还是不能直接调用，如果要是想直接像函数一样直接调用的话，那你监听的也必须是一个函数

像这样


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9cd3137e2f11d?w=1150&h=828&f=png&s=108345)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9cd334c040714?w=982&h=768&f=png&s=112234)

然后咱们来解决一下`get`函数找不到的问题，来给`proxy`加一个方法, 很简单，可以给`proxy`加一个`get`方法，有人来找他，直接返回从我这个类上找，不就完了么，不过稍微要注意一下这个`this`，直接写`this`的话指向的是这个`proxy`

```js
function request() {}

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  get() {
    console.log('get');
  }

  post() {
    console.log('post');
  }

  delete() {}
}

let axios = new Axios();

export default axios;

```

这时候再看，就没有报错了，并且`get`和`post`也能`console`出来


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e6a4b56e47d7?w=1030&h=568&f=png&s=80521)

这时候咱们就可以接着写数据请求了。。。。。吗？
远远不够

`axios`的参数有很多的多样性，咱们想来大概总结一下
```js
axios('1.txt',{})
axios({
    url: '1.txt',
    method
})

axios.get('1.txt')
axios.get('1.txt',{})

axios.post....

```

等等吧，这一点，怎么才能把这么复杂多源的参数统一处理

第二就是`axios`可以非常深度的定制参数，可以全局也可以单独定制，拦截器，`transfrom`什么的，等等吧，默认值等等

---

### 参数

首先先来一个`default`，来定义一下这些默认值，这里稍微说一下这个`X-Request-By`算是一个不成文的规范，这也是普遍请求库都愿意做的事，方便后台去判断你这个请求是来自`ajax`还是`from`还是浏览器的`url`

```js
function request() {}

const _default = {
  method: 'get',
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
    delete: {},
  },
};

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  get() {
    console.log('get');
  }

  post() {
    console.log('post');
  }

  delete() {}
}

let axios = new Axios();

export default axios;

```

当然了，这里图简单，简单写着几个参数，自己喜欢可以再加很多东西，比如`data`的默认值等等，先够用，后续不够用再加

---

这时候，咱们来思考一下，这个`default`要加给谁，直接`axios.default = _default`么，当然不是，因为咱们这个`axios`到最后肯定是需要`axios.create`多个实例的，那么这时候就不行了，互相影响，`prototype`就更不用说了

其实也很简单，每次创建的时候从`_default`复制一份新的就可以了，直接`JSON.parse(JSON.stringify(_default))`包一下就可以了，这也是性能最高的方式,然后稍微来改造一下代码

``` js
function request() {}

const _default = {
  method: 'get',
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
    delete: {},
  },
};

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  get() {
    console.log('get');
  }

  post() {
    console.log('post');
  }

  delete() {}
}

Axios.create = Axios.prototype.create = function() {
  let axios = new Axios();

  axios.default = JSON.parse(JSON.stringify(_default));

  return axios;
};

export default Axios.create();

```

这里是给原型和实例都加了一个`create`方法，因为咱们可能直接用`axios.create()`也可能直接用`axios()`，纯加静态方法或者实例方法都满足不了咱们的需求

这时候我们来实验一下，先来`console`一下`axios.default`
![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e9946b30c18f?w=640&h=136&f=png&s=19664)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e996e2fe1dc3?w=1146&h=202&f=png&s=35436)

你会发现，`undefined`，这是为什么呢，在这里明明都已经添加了呀

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e99cde9eedce?w=880&h=276&f=png&s=29000)

因为这时候这个`axios`并不是一个对象，而是一个`proxy`，咱们还没给`proxy`加`set`方法对不对，加什么都加不上，这时候来改造一下代码

```js
function request() {}

const _default = {
  method: 'get',
  baseUrl: "",
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
    delete: {},
  },
};

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  get() {
    console.log('get');
  }

  post() {
    console.log('post');
  }

  delete() {}
}

Axios.create = Axios.prototype.create = function() {
  let axios = new Axios();

  axios.default = JSON.parse(JSON.stringify(_default));

  return axios;
};

export default Axios.create();

```

这时候再看浏览器，就会发现这个`default`就有了

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e9c1e97828ef?w=1226&h=404&f=png&s=73451)

以及咱们来`create`两个`axios`，改一下参数试一下


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e9f763eed127?w=894&h=800&f=png&s=80251)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9e9f8d81d35ff?w=1062&h=522&f=png&s=74097)

两个实例参数也不影响，这也是很好的第`n`步，这时候咱们就已经完成`axios`的四分之一了


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ea0835a10095?w=267&h=245&f=png&s=118016)

---

咱们现在实例间是不影响了，不过咱们改改参数的时候绝不止直接`axios.default.xxx`这么改，咱们还应该有参数，像这样


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ea5508ae9a52?w=506&h=258&f=png&s=23090)

这里咱们可以直接改造一下`axios.create`方法

~ axios.js

```js
...
Axios.create = Axios.prototype.create = function(options={}) {
  let axios = new Axios();

  axios.default = {
    ...JSON.parse(JSON.stringify(_default)),
    ...options
  };

  return axios;
};

...
```
直接展开替换一下就行了对不对，但是，真的么？

假设咱们直接穿了一个对象，里面有个`headers`的话是不是就直接给咱们的默认参数`header`整个就得替换了呀，那这个就不太好，当然了，这个也看咱们对自己这个库的需求，如果咱们就想这么做，也到是没啥毛病，问题如下


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ea9eda92ffbd?w=596&h=478&f=png&s=36923)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9eaa2e54351cb?w=704&h=1094&f=png&s=102609)



那么这时候，咱们就可以用一个小小的递归来搞定了

~ axios.js

```js
...
Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };
  function merge(dest, src) {
      for (let name in src) {
        if (typeof src[name] == 'object') {
          if (!dest[name]) {
            dest[name] = {};
          }
    
          merge(dest[name], src[name]);
        } else {
          dest[name] = src[name];
        }
      }
    }

  merge(res, options);

  axios.default = res;
  return axios;
};
...
```

这时候再看，就没问题了

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ebcfed318a8f?w=654&h=1168&f=png&s=108607)

---
### 代码整理拆分

接下来，咱们先不急着去写请求的参数，咱们先把这个代码稍微规划规划，整理整理，毕竟全放在一个文件里，这个以后就没法维护了

目前拆分可以分几点

1. `default` 是不是可以用一个单独的文件来装
2. 这个`merge`函数肯定是公用的，可以放在咱们的`common.js`里
3. 这个`request`也应该单独放在一个`js`里来定义

废话不多说，直接上代码

~ request.js
```js
export default function request() {
  
}
```

~ default.js
```js
export default {
  method: 'get',
  baseUrl: '',
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
    delete: {},
  },
};
```

~ common.js
```js
export function assert(exp, msg = 'assert faild') {
  if (!exp) {
    throw new Error(msg);
  }
}

export function merge(dest, src) {
  for (let name in src) {
    if (typeof src[name] == 'object') {
      if (!dest[name]) {
        dest[name] = {};
      }

      merge(dest[name], src[name]);
    } else {
      dest[name] = src[name];
    }
  }
}
```

~ axios.js
```js
import _default from './default';
import { merge } from './common';
import request from './request';

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  get() {
    console.log('get');
  }

  post() {
    console.log('post');
  }

  delete() {}
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```

这时候就感觉干净不少了，对不对


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ec1a1fcd6bec?w=250&h=250&f=png&s=27976)

---

### 处理请求参数

在写之前，咱们先来看看`axios`都有哪些支持的写法，然后再去考虑怎么写


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ec41ccabaf09?w=706&h=430&f=png&s=190865)

大概来看 除了那个总的`axios({...})`这三种方法是不是差不多呀，当然了，`axios`里东西太多了，这里就简单实现这三个，说明问题为主，大家有兴趣可以自己加，无非是体力活

当然，可以看到`axios`参数情况还是蛮多的，这时候咱们应该直接统一处理，不管传过来什么参数，咱们都返回一个`axios({})`这种，最终统一处理，这不是方便么

这里直接来先判断一下前两种情况


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9ece4b33e6200?w=992&h=1140&f=png&s=130590)

你会发现前两种情况除了这个`method`都是一样的，那这个咱们就可以抽出方法统一处理

~ axios.js

```js
import _default from './default';
import { merge } from './common';
import request from './request';

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  _preprocessArgs(method, ...args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
    } else {
      return undefined;
    }
    return options;
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();
```

然后这时候，咱们以封装一个库的视角，肯定需要对参数进行各种各样的校验，类型等等，不对的话给他一个正经的报错，帮助使用者来调试

咱们之前在`common.js`里写的`assert`这时候就用上了

```js
...
get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      // ...
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );
      
    }
  }
}
...
```

这里的规则对应着上面写的`axios`使用方式，大体来说也差不多，把这些参数都校验好了，接下来，咱们就可以写具体的个性化的处理了

> 顺便一说，这个地方当然也是可以重用的，不过没必要，搞了一通其实也没减少多少代码，并且贼乱，也看个人，大家不喜欢可以自己修改

然后咱们再来处理一下这个`options`，并且`console`一下

~ axios.js

```js
import _default from './default';
import { merge, assert } from './common';
import request from './request';

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        console.log(fn, thisArg, args);
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
    } else {
      return undefined;
    }

    console.log(options);
    return options;
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        console.log(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };

        console.log(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        console.log(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };

      console.log(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```

这时候咱们来测试一下

~ index.js

```js
import Axios from './axios';

Axios.get('1.json');
Axios.get('1.json', { headers: { a: 12 } });

Axios.post('1.php');
Axios.post('1.php', { a: 12, b: 5 });
Axios.post('1.php', [12, 5, 6]);

let form = new FormData();
Axios.post('1.txt', form);
Axios.post('1.txt', 'dw1ewdq');

Axios.post('1.json', form, { headers: { a: 213, b: 132 } });

Axios.delete('1.json');
Axios.delete('1.json', { parmas: { id: 1 } });

```


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9efc4f9b26df4?w=1150&h=1930&f=png&s=290641)

这时候可以看到，妥妥的对不对？

然后呢。。。还没忘，咱们还需要处理直接`apply`的情况，也就是直接`Axios()`这么调用的时候

不废话，直接上代码，跟`get`其实差不多

~ axios.js

```js
import _default from './default';
import { merge, assert } from './common';
import request from './request';

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
                args[1] &&
                args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            console.log(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
    } else {
      return undefined;
    }

    console.log(options);
    return options;
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        console.log(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };

        console.log(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        console.log(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };

      console.log(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```


然后来测试一下

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f04a5b5847e8?w=1016&h=270&f=png&s=23468)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f04b91ec14cf?w=1080&h=446&f=png&s=61182)

没问题，当然为什么`method`是`undefined`，因为这时候还没走到咱们的`default`呢，咱们是在这决定默认请求值的，所以这里直接给个`undefined`就行，然后咱们应该把些`options`全都和`defaulft`处理完，丢给咱们的`request`函数去请求

而这个方法肯定所有请求都需要，所以咱们写一个公共方法

这个`request`方法主要干的事四件事
1. 跟this.default进行合并
2. 检测参数是否正确
3. baseUrl 合并请求
4. 正式调用request(options)

```js
import _default from './default';
import { merge, assert } from './common';
import request from './request';

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
                args[1] &&
                args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            _this.request(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
      this.request(options);
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
      this.request(options);
    } else {
      return undefined;
    }

    return options;
  }

  request(options) {
    console.log(options, 'request');
    // 1. 跟this.default进行合并
    // 2. 检测参数是否正确
    // 3. baseUrl 合并请求
    // 4. 正式调用request(options)
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        this.request(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };
        this.request(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        this.request(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };
      this.request(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```


这个合并很简单，咱们之前写的`merge`函数又派上用场了，修改一下代码

```js
...
request(options) {
    console.log(options);
    // 1. 跟this.default进行合并
    merge(options, this.default);

    console.log(options);
    // 2. 检测参数是否正确
    // 3. baseUrl 合并请求
    // 4. 正式调用request(options)
  }
  ...
```

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f1c1c262ce7d?w=1158&h=854&f=png&s=131216)

这时候可以看到，合并前和合并后数据就已经都有了，但是，这时候咱们的`header`就不应该是全部都有了，应该根据传过来的`method`是什么来把对应的方式的`header`和`common`合并一下

```js
request(options) {
    // 1. 跟this.default进行合并
    let _headers = this.default.headers;
    delete this.default.headers;
    merge(options, this.default);
    this.default.headers = _headers;
    //合并头
    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    console.log(headers);
    console.log(options);

    // 2. 检测参数是否正确
    // 3. baseUrl 合并请求
    // 4. 正式调用request(options)
  }
```

这里比较乱，所以咱们先来捋一捋

咱们目的是要让`header`合并，不过合并的话就会有点小问题，之前在们在`default`的里定义的`common`、`get`...也都会被复制过来，如果要是咱们用`if`判断
`options.header.common == this.default.headers.common`然后`delete`的话，这时候你会发现不行，因为咱们也知道，你直接写两个对象判断就相当于直接`new`了两个对象，那这时候判断肯定不想等，那么咱们是在什么时候复制的呢

就在咱们封装的`merge`里，以及还有很多地方都动过这个东西

然后，咱们应该找到这个东西到底在什么时候就不一样了，其实也就是咱们这个`request`函数里第一次`merge`的时候

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f3442dd81a8d?w=822&h=536&f=png&s=76794)

所以咱们这里玩了一个小技巧，因为`common`这些东西在底下都已经手动搞了，所以这里不需要他复制进来，所以先`delete`了一下

让他在之前就进不去，`delete`之后再给拿回去，两头不耽误，真好～

最后，咱们把`headers`赋值到咱们的`options.headers`

```js
request(options) {
    // 1. 合并头
    let _headers = this.default.headers;
    delete this.default.headers;
    merge(options, this.default);
    this.default.headers = _headers;

    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    options.headers = headers;
    console.log(options);

    // 3. baseUrl 合并请求
    

    // 4. 正式调用request(options)
  }
```

~ index.js
```js
import Axios from './axios';

Axios('1.php');
Axios({
  url: '2.php',
  params: { a: 12, b: 3 },
  headers: {
    a: 12,
  },
});

```
测试一下结果 


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f3a6c34191f8?w=1074&h=588&f=png&s=98409)

可以看到，没毛病～

然后咱们再来看一下第二步，其实这个校验咱们可以写的非常非常多值得校验的事儿，但是这里只说明意思，写几个就算，大家有兴趣可以多补一些

```js
...
assert(options.method, 'no method');
assert(typeof options.method == 'string', 'method must be string');
assert(options.url, 'no url');
assert(typeof options.url == 'string', 'url must be string');
...
```

第三步也是直接上代码了

~ axios.js
```js
options.url=options.baseUrl+options.url;
delete options.baseUrl; 
```

~ common.js
```js
export function assert(exp, msg = 'assert faild') {
  if (!exp) {
    throw new Error(msg);
  }
}

export function merge(dest, src) {
  for (let name in src) {
    if (typeof src[name] == 'object') {
      if (!dest[name]) {
        dest[name] = {};
      }

      merge(dest[name], src[name]);
    } else {
      if (dest[name] === undefined) {
        dest[name] = src[name];
      }
    }
  }
}
```

~ index.js

```js
import Axios from './axios';

Axios('1.php', {
  baseUrl: 'http://www.baidu.com/',
  headers: {
    a: 12,
  },
});
Ï
```


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f475ce2e3eee?w=860&h=304&f=png&s=43856)

这时候再测试一下，可以看到，就没问题了

> 这里说明一下为什么要改一下`merge`,加了一个判断，因为咱们之前是直接替换掉，有没有有替换，这肯定不行，不加上的话会把咱们的`baseUrl`干了

当然了，还有个小事儿咱们需要处理一下，如果用你这个库的人脑子有病（当然，不考虑脑子有病的也可以），他写路径的时候是这么写的

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f4e6d8baab91?w=546&h=250&f=png&s=15777)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f4eb4b5922c4?w=938&h=362&f=png&s=53959)

你这个是不是又不行了呀，很简单，`NodeJS`里有一个`url`包，可以直接引过来用，`webpack`会帮你把他打包起来，不过有一点需要注意，`webpack`不是所有的东西都能打包的，比如`fs`模块，甚至一些底层功能用`c`和`c++`写的系统包这肯定就不行，不过一个`url`问题不大

~ axios.js

```js
import _default from './default';
import { merge, assert } from './common';
import request from './request';
const urlLib = require('url');

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
                args[1] &&
                args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            _this.request(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
      this.request(options);
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
      this.request(options);
    } else {
      return undefined;
    }

    return options;
  }

  request(options) {
    // 1. 合并头
    let _headers = this.default.headers;
    delete this.default.headers;
    merge(options, this.default);
    this.default.headers = _headers;

    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    options.headers = headers;
    console.log(options);

    // 2. 检测参数是否正确
    assert(options.method, 'no method');
    assert(typeof options.method == 'string', 'method must be string');
    assert(options.url, 'no url');
    assert(typeof options.url == 'string', 'url must be string');

    // 3. baseUrl 合并请求
    options.url = urlLib.resolve(options.baseUrl, options.url);
    delete options.baseUrl;

    // 4. 正式调用request(options)
    request(options);
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        this.request(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };
        this.request(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        this.request(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };
      this.request(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```

这时候再测试一下



![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f53f13188635?w=634&h=316&f=png&s=18107)



![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f541c1a1c073?w=1094&h=372&f=png&s=59610)

就没问题了

#### merge 问题

其实咱们这个`merge`现在还有很大的问题，因为咱们最开始的想要的功能很咱们现在的功能有差入

咱们现在是被迫写了一个`if`，改成了查漏补缺，那么其实后面有优先级的东西顺序应该都反过来


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f5a40cae1cfd?w=726&h=544&f=png&s=50743)

咱们最开始的需求是什么，是想让这个`dest`优先级最低，是可以被别人覆盖的，但是现在写了这个`if`之后，变成他优先级最高了，那这个就不对，但是还不能去掉，去掉了之后这个合并就又出问题了

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f5b28976a0ce?w=1072&h=706&f=png&s=148033)

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f5c2b2bda139?w=1032&h=526&f=png&s=107948)
其实应该怎么做，应该把这两个东西顺序颠倒一下，但是这时候又不对了，因为就导致这个`this.default`变了，这时候又需要复制一份，咱们来写一个公共的方法放到`common.js`里

~ common.js
```js
...

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

```

以及咱们这个顺序稍微颠倒一下，然后数据克隆一下

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f6325dd1994d?w=1040&h=706&f=png&s=128966)

这个时候来测试一下 

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f67e15715c02?w=790&h=504&f=png&s=62523)

会发现是不是`header`里的这些东西又回来了呀，原因也很简单，因为咱们在上面整个的`default`给`clone`下来了，所以咱们把`delete`这一块往上提提


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f6a052eadf0e?w=994&h=1074&f=png&s=153497)

这时候就没问题了


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f6a3ea4f2961?w=1230&h=574&f=png&s=105177)

---

### request

这个时候咱们就应该来写第四步了
直接把`options`给到咱们的`request`函数里就可以，零零碎碎的问题全都给它处理好了

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f6b5b1d5c1a7?w=802&h=168&f=png&s=12379)

然后来修改一下`request.js`

~ request.js

```js
export default function request(options) {
  console.log(options);
  let xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url, true);

  for (let name in options.headers) {
    xhr.setRequestHeader(name, options.headers[name]);
  }

  xhr.send(options.data);
}
```
暂时先写一个简单的请求，然后咱们来测试一下看看能不能发出去

首先先见一个`txt`,方便咱们测试，我就放到`data`目录里了，像这样

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f70d0d8d738b?w=1034&h=430&f=png&s=45385)

然后改一下`index.js`

~ index.js
```js
import Axios from './axios';

Axios('/data/1.txt', {
  headers: {
    a: 12,
  },
});

```



![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f729b1b44858?w=1332&h=1888&f=png&s=297834)

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f71e3f65b080?w=1258&h=780&f=png&s=55882)

这时候咱们可以看到，`header`是加上了的，并且返回的东西也对

当然这个东西还没完，也是一个防止用户捣乱的事

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f73a8ecbf561?w=728&h=298&f=png&s=17023)


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f7416f90342d?w=792&h=720&f=png&s=91218)

如果用户给你的`header`是这样的东西，那这个就不太好，所以最好还是给它来一个编码

~ request.js

```js
export default function request(options) {
  console.log(options);
  let xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url, true);

  for (let name in options.headers) {
    xhr.setRequestHeader(
      encodeURIComponent(name),
      encodeURIComponent(options.headers[name]),
    );
  }

  xhr.send(options.data);
}

```

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f75b061cc079?w=794&h=794&f=png&s=108724)

这就没问题了万一后台有点问题，一碰见冒号就算结束这种问题就能避免了

然后咱们用的时候肯定更多的时候是需要一个`async`和`await`一下，所以咱们需要用`Promise`来包一下

~ axios.js

```js
export default function request(options) {
  console.log(options);
  let xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url, true);

  for (let name in options.headers) {
    xhr.setRequestHeader(
      encodeURIComponent(name),
      encodeURIComponent(options.headers[name]),
    );
  }

  xhr.send(options.data);

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 ** xhr.status < 300) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      }
    };
  });
}

```

以及这个时候，咱们还有很多很多问题
1. 304其实也算成功，那这么封装也是就不对，而且用户可能有一些自定义的`code`，这个怎么做到配置
2. 咱们目前的`webpack`只能兼容`es6`，`async`和`await`是兼容不了的，这个该怎么配

咱们先来解决`webpack`的问题，这个其实很简单，咱们需要再按一个包
`yarn add @babel/polyfill`

然后打开`webpack.config.js`修改一下`entry`

~ webpack.config.js

```js
...
entry: ['@babel/polyfill','./src/index.js'],
...
```

> 注意这个顺序是不能颠倒的

这样就可以兼容了，然后咱们再来修改一下`index.js`

```js
import Axios from './axios';

(async () => {
  let res = await Axios('/data/1.txt', {
    headers: {
      a: 12,
      b: '321fho:fdsf vfds; : ',
    },
  });

  console.log(res);
})();
```


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f8f7a5490af6?w=1172&h=646&f=png&s=65131)

可以看到结果是`undefined`，这是因为咱们根本没有返回咱们的处理结果

这时候修改一下`axios.js`

```js
import _default from './default';
import { merge, assert, clone } from './common';
import request from './request';
const urlLib = require('url');

class Axios {
  constructor() {
    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
                args[1] &&
                args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            return _this.request(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
      this.request(options);
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
      this.request(options);
    } else {
      return undefined;
    }

    return options;
  }

  request(options) {
    // 1. 合并头
    let _headers = this.default.headers;
    delete this.default.headers;

    let result = clone(this.default);
    merge(result, this.default);
    merge(result, options);
    this.default.headers = _headers;

    options = result;

    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    options.headers = headers;

    // 2. 检测参数是否正确
    assert(options.method, 'no method');
    assert(typeof options.method == 'string', 'method must be string');
    assert(options.url, 'no url');
    assert(typeof options.url == 'string', 'url must be string');

    // 3. baseUrl 合并请求
    options.url = urlLib.resolve(options.baseUrl, options.url);
    delete options.baseUrl;

    // 4. 正式调用request(options)
    return request(options);
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };
        return this.request(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };
      return this.request(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f9156320f7a3?w=1318&h=954&f=png&s=180128)

这时候咱们再看结果，是不是就可以了，当然了，咱们肯定不能就直接把原始的`xml`对象返回回去，咱们还要对返回的数据进行各种处理

---

### 处理数据

咱们先来简单的改一下`axios.js` 下的`request`


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f95c92f1b191?w=966&h=696&f=png&s=76210)

返回又一个`promise`，这时候可以看到结果，一点毛病没有


![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f963451e6b7e?w=992&h=468&f=png&s=62526)

但是咱们这个东西全放在`axios.js`里就太乱了，所以咱们也单独把它拆除去

建两个文件一个是`/src/response.js`一个是`/src/error.js`

然后这里`axios.js`引入一下，并且处理的时候分别交给他们

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f9b16dbf53cb?w=870&h=166&f=png&s=24795)

![](https://user-gold-cdn.xitu.io/2020/1/13/16f9f9afd777961a?w=1008&h=470&f=png&s=57201)

然后`response.js`里直接返回值就可以了


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa2f5848469ac5?w=890&h=630&f=png&s=43990)

不过这个`headers`稍微有点特别，需要单独调一个方法`xhr.getAllResponseHeaders()`，不过这返回的是原始`xhr`的头，这肯定不行，所以咱们需要来切一下

![](https://user-gold-cdn.xitu.io/2020/1/14/16fa2f806f642bd3?w=888&h=438&f=png&s=70417)

～ response.js

```js
export default function(xhr) {
  let arr = xhr.getAllResponseHeaders().split('\r\n');
  let headers = {};

  arr.forEach(str => {
    if (!str) return;
    let [name, val] = str.split(': ');
    headers[name] = val;
  });

  return {
    ok: true,
    status: xhr.status,
    statusText: xhr.statusText,
    data: xhr.response,
    headers,
    xhr,
  };
}

```


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa2fa97472dd28?w=962&h=696&f=png&s=116480)

这样就行了

### `transformRequest` && `transformResponse`

这时候当然还不算完，因为咱们现在的`data`还没有任何处理，所以肯定都是字符串，以及用户可能自定义这个处理方式，熟悉`axios`的朋友应该知道，`axios`有`transformRequest`和`transformResponse`方法

这时候咱们先来改一下之前`axios.js`里的`request`方法

![](https://user-gold-cdn.xitu.io/2020/1/14/16fa30182c72e7fc?w=1170&h=936&f=png&s=173999)

现在需要在第三步和第四步之间来处理一下请求


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa302568ac2535?w=998&h=624&f=png&s=84381)

先把参数打印一下，然后修改一下`index.js`的测试`demo`


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa303c00ba5e0e?w=1436&h=946&f=png&s=134789)

为了测试方便我把`1.txt`改成`1.json`了，方便咱们一会处理`json`数据好看到效果


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa309c69a5c1e5?w=1040&h=574&f=png&s=110744)

可以看到，这个参数是可以拿到的，那么接下来就比较简单了，直接来



![](https://user-gold-cdn.xitu.io/2020/1/14/16fa30f2a1f51c92?w=948&h=284&f=png&s=38352)

这时候看请求，这个`headers`就加上了


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa30c4f87c0696?w=764&h=464&f=png&s=51877)

这里稍微提一嘴，为什么我要`delete`掉，虽然不`delete`没什么关系，但是我希望我这个`request`保持干净

至于这个自定义返回结果，是不是就更简单了呀



![](https://user-gold-cdn.xitu.io/2020/1/14/16fa30efde7d4153?w=1026&h=434&f=png&s=56415)

这时候可以看眼结果，我没传`transformResponse`,结果是这样

![](https://user-gold-cdn.xitu.io/2020/1/14/16fa30fbc0fe4b85?w=950&h=532&f=png&s=92208)


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa311ce884ecf3?w=858&h=784&f=png&s=70200)


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa311f422f8509?w=858&h=594&f=png&s=74789)

这时候就可以了

当然了，咱们现在已经可以很灵活的运用了，不止单传这个`json`里可以配参数，全局配置统一处理一样是可以的，咱们来试试


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa31816d9b9ba4?w=954&h=848&f=png&s=67030)


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa31852df53589?w=986&h=1456&f=png&s=192980)

以及不同的实例之间，都是可以的

---

### 拦截器

拦截器在一个请求库里肯定是必不可少的，其实咱们这个库写到现在，想加一个这玩意，其实是很容易的

~ index.js

```js
import Axios from './axios';

Axios.interceptors.request.use(function(config) {
  config.headers.interceptors = 'true';
  return config;
});

(async () => {
  let res = await Axios('/data/1.json', {
    headers: {
      a: 12,
      b: '321fho:fdsf vfds; : ',
    },
  });

  console.log(res);
})();

```

然后新建一个`interceptor.js`

～interceptor.js

```js
class Interceptor {
  constructor() {
    this._list = [];
  }

  use(fn) {
    this._list.push(fn);
  }

  list() {
    return this._list;
  }
}


export default Interceptor;
```

~ axios.js

```js
import _default from './default';
import { merge, assert, clone } from './common';
import request from './request';
import createResponse from './response';
import createError from './error';
const urlLib = require('url');
import Interceptor from './interceptor';

class Axios {
  constructor() {
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor(),
    };

    let _this = this;
    return new Proxy(request, {
      get(data, name) {
        return _this[name];
      },
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
                args[1] &&
                args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            return _this.request(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      },
    });
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length == 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
      this.request(options);
    } else if (args.length == 1 && args[0].constructor == Object) {
      options = {
        ...args[0],
        method,
      };
      this.request(options);
    } else {
      return undefined;
    }

    return options;
  }

  request(options) {
    // 1. 合并头
    let _headers = this.default.headers;
    delete this.default.headers;

    let result = clone(this.default);
    merge(result, this.default);
    merge(result, options);
    this.default.headers = _headers;

    options = result;

    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    options.headers = headers;

    // 2. 检测参数是否正确
    assert(options.method, 'no method');
    assert(typeof options.method == 'string', 'method must be string');
    assert(options.url, 'no url');
    assert(typeof options.url == 'string', 'url must be string');

    // 3. baseUrl 合并请求
    options.url = urlLib.resolve(options.baseUrl, options.url);
    delete options.baseUrl;

    // 4. 变换一下请求
    const { transformRequest, transformResponse } = options;
    delete options.transformRequest;
    delete options.transformResponse;

    if (transformRequest) options = transformRequest(options);

    let list = this.interceptors.request.list();
    list.forEach(fn => {
      options = fn(options);
    });

    // 5. 正式调用request(options)
    return new Promise((resolve, reject) => {
      return request(options).then(
        xhr => {
          let res = createResponse(xhr);
          if (transformResponse) res = transformResponse(res);
          
          let list = this.interceptors.response.list();
          list.forEach(fn => {
            res = fn(res);
          });
          resolve(res);
        },
        xhr => {
          let err = createError(xhr);
          reject(err);
        },
      );
    });
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
            args[1] &&
            args[1].constructor == Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };
        return this.request(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
            args[2] &&
            args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };
      return this.request(options);
    }
  }
}

Axios.create = Axios.prototype.create = function(options = {}) {
  let axios = new Axios();

  let res = clone(_default);

  merge(res, options);

  axios.default = res;
  return axios;
};

export default Axios.create();

```

可以看到，基本上是一样的套路，主要就是把参数传过来然后调用一下而已

![](https://user-gold-cdn.xitu.io/2020/1/14/16fa32ff6fa46c1e?w=1188&h=1312&f=png&s=256813)

不过这里面有两个小小的问题需要处理
1. 咱们现在给用户开了很多口，如果他要是返回的`config`不对或者没返回咱们理应给他返回错误信息，再校验一下，这时候大家应该能想到了，应该吧`axios`校验这些参数单独搞一个函数，没什么技术含量，这里就不多赘述，大家有兴趣可以试一下
2. 咱们给用户的是函数，用的是`forEach`，这时候就会导致一个问题，如果用户给你的是一个带`async`的函数那就不行了，咱们也要加上`async`和`await`，不过`async`和`await`里面返回一个`promise`又很怪，这个大家有兴趣可以自己试试，或者评论区留言

这时候来试一下效果

![](https://user-gold-cdn.xitu.io/2020/1/14/16fa333b78df06fa?w=1100&h=640&f=png&s=106778)


![](https://user-gold-cdn.xitu.io/2020/1/14/16fa333f45a0e0f1?w=830&h=1156&f=png&s=147866)

可以看到咱们这个拦截器也算是完成了

