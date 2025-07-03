let tareas = [];

const formulario = document.getElementById('formulario');
const idInput = document.getElementById('id-tarea');
const tituloInput = document.getElementById('titulo');
const descInput = document.getElementById('descripcion-texto');
const checkCompletada = document.getElementById('check-tarea-completada');
const listaTareas = document.getElementById('lista-tareas');

const idError = document.getElementById('id-error');
const tituloError = document.getElementById('titulo-error');
const descError = document.getElementById('desc-error');

// Limpiar caracteres peligrosos para evitar inyecciones
function limpiarEntrada(texto) {
    return texto
        .replace(/['";\\]/g, '') 
        .replace(/--/g, '')      
        .replace(/</g, '&lt;')   
        .replace(/>/g, '&gt;');
}

function limpiarErrores() {
    idError.classList.add('d-none');
    tituloError.classList.add('d-none');
    descError.classList.add('d-none');
}

function validarFormulario() {
    let valido = true;
    limpiarErrores();

    // Validar campos obligatorios y con formato
    const idValidado = limpiarEntrada(idInput.value.trim());
    const tituloValidado = limpiarEntrada(tituloInput.value.trim());
    const descValidado = limpiarEntrada(descInput.value.trim());

    if (!idValidado) {
        idError.textContent = "El ID es obligatorio.";
        idError.classList.remove('d-none');
        valido = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(idValidado)) {
        idError.textContent = "Solo letras y números.";
        idError.classList.remove('d-none');
        valido = false;
    } else if (idValidado.length > 10) {
        idError.textContent = "Máximo 10 caracteres.";
        idError.classList.remove('d-none');
        valido = false;
    } else if (tareas.some(t => t.id === idValidado)) {
        idError.textContent = "El ID ya existe.";
        idError.classList.remove('d-none');
        valido = false;
    }

    
    if (!tituloValidado) {
        tituloError.textContent = "El título es obligatorio.";
        tituloError.classList.remove('d-none');
        valido = false;
    } 
    else if (tituloValidado.length > 40) {
        tituloError.textContent = "Máximo 40 caracteres.";
        tituloError.classList.remove('d-none');
        valido = false;
    }

    if (!descValidado) {
        descError.textContent = "La descripción es obligatoria.";
        descError.classList.remove('d-none');
        valido = false;
    } else if (descValidado.length > 120) {
        descError.textContent = "Máximo 120 caracteres.";
        descError.classList.remove('d-none');
        valido = false;
    }

    return valido;
}

//Muestra las tareas en la lista y las va agregando al final
function renderTareas() {
    listaTareas.innerHTML = '';
    if (tareas.length === 0) {
        listaTareas.innerHTML = '<li class="list-group-item text-center text-muted">No hay tareas registradas.</li>';
        return;
    }
    tareas.forEach(tarea => {
        listaTareas.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center ${tarea.completada ? 'list-group-item-success' : ''}">
                <div>
                    <strong>${tarea.titulo}</strong> <span class="badge bg-secondary">${tarea.id}</span><br>
                    <span>${tarea.descripcion}</span>
                </div>
                <span class="badge ${tarea.completada ? 'bg-success' : 'bg-warning text-dark'}">
                    ${tarea.completada ? 'Completada' : 'Pendiente'}
                </span>
            </li>
        `;
    });
}

formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    // Añadir nueva tarea a la lista
    tareas.push({
        id: limpiarEntrada(idInput.value.trim()),
        titulo: limpiarEntrada(tituloInput.value.trim()),
        descripcion: limpiarEntrada(descInput.value.trim()),
        completada: checkCompletada.checked
    });

    formulario.reset();
    renderTareas();
});

document.getElementById('btn-eliminar').addEventListener('click', function() {
    const id = limpiarEntrada(idInput.value.trim());
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Por favor ingresa el ID de la tarea a eliminar.'
        });
        return;
    }
    const existe = tareas.some(t => t.id === id);
    if (!existe) {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No existe una tarea con ese ID.'
        });
        return;
    }
    // Eliminar tarea por ID
    tareas = tareas.filter(t => t.id !== id);
    formulario.reset();
    renderTareas();
});

document.getElementById('btn-completar').addEventListener('click', function() {
    const id = limpiarEntrada(idInput.value.trim());
    if (!id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Por favor ingresa el ID de la tarea a marcar como completada.'
        });
        return;
    }
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No existe una tarea con ese ID.'
        });
        return;
    }
    // Marcar tarea como completada
    tarea.completada = true;
    renderTareas();
});

renderTareas();