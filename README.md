# JingJai: AI-Powered Product Authentication Platform

JingJai is a full-stack application designed to help users verify the authenticity of products using AI-powered image analysis.

## About The Project

This project provides a mobile-first solution to combat counterfeit goods. Users can register, take or upload photos of a product, and submit them for verification. The backend uses an AI model to analyze the images and return an authenticity report. This gives consumers a tool to quickly and reliably check if an item is genuine.

The name "JingJai" (จริงใจ) is Thai for "sincere" or "genuine," reflecting the app's core mission.

### Key Features

*   **User Authentication**: Secure sign-up and login system for users.
*   **AI Verification**: Upload product images for AI-powered authenticity analysis.
*   **Product Catalog**: Browse a catalog of supported brands and products.
*   **Payment Integration**: Handles payments for verification services using Google Pay.
*   **Cross-Platform Mobile App**: A single codebase for both iOS and Android.

## Tech Stack

The project is divided into a mobile frontend and a Python backend.

#### Frontend (`JingJaiV3/`)

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Language**: JavaScript
*   **Navigation**: [React Navigation](https://reactnavigation.org/)

#### Backend (`jingjai_backend/`)

*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
*   **Language**: Python
*   **Database**: [SQLAlchemy](https://www.sqlalchemy.org/) for the ORM with [Alembic](https://alembic.sqlalchemy.org/) for migrations.
*   **Payments**: Integration with Google Pay API.

## Project Structure

```
.
├── JingJaiV3/         # React Native (Expo) mobile application
└── jingjai_backend/   # FastAPI backend server
```

*   `JingJaiV3/`: Contains all the frontend code, including screens, components, and navigation logic for the mobile app.
*   `jingjai_backend/`: Contains the backend API, database models, authentication logic, and integration with the AI service and payment gateways.
