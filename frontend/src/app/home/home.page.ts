import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { LoadingController, AlertController } from '@ionic/angular';

const graphqlQuery = gql`
  query GetInfo($url: String!) {
    getInfo(url: $url) {
      ext
      extractor
      fullTitle
      thumbnail
      formats {
        filesize
        format
        url
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  url: string;
  urlInfos: any[] = [];

  constructor(
    private readonly apollo: Apollo,
    private readonly loadingController: LoadingController,
    private readonly alertController: AlertController) {}

  async fetch() {
    localStorage.setItem("url", this.url);

    const loader = await this.loadingController.create({ backdropDismiss: false });
    await loader.present();
    try {
      const response = await this.apollo.query({ query: graphqlQuery, variables: { url: this.url }}).toPromise();
      this.urlInfos.unshift((response.data as any).getInfo);

    }
    catch(e) {
      const alert = await this.alertController.create({ header: "Error while querying data", message: e.message, buttons: ["OK"] });
      await alert.present();
    }
    finally {
      await loader.dismiss();
    }
  }

  ngOnInit() {
    this.url = localStorage.getItem("url") || "";
  }

}
