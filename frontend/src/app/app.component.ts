import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File | null = null;
  resultMessage: { type: string; result: any } | null = null;

  handleFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }



  async handleUpload(): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('image', this.selectedFile as Blob);

      const response = await fetch('http://localhost:5050/uploadToGoogleDrive', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        this.resultMessage = { type: 'success', result: result };
      } else {
        this.resultMessage = { type: 'error', result: result };
      }
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      this.resultMessage = { type: 'error', result: error.message };
    }
    setTimeout(() => this.resultMessage = null, 5000);
  }
}


