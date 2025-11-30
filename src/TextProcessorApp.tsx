import React, { useEffect, useState } from 'react';
import {
  ArrowDownUp,
  ArrowUpDown,
  Calculator,
  Copy,
  Hash,
  Info,
  Layers,
  Link,
  ListOrdered,
  Minus,
  Plus,
  RotateCcw,
  Shuffle,
  Smile,
  Trash2,
  Type,
  X
} from 'lucide-react';

export default function MixSmmTextProcessor() {
  const [inputText, setInputText] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [lastPostId, setLastPostId] = useState('');
  const [excludeEmpty, setExcludeEmpty] = useState(true);
  const [pipeActive, setPipeActive] = useState(false);
  const [notification, setNotification] = useState('');
  const [lineCount, setLineCount] = useState(0);
  const [emptyLineCount, setEmptyLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [showCustomChars, setShowCustomChars] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(192);

  useEffect(() => {
    updateStats();
  }, [inputText]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2500);
  };

  const updateStats = () => {
    const lines = inputText.split('\n');
    const nonEmptyLines = lines.filter((line) => line.trim() !== '');
    setLineCount(lines.length);
    setEmptyLineCount(lines.length - nonEmptyLines.length);
    setCharCount(inputText.length);
  };

  const getLines = () => inputText.split('\n');
  const setResult = (lines: string[]) => setInputText(lines.join('\n'));

  // PREFIX / SUFFIX / RANGE
  const processMassorder = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ Enter some data first');
      return;
    }

    const lines = getLines();
    const processed: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed && excludeEmpty) continue;

      let finalSuffix = suffix;
      const rangeMatch = suffix.match(/(\d+)\s*-\s*(\d+)/);

      if (rangeMatch) {
        const min = parseInt(rangeMatch[1], 10);
        const max = parseInt(rangeMatch[2], 10);
        if (!isNaN(min) && !isNaN(max) && min <= max) {
          const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          finalSuffix = suffix.replace(rangeMatch[0], randomNum.toString());
        }
      }

      processed.push(!trimmed && !excludeEmpty ? '' : prefix + trimmed + finalSuffix);
    }

    setResult(processed);
    showNotification('✓ Prefix and suffix applied');
  };

  // PIPE SEPARATOR | (for MIX-SMM.RU)
  const togglePipe = () => {
    const pipe = '|';

    if (!pipeActive) {
      setPrefix((prev) => prev + pipe);
      setSuffix((prev) => pipe + prev);
      setPipeActive(true);
      showNotification('✓ Separator | added (handy for MIX-SMM.RU)');
    } else {
      setPrefix((prev) => (prev.endsWith(pipe) ? prev.slice(0, -1) : prev));
      setSuffix((prev) => (prev.startsWith(pipe) ? prev.slice(1) : prev));
      setPipeActive(false);
      showNotification('✓ Separator | removed');
    }
  };

  // SHUFFLE LINES
  const shuffleLines = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines();
    const shuffled = [...lines];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setResult(shuffled);
    showNotification('✓ Lines shuffled');
  };

  // REVERSE LINES
  const reverseLines = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines();
    setResult(lines.reverse());
    showNotification('✓ Reversed line order');
  };

  // INVERT WORDS PER LINE
  const invertWords = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines();
    const inverted = lines.map((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      if (words.length === 0) return '';
      if (words.length === 1) return words[0].split('').reverse().join('');
      return words.reverse().join(' ');
    });
    setResult(inverted);
    showNotification('✓ Words order inverted');
  };

  // ALIGN TO COLUMN (VERTICAL)
  const alignToColumns = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines().filter((line) => line.trim());
    if (lines.length === 0) return;

    const wordsMatrix = lines.map((line) => line.split(/\s+/).filter(Boolean));
    const maxWords = Math.max(...wordsMatrix.map((w) => w.length));
    const result: string[] = [];

    for (let i = 0; i < maxWords; i++) {
      for (let j = 0; j < wordsMatrix.length; j++) {
        if (wordsMatrix[j][i]) result.push(wordsMatrix[j][i]);
      }
    }

    setInputText(result.join('\n'));
    showNotification('✓ Text arranged vertically');
  };

  // REMOVE DUPLICATES
  const removeDuplicates = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines();
    const unique = [...new Set(lines)];
    const removed = lines.length - unique.length;
    setResult(unique);
    showNotification(`✓ Duplicates removed: ${removed}`);
  };

  // STATS
  const countCharacters = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }

    const totalChars = inputText.length;
    const withoutSpaces = inputText.replace(/\s/g, '').length;
    const spaces = totalChars - withoutSpaces;
    const lines = getLines();
    const nonEmptyLines = lines.filter((l) => l.trim()).length;

    showNotification(
      `Chars: ${totalChars} (no spaces: ${withoutSpaces}, spaces: ${spaces}) | Lines: ${lines.length}, non-empty: ${nonEmptyLines}`
    );
  };

  // LINE NUMBERS
  const addLineNumbers = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines();
    const processed = lines.map((line, index) =>
      line.trim() ? `${index + 1}. ${line.trim()}` : ''
    );
    setResult(processed);
    showNotification('✓ Line numbers added');
  };

  // SORT LINES
  const sortLines = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    const lines = getLines().filter((l) => l.trim());
    if (!lines.length) {
      showNotification('⚠️ No non-empty lines to sort');
      return;
    }
    const sorted = [...lines].sort((a, b) => a.localeCompare(b));
    setResult(sorted);
    showNotification('✓ Lines sorted A→Z');
  };

  // GENERATE t.me POST IDS (no regex)
  const generatePostIds = () => {
    const lastId = parseInt(lastPostId, 10);

    if (isNaN(lastId) || lastId < 0) {
      showNotification('⚠️ Enter correct final post ID');
      return;
    }
    if (!inputText.trim()) {
      showNotification('⚠️ Enter t.me links');
      return;
    }

    const lines = getLines();
    const processed: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let url = trimmed;

      let protocol = '';
      if (url.startsWith('https://')) {
        protocol = 'https://';
        url = url.slice('https://'.length);
      } else if (url.startsWith('http://')) {
        protocol = 'http://';
        url = url.slice('http://'.length);
      }

      const parts = url.split('/'); // t.me, channel, id, ...
      if (parts.length >= 3 && parts[0] === 't.me') {
        const baseUrl = protocol + parts[0] + '/' + parts[1] + '/';
        const firstNumber = parseInt(parts[2], 10);

        if (!isNaN(firstNumber)) {
          if (firstNumber < lastId) {
            for (let i = firstNumber; i <= lastId; i++) {
              processed.push(baseUrl + i);
            }
          } else {
            for (let j = firstNumber; j >= lastId; j--) {
              processed.push(baseUrl + j);
            }
          }
        }
      } else {
        processed.push(trimmed);
      }
    }

    if (processed.length === 0) {
      showNotification('⚠️ No valid t.me links found');
      return;
    }

    setResult(processed);
    showNotification(`✓ Links created: ${processed.length}`);
  };

  // EXTRACT LINKS / @USERNAME (no regex)
  const extractLinks = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }

    const tokens = inputText.split(/\s+/).filter(Boolean);
    const links: string[] = [];

    for (const token of tokens) {
      if (
        token.startsWith('http://') ||
        token.startsWith('https://') ||
        token.startsWith('www.') ||
        token.startsWith('@') ||
        token.includes('t.me/')
      ) {
        links.push(token);
      }
    }

    if (!links.length) {
      setInputText('No links found');
      showNotification('ℹ️ No links found');
      return;
    }

    const unique = [...new Set(links)];
    setResult(unique);
    showNotification(`✓ Links/usernames found: ${unique.length}`);
  };

  // REMOVE CUSTOM CHARS
  const removeCustomChars = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    if (!customChars.trim()) {
      showNotification('⚠️ Enter characters to remove');
      return;
    }

    let result = inputText;
    for (const char of customChars) {
      result = result.split(char).join('');
    }

    setInputText(result);
    setCustomChars('');
    setShowCustomChars(false);
    showNotification('✓ Selected characters removed');
  };

  // SMART CLEAN
  const smartCleanText = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }

    let result = inputText;
    result = result.replace(/\s+/g, ' ');
    result = result
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
    result = result.replace(/\n\n+/g, '\n\n');
    result = result.replace(/[^\w\sА-Яа-яЁё@.,:;!?\-_()\n/]/g, '');

    setInputText(result);
    showNotification('✓ Text cleaned');
  };

  // REMOVE EMOJIS
  const removeEmojis = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }

    const result = inputText.replace(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ''
    );

    setInputText(result);
    showNotification('✓ Emojis removed');
  };

  // REMOVE PUNCTUATION
  const removePunctuation = () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }

    const result = inputText.replace(/[.,;:!?'"«»()[\]{}<>]/g, '');
    setInputText(result);
    showNotification('✓ Punctuation removed');
  };

  // COPY
  const copyToClipboard = async () => {
    if (!inputText.trim()) {
      showNotification('⚠️ No data');
      return;
    }
    try {
      await navigator.clipboard.writeText(inputText);
      showNotification('✓ Result copied');
    } catch {
      showNotification('❌ Copy failed');
    }
  };

  // CLEAR
  const clearAll = () => {
    setInputText('');
    setPrefix('');
    setSuffix('');
    setLastPostId('');
    setCustomChars('');
    setPipeActive(false);
    showNotification('✓ Form cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-2 sm:p-4">
      {notification && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 font-medium text-sm max-w-xs">
          {notification}
        </div>
      )}

      {showHelp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-xl font-bold text-white">📖 Form manual</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-gray-300 text-sm">
              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">💡 What this tool does</h4>
                <p className="mb-2">
                  Universal form for preparing text and links. Works as an autonomous web-page:
                  just open it in a browser — no logins, no tariffs, no usage limits.
                </p>
                <p className="text-indigo-200 text-xs">
                  Some functions are made specially for MIX-SMM.RU massorder form:
                  <br />
                  • Auto separator <span className="font-mono">|</span> for structuring fields.
                  <br />
                  • t.me post ID generator for links like{' '}
                  <span className="font-mono">t.me/channel/123</span>.
                </p>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">🎯 Prefix / Suffix / Separator</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <b>Prefix</b> — added to the start of each line (for example:{' '}
                    <span className="font-mono">id|</span>).
                  </li>
                  <li>
                    • <b>Suffix</b> — added to the end (for example:{' '}
                    <span className="font-mono">|50</span> or{' '}
                    <span className="font-mono">|100-500</span>).
                  </li>
                  <li>
                    • If suffix contains range <span className="font-mono">100-500</span>, each
                    line gets its own random number from this range.
                  </li>
                  <li>
                    • <b>Separator |</b> button adds pipe to the end of prefix and start of suffix —
                    handy for MIX-SMM.RU form.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">📱 t.me post IDs generation</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm mb-2">
                  <li>Paste link like: t.me/channel/100</li>
                  <li>In "Final post ID" field enter number, e.g. 150</li>
                  <li>Press <b>Post IDs</b></li>
                </ol>
                <p className="text-yellow-300">
                  Result: a list of links from starting ID to final ID (or backwards if final is
                  lower than start).
                </p>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">🔧 Line operations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Shuffle — random order of lines.</li>
                  <li>• Reverse — flips list of lines.</li>
                  <li>• Invert words — reverses words order in each line.</li>
                  <li>• Vertical — arranges words vertically.</li>
                  <li>• Remove duplicates — keeps unique lines only.</li>
                  <li>• Line numbers — adds numbering (1. 2. 3.).</li>
                  <li>• Sort A→Z — alphabetical sort.</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">🧹 Text cleaning</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Remove chars — you set which chars to delete.</li>
                  <li>• Smart clean — removes extra spaces, garbage and empty lines.</li>
                  <li>• Remove emojis — strips all emojis.</li>
                  <li>• Remove punctuation — deletes punctuation symbols.</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">🔗 Links and stats</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Find links — extracts http/https, t.me and @username tokens.</li>
                  <li>
                    • Stats — shows chars, spaces and line count, without modifying text.
                  </li>
                  <li>• Copy — copies current result to clipboard.</li>
                  <li>• Clear — resets the whole form.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-4 text-center relative">
          <div className="inline-block relative">
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight uppercase relative z-10"
              style={{
                background:
                  'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 25px rgba(102, 126, 234, 0.6))'
              }}
            >
              mix-smm.ru
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-3xl opacity-30 -z-10"></div>
          </div>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm">
            Pro text and links preparation for MIX-SMM and other use-cases
          </p>
        </div>

        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
          style={{
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          <div className="px-3 sm:px-4 py-2.5 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900">
            <h2 className="text-white font-bold text-base sm:text-lg">
              Text & links preparation
            </h2>
            <button
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg"
              title="Full manual for all buttons"
            >
              <Info size={16} className="text-white" />
            </button>
          </div>

          <div className="p-3 sm:p-4 space-y-3">
            {/* PREFIX / SUFFIX / ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-gray-300 text-xs font-medium mb-1 block">
                  Prefix (line start)
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. id|"
                  className="w-full px-2.5 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-gray-300 text-xs font-medium mb-1 block">
                  Suffix (line end)
                </label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. |50 or |100-200"
                  className="w-full px-2.5 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-300 text-xs font-medium mb-1 block">
                Data to process (each line is separate item)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste links or text line by line..."
                style={{ height: `${textareaHeight}px` }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
              />
              <div className="absolute top-0 right-0 mt-1 mr-2 flex flex-col gap-1 items-end">
                <div className="bg-indigo-600 bg-opacity-90 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                  {lineCount} lines {emptyLineCount > 0 && `(${emptyLineCount} empty)`}
                </div>
                <div className="bg-purple-600 bg-opacity-90 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                  {charCount} chars
                </div>
              </div>
              <div
                className="absolute bottom-0 right-0 w-6 h-6 cursor-ns-resize flex items-center justify-center text-gray-500 hover:text-indigo-400"
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = textareaHeight;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const newHeight = Math.max(
                      100,
                      Math.min(500, startHeight + (moveEvent.clientY - startY))
                    );
                    setTextareaHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag to resize"
              >
                <ArrowDownUp size={14} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              <button
                onClick={togglePipe}
                className={`px-3 py-2 rounded-lg font-medium text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 ${
                  pipeActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title="Add/remove | separator (handy for MIX-SMM.RU form)"
              >
                {pipeActive ? <Minus size={14} /> : <Plus size={14} />}
                <span>Separator |</span>
              </button>

              <input
                type="number"
                value={lastPostId}
                onChange={(e) => setLastPostId(e.target.value)}
                placeholder="Final t.me post ID (e.g. 150)"
                className="flex-1 px-2.5 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="excludeEmpty"
                checked={excludeEmpty}
                onChange={(e) => setExcludeEmpty(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="excludeEmpty" className="text-gray-300 text-xs">
                Skip empty lines during processing
              </label>
            </div>

            {/* MAIN ACTIONS */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <button
                onClick={processMassorder}
                className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-semibold text-[11px] sm:text-xs transition-all shadow-lg"
                title="Apply prefix and suffix to all lines"
              >
                Prefix / Suffix
              </button>

              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-semibold text-[11px] sm:text-xs transition-all shadow-lg flex items-center justify-center gap-1"
                title="Copy current text"
              >
                <Copy size={14} />
                Copy
              </button>

              <button
                onClick={clearAll}
                className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-semibold text-[11px] sm:text-xs transition-all shadow-lg flex items-center justify-center gap-1"
                title="Clear form"
              >
                <Trash2 size={14} />
                Clear
              </button>

              <button
                onClick={countCharacters}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Show characters and lines stats"
              >
                <Calculator size={14} />
                Stats
              </button>

              <button
                onClick={generatePostIds}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Create t.me links range (for mass orders)"
              >
                <Hash size={14} />
                Post IDs
              </button>

              <button
                onClick={extractLinks}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Extract links and @usernames"
              >
                <Link size={14} />
                Find links
              </button>

              <button
                onClick={shuffleLines}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Random line order"
              >
                <Shuffle size={14} />
                Shuffle
              </button>

              <button
                onClick={reverseLines}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Reverse list from bottom to top"
              >
                <RotateCcw size={14} />
                Reverse
              </button>

              <button
                onClick={invertWords}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Invert word order in each line"
              >
                <Type size={14} />
                Invert words
              </button>

              <button
                onClick={alignToColumns}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Arrange words vertically"
              >
                <Layers size={14} />
                Vertical
              </button>

              <button
                onClick={removeDuplicates}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Keep unique lines only"
              >
                <X size={14} />
                Remove dupes
              </button>

              <button
                onClick={addLineNumbers}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Add line numbering (1., 2., 3.)"
              >
                <ListOrdered size={14} />
                Line numbers
              </button>

              <button
                onClick={sortLines}
                className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Sort lines alphabetically"
              >
                <ArrowUpDown size={14} />
                Sort A→Z
              </button>
            </div>

            {/* CLEAN BLOCK */}
            <div className="space-y-2">
              <button
                onClick={() => setShowCustomChars(!showCustomChars)}
                className="w-full px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                title="Remove custom characters or use smart clean"
              >
                <X size={14} />
                Remove/clean chars
              </button>

              {showCustomChars && (
                <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                  <input
                    type="text"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder="Enter characters to remove (e.g. #*[] )"
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-indigo-500 outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={removeCustomChars}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-xs"
                      title="Remove only selected characters"
                    >
                      Remove selected
                    </button>
                    <button
                      onClick={smartCleanText}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs"
                      title="Smart clean: spaces, garbage and empty lines"
                    >
                      Smart clean
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={removeEmojis}
                  className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                  title="Remove all emojis"
                >
                  <Smile size={14} />
                  Remove emojis
                </button>
                <button
                  onClick={removePunctuation}
                  className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1"
                  title="Remove punctuation marks"
                >
                  <Type size={14} />
                  Remove punctuation
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-gray-500 px-4">
          This form can be used autonomously by any user as a standalone page and can be deployed
          to free hosting (GitHub Pages, Vercel, etc.) for constant online access without limits.
        </p>
      </div>
    </div>
  );
}
