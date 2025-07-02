const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
});

function applyFilter(filter) {
  preview.classList.remove('zoomed');
  preview.style.filter = filter === 'grayscale' ? 'grayscale(100%)' :
                         filter === 'sepia' ? 'sepia(100%)' : 'none';
}

function applyZoom() {
  preview.classList.toggle('zoomed');
}
