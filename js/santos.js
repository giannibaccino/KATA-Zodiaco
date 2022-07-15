const d = document,
            $table = d.querySelector(".crud-table"),
            $form = d.querySelector(".crud-form"),
            $title = d.querySelector(".crud-title"),
            $template = d.getElementById("crud-template").content,
            $fragment = d.createDocumentFragment()

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

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
}

d.addEventListener("DOMContentLoaded", getAll);