const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const btnSubmit = document.getElementById('submit-button');
const inputId = document.getElementById('product-id');


const API_URL = 'https://tareadiciembre.onrender.com/productos'; 

async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        productList.innerHTML = ''; 
        // Si data es el array que vimos en Render, esto funcionará perfecto
        data.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `<span><strong>${p.item}</strong> - $${p.precio}</span>`;

            const actions = document.createElement('div');
            actions.className = 'actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.onclick = () => {
                inputId.value = p.id;
                document.getElementById('name').value = p.item;
                document.getElementById('price').value = p.precio;
                btnSubmit.textContent = 'Actualizar';
                window.scrollTo(0, 0);
            };

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => deleteItem(p.id);

            actions.append(editBtn, delBtn);
            li.appendChild(actions);
            productList.appendChild(li);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

async function deleteItem(id) {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadProducts();
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = inputId.value;
    const data = {
        item: document.getElementById('name').value,
        precio: parseFloat(document.getElementById('price').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    inputId.value = '';
    btnSubmit.textContent = 'Guardar en la lista';
    productForm.reset();
    loadProducts();
});


loadProducts();


