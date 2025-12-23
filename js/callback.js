const modal = document.getElementById("callback-modal");
const closebtn = document.querySelector(".close");
const confirm = document.getElementById("confirm");
const nameInput = document.getElementById("callbackName");
const phoneInput = document.getElementById("callbackPhone");

function openModal() {
    modal.classList.remove('callBack-hidden');
    modal.classList.add('callBack-active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('callBack-hidden');
    modal.classList.remove('callBack-active');
    document.body.style.overflow = '';
}

document.querySelectorAll(".callBack").forEach(link => {
    link.addEventListener('click', function (o) {
        o.preventDefault();
        openModal();
    });
});

if (closebtn) {
    closebtn.addEventListener('click', closeModal);
}
modal.addEventListener('click', function (o) {
    if (o.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function (o) {
    if (o.key === 'Escape' && modal.classList.contains('callBack-active')) {
        closeModal();
    }
});

if (confirm) {
    confirm.addEventListener('click', function () {
        if (!nameInput.value.trim()) {
            showError('Заполните поле', 'Пожалуйста, введите ваше имя');
            nameInput.focus();
            return;
        }

        if (!phoneInput.value.trim()) {
            showError('Заполните поле', 'Пожалуйста, введите номер телефона');
            phoneInput.focus();
            return;
        }
        confirm.textContent = 'Отправляем...';
        confirm.disabled = true;

        setTimeout(() => {
            showSuccess();

            nameInput.value = '';
            phoneInput.value = '';

            confirm.textContent = 'Отправить';
            confirm.disabled = false;

            setTimeout(closeModal, 2000);
        }, 1500);
    });
}

if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (!value.startsWith('375')) {
                value = '375' + value;
            }

            let formatted = '+375 ';

            if (value.length > 3) {
                formatted += '(' + value.substring(3, 5) + ') ';
            }
            if (value.length >= 5) {
                formatted += value.substring(5, 8);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(8, 10);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(10, 12);
            }

            e.target.value = formatted;
        }
    });

    phoneInput.addEventListener('focus', function () {
        if (!this.value) {
            this.value = '+375 ';
        }
    });
}

const successModal = document.getElementById('successModal');
const wrongModal = document.getElementById('wrongModal');

function showSuccess() {
    hideAllModals();
    successModal.classList.remove('hidden');
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showError(title = 'Ошибка', message = 'Что-то пошло не так') {
    hideAllModals();
}

function hideAllModals() {
    [successModal, wrongModal].forEach(modal => {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('show');
        }
    });
    document.body.style.overflow = '';
}

function showError(title = 'Ошибка', message = 'Что-то пошло не так') {
    hideAllModals();

    const errorTitle = wrongModal.querySelector('h2');
    const errorMessage = wrongModal.querySelector('p');

    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;

    wrongModal.classList.remove('hidden');
    wrongModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showSuccess() {
    hideAllModals();
    successModal.classList.remove('hidden');
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

window.showSuccess = showSuccess;
window.showError = showError;
window.hideAllModals = hideAllModals;

document.querySelectorAll('#successModal .close, #wrongModal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', hideAllModals);
});

document.querySelector('.success-btn')?.addEventListener('click', hideAllModals);
document.querySelector('.wrong-btn')?.addEventListener('click', hideAllModals);

[successModal, wrongModal].forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            hideAllModals();
        }
    });
});