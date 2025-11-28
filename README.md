# Raiku Community Website

The official community hub for Raiku — Deterministic Scheduling for Solana.

## Features

- **AI Powered Search**: Ask questions about Raiku and get grounded answers via Gemini AI.
- **Interactive Quiz**: Test your knowledge in Simple, Hard, and Tough modes.
- **Leaderboards**: Compete with others and track your scores.
- **Authentication**: Discord login via Supabase.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React
- **AI**: Google GenAI SDK (Gemini 2.5 Flash)
- **Backend**: Supabase (Auth & Database)

## Setup

1. Clone the repository.
2. Set up environment variables in `.env` (or your deployment platform):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `API_KEY` (Gemini API)
3. Run the application.
