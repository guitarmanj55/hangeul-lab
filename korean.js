/* Hangeul Lab language helpers: saying numbers (Sino-Korean and native), the numbers drill's question
   pools, splitting syllables into letters, and checking typed answers. No DOM, so `node --test` runs
   korean.test.js against it, and scripts/make_audio.py reads the spoken number phrases from it.
   Loaded with a plain <script> before the app code (sets window.KO); Node gets module.exports. */
(function(root){
  var SINO = ["","일","이","삼","사","오","육","칠","팔","구"];
  var NATIVE = ["","하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉"];
  var NATIVE_SHORT = ["","한","두","세","네","다섯","여섯","일곱","여덟","아홉"];
  var NATIVE_TENS = ["","열","스물","서른","마흔","쉰","예순","일흔","여든","아흔"];

  /* Sino-Korean below 10,000. 1 is left unsaid before 십, 백 and 천: 십오 (15), 백 (100), 천오백 (1,500). */
  function sino4(n){
    var units = ["천","백","십",""], digits = [Math.floor(n/1000)%10, Math.floor(n/100)%10, Math.floor(n/10)%10, n%10], s = "";
    for(var i=0;i<4;i++){ if(digits[i]) s += (digits[i]===1 && i<3 ? "" : SINO[digits[i]]) + units[i]; }
    return s;
  }
  /* Sino-Korean, 0 to 99,999,999. Korean groups by 만 (10,000) and spaces after it: 만 오천 (15,000), 삼만 (30,000). */
  function sino(n){
    if(n===0) return "영";
    var man = Math.floor(n/10000), rest = n%10000, parts = [];
    if(man) parts.push((man===1 ? "" : sino4(man)) + "만");
    if(rest) parts.push(sino4(rest));
    return parts.join(" ");
  }
  /* Native Korean, 1 to 99. short: the form before a counter word (한, 두, 세, 네, 스무). */
  function native(n, short){
    var tens = Math.floor(n/10), ones = n%10;
    if(short && n===20) return "스무";
    return NATIVE_TENS[tens] + (short ? NATIVE_SHORT : NATIVE)[ones];
  }

  function commas(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function price(n){ return sino(n) + " 원"; }
  /* Hours are native (세 시), minutes Sino-Korean (삼십 분). half: say :30 as 반. */
  function time(h, m, half){
    return native(h, true) + " 시" + (m===0 ? "" : (m===30 && half ? " 반" : " " + sino(m) + " 분"));
  }
  function counted(c, n){ return (c.noun ? c.noun + " " : "") + native(n, true) + " " + c.counter; }
  function countEn(c, n){ return c.noun ? n + " " + (n===1 ? c.one : c.many) : n + " " + c.many; }

  /* The drill's fixed pools, so every answer has a recorded clip (make_audio.py reads spokenNumbers()). */
  var PRICES = [500,1000,1200,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,8000,8500,9000,
    10000,12000,13000,15000,18000,20000,25000,30000,35000,45000,50000];
  var HOURS = [1,2,3,4,5,6,7,8,9,10,11,12];
  var MINUTES = [0,10,15,20,30,45];
  var COUNTERS = [
    {noun:"커피", counter:"잔", one:"coffee", many:"coffees"},
    {noun:"맥주", counter:"병", one:"bottle of beer", many:"bottles of beer"},
    {noun:"사과", counter:"개", one:"apple", many:"apples"},
    {noun:"표", counter:"장", one:"ticket", many:"tickets"},
    {noun:"학생", counter:"명", one:"student", many:"students"},
    {noun:"고양이", counter:"마리", one:"cat", many:"cats"}
  ];
  var AGE = {noun:"", counter:"살", many:"years old"};
  var AGES = [5,10,18,20,21,24,27,30,33,45];

  function priceItem(p){ return {kind:"price", value:p, kr:price(p), fig:"₩"+commas(p)}; }
  /* :30 is said 반 on odd hours and 삼십 분 on even ones, so both forms turn up. */
  function timeItem(h, m){ return {kind:"time", h:h, m:m, half:m===30 && h%2===1, kr:time(h, m, m===30 && h%2===1), fig:h+":"+(m<10?"0":"")+m}; }
  function countItem(c, n){ return {kind:"count", c:c, n:n, kr:counted(c, n), fig:countEn(c, n)}; }

  function numberItems(kind){
    var out = [];
    if(!kind || kind==="price") PRICES.forEach(function(p){ out.push(priceItem(p)); });
    if(!kind || kind==="time") HOURS.forEach(function(h){ MINUTES.forEach(function(m){ out.push(timeItem(h, m)); }); });
    if(!kind || kind==="count"){
      COUNTERS.forEach(function(c){ for(var n=1;n<=10;n++) out.push(countItem(c, n)); });
      AGES.forEach(function(n){ out.push(countItem(AGE, n)); });
    }
    return out;
  }
  function spokenNumbers(){ return numberItems().map(function(it){ return it.kr; }); }

  function uniq(list, not){
    var seen = {}, out = [];
    seen[not] = 1;
    list.forEach(function(x){ if(x && !seen[x]){ seen[x] = 1; out.push(x); } });
    return out;
  }
  function nearPrices(p){
    var c = [p+1000, p-1000, p+500, p-500, p*10, p/10, p+10000];
    var s = String(p);
    if(/^\d0+$/.test(s)===false && s.length>=4) c.push(+(s[0]+"0"+s.slice(1,-1)), +(s[1]+s[0]+s.slice(2)));
    return c.filter(function(x){ return x>=100 && x<100000000 && x%100===0; });
  }
  /* Wrong answers built from the real mix-ups: Sino where native belongs, the long native form before a counter, a near number. */
  function wrongKr(it){
    if(it.kind==="price") return uniq(nearPrices(it.value).map(price), it.kr);
    if(it.kind==="time"){
      var rest = it.m===0 ? "" : (it.half ? " 반" : " " + sino(it.m) + " 분");
      return uniq([
        sino(it.h) + " 시" + rest,
        native(it.h, false) + " 시" + rest,
        it.m ? native(it.h, true) + " 시 " + native(it.m, false) + " 분" : "",
        time(it.h===12 ? 1 : it.h+1, it.m, it.half)
      ], it.kr);
    }
    var c = it.c;
    return uniq([
      (c.noun ? c.noun + " " : "") + sino(it.n) + " " + c.counter,
      it.n<100 ? (c.noun ? c.noun + " " : "") + native(it.n, false) + " " + c.counter : "",
      counted(c, it.n===10 ? 9 : it.n+1)
    ], it.kr);
  }
  function wrongFig(it){
    if(it.kind==="price") return uniq(nearPrices(it.value).map(function(p){ return "₩"+commas(p); }), it.fig);
    if(it.kind==="time"){
      var other = MINUTES.filter(function(m){ return m!==it.m; });
      return uniq([
        timeItem(it.h===12 ? 1 : it.h+1, it.m).fig,
        timeItem(it.h===1 ? 12 : it.h-1, it.m).fig,
        timeItem(it.h, other[it.h % other.length]).fig
      ], it.fig);
    }
    var near = it.c===AGE ? [it.n+10, it.n>10 ? it.n-10 : it.n+20, it.n+1] : [it.n+1, it.n===1 ? 3 : it.n-1, it.n+2];
    return uniq(near.map(function(n){ return countEn(it.c, n); }), it.fig);
  }
  /* dir "read": Hangeul prompt, pick the figure. dir "say": figure prompt, pick the Hangeul. Three options, answer first. */
  function numberQuestion(it, dir, shuffle){
    var sh = shuffle || function(a){ return a; };
    var wrong = dir==="read" ? wrongFig(it) : wrongKr(it);
    return { item:it, dir:dir, prompt: dir==="read" ? it.kr : it.fig, answer: dir==="read" ? it.fig : it.kr,
      options: [dir==="read" ? it.fig : it.kr].concat(sh(wrong).slice(0, 2)), audio: it.kr };
  }

  /* Letters of a word: each syllable's initial, vowel and final, with double finals split (ㄺ → ㄹ ㄱ).
     Letters typed on their own (ㄱ, ㅏ) are kept; anything that isn't Hangeul is skipped. */
  var INI = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
  var VOW = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
  var FIN = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  var FIN_PARTS = {"ㄳ":["ㄱ","ㅅ"],"ㄵ":["ㄴ","ㅈ"],"ㄶ":["ㄴ","ㅎ"],"ㄺ":["ㄹ","ㄱ"],"ㄻ":["ㄹ","ㅁ"],"ㄼ":["ㄹ","ㅂ"],"ㄽ":["ㄹ","ㅅ"],"ㄾ":["ㄹ","ㅌ"],"ㄿ":["ㄹ","ㅍ"],"ㅀ":["ㄹ","ㅎ"],"ㅄ":["ㅂ","ㅅ"]};
  function jamo(word){
    var out = [];
    for(var k=0;k<word.length;k++){
      var ch = word[k], c = word.charCodeAt(k)-0xAC00;
      if(c>=0 && c<=11171){
        out.push(INI[Math.floor(c/588)], VOW[Math.floor((c%588)/28)]);
        var f = FIN[c%28];
        if(f) out = out.concat(FIN_PARTS[f] || [f]);
      } else if(INI.indexOf(ch)>=0 || VOW.indexOf(ch)>=0 || FIN_PARTS[ch]) out = out.concat(FIN_PARTS[ch] || [ch]);
    }
    return out;
  }
  function distance(a, b){
    var m=a.length, n=b.length, prev=[], cur, i, j;
    for(j=0;j<=n;j++) prev.push(j);
    for(i=1;i<=m;i++){
      cur=[i];
      for(j=1;j<=n;j++) cur.push(a[i-1]===b[j-1] ? prev[j-1] : 1+Math.min(prev[j-1], prev[j], cur[j-1]));
      prev=cur;
    }
    return prev[n];
  }
  /* Spaces and punctuation don't count: 영어 할 줄 아세요? matches 영어할줄아세요. */
  function normalise(s){ return String(s||"").normalize("NFC").replace(/[\s.,!?~·'"“”‘’…]/g, ""); }
  /* Result of a typed answer. close: one letter out (two in a long word). latin: typed on an English keyboard. */
  function checkTyping(typed, target){
    var t = normalise(typed), want = normalise(target);
    var d = distance(jamo(t), jamo(want));
    return { ok: t===want, close: t!==want && d <= (want.length>4 ? 2 : 1), latin: /[a-z]/i.test(t), empty: !t, typed: t, target: want, letters: d };
  }

  var api = { sino:sino, native:native, price:price, time:time, commas:commas, numberItems:numberItems, spokenNumbers:spokenNumbers,
    wrongKr:wrongKr, wrongFig:wrongFig, numberQuestion:numberQuestion, jamo:jamo, distance:distance, normalise:normalise, checkTyping:checkTyping };
  if(typeof module!=="undefined" && module.exports) module.exports = api;
  else root.KO = api;
})(this);
