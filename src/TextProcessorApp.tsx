import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Lock,
  Minus,
  Plus,
  RotateCcw,
  Shuffle,
  Smile,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  X
} from 'lucide-react';

type NoticeType = 'success' | 'warning' | 'error' | 'info';

type FeatureHint = {
  key: string;
  title: string;
  description: string;
};

const BRAND_NAME = 'MIX-SMM.RU';

const featureHints: FeatureHint[] = [
  {
    key: 'prefix',
    title: 'Prefix / Suffix',
    description:
      'Добавляет текст в начало и конец каждой строки. В suffix можно указывать диапазон: 100-500.'
  },
  {
    key: 'ids',
    title: 'Post IDs',
    description:
      'Генерирует диапазон t.me ссылок от стартового ID до финального ID, включая границы.'
  },
  {
    key: 'links',
    title: 'Find links',
    description:
      'Вытягивает ссылки и @username из общего текста без ручной фильтрации.'
  },
  {
    key: 'clean',
    title: 'Smart clean',
    description:
      'Нормализует пробелы, убирает мусорные символы и делает текст читаемым.'
  },
  {
    key: 'vertical',
    title: 'Vertical',
    description: 'Перестраивает слова по колонкам для нестандартной подготовки контента.'
  }
];

export default function MixSmmTextProcessor() {
  const [inputText, setInputText] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [lastPostId, setLastPostId] = useState('');
  const [excludeEmpty, setExcludeEmpty] = useState(true);
  const [pipeActive, setPipeActive] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [showCustomChars, setShowCustomChars] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(240);
  const [notification, setNotification] = useState<{ text: string; type: NoticeType } | null>(
    null
  );
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const brandSealRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo(() => {
    const lines = inputText.split('\n');
    const nonEmpty = lines.filter((line) => line.trim());
    return {
      lines: lines.length,
      empty: lines.length - nonEmpty.length,
      chars: inputText.length,
      words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0
    };
  }, [inputText]);

  const showNotice = (text: string, type: NoticeType = 'success') => {
    setNotification({ text, type });
    window.setTimeout(() => setNotification(null), 2600);
  };

  const commitText = (nextText: string) => {
    if (nextText === inputText) return;
    setHistory((prev) => [...prev.slice(-49), inputText]);
    setFuture([]);
    setInputText(nextText);
  };

  const withLines = () => inputText.split('\n');

  const withTextRequired = (callback: () => void) => {
    if (!inputText.trim()) {
      showNotice('Сначала добавьте текст или ссылки для обработки.', 'warning');
      return;
    }
    callback();
  };

  const processMassorder = () => {
    withTextRequired(() => {
      const rangeMatch = suffix.match(/(\d+)\s*-\s*(\d+)/);
      const next = withLines()
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed && excludeEmpty) return null;

          let finalSuffix = suffix;
          if (rangeMatch) {
            const min = Number(rangeMatch[1]);
            const max = Number(rangeMatch[2]);
            if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
              const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
              finalSuffix = suffix.replace(rangeMatch[0], String(randomValue));
            }
          }

          return trimmed ? `${prefix}${trimmed}${finalSuffix}` : '';
        })
        .filter((line): line is string => line !== null)
        .join('\n');

      commitText(next);
      showNotice('Префикс и суффикс применены ко всем строкам.');
    });
  };

  const togglePipe = () => {
    const pipe = '|';

    if (!pipeActive) {
      setPrefix((prev) => `${prev}${pipe}`);
      setSuffix((prev) => `${pipe}${prev}`);
      setPipeActive(true);
      showNotice('Разделитель | включён для формата MIX-SMM.RU.', 'info');
      return;
    }

    setPrefix((prev) => (prev.endsWith(pipe) ? prev.slice(0, -1) : prev));
    setSuffix((prev) => (prev.startsWith(pipe) ? prev.slice(1) : prev));
    setPipeActive(false);
    showNotice('Разделитель | отключён.', 'info');
  };

  const shuffleLines = () => {
    withTextRequired(() => {
      const shuffled = [...withLines()];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      commitText(shuffled.join('\n'));
      showNotice('Порядок строк перемешан.');
    });
  };

  const reverseLines = () => {
    withTextRequired(() => {
      commitText(withLines().reverse().join('\n'));
      showNotice('Порядок строк развёрнут.');
    });
  };

  const invertWords = () => {
    withTextRequired(() => {
      const next = withLines()
        .map((line) => {
          const words = line.trim().split(/\s+/).filter(Boolean);
          if (words.length <= 1) return words.join('');
          return words.reverse().join(' ');
        })
        .join('\n');
      commitText(next);
      showNotice('Слова в каждой строке инвертированы.');
    });
  };

  const alignToColumns = () => {
    withTextRequired(() => {
      const rows = withLines().filter((line) => line.trim());
      const matrix = rows.map((line) => line.split(/\s+/).filter(Boolean));
      const maxColumns = Math.max(...matrix.map((line) => line.length));
      const result: string[] = [];

      for (let col = 0; col < maxColumns; col += 1) {
        for (let row = 0; row < matrix.length; row += 1) {
          if (matrix[row][col]) result.push(matrix[row][col]);
        }
      }

      commitText(result.join('\n'));
      showNotice('Текст перестроен в вертикальный формат.');
    });
  };

  const removeDuplicates = () => {
    withTextRequired(() => {
      const lines = withLines();
      const unique = [...new Set(lines)];
      commitText(unique.join('\n'));
      showNotice(`Удалено дублей: ${lines.length - unique.length}.`);
    });
  };

  const countCharacters = () => {
    withTextRequired(() => {
      const charsNoSpaces = inputText.replace(/\s/g, '').length;
      showNotice(
        `Символы: ${stats.chars} | Без пробелов: ${charsNoSpaces} | Строк: ${stats.lines} | Слов: ${stats.words}`,
        'info'
      );
    });
  };

  const addLineNumbers = () => {
    withTextRequired(() => {
      const next = withLines()
        .map((line, index) => (line.trim() ? `${index + 1}. ${line.trim()}` : ''))
        .join('\n');
      commitText(next);
      showNotice('Нумерация строк добавлена.');
    });
  };

  const sortLines = () => {
    withTextRequired(() => {
      const sorted = withLines()
        .filter((line) => line.trim())
        .sort((a, b) => a.localeCompare(b, 'ru'));
      commitText(sorted.join('\n'));
      showNotice('Строки отсортированы по алфавиту.');
    });
  };

  const generatePostIds = () => {
    const targetId = Number(lastPostId);
    if (!Number.isInteger(targetId) || targetId < 0) {
      showNotice('Введите корректный финальный post ID (целое число).', 'warning');
      return;
    }

    withTextRequired(() => {
      const output: string[] = [];

      withLines().forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const match = trimmed.match(/^(https?:\/\/)?t\.me\/([^/]+)\/(\d+)$/i);
        if (!match) {
          output.push(trimmed);
          return;
        }

        const protocol = match[1] ?? 'https://';
        const channel = match[2];
        const startId = Number(match[3]);
        const step = startId <= targetId ? 1 : -1;

        for (let current = startId; current !== targetId + step; current += step) {
          output.push(`${protocol}t.me/${channel}/${current}`);
        }
      });

      if (!output.length) {
        showNotice('В тексте нет валидных t.me ссылок для генерации.', 'warning');
        return;
      }

      commitText(output.join('\n'));
      showNotice(`Сгенерировано ссылок: ${output.length}.`);
    });
  };

  const extractLinks = () => {
    withTextRequired(() => {
      const tokens = inputText.split(/\s+/).filter(Boolean);
      const found = tokens.filter(
        (token) =>
          /^(https?:\/\/|www\.)/i.test(token) || token.includes('t.me/') || token.startsWith('@')
      );
      const unique = [...new Set(found)];

      if (!unique.length) {
        showNotice('Ссылки или @username не найдены.', 'warning');
        return;
      }

      commitText(unique.join('\n'));
      showNotice(`Найдено уникальных ссылок/username: ${unique.length}.`);
    });
  };

  const removeCustomChars = () => {
    withTextRequired(() => {
      if (!customChars) {
        showNotice('Введите символы для удаления.', 'warning');
        return;
      }

      let result = inputText;
      for (const character of customChars) {
        result = result.split(character).join('');
      }

      commitText(result);
      setCustomChars('');
      setShowCustomChars(false);
      showNotice('Выбранные символы удалены.');
    });
  };

  const smartCleanText = () => {
    withTextRequired(() => {
      const next = inputText
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter((line) => line.length > 0)
        .join('\n')
        .replace(/[^\w\sА-Яа-яЁё@.,:;!?\-_/()\n]/g, '');

      commitText(next);
      showNotice('Выполнена умная очистка текста.');
    });
  };

  const removeEmojis = () => {
    withTextRequired(() => {
      const next = inputText.replace(
        /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{FE0F}]/gu,
        ''
      );
      commitText(next);
      showNotice('Эмодзи удалены.');
    });
  };

  const removePunctuation = () => {
    withTextRequired(() => {
      const next = inputText.replace(/[.,;:!?"'«»()[\]{}<>]/g, '');
      commitText(next);
      showNotice('Пунктуация удалена.');
    });
  };

  const copyToClipboard = async () => {
    withTextRequired(async () => {
      try {
        await navigator.clipboard.writeText(inputText);
        showNotice('Текст скопирован в буфер обмена.');
      } catch {
        showNotice('Не удалось скопировать текст. Проверьте доступ к буферу.', 'error');
      }
    });
  };

  const clearAll = () => {
    commitText('');
    setPrefix('');
    setSuffix('');
    setLastPostId('');
    setCustomChars('');
    setPipeActive(false);
    showNotice('Форма очищена.', 'info');
  };

  const undo = () => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [inputText, ...prev.slice(0, 49)]);
    setInputText(previous);
    showNotice('Отмена последнего действия.', 'info');
  };

  const redo = () => {
    if (!future.length) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setHistory((prev) => [...prev.slice(-49), inputText]);
    setInputText(next);
    showNotice('Повтор последнего действия.', 'info');
  };

  useEffect(() => {
    const brandNode = brandSealRef.current;
    if (!brandNode) return;

    const observer = new MutationObserver(() => {
      if (!document.body.contains(brandNode)) {
        document.body.appendChild(brandNode);
      }
      brandNode.style.display = 'flex';
      brandNode.style.opacity = '1';
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const notificationClass =
    notification?.type === 'error'
      ? 'from-red-500/90 to-rose-500/90'
      : notification?.type === 'warning'
        ? 'from-amber-400/90 to-orange-500/90'
        : notification?.type === 'info'
          ? 'from-sky-500/90 to-indigo-500/90'
          : 'from-emerald-500/90 to-teal-500/90';

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 p-3 sm:p-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(34,197,94,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.15),_transparent_30%)]" />

      {notification && (
        <div className={`fixed right-4 top-4 z-50 rounded-2xl border border-white/20 bg-gradient-to-r ${notificationClass} px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(0,0,0,0.35)] backdrop-blur-xl`}>
          {notification.text}
        </div>
      )}

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-5 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_60px_rgba(3,8,30,0.6)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-300/35 bg-indigo-500/20 px-3 py-1 text-xs font-bold tracking-wide text-indigo-100">
                <Sparkles size={14} />
                БРЕНДИРОВАННЫЙ ИНСТРУМЕНТ {BRAND_NAME}
              </p>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
                MIX SMM Text Tools — Glass Edition
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Максимально удобная подготовка текстов, ссылок и массовых данных в современном интерфейсе.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!history.length}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                title="Отменить"
              >
                <Undo2 size={14} className="inline" /> Undo
              </button>
              <button
                onClick={redo}
                disabled={!future.length}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                title="Повторить"
              >
                <RotateCcw size={14} className="inline" /> Redo
              </button>
              <button
                onClick={() => setShowHelp((prev) => !prev)}
                className="rounded-xl border border-white/20 bg-indigo-500/35 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500/55"
              >
                <Info size={14} className="inline" /> Помощь
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-4 lg:grid-cols-[1fr_310px]">
          <section className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-[0_20px_60px_rgba(3,8,30,0.6)] backdrop-blur-2xl">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-200">
                Prefix
                <input
                  type="text"
                  value={prefix}
                  onChange={(event) => setPrefix(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm outline-none ring-indigo-400/60 transition focus:ring"
                  placeholder="Например: id|"
                />
              </label>
              <label className="text-xs text-slate-200">
                Suffix
                <input
                  type="text"
                  value={suffix}
                  onChange={(event) => setSuffix(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm outline-none ring-indigo-400/60 transition focus:ring"
                  placeholder="Например: |50 или |100-500"
                />
              </label>
            </div>

            <div className="mt-3 relative">
              <textarea
                ref={textAreaRef}
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                style={{ height: textareaHeight }}
                className="w-full rounded-2xl border border-white/20 bg-black/35 px-3 py-3 font-mono text-sm text-white outline-none ring-indigo-400/60 transition focus:ring"
                placeholder="Вставьте текст, ссылки или ID (каждая строка отдельно)..."
              />
              <div className="absolute right-3 top-3 grid gap-1 text-[11px]">
                <span className="rounded-full border border-white/20 bg-indigo-500/40 px-2 py-1">{stats.lines} строк</span>
                <span className="rounded-full border border-white/20 bg-cyan-500/35 px-2 py-1">{stats.chars} символов</span>
              </div>
              <button
                className="absolute bottom-2 right-2 rounded-lg border border-white/20 bg-black/35 p-1 text-slate-200 hover:bg-black/55"
                onMouseDown={(event) => {
                  event.preventDefault();
                  const startY = event.clientY;
                  const startHeight = textareaHeight;

                  const onMouseMove = (moveEvent: MouseEvent) => {
                    const newHeight = Math.max(130, Math.min(560, startHeight + (moveEvent.clientY - startY)));
                    setTextareaHeight(newHeight);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                  };

                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
              >
                <ArrowDownUp size={16} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={togglePipe} className={`rounded-xl px-3 py-2 text-xs font-semibold ${pipeActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-100 hover:bg-white/20'} border border-white/20`}>
                {pipeActive ? <Minus size={14} className="inline" /> : <Plus size={14} className="inline" />} Separator |
              </button>
              <input
                type="number"
                value={lastPostId}
                onChange={(event) => setLastPostId(event.target.value)}
                className="min-w-[220px] flex-1 rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm outline-none ring-indigo-400/60 transition focus:ring"
                placeholder="Финальный t.me post ID"
              />
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={excludeEmpty}
                  onChange={(event) => setExcludeEmpty(event.target.checked)}
                  className="h-4 w-4"
                />
                Пропускать пустые строки
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {[
                ['Prefix / Suffix', processMassorder, null],
                ['Copy', copyToClipboard, <Copy size={14} />],
                ['Clear', clearAll, <Trash2 size={14} />],
                ['Stats', countCharacters, <Calculator size={14} />],
                ['Post IDs', generatePostIds, <Hash size={14} />],
                ['Find links', extractLinks, <Link size={14} />],
                ['Shuffle', shuffleLines, <Shuffle size={14} />],
                ['Reverse', reverseLines, <RotateCcw size={14} />],
                ['Invert words', invertWords, <Type size={14} />],
                ['Vertical', alignToColumns, <Layers size={14} />],
                ['Remove dupes', removeDuplicates, <X size={14} />],
                ['Line numbers', addLineNumbers, <ListOrdered size={14} />],
                ['Sort A→Z', sortLines, <ArrowUpDown size={14} />],
                ['Remove emojis', removeEmojis, <Smile size={14} />],
                ['Punctuation', removePunctuation, <Type size={14} />]
              ].map(([label, handler, icon]) => (
                <button
                  key={String(label)}
                  onClick={handler as () => void}
                  className="rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  <span className="inline-flex items-center gap-1">{icon}{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-3">
              <button
                onClick={() => setShowCustomChars((prev) => !prev)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Символьная очистка / Smart clean
              </button>

              {showCustomChars && (
                <div className="mt-2 grid gap-2 rounded-2xl border border-white/20 bg-black/30 p-3">
                  <input
                    value={customChars}
                    onChange={(event) => setCustomChars(event.target.value)}
                    placeholder="Какие символы удалить, например: #*[]"
                    className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm outline-none ring-indigo-400/60 transition focus:ring"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={removeCustomChars} className="rounded-xl bg-rose-500/85 px-3 py-2 text-xs font-bold text-white hover:bg-rose-500">
                      Remove selected
                    </button>
                    <button onClick={smartCleanText} className="rounded-xl bg-sky-500/85 px-3 py-2 text-xs font-bold text-white hover:bg-sky-500">
                      Smart clean
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-2xl">
              <h2 className="mb-2 text-sm font-black text-white">Понятная инструкция по функциям</h2>
              <ul className="space-y-2">
                {featureHints.map((hint) => (
                  <li key={hint.key} className="rounded-xl border border-white/15 bg-black/25 p-3">
                    <p className="text-xs font-bold text-indigo-200">{hint.title}</p>
                    <p className="text-xs text-slate-300">{hint.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-indigo-200/35 bg-indigo-500/20 p-4 backdrop-blur-2xl">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black text-indigo-100">
                <Lock size={14} /> Защита брендирования
              </p>
              <p className="text-xs text-slate-100">
                Брендовый блок {BRAND_NAME} закреплён и автоматически восстанавливается при попытке удалить элементы интерфейса.
              </p>
            </div>

            {showHelp && (
              <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-2xl">
                <h3 className="text-sm font-black text-white">Быстрые подсказки</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Сначала вставьте список строк, затем применяйте пакетные операции.</li>
                  <li>Для MIX-SMM форм нажмите Separator | — это ускоряет разметку.</li>
                  <li>Если результат не понравился, используйте Undo/Redo.</li>
                  <li>Smart clean удобно запускать перед экспортом.</li>
                </ul>
              </div>
            )}
          </aside>
        </main>
      </div>

      <div
        ref={brandSealRef}
        className="fixed bottom-3 left-3 z-40 flex items-center gap-2 rounded-xl border border-white/25 bg-black/45 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-cyan-100 backdrop-blur-xl"
      >
        <Lock size={12} /> Powered by {BRAND_NAME}
      </div>
    </div>
  );
}
