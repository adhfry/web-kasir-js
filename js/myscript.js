// app.js
document.addEventListener("DOMContentLoaded", async function() {
    // Hide loading screen when content is fully loaded
    window.addEventListener("load", function() {
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.style.display = "none";
        const agreeCheck = document.getElementById('agreeCheck');
        const confirmButton = document.getElementById('confirmButton');

        // Show welcome modal if first time visiting
        if (localStorage.getItem("firstVisit") === null) {
            $('#welcomeModal').modal('show'); // Show welcome modal
            
            confirmButton.disabled = true;

            // Enable/disable button based on checkbox state
            agreeCheck.addEventListener('change', function() {
                confirmButton.disabled = !this.checked;
            });
            // Save to local storage when the confirm button is clicked
            confirmButton.addEventListener("click", function() {
                if (agreeCheck.checked) {
                localStorage.setItem("agreedToTerms", "true");
                }
            });

            // Open database and add dummy data if it doesn't exist
            openDatabase().then(() => {
                localStorage.setItem("firstVisit", "true");
                alert("Database has been initialized with dummy data.\n menggunakan indexedDB sebagai penyimpanan data client\n  Nama : Ahda Firly Barori\n  NIM : 2302310186\n  Kelas : Informatika D 23\n  Dosen Pengampu : Muhammad Najib");
            }).catch(error => {
                console.error("Error initializing database:", error);
            });
        } else if (localStorage.getItem("agreedToTerms") === null) {
            $('#welcomeModal').modal('show');
            confirmButton.disabled = true;

            // Enable/disable button based on checkbox state
            agreeCheck.addEventListener('change', function() {
                confirmButton.disabled = !this.checked;
            });

            // Save to local storage when the confirm button is clicked
            confirmButton.addEventListener("click", function() {
                if (agreeCheck.checked) {
                localStorage.setItem("agreedToTerms", "true");
                }
            });

        }{

        }
    });
    

    // Function to format time duration
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours} jam, ${minutes} menit, ${secs} detik`;
    }

    // Record the time when the page was accessed
    const startTime = new Date();

    // Update the login message every second
    setInterval(function() {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const formattedDuration = formatDuration(elapsedSeconds);

        // Display the message
        const message = `Anda baru saja login sejak ${formattedDuration} yang lalu`;
        document.getElementById("loginMessage").textContent = message;
    }, 1000);

    const helpButton = document.getElementById("helpButton");
    helpButton.addEventListener("click", function() {
        $('#helpModal').modal('show'); // Show help modal
    });
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    function populateProductTable(products) {
        const tableBody = document.getElementById('productTableBody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatRupiah(product.price)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    document.getElementById('productButton').addEventListener('click', function() {
        getAllProducts().then(products => {
            populateProductTable(products);
            $('#productModal').modal('show');
        }).catch(error => {
            console.error("Error fetching products:", error);
        });
    });
    document.getElementById('productButton2').addEventListener('click', function() {
        getAllProducts().then(products => {
            populateProductTable(products);
            $('#productModal').modal('show');
        }).catch(error => {
            console.error("Error fetching products:", error);
        });
    });

    function updateClock() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const now = new Date();
        const dayName = days[now.getDay()];
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeString = `${dayName}, ${hours}:${minutes}:${seconds}`;
  
        $('#clock').text(timeString);
  
        let greeting = '';
        if (hours >= 5 && hours < 12) {
          greeting = 'Selamat Pagi';
        } else if (hours >= 12 && hours < 15) {
          greeting = 'Selamat Siang';
        } else if (hours >= 15 && hours < 18) {
          greeting = 'Selamat Sore';
        } else {
          greeting = 'Selamat Malam';
        }
  
        $('#greeting').text(greeting);
      }
      setInterval(updateClock, 1000);
    updateClock();


    const visitorCountElement = document.getElementById("visitorCount");

    // Ambil nilai pengunjung dari localStorage
    let visitCount = localStorage.getItem("visitCount");

    // Jika belum ada, inisialisasi dengan 56
    if (visitCount === null) {
        visitCount = 2101;
    } else {
        visitCount = parseInt(visitCount);
    }

    // Tingkatkan nilai pengunjung
    visitCount += 1;

    // Simpan nilai pengunjung kembali ke localStorage
    localStorage.setItem("visitCount", visitCount);

    // Tampilkan nilai pengunjung di halaman
    visitorCountElement.textContent = visitCount
});
$(document).ready(function() {
    // Load notifications on page load
    loadNotifications();

    // Event listener for checking item name
    $('#itemName').on('input', function() {
        const itemName = $(this).val().trim().toLowerCase(); // Convert input to lowercase
        if (itemName !== "") {
            checkItemName(itemName)
                .then(isDuplicate => {
                    if (isDuplicate) {
                        $('#itemNameWarning').text(`Barang "${isDuplicate}" sudah ada`).show();
                        $('#confirmButton').prop('disabled', true);
                    } else {
                        $('#itemNameWarning').hide();
                        $('#confirmButton').prop('disabled', false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            $('#itemNameWarning').hide();
            $('#confirmButton').prop('disabled', false);
        }
    });

    // Form submission
    $('#inputForm').on('submit', function(e) {
        e.preventDefault();

        const category = $('#category').val();
        const itemName = $('#itemName').val().trim();
        const itemPrice = parseFloat($('#itemPrice').val());

        const newItem = { category, name: itemName, price: itemPrice };

        addProduct(newItem)
            .then(() => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data berhasil ditambahkan',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                const notification = {
                    message: `Berhasil menambahkan data: ${itemName}`,
                    time: new Date().toLocaleString()
                };

                addNotification(notification)
                    .then(() => {
                        loadNotifications();
                    });

                $('#inputForm')[0].reset();
                $('#itemNameWarning').hide();
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat menambahkan data',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    // Clear notifications on button click
    $('#clearNotifications').on('click', function() {
        clearNotifications()
            .then(() => {
                $('#notificationCount').text('0').hide();
                $('#notificationList').empty();
            });
    });

    // Function to check if item name exists in IndexedDB
    async function checkItemName(inputName) {
        const db = await openDatabase();
        return await new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                const items = event.target.result;
                const isDuplicate = items.find(item => item.name.toLowerCase().includes(inputName));
                resolve(isDuplicate ? isDuplicate.name : false);
            };

            request.onerror = (event) => {
                reject(`Check name error: ${event.target.errorCode}`);
            };
        });
    }

    // Function to load notifications
    async function loadNotifications() {
        const notifications = await getAllNotifications();
        const notificationList = $('#notificationList');
        const notificationCount = $('#notificationCount');
        
        notificationList.empty();
        notifications.forEach(notification => {
            const newNotification = `
                <a class="dropdown-item preview-item">
                    <div class="preview-thumbnail">
                        <div class="preview-icon bg-success">
                            <i class="mdi mdi-information mx-0"></i>
                        </div>
                    </div>
                    <div class="preview-item-content">
                        <h6 class="preview-subject font-weight-normal">${notification.message}</h6>
                        <p class="font-weight-light small-text mb-0 text-muted">
                            ${notification.time}
                        </p>
                    </div>
                </a>
            `;
            notificationList.append(newNotification);
        });

        notificationCount.text(notifications.length).show();
    }


    // Fungsi untuk menginisialisasi Typeahead
  async function initializeTypeahead() {
    const allProducts = await getAllProducts();
    const productNames = allProducts.map(product => product.name);

    // Memperbarui source typeahead dengan data dari IndexedDB
    $('#namaBarang').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'products',
      source: substringMatcher(productNames)
    });
  }

  // Fungsi untuk mencocokkan substring
  function substringMatcher(strs) {
    return function findMatches(q, cb) {
      const matches = [];
      const substrRegex = new RegExp(q, 'i');
      strs.forEach(str => {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
      cb(matches);
    };
  }

  // Menginisialisasi Typeahead
  initializeTypeahead();

  // Mengambil harga barang berdasarkan nama
  async function getProductByName(name) {
    const allProducts = await getAllProducts();
    return allProducts.find(product => product.name === name);
  }

  // Fungsi untuk memperbarui harga dan total harga
  async function updatePriceAndTotal() {
    const namaBarang = $('#namaBarang').val();
    const jumlahBarang = $('#jumlahBarang').val();
    const product = await getProductByName(namaBarang);

    if (product) {
      const hargaBarang = product.price;
      $('#hargaBarang').val(hargaBarang);
      const totalHarga = hargaBarang * jumlahBarang;
      $('#totalHarga').val(totalHarga);
      $('#barangWarning').hide();
      enableForm(true);
    } else {
      $('#hargaBarang').val('');
      $('#totalHarga').val('');
      $('#barangWarning').show();
      enableForm(false);
    }
  }

  // Fungsi untuk mengaktifkan atau menonaktifkan form
  function enableForm(enable) {
    $('#jumlahBarang').prop('disabled', !enable);
    $('#bayar').prop('disabled', !enable);
    $('#selesaikanPembayaran').prop('disabled', !enable);
  }

  // Event listener untuk input namaBarang
  $('#namaBarang').on('typeahead:select', function () {
    updatePriceAndTotal();
  }).on('blur', function () {
    updatePriceAndTotal();
  });

  // Event listener untuk jumlahBarang
  $('#jumlahBarang').on('input', function () {
    updatePriceAndTotal();
  });

  // Event listener untuk tombol +/- jumlahBarang
  $('#increaseQuantity').on('click', function () {
    const currentVal = parseInt($('#jumlahBarang').val());
    $('#jumlahBarang').val(currentVal + 1);
    updatePriceAndTotal();
  });

  $('#decreaseQuantity').on('click', function () {
    const currentVal = parseInt($('#jumlahBarang').val());
    if (currentVal > 1) {
      $('#jumlahBarang').val(currentVal - 1);
      updatePriceAndTotal();
    }
  });

  // Event listener untuk input bayar
  $('#bayar').on('input', function () {
    const totalHarga = $('#totalHarga').val();
    const bayar = $(this).val();
    const kembalian = bayar - totalHarga;
    if (kembalian >= 0) {
      $('#kembalian').val(kembalian);
      $('#bayarWarning').hide();
      $('#selesaikanPembayaran').prop('disabled', false);
    } else {
      $('#kembalian').val('');
      $('#bayarWarning').show();
      $('#selesaikanPembayaran').prop('disabled', true);
    }
  });

  // Fungsi untuk menambahkan transaksi
  async function addTransactionToDB(transaction) {
    await addCashierTransaction(transaction);
    loadTransactionHistory();
  }
  // Get the current timestamp
  const now = new Date(Date.now());

  // Extract hours, minutes, and seconds
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the time as HH:MM:SS
  const currentTime = `${hours}:${minutes}:${seconds}`;
  // Event listener untuk submit form kasir
  $('#kasir-form').on('submit', function (event) {
    event.preventDefault();
    const transaction = {
      namaPelanggan: $('#namaPelanggan').val(),
      namaBarang: $('#namaBarang').val(),
      hargaBarang: $('#hargaBarang').val(),
      jumlahBarang: $('#jumlahBarang').val(),
      totalHarga: $('#totalHarga').val(),
      bayar: $('#bayar').val(),
      time: currentTime,
      kembalian: $('#kembalian').val()
    };
    addTransactionToDB(transaction);
    $('#receiptModal').modal('show');
    generateReceipt(transaction);
    clearForm();
  });

  // Fungsi untuk menghapus form setelah transaksi
  function clearForm() {
    $('#kasir-form')[0].reset();
    $('#hargaBarang').val('');
    $('#totalHarga').val('');
    $('#kembalian').val('');
    $('#selesaikanPembayaran').prop('disabled', true);
  }

  // Fungsi untuk memuat riwayat transaksi
  async function loadTransactionHistory() {
    const transactions = await getAllCashierTransactions();
    const tbody = $('#transactionHistory tbody');
    tbody.empty();
    transactions.forEach((transaction, index) => {
      const row = `<tr>
        <td>${index + 1}</td>
        <td>${transaction.namaPelanggan}</td>
        <td>${transaction.namaBarang}</td>
        <td>${transaction.hargaBarang}</td>
        <td>${transaction.jumlahBarang}</td>
        <td>${transaction.totalHarga}</td>
        <td>${transaction.time}</td>
        <td><button class="btn btn-danger deleteTransaction" data-id="${transaction.id}">Hapus</button></td>
      </tr>`;
      tbody.append(row);
    });

    // Event listener untuk tombol hapus transaksi
    $('.deleteTransaction').on('click', function () {
      const id = $(this).data('id');
      deleteTransaction(id);
    });
  }

  // Fungsi untuk menghapus transaksi
  async function deleteTransaction(id) {
    await deleteCashierTransaction(id);
    loadTransactionHistory();
  }

  // Fungsi untuk mencetak struk
  $('#printReceipt').on('click', function () {
    window.print();
  });

  // Fungsi untuk membuat struk pembelian
  function generateReceipt(transaction) {
    const receiptContent = `
      <p><strong>Nama Pelanggan:</strong> ${transaction.namaPelanggan}</p>
      <p><strong>Nama Barang:</strong> ${transaction.namaBarang}</p>
      <p><strong>Harga Barang:</strong> ${transaction.hargaBarang}</p>
      <p><strong>Jumlah Barang:</strong> ${transaction.jumlahBarang}</p>
      <p><strong>Total Harga:</strong> ${transaction.totalHarga}</p>
      <p><strong>Bayar:</strong> ${transaction.bayar}</p>
      <p><strong>Kembalian:</strong> ${transaction.kembalian}</p>
    `;
    $('#receiptContent').html(receiptContent);
  }

  // Muat riwayat transaksi saat halaman dimuat
  loadTransactionHistory();

  $('#close-modal').on('click', function(){
    $('#receiptModal').modal('hide');
  })

  async function deleteCashierTransaction(id) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([cashierStoreName], "readwrite");
        const store = transaction.objectStore(cashierStoreName);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Delete cashier transaction error: ${event.target.errorCode}`);
        };
    });
}
});

