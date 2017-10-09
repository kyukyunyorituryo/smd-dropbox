// Dropboxのキーを以下に記述
var DROPBOX_APP_KEY = "3ypt3y6o2bhjthv";

// Dropboxクライアントオブジェクトを生成
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var taskTalbe;

// 読み込まれた時
window.onload = function () {
  // リンクしているか確認
  client.authenticate({interactive:false}, function(err) {
    if (err) alert('認証エラー:' + err);
  });  
  if (!client.isAuthenticated()) {
    $show("link"); // リンクボタンを表示する
    $hide("main");
    // ボタンを押したときの動作を指定
    $("link_btn").onclick = function () {
      client.authenticate();
    };
    return;
  }
  // リンクしているならリンクボタンは隠す
  $hide("link");
  $show("main");
  // DBを開く  
  var m = client.getDatastoreManager();
  m.openDefaultDatastore(function(err,datastore){
    if (err) {
      alert("DBエラー" + err); return;
    }
    taskTable = datastore.getTable('taskTable');
    datastore.recordsChanged.addListener(updateUI);  
    $("save_btn").onclick = save;
    updateUI();
  });
};

// レコードの値が変更されたとき
function updateUI() {
  var v = "";
  var rec = taskTable.query();
  if (rec.length > 0) {
    v = rec[0].get('memo');
  }
  $("memo").value = v;
  console.log("画面更新");
}

// 保存ボタンが押されたとき
function save() {
  var v = $("memo").value;
  var rec = taskTable.query();
  if (rec.length == 0) {
    taskTable.insert({
      memo: v,
      time: (new Date()).getTime()
    });
    console.log("挿入");
  } else {
    var r = rec[0];
    r.set('memo', v);
    r.set('time', (new Date()));
    console.log("変更");
  }
}

// サインアウト
function signOut() {
  client.signOut(false, function(err) {
    if (err) {
      alert('サインアウト失敗:' + err);
      return;
    }
    $hide('main');
    $show('link');
  });
}

// DOMを返す関数
function $(id) {
  return document.getElementById(id);
}
function $show(id) {
  $(id).style.display = "block";
}
function $hide(id) {
  $(id).style.display = "none";
}

