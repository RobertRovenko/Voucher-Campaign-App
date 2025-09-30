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

Example:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voucher_db?schema=public"
PORT=4000

## Running the Project

1. **Start the backend and database with Docker (Parent)**

docker-compose up -d

This starts both the backend server and a PostgreSQL database.

2. **Optionally open Prisma Studio for a database interface (Backend)**

docker-compose exec backend npx prisma studio

3. **Start the frontend development server (Frontend)**

npm run dev

This runs the Next.js frontend locally on http://localhost:3000.

![terminalsteps](https://github.com/user-attachments/assets/f3a8665c-17b2-4f98-80c8-55a7b5d958bc)

## Useful Commands / Cheatsheet

**Start Docker containers**

docker-compose up -d

**Stop Docker containers:**

docker-compose down

**Build the backend Docker container:**

docker-compose build backend

**Run the backend development server inside Docker:**

docker-compose exec backend npm run dev

**Open Prisma Studio for a database interface**

docker-compose exec backend npx prisma studio

#Scripts

**Create 100.000 vouchers:**

docker-compose exec backend npx ts-node src/scripts/seedVouchers.ts

**Delete a campaign:**

curl -X DELETE http://localhost:4000/campaigns/<campaignId>

**List campaigns:**

curl http://localhost:4000/campaigns

**List vouchers in a campaign:**

curl http://localhost:4000/campaigns/<campaignId>/vouchers

**Download CSV of vouchers:**

curl -O http://localhost:4000/campaigns/<campaignId>/vouchers/csv

<img width="1440" height="752" alt="Screenshot 2025-10-01 at 00 19 00" src="https://github.com/user-attachments/assets/26061ece-78f7-4d8c-a076-7ad73aea5aa3" />
<img width="1440" height="752" alt="Screenshot 2025-10-01 at 00 19 09" src="https://github.com/user-attachments/assets/b31588b7-1245-4994-8e64-5dbc1e5387c1" />
<img width="1440" height="752" alt="Screenshot 2025-10-01 at 00 19 23" src="https://github.com/user-attachments/assets/50a52cf5-0cbc-40c6-8288-759982fe6cff" />
<img width="1440" height="752" alt="Screenshot 2025-10-01 at 00 19 38" src="https://github.com/user-attachments/assets/39147bdf-b7d0-4052-b487-7af58af90602" />
<img width="1416" height="720" alt="Screenshot 2025-10-01 at 00 28 03" src="https://github.com/user-attachments/assets/802f5c0e-6884-4d73-b748-42de3b69bbd7" />
<img width="1440" height="217" alt="Screenshot 2025-10-01 at 00 29 47" src="https://github.com/user-attachments/assets/8a12b940-3c78-4de4-a518-99258c8f0e6a" />
<img width="1440" height="591" alt="Screenshot 2025-10-01 at 00 29 58" src="https://github.com/user-attachments/assets/ce84047d-560e-4499-b3d1-f547d7abd1e8" />
<img width="1440" height="753" alt="Screenshot 2025-09-27 at 14 36 52" src="https://github.com/user-attachments/assets/48179360-f192-4c1b-8aaf-2db10d4dbf21" />
<img width="1272" height="789" alt="Screenshot 2025-09-27 at 14 22 10" src="https://github.com/user-attachments/assets/36bdcdd1-9276-480f-934b-8f142df405e1" />

Mobile
<img width="499" height="750" alt="Screenshot 2025-10-01 at 00 47 32" src="https://github.com/user-attachments/assets/0ce4fc5e-a89e-404b-855c-2cb57f3ec9d7" />
<img width="499" height="750" alt="Screenshot 2025-10-01 at 00 47 50" src="https://github.com/user-attachments/assets/82ba274f-d793-441b-888d-52a72aa96949" />
<img width="499" height="750" alt="Screenshot 2025-10-01 at 00 48 01" src="https://github.com/user-attachments/assets/eb0cff9e-2fda-461f-b7e0-8459b6e4412e" />
