import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import L from "leaflet";
import { map } from 'rxjs/operators';
@Component({
  selector: "app-mapaempresa",
  templateUrl: "./mapaempresa.component.html",
  styleUrls: ["./mapaempresa.component.scss"]
})
export class MapaempresaComponent implements OnInit {
  @Input() latLon;
  map: L.Map;
  center: L.PointTuple;
  markerLatLon;
  marker;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.center = this.latLon;
    this.markerLatLon = this.latLon;
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    this.map = L.map("mapId", {
      center: this.center,
      zoom: 15
    })

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: ""
    }).addTo(this.map);

    this.marker = L.marker(this.markerLatLon, {draggable: true})
    this.marker.addTo(this.map)
  }

  closeModal() {
    this.modalCtrl.dismiss(this.marker._latlng);
  }
}
