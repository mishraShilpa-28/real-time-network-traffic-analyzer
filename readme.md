
# Network Traffic Capture and Filtering

## Project Overview
**Network Traffic Capture and Filtering** is a powerful, real-time monitoring tool designed to capture and filter network packets. Built with a **Python backend** and **Next.js frontend**, it utilizes **Scapy** for packet sniffing and offers real-time data visualization via **WebSocket**. Captured data can be exported in **Excel** format, making it a handy tool for both educational and diagnostic purposes.

---

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
  - [Web Interface](#web-interface)
  - [Exporting Data](#exporting-data)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Notes](#notes)
- [Future Enhancements](#future-enhancements)

---

## Introduction
This project allows users to monitor network traffic on a specified interface, with optional filtering by IP address. Packets are captured in real-time, stored in JSON format, displayed on a live web interface, and can be downloaded as Excel files.

---

## Features
- **Packet Capture**: Tracks incoming and outgoing network packets.
- **IP-Based Filtering**: Filter traffic by user-defined IP addresses.
- **Real-Time Visualization**: Live packet data streaming using WebSocket.
- **Data Export**: Download captured data in Excel format.
- **Cross-Platform Compatibility**: Runs on Windows, macOS, and Linux.

---

## Prerequisites
Ensure the following are installed:

- **Python** (v3.8 or above) → [Download Python](https://www.python.org/downloads/)
- **Node.js** (v18 or above) → [Download Node.js](https://nodejs.org/)

> **Windows Users**: You must install [Npcap](https://npcap.com/) for packet sniffing.

---

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mishraShilpa-28/real-time-network-traffic-analyzer.git
   cd real-time-network-traffic-analyzer
   ```

2. Create and activate a virtual environment:

   **Windows**:
   ```bash
   python -m venv env
   .\env\Scripts\activate
   pip install scapy websockets
   ```

   **macOS/Linux**:
   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirement.txt
   ```

> **Note**: Windows users must install Npcap.

---

### Frontend Setup
1. In a new terminal, navigate to the frontend:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

---

## Usage

### Running the Backend
Start the packet sniffer by running:
```bash
python packet-sniffer.py
```

### Running the Frontend
In the `frontend` directory, start the Next.js development server:
```bash
npm run dev
```

### Web Interface
Once both backend and frontend are running, open [http://localhost:3000](http://localhost:3000) in your browser to view captured traffic in a live table with filtering options.

---

### Exporting Data
Click the **Download** button on the web interface to export captured packets to an **Excel file**.

---

## Project Structure
- **Backend**: Python-based, uses Scapy for packet capture and IP filtering.
- **Frontend**: Built with Next.js and WebSocket for real-time updates.

---

## Dependencies

### Python
- `scapy` – Packet capture and network analysis
- `websockets` – Real-time communication

### Node.js
- Listed in `frontend/package.json`

---

## Notes
- Run the backend with **admin/root privileges** for full packet capture.
- Ensure **Python** and **Node.js** are added to your system’s PATH.

---

## Future Enhancements
- Add filtering by protocol (e.g., TCP, UDP).
- Integrate advanced analytics and visualizations.
- Support for additional export formats (CSV, JSON, etc.).

---

<!--## Screenshots-->
