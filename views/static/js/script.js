const _loginForm = document.getElementById('login-form');
if (_loginForm) _loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn      = document.getElementById('btn-submit');
    const alertBox = document.querySelector('.alert');

    if (alertBox) alertBox.remove();

    // Loading state
    btn.classList.add('loading');
    btn.disabled = true;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.querySelector('[name="remember"]').checked;

    try {
        const res = await fetch('/web/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, remember })
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = data.redirect || '/web/dashboard';
        } else {
            showAlert(data.message || 'Invalid username or password.');
        }
    } catch (err) {
        showAlert('Network error. Please try again.');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

function showAlert(message) {
    const form = document.getElementById('login-form');
    const div  = document.createElement('div');
    div.className = 'alert alert-error';
    div.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86l-8.19 14.2A2 2 0 003.83 21h16.34a2 2 0 001.73-3l-8.19-14.14a2 2 0 00-3.42.0z"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}`;
    form.parentElement.insertBefore(div, form);
}


function changeLimit(val) {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', val);
    url.searchParams.set('page', 1);
    window.location.href = url.toString();
}

const searchInput = document.querySelector('.search-input');
let searchTimer;
if (searchInput) {
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => document.getElementById('search-form').submit(), 400);
    });
}

function openCreateModal() {
    document.getElementById('create-modal').classList.add('open');
    document.getElementById('create-user-form').reset();
    document.getElementById('create-alert').style.display = 'none';
}

function closeCreateModal(e) {
    if (e && e.target !== document.getElementById('create-modal')) return;
    document.getElementById('create-modal').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('create-modal').classList.remove('open');
});

async function submitCreateUser(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('create-submit-btn');
    const alertBox = document.getElementById('create-alert');
    alertBox.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Creating…';

    const body = {
        name:         form.name.value.trim(),
        user_name:    form.user_name.value.trim(),
        email:        form.email.value.trim(),
        password:     form.password.value,
        is_superuser: form.is_superuser.checked
    };

    try {
        const res  = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
                const data = await res.json();
                if (res.ok) {
                    document.getElementById('create-modal').classList.remove('open');
                    window.location.reload();
                } else {
                    alertBox.textContent = data.error || 'Failed to create user.';
                    alertBox.style.display = 'block';
                }
            } catch {
                alertBox.textContent = 'Network error. Please try again.';
                alertBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Create User';
            }
        }
