(() => {
  'use strict';

  const fields = {
    student:'summaryStudent',date:'summaryDate',words:'summaryWords',sentences:'summarySentences',
    pronunciation:'summaryPronunciation',homework:'summaryHomework',next:'summaryNext'
  };

  document.getElementById('summaryDate').value = new Date().toISOString().slice(0,10);

  function value(key) { return document.getElementById(fields[key]).value.trim(); }

  function preview() {
    document.getElementById('summaryPreview').innerHTML = `
      <article class="summary-sheet">
        <h2>Veli Korean Classroom</h2>
        <p><strong>Student:</strong> ${value('student') || '-'}</p>
        <p><strong>Date:</strong> ${value('date') || '-'}</p>
        <h3>Today's Words</h3><p>${value('words') || '-'}</p>
        <h3>Today's Sentences</h3><p>${value('sentences') || '-'}</p>
        <h3>Pronunciation Notes</h3><p>${value('pronunciation') || '-'}</p>
        <h3>Review / Homework</h3><p>${value('homework') || '-'}</p>
        <h3>Next Lesson</h3><p>${value('next') || '-'}</p>
      </article>
    `;
  }

  document.getElementById('previewSummary').addEventListener('click',preview);
  document.getElementById('printSummary').addEventListener('click',() => { preview(); window.print(); });
  document.getElementById('resetSummary').addEventListener('click',() => {
    Object.values(fields).forEach(id => document.getElementById(id).value='');
    document.getElementById('summaryDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('summaryPreview').textContent='입력 후 미리보기를 눌러 주세요.';
  });
})();