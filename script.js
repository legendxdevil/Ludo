// Screen references
const splashScreen = document.getElementById('splash-screen');
const gameSelection = document.getElementById('game-selection');
const playerSetup = document.getElementById('player-setup');
const gameBoard = document.getElementById('game-board');

// Splash -> Game Selection
const continueBtn = document.getElementById('continue-btn');
continueBtn.addEventListener('click', () => {
  splashScreen.classList.remove('active');
  gameSelection.classList.add('active');
});

// Game Selection -> Player Setup
const ludoOption = document.getElementById('ludo-option');
const snakeOption = document.getElementById('snake-option');

function renderPlayerSetupForm(selectedGame) {
  playerSetup.innerHTML = `
    <form class="player-setup-form">
      <h2>Player Setup - ${selectedGame}</h2>
      <label for="player-count">Kitne player khelenge?</label>
      <select id="player-count">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <div class="player-inputs" id="player-inputs"></div>
      <div class="form-actions">
        <button type="button" id="back-to-selection">Back</button>
        <button type="submit" id="play-btn">Play</button>
      </div>
    </form>
  `;
  // Dynamic player name fields
  const playerInputsDiv = document.getElementById('player-inputs');
  const playerCountSelect = document.getElementById('player-count');

  function updatePlayerInputs() {
    const count = parseInt(playerCountSelect.value);
    playerInputsDiv.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      playerInputsDiv.innerHTML += `<input type="text" placeholder="Player ${i} Name" id="player-name-${i}" required>`;
    }
  }
  playerCountSelect.addEventListener('change', updatePlayerInputs);
  updatePlayerInputs();

  // Back button
  document.getElementById('back-to-selection').onclick = (e) => {
    e.preventDefault();
    playerSetup.classList.remove('active');
    gameSelection.classList.add('active');
  };

  // Play button
  document.querySelector('.player-setup-form').onsubmit = (e) => {
    e.preventDefault();
    const count = parseInt(playerCountSelect.value);
    let playerNames = [];
    for (let i = 1; i <= count; i++) {
      const name = document.getElementById(`player-name-${i}`).value.trim();
      if (!name) {
        alert('Sabhi player ka naam daalein!');
        return;
      }
      playerNames.push(name);
    }
    // Next step: Show game board
    showGameBoard(selectedGame, playerNames);
  };
}

function showGameBoard(selectedGame, playerNames) {
  playerSetup.classList.remove('active');
  gameBoard.classList.add('active');
  if (selectedGame === 'Snake & Ladder') {
    renderSnakeBoard(playerNames);
  } else {
    renderLudoBoard(playerNames);
  }
}

// --- Static Ludo Board UI ---
let ludoState = null;
function renderLudoBoard(playerNames) {
  // --- Ludo board config ---
  const colorsHex = ['#e53935','#43a047','#ffb300','#3949ab'];
  const homePos = [0,13,26,39]; // Start index for each player on main path
  const homeEntry = [50,11,24,37]; // Entry to home path for each player
  const pawnHomeXY = [
    [[70,70],[120,70],[70,120],[120,120]], // Red
    [[478,70],[528,70],[478,120],[528,120]], // Green
    [[70,478],[120,478],[70,528],[120,528]], // Yellow
    [[478,478],[528,478],[478,528],[528,528]] // Blue
  ];
  const centerXY = [[280,280],[320,280],[280,320],[320,320]];
  // 52 main path positions (clockwise)
  const pathXY = [
    [240,40],[240,80],[240,120],[240,160],[240,200],[240,240],[200,240],[160,240],[120,240],[80,240],[40,240],[40,280],
    [40,320],[80,320],[120,320],[160,320],[200,320],[240,320],[240,360],[240,400],[240,440],[240,480],[280,480],[320,480],
    [360,480],[400,480],[440,480],[480,480],[480,440],[480,400],[480,360],[480,320],[480,280],[480,240],[440,240],[400,240],[360,240],[320,240],[280,240],[280,200],[280,160],[280,120],[280,80],[280,40],[320,40],[360,40],[400,40],[440,40],[480,40],[480,80],[480,120],[480,160],[480,200],[480,240]
  ];
  // Home path for each color (6 steps)
  const homePathXY = [
    [[240,240],[200,200],[160,160],[120,120],[80,80],[40,40]], // Red
    [[240,240],[280,200],[320,160],[360,120],[400,80],[440,40]], // Green
    [[240,240],[280,280],[320,320],[360,360],[400,400],[440,440]], // Yellow
    [[240,240],[200,280],[160,320],[120,360],[80,400],[40,440]] // Blue
  ];
  // --- State init ---
  if (!ludoState || ludoState.playerNames.join() !== playerNames.join()) {
    ludoState = {
      playerNames: playerNames.slice(),
      turn: 0,
      dice: 1,
      isRolling: false,
      winner: null,
      diceRolled: false,
      pawns: playerNames.map(() => [0,0,0,0]), // 0 = home, 1+ = steps on path, 57 = home reached
    };
  }

  // Remove any existing back buttons before adding a new one
  document.querySelectorAll('.back-board-btn').forEach(btn => btn.remove());
  // Board config
  const colors = [
    {name:'Red', color:'#e53935', light:'#ffcdd2'},
    {name:'Green', color:'#43a047', light:'#c8e6c9'},
    {name:'Yellow', color:'#ffb300', light:'#ffe082'},
    {name:'Blue', color:'#3949ab', light:'#c5cae9'}
  ];
  // 15x15 grid
  let html = `<div class='ludo-board-container' style='width:600px;height:600px;position:relative;margin:0 auto;'>`;
  html += `<div class='ludo-board' style='display:grid;grid-template-columns:repeat(15,40px);grid-template-rows:repeat(15,40px);width:600px;height:600px;'>`;
  for(let row=0;row<15;row++){
    for(let col=0;col<15;col++){
      let cellClass = '';
      let cellStyle = '';
      // Home corners
      if(row<6&&col<6)cellClass='home-red';
      else if(row<6&&col>8)cellClass='home-green';
      else if(row>8&&col<6)cellClass='home-yellow';
      else if(row>8&&col>8)cellClass='home-blue';
      // Center home
      else if(row>5&&row<9&&col>5&&col<9)cellClass='center-home';
      // Red path
      else if((col===6||col===8)&&row<6)cellClass='path-red';
      else if(row===6&&col<9&&col>5)cellClass='path-red';
      // Green path
      else if((row===6||row===8)&&col>8)cellClass='path-green';
      else if(col===8&&row<9&&row>5)cellClass='path-green';
      // Yellow path
      else if((col===6||col===8)&&row>8)cellClass='path-yellow';
      else if(row===8&&col<9&&col>5)cellClass='path-yellow';
      // Blue path
      else if((row===6||row===8)&&col<6)cellClass='path-blue';
      else if(col===6&&row<9&&row>5)cellClass='path-blue';
      html += `<div class='ludo-cell ${cellClass}' style='${cellStyle}'></div>`;
    }
  }
  html += `</div>`;
  // Pawns in homes
  // Red
  html += `<div class='ludo-home-pawns home-red' style='position:absolute;top:44px;left:44px;width:152px;height:152px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;'>`;
  for(let i=0;i<4;i++)html+=`<span class='ludo-pawn' style='background:#e53935;'></span>`;
  html += `</div>`;
  // Green
  html += `<div class='ludo-home-pawns home-green' style='position:absolute;top:44px;right:44px;width:152px;height:152px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;'>`;
  for(let i=0;i<4;i++)html+=`<span class='ludo-pawn' style='background:#43a047;'></span>`;
  html += `</div>`;
  // Yellow
  html += `<div class='ludo-home-pawns home-yellow' style='position:absolute;bottom:44px;left:44px;width:152px;height:152px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;'>`;
  for(let i=0;i<4;i++)html+=`<span class='ludo-pawn' style='background:#ffb300;'></span>`;
  html += `</div>`;
  // Blue
  html += `<div class='ludo-home-pawns home-blue' style='position:absolute;bottom:44px;right:44px;width:152px;height:152px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;align-items:center;'>`;
  for(let i=0;i<4;i++)html+=`<span class='ludo-pawn' style='background:#3949ab;'></span>`;
  html += `</div>`;
  html += `</div>`;
  // --- Ludo Game Logic ---
  // Dice UI
  html += `<div class='ludo-dice-area' style='width:100%;display:flex;justify-content:center;align-items:center;margin:24px 0;'>
    <button id='ludo-dice-btn' style='width:80px;height:80px;border-radius:50%;font-size:2.5rem;font-weight:700;border:5px solid ${colorsHex[ludoState.turn]};background:#fffde7;box-shadow:0 2px 12px #0001;outline:none;cursor:${ludoState.isRolling||ludoState.diceRolled||ludoState.winner?'not-allowed':'pointer'};' ${(ludoState.isRolling||ludoState.diceRolled||ludoState.winner)?'disabled':''}>
      <span id='ludo-dice-face'>${ludoState.dice}</span>
    </button>
    <span style='margin-left:24px;font-size:1.2rem;font-weight:600;'>Chaal: <span style='color:${colorsHex[ludoState.turn]}'>${playerNames[ludoState.turn]}</span></span>
  </div>`; // Only enable dice if not rolling, not already rolled, not won
  // Board pawns
  html += `<div class='ludo-pawns-layer' style='position:absolute;top:0;left:0;width:600px;height:600px;pointer-events:none;'>`;
  // --- Stacking/offset logic ---
  // 1. Main path: group by global cell index (all colors)
  // 2. Home/homepath/center: per color as before
  const cellMap = {}; // key: type-index, value: [{pIdx, pawnIdx, pos, step, homeIdx}]
  playerNames.forEach((pname, pIdx) => {
    ludoState.pawns[pIdx].forEach((pos, pawnIdx) => {
      if (pos === 0) {
        // Home
        let key = `home-${pIdx}`;
        if (!cellMap[key]) cellMap[key] = [];
        cellMap[key].push({pIdx, pawnIdx, homeIdx: pawnIdx});
      } else if (pos === 57) {
        // Center
        let key = `center`;
        if (!cellMap[key]) cellMap[key] = [];
        cellMap[key].push({pIdx, pawnIdx});
      } else if (pos > 0 && pos < 58) {
        let step = pos-1;
        if (step < 52) {
          // Main path: global index
          let idx = (homePos[pIdx]+step)%52;
          let key = `path-${idx}`;
          if (!cellMap[key]) cellMap[key] = [];
          cellMap[key].push({pIdx, pawnIdx, step});
        } else {
          // Home path (per color)
          let key = `homepath-${pIdx}-${step-52}`;
          if (!cellMap[key]) cellMap[key] = [];
          cellMap[key].push({pIdx, pawnIdx, step: step-52});
        }
      }
    });
  });
  // Render pawns with offset
  Object.entries(cellMap).forEach(([key, arr]) => {
    arr.forEach(({pIdx, pawnIdx, homeIdx, step}, i) => {
      let x, y;
      if (key.startsWith('home-')) {
        // Use the classic 2x2 grid directly from pawnHomeXY
        [x, y] = pawnHomeXY[pIdx][pawnIdx];
      
      } else if (key === 'center') {
        [x,y] = centerXY[pawnIdx];
        const offset = 8;
        x += (arr.length > 1) ? (i-((arr.length-1)/2))*offset : 0;
        y += (arr.length > 1) ? (i-((arr.length-1)/2))*offset : 0;
      } else if (key.startsWith('path-')) {
        const idx = parseInt(key.split('-')[1]);
        [x,y] = pathXY[idx];
        if (arr.length > 1) {
          const angle = (i/arr.length)*2*Math.PI;
          x += Math.cos(angle)*16;
          y += Math.sin(angle)*16;
        }
      } else if (key.startsWith('homepath-')) {
        const [,,idx] = key.split('-');
        [x,y] = homePathXY[pIdx][idx];
        if (arr.length > 1) {
          const angle = (i/arr.length)*2*Math.PI;
          x += Math.cos(angle)*16;
          y += Math.sin(angle)*16;
        }
      }
      let highlight = '';
      if (ludoState.diceRolled && ludoState.turn === pIdx && isValidLudoMove(pIdx, pawnIdx, ludoState.dice)) highlight = 'box-shadow:0 0 0 5px #fff9,0 0 0 10px '+colorsHex[pIdx]+'AA;';
      html += `<div class='ludo-pawn' data-player='${pIdx}' data-pawn='${pawnIdx}' style='position:absolute;left:${x-16}px;top:${y-16}px;width:32px;height:32px;background:${colorsHex[pIdx]};border:3px solid #fff;z-index:10;cursor:${ludoState.diceRolled&&ludoState.turn===pIdx&&isValidLudoMove(pIdx,pawnIdx,ludoState.dice)?'pointer':'default'};pointer-events:${ludoState.diceRolled&&ludoState.turn===pIdx&&isValidLudoMove(pIdx,pawnIdx,ludoState.dice)?'auto':'none'};${highlight}'></div>`;
    });
  });
  html += `</div>`;
  gameBoard.innerHTML = html;
  const backBtn = document.querySelector('.back-board-btn');
  if (backBtn) {
    backBtn.onclick = () => {
      gameBoard.classList.remove('active');
      playerSetup.classList.add('active');
    };
  }
  // Attach dice click logic for each player
  document.getElementById('ludo-dice-btn').onclick = () => {
    if (ludoState.isRolling || ludoState.winner !== null) return;
    ludoState.isRolling = true;
    const diceResultSpan = document.getElementById('ludo-dice-face');
    let rollCount = 0;
    let rollInterval = setInterval(() => {
      const face = Math.ceil(Math.random() * 6);
      diceResultSpan.innerHTML = face;
      rollCount++;
      if (rollCount >= 12) {
        clearInterval(rollInterval);
        ludoState.dice = Math.ceil(Math.random() * 6);
        diceResultSpan.innerHTML = ludoState.dice;
        // Move pawn
        let moved = false;
        for (let i = 0; i < 4; i++) {
          if (ludoState.pawns[ludoState.turn][i] !== 57) {
            let nextPos = ludoState.pawns[ludoState.turn][i] + ludoState.dice;
            if (nextPos > 57) nextPos = ludoState.pawns[ludoState.turn][i];
            ludoState.pawns[ludoState.turn][i] = nextPos;
            moved = true;
            break;
          }
        }
        if (!moved) {
          alert('Koi pawn nahi hai jo move ho sake!');
        }
        if (ludoState.pawns[ludoState.turn].some(pos => pos === 57)) {
          ludoState.winner = ludoState.turn;
          alert(`Jeet gaya ${playerNames[ludoState.turn]}!`);
        } else {
          ludoState.turn = (ludoState.turn + 1) % playerNames.length;
        }
        ludoState.isRolling = false;
        renderLudoBoard(playerNames);
      }
    }, 50);
  };
}

// --- Snake & Ladder Persistent Game State ---
let snakePositions = [];
let snakeTurn = 0;
let snakeDice = 1;
let snakeWinner = null;
let snakePlayerNames = [];

function diceUnicode(val) {
  const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  return `<span style='font-size:2.7rem;'>${faces[val-1]}</span>`;
}

function renderSnakeBoard(playerNames) {
  // Dice rolling lock to prevent double click
  let isRolling = false;
  // State initialize only if new game or player names changed
  if (
    snakePlayerNames.length !== playerNames.length ||
    snakePlayerNames.some((n, i) => n !== playerNames[i])
  ) {
    snakePlayerNames = playerNames.slice();
    snakePositions = Array(playerNames.length).fill(1);
    snakeTurn = 0;
    snakeDice = 1;
    snakeWinner = null;
  }
  const playerCount = snakePlayerNames.length;
  // Use persistent state below
  let positions = snakePositions;
  let turn = snakeTurn;
  let dice = snakeDice;
  let winner = snakeWinner;

  // Classic Snakes and Ladders map (well-spaced, no overlap)
  const snakes = {
    99: 78,
    95: 56,
    92: 73,
    87: 24,
    62: 19,
    54: 34,
    64: 60,
    17: 7
  };
  const ladders = {
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,
    71: 91
  };

  function renderBoard() {
    // Remove any existing back buttons before adding a new one
    document.querySelectorAll('.back-board-btn').forEach(btn => btn.remove());
    // Dice positions and player mapping
    const dicePositions = [
      {class: 'dice-pos-bottom', label: playerNames[0] || 'P1'},
      {class: 'dice-pos-left', label: playerNames[1] || 'P2'},
      {class: 'dice-pos-top', label: playerNames[2] || 'P3'},
      {class: 'dice-pos-right', label: playerNames[3] || 'P4'}
    ];
    // Dice color for each player (same as pawn)
    const pawnColors = ['#e53935','#43a047','#3949ab','#ffb300'];
    let html = `<div class='turn-info' style='text-align:center;margin-bottom:28px;'>Current Turn: <b style='color:${pawnColors[turn]}'>${playerNames[turn]}</b></div>
    <div class="snake-board-container">
      <div style='position:relative;width:460px;height:460px;margin:0 auto;'>
        <div class='snake-board'>`;
    // 10x10 grid, cells 100 to 1
    // Helper to get cell position (col, row)
    function getCellPos(num) {
      let n = num - 1;
      let row = Math.floor(n / 10);
      let col = n % 10;
      if (row % 2 === 1) col = 9 - col;
      return {col, row: 9 - row}; // y axis reversed for grid
    }
    // SVG overlays for ladders and snakes
    let svgOverlays = '';
    // Draw ladders (blue)
    Object.entries(ladders).forEach(([fromCell, toCell]) => {
      const from = getCellPos(Number(fromCell));
      const to = getCellPos(Number(toCell));
      const x1 = from.col * 36 + 18, y1 = from.row * 36 + 18;
      const x2 = to.col * 36 + 18, y2 = to.row * 36 + 18;
      svgOverlays += `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#2196f3' stroke-width='6' stroke-linecap='round' />`;
      // Rungs
      for (let i = 1; i < 6; i++) {
        const rx1 = x1 + (x2 - x1) * (i / 6);
        const ry1 = y1 + (y2 - y1) * (i / 6);
        const perp = {x: y2 - y1, y: x1 - x2};
        const norm = Math.sqrt(perp.x*perp.x + perp.y*perp.y);
        const px = perp.x / norm * 10, py = perp.y / norm * 10;
        svgOverlays += `<line x1='${rx1-px}' y1='${ry1-py}' x2='${rx1+px}' y2='${ry1+py}' stroke='#90caf9' stroke-width='3' />`;
      }
    });
    // Draw snakes (red)
    Object.entries(snakes).forEach(([fromCell, toCell]) => {
      const from = getCellPos(Number(fromCell));
      const to = getCellPos(Number(toCell));
      const x1 = from.col * 36 + 18, y1 = from.row * 36 + 18;
      const x2 = to.col * 36 + 18, y2 = to.row * 36 + 18;
      // Control points for curve
      const mx = (x1 + x2) / 2 + ((Math.random() - 0.5) * 60);
      const my = (y1 + y2) / 2 + ((Math.random() - 0.5) * 60);
      svgOverlays += `<path d='M${x1},${y1} Q${mx},${my} ${x2},${y2}' stroke='#e53935' stroke-width='6' fill='none' />`;
      // Snake head
      svgOverlays += `<circle cx='${x1}' cy='${y1}' r='10' fill='#e53935' stroke='#b71c1c' stroke-width='2' />`;
    });
    // Render all cells in one .snake-board
    let cellsHTML = '';
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        let cellNum = row % 2 === 0 ? (row * 10 + col + 1) : (row * 10 + (9 - col) + 1);
        cellsHTML += `<div class=\"snake-cell\" data-cell=\"${cellNum}\">${cellNum}`;
        // Add pawns if present
        positions.forEach((pos, idx) => {
          if (pos === cellNum) {
            cellsHTML += `<span class=\"pawn pawn-${idx}\" title=\"${playerNames[idx]}\"></span>`;
          }
        });
        cellsHTML += `</div>`;
      }
    }
    html += `${cellsHTML}</div>
      <svg class='board-overlay-svg' width='360' height='360'>${svgOverlays}</svg>
    </div>`;
    // Back button (render inside, but move outside after render)
    html += `<button class='back-board-btn'>Back</button>`;
    // Dice containers at corners/sides
    if (playerCount === 2) {
      // Bottom (P1), Top (P2)
      [0,1].forEach(idx => {
        html += `<div class="dice-container ${dicePositions[idx].class}">
          <div class="dice-box" id="dice-box-${idx}" style="border-color:${turn===idx?pawnColors[idx]:'#b0bec5'};color:${pawnColors[idx]};background:${turn===idx?'#fffde7':'#f3f3f3'};cursor:${turn===idx?'pointer':'default'};">
            <span id="dice-result-${idx}">${snakeTurn===idx ? diceUnicode(snakeDice) : ''}</span>
          </div>
          <span class="dice-label">${dicePositions[idx].label}</span>
        </div>`;
      });
    } else if (playerCount === 4) {
      [0,1,2,3].forEach(idx => {
        html += `<div class="dice-container ${dicePositions[idx].class}">
          <div class="dice-box" id="dice-box-${idx}" style="border-color:${turn===idx?pawnColors[idx]:'#b0bec5'};color:${pawnColors[idx]};background:${turn===idx?'#fffde7':'#f3f3f3'};cursor:${turn===idx?'pointer':'default'};">
            <span id="dice-result-${idx}">${snakeTurn===idx ? diceUnicode(snakeDice) : ''}</span>
          </div>
          <span class="dice-label">${dicePositions[idx].label}</span>
        </div>`;
      });
    }
    html += `</div>`;
    if (winner !== null) {
      html += `<div style="color:#43a047;font-size:1.3rem;font-weight:600;margin-top:10px;">🏆 Winner: ${playerNames[winner]}</div>`;
    }
    html += `<button class="back-board-btn">Back</button></div>`;
    gameBoard.innerHTML = html;
    document.querySelector('.back-board-btn').onclick = () => {
      gameBoard.classList.remove('active');
      playerSetup.classList.add('active');
    };
    // Attach dice click logic for each player
    function handleDiceClick(idx) {
      if (isRolling || snakeWinner !== null || snakeTurn !== idx) return;
      isRolling = true;
      const diceResultSpan = document.getElementById(`dice-result-${idx}`);
      let rollCount = 0;
      let rollInterval = setInterval(() => {
        const face = Math.ceil(Math.random() * 6);
        diceResultSpan.innerHTML = diceUnicode(face);
        rollCount++;
        if (rollCount >= 12) {
          clearInterval(rollInterval);
          dice = Math.ceil(Math.random() * 6);
          diceResultSpan.innerHTML = diceUnicode(dice);
          // Move pawn
          let nextPos = snakePositions[snakeTurn] + dice;
          if (nextPos > 100) nextPos = snakePositions[snakeTurn];
          let moveMsg = '';
          if (ladders[nextPos]) {
            moveMsg = `Ladder! ${snakePlayerNames[snakeTurn]} goes up to ${ladders[nextPos]}`;
            nextPos = ladders[nextPos];
          } else if (snakes[nextPos]) {
            moveMsg = `Snake! ${snakePlayerNames[snakeTurn]} goes down to ${snakes[nextPos]}`;
            nextPos = snakes[nextPos];
          }
          snakePositions[snakeTurn] = nextPos;
          if (snakePositions[snakeTurn] === 100) {
            snakeWinner = snakeTurn;
          }
          if (snakeWinner === null) {
            snakeTurn = (snakeTurn + 1) % snakePlayerNames.length;
            snakeDice = 1; // Reset dice value, but don't show it on non-active players
          }
          setTimeout(() => {
            isRolling = false;
            renderBoard();
            if (moveMsg) {
              setTimeout(() => { alert(moveMsg); }, 300);
            }
          }, 600);
        }
      }, 50);
    }
    if (playerCount === 2) {
      [0,1].forEach(idx => {
        const diceBox = document.getElementById(`dice-box-${idx}`);
        if (snakeTurn === idx && snakeWinner === null) {
          diceBox.onclick = () => handleDiceClick(idx);
        } else {
          diceBox.onclick = null;
        }
      });
    } else if (playerCount === 4) {
      [0,1,2,3].forEach(idx => {
        const diceBox = document.getElementById(`dice-box-${idx}`);
        if (snakeTurn === idx && snakeWinner === null) {
          diceBox.onclick = () => handleDiceClick(idx);
        } else {
          diceBox.onclick = null;
        }
      });
    }
    document.querySelector('.back-board-btn').onclick = () => {
      gameBoard.classList.remove('active');
      playerSetup.classList.add('active');
    };
  }
  renderBoard();
}

function showPlayerSetup(selectedGame) {
  gameSelection.classList.remove('active');
  playerSetup.classList.add('active');
  renderPlayerSetupForm(selectedGame);
}

ludoOption.addEventListener('click', () => showPlayerSetup('Ludo'));
snakeOption.addEventListener('click', () => showPlayerSetup('Snake & Ladder'));
