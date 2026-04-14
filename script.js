const CONFIG = { typingTime: 60, quizTime: 60, totalLevels: 10 };

// 100 СУРОО (Үлгү иретинде 30у жазылды, калганын ушул форматта кошосуз)
const QUIZ_DATABASE = {
    1: [
        { q: "Кыргызстандын борбору?", a: "Бишкек", o: ["Ош", "Бишкек", "Нарын", "Талас"] },
        { q: "Манастын атасы ким?", a: "Жакып", o: ["Бакай", "Жакып", "Кошой", "Абыке"] },
        { q: "Эң чоң көл?", a: "Ысык-Көл", o: ["Соң-Көл", "Ысык-Көл", "Сары-Челек", "Чатыр-Көл"] },
        { q: "Улуттук акча бирдиги?", a: "Сом", o: ["Сом", "Тенге", "Рубль", "Доллар"] },
        { q: "Туу качан кабыл алынган?", a: "1992", o: ["1991", "1992", "1993", "1994"] },
        { q: "Канча область бар?", a: "7", o: ["5", "6", "7", "8"] },
        { q: "Ак калпак күнү?", a: "5-март", o: ["1-март", "5-март", "21-март", "31-август"] },
        { q: "Мамлекеттик тил күнү?", a: "23-сентябрь", o: ["31-август", "23-сентябрь", "5-май", "7-ноябрь"] },
        { q: "Эң бийик чоку?", a: "Жеңиш чокусу", o: ["Ленин", "Жеңиш чокусу", "Хан-Тенгри", "Манас"] },
        { q: "Бишкектин мурунку аты?", a: "Фрунзе", o: ["Пишпек", "Фрунзе", "Ош", "Алматы"] }
    ],
    2: [
        { q: "Эң узун дарыя?", a: "Нарын", o: ["Чүй", "Нарын", "Талас", "Ак-Буура"] },
        { q: "Экинчи чоң көл?", a: "Соң-Көл", o: ["Чатыр-Көл", "Соң-Көл", "Сары-Челек", "Ысык-Көл"] },
        { q: "Герб качан кабыл алынган?", a: "1994", o: ["1992", "1994", "1991", "1995"] },
        { q: "Сулайман-Тоо кайсы шаарда?", a: "Ош", o: ["Ош", "Жалал-Абад", "Баткен", "Нарын"] },
        { q: "Эң кичине область?", a: "Талас", o: ["Баткен", "Ош", "Талас", "Чүй"] },
        { q: "Дүйнөдөгү эң чоң жаңгак токою?", a: "Арстанбап", o: ["Арстанбап", "Сары-Челек", "Ала-Арча", "Ат-Башы"] },
        { q: "Кыргызстан БУУга качан кирген?", a: "1992", o: ["1991", "1992", "1993", "1995"] },
        { q: "Биринчи президент ким?", a: "А. Акаев", o: ["К. Бакиев", "А. Акаев", "Р. Отунбаева", "С. Жапаров"] },
        { q: "Кыргызстандын аянты канча?", a: "199 900 км²", o: ["150 000 км²", "199 900 км²", "250 000 км²", "191 000 км²"] },
        { q: "Комуздун канча кылы бар?", a: "3", o: ["2", "3", "4", "5"] }
    ]
    // 3-10 деңгээлдерди ушул сыяктуу толтурасыз...
};

const TYPING_TEXTS = {
    1: "Кыргызстан - Борбордук Азиядагы эң кооз өлкө.",
    2: "Манас эпосу кыргыз элинин эң чоң маданий мурасы жана баатырдык тарыхы.",
    3: "Ысык-Көл дүйнөдөгү эң терең тоо көлдөрүнүн бири болуп саналат.",
    10: "Келечекте Кыргызстан IT тармагында дүйнөлүк деңгээлге чыккан күчтүү өлкө болот."
};

let score = 0, level = 1, timer, activeGame = "";

// 1. LOADING
window.onload = () => {
    let p = 0;
    const bar = document.getElementById('progress-inner');
    const interval = setInterval(() => {
        p += 2;
        bar.style.width = p + "%";
        document.getElementById('loading-status').innerText = `Система жүктөлүүдө... ${p}%`;
        if (p >= 100) {
            clearInterval(interval);
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }
    }, 50);
};

// 2. LOGIN
function enterGame() {
    const name = document.getElementById('player-name').value;
    if (!name) return alert("Атыңызды жазыңыз!");
    document.getElementById('user-display').innerText = "Оюнчу: " + name;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

// 3. CORE LOGIC
function startApp(id) {
    activeGame = id; level = 1;
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('arena').classList.remove('hidden');
    initLevel();
}

function initLevel() {
    clearInterval(timer);
    const content = document.getElementById('game-content');
    content.innerHTML = "";
    document.getElementById('level-display').innerText = `Level: ${level}/10`;
    if (activeGame === 'typing') startTyping(content);
    else startQuiz(content);
}

function startTimer(sec) {
    clearInterval(timer);
    document.getElementById('timer-display').innerText = `Убакыт: ${sec}`;
    timer = setInterval(() => {
        sec--;
        document.getElementById('timer-display').innerText = `Убакыт: ${sec}`;
        if (sec <= 0) { clearInterval(timer); alert(`Убакыт бүттү! Level ${level} кайра!`); initLevel(); }
    }, 1000);
}

function startQuiz(arena) {
    let questions = [...(QUIZ_DATABASE[level] || QUIZ_DATABASE[1])];
    let qIdx = 0;
    const nextQ = () => {
        if (qIdx >= 10) { win(); return; }
        let curr = questions[qIdx];
        arena.innerHTML = `<h3>Суроо ${qIdx+1}/10</h3><p style="font-size:1.4rem">${curr.q}</p><div id="opts"></div>`;
        curr.o.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.onclick = () => { if(opt === curr.a) { qIdx++; nextQ(); } else { clearInterval(timer); alert(`Ката! Level ${level} кайра!`); initLevel(); } };
            document.getElementById('opts').appendChild(btn);
        });
    };
    nextQ();
    startTimer(CONFIG.quizTime);
}

function startTyping(arena) {
    let target = TYPING_TEXTS[level] || TYPING_TEXTS[1];
    arena.innerHTML = `<h3>Жазыңыз:</h3><div style="background:#111; padding:20px; margin-bottom:15px; border-radius:10px">${target}</div>
    <textarea id="t-in" autofocus></textarea>`;
    startTimer(CONFIG.typingTime);
    document.getElementById('t-in').oninput = (e) => { if(e.target.value.trim() === target) win(); };
}

function win() {
    clearInterval(timer); score += 100;
    document.getElementById('total-score').innerText = score;
    if (level < 10) { level++; alert(`Level ${level} башталды!`); initLevel(); }
    else { alert("КУТТУКТАЙБЫЗ! Сиз жеңдиңиз!"); toMenu(); }
}

function toMenu() { clearInterval(timer); document.getElementById('arena').classList.add('hidden'); document.getElementById('main-menu').classList.remove('hidden'); }
