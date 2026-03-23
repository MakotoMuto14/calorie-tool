// ===== よく使う食品データ =====
const QUICK_FOODS = [
  { name: 'ご飯（150g）', kcal: 252, p: 3.8, f: 0.5, c: 55.7 },
  { name: '食パン1枚', kcal: 158, p: 5.6, f: 2.5, c: 28.0 },
  { name: '鶏むね肉（100g）', kcal: 116, p: 23.3, f: 1.9, c: 0 },
  { name: '卵1個', kcal: 76, p: 6.2, f: 5.2, c: 0.1 },
  { name: '牛乳（200ml）', kcal: 134, p: 6.6, f: 7.6, c: 9.6 },
  { name: 'バナナ1本', kcal: 86, p: 1.1, f: 0.2, c: 22.5 },
  { name: 'ラーメン1杯', kcal: 472, p: 17.0, f: 15.0, c: 65.0 },
  { name: 'おにぎり1個', kcal: 177, p: 3.1, f: 0.5, c: 38.5 },
  { name: 'サラダチキン', kcal: 114, p: 24.0, f: 1.6, c: 0 },
  { name: '納豆1パック', kcal: 100, p: 8.3, f: 5.0, c: 5.4 },
  { name: 'コーヒー（無糖）', kcal: 4, p: 0.2, f: 0, c: 0.7 },
  { name: '緑茶', kcal: 2, p: 0.2, f: 0, c: 0.3 },
];

// ===== 状態管理 =====
let currentDate = todayKey();
let profile = null;
let logs = {}; // { 'YYYY-MM-DD': [{ id, name, kcal, p, f, c, timing }] }

// ===== 初期化 =====
window.onload = () => {
  loadData();
  renderQuickFoods();

  profile = getProfile();
  if (profile) {
    showScreen('screen-main');
    renderMain();
  } else {
    showScreen('screen-profile');
  }
};

// ===== ローカルストレージ =====
function getProfile() {
  const d = localStorage.getItem('ct_profile');
  return d ? JSON.parse(d) : null;
}
function saveProfileData(p) {
  localStorage.setItem('ct_profile', JSON.stringify(p));
}
function loadData() {
  const d = localStorage.getItem('ct_logs');
  logs = d ? JSON.parse(d) : {};
}
function saveLogs() {
  localStorage.setItem('ct_logs', JSON.stringify(logs));
}

// ===== 画面遷移 =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-main') renderMain();
  if (id === 'screen-profile') fillProfileForm();
}

// ===== 日付 =====
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function formatDateDisplay(key) {
  const d = new Date(key + 'T00:00:00');
  const today = todayKey();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);

  const label = key === today ? '今日' : key === yKey ? '昨日' : '';
  const str = `${d.getMonth() + 1}月${d.getDate()}日（${'日月火水木金土'[d.getDay()]}）`;
  return label ? `${str}　${label}` : str;
}
function changeDate(delta) {
  const d = new Date(currentDate + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  const next = d.toISOString().slice(0, 10);
  // 未来は今日まで
  if (next > todayKey()) return;
  currentDate = next;
  renderMain();
}

// ===== プロフィール =====
function fillProfileForm() {
  const p = getProfile();
  if (!p) return;
  document.querySelector(`input[name="gender"][value="${p.gender}"]`).checked = true;
  document.getElementById('age').value = p.age;
  document.getElementById('height').value = p.height;
  document.getElementById('weight').value = p.weight;
  document.getElementById('target-weight').value = p.targetWeight;
  document.getElementById('activity').value = p.activity;
  document.getElementById('loss-speed').value = p.lossSpeed;
}

function saveProfile() {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = +document.getElementById('age').value;
  const height = +document.getElementById('height').value;
  const weight = +document.getElementById('weight').value;
  const targetWeight = +document.getElementById('target-weight').value;
  const activity = +document.getElementById('activity').value;
  const lossSpeed = +document.getElementById('loss-speed').value;

  if (!age || !height || !weight || !targetWeight) {
    alert('全ての項目を入力してください');
    return;
  }
  if (targetWeight >= weight) {
    alert('目標体重は現在の体重より低く設定してください');
    return;
  }

  const p = { gender, age, height, weight, targetWeight, activity, lossSpeed };
  saveProfileData(p);
  profile = p;
  showScreen('screen-main');
}

// ===== カロリー計算 =====
function calcBMR(p) {
  // Mifflin-St Jeor式
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return p.gender === 'male' ? base + 5 : base - 161;
}
function calcTargetKcal(p) {
  const tdee = calcBMR(p) * p.activity;
  return Math.round(tdee - p.lossSpeed);
}

// ===== メイン画面レンダリング =====
function renderMain() {
  if (!profile) return;

  // 日付表示
  document.getElementById('display-date').textContent = formatDateDisplay(currentDate);

  const targetKcal = calcTargetKcal(profile);
  const meals = logs[currentDate] || [];

  const consumed = meals.reduce((s, m) => s + m.kcal, 0);
  const remaining = targetKcal - consumed;
  const totalP = meals.reduce((s, m) => s + (m.p || 0), 0);
  const totalF = meals.reduce((s, m) => s + (m.f || 0), 0);
  const totalC = meals.reduce((s, m) => s + (m.c || 0), 0);

  // カロリー表示
  document.getElementById('stat-target').textContent = `${targetKcal} kcal`;
  document.getElementById('stat-consumed').textContent = `${consumed} kcal`;
  document.getElementById('stat-remaining').textContent = `${Math.abs(remaining)} kcal`;
  document.getElementById('remaining-kcal').textContent = remaining >= 0 ? remaining : `-${Math.abs(remaining)}`;

  // リング
  const pct = Math.min(consumed / targetKcal, 1);
  const circumference = 314;
  const ring = document.getElementById('ring-fill');
  ring.style.strokeDashoffset = circumference - pct * circumference;
  ring.style.stroke = remaining < 0 ? '#F44336' : remaining < targetKcal * 0.1 ? '#FF9800' : '#4CAF50';

  // メッセージ
  const msgEl = document.getElementById('calorie-message');
  msgEl.className = 'calorie-message';
  if (remaining < 0) {
    msgEl.textContent = `⚠️ ${Math.abs(remaining)} kcal オーバーです。明日は少し控えめにしましょう！`;
    msgEl.classList.add('over');
  } else if (remaining < 200) {
    msgEl.textContent = `🔶 残り ${remaining} kcal です。間食は控えた方がいいかも。`;
    msgEl.classList.add('warn');
  } else {
    msgEl.textContent = `✅ 残り ${remaining} kcal 食べられます。いい調子です！`;
    msgEl.classList.add('ok');
  }

  // PFCバー（目標値に対する割合）
  const targetP = Math.round(profile.weight * 1.5); // 体重×1.5g
  const targetF = Math.round(targetKcal * 0.25 / 9);
  const targetC = Math.round((targetKcal - targetP * 4 - targetF * 9) / 4);

  document.getElementById('val-p').textContent = `${Math.round(totalP)}g`;
  document.getElementById('val-f').textContent = `${Math.round(totalF)}g`;
  document.getElementById('val-c').textContent = `${Math.round(totalC)}g`;
  document.getElementById('bar-p').style.width = `${Math.min(totalP / targetP * 100, 100)}%`;
  document.getElementById('bar-f').style.width = `${Math.min(totalF / targetF * 100, 100)}%`;
  document.getElementById('bar-c').style.width = `${Math.min(totalC / targetC * 100, 100)}%`;

  // 目標まで
  const diff = profile.weight - profile.targetWeight;
  const totalKcalNeeded = diff * 7200;
  const dailyDeficit = profile.lossSpeed;
  const days = Math.ceil(totalKcalNeeded / dailyDeficit);
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + days);
  const gm = goalDate.getMonth() + 1;
  const gd = goalDate.getDate();

  document.getElementById('goal-diff').textContent = `${diff.toFixed(1)} kg`;
  document.getElementById('goal-days').textContent = `${days} 日`;
  document.getElementById('goal-date').textContent = `${gm}/${gd}`;

  // 食事リスト
  renderMealList(meals);
}

function renderMealList(meals) {
  const el = document.getElementById('meal-list');
  if (meals.length === 0) {
    el.innerHTML = '<p class="no-meal">まだ食事が登録されていません</p>';
    return;
  }
  el.innerHTML = meals.map((m, i) => `
    <div class="meal-item">
      <div class="meal-info">
        <div class="meal-name-text">
          ${m.name}
          <span class="meal-timing-badge">${m.timing}</span>
        </div>
        <div class="meal-pfc">P: ${m.p || 0}g ／ F: ${m.f || 0}g ／ C: ${m.c || 0}g</div>
      </div>
      <div class="meal-kcal">${m.kcal} kcal</div>
      <button class="meal-delete" onclick="deleteMeal(${i})">✕</button>
    </div>
  `).join('');
}

// ===== 食事追加 =====
function renderQuickFoods() {
  const grid = document.getElementById('quick-grid');
  grid.innerHTML = QUICK_FOODS.map((f, i) => `
    <button class="quick-btn" onclick="fillQuickFood(${i})">${f.name}</button>
  `).join('');
}

function fillQuickFood(i) {
  const f = QUICK_FOODS[i];
  document.getElementById('meal-name').value = f.name;
  document.getElementById('meal-kcal').value = f.kcal;
  document.getElementById('meal-p').value = f.p;
  document.getElementById('meal-f').value = f.f;
  document.getElementById('meal-c').value = f.c;
}

function addMeal() {
  const name = document.getElementById('meal-name').value.trim();
  const kcal = +document.getElementById('meal-kcal').value;
  const p = +document.getElementById('meal-p').value || 0;
  const f = +document.getElementById('meal-f').value || 0;
  const c = +document.getElementById('meal-c').value || 0;
  const timing = document.getElementById('meal-timing').value;

  if (!name || !kcal) {
    alert('食事名とカロリーを入力してください');
    return;
  }

  if (!logs[currentDate]) logs[currentDate] = [];
  logs[currentDate].push({ id: Date.now(), name, kcal, p, f, c, timing });
  saveLogs();

  // フォームリセット
  ['meal-name', 'meal-kcal', 'meal-p', 'meal-f', 'meal-c'].forEach(id => {
    document.getElementById(id).value = '';
  });

  showScreen('screen-main');
}

function deleteMeal(index) {
  if (!confirm('この食事を削除しますか？')) return;
  logs[currentDate].splice(index, 1);
  saveLogs();
  renderMain();
}
