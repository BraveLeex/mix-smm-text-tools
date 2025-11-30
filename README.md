<p align="center">
  <img src="./logo-mix-smm-ru-steel.png" alt="MIX-SMM.RU logo" width="420">
</p>

<h1 align="center">MIX-SMM TEXT TOOLS</h1>

<p align="center">
  Набор премиальных веб-инструментов для быстрой подготовки текстов, списков и ссылок
  под массовые SMM-заказы и повседневную работу с контентом.
</p>

<p align="center">
  <sub>Built with Vite · React · TypeScript · Tailwind CSS</sub>
</p>

---

## 🇷🇺 О проекте

**MIX-SMM TEXT TOOLS** — это одностраничное приложение (SPA), которое запускается локально или на Vercel
и помогает за секунды приводить в порядок большие списки текстов:

- готовить строки под массовые заказы на MIX-SMM.RU;
- чистить «грязные» списки от мусора, эмодзи и лишних пробелов;
- работать со списками ссылок и @логинов;
- быстро нумеровать, сортировать, перемешивать и инвертировать строки.

Вся логика собрана в одном компоненте `src/TextProcessorApp.tsx`,
проект не зависит от серверной части и работает полностью в браузере.

---

## ✨ Основные возможности

Кратко по ключевым инструментам интерфейса:

- **Smart clean** — умная очистка текста: обрезка лишних пробелов, удаление «пустых» строк и мусора.
- **Очистка по символам**:
  - удалить только выбранные символы;
  - удалить эмодзи;
  - удалить знаки пунктуации.
- **Работа со строками**:
  - сортировка строк A→Z;
  - случайное перемешивание (random shuffle);
  - реверс списка снизу вверх;
  - удаление дублей (оставить только уникальные строки).
- **Преобразование структуры**:
  - добавить нумерацию строк (`1.`, `2.`, `3.` …);
  - инвертировать порядок слов в каждой строке;
  - разложить слова вертикально (по одному в строке).
- **Префиксы и суффиксы**:
  - массовое добавление префикса/суффикса к каждой строке;
  - специальный режим **pipe-сепаратора `|`** — удобен для форм MIX-SMM.RU.
- **Ссылки и Telegram**:
  - извлечение ссылок и `@username` из сырого текста;
  - конструктор диапазона `t.me` ссылок по ID для массовых заказов.
- **Статистика и сервис**:
  - счётчик символов и строк;
  - копирование результата одной кнопкой;
  - отдельная кнопка очистки формы.

Полное текстовое описание всех кнопок доступно прямо в интерфейсе («Full manual for all buttons»).

---

## 🧩 Стек

- **Frontend:** React + TypeScript
- **Сборка:** Vite
- **Стили:** Tailwind CSS
- **Инфраструктура:** Git + Vercel (опционально)

---

## 🚀 Быстрый старт (Windows, русская версия)

> Для максимально простого запуска в архив уже включён скрипт **`RUN_ME_FIRST.bat`**.

### 1. Подготовка окружения

1. Установите **Node.js** (LTS) с официального сайта: https://nodejs.org/
2. Установите **Git for Windows**: https://git-scm.com/

Проверьте, что всё установилось правильно:

```bash
node -v
npm -v
git --version
```

### 2. Распаковка проекта

Рекомендуемый путь (пример):

```text
C:\Users\ВАШЕ_ИМЯ\Desktop\Projects\mix-smm-text-tools
```

1. Создайте папку `Projects` (или любую другую).
2. Распакуйте архив проекта в эту папку.
3. Убедитесь, что внутри лежат файлы: `package.json`, `src/`, `vite.config.ts`, `RUN_ME_FIRST.bat` и т.д.

### 3. Автонастройка и публикация на GitHub

1. Зайдите в браузере на GitHub и создайте **пустой репозиторий**  
   (без README/LICENCE/`.gitignore` — это важно).
2. Скопируйте **HTTPS URL** репозитория, например:

```text
https://github.com/USERNAME/mix-smm-text-tools.git
```

3. В проводнике Windows дважды кликните по `RUN_ME_FIRST.bat`.

Скрипт выполнит:

- `npm install`
- `npm run build`
- `git init`
- первый коммит
- попросит вставить URL репозитория и сделает `git push -u origin main`

После успешного выполнения проект окажется в вашем GitHub-репозитории.

### 4. Локальный запуск dev-сервера

Для запуска режима разработки:

```bash
npm run dev
```

По умолчанию Vite поднимет сервер на:

```text
http://localhost:5173
```

---

## 🌐 Деплой на Vercel (опционально)

1. Зайдите на https://vercel.com и авторизуйтесь через GitHub.
2. Нажмите **Add New Project → Import Git Repository**.
3. Выберите репозиторий с проектом `mix-smm-text-tools`.
4. В настройках укажите:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Нажмите **Deploy**.

Через несколько минут вы получите постоянный URL вида:

```text
https://mix-smm-text-tools-yourname.vercel.app
```

Эту ссылку можно использовать как отдельный сервис или встроить в экосистему MIX-SMM.RU.

---

## 🇬🇧 Short overview (English)

**MIX-SMM TEXT TOOLS** is a small React + Vite single-page app designed for
fast text preprocessing and list manipulation for SMM tasks.

Key features:

- smart text cleaning (spaces, garbage, empty lines);
- remove custom characters, emojis and punctuation;
- sort / shuffle / reverse lines, keep uniques only;
- add line numbering, invert word order, arrange words vertically;
- apply prefix and suffix to every line (with a handy `|` pipe mode for MIX-SMM.RU forms);
- extract links and `@usernames` from raw text;
- create ranges of `t.me` links for mass orders;
- copy result and view basic characters/lines statistics.

### Quick start

```bash
npm install
npm run dev
# open http://localhost:5173
```

To build production bundle:

```bash
npm run build
```

You can easily deploy the `dist` folder to any static hosting or use Vercel
(Vite preset, `npm run build`, output directory `dist`).

---

## 📂 Структура проекта

```text
.
├─ src/
│  ├─ TextProcessorApp.tsx   # основной React-компонент, вся логика инструментов
│  ├─ main.tsx               # точка входа ReactDOM
│  └─ index.css              # Tailwind + базовые стили
├─ public/                    # (опционально) статика, если понадобится
├─ logo-mix-smm-ru-steel.png  # основной логотип для README/GitHub
├─ branding/
│  └─ mix-smm-text-tools-blue-pack.png  # дополнительный набор бренд-ассетов
├─ package.json
├─ vite.config.ts
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ tsconfig*.json
├─ RUN_ME_FIRST.bat           # авто-скрипт для npm install, build и git push
└─ README_RU.txt              # краткая русская справка
```

---

## 🔐 Безопасность и приватность

- В репозитории **нет** жёстко прописанных персональных данных
  (логинов Windows, реальных путей к рабочему столу и т.п.) —
  в README используются только шаблонные примеры вида  
  `C:\Users\ВАШЕ_ИМЯ\Desktop\Projects\mix-smm-text-tools`.
- Проект не содержит серверной части и не отправляет данные на внешний backend.
- Вся обработка текста выполняется **на стороне браузера пользователя**.

---

## 📜 Лицензия

Вы можете использовать и дорабатывать этот проект для своих задач.
Если будете указывать ссылку на MIX-SMM.RU как на исходный источник — это будет приятно, но не обязательно.

---

Если у вас есть идеи по улучшению интерфейса или новых текстовых инструментов —
смело форкайте репозиторий и отправляйте Pull Request.
