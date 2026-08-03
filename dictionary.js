(() => {
  'use strict';

  const krdictHome = 'https://krdict.korean.go.kr/eng/mainAction';
  const naverHome = 'https://ko.dict.naver.com/';
  const englishDictHome = 'https://en.dict.naver.com/';

  const input = document.getElementById('externalDictInput');
  const status = document.getElementById('dictStatus');

  function word() { return input.value.trim(); }

  function openLink(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      input.focus();
      input.select();
      try { return document.execCommand('copy'); } catch { return false; }
    }
  }

  document.getElementById('openKrdict').addEventListener('click',async() => {
    const value = word();
    if (value) await copyText(value);
    openLink(krdictHome);
    status.textContent = value
      ? `“${value}”를 복사하고 한국어기초사전을 열었습니다. 검색창에 붙여넣어 주세요.`
      : '한국어기초사전을 새 탭으로 열었습니다.';
  });

  document.getElementById('openNaver').addEventListener('click',() => {
    const value = word();
    openLink(value ? `${naverHome}#/search?query=${encodeURIComponent(value)}` : naverHome);
    status.textContent = value ? `네이버 국어사전에서 “${value}”를 열었습니다.` : '네이버 국어사전을 열었습니다.';
  });

  document.getElementById('openEnglishDict').addEventListener('click',() => {
    const value = word();
    openLink(value ? `${englishDictHome}#/search?query=${encodeURIComponent(value)}` : englishDictHome);
    status.textContent = value ? `네이버 영한사전에서 “${value}”를 열었습니다.` : '네이버 영한사전을 열었습니다.';
  });

  document.getElementById('copyWord').addEventListener('click',async() => {
    const value = word();
    if (!value) { status.textContent='먼저 단어를 입력해 주세요.'; return; }
    status.textContent = await copyText(value) ? `“${value}”를 복사했습니다.` : '복사하지 못했습니다.';
  });
})();
