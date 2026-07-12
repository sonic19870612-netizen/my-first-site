## Zeabur Deployment
- Project ID: 6a530e87b421dcaba7ae2240
- Service ID: 6a530e8d723d6cf6efafa9d4
- Environment ID: 6a530e87104975fcb46763d3
- Public URL: https://sonic-my-first-site.zeabur.app

## Guestbook
- 留言資料存在 SQLite:`data/guestbook.db`(由 server.js 於啟動時自動建立)
- 注意:此路徑尚未掛載 Zeabur Volume,「重新部署」時留言資料可能被清空。
  如需持久化,請在 Zeabur 網頁後台為此 service 新增 Volume,掛載路徑對應專案的 `data/` 目錄。
