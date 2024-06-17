const dbName = "ProductDatabase";
const dbVersion = 4;
const storeName = "products";
const notificationStoreName = "notifications"; 
const messageStoreName = "messages"; 
const cashierStoreName = "cashier";

// Open (or create) the database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
                store.createIndex("name", "name", { unique: true });
                storeDummyData(store);
            }
            if (!db.objectStoreNames.contains(notificationStoreName)) {
                const notificationStore = db.createObjectStore(notificationStoreName, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(messageStoreName)) {
                const messageStore = db.createObjectStore(messageStoreName, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(cashierStoreName)) {
                const cashierStore = db.createObjectStore(cashierStoreName, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Database error: ${event.target.errorCode}`);
        };
    });
}

// Function to store dummy data
function storeDummyData(store) {
    const dummyData = generateDummyData();
    dummyData.forEach(item => {
        store.add(item);
    });
}

// Generate dummy data
function generateDummyData() {
    const categories = [
        { name: "Bahan Bangunan", items: [
            { name: "Semen", price: 50000 },
            { name: "Pasir", price: 30000 },
            { name: "Batu Bata", price: 1000 },
            { name: "Kayu", price: 120000 },
            { name: "Cat Tembok", price: 85000 },
            { name: "Paku", price: 5000 },
            { name: "Keramik", price: 45000 },
            { name: "Gipsum", price: 75000 },
            { name: "Besi Beton", price: 100000 },
            { name: "Pipa PVC", price: 30000 }
        ]},
        { name: "ATK", items: [
            { name: "Pensil", price: 2000 },
            { name: "Pulpen", price: 3000 },
            { name: "Buku Tulis", price: 10000 },
            { name: "Penghapus", price: 1500 },
            { name: "Penggaris", price: 5000 },
            { name: "Stabilo", price: 8000 },
            { name: "Map", price: 5000 },
            { name: "Kertas HVS", price: 50000 },
            { name: "Sticky Notes", price: 10000 },
            { name: "Stapler", price: 25000 }
        ]},
        { name: "Bahan Tekstil", items: [
            { name: "Kain Katun", price: 50000 },
            { name: "Kain Sutra", price: 150000 },
            { name: "Kain Linen", price: 60000 },
            { name: "Kain Wool", price: 100000 },
            { name: "Kain Denim", price: 80000 },
            { name: "Kain Flanel", price: 30000 },
            { name: "Kain Satin", price: 75000 },
            { name: "Kain Drill", price: 70000 },
            { name: "Kain Rayon", price: 45000 },
            { name: "Kain Blacu", price: 40000 }
        ]},
        { name: "Otomotif", items: [
            { name: "Ban Mobil", price: 800000 },
            { name: "Oli Mesin", price: 100000 },
            { name: "Aki", price: 850000 },
            { name: "Busi", price: 25000 },
            { name: "Kampas Rem", price: 150000 },
            { name: "Filter Udara", price: 50000 },
            { name: "Filter Oli", price: 30000 },
            { name: "Wiper", price: 100000 },
            { name: "Lampu Depan", price: 200000 },
            { name: "Klakson", price: 75000 }
        ]},
        { name: "Elektronik", items: [
            { name: "Televisi", price: 3000000 },
            { name: "Kulkas", price: 2500000 },
            { name: "Mesin Cuci", price: 3500000 },
            { name: "Microwave", price: 800000 },
            { name: "AC", price: 3000000 },
            { name: "Setrika", price: 250000 },
            { name: "Blender", price: 300000 },
            { name: "Rice Cooker", price: 500000 },
            { name: "Speaker", price: 600000 },
            { name: "Laptop", price: 8000000 }
        ]}
    ];

    const items = [];
    categories.forEach(category => {
        category.items.forEach(item => {
            items.push({
                name: item.name,
                category: category.name,
                price: item.price
            });
        });
    });

    return items;
}

// Add a new product
async function addProduct(product) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add(product);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Add error: ${event.target.errorCode}`);
        };
    });
}

// Get all products
async function getAllProducts() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event_1) => {
            reject(`Get all error: ${event_1.target.errorCode}`);
        };
    });
}

// Update a product
async function updateProduct(product) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(product);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Update error: ${event.target.errorCode}`);
        };
    });
}

// Delete a product
async function deleteProduct(id) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Delete error: ${event.target.errorCode}`);
        };
    });
}

// Add a new notification
async function addNotification(notification) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([notificationStoreName], "readwrite");
        const store = transaction.objectStore(notificationStoreName);
        const request = store.add(notification);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Add notification error: ${event.target.errorCode}`);
        };
    });
}

// Get all notifications
async function getAllNotifications() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([notificationStoreName], "readonly");
        const store = transaction.objectStore(notificationStoreName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Get all notifications error: ${event.target.errorCode}`);
        };
    });
}

// Clear all notifications
async function clearNotifications() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([notificationStoreName], "readwrite");
        const store = transaction.objectStore(notificationStoreName);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Clear notifications error: ${event.target.errorCode}`);
        };
    });
}

// Add a new transaction
async function addTransaction(transaction) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transactionObj = {
            ...transaction,
            time: new Date().toLocaleString()
        };

        const transactionStore = db.transaction([transactionStoreName], "readwrite").objectStore(transactionStoreName);
        const request = transactionStore.add(transactionObj);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Add transaction error: ${event.target.errorCode}`);
        };
    });
}

// Get all transactions
async function getAllTransactions() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transactionStore = db.transaction([transactionStoreName], "readonly").objectStore(transactionStoreName);
        const request = transactionStore.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Get all transactions error: ${event.target.errorCode}`);
        };
    });
}

// Clear all transactions
async function clearTransactions() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transactionStore = db.transaction([transactionStoreName], "readwrite").objectStore(transactionStoreName);
        const request = transactionStore.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Clear transactions error: ${event.target.errorCode}`);
        };
    });
}

// Add a new message
async function addMessage(message) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([messageStoreName], "readwrite");
        const store = transaction.objectStore(messageStoreName);
        const request = store.add(message);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Add message error: ${event.target.errorCode}`);
        };
    });
}

// Get all messages
async function getAllMessages() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([messageStoreName], "readonly");
        const store = transaction.objectStore(messageStoreName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Get all messages error: ${event.target.errorCode}`);
        };
    });
}

// Clear all messages
async function clearMessages() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([messageStoreName], "readwrite");
        const store = transaction.objectStore(messageStoreName);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Clear messages error: ${event.target.errorCode}`);
        };
    });
}

// Add a new cashier transaction
async function addCashierTransaction(transaction) {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transactionStore = db.transaction([cashierStoreName], "readwrite");
        const store = transactionStore.objectStore(cashierStoreName);
        const request = store.add(transaction);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(`Add cashier transaction error: ${event.target.errorCode}`);
        };
    });
}

// Get all cashier transactions
async function getAllCashierTransactions() {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction([cashierStoreName], "readonly");
        const store = transaction.objectStore(cashierStoreName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Get all cashier transactions error: ${event.target.errorCode}`);
        };
    });
}

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