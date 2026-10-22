/* Hangeul Lab pure logic: the SRS scheduler, saved-progress migrations, backup merging, the
   backup reminder and the study calendar. No DOM or browser globals, so `node --test` can run srs.test.js against it.
   Loaded with a plain <script> before the app code (sets window.SRS); Node gets module.exports. */
(function(root){
  var DAY = 24*60*60*1000;
  var REMINDER_DAYS = 7;

  function newCard(){ return {ef:2.5, interval:0, reps:0, due:0, lastReview:0, lapses:0, seen:false}; }

  /* First sight: due straight away, scheduling starts fresh. */
  function markSeen(it, now){
    if(!it.seen){ it.seen=true; it.due=now; it.ef=2.5; it.reps=0; it.interval=0; }
    return it;
  }
  function isDue(it, now){ return !!(it && it.seen && it.due<=now); }
  function isMastered(it){ return !!(it && it.reps>=5 && it.interval>=21); }

  /* Simplified SM-2. grade: 0 = missed, 1 = hard, 2 = good, 3 = easy. */
  function grade(it, g, now){
    if(g===0){
      it.lapses=(it.lapses||0)+1;
      it.reps=0;
      it.interval=0;
      it.ef=Math.max(1.3, it.ef-0.2);
      it.due = now + 12*60*60*1000; // resurfaces later today/tomorrow
    } else {
      it.reps=(it.reps||0)+1;
      if(it.reps===1) it.interval=1;
      else if(it.reps===2) it.interval = g===1?2:(g===3?4:3);
      else it.interval = Math.max(1, Math.round(it.interval * it.ef * (g===1?0.85:(g===3?1.3:1))));
      if(g===1) it.ef=Math.max(1.3, it.ef-0.15);
      if(g===3) it.ef=it.ef+0.1;
      it.due = now + it.interval*DAY;
    }
    it.lastReview=now;
    it.seen=true;
    return it;
  }

  /* Brings saved progress (from storage or an imported backup) up to the current schema.
     Schema 1 (no field): vocab progress keyed "v_<list position>". Schema 2: permanent vocab IDs.
     Fields missing from older saves are filled from `defaults`. */
  function migrate(s, defaults, legacyIds){
    if(!s.schema || s.schema < 2){
      var items = {};
      for(var id in s.items){
        var m = /^v_(\d+)$/.exec(id);
        if(m){ if(legacyIds[+m[1]]) items[legacyIds[+m[1]]] = s.items[id]; }
        else items[id] = s.items[id];
      }
      s.items = items;
      s.schema = 2;
    }
    for(var k in defaults){ if(!(k in s)) s[k]=defaults[k]; }
    return s;
  }

  /* "2026-10-2" -> 20261002, so day strings without zero padding still compare. */
  function dayValue(s){ var p=String(s).split("-"); return (+p[0])*10000+(+p[1])*100+(+p[2]); }

  /* Passing a lesson or sound rule counts as the first review of its sentences: they come back
     in `days` days. Returns false (and leaves the card alone) if it was already being reviewed. */
  function passAsFirstReview(it, now, days){
    if(it.seen) return false;
    it.seen=true; it.reps=1; it.interval=1; it.lastReview=now;
    it.due = now + days*DAY;
    return true;
  }

  /* Merge, not replace: for each item keep whichever copy was reviewed most recently, so moving
     progress between two devices in either direction never loses reviews. Items `isKnown` rejects
     (content that no longer exists) are skipped. Theme and daily cap stay as set on this device. */
  function merge(state, incoming, isKnown){
    var added=0, updated=0;
    for(var id in incoming.items){
      if(!isKnown(id)) continue;
      var mine=state.items[id], theirs=incoming.items[id];
      if(!mine){ state.items[id]=theirs; added++; }
      else if((theirs.lastReview||0) > (mine.lastReview||0)){ state.items[id]=theirs; updated++; }
    }
    if(incoming.lastActiveDay && (!state.lastActiveDay || dayValue(incoming.lastActiveDay) > dayValue(state.lastActiveDay))){
      state.lastActiveDay=incoming.lastActiveDay; state.streak=incoming.streak||0;
    } else if(incoming.lastActiveDay===state.lastActiveDay){
      state.streak=Math.max(state.streak||0, incoming.streak||0);
    }
    for(var d in incoming.done){ if(!state.done[d] || incoming.done[d] > state.done[d]){ state.done[d]=incoming.done[d]; updated++; } }
    state.studyDays = state.studyDays || {};
    for(var k in incoming.studyDays){ state.studyDays[k] = Math.max(state.studyDays[k]||0, incoming.studyDays[k]||0); }
    return {added:added, updated:updated};
  }

  /* Study calendar: studyDays is {"2026-10-22": how many things were reviewed or finished that day}.
     Keys are local days, zero-padded so they sort. */
  function pad(n){ return (n<10?"0":"")+n; }
  function dayKey(ms){ var d=new Date(ms); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function logStudy(state, now, n){
    state.studyDays = state.studyDays || {};
    var k = dayKey(now);
    state.studyDays[k] = (state.studyDays[k]||0) + (n===undefined ? 1 : n);
  }
  /* Saves from before v1.8 kept no calendar. Rebuild what we can: each item's last review, each finished
     lesson or step, and the current streak's run of days. Returns how many days were found. */
  function seedStudyDays(state){
    var days = {}, id;
    function add(ms){ if(ms){ var k=dayKey(ms); days[k]=(days[k]||0)+1; } }
    for(id in state.items) add(state.items[id].lastReview);
    for(id in state.done) add(state.done[id]);
    if(state.lastActiveDay && state.streak){
      var p = String(state.lastActiveDay).split("-"), d = new Date(+p[0], +p[1]-1, +p[2], 12);
      for(var i=0;i<state.streak;i++){ var k=dayKey(d.getTime()); if(!days[k]) days[k]=1; d.setDate(d.getDate()-1); }
    }
    state.studyDays = days;
    return Object.keys(days).length;
  }
  /* Longest run of consecutive study days. */
  function longestStreak(studyDays){
    var keys = Object.keys(studyDays||{}).filter(function(k){ return studyDays[k]>0; }).sort(), best=0, run=0, prev=null;
    keys.forEach(function(k){
      var p = k.split("-"), t = new Date(+p[0], +p[1]-1, +p[2], 12);
      if(prev){ var next = new Date(prev); next.setDate(next.getDate()+1); run = dayKey(next.getTime())===k ? run+1 : 1; }
      else run = 1;
      prev = t; if(run>best) best=run;
    });
    return best;
  }
  /* Reviews falling due on each of the next `n` local days; day 0 also counts anything overdue.
     startOfToday is local midnight; cards are the current review items. */
  function dueForecast(cards, startOfToday, n){
    var ends = [], out = [], d = new Date(startOfToday), i;
    for(i=0;i<n;i++){ d.setDate(d.getDate()+1); ends.push(d.getTime()); out.push(0); }
    cards.forEach(function(it){
      if(!it || !it.seen) return;
      for(i=0;i<n;i++){ if(it.due < ends[i]){ out[i]++; return; } }
    });
    return out;
  }

  /* Weekly backup nudge: overdue once there is progress worth keeping and the last
     backup (download or copy) is a week old, or there has never been one. */
  function backupStatus(lastBackupAt, hasProgress, now){
    var days = lastBackupAt ? Math.floor((now - lastBackupAt) / DAY) : null;
    return { overdue: !!hasProgress && (days===null || days>=REMINDER_DAYS), days: days };
  }

  var api = { DAY:DAY, REMINDER_DAYS:REMINDER_DAYS, newCard:newCard, markSeen:markSeen, isDue:isDue, isMastered:isMastered,
    grade:grade, passAsFirstReview:passAsFirstReview, migrate:migrate, dayValue:dayValue, merge:merge, backupStatus:backupStatus,
    dayKey:dayKey, logStudy:logStudy, seedStudyDays:seedStudyDays, longestStreak:longestStreak, dueForecast:dueForecast };
  if(typeof module!=="undefined" && module.exports) module.exports = api;
  else root.SRS = api;
})(this);
