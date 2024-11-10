import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import * as Cesium from 'cesium';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-cesium-map',
  standalone: true,
  templateUrl: './cesium-map.component.html',
  styleUrls: ['./cesium-map.component.scss'],
})
export class CesiumMapComponent implements OnInit, OnDestroy {
  private viewer: Cesium.Viewer | undefined;
  private flightDataSubscription: Subscription | undefined;
  private entities: Cesium.EntityCollection;

  constructor(private flightService: FlightService) {
    this.entities = new Cesium.EntityCollection();
  }

  async ngOnInit(): Promise<void> {
    try {
      // Initialize Cesium viewer with 3D globe
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: await Cesium.createWorldTerrainAsync(), // Use async to load terrain
      });

      // Use the entities collection to manage the flight objects
      this.viewer.entities.add(this.entities);

      // Subscribe to flight data and update in real-time
      this.flightDataSubscription = this.flightService
        .getFlightDataStream()
        .subscribe((flightData) => {
          this.updateFlightPositions(flightData);
        });
    } catch (error) {
      console.error('Error initializing Cesium viewer:', error);
    }
  }

  updateFlightPositions(flightData: any): void {
    // Clear existing entities
    this.entities.removeAll();

    flightData.forEach((flight: any) => {
      if (flight[5] && flight[6]) {
        // Check if lat, lon are available
        const lat = flight[6];
        const lon = flight[5];
        const alt = flight[7] || 10000; // Use altitude if available, default to 10,000 meters

        // Create a Cesium Entity for the flight (3D object)
        const flightEntity = this.viewer?.entities.add({
          id: flight[0], // Use ICAO code as the unique ID
          position: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
          model: {
            uri: 'https://path-to-3d-model/airplane.glb', // 3D model of the airplane (replace with a valid model URL)
            minimumPixelSize: 128,
            maximumScale: 2000,
          },
          label: {
            text: flight[0], // ICAO code for the label
            font: '14pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the flight data stream
    if (this.flightDataSubscription) {
      this.flightDataSubscription.unsubscribe();
    }
  }
}
