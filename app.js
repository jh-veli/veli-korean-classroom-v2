(() => {
  'use strict';

  const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  const consonants = [
    ['ㄱ','기역','g/k'],['ㄲ','쌍기역','kk'],['ㄴ','니은','n'],['ㄷ','디귿','d/t'],['ㄸ','쌍디귿','tt'],
    ['ㄹ','리을','r/l'],['ㅁ','미음','m'],['ㅂ','비읍','b/p'],['ㅃ','쌍비읍','pp'],['ㅅ','시옷','s/sh'],
    ['ㅆ','쌍시옷','ss'],['ㅇ','이응','-/ng'],['ㅈ','지읒','j'],['ㅉ','쌍지읒','jj'],['ㅊ','치읓','ch'],
    ['ㅋ','키읔','k'],['ㅌ','티읕','t'],['ㅍ','피읖','p'],['ㅎ','히읗','h']
  ];

  const vowels = [
    ['ㅏ','a'],['ㅐ','ae'],['ㅑ','ya'],['ㅒ','yae'],['ㅓ','eo'],['ㅔ','e'],['ㅕ','yeo'],['ㅖ','ye'],
    ['ㅗ','o'],['ㅘ','wa'],['ㅙ','wae'],['ㅚ','oe'],['ㅛ','yo'],['ㅜ','u'],['ㅝ','wo'],['ㅞ','we'],
    ['ㅟ','wi'],['ㅠ','yu'],['ㅡ','eu'],['ㅢ','ui'],['ㅣ','i']
  ];

  const finalRoman = {
    '':'','ㄱ':'k','ㄲ':'k','ㄳ':'k','ㄴ':'n','ㄵ':'n','ㄶ':'n','ㄷ':'t','ㄹ':'l','ㄺ':'k','ㄻ':'m',
    'ㄼ':'l','ㄽ':'l','ㄾ':'l','ㄿ':'p','ㅀ':'l','ㅁ':'m','ㅂ':'p','ㅄ':'p','ㅅ':'t','ㅆ':'t',
    'ㅇ':'ng','ㅈ':'t','ㅊ':'t','ㅋ':'k','ㅌ':'t','ㅍ':'p','ㅎ':'t'
  };

  const batchimGroups = [
    ['ㄱ /k/','ㄱ ㄲ ㄳ ㄺ ㅋ','Mouth closes — no air release'],
    ['ㄴ /n/','ㄴ ㄵ ㄶ','Tongue to roof — nasal release'],
    ['ㄷ /t/','ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ','Tongue at teeth — no air release'],
    ['ㄹ /l/','ㄹ ㄼ ㄽ ㄾ ㅀ','Tongue to roof — air releases out the sides'],
    ['ㅁ /m/','ㅁ ㄻ','Lips close — nasal release'],
    ['ㅂ /p/','ㅂ ㅄ ㄿ ㅍ','Lips press shut — no air release'],
    ['ㅇ /ng/','ㅇ','Sound resonates at the back of the mouth']
  ];

  const presets = ['안녕하세요','한글','안녕','사랑','감사','밥','물','한국','친구','엄마','아빠','학교','학생'];
  let dictionaryEntries = [];
  let dictionaryMap = new Map();

  function assemble(cho, jung, jong='') {
    const ci = CHO.indexOf(cho);
    const vi = JUNG.indexOf(jung);
    const fi = JONG.indexOf(jong);
    if (ci < 0 || vi < 0 || fi < 0) return `${cho || ''}${jung || ''}${jong || ''}`;
    return String.fromCharCode(44032 + ci * 588 + vi * 28 + fi);
  }

  function decompose(text) {
    const tokens = [];
    for (const char of text) {
      if (char === ' ') { tokens.push({type:'space'}); continue; }
      const code = char.charCodeAt(0);
      if (code >= 44032 && code <= 55203) {
        const base = code - 44032;
        tokens.push({
          type:'syllable',
          cho:CHO[Math.floor(base / 588)],
          jung:JUNG[Math.floor((base % 588) / 28)],
          jong:JONG[base % 28]
        });
      }
    }
    return tokens;
  }

  function romanSyllable(token) {
    const onset = (consonants.find(x => x[0] === token.cho)?.[2] || '').split('/')[0].replace('-','');
    const vowel = vowels.find(x => x[0] === token.jung)?.[1] || '';
    return onset + vowel + (finalRoman[token.jong] || '');
  }

  function tokensToWord(tokens) {
    return tokens.map(t => t.type === 'space' ? ' ' : assemble(t.cho,t.jung,t.jong)).join('').trim();
  }

  function romanizeTokens(tokens) {
    let out = '';
    let previous = false;
    for (const token of tokens) {
      if (token.type === 'space') { out = out.replace(/\s+$/,'') + ' '; previous = false; continue; }
      if (previous) out += '·';
      out += romanSyllable(token);
      previous = true;
    }
    return out.trim();
  }

  function makeCard(char, sub, click) {
    const button = document.createElement('button');
    button.className = 'char-card';
    button.innerHTML = `<strong>${char}</strong><small>${sub}</small>`;
    button.addEventListener('click', click);
    return button;
  }

  function renderAlphabet() {
    const cg = document.getElementById('consonantGrid');
    consonants.forEach(([char,name,sound]) => {
      cg.appendChild(makeCard(char,sound,() => {
        document.getElementById('consonantDetail').textContent = `${char} · ${name} · ${sound}`;
      }));
    });
    const vg = document.getElementById('vowelGrid');
    vowels.forEach(([char,sound]) => {
      vg.appendChild(makeCard(char,sound,() => {
        document.getElementById('vowelDetail').textContent = `${char} · ${sound}`;
      }));
    });
    const bg = document.getElementById('batchimGroups');
    batchimGroups.forEach(([sound,chars,desc]) => {
      const box = document.createElement('div');
      box.className = 'batchim-group';
      box.innerHTML = `<strong>${sound}</strong><span>${chars} · ${desc}</span>`;
      bg.appendChild(box);
    });
  }

  let demo = {cho:'ㄱ',jung:'ㅏ',jong:''};
  let demoSlot = 'cho';

  function renderDemo() {
    document.getElementById('demoCho').textContent = demo.cho;
    document.getElementById('demoJung').textContent = demo.jung;
    document.getElementById('demoJong').textContent = demo.jong;
    document.getElementById('demoResult').textContent = assemble(demo.cho,demo.jung,demo.jong);
    document.getElementById('demoRoman').textContent = romanSyllable({type:'syllable',...demo});
    document.querySelectorAll('[data-demo-slot]').forEach(b => b.classList.toggle('active',b.dataset.demoSlot===demoSlot));
    const keypad = document.getElementById('demoKeypad');
    keypad.innerHTML = '';
    let items = demoSlot === 'cho' ? consonants.map(x => [x[0],x[2]]) :
                demoSlot === 'jung' ? vowels :
                [['','none'], ...JONG.slice(1).map(x => [x,finalRoman[x]])];
    items.forEach(([char,sub]) => {
      const b = document.createElement('button');
      b.className = 'key' + ((demo[demoSlot] || '') === char ? ' active' : '') + (char === '' ? ' none' : '');
      b.innerHTML = `<strong>${char || '받침 없음'}</strong><small>${sub}</small>`;
      b.addEventListener('click',() => { demo[demoSlot] = char; renderDemo(); });
      keypad.appendChild(b);
    });
  }

  let wordTokens = decompose('안녕하세요');
  let activeIndex = 0;
  let wordSlot = 'cho';

  function currentWord() { return tokensToWord(wordTokens); }

  function displayDictionary(word) {
    const normalized = String(word || '').trim();
    const matches = dictionaryMap.get(normalized) || [];
    document.getElementById('miniWord').textContent = normalized || '단어를 검색해 주세요.';
    if (!normalized) {
      document.getElementById('miniMeaning').textContent = '';
      document.getElementById('miniMeta').textContent = '';
      document.getElementById('miniRoman').textContent = '';
      document.getElementById('miniNote').textContent = 'A1 기본 어휘 982개를 검색할 수 있습니다.';
      return;
    }
    if (!matches.length) {
      document.getElementById('miniMeaning').textContent = '미니사전에 등록되지 않은 표현입니다.';
      document.getElementById('miniMeta').textContent = '';
      document.getElementById('miniRoman').textContent = romanizeTokens(decompose(normalized));
      document.getElementById('miniNote').textContent = '자세한 뜻과 발음은 외부 사전에서 확인하세요.';
      return;
    }
    const first = matches[0];
    const meanings = [...new Set(matches.map(x => x.meaning).filter(Boolean))].join(' / ');
    const metas = [...new Set(matches.map(x => `${x.pos_ko || x.pos} · ${x.level || 'A1'}`))].join(' / ');
    document.getElementById('miniMeaning').textContent = meanings;
    document.getElementById('miniMeta').textContent = metas;
    document.getElementById('miniRoman').textContent = first.roman || romanizeTokens(decompose(first.word));
    document.getElementById('miniNote').textContent = '자세한 뜻, 예문과 발음은 외부 사전에서 확인하세요.';
    if (document.activeElement !== document.getElementById('miniSearch')) {
      document.getElementById('miniSearch').value = first.word;
    }
  }

  function renderPresets() {
    const row = document.getElementById('presetRow');
    row.innerHTML = '';
    presets.forEach(word => {
      const entry = dictionaryMap.get(word)?.[0];
      const button = document.createElement('button');
      button.className = 'preset' + (currentWord() === word ? ' active' : '');
      button.innerHTML = `${word}<small>${entry?.roman || romanizeTokens(decompose(word))}</small>`;
      button.addEventListener('click',() => setBuilderWord(word));
      row.appendChild(button);
    });
  }

  function setBuilderWord(word) {
    const tokens = decompose(word);
    if (!tokens.length) return;
    wordTokens = tokens;
    activeIndex = Math.max(0,wordTokens.findIndex(t => t.type === 'syllable'));
    wordSlot = 'cho';
    renderWordBuilder();
  }

  function renderWordBuilder() {
    renderPresets();
    const cards = document.getElementById('wordCards');
    cards.innerHTML = '';
    wordTokens.forEach((token,index) => {
      if (token.type === 'space') {
        const b = document.createElement('button');
        b.className = 'space-card';
        b.textContent = 'SPACE';
        b.addEventListener('click',() => { activeIndex=index; renderWordBuilder(); });
        cards.appendChild(b);
        return;
      }
      const b = document.createElement('button');
      b.className = 'syllable-card' + (activeIndex === index ? ' active' : '');
      b.innerHTML = `<strong>${assemble(token.cho,token.jung,token.jong)}</strong><small>${romanSyllable(token)}</small>`;
      b.addEventListener('click',() => { activeIndex=index; renderWordBuilder(); });
      cards.appendChild(b);
    });
    const add = document.createElement('button');
    add.className = 'add-card';
    add.textContent = '+';
    add.addEventListener('click',() => {
      const i = Math.min(activeIndex + 1, wordTokens.length);
      wordTokens.splice(i,0,{type:'syllable',cho:'ㅇ',jung:'ㅏ',jong:''});
      activeIndex = i; renderWordBuilder();
    });
    cards.appendChild(add);
    document.getElementById('wordRoman').textContent = romanizeTokens(wordTokens);
    renderWordEditor();
    displayDictionary(currentWord());
  }

  function renderWordEditor() {
    const editor = document.getElementById('wordEditor');
    const token = wordTokens[activeIndex];
    if (!token || token.type === 'space') {
      editor.innerHTML = '<p>편집할 음절 카드를 선택하세요.</p>';
      return;
    }
    editor.innerHTML = `
      <div class="slot-tabs">
        <button class="slot-tab ${wordSlot==='cho'?'active':''}" data-word-slot="cho">자음</button>
        <button class="slot-tab ${wordSlot==='jung'?'active':''}" data-word-slot="jung">모음</button>
        <button class="slot-tab ${wordSlot==='jong'?'active':''}" data-word-slot="jong">받침</button>
      </div>
      <div class="keypad" id="wordKeypad"></div>
    `;
    editor.querySelectorAll('[data-word-slot]').forEach(b => b.addEventListener('click',() => { wordSlot=b.dataset.wordSlot; renderWordEditor(); }));
    const keypad = document.getElementById('wordKeypad');
    let items = wordSlot === 'cho' ? consonants.map(x => [x[0],x[2]]) :
                wordSlot === 'jung' ? vowels :
                [['','none'], ...JONG.slice(1).map(x => [x,finalRoman[x]])];
    items.forEach(([char,sub]) => {
      const b = document.createElement('button');
      b.className = 'key' + ((token[wordSlot] || '') === char ? ' active' : '') + (char === '' ? ' none' : '');
      b.innerHTML = `<strong>${char || '받침 없음'}</strong><small>${sub}</small>`;
      b.addEventListener('click',() => { token[wordSlot] = char; renderWordBuilder(); });
      keypad.appendChild(b);
    });
  }

  function renderSuggestions(query) {
    const box = document.getElementById('miniSuggestions');
    const q = query.trim();
    box.innerHTML = '';
    if (!q) { box.classList.remove('open'); return; }
    const unique = new Map();
    dictionaryEntries.filter(x => x.word.startsWith(q) || x.word.includes(q)).forEach(x => {
      if (!unique.has(x.word)) unique.set(x.word,x);
    });
    [...unique.values()].slice(0,8).forEach(entry => {
      const b = document.createElement('button');
      b.className = 'suggestion';
      b.innerHTML = `<strong>${entry.word}</strong><span>${entry.meaning}</span><small>${entry.pos_ko || entry.pos} · ${entry.level}</small>`;
      b.addEventListener('click',() => {
        document.getElementById('miniSearch').value = entry.word;
        box.classList.remove('open');
        displayDictionary(entry.word);
      });
      box.appendChild(b);
    });
    box.classList.toggle('open',box.children.length > 0);
  }

  async function loadDictionary() {
    try {
      const response = await fetch('./mini_dictionary.json',{cache:'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      dictionaryEntries = Array.isArray(data) ? data : (data.entries || []);
      dictionaryMap = new Map();
      dictionaryEntries.forEach(entry => {
        if (!dictionaryMap.has(entry.word)) dictionaryMap.set(entry.word,[]);
        dictionaryMap.get(entry.word).push(entry);
      });
      renderWordBuilder();
    } catch (error) {
      document.getElementById('miniWord').textContent = '미니사전을 불러오지 못했습니다.';
      document.getElementById('miniNote').textContent = 'mini_dictionary.json 파일 위치를 확인하세요.';
      console.error(error);
    }
  }

  function renderTyping() {
    const text = document.getElementById('typingInput').value.trim();
    document.getElementById('typingKorean').textContent = text || '한글을 입력해 보세요.';
    const tokens = decompose(text);
    document.getElementById('typingRoman').textContent = romanizeTokens(tokens);
    const cards = document.getElementById('typedCards');
    cards.innerHTML = '';
    tokens.forEach(token => {
      if (token.type === 'space') return;
      const card = document.createElement('div');
      card.className = 'typed-card';
      card.innerHTML = `<strong>${assemble(token.cho,token.jung,token.jong)}</strong><small>${romanSyllable(token)}</small>`;
      cards.appendChild(card);
    });
  }

  renderAlphabet();
  document.querySelectorAll('[data-demo-slot]').forEach(b => b.addEventListener('click',() => { demoSlot=b.dataset.demoSlot; renderDemo(); }));
  document.getElementById('demoReset').addEventListener('click',() => { demo={cho:'ㄱ',jung:'ㅏ',jong:''};demoSlot='cho';renderDemo(); });
  document.getElementById('demoRemoveFinal').addEventListener('click',() => { demo.jong='';demoSlot='jong';renderDemo(); });
  renderDemo();

  document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click',() => {
    document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const typing = b.dataset.mode === 'typing';
    document.getElementById('cardsMode').style.display = typing ? 'none' : 'block';
    document.getElementById('typingMode').classList.toggle('active',typing);
  }));

  document.getElementById('wordReset').addEventListener('click',() => setBuilderWord('안녕하세요'));
  document.getElementById('addSpace').addEventListener('click',() => {
    const i = Math.min(activeIndex + 1,wordTokens.length);
    if (wordTokens[i-1]?.type !== 'space') wordTokens.splice(i,0,{type:'space'});
    activeIndex=i;renderWordBuilder();
  });
  document.getElementById('removeFinal').addEventListener('click',() => {
    const token=wordTokens[activeIndex];if(token?.type==='syllable'){token.jong='';wordSlot='jong';renderWordBuilder();}
  });
  document.getElementById('deleteSelected').addEventListener('click',() => {
    if(!wordTokens.length)return;wordTokens.splice(activeIndex,1);activeIndex=Math.max(0,Math.min(activeIndex,wordTokens.length-1));renderWordBuilder();
  });

  document.getElementById('miniSearch').addEventListener('input',e => renderSuggestions(e.target.value));
  document.getElementById('miniSearchButton').addEventListener('click',() => displayDictionary(document.getElementById('miniSearch').value));
  document.getElementById('miniToBuilder').addEventListener('click',() => setBuilderWord(document.getElementById('miniSearch').value));
  document.getElementById('miniKrdict').addEventListener('click',() => {
    document.getElementById('externalDictInput').value=document.getElementById('miniSearch').value||currentWord();
    document.getElementById('openKrdict').click();
  });
  document.getElementById('miniNaver').addEventListener('click',() => {
    document.getElementById('externalDictInput').value=document.getElementById('miniSearch').value||currentWord();
    document.getElementById('openNaver').click();
  });

  document.getElementById('typingInput').addEventListener('input',renderTyping);
  document.getElementById('typingConvert').addEventListener('click',renderTyping);
  document.getElementById('typingToBuilder').addEventListener('click',() => {
    const text=document.getElementById('typingInput').value.trim();
    if(!text)return;
    setBuilderWord(text);
    document.querySelector('[data-mode="cards"]').click();
    document.getElementById('wordBuilderSection').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('typingClear').addEventListener('click',() => {
    document.getElementById('typingInput').value='';renderTyping();
  });

  loadDictionary();
})();