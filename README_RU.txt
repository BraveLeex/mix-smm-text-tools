MIX-SMM TEXT TOOLS — ГОТОВЫЙ ПРОЕКТ (v2 без регулярок)

Эта версия проекта собрана без RegExp в критичных местах (t.me ID и поиск ссылок),
чтобы исключить любые проблемы со сборкой на Windows и Vite/esbuild.

Что внутри:
  - index.html
  - package.json
  - Vite-конфиг, Tailwind-конфиг
  - src/TextProcessorApp.tsx — основной компонент формы (вся логика)
  - RUN_ME_FIRST.bat — английский авто-скрипт:
      * npm install
      * npm run build
      * git init / git commit
      * запросит URL репозитория GitHub и сделает git push

Краткие шаги:
  1) Установите Node.js и Git (если ещё не стоят).
  2) Распакуйте архив в папку, например:
       C:\Users\ВАШЕ_ИМЯ\Desktop\Projects\mix-smm-text-tools
  3) Создайте репозиторий на GitHub и скопируйте его HTTPS-URL.
  4) Двойной клик по RUN_ME_FIRST.bat, вставьте URL, нажмите Enter.
  5) Для локального запуска:
       npm run dev
     и открываем http://localhost:5173
