# Voucher Management App

A modern web application for managing voucher campaigns. Built with **Next.js, React, TypeScript, TailwindCSS, PostgreSQL, Docker, and Prisma**.

---

## Tech Stack

- **Frontend:** Next.js + React + TypeScript + TailwindCSS
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL (recommended via Docker)
- **ORM:** Prisma
- **Containerization:** Docker & Docker Compose

---

## Features

- Create campaigns
- Generate vouchers in bulk with streaming
- Paginated voucher list to handle large datasets efficiently
- Download vouchers as CSV
- Delete campaigns and individual vouchers with confirmation

---

## Prerequisites

- Node.js
- Docker

---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/yourusername/voucher-app.git
cd voucher-app

2. Create a .env file in /backend

- Example:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voucher_db?schema=public"
PORT=4000

## Running the Project

# 1. Start the backend and database with Docker

docker-compose up -d

This starts both the backend server and a PostgreSQL database.

# 2. Optionally open Prisma Studio for a database interface

docker-compose exec backend npx prisma studio

# 3. Start the frontend development server

npm run dev

This runs the Next.js frontend locally on http://localhost:3000.

## Useful Commands / Cheatsheet

# Stop Docker containers:

docker-compose down

# Build the backend Docker container:

docker-compose build backend

# Run the backend development server inside Docker:

docker-compose exec backend npm run dev

# Create 100.000 vouchers:

docker-compose exec backend npx ts-node src/scripts/seedVouchers.ts

# Delete a campaign:

curl -X DELETE http://localhost:4000/campaigns/<campaignId>

# List campaigns:

curl http://localhost:4000/campaigns

# List vouchers in a campaign:

curl http://localhost:4000/campaigns/<campaignId>/vouchers

# Download CSV of vouchers:

curl -O http://localhost:4000/campaigns/<campaignId>/vouchers/csv
