export const groupRequests = (solicitudes = []) => {
  const VENTANA_MS = 10000;
  const grupos = [];

  const ordenadas = [...solicitudes].sort((a, b) => {
    const fechaA = Date.parse(a.created_at || a.fecha || "") || 0;
    const fechaB = Date.parse(b.created_at || b.fecha || "") || 0;
    return fechaB - fechaA;
  });

  ordenadas.forEach((s, indice) => {
    const fecha = s.created_at || s.fecha;
    const tiempo = fecha ? new Date(fecha).getTime() : NaN;
    const origen = s.origen;
    const destino = s.destino;

    const nombreProducto = (
      s.producto_nombre || s.producto?.nombre || ""
    ).trim().toLowerCase();

    const identificador = s.transferencia_id || s.id;

    const datosValidos =
      Number.isFinite(tiempo) && Boolean(origen && destino);

    const grupo = datosValidos
      ? grupos.find(
          (g) =>
            g.origen === origen &&
            g.destino === destino &&
            Number.isFinite(g.tiempo) &&
            Math.abs(g.tiempo - tiempo) <= VENTANA_MS &&
            !g.nombresProductos.has(nombreProducto)
        )
      : undefined;

    const destinoGrupo = grupo || {
      id: String(identificador ?? `registro-${indice}`),
      origen,
      destino,
      created_at: fecha,
      tiempo,
      aprobacion: s.aprobacion || s.estado,
      error: s.error,
      items: [],
      rawIds: [],
      nombresProductos: new Set(),
    };

    if (!grupo) grupos.push(destinoGrupo);

    destinoGrupo.rawIds.push(identificador);
    destinoGrupo.nombresProductos.add(nombreProducto);

    destinoGrupo.items.push({
      nombre: s.producto_nombre || s.producto?.nombre || "Producto",
      cantidad: s.cantidad,
      unit: s.producto?.unit || s.unit || "pz",
    });
  });

  return grupos.map((grupo) => {
  const resultado = { ...grupo };

  delete resultado.nombresProductos;
  delete resultado.tiempo;

  return resultado;
});
};
