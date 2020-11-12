import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss'],
})
export class ItemModalComponent implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm;
  @Input() name: string;
  @Input() title: string;
  @Input() type: string;
  // @Input() author: string;
  @Input() text: string;
  // @Input() userId: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}


    onCancel() {
      this.modalCtrl.dismiss(null, 'cancel');
    }

  onAddQuote() {
    if (!this.form.valid) {
      return;
    }

    this.modalCtrl.dismiss({
      itemData:
          {
            title: this.form.value.title,
            type: this.form.value.type,
            text: this.form.value.text,
            // author: this.author,
            // checked: false,
            // userId: this.userId,
          }
    }, 'confirm');
  }
}
