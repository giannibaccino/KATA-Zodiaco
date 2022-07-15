const d = document,
            $table = d.querySelector(".crud-table"),
            $form = d.querySelector(".crud-form"),
            $title = d.querySelector(".crud-title"),
            $template = d.getElementById("crud-template").content,
            $fragment = d.createDocumentFragment()

//Funcion que devuelve todos los santos en la BD
const getAll = async() => {
    try {
        let res = await fetch("http://localhost:5555/santos"),
            json = await res.json();

        if(!res.ok) throw { status: res.status, statusText: res.statusText };

        console.log(json);
        
        json.forEach(e => {
            $template.querySelector(".name").textContent = e.nombre;
            $template.querySelector(".constellation").textContent = e.constelacion;
            $template.querySelector(".edit").dataset.id = e.id;
            $template.querySelector(".edit").dataset.name = e.nombre;
            $template.querySelector(".edit").dataset.constellation = e.constelacion;
            $template.querySelector(".delete").dataset.id = e.id;

            let $clone = d.importNode($template, true);// copia el template y true confirma que los datos de arriba se usen
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}
//Llamado a la funcion get all al cargar la pagina
d.addEventListener("DOMContentLoaded", getAll);
//Funcion que carga los datos ingresados
d.addEventListener("submit", async (e) => {
    if(e.target === $form) {
        e.preventDefault();

        if(!e.target.id.value) { //Si no viene nada como valor creo un POST
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                },
                    res = await fetch("http://localhost:5555/santos", options),
                    json = await res.json();

                if(!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        } else { //Si esta editando creo un PUT
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                },
                    res = await fetch(`http://localhost:5555/santos/${e.target.id.value}`, options),
                    json = await res.json();

                if(!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});
//Funcion que setea para la edicion o eliminacion de un santo
d.addEventListener("click", async (e) => {
    if(e.target.matches(".edit")) {//Si el boton clickeado es el de editar
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if(e.target.matches(".delete")) {//Si el boton clickeado es el de eliminar
        let isDelete = confirm(`Estas seguro que deseas eliminar el santo ${e.target.dataset.name}?` );

        if(isDelete) { //Si se confirma que se quiere borrar
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                },
                    res = await fetch(`http://localhost:5555/santos/${e.target.dataset.id}`, options),
                    json = await res.json();

                if(!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrio un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
    }
});