let deferredPrompt;
const installBtn = document.getElementById("installBtn");
installBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  installBtn.style.display = "none";
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response: ${outcome}`);
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  console.log("🎉 Aplikasi sudah diinstall!");
  installBtn.style.display = "none";
});
