document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login');
    const statusText = document.getElementById('status');

    // Перевіряємо, чи є збережений токен
    browser.storage.local.get('accessToken').then(result => {
        if (result.accessToken) {
            statusText.textContent = 'Ви успішно залогінилися!';
            loginButton.style.display = 'none';
        }
    });

    loginButton.addEventListener('click', () => {
        // Надсилаємо повідомлення для початку процесу логіну
        browser.runtime.sendMessage({ action: 'login' }).then(response => {
            if (response.success) {
                // Зберігаємо токен у локальному сховищі
                browser.storage.local.set({ accessToken: response.token }).then(() => {
                    statusText.textContent = 'Ви успішно залогінилися!';
                    loginButton.style.display = 'none';
                });
            } else {
                console.error('Помилка логіну:', response.error);
                statusText.textContent = 'Помилка логіну. Спробуйте ще раз.';
            }
        });
    });
});
