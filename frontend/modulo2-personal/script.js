import { supabase } from '../supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    const formEmpleado = document.getElementById('form-empleado');

    // 1. Registrar Empleado de manera manual (si aplica)
    if (formEmpleado) {
        formEmpleado.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formEmpleado);

            const nuevoEmpleado = {
                nombre: formData.get('nombre'),
                cargo: formData.get('cargo'),
                departamento: formData.get('departamento'),
                jefe_directo: formData.get('jefe_directo') || null,
                tipo_contrato: formData.get('tipo_contrato'),
                salario_base: parseFloat(formData.get('salario_base')),
                contacto_emergencia: formData.get('contacto_emergencia'),
                estado_empleado: 'Activo'
            };

            const { error } = await supabase.from('empleados').insert([nuevoEmpleado]);
            if (error) {
                alert('Error al registrar empleado: ' + error.message);
            } else {
                alert('Empleado registrado correctamente.');
                formEmpleado.reset();
                cargarEstructura();
            }
        });
    }

    // 2. Cargar datos para el listado y Organigrama
    async function cargarEstructura() {
        const { data: empleados, error } = await supabase.from('empleados').select('*');
        if (error) return console.error(error);

        renderizarListaPersonal(empleados);
        generarOrganigrama(empleados);
    }

    function renderizarListaPersonal(empleados) {
        const contenedor = document.getElementById('lista-empleados');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        empleados.forEach(emp => {
            const div = document.createElement('div');
            div.className = `empleado-card ${emp.estado_empleado.toLowerCase()}`;
            div.innerHTML = `
                <h4>${emp.nombre}</h4>
                <p><strong>Cargo:</strong> ${emp.cargo} | <strong>Área:</strong> ${emp.departamento || 'Sin asignar'}</p>
                <p><strong>Estado:</strong> ${emp.estado_empleado}</p>
            `;
            contenedor.appendChild(div);
        });
    }

    // 3. Organigrama Visual Básico (Árbol Jerárquico en JS)
    function generarOrganigrama(empleados) {
        const wrapper = document.getElementById('organigrama-visual');
        if (!wrapper) return;
        wrapper.innerHTML = '';

        // Filtrar líderes (los que no tienen jefe directo asignado)
        const jefesPrincipales = empleados.filter(e => !e.jefe_directo);

        const crearNodo = (empleado) => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="nodo-organigrama"><strong>${empleado.nombre}</strong><br><small>${empleado.cargo}</small></div>`;
            
            // Buscar subordinados directos de este empleado
            const subordinados = empleados.filter(e => e.jefe_directo === empleado.nombre);
            if (subordinados.length > 0) {
                const ul = document.createElement('ul');
                subordinados.forEach(sub => {
                    ul.appendChild(crearNodo(sub));
                });
                li.appendChild(ul);
            }
            return li;
        };

        const rootUl = document.createElement('ul');
        jefesPrincipales.forEach(jefe => {
            rootUl.appendChild(crearNodo(jefe));
        });
        wrapper.appendChild(rootUl);
    }

    cargarEstructura();
});
