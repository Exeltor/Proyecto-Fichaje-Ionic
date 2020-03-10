import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import L from "leaflet";
@Component({
  selector: "app-mapaempresa",
  templateUrl: "./mapaempresa.component.html",
  styleUrls: ["./mapaempresa.component.scss"]
})
export class MapaempresaComponent implements OnInit {
  @Input() latLon;
  map: L.Map;
  center: L.PointTuple;
  startCoords = [28.6448, 77.216721];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.center = this.startCoords;
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    this.map = L.map("mapId", {
      center: this.center,
      zoom: 15
    });

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: ""
    }).addTo(this.map);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
