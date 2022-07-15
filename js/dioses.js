const d = document,
$table2 = d.querySelector(".crud2-table"),
            $form2 = d.querySelector(".crud2-form"),
            $title2 = d.querySelector(".crud2-title"),
            $template2 = d.getElementById("crud2-template").content,
            $fragment2 = d.createDocumentFragment()

//Funcion que devuelve todos los dioses en la BD
const getAllD = async() => {
    try {
        let res = await fetch("http://localhost:5555/dioses"),
            json = await res.json();

        if(!res.ok) throw { status: res.status, statusText: res.statusText };

        console.log(json);
        
        json.forEach(e => {
            $template2.querySelector(".name2").textContent = e.nombre;
            $template2.querySelector(".element2").textContent = e.de;
            $template2.querySelector(".edit2").dataset.id = e.id;
            $template2.querySelector(".edit2").dataset.name = e.nombre;
            $template2.querySelector(".edit2").dataset.element = e.de;
            $template2.querySelector(".delete2").dataset.id = e.id;
            $template2.querySelector(".delete2").dataset.name = e.nombre;

            let $clone = d.importNode($template2, true);// copia el template y true confirma que los datos de arriba se usen
            $fragment2.appendChild($clone);
        });

        $table2.querySelector(".tbody2").appendChild($fragment2);
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table2.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}
//Llamado a la funcion get all al cargar la pagina
d.addEventListener("DOMContentLoaded", getAllD);
//Funcion que carga los datos ingresados
d.addEventListener("submit", async (e) => {
    if(e.target === $form2) {
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
                        de: e.target.elemento.value
                    })
                },
                    res = await fetch("http://localhost:5555/dioses", options),
                    json = await res.json();

                if(!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrio un error";
                $form2.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
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
                        de: e.target.elemento.value
                    })
                },
                    res = await fetch(`http://localhost:5555/dioses/${e.target.id.value}`, options),
                    json = await res.json();

                if(!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrio un error";
                $form2.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});
//Funcion que setea para la edicion o eliminacion de un dios
d.addEventListener("click", async (e) => {
    if(e.target.matches(".edit2")) {//Si el boton clickeado es el de editar
        $title2.textContent = "Editar Dios";
        $form2.nombre.value = e.target.dataset.name;
        $form2.elemento.value = e.target.dataset.element;
        $form2.id.value = e.target.dataset.id;
    }

    if(e.target.matches(".delete2")) {//Si el boton clickeado es el de eliminar
        let isDelete = confirm(`Estas seguro que deseas eliminar el dios ${e.target.dataset.name}?` );

        if(isDelete) { //Si se confirma que se quiere borrar
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                },
                    res = await fetch(`http://localhost:5555/dioses/${e.target.dataset.id}`, options),
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