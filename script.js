const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');
let currentFilter = 'none';

fileInput.addEventListener('change', async function () {
  const file = fileInput.files[0];
  if (!file) return;

  const tempURL = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append('imagen', file);

  let finalURL = tempURL;

  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('Respuesta inválida del servidor');
    }

    if (!res.ok) {
      alert('Error del servidor: ' + data.error);
    } else {
      finalURL = data.url;
      alert(`Imagen subida y guardada: ${data.nombre}`);
    }
  } catch (error) {
    alert('Error al subir imagen: ' + error.message);
    console.error('Error completo:', error);
  }

  const img = document.createElement('img');
  img.src = finalURL;
  img.style.filter = currentFilter;

  img.addEventListener('click', () => {
    img.classList.toggle('zoomed');
  });

  gallery.appendChild(img);
});

function applyFilter(filter) {
  currentFilter = filter === 'grayscale' ? 'grayscale(100%)' :
                  filter === 'sepia' ? 'sepia(100%)' : 'none';

  document.querySelectorAll('#gallery img').forEach(img => {
    img.style.filter = currentFilter;
  });
}

function applyZoom() {
  document.querySelectorAll('#gallery img').forEach(img => {
    img.classList.toggle('zoomed');
  });
}
