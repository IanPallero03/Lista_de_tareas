const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Cargar tareas al inicio
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    mostrarHistorial(); // <-- Esta línea es clave
  });
  
  // Cargar tareas con ENTER
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // evita recargar o comportamientos raros
        addTask();
    }
});

// Cargar tareas y mostrar tareas
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Por favor, escribe una tarea.");
        return;
    }

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = taskText;
    const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        span.style.textDecoration = 'line-through';
        span.style.color = 'gray';
    } else {
        span.style.textDecoration = 'none';
        span.style.color = '';
    }
    saveTasks();
    actualizarContador();

});

// Botones de editar y eliminar
li.appendChild(checkbox);
li.appendChild(span);


    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Eliminar";
    const editButton = document.createElement('button');
    editButton.textContent = "Editar";
    editButton.className = "edit-button";
    editButton.addEventListener('click', () => {
        const textoAnterior = span.textContent;
        const nuevoTexto = prompt("Editar tarea:", textoAnterior);
      
        if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
          const textoFinal = nuevoTexto.trim();
          span.textContent = textoFinal;
          saveTasks();
      
          actualizarHistorial(textoAnterior, textoFinal);
        }
      });
      
li.appendChild(editButton);

    deleteButton.className = "delete-button";
    deleteButton.addEventListener('click', () => {
        const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");
        if (confirmar) {
            li.remove();
            saveTasks();
        }
    });
    

    li.appendChild(deleteButton);
    taskList.appendChild(li);

    saveTasks();
    guardarEnHistorial(taskText);
    taskInput.value = "";

    
}

  

// Guardar tareas en localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const texto = li.querySelector('span').textContent;
        const completada = li.querySelector('input[type="checkbox"]').checked;
        tasks.push({ texto, completada });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    actualizarContador();

}


  

// Cargar tareas guardadas
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskObj => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = taskObj.completada;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                span.style.textDecoration = 'line-through';
                span.style.color = 'gray';
            } else {
                span.style.textDecoration = 'none';
                span.style.color = '';
            }
            saveTasks();
            actualizarContador();

        });

        const span = document.createElement('span');
        span.textContent = taskObj.texto;
        if (taskObj.completada) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        }

        li.appendChild(checkbox);
        li.appendChild(span);

        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Eliminar";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener('click', () => {
            const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");
            if (confirmar) {
                li.remove();
                saveTasks();
            }
        });

        const editButton = document.createElement('button');
        editButton.textContent = "Editar";
        editButton.className = "edit-button";
        editButton.addEventListener('click', () => {
            const textoAnterior = span.textContent;
            const nuevoTexto = prompt("Editar tarea:", textoAnterior);
            if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
                const textoFinal = nuevoTexto.trim();
                span.textContent = textoFinal;
                saveTasks();
                actualizarHistorial(textoAnterior, textoFinal);
            }
        });

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
    actualizarContador();

}


// --- CAMBIO AUTOMÁTICO DE VIDEOS DE FONDO ---

const videoFondo = document.getElementById('video-fondo');

// Array con rutas de los videos
const videos = [
    'videos/tareas.mp4',
    'videos/tarea2.mp4',
    'videos/tarea3.mp4'
];

let currentVideo = 0;

// Función para cambiar el video
function cambiarVideo() {
    currentVideo = (currentVideo + 1) % videos.length; // Avanza y reinicia al llegar al final
    const source = videoFondo.querySelector('source');
    source.src = videos[currentVideo];
    videoFondo.load(); // Carga el nuevo video
    videoFondo.play(); // Reproduce automáticamente
    
}

// Cambia de video cada 10 segundos (ajusta a gusto)
setInterval(cambiarVideo, 10000);


// Guardar en el HISTORIAL
function guardarEnHistorial(tasks) {
    let historial = JSON.parse(localStorage.getItem("historialtareas")) || [];
    
    // Evitar duplicados
    historial = historial.filter(item => item.toLowerCase() !== tasks.toLowerCase());

    historial.unshift(tasks);

    if (historial.length > 10) {
        historial.pop();
    }

    localStorage.setItem("historialtareas", JSON.stringify(historial));
    mostrarHistorial();
}

// Mostrar el HISTORIAL
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialtareas")) || [];
    const historyList = document.getElementById("history-list");

    historyList.innerHTML = "";

    historial.forEach((tasks, index) => {
        const li = document.createElement("li");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = tasks;
        taskSpan.addEventListener("click", () => {
            const yaExiste = Array.from(document.querySelectorAll('#taskList li span'))
              .some(span => span.textContent.trim().toLowerCase() === tasks.toLowerCase());
          
            if (!yaExiste) {
              taskInput.value = tasks;
              addTask();
            } else {
              alert("Esta tarea ya está en la lista.");
            }
          });
          

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "history-delete-button";
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se dispare el agregar tarea al hacer clic
            eliminarDelHistorial(index);
        });

        li.appendChild(taskSpan);
        li.appendChild(deleteButton);
        historyList.appendChild(li);
    });
}

// Eliminar tareas del HISTORIAL
function eliminarDelHistorial(index) {
    let historial = JSON.parse(localStorage.getItem("historialtareas")) || [];
    historial.splice(index, 1);
    localStorage.setItem("historialtareas", JSON.stringify(historial));
    mostrarHistorial();
}


// Mostrar y ocultar Historial
const toggleHistoryButton = document.getElementById('toggleHistoryButton');
const historyContainer = document.getElementById('history-container');

toggleHistoryButton.addEventListener('click', () => {
    if (historyContainer.style.display === 'none' || historyContainer.style.display === '') {
        historyContainer.style.display = 'block';
        toggleHistoryButton.textContent = 'Ocultar historial';
    } else {
        historyContainer.style.display = 'none';
        toggleHistoryButton.textContent = 'Mostrar historial';
    }
    setTimeout(() => {
        historyContainer.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
});

// Actualizar Historial
function actualizarHistorial(viejoTexto, nuevoTexto) {
    let historial = JSON.parse(localStorage.getItem("historialtareas")) || [];
  
    const index = historial.findIndex(item => item.toLowerCase() === viejoTexto.toLowerCase());
  
    if (index !== -1) {
      historial[index] = nuevoTexto;
      localStorage.setItem("historialtareas", JSON.stringify(historial));
      mostrarHistorial();
    }
    
  }
  
// Contador de Tareas
  function actualizarContador() {
    const totalTareas = document.querySelectorAll('#taskList li').length;
    const completadas = document.querySelectorAll('#taskList li input[type="checkbox"]:checked').length;
    const pendientes = totalTareas - completadas;
    document.getElementById('taskCounter').textContent = `Tareas pendientes: ${pendientes}`;
}



// Modo noche y dia
  const botonModo = document.getElementById('modo-btn');
  const icono = botonModo.querySelector('.material-icons');
  const body = document.body;

  botonModo.addEventListener('click', () => {
    body.classList.toggle('noche');

    // Cambiar el ícono
    if (body.classList.contains('noche')) {
      icono.textContent = "wb_sunny"; // ☀️
    } else {
      icono.textContent = "dark_mode"; // 🌙
    }
  });
