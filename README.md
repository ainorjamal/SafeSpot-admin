<div align="center">

<img src="assets/admin_icon.png" alt="SafeSpot Admin Logo" width="120" height="120">

# SafeSpot Admin Dashboard

### *Centralized Management for Intelligent Safety Monitoring*

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

*Comprehensive administrative control for SafeSpot's geofencing and predictive safety platform*

[Features](#-features) • [Getting Started](#-getting-started) • [Dashboard Overview](#-dashboard-overview) • [Contributing](#-contributing)

</div>

---

## 📊 Overview

**SafeSpot Admin Dashboard** is a powerful Vue.js web application designed to provide administrators with comprehensive oversight and management capabilities for the SafeSpot safety monitoring ecosystem. From user management to geofence analytics, this dashboard puts complete control at your fingertips.

Built for **system administrators**, **safety coordinators**, and **organizational managers** who need centralized control over multiple SafeSpot users and devices.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👥 **User Management**
- **User Overview Dashboard**  
  View and manage all registered users in the system
  
- **Account Administration**  
  Create, edit, suspend, or delete user accounts
  
- **Activity Monitoring**  
  Track user login history and app usage patterns
  
- **Role-Based Access Control**  
  Assign and manage user permissions and roles

</td>
<td width="50%">

### 🗺️ **Geofence Management**
- **Global Geofence Overview**  
  View all active geofences across the system
  
- **Geofence Analytics**  
  Analyze usage patterns and boundary violations
  
- **Template Management**  
  Create and deploy geofence templates for common scenarios
  
- **Multi-User Coordination**  
  Manage shared geofences for groups or families

</td>
</tr>
<tr>
<td width="50%">

### 📱 **Device Management**
- **Device Registry**  
  Track all connected devices and their status
  
- **Device Health Monitoring**  
  Monitor battery levels, connection status, and app versions
  
- **Remote Configuration**  
  Push settings and updates to devices remotely
  
- **Device Analytics**  
  View device usage statistics and performance metrics

</td>
<td width="50%">

### 🔔 **Alert & Notification System**
- **Alert Dashboard**  
  Monitor all safety alerts and geofence violations in real-time
  
- **Alert Management**  
  Review, acknowledge, and respond to safety alerts
  
- **Notification Configuration**  
  Customize alert thresholds and notification rules
  
- **Alert History & Reports**  
  Access comprehensive alert logs and generate reports

</td>
</tr>
<tr>
<td width="50%">

### 🤖 **ML Model Management**
- **Model Performance Metrics**  
  Monitor LSTM prediction accuracy and system performance
  
- **Model Version Control**  
  Deploy and rollback ML model versions
  
- **Training Data Insights**  
  Analyze aggregated training data (privacy-preserved)
  
- **Prediction Analytics**  
  View prediction accuracy trends and improvement metrics

</td>
<td width="50%">

### 📈 **Analytics & Reporting**
- **System-Wide Statistics**  
  Comprehensive dashboards with key performance indicators
  
- **Custom Report Generation**  
  Create detailed reports on usage, safety, and system health
  
- **Data Visualization**  
  Interactive charts and graphs for trend analysis
  
- **Export Capabilities**  
  Export data in CSV, PDF, and JSON formats

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- SafeSpot backend API access

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/reymartjohneva/safespot-admin.git
    ```

2. Navigate to the project folder:
    ```bash
    cd safespot-admin
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

### Development

#### Compiles and hot-reloads for development
```bash
npm run serve
```
The dashboard will be available at `http://localhost:8080`

#### Compiles and minifies for production
```bash
npm run build
```

#### Lints and fixes files
```bash
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---

## 🎨 Dashboard Overview

### Main Dashboard
The main dashboard provides an at-a-glance view of:
- **Active Users**: Current online users and total registered accounts
- **Active Geofences**: Number of configured safety zones
- **Recent Alerts**: Latest safety notifications and violations
- **System Health**: Overall platform status and performance
- **Prediction Accuracy**: ML model performance metrics

### Key Modules

#### User Management Console
- Search and filter users by name, email, status, or registration date
- View detailed user profiles with location history and geofence configurations
- Manage user permissions and account settings
- Export user data for compliance and reporting

#### Geofence Control Center
- Interactive map view of all geofences across the system
- Create organizational templates for common use cases (school zones, work areas, safe neighborhoods)
- Monitor geofence violations and boundary crossings
- Configure shared geofences for families or groups

#### Device Management Panel
- Real-time device status monitoring
- Push notifications and updates to specific devices or groups
- Track device health metrics (battery, GPS accuracy, app version)
- Remotely troubleshoot device issues

#### Alert Management System
- Real-time alert feed with priority sorting
- Alert acknowledgment and response workflows
- Configure escalation rules and notification chains
- Generate incident reports and safety summaries

#### Analytics Dashboard
- User engagement and retention metrics
- Geofence effectiveness analysis
- LSTM model performance tracking
- System usage trends and forecasting

---

## 🔧 Key Dependencies

- **Vue.js 3** – Progressive JavaScript framework for building user interfaces
- **Vue Router** – Official router for Vue.js applications
- **Vuex** – State management pattern and library
- **Axios** – Promise-based HTTP client for API communication
- **Chart.js / Vue-ChartJS** – Data visualization and charting
- **Leaflet / Vue2Leaflet** – Interactive map integration
- **Element Plus / Vuetify** – UI component library
- **date-fns** – Modern JavaScript date utility library

---

## 🔐 Security & Privacy

SafeSpot Admin Dashboard implements robust security measures:

- **Role-Based Access Control (RBAC)**: Granular permissions for different admin levels
- **Encrypted Communications**: All API calls use HTTPS/TLS encryption
- **Session Management**: Secure token-based authentication with automatic timeout
- **Audit Logging**: Comprehensive logs of all administrative actions
- **Privacy Compliance**: GDPR and data protection regulation compliance
- **Anonymized Analytics**: Aggregated data views that protect individual privacy

---

## 🌐 API Integration

The admin dashboard connects to the SafeSpot backend API for all data operations. Ensure your environment configuration includes:

```javascript
// .env.local
VUE_APP_API_BASE_URL=https://api.safespot.com
VUE_APP_WS_URL=wss://api.safespot.com/ws
VUE_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## 📚 Documentation

For detailed documentation on specific features and API integration:
- [User Management Guide](docs/user-management.md)
- [Geofence Administration](docs/geofence-admin.md)
- [Analytics & Reporting](docs/analytics.md)
- [API Reference](docs/api-reference.md)

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Areas for Contribution
- UI/UX improvements and accessibility enhancements
- Advanced analytics features and visualization options
- Integration with third-party safety and monitoring services
- Performance optimization and code quality improvements
- Documentation and translation efforts

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Vue.js team** – For the reactive and performant frontend framework. [Vue.js](https://vuejs.org/)
- **OpenStreetMap** – For providing map data and tiles. [OpenStreetMap](https://www.openstreetmap.org/)
- **Chart.js contributors** – For powerful data visualization capabilities. [Chart.js](https://www.chartjs.org/)
- **SafeSpot mobile app team** – For the foundational safety platform
- **All contributors** – For their dedication to improving safety through technology

---

## 📞 Support

For support, email support@safespot.com or join our [Community Discord](https://discord.gg/safespot).

---

<div align="center">

**[Mobile App](https://github.com/reymartjohneva/SafeSpot)** • **[API Documentation](docs/api-reference.md)** • **[Report Bug](https://github.com/reymartjohneva/safespot-admin/issues)** • **[Request Feature](https://github.com/reymartjohneva/safespot-admin/issues)**

Made with ❤️ by the SafeSpot Team

</div>
