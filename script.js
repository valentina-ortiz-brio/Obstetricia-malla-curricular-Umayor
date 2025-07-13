document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");

  const ramosMap = {};
  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    const prerrequisitos = ramo.dataset.prerrequisitos === "ALL"
      ? ["ALL"]
      : ramo.dataset.prerrequisitos.split(" ").filter(p => p.trim());

    ramosMap[codigo] = { boton: ramo, prerrequisitos, aprobado: false };

    if (prerrequisitos.length > 0 && !prerrequisitos.includes("ALL")) {
      ramo.disabled = true;
    }
  });

  const checkAllAprobados = () => {
    return Object.values(ramosMap).every(r => r.aprobado);
  };

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const codigo = ramo.dataset.codigo;
      const ramoData = ramosMap[codigo];

      // Marcar como aprobado
      ramo.classList.add("aprobado");
      ramo.disabled = true;
      ramoData.aprobado = true;

      // Verificar desbloqueo de otros ramos
      for (const [codDestino, dataDestino] of Object.entries(ramosMap)) {
        if (!dataDestino.aprobado) {
          const requisitos = dataDestino.prerrequisitos;
          if (requisitos.includes("ALL")) {
            if (checkAllAprobados()) {
              dataDestino.boton.disabled = false;
            }
          } else {
            const todosCumplidos = requisitos.every(pr => ramosMap[pr]?.aprobado);
            if (todosCumplidos) {
              dataDestino.boton.disabled = false;
            }
          }
        }
      }
    });
  });
});
