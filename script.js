// Tombol Log Out di Navbar halaman Utama AI
document.getElementById("logout-btn").addEventListener("click", () => {
    // Hapus sesi login dari browser
    localStorage.removeItem("isLoggedIn");
    // Alihkan paksa kembali ke halaman login.html
    window.location.href = "index.html";
});

// LOGIKA UTAMA CHATBOT (NOVA AI INTEGRATION)
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const messageText = inputField.value.trim();

    if (messageText === '') return;

    // 1. Tampilkan pesan User
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = messageText;
    chatBox.appendChild(userMessageDiv);

    inputField.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Tampilkan Loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading-message';
    loadingDiv.id = 'loading-indicator';
    loadingDiv.textContent = 'Nova sedang merespon...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Ambil data dari API
    try {
        const apiUrl = `https://starlabs.biz.id/api/opus-4.8.php?teks=${encodeURIComponent(messageText)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Gagal terhubung ke server API.');
        }

        const data = await response.json();
        
        // Hapus indikator loading
        document.getElementById('loading-indicator').remove();

        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        
        // Membaca respon API dengan aman agar tidak keluar [object Object]
        if (data) {
            if (typeof data.result === 'object' && data.result !== null) {
                aiMessageDiv.textContent = data.result.text || data.result.message || JSON.stringify(data.result);
            } else if (data.result) {
                aiMessageDiv.textContent = data.result;
            } else if (data.response) {
                aiMessageDiv.textContent = data.response;
            } else {
                aiMessageDiv.textContent = typeof data === 'object' ? (data.text || JSON.stringify(data)) : data;
            }
        } else {
            aiMessageDiv.textContent = 'Maaf, tidak ada respon dari sistem.';
        }
        
        chatBox.appendChild(aiMessageDiv);

    } catch (error) {
        console.error(error);
        const errorIndicator = document.getElementById('loading-indicator');
        if (errorIndicator) errorIndicator.remove();

        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        aiMessageDiv.style.borderLeftColor = '#ff4d4d';
        aiMessageDiv.textContent = 'Terjadi kesalahan sistem atau API sedang offline.';
        chatBox.appendChild(aiMessageDiv);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
