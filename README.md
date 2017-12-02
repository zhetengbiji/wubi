# wubi
在线五笔输入法

## 使用方式
1. 安装
    ```
    npm install
    ```
2. 构建
    ```
    npm run build
    ```
3. 在需要五笔的页面，引入out/index.js。

## 注意事项
* 目前此输入法UI只适用于移动端。
* 由于iOS获得焦点后fixed定位受到影响，故不适用iOS设备。
* fixed定位在底部的输入框可能会和输入法UI冲突。