document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("callback-modal");
    const closebtn = document.querySelector(".close");
    const confirmBtn = document.getElementById("confirm");
    const nameInput = document.getElementById("callbackName");
    const phoneInput = document.getElementById("callbackPhone");
    const successModal = document.getElementById('successModal');
    const wrongModal = document.getElementById('wrongModal');

    if (!modal) {
        return;
    }

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

    function hideAllModals() {
        if (successModal) {
            successModal.classList.add('hidden');
            successModal.classList.remove('show');
        }
        if (wrongModal) {
            wrongModal.classList.add('hidden');
            wrongModal.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    function showSuccess() {
        hideAllModals();
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('show');
        }
        document.body.style.overflow = 'hidden';
    }

    function showError(title = 'Ошибка', message = 'Что-то пошло не так') {
        hideAllModals();
        if (wrongModal) {
            const errorTitle = wrongModal.querySelector('h2');
            const errorMessage = wrongModal.querySelector('p');
            if (errorTitle) errorTitle.textContent = title;
            if (errorMessage) errorMessage.textContent = message;
            wrongModal.classList.remove('hidden');
            wrongModal.classList.add('show');
        }
        document.body.style.overflow = 'hidden';
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

    if (confirmBtn && nameInput && phoneInput) {
        confirmBtn.addEventListener('click', function () {
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
            confirmBtn.textContent = 'Отправляем...';
            confirmBtn.disabled = true;

            setTimeout(() => {
                showSuccess();

                nameInput.value = '';
                phoneInput.value = '';

                confirmBtn.textContent = 'Отправить';
                confirmBtn.disabled = false;

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

    document.querySelectorAll('#successModal .close, #wrongModal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', hideAllModals);
    });

    document.querySelector('.success-btn')?.addEventListener('click', hideAllModals);
    document.querySelector('.wrong-btn')?.addEventListener('click', hideAllModals);

    if (successModal) {
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                hideAllModals();
            }
        });
    }
    if (wrongModal) {
        wrongModal.addEventListener('click', function (e) {
            if (e.target === wrongModal) {
                hideAllModals();
            }
        });
    }
});