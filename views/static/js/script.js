document.getElementById('login-form').addEventListener('submit', async function (e) {
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
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, remember })
        });

        const data = await res.json();

        if (res.ok) {
            // Redirect on success
            window.location.href = data.redirect || '/';
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

    const svg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('d', 'M12 9v4m0 4h.01M10.29 3.86l-8.19 14.2A2 2 0 003.83 21h16.34a2 2 0 001.73-3l-8.19-14.14a2 2 0 00-3.42.0z');
    svgPath.setAttribute('stroke', 'currentColor');
    svgPath.setAttribute('stroke-width', '1.8');
    svgPath.setAttribute('stroke-linecap', 'round');
    svgPath.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(svgPath);

    div.appendChild(svg);
    div.appendChild(document.createTextNode(message));
    form.parentElement.insertBefore(div, form);
}
