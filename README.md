# React Todo List
ReactでTodoリストを作りました。

## URL
実物は下記URLに掲載しています。

https://react-todo-list.ayaoriko.com/

詳しい制作の経緯はブログをご覧ください。

https://ayaoriko.com/coding/react/react-todo-list/

React.jsに必要なコマンドとかは、別リポジトリに記載しています。
https://github.com/ayaoriko/react-tutorial


## デザイン
Canvaのテンプレートをアレンジしました。
[参考テンプレート](https://www.canva.com/ja_jp/templates/EAFXD6ntStg/)

###  デザインの再現について
- 上記デザインは v1.0 の段階でのものです。
- 今回は React の実装を優先したため、カンプの再現度よりも実装を優先しています。特にPCのフォントサイズが全体的に大きかったので、実物ではサイズを変更しています。

###  PCデザインカンプ
<img width="1400" height="2000" alt="Image" src="https://github.com/user-attachments/assets/b229a847-66dd-472e-b742-a9953b462347" />

###  SPデザインカンプ
<img width="375" height="1416" alt="Image" src="https://github.com/user-attachments/assets/ed88ee85-971c-4dd2-aaec-254cd370aabc" />

## 実装機能
- カテゴリー追加機能
- カテゴリーとテキストを入力したら、追加ボタンを押してリストに追加する機能
- リストのチェックを入れたら、残り数がカウントされる機能
- リストの各項目の編集・削除機能※v1.1で追加
- カテゴリーの編集・削除機能の追加※v1.1で追加
- 完了済みを隠す機能の実装※v1.1で追加
- DB接続(Supabaseを利用)※v1.2で追加

## 環境
- Node.js v22.20.0
- React v19.1.1
- react-scripts v5.0.1
- sass（Dart Sass）v1.93.2
- sass-loader v16.0.5
- Tailwind CSS v3.4.3 （リセットCSSのみ利用）
- supabase v2.95.3 
- react-transition-group v4.4.5