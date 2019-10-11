import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagina-dinamica',
  templateUrl: './pagina-dinamica.page.html',
  styleUrls: ['./pagina-dinamica.page.scss'],
})
export class PaginaDinamicaPage implements OnInit {
  pageId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {


  }

  ionViewWillEnter() {
    this.pageId = this.route.snapshot.paramMap.get('mostro');
  }

}
