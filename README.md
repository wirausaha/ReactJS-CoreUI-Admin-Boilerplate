REACT JS CORE UI BOILER PLATE

Untuk memudahkan pada pemula mempelajari dan membangun aplikasi dengan ReactJS + Vite 
menggunakan CoreUI Admin Template versi gratis. Informasi mengenai Core UI bisa dibaca pada
"README CORE UI.md"

Ini adalah boiler plate untuk sisi klien (Frontend), pengujian bisa menggunakan Backend 
yang kami upload di repositori : https://github.com/wirausaha/ASPNet-api-boilerplate-dengan-refresh-JWT-token
atau bisa dibuat sendiri dengan bahasa dan database apapun asalkan endpoint API nya sama. 

Adapun daftar endpoint API yang dibutuhkan serta parameternya ada pada file swagger.json

Halaman yang sudah disiapkan :
  - Login
  - Register
  - Daftar Pemakai 
    > List
    > Tambah
    > Ubah
    > Hapus
    > Overide Password

Jika ada bagian-bagian yang error silahkan report :) 

Cara instalasi : 
- Masuk ke folder utama aplikasi lalu jalankan : npm install
- Ubah parameter pada vite.config.mjs sesuai dengan lokasi API server anda
            target: "http://localhost:5132",
- Untuk koneksi menggunakan axios, ubah file .env.local agar sesuai dengan target API Server anda
      VITE_BASE_URL = http://localhost:5132
      VITE_API_URL = http://localhost:5132/api
      VITE_AUTH_URL = http://localhost:5132/auth
- pastikan server API server sudah siap 
- lalu eksekusi dengan : npm start atau npm run start --force



Semoga bermanfaat




