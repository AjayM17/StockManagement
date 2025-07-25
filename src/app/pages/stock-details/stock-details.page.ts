import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.page.html',
  styleUrls: ['./stock-details.page.scss'],
})
export class StockDetailsPage implements OnInit {
  stockId!: string;
  stock: any = null;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private storage: Storage
  ) {}
  async ngOnInit() {
    this.stockId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.stockId)
    const stockDoc = doc(this.firestore, `holdings/${this.stockId}`);
    const snapshot = await getDoc(stockDoc);
    if (snapshot.exists()) {
      this.stock = snapshot.data();
    } else {
      console.error('Stock item not found');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  async uploadImage() {
    if (!this.selectedFile || !this.stockId || !this.stock) return;

    this.isUploading = true;

    try {
      // 1. Delete old image if exists
      if (this.stock.imagePath) {
        const oldRef = ref(this.storage, this.stock.imagePath);
        await deleteObject(oldRef).catch(() => {}); // ignore error if not found
      }

      // 2. Upload new image
      const newImagePath = `stock-images/${uuid()}_${this.selectedFile.name}`;
      const imageRef = ref(this.storage, newImagePath);
      await uploadBytes(imageRef, this.selectedFile);
      const imageUrl = await getDownloadURL(imageRef);

      // 3. Update Firestore
      const stockDoc = doc(this.firestore, `stock/${this.stockId}`);
      await updateDoc(stockDoc, {
        imageUrl,
        imagePath: newImagePath
      });

      // 4. Update local UI
      this.stock.imageUrl = imageUrl;
      this.stock.imagePath = newImagePath;
      this.selectedFile = null;

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      this.isUploading = false;
    }
  }


}
