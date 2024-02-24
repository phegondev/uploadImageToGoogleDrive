<template>
  <div class="app">
    <!-- Display result message -->
    <div v-if="resultMessage" :class="resultMessage.type">
      {{ getResultMessageText() }}
    </div>

    <h1>Image Uploader</h1>
    <input type="file" @change="handleFileChange" />
    <button @click="handleUpload" :disabled="!selectedFile">Upload Image</button>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      selectedFile: null,
      resultMessage: null,
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async handleUpload() {
      try {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        const response = await fetch('http://localhost:5050/uploadToGoogleDrive', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        // Check if the API call was successful
        if (response.ok) {
          this.resultMessage = { type: 'success', message: result };
        } else {
          // Handle API error
          this.resultMessage = { type: 'error', message: result };
        }

        this.clearMessageAfterDelay();
      } catch (error) {
        console.error('Error uploading image:', error.message);
        this.resultMessage = { type: 'error', message: error.message };
        this.clearMessageAfterDelay();
      }
    },
    getResultMessageText() {
      // Display appropriate message based on the result
      return this.resultMessage.message.status === 200
        ? 'Success: ' + this.resultMessage.message.message
        : 'Error: ' + this.resultMessage.message.message;
    },
    clearMessageAfterDelay() {
      // Clear result message after a delay
      setTimeout(() => (this.resultMessage = null), 5000);
    },
  },
};
</script>
  
<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.app {
  width: 50%;
  margin: 30px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #333;
  margin-top: 30px;
}

input {
  margin: 30px 0px;
  padding: 10px;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2d752f;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}


.success,
.error {
  margin-top: 30px;
  padding: auto;
  font-weight: 800;
}


.success {
  color: #4caf50;
}

.error {
  color: #f44336;
}
</style>
  
  
  
  
  
  