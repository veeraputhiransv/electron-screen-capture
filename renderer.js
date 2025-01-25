document.getElementById("capture-btn").addEventListener("click", async () => {
  const result = await window.electronAPI.captureScreen();

  if (result.success) {
    const message = `Screenshot saved at: ${result.filePath}`;
    document.getElementById("status").textContent = message;
    console.log(message);
  } else {
    const errorMessage = `Error: ${result.error}`;
    document.getElementById("status").textContent = errorMessage;
    console.error(errorMessage);
  }
});
