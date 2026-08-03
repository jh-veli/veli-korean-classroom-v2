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

  const basicConsonants = new Set(['ㄱ','ㄴ','ㄷ','ㄹ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']);
  const basicVowels = new Set(['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ']);
  function isBasicLetter(char) { return basicConsonants.has(char) || basicVowels.has(char); }

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
    button.className = 'char-card' + (isBasicLetter(char) ? ' basic-char' : '');
    button.innerHTML = `<strong>${char}</strong><small>${sub}</small>`;
    button.addEventListener('click', () => {
      button.parentElement.querySelectorAll('.char-card').forEach(card => card.classList.remove('active'));
      button.classList.add('active');
      click();
    });
    return button;
  }

  function renderAlphabet() {
    const cg = document.getElementById('consonantGrid');
    consonants.forEach(([char,name,sound]) => {
      cg.appendChild(makeCard(char,sound,() => {
        document.getElementById('consonantDetail').innerHTML = `<strong>${char}</strong><span>${name}</span><small>${sound}</small>`;
      }));
    });
    const vg = document.getElementById('vowelGrid');
    vowels.forEach(([char,sound]) => {
      vg.appendChild(makeCard(char,sound,() => {
        document.getElementById('vowelDetail').innerHTML = `<strong>${char}</strong><small>${sound}</small>`;
      }));
    });
    const bg = document.getElementById('batchimGroups');
    batchimGroups.forEach(([sound,chars,desc]) => {
      const box = document.createElement('button');
      box.type = 'button';
      box.className = 'batchim-group';
      box.setAttribute('aria-pressed','false');
      box.innerHTML = `<strong>${sound}</strong><span>${chars} · ${desc}</span>`;
      box.addEventListener('click',() => {
        bg.querySelectorAll('.batchim-group').forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed','false');
        });
        box.classList.add('active');
        box.setAttribute('aria-pressed','true');
        document.getElementById('batchimDetail').innerHTML = `<strong>${sound}</strong><span>${chars}</span><small>${desc}</small>`;
      });
      bg.appendChild(box);
    });
  }

  let demo = {cho:'ㄱ',jung:'ㅏ',jong:''};
  let demoSlot = 'cho';

  function renderDemo() {
    document.getElementById('demoCho').textContent = demo.cho;
    document.getElementById('demoJung').textContent = demo.jung;
    document.getElementById('demoJong').textContent = demo.jong;
    document.getElementById('demoSyllableBlock').classList.toggle('no-final',!demo.jong);
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
      b.className = 'key' + (isBasicLetter(char) ? ' basic-char' : '') + ((demo[demoSlot] || '') === char ? ' active' : '') + (char === '' ? ' none' : '');
      b.innerHTML = `<strong>${char || '받침 없음'}</strong><small>${sub}</small>`;
      b.addEventListener('click',() => { demo[demoSlot] = char; renderDemo(); });
      keypad.appendChild(b);
    });
  }

  let wordTokens = decompose('안녕하세요');
  let activeIndex = 0;
  let wordSlot = 'cho';

  function currentWord() { return tokensToWord(wordTokens); }

  function renderPresets() {
    const row = document.getElementById('presetRow');
    row.innerHTML = '';
    presets.forEach(word => {
      const button = document.createElement('button');
      button.className = 'preset' + (currentWord() === word ? ' active' : '');
      button.innerHTML = `${word}<small>${romanizeTokens(decompose(word))}</small>`;
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
      b.className = 'key' + (isBasicLetter(char) ? ' basic-char' : '') + ((token[wordSlot] || '') === char ? ' active' : '') + (char === '' ? ' none' : '');
      b.innerHTML = `<strong>${char || '받침 없음'}</strong><small>${sub}</small>`;
      b.addEventListener('click',() => { token[wordSlot] = char; renderWordBuilder(); });
      keypad.appendChild(b);
    });
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

  renderWordBuilder();
})();
