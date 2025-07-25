import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-holding-details',
  templateUrl: './holding-details.page.html',
  styleUrls: ['./holding-details.page.scss'],
})
export class HoldingDetailsPage implements OnInit {
  holding: any;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private location: Location,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  ngOnInit() {
    const nav = this.location.getState() as any;
    if (nav && nav.data) {
      this.holding = nav.data;
    } else {
      console.warn('No holding data passed in navigation.');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  async uploadImage() {
    if (!this.selectedFile || !this.holding?.id) return;

    this.isUploading = true;

    try {
      const newImagePath = `holding-images/${uuid()}_${this.selectedFile.name}`;
      const imageRef = ref(this.storage, newImagePath);
      await uploadBytes(imageRef, this.selectedFile);
      const imageUrl = await getDownloadURL(imageRef);

      const holdingDoc = doc(this.firestore, `holdings/${this.holding.id}`);
      await updateDoc(holdingDoc, {
        imageUrl,
        imagePath: newImagePath
      });

      this.holding.imageUrl = imageUrl;
      this.holding.imagePath = newImagePath;
      this.selectedFile = null;

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      this.isUploading = false;
    }
  }
}
