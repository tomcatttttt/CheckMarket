document.getElementById("loginButton").addEventListener("click", () => {
    browser.runtime.sendMessage({ type: "login" });
});
