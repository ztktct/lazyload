# Lazyload

图片懒加载插件

## 配置说明

```javascript

var lz = new Lazyload({
    wrap: document.body,	        // 滚动容器,默认body滚动
    attr: 'data-resources',	        // 自定义属性
    offset: 200,			        // 提前多少距离开始出现
    watch: false,                       // 是否开启观察，开启后动态添加的图片也能懒加载
    error: DEFAULT_URL,		        // 图片加载错误之后显示的图片
    loading: DEFAULT_URL, 	        // 图片加载中显示的图片(暂时无用)
    state:{                             // 图片对应状态时拥有的属性名
    		loading: 'imgloading',  // 图片加载中	
    	 	loaded : 'imgloaded',   // 图片加载完毕
    	 	error  : 'imgerror'     // 图片加载失败
    }
})
   
```

## 自定义样式

``` html

img[imgloading]{ 
    /* 加载中样式 */
    /* your style */
}	
img[loaded]{
    /* 加载结束样式 */
    /* your style */
}		
img[error]{ 
    /* 加载失败样式 */
    /* your style */
}		

```
