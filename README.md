# {Name}

> {Description}

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Running the App](#running-the-app)
    - [Code Quality](#code-quality)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Maintenance](#maintenance)

## Overview

This frontend provides a complete {Description} Vite SPA with the following aspects:

- **{Aspects}**

## Getting Started

### Installation

```bash
# Clone the repository
git clone {Project_Link}

# Navigate to project directory
cd {Directory_Path}

# Install dependencies
npm install
```

### Running the App

```bash
# Configure environment variables (env, API Keys, Endpoints, etc.)
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint codebase
npm run lint

# Check for unused dependencies
npx knip

# Check for outdated dependencies
npm outdated
```

## Environment Variables

Ensure that your enviroment variables are inline (Use Doppler)

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update to compatible versions
npm update

# For major version updates:
# 1. Mirror package.json, tsconfig files and eslint.config.js from the offical docs "https://vite.new/react-ts"
# 2. Update package.json manually or using Version Lens extension
# 3. Remove existing dependencies
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install
```
