// Función auxiliar para formatear en “YYYY-MM-DDTHH:mm:00-05:00”
export default function timeToLocalISOString(date) {
  // Obtenemos componentes
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = "00";

  // Obtenemos el offset en minutos (ej. -300 para Bogotá)
  const offsetMin = date.getTimezoneOffset(); // ej. 300
  const signo = offsetMin > 0 ? "-" : "+";
  const absMin = Math.abs(offsetMin);
  const offHh = String(Math.floor(absMin / 60)).padStart(2, "0");
  const offMm = String(absMin % 60).padStart(2, "0");

  // Construimos la cadena final: “YYYY-MM-DDTHH:mm:ss±hh:mm”
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}${signo}${offHh}:${offMm}`;
}
