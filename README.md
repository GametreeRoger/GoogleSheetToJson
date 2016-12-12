# GoogleSheetToJson

## 改編自[pamelafox/exportjson.js](https://gist.github.com/pamelafox/1878143)
---
 - 把幾個我用不到的東西拿掉
 - 新增儲存json檔案到google drive裡面
 - 可接受陣列

---

### 使用方法

1. 打開google sheet之後點選[Tools]->[Script editor...]
  - ![Imgur](http://i.imgur.com/ttUFtjs.png)

2. 進入script editor後將程式碼貼上
  - ![Imgur](http://i.imgur.com/3yw6Kv7.png)

3. 點選左上角"Untitled project"給予專案名稱(自己取名)
  - ![Imgur](http://i.imgur.com/h5UoMac.png)

4. ctrl + s 存檔

5. 回到google sheet 按F5重整，就會發現上面多了一個[Export JSON]的按鈕
  - ![Imgur](http://i.imgur.com/QIx5QpK.png)

6. 把第一行凍結，選擇[View] -> [Freeze] -> [1 row]
  - ![Imgur](http://i.imgur.com/Oe1qMDO.png)

7. 設定下方標籤名稱，這將會是產出的Json檔名
  - ![Imgur](http://i.imgur.com/PZ9MtWC.png)

8. 選擇[Export JSON] -> [Export JSON for this sheet] 產出Json檔案
  - ![Imgur](http://i.imgur.com/tLUJ7r5.png)

9. 第一次使用需要授權(之後就不用了)
  - ![Imgur](http://i.imgur.com/h7AhOhm.png)

  - ![Imgur](http://i.imgur.com/egy0OlC.png)

10. 產出的Json檔案內容
  - ![Imgur](http://i.imgur.com/YVNfHnU.png)

  - ![Imgur](http://i.imgur.com/Tr7sPef.png)

---

### sheet編輯的規則
  - 第一排是欄位名稱，欄位名稱底下的代表該欄位的資料
  - 如果該欄位是陣列那就在欄位名稱後面加上`[]`，同一個陣列的名稱請取一樣的名字
    + 例如 Atk[], Atk[] 這樣就是陣列大小為2的陣列
  - 一定要記得把第一排的欄位名稱凍結

---

### 新增的儲存方法
- 參考自[DriveApp.createFile(name, content)](https://developers.google.com/apps-script/reference/drive/drive-app)

### 新增的接受陣列的方法

  1. 新增判斷第一行裡的欄位名稱有沒有"[]"
``` JavaScript
function isSquareBrackets(char) {
  return char == '[' || char == ']';
}
```
  2. 在`function normalizeHeader_`裡面新增了一個object，紀錄欄位名稱和是否為陣列，然後回傳
```JavaScript
  var item = {
    key: "",
    isArray: false
  }
```
  3. 在`function getObjects_`裡就可以用剛剛新增的object欄位`isArray`來判斷這個欄位是否為陣列，然後把同名的陣列元素加入object中
