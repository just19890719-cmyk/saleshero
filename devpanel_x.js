/* ===== 測試版專用:開發者面板(正式版 index.html 不含這段) ===== */
(function(){
var MK='shechu-dev-mods-'+(typeof GBUILD!=='undefined'?GBUILD:'x'),mods=[];
try{for(var k=localStorage.length-1;k>=0;k--){var kk=localStorage.key(k);if(kk&&kk.indexOf('shechu-dev-mods')===0&&kk!==MK)localStorage.removeItem(kk)}}catch(e){}
try{mods=JSON.parse(localStorage.getItem(MK)||'[]')||[]}catch(e){mods=[]}
function mark(m){if(mods.indexOf(m)<0){mods.push(m);try{localStorage.setItem(MK,JSON.stringify(mods))}catch(e){}}badge()}
function $d(id){return document.getElementById(id)}
var css=document.createElement('style');
css.textContent='#dvbtn{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 108px);z-index:99990;font:700 12px system-ui,sans-serif;padding:6px 10px;border-radius:999px;border:2px solid #f2b21c;background:#2a1a00;color:#ffd75e;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:pointer}'+
'#dvpan{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 146px);z-index:99991;width:min(300px,calc(100vw - 16px));max-height:calc(100vh - 210px);overflow:auto;background:#141a22;color:#e8edf3;border:2px solid #f2b21c;border-radius:14px;padding:10px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.6)}'+
'#dvpan h4{margin:0 0 6px;font-size:14px;color:#ffd75e;display:flex;justify-content:space-between;align-items:center}'+
'#dvpan .dvtag{display:inline-block;background:#6b4a00;color:#ffe9a8;border-radius:6px;padding:1px 8px;font-size:11px;font-weight:700}'+
'#dvst{background:#0c1016;border-radius:8px;padding:6px 8px;margin:6px 0 8px;font-size:12px;color:#b9c3cf}#dvst b{color:#fff}'+
'#dvpan .dvg{display:grid;grid-template-columns:1fr 1fr;gap:6px}'+
'#dvpan button.dvb{font:600 12px system-ui,sans-serif;padding:8px 6px;border-radius:9px;border:1px solid #3a4a5c;background:#1f2b38;color:#e8edf3;cursor:pointer;min-height:38px}'+
'#dvpan button.dvb:active{transform:translateY(1px);background:#2c3d50}'+
'#dvpan button.dvb:disabled{opacity:.4;cursor:not-allowed}'+
'#dvpan button.dvb.on{border-color:#4fd18b;color:#9ff0c4;box-shadow:0 0 0 1px #4fd18b inset}'+
'#dvpan button.dvb.red{background:#4a1f1f;border-color:#8a3a3a;color:#ffd0d0}'+
'#dvpan .dvwhy{grid-column:1/-1;font-size:11px;color:#ff9b9b;margin-top:-2px}'+
'#dvmod{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 4px);z-index:99989;max-width:calc(100vw - 16px);background:rgba(90,62,0,.92);color:#ffe9a8;border:1px solid #f2b21c;border-radius:8px;padding:3px 10px;font:600 11px/1.4 system-ui,sans-serif;text-align:center;pointer-events:none}'+
'#dvfps{position:fixed;left:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 64px);z-index:99990;background:rgba(0,0,0,.72);color:#9ff0c4;border-radius:8px;padding:4px 8px;font:700 11px/1.35 ui-monospace,monospace;pointer-events:none;white-space:pre}';
document.head.appendChild(css);
var btn=document.createElement('button');btn.id='dvbtn';btn.textContent='🛠 測試版';document.body.appendChild(btn);
var pan=document.createElement('div');pan.id='dvpan';pan.hidden=true;
pan.innerHTML='<h4>🛠 開發者面板 <span class="dvtag">1009-X 測試</span></h4>'+
'<div id="dvst"></div><div class="dvg">'+
'<button class="dvb" id="dvx1" style="grid-column:1/-1">🟢 模擬在線玩家(看「在線玩家」分頁)</button>'+
'<button class="dvb" id="dvx2" style="grid-column:1/-1">📡 打開真實的在線玩家(需要連線)</button>'+
'<div class="dvwhy" id="dvwhy"></div>'+
'<button class="dvb red" id="dvrst" style="grid-column:1/-1">♻️ 清除測試標記</button>'+
'</div><div style="font-size:11px;color:#8b97a5;margin-top:8px">模擬:放 6 位前 200 名玩家(3 位在線)+ 3 位不在前 200 名但在線的玩家,應該看到 6 人在線(含你)。連線時約 30 秒後會換回真實資料。發布版不含這個面板。</div>';
document.body.appendChild(pan);
var mod=document.createElement('div');mod.id='dvmod';document.body.appendChild(mod);
function badge(){if(!mods.length){mod.textContent='🧪 測試版 '+GBUILD+' · 尚未改動任何測試條件';return}mod.textContent='🧪 '+GBUILD+' 測試狀態 · 已改動:'+mods.join('、')+' — 僅供測試'}
badge();
btn.onclick=function(){pan.hidden=!pan.hidden;if(!pan.hidden)refresh()};
function inRun(){return typeof G!=='undefined'&&G&&!G.over&&!G.tr}
function refresh(){if(pan.hidden)return;var st=$d('dvst');try{
 st.innerHTML='版本 <b>'+GBUILD+'</b> · '+(DP.on?'🟢 已連線':'🟡 單機')+(BJ.loc?' · 21 點:<b>指定牌局(單機引擎)</b>':'')+'<br>金幣 <b>'+(SAVE.coin||0).toLocaleString()+'</b>'+(CL&&CL.u?' · 帳號 <b>'+escH(acctDisp(CL.u))+'</b>':'');
}catch(e){st.textContent='狀態讀取失敗:'+e.message}}
setInterval(refresh,500);
/* 指定牌那局打完,自動回到正常(連線)牌局 */
setInterval(function(){try{if(BJ.loc&&SAVE.bjr&&SAVE.bjr.done&&!SAVE.bjPend&&!BJ.busy){BJ.loc=false}}catch(e){}},800);
function ensureName(){if(!SAVE.pname){SAVE.pname='測試員';save()}var L=$d('login');if(L)L.hidden=true}
function goBJ(){if(inRun()){toast('⚠️ 請先結束戰鬥');return false}ensureName();try{SAVE.tab='dragon';setTab('dragon');casSwitch('bj');renderHome()}catch(e){}pan.hidden=true;setTimeout(function(){var x=document.querySelector('#casJ .bjbox')||document.querySelector('#bjfelt');if(x)x.scrollIntoView({block:'center'})},200);return true}
function rig(deck,msg,m){if(BJ.r&&!BJ.r.done){toast('⚠️ 先把目前這局打完');return}if(!goBJ())return;
 BJ.loc=true;var S=dpLocal();if(S.dpot<5e8)S.dpot=5e8;if(SAVE.bjr&&SAVE.bjr.done)delete SAVE.bjr;DP.pot=S.dpot;BJ.r=null;
 BJ.bet=Math.max(BJ.min,Math.min(BJ.bet||BJ.min,bjMax()));if((SAVE.coin||0)<BJ.bet*3){SAVE.coin=BJ.bet*3;}save();renderHome();
 window.__BJDECK=deck;try{bjRender()}catch(e){}toast(msg);mark(m)}
function lbShowOnline(){try{$d('lbov').hidden=false;lbCat('main');var x=$d('lbtab').querySelector('[data-s=online]');if(x)x.click();lbMe()}catch(e){toast('打開排行榜失敗:'+e.message)}}
$d('dvx1').onclick=function(){if(inRun()){toast('⚠️ 請先結束戰鬥');return}pan.hidden=true;ensureName();
 var now=(typeof srvNow==='function'?srvNow():Date.now()),me=LB.uid||(LB.uid='p_dvme');
 function R(id,nick,coin,pw,on){return{id:id,nick:nick,coin:coin,power:pw,pv:2,t:on?now-5000:now-3600e3,eq:[],motto:on?'我在線上':'',ride:null}}
 LB.rows=[R(me,SAVE.pname||'測試員',SAVE.coin||0,1234,1),R('p_a','加班狂人',9e6,8800,1),R('p_b','準時下班',7e6,7600,0),R('p_c','摸魚大師',5e6,6600,1),R('p_d','請假仙',3e6,5100,0),R('p_e','週報機器',2e6,4200,0)];
 LB.onRows=[R('p_x1','新來的實習生',1200,300,1),R('p_x2','偷吃便當',800,220,1),R('p_x3','打卡小精靈',500,150,1),R('p_x4','早就下線',400,100,0)];
 LB.ready=true;lbShowOnline();toast('🟢 應該看到 6 人在線(含你、3 位不在前 200 名)');mark('在線玩家(模擬)')};
$d('dvx2').onclick=function(){if(!(typeof DP!=='undefined'&&DP.on)&&!(LB&&LB.db)){toast('🟡 目前是單機,沒有真實資料;請用上面的「模擬」按鈕');return}pan.hidden=true;try{lbOpen()}catch(e){}lbShowOnline();mark('在線玩家(真實)')};
$d('dvrst').onclick=function(){try{localStorage.removeItem(MK)}catch(e){}mods=[];badge();toast('已清除測試標記')};
window.__DEV={mark:mark,mods:function(){return mods.slice()}};
})();
