const axios = require("axios");

const api_key = "126119U16c15d8a9a3fce037004347a7b18e74b";
const url = "https://smshub.org/stubs/handler_api.php?";

let currentNumber = null;
let currentId = null;

async function getBalance() {
  try {
    const response = await axios.get(
      url + `api_key=${api_key}&action=getBalance&currency=840`
    );
    console.log("Saldo Anda: ", response.data);
  } catch (error) {
    console.error(error);
  }
}

async function getNumber(readline) {
  try {
    const response = await axios.get(
      url +
        `api_key=${api_key}&action=getNumber&service=tg&operator=axis&country=6&maxPrice=0.25&currency=840`
    );

    if (response.data.startsWith("ACCESS_NUMBER")) {
      const [access, id, number] = response.data.split(":");
      currentId = id;
      currentNumber = number;
      console.log(`Nomor berhasil dibeli: ${number} (ID: ${id})`);
      await getBalance();
      chooseNextAction(readline);
    } else {
      console.log("Gagal membeli nomor: ", response.data);
      showMenu(readline);
    }
  } catch (error) {
    console.error(error);
  }
}

async function checkOtp(readline) {
  try {
    if (!currentId) {
      console.log("Tidak ada ID aktivasi yang tersedia.");
      return chooseNextAction(readline);
    }
    const response = await axios.get(
      url + `api_key=${api_key}&action=getStatus&id=${currentId}`
    );
    console.log("Status OTP: ", response.data);
    chooseNextAction(readline);
  } catch (error) {
    console.error(error);
  }
}

async function setStatus(readline) {
  try {
    if (!currentId) {
      console.log("Tidak ada ID aktivasi yang tersedia.");
      return chooseNextAction(readline);
    }
    const response = await axios.get(
      url + `api_key=${api_key}&action=setStatus&status=8&id=${currentId}`
    );
    console.log("Nomor berhasil dihapus: ", response.data);
    currentId = null; // Reset setelah dihapus
    currentNumber = null;
    await getBalance();
    showMenu(readline);
  } catch (error) {
    console.error(error);
  }
}

function showMenu(readline) {
  console.log("\n=== Menu ===");
  console.log("1. Beli Nomor");
  console.log("2. Keluar");

  readline.question("Pilih opsi (1/2): ", (choice) => {
    switch (choice) {
      case "1":
        getNumber(readline);
        break;
      case "2":
        console.log("Keluar...");
        readline.close();
        break;
      default:
        console.log("Opsi tidak valid, coba lagi.");
        showMenu(readline);
        break;
    }
  });
}

function chooseNextAction(readline) {
  console.log("\n=== Menu ===");
  console.log("1. Cek OTP");
  console.log("2. Set Status (Hapus Nomor)");
  console.log("3. Kembali ke Awal");
  console.log("4. Keluar");

  readline.question("Pilih opsi (1/2/3/4): ", (choice) => {
    switch (choice) {
      case "1":
        checkOtp(readline);
        break;
      case "2":
        setStatus(readline);
        break;
      case "3":
        showMenu(readline);
        break;
      case "4":
        console.log("Keluar...");
        readline.close();
        break;
      default:
        console.log("Opsi tidak valid, coba lagi.");
        chooseNextAction(readline);
        break;
    }
  });
}

// Mulai program dan tampilkan menu
function start() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  getBalance().then(() => showMenu(readline));
}

start();
