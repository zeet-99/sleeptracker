import {saveLog,getLogs} from './firebase.js';

var $=function(i){return document.getElementById(i)};
// bintang
(function(){var h='';for(var i=0;i<80;i++)h+='<i style="left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;animation-delay:'+Math.random()*3+'s;transform:scale('+(.6+Math.random())+')"></i>';$('stars').innerHTML=h})();
setInterval(function(){var s=document.createElement('div');s.className='shoot';s.style.left=(45+Math.random()*55)+'vw';s.style.top=Math.random()*40+'vh';document.body.appendChild(s);setTimeout(function(){s.remove()},1400)},3000);
var FACTS=['💡 Saat tidur nyenyak, otak membersihkan sisa metabolisme yang menumpuk seharian.','🐨 Koala bisa tidur hingga 20 jam sehari.','🌙 Satu siklus tidur berlangsung sekitar 90 menit.','🧠 Ingatan hari ini dirapikan otak saat kamu tidur.','📵 Cahaya biru layar HP menekan hormon melatonin.'],fi=0;
function nf(){var f=$('fact');f.style.opacity=0;setTimeout(function(){f.textContent=FACTS[fi++%FACTS.length];f.style.opacity=1},300)}
nf();setInterval(nf,5000);

// ===== navigasi =====
function go(n){
  document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('on',v.id==='v-'+n)});
  document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('on',b.dataset.go===(n==='hasil'?'cek':n))});
  window.scrollTo(0,0);
  if(n==='cek'){step(1)}
  if(n==='riwayat')loadHist();
}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g)go(g.dataset.go);
  var s=e.target.closest('[data-step]');if(s)step(+s.dataset.step);
});
function step(n){
  for(var i=1;i<=4;i++)$('s'+i).hidden=i!==n;
  $('prog').style.width=(n*25)+'%';
  if(n===2)live();
}

// ===== data & logika =====
var S={name:'',age:0,q:0};
function range(a){if(a<=13)return[9,11,'anak usia sekolah'];if(a<=17)return[8,10,'remaja'];if(a<=64)return[7,9,'dewasa'];return[7,8,'lansia']}
function calc(b,w){var x=b.split(':'),y=w.split(':'),d=(+y[0]*60+ +y[1])-(+x[0]*60+ +x[1]);if(d<=0)d+=1440;return d}
function fmt(m){return Math.floor(m/60)+' j '+(m%60)+' mnt'}
function live(){var b=$('bed').value,w=$('wake').value;$('live').textContent=(b&&w)?fmt(calc(b,w)):'–'}
$('bed').oninput=$('wake').oninput=live;
var EDU={
 kurang:{t:'Kurang tidur',c:'var(--bad)',e:function(r){return 'Untuk '+r[2]+', tidur ideal sekitar '+r[0]+'–'+r[1]+' jam per malam, dan tidurmu masih di bawah itu. Saat kurang tidur, fokus dan ingatan menurun, suasana hati mudah naik turun, dan daya tahan tubuh melemah. Kurang tidur yang berlangsung lama juga dikaitkan dengan masalah kesehatan jangka panjang.'},tips:['Majukan jam tidur 15–30 menit tiap malam, jangan drastis','Matikan layar HP minimal 1 jam sebelum tidur','Hindari kafein setelah sore hari','Tidur siang cukup 20 menit','Bangun di jam yang sama, termasuk akhir pekan']},
 cukup:{t:'Tidur cukup',c:'var(--ok)',e:function(r){return 'Bagus! Durasimu masuk rentang ideal untuk '+r[2]+' ('+r[0]+'–'+r[1]+' jam). Tidur cukup membantu tubuh pulih, otak merapikan ingatan, dan energimu terjaga seharian. Yang tak kalah penting: jaga konsistensi jam tidurmu.'},tips:['Pertahankan jam tidur dan bangun yang teratur','Tetap batasi layar sebelum tidur','Jaga kamar gelap, sejuk, dan tenang','Cari cahaya matahari di pagi hari','Olahraga rutin, tapi jangan terlalu larut malam']},
 lebih:{t:'Tidur berlebih',c:'var(--warn)',e:function(r){return 'Durasimu sedikit di atas rentang umum untuk '+r[2]+' ('+r[0]+'–'+r[1]+' jam). Kadang ini wajar, misalnya saat tubuh sedang pulih. Tapi kalau terjadi terus dan kamu tetap lelah, mungkin kualitas tidurmu yang bermasalah, bukan durasinya.'},tips:['Bangun di jam yang sama setiap hari','Terkena sinar matahari pagi setelah bangun','Aktif bergerak di siang hari','Perhatikan kualitas: sering terbangun atau mendengkur keras?','Kalau lelah berkepanjangan, konsultasikan ke tenaga kesehatan']}
};
var QE=['😫','😕','😐','🙂','😍'],IC=['⏰','📵','☕','🛌','🌅'];

$('n1').onclick=function(){
  var a=parseInt($('age').value,10);
  if(!a||a<6||a>110){$('e1').textContent='Isi usia antara 6 dan 110 tahun.';return}
  $('e1').textContent='';S.age=a;step(2);
};
$('n2').onclick=function(){if($('bed').value&&$('wake').value)step(3)};
$('qs').onclick=function(e){var b=e.target.closest('button');if(!b)return;S.q=+b.dataset.q;[].forEach.call($('qs').children,function(x){x.classList.toggle('on',x===b)})};
$('chips').onclick=function(e){var b=e.target.closest('button');if(b)b.classList.toggle('on')};
$('n3').onclick=function(){
  if(!S.q){$('e3').textContent='Pilih dulu rasa bangunmu.';return}
  $('e3').textContent='';
  var hb=0;[].forEach.call($('chips').children,function(c){if(c.classList.contains('on'))hb+=+c.dataset.h});
  step(4);
  var msgs=['Menghitung siklus tidur…','Membaca kebiasaan malammu…','Menyusun hasilmu…'],i=0;
  var t=setInterval(function(){$('lt').textContent=msgs[++i%3]},550);
  setTimeout(function(){clearInterval(t);finish(hb)},1700);
};
function finish(hb){
  var bed=$('bed').value,wake=$('wake').value,m=calc(bed,wake),r=range(S.age),h=m/60;
  var st=h<r[0]?'kurang':(h>r[1]?'lebih':'cukup');
  var d=h<r[0]?r[0]-h:(h>r[1]?h-r[1]:0);
  var sc=Math.max(5,Math.min(100,Math.round(.65*Math.max(0,100-d*22)+.35*S.q*20)+Math.max(-12,Math.min(8,hb))));
  show(m,r,st,sc,S.q,S.name,S.age);
  save({ts:Date.now(),name:S.name,age:S.age,bed:bed,wake:wake,mins:m,q:S.q,score:sc,status:st});
  if(sc>=80)confetti();
}
function show(m,r,st,sc,q,name,age){
  var e=EDU[st];
  $('hi').textContent=name?('Hai, '+name+'! Ini hasil tidurmu'):'Ini hasil tidurmu';
  var bd=$('badge');bd.textContent=e.t;bd.style.color=e.c;
  $('mdur').textContent=fmt(m);$('mq').textContent=QE[q-1];
  var cy=m/90;$('mcyc').textContent=cy.toFixed(1)+'×';
  $('cyt').textContent=Math.min(Math.round(cy),6)+' dari 6 siklus tercapai (perkiraan)';
  $('cyc').innerHTML=[0,1,2,3,4,5].map(function(i){return '<i class="'+(i<Math.round(cy)?'f':'')+'"></i>'}).join('');
  $('edu').textContent=e.e(r);
  $('tl').innerHTML=e.tips.map(function(t,i){return '<div class="tc" style="--d:'+(i*.12)+'s"><span>'+IC[i%5]+'</span><div>'+t+'</div></div>'}).join('');
  $('tips').classList.remove('open');$('tg').textContent='Apa yang harus dilakukan? ▾';
  go('hasil');
  $('pg').style.strokeDashoffset=502;
  setTimeout(function(){$('pg').style.strokeDashoffset=502*(1-sc/100)},200);
  var t0=null;function tick(t){if(!t0)t0=t;var p=Math.min((t-t0)/1600,1);$('sc').textContent=Math.round(sc*p);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);
}
$('tg').onclick=function(){var o=$('tips').classList.toggle('open');$('tg').textContent=o?'Sembunyikan ▴':'Apa yang harus dilakukan? ▾'};
function confetti(){var cs=['#7cc4ff','#3b82f6','#a78bfa','#fcd34d','#6ee7b7','#fff'];for(var i=0;i<46;i++){var c=document.createElement('i');c.className='conf';c.style.left=Math.random()*100+'vw';c.style.background=cs[i%6];c.style.setProperty('--dx',(Math.random()*160-80)+'px');c.style.animationDelay=Math.random()*.6+'s';c.style.borderRadius=i%3?'2px':'50%';document.body.appendChild(c);(function(el){setTimeout(function(){el.remove()},3500)})(c)}}

// ===== database (riwayat) =====
async function save(rec){
  try{await saveLog(rec);return}catch(e){console.warn('Firestore gagal, disimpan di browser saja:',e)}
  try{var a=JSON.parse(localStorage.getItem('nyenyak')||'[]');a.unshift(rec);localStorage.setItem('nyenyak',JSON.stringify(a.slice(0,50)))}catch(e){}
}
async function loadHist(){
  var box=$('hist');box.innerHTML='';$('avg').textContent='Memuat…';
  var rows=[];
  try{
    rows=await getLogs();
  }catch(e){
    console.warn('Firestore gagal, memakai data browser:',e);
    try{rows=JSON.parse(localStorage.getItem('nyenyak')||'[]').slice(0,20)}catch(x){$('avg').textContent='Riwayat gagal dimuat.';return}
  }
  if(!rows.length){$('avg').textContent='Belum ada riwayat. Cek tidurmu dulu, ya.';$('chart').style.display='none';return}
  $('chart').style.display='flex';
  var av=Math.round(rows.reduce(function(a,r){return a+r.mins},0)/rows.length);
  $('avg').textContent='Rata-rata '+fmt(av)+' dari '+rows.length+' catatan terakhir.';
  var ch=$('chart');ch.innerHTML='';
  rows.slice(0,7).reverse().forEach(function(r){
    var e=EDU[r.status]||EDU.cukup,c=document.createElement('div');c.className='col';
    c.innerHTML='<b></b><i></i><span></span>';
    c.querySelector('b').textContent=(r.mins/60).toFixed(1);
    var bar=c.querySelector('i');bar.style.background=e.c;bar.style.height='4px';
    c.querySelector('span').textContent=new Date(r.ts).toLocaleDateString('id-ID',{day:'numeric',month:'numeric'});
    ch.appendChild(c);
    setTimeout(function(){bar.style.height=Math.min(r.mins/600,1)*118+'px'},50);
  });
  rows.forEach(function(r){
    var e=EDU[r.status]||EDU.cukup,el=document.createElement('div');el.className='item';
    el.innerHTML='<div><b></b><small></small></div><span></span>';
    el.querySelector('b').textContent=fmt(r.mins)+' · skor '+r.score;
    el.querySelector('small').textContent=new Date(r.ts).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})+' · '+r.bed+' → '+r.wake;
    var s=el.querySelector('span');s.textContent=e.t;s.style.color=e.c;s.style.fontWeight=700;
    box.appendChild(el);
  });
}
// ===== backsound relaksasi (dibuat langsung di browser) =====
var AC=null,master=null,dl=null,N=[],T=[],playing=false,ci=0;
function ctx(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=0;master.connect(AC.destination);dl=AC.createDelay();dl.delayTime.value=.5;var fb=AC.createGain();fb.gain.value=.4;dl.connect(fb);fb.connect(dl);dl.connect(master)}return AC}
function vol(){return $('vol').value/100*.5}
function ev(f,ms,rep){T.push([rep?setInterval(f,ms):setTimeout(f,ms),rep])}
function clr(){T.forEach(function(x){x[1]?clearInterval(x[0]):clearTimeout(x[0])});T=[];N.forEach(function(n){try{n.stop()}catch(e){}});N=[]}
var CH=[[110,130.81,164.81,220],[87.31,110,130.81,174.61],[130.81,164.81,196,261.63],[98,123.47,146.83,196]],PN=[440,523.25,587.33,659.25,783.99,880];
function pad(){var t=AC.currentTime;CH[ci++%4].forEach(function(fr,i){var o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type=i%2?'triangle':'sine';o.frequency.value=fr;o.detune.value=(Math.random()-.5)*10;lp.type='lowpass';lp.frequency.value=900;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.08,t+3);g.gain.linearRampToValueAtTime(.08,t+6);g.gain.linearRampToValueAtTime(0,t+10);o.connect(lp);lp.connect(g);g.connect(master);o.start(t);o.stop(t+10.2)})}
function bell(){var t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.frequency.value=PN[Math.floor(Math.random()*6)];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+3.5);o.connect(g);g.connect(master);g.connect(dl);o.start(t);o.stop(t+3.6)}
function bellLoop(){if(!playing)return;bell();ev(bellLoop,3500+Math.random()*4000,false)}
function sui(){$('snd').classList.toggle('on',playing);$('pz').textContent=playing?'⏸ Jeda':'▶ Putar'}
function startA(){ctx();AC.resume();clr();playing=true;pad();ev(pad,8000,true);ev(bellLoop,2500,false);master.gain.cancelScheduledValues(AC.currentTime);master.gain.setTargetAtTime(vol(),AC.currentTime,.8);sui()}
function stopA(){if(!AC)return;master.gain.setTargetAtTime(0,AC.currentTime,.3);playing=false;sui();setTimeout(function(){if(!playing)clr()},1300)}
$('snd').onclick=function(){var p=$('sndp');if(!playing){startA();p.classList.add('open')}else p.classList.toggle('open')};
var userPaused=false;
$('pz').onclick=function(){if(playing){userPaused=true;stopA()}else{userPaused=false;startA()}};
$('vol').oninput=function(){if(AC&&playing)master.gain.setTargetAtTime(vol(),AC.currentTime,.1)};
// putar otomatis saat masuk (kalau browser mengizinkan), kalau tidak, mulai di sentuhan/klik pertama
function once(e){
  ['pointerdown','keydown','touchstart'].forEach(function(t){document.removeEventListener(t,once,true)});
  if(e.target.closest&&e.target.closest('.snd'))return;
  if(!playing&&!userPaused)startA();
}
ctx();
if(AC.state==='running')startA();
else ['pointerdown','keydown','touchstart'].forEach(function(t){document.addEventListener(t,once,true)});
