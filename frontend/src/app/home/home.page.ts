import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

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
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,) {}

  async fetch() {
    localStorage.setItem("url", this.url);

    const loader = await this.loadingController.create({
      backdropDismiss: false,
      translucent: true,
    });
    await loader.present();
    try {
      const response = await this.apollo.query({ query: graphqlQuery, variables: { url: this.url }}).toPromise();
      this.urlInfos.unshift((response.data as any).getInfo);
      localStorage.setItem("urlInfos", JSON.stringify(this.urlInfos));

    }
    catch(e) {
      const alert = await this.alertController.create({
        header: "Error while querying data",
        message: e.message,
        buttons: ["OK"],
        translucent: true,
       });
      await alert.present();
    }
    finally {
      await loader.dismiss();
    }
  }

  openVlc(url: string) {
    window.open(`vlc://${url}`, "_blank");
  }

  async copyToClipboard(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    const toast = await this.toastController.create({
      message: "Link copied to clipboard",
      duration: 1500,
      translucent: true
    });
    await toast.present();
  }

  async reset() {
    const alertWindow = await this.alertController.create({
      header: "Warning",
      message: "This will delete all your search results. Do you want to continue?",
      backdropDismiss: false,
      translucent: true,
      buttons: ["No", {
        text: "Yes",
        role: "cancel",
        cssClass: "danger",
        handler: async () => {
          this.urlInfos = [];
          localStorage.setItem("urlInfos", JSON.stringify(this.urlInfos));
          await this.apollo.getClient().cache.reset();
        },
      }],
    });
    await alertWindow.present();

  }

  ngOnInit() {
    this.url = localStorage.getItem("url") || "";
    try {
      this.urlInfos = JSON.parse(localStorage.getItem("urlInfos")) || [];
    } catch(e) {
      this.urlInfos = [];
    }
  }

}
