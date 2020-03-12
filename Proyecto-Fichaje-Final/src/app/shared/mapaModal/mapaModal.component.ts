import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import L from "leaflet";
@Component({
  selector: "app-mapaModal",
  templateUrl: "./mapaModal.component.html",
  styleUrls: ["./mapaModal.component.scss"]
})
export class MapaModalComponent implements OnInit {
  @Input() latLon;
  @Input() modalTitle;
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

  cancelModal() {
    this.modalCtrl.dismiss();
  }
}
