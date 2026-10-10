let cart = JSON.parse(localStorage.getItem('tapni_cart')) || [];

function saveCart() { 
    localStorage.setItem('tapni_cart', JSON.stringify(cart)); 
}

function addToCart(name, price, imgColor) {
    cart.push({ id: Date.now(), name, price, imgColor });
    saveCart();
    updateCartUI();
    
    // Otevře košík po přidání
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (!drawer || !overlay) return;

    if (drawer.classList.contains('translate-x-full')) {
        updateCartUI();
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        drawer.classList.remove('translate-x-full');
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-content');
    const totalEl = document.getElementById('cart-total');
    const titleEl = document.getElementById('cart-title');
    const badge = document.getElementById('cart-badge');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (titleEl) titleEl.innerText = `Košík (${cart.length})`;
    
    if (badge) {
        if (cart.length > 0) {
            badge.innerText = cart.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    if (checkoutBtn) {
        if (cart.length > 0) {
            checkoutBtn.style.pointerEvents = 'auto';
            checkoutBtn.classList.remove('opacity-50');
        } else {
            checkoutBtn.style.pointerEvents = 'none';
            checkoutBtn.classList.add('opacity-50');
        }
    }

    if (!container || !totalEl) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center mt-12">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Košík je zatím prázdný</h3>
                <p class="text-gray-500 text-sm mb-6">Vyberte si tag, který vám sedne.</p>
                <button onclick="toggleCart(); window.location.href='shop.html'" class="bg-dark text-white px-6 py-3 rounded-full font-medium text-sm">Prohlédnout produkty &rarr;</button>
            </div>`;
        totalEl.innerText = "0 Kč";
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        let safeColorClass = item.imgColor.replace('bg-dots', '').trim();
        html += `
            <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                <div class="w-16 h-16 ${safeColorClass} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-inner relative overflow-hidden">
                    <div class="z-10">)(</div>
                </div>
                <div class="flex-grow">
                    <h4 class="font-bold text-sm">${item.name}</h4>
                    <div class="text-gray-500 text-sm">${item.price} Kč</div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 p-2">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalEl.innerText = `${total} Kč`;
}

document.addEventListener('DOMContentLoaded', updateCartUI);