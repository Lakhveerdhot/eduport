// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     port: 5173
//   }
// });



import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // external access allow
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'anaya-stylar-anaerobiotically.ngrok-free.dev', // tera ngrok host
      '.ngrok-free.dev' // baaki future ngrok URLs bhi allow ho jayenge
    ]
  }
});

