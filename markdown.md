# Ludo & Snake & Ladder Web Game (Ludo King Style)

## Overview
Ek web game banani hai jo Ludo King jaise ho, jismein do games available ho: **Ludo** aur **Snake & Ladder**. Game HTML, CSS, aur JavaScript se banegi.

---

## UI/UX Flow

### 1. Splash Screen
- Ludo King ka ek bada image/logo dikhai de.
- Neeche "Continue" button ho.

### 2. Game Selection Screen
- Do bade buttons/images: 
  - **Ludo**
  - **Snake & Ladder**
- User koi bhi ek game select kare.

### 3. Player Selection & Setup
- Selected game ka preview dikhai de.
- Dropdown menu: "Kitne player khelenge?" (2, 3, ya 4)
- Har player ke liye ek input field: "Player Name"
- "Play" button

### 4. Game Board
- Select kiya hua game ka board dikhai de:
  - Agar Ludo, toh Ludo board with tokens
  - Agar Snake & Ladder, toh uska board
- Player info sidebar ya top par ho
- Dice roll button
- Current turn highlight ho

### 5. Gameplay
- Dice roll karne par animation ho
- Token move ho (Ludo) ya pawn move ho (Snake & Ladder)
- Winner declare ho jaise hi koi player finish line par pahunchta hai
- "Play Again" ya "Back to Home" button

---

## File Structure (Suggested)

```
/ (root)
│-- index.html
│-- style.css
│-- script.js
│-- assets/
│    ├─ ludo-logo.png
│    ├─ ludo-board.png
│    ├─ snake-ladder-board.png
│    └─ ...
```

---

## Features List
- [ ] Splash screen with logo
- [ ] Game selection (Ludo or Snake & Ladder)
- [ ] Player count dropdown (2-4)
- [ ] Player name input fields
- [ ] Dynamic game board rendering
- [ ] Dice roll and turn system
- [ ] Token/pawn movement animation
- [ ] Winner announcement
- [ ] Play again/home navigation

---

## Next Steps
1. Splash screen ka HTML/CSS/JS banaayein
2. Game selection UI implement karein
3. Player setup form banayein
4. Game logic (Ludo & Snake & Ladder) implement karein
5. UI polish aur testing

---

## Notes
- Saare assets (images) `assets/` folder mein rakhein
- Responsive design dhyaan mein rakhein (mobile + desktop)
- Code ko modular aur readable rakhein

---

Agar aapko koi aur feature ya screen add karni hai toh bata sakte hain!
