# Office Environmental Monitor - ATVISE SCADA Project

**🌐 Live Website:** https://yourusername.github.io/office-environmental-monitor

> Professional ATVISE SCADA environmental monitoring system developed during industrial automation internship, demonstrating comprehensive three-layer monitoring architecture with professional alarm management and ModBus RTU to OPC UA communication.

## 🎯 Project Overview

This project represents a complete industrial-grade environmental monitoring system built with ATVISE 3.11.0 SCADA platform. The system features sophisticated three-layer monitoring architecture, professional alarm management, real-time data acquisition, and robust communication infrastructure following European environmental monitoring standards.

### Key Achievements
- **Real-time Environmental Monitoring** with temperature and humidity sensors
- **Professional Alarm System** using ATVISE native alarm conditions
- **Three-Layer Architecture** covering System, Device, and Communication health
- **Industrial Protocol Integration** with ModBus RTU to OPC UA conversion
- **99%+ Data Capture Rate** with <500ms response time performance

## 🛠️ Technology Stack

### Hardware Components
- **Environmental Sensor**: Novus RHT Climate (±0.2°C, ±1.8% RH accuracy)
- **Protocol Gateway**: GW-01 ModBus RTU to OPC UA converter
- **Communication**: RS485 ModBus RTU with Ethernet OPC UA integration

### Software Platform
- **SCADA System**: ATVISE 3.11.0 with professional alarm infrastructure
- **Communication Protocols**: ModBus RTU, OPC UA
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Hosting**: GitHub Pages with responsive design

### Standards Compliance
- **EN 16798-1**: Indoor Environmental Quality monitoring framework
- **EN 17255-4**: Data Acquisition Systems quality assurance
- **EN 14181**: Automated Measuring Systems principles

## ⚡ Key Features

### Monitoring Capabilities
- **Temperature Range**: 10°C to 35°C operational monitoring
- **Humidity Range**: 15% to 85% RH with professional alarm thresholds
- **Real-time Processing**: <1 second response time for all measurements
- **Data Quality**: >99% good readings meeting regulatory standards

### Professional Alarm System
- **Native ATVISE Conditions**: Server-side alarm processing with persistence
- **Four-Level Priority**: Normal, Warning, Critical, Emergency with visual coding
- **Dynamic Thresholds**: Runtime adjustable limits without system restart
- **Acknowledgment Tracking**: Full audit trail with timestamp and user logging

### Three-Layer Architecture
1. **System Health**: SCADA platform performance monitoring
2. **Field Device Health**: Sensor connectivity and data quality assessment
3. **Communication Health**: Network protocol reliability tracking

## 📊 Project Metrics

| Metric | Value | Industry Standard |
|--------|-------|------------------|
| **Data Capture Rate** | >99% | ≥95% (Regulatory) |
| **Response Time** | <500ms | <1s (Real-time) |
| **System Uptime** | 24/7 | Continuous |
| **Alarm Response** | <100ms | <500ms |
| **Protocol Conversion** | Real-time | ModBus→OPC UA |

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   RHT Sensor    │    │  GW-01       │    │   ATVISE        │
│  Temperature    │◄──►│  Gateway     │◄──►│   SCADA         │
│  Humidity       │    │  ModBus→OPC  │    │   Platform      │
│  ±0.2°C/±1.8%RH │    │  Conversion  │    │   3.11.0        │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │   Web Browser   │
                                           │   Responsive    │
                                           │   Interface     │
                                           └─────────────────┘
```

## 📱 Website Features

### Responsive Design
- **Mobile-First Approach** with comprehensive breakpoint system
- **Touch-Friendly Interface** optimized for tablets and smartphones
- **Progressive Enhancement** with graceful degradation
- **Accessibility Compliant** with screen reader support

### Interactive Elements
- **Dynamic Tab Navigation** with hash-based routing
- **Expandable Content Sections** for detailed technical information
- **Real-time Status Indicators** showing current system state
- **Professional Data Visualization** with charts and metrics

### Content Organization
1. **Project Summary** - Executive overview and key metrics
2. **Technical Architecture** - Detailed system specifications
3. **Development Timeline** - Learning journey with breakthrough insights
4. **System Status** - Current operational state and performance

## 🚀 Quick Start

### View Live Website
Visit: `https://yourusername.github.io/office-environmental-monitor`

### Local Development
```bash
# Clone repository
git clone https://github.com/username/office-environmental-monitor.git

# Navigate to project
cd office-environmental-monitor

# Start local server (Python)
python -m http.server 8000

# Or Node.js
npx serve .

# Visit: http://localhost:8000
```

## 📁 File Structure

```
office-environmental-monitor/
├── index.html                 # Main application entry point
├── assets/
│   ├── css/
│   │   ├── main.css          # Design system and base styles
│   │   ├── components.css    # Reusable UI components
│   │   └── responsive.css    # Mobile-first responsive design
│   └── js/
│       ├── utils.js          # Helper functions and utilities
│       ├── content-loader.js # Dynamic content management
│       └── tab-manager.js    # Navigation and state management
├── content/
│   ├── summary.html          # Project overview and metrics
│   ├── technical.html        # Detailed technical specifications
│   ├── timeline.html         # Development progression timeline
│   └── status.html           # Current system status
├── README.md                 # Project documentation
└── .gitignore               # Git ignore rules
```

## 🎓 Educational Value

### Learning Outcomes Demonstrated
- **Industrial Communication Protocols** - ModBus RTU and OPC UA integration
- **Professional SCADA Development** - ATVISE platform expertise
- **System Architecture Design** - Multi-layer monitoring principles
- **Alarm Management** - Industry-standard alarm processing
- **Web Development** - Modern responsive design techniques
- **Technical Documentation** - Professional project presentation

### Skills Progression
1. **Week 1**: SCADA platform familiarization and basic displays
2. **Week 2-3**: Hardware integration and manual system development  
3. **Week 4**: Professional alarm system implementation breakthrough
4. **Week 4-5**: Advanced three-layer monitoring architecture

## 🔧 Technical Implementation

### ATVISE SCADA Configuration
- **Node Structure**: Professional organization with RealTime/, SystemHealth/, FieldDeviceHealth/, CommunicationHealth/ logical grouping
- **Variable Types**: Float (IEEE 754), Boolean, Integer, String, DateTime with proper typing
- **Alarm Conditions**: Native ATVISE alarm infrastructure with subscription-based updates

### Communication Setup
- **ModBus RTU**: 9600 bps, 8-N-1 format, 5-second polling cycles
- **OPC UA**: Full Data Access, Alarms & Conditions, Historical Access foundation
- **Gateway Configuration**: Automatic protocol conversion with data buffering

### Performance Optimization
- **Efficient Polling**: Optimized sensor query intervals
- **Data Caching**: Smart caching system for web content
- **Progressive Loading**: Async content loading with smooth transitions

## 📈 Future Enhancements

### Priority 1: Data Historization
- ATVISE HISTORY module implementation
- Trend analysis dashboard development
- Automated reporting capabilities

### Priority 2: Mobile Interface
- HTML5 responsive design conversion
- Progressive Web App (PWA) features
- Touch-optimized controls

### Priority 3: Sensor Expansion
- CO₂ and pressure sensor integration
- Multi-point data acquisition
- Extended ModBus network

## 🤝 Contributing

This project serves as a portfolio demonstration of industrial automation skills. For questions about implementation details or educational use:

1. Review the technical documentation in the website
2. Check the development timeline for learning insights
3. Contact for internship or educational collaboration opportunities

## 📄 License

This project is available for educational and portfolio purposes. Please credit the original work when referencing implementation details.

## 📞 Contact

**Portfolio Project** | **Industrial Automation** | **SCADA Development**

---

*Developed during industrial automation internship - Demonstrating professional SCADA implementation with modern web technologies*