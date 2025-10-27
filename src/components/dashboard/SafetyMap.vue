<template>
  <v-container fluid class="content-container pa-0">
    <!-- Map Container - Full Width -->
    <v-card class="dashboard-card map-card">
      <v-card-text class="pa-0">
        <div class="map-wrapper">
          <div id="safety-map" class="safety-map"></div>
          
          <!-- Map Legend -->
          <div class="map-legend">
            <div class="legend-title">Incident Priority</div>
            <div class="legend-item">
              <div class="legend-marker" style="background: #f44336;"></div>
              <span>High Priority</span>
            </div>
            <div class="legend-item">
              <div class="legend-marker" style="background: #FF9800;"></div>
              <span>Medium Priority</span>
            </div>
            <div class="legend-item">
              <div class="legend-marker" style="background: #4CAF50;"></div>
              <span>Low Priority</span>
            </div>
          </div>

          <!-- Map Controls Overlay -->
          <div class="map-controls">
            <v-btn
              icon
              size="small"
              class="control-btn"
              @click="addIncidentDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              class="control-btn"
              @click="refreshMap"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              class="control-btn"
              @click="centerMap"
            >
              <v-icon>mdi-crosshairs-gps</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Add Incident Dialog -->
    <v-dialog v-model="addIncidentDialog" max-width="500px">
      <v-card class="modern-dialog">
        <v-card-title class="text-h5 pa-6">Add New Incident</v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="form">
            <v-text-field
              v-model="newIncident.title"
              label="Incident Title"
              variant="outlined"
              required
            ></v-text-field>
            <v-textarea
              v-model="newIncident.description"
              label="Description"
              variant="outlined"
              rows="3"
              required
            ></v-textarea>
            <v-select
              v-model="newIncident.priority"
              :items="priorityOptions"
              label="Priority"
              variant="outlined"
              required
            ></v-select>
            <v-text-field
              v-model="newIncident.location"
              label="Location (Click on map)"
              variant="outlined"
              hint="Click on the map to set location"
              persistent-hint
              readonly
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            class="cancel-btn"
            variant="text"
            @click="addIncidentDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="confirm-btn"
            color="#FF6B35"
            @click="saveIncident"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'SafetyMap',
  data() {
    return {
      map: null,
      markers: [],
      tempMarker: null,
      addIncidentDialog: false,
      newIncident: {
        title: '',
        description: '',
        priority: '',
        location: '',
        lat: null,
        lng: null
      },
      priorityOptions: ['High', 'Medium', 'Low'],
      incidents: [
        {
          id: 1,
          title: 'Road Accident',
          description: 'Vehicle collision at intersection',
          priority: 'High',
          status: 'Open',
          location: 'Manila City Hall',
          lat: 14.5995,
          lng: 120.9842,
          date: '2025-10-27'
        },
        {
          id: 2,
          title: 'Street Lighting Issue',
          description: 'Multiple street lights not working',
          priority: 'Medium',
          status: 'In Progress',
          location: 'Rizal Park',
          lat: 14.5833,
          lng: 120.9789,
          date: '2025-10-26'
        },
        {
          id: 3,
          title: 'Suspicious Activity',
          description: 'Reported suspicious behavior',
          priority: 'High',
          status: 'Resolved',
          location: 'Intramuros',
          lat: 14.5920,
          lng: 120.9750,
          date: '2025-10-25'
        },
        {
          id: 4,
          title: 'Pothole',
          description: 'Large pothole on main road',
          priority: 'Low',
          status: 'Open',
          location: 'Binondo',
          lat: 14.6042,
          lng: 120.9822,
          date: '2025-10-24'
        },
        {
          id: 5,
          title: 'Broken Traffic Light',
          description: 'Traffic signal malfunctioning',
          priority: 'High',
          status: 'Open',
          location: 'Quiapo',
          lat: 14.5979,
          lng: 120.9850,
          date: '2025-10-27'
        }
      ]
    }
  },
  mounted() {
    this.initMap()
    this.addIncidentMarkers()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    initMap() {
      // Initialize map centered on Manila
      this.map = L.map('safety-map').setView([14.5995, 120.9842], 13)

      // Add OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map)

      // Add click event to map for adding incidents
      this.map.on('click', (e) => {
        if (this.addIncidentDialog) {
          this.newIncident.lat = e.latlng.lat
          this.newIncident.lng = e.latlng.lng
          this.newIncident.location = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
          
          // Remove previous temp marker
          if (this.tempMarker) {
            this.map.removeLayer(this.tempMarker)
          }
          
          // Add temporary marker
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: #2196F3; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
          
          this.tempMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon })
            .addTo(this.map)
        }
      })
    },
    addIncidentMarkers() {
      this.incidents.forEach(incident => {
        const color = this.getPriorityMarkerColor(incident.priority)
        
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })

        const marker = L.marker([incident.lat, incident.lng], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; color: #333;">${incident.title}</h4>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${incident.description}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="padding: 4px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 11px; font-weight: bold;">${incident.priority}</span>
                <span style="color: #999; font-size: 12px;">${incident.date}</span>
              </div>
            </div>
          `)

        this.markers.push(marker)
      })
    },
    getPriorityMarkerColor(priority) {
      const colors = {
        'High': '#f44336',
        'Medium': '#FF9800',
        'Low': '#4CAF50'
      }
      return colors[priority] || '#999'
    },
    saveIncident() {
      if (!this.newIncident.title || !this.newIncident.priority || !this.newIncident.location) {
        alert('Please fill in all required fields and click on the map to set location')
        return
      }

      const newId = Math.max(...this.incidents.map(i => i.id)) + 1
      const incident = {
        id: newId,
        title: this.newIncident.title,
        description: this.newIncident.description,
        priority: this.newIncident.priority,
        status: 'Open',
        location: this.newIncident.location,
        lat: this.newIncident.lat,
        lng: this.newIncident.lng,
        date: new Date().toISOString().split('T')[0]
      }

      this.incidents.push(incident)
      
      // Add marker to map
      const color = this.getPriorityMarkerColor(incident.priority)
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([incident.lat, incident.lng], { icon })
        .addTo(this.map)
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">${incident.title}</h4>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${incident.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="padding: 4px 8px; background: ${color}; color: white; border-radius: 4px; font-size: 11px; font-weight: bold;">${incident.priority}</span>
              <span style="color: #999; font-size: 12px;">${incident.date}</span>
            </div>
          </div>
        `)

      this.markers.push(marker)
      
      // Remove temp marker
      if (this.tempMarker) {
        this.map.removeLayer(this.tempMarker)
        this.tempMarker = null
      }

      // Reset form
      this.newIncident = {
        title: '',
        description: '',
        priority: '',
        location: '',
        lat: null,
        lng: null
      }
      
      this.addIncidentDialog = false
      
      // Show popup on new marker
      marker.openPopup()
    },
    refreshMap() {
      // Refresh the map
      this.map.invalidateSize()
    },
    centerMap() {
      // Center map back to Manila
      this.map.setView([14.5995, 120.9842], 13)
    }
  }
}
</script>

<style scoped>
.content-container {
  height: calc(100vh - 64px);
  padding: 0 !important;
}

.map-card {
  height: 100%;
  border-radius: 0 !important;
  border: none !important;
}

.safety-map {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
}

.map-wrapper {
  position: relative;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #999;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.control-btn {
  background: rgba(20, 20, 20, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.control-btn:hover {
  background: rgba(30, 30, 30, 0.95) !important;
  border-color: rgba(255, 107, 53, 0.4) !important;
}

.control-btn .v-icon {
  color: #FF6B35;
}

.modern-dialog {
  background: rgba(20, 20, 20, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.modern-dialog .v-card-title {
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modern-dialog :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.modern-dialog :deep(.v-field__input) {
  color: #fff;
}

.modern-dialog :deep(.v-label) {
  color: #999;
}

.modern-dialog :deep(.v-messages__message) {
  color: #666;
}

@media (max-width: 600px) {
  .map-legend {
    bottom: 10px;
    right: 10px;
    padding: 12px;
  }

  .map-controls {
    top: 10px;
    right: 10px;
  }
}
</style>

<style>
/* Global Leaflet customization */
.leaflet-popup-content-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.leaflet-popup-tip {
  background: white;
}

.leaflet-control-zoom a {
  background: rgba(20, 20, 20, 0.95) !important;
  color: #FF6B35 !important;
  border: 1px solid rgba(255, 107, 53, 0.2) !important;
}

.leaflet-control-zoom a:hover {
  background: rgba(30, 30, 30, 0.95) !important;
  color: #FF9800 !important;
}

.leaflet-control-attribution {
  background: rgba(20, 20, 20, 0.8) !important;
  color: #999 !important;
}

.leaflet-control-attribution a {
  color: #FF6B35 !important;
}
</style>