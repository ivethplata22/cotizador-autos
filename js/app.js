// Constructores

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() {

}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {

    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;
    
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor el costo se reduce un 3%
    cantidad -= ( (diferencia*3) * cantidad ) / 100;

    // Si el seguro es basico se multiplica por un 30% mas
    // Si el seguro es completo se multiplica por un 50% mas

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {

        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild( option );

    }
}

// Muestra alertas en la pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    // Eliminar elemento anterior
    eliminarMensajeAnterior();

    const div = document.createElement('DIV');

    if(tipo === 'error') {

        div.classList.add('error');

    } else {

        div.classList.add('correcto');

    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    // Borrar despues de 3 segundos
    setTimeout(() => {
        div.remove();
    }, 2000);

}

UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    let textoMarca = '';

    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    // Bloquear Boton
    const btnSubmit = document.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;

    // Limpiar Cotizar
    limpiarCotizar();

    // Mostrar Spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    // Crear el resultado
    const div = document.createElement('DIV');
    div.classList.add('mt-10', 'resultado');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca} </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize"> ${tipo} </span></p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    setTimeout(()=>{
        // Remover spinner
        spinner.style.display = 'none';

        // Mostrar Resultado
        resultadoDiv.appendChild(div);

        // Desbloquear Boton
        btnSubmit.disabled = false;
    },2000);

}

function eliminarMensajeAnterior() {

    const mensajes = document.querySelectorAll('div.mensaje');
    
    for( const mensaje of mensajes ) {
        mensaje.remove();
    } 

}

function limpiarCotizar() {

    const resultado = document.querySelector('div.resultado');
    
    if(resultado) {
        resultado.remove();
    }

}

// Instanciar UI

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    
    // Llena Select con los años
    ui.llenarOpciones();

});

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');

    formulario.addEventListener('submit', cotizarSeguro);
}

// Funciones

function cotizarSeguro(e) {

    e.preventDefault();
    
    // Leer la marca seleccionada
    const marca = document.querySelector("#marca").value;

    // Leer el año seleccionado
    const year = document.querySelector('#year').value;

    // Leer cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    // Instandciar el seguro
    const seguro = new Seguro(marca, year, tipo);

    // Utilizar Prototype que va cotizar
    const total = seguro.cotizarSeguro();

    ui.mostrarResultado(total, seguro);
}