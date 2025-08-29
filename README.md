# Shiritori Multiplayer Game

A beautifully designed, multiplayer Shiritori word game built with Next.js. Play the classic word game where players take turns creating words that start with the last letter of the previous word.

## Features

- **Turn-based Gameplay**: Automatic player switching with visual indicators
- **Real-time Word Validation**: Uses DictionaryAPI to verify English words
- **Smart Game Rules**: Enforces 4+ letter minimum, no repeated words, correct starting letter
- **Countdown Timer**: 30-second turns with visual countdown and urgency indicators
- **Dynamic Scoring**: Points for valid words, deductions for invalid ones
- **Complete Word History**: Track all played words with validation status
- **Responsive Design**: Optimized for both desktop and mobile play
- **Modern UI**: Clean, animated interface with smooth transitions

## Game Rules

1. **Starting**: Player 1 begins with any valid English word (minimum 4 letters)
2. **Word Chain**: Each subsequent word must start with the last letter of the previous word
3. **Validation**: All words are checked against the DictionaryAPI for validity
4. **No Repeats**: Previously used words cannot be played again
5. **Time Limit**: Players have 30 seconds per turn
6. **Scoring**: 
   - +1 point for valid words
   - -1 point for invalid words or time running out

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shiritori-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework  
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **DictionaryAPI** - Word validation service

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ShiritoriGame.tsx  # Main game component
│   ├── PlayerCard.tsx     # Player information display
│   ├── GameTimer.tsx      # Countdown timer component
│   ├── ScoreBoard.tsx     # Score tracking display
│   ├── WordHistory.tsx    # Word history sidebar
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── utils.ts          # General utilities
│   └── dictionary-api.ts  # API integration
└── README.md             # This file
```

## API Integration

The game integrates with [DictionaryAPI](https://dictionaryapi.dev/) for real-time word validation. No API key required - the service is free and open source.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is open source and available under the MIT License.