# Splitwise Clone – Neurix Full-Stack SDE Assignment

A full-stack application to track shared expenses, split costs (equally or by percentage), and view balances within groups. Built with **FastAPI** (Python), **PostgreSQL**, **React**, and **TailwindCSS**. Dockerized for easy setup.

---

## Features
- **Group Management:** Create groups and add users
- **Expense Management:** Add expenses, split equally or by percentage
- **Balance Tracking:** View who owes whom in a group and personal balances
- **Modern UI:** Clean, responsive interface with TailwindCSS
- **API-first:** RESTful backend with OpenAPI docs

---

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, TailwindCSS
- **Containerization:** Docker, Docker Compose

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose
- (Optional) [Git](https://git-scm.com/)

### Setup & Run (One Command)

1. **Clone the repository:**
   ```sh
git clone <your-repo-url>
cd assignment
```
2. **Start all services:**
   ```sh
docker-compose up --build
```
3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs) (OpenAPI docs)

---

## API Documentation

### Group Management
- `POST /groups` – Create a new group
  - Body: `{ name: string, user_ids: [int] }`
- `GET /groups/{group_id}` – Get group details

### Expense Management
- `POST /groups/{group_id}/expenses` – Add expense
  - Body: `{ description, amount, paid_by, split_type, splits }`
- `GET /groups/{group_id}/expenses` – List expenses in group

### Balance Tracking
- `GET /groups/{group_id}/balances` – Group balances (who owes whom)
- `GET /users/{user_id}/balances` – User’s balances across groups

> For full details and schemas, see [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Project Structure
```
assignment/
├── backend/      # FastAPI app
├── frontend/     # React app
├── docker-compose.yml
└── README.md
```

---

## Assumptions
- No authentication/authorization required
- No payment/settlement functionality
- All users in a group are assumed to exist before group creation
- Only equal and percentage splits are supported

---

## Development

### Backend (FastAPI)
```sh
cd backend
uvicorn app.main:app --reload
```

### Frontend (React)
```sh
cd frontend
npm install
npm start
```

---

## License
This project is for educational/demo purposes only.
