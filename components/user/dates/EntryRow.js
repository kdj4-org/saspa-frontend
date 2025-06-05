// src/components/user/dates/EntryRow.jsx

import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../config/Colors";

/**
 * Generamos los “slots” de hora de 30 minutos en:
 *   - 06:00 a 12:00 (inclusive) → 13 franjas: 6:00, 6:30, …, 11:30, 12:00
 *   - 14:00 a 18:00 (inclusive) → 9 franjas: 14:00, 14:30, …, 17:30, 18:00
 */
const HORAS_BASE = [
  // --- 06:00–12:00 (inclusive) ---
  ...Array.from({ length: (12 - 6) * 2 + 1 }, (_, i) => {
    const totalMin = 6 * 60 + i * 30;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
  }),
  // --- 14:00–18:00 (inclusive) ---
  ...Array.from({ length: (18 - 14) * 2 + 1 }, (_, i) => {
    const totalMin = 14 * 60 + i * 30;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
  }),
];

/**
 * Entrada individual (“fila”) para agendar un solo servicio:
 * - Seleccionar servicio
 * - Filtrar especialista (empleados) según el servicio
 * - Mostrar la sede (automática) basada en la propiedad `sede` del empleado
 * - Selector de fecha (DatePicker)
 * - Selector de hora, filtrando por la “disponibilidad general” y quitando bloqueos de esa fecha
 */
const EntryRow = ({
  index,

  // Props controlados por la página padre:
  servicio, // ID numérico del servicio
  onChangeServicio,

  empleado, // ID numérico del empleado
  onChangeEmpleado,

  sede, // ID de la sede (sólo lectura; se asigna automáticamente al elegir empleado)
  onChangeSede, // Aún así lo pasamos, en caso de querer guardarlo

  fecha, // Objeto Date
  onChangeFecha,

  hora, // Cadena "HH:MM" o null
  onChangeHora,

  onRemoveRow, // Callback para eliminar esta fila

  // Listas completas que envía la página padre:
  servicios, // [ { id, nombre, ... }, ... ]
  sedes, // [ { id, barrio: "Poblado", nombre: "...", ... }, ... ]
  empleados, // [ { id, nombre, sede: "Poblado", servicios: ["Pedicure", ...], ... }, ... ]
  horarios, // [ { empleado_id, disponibilidad: [ { dia: "lunes", bloques: [ { hora_inicio, hora_fin }, ... ] }, ... ] }, ... ]
  bloqueos, // [ { id, empleado_id, fecha_inicio, fecha_fin, ... }, ... ]
}) => {
  // Control local para mostrar/ocultar el DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- 1) Filtrar “empleados” que ofrecen efectivamente el servicio seleccionado ---
  //     Cada empleado trae un arreglo `servicios: [ "Pedicure", "Manicure", ... ]`
  const empleadosFiltrados = useMemo(() => {
    if (!servicio) return [];
    // 1.1) Obtener el nombre del servicio a partir de su ID
    const servicioObj = servicios.find((s) => s.id === servicio);
    if (!servicioObj) return [];
    const nombreServicio = servicioObj.nombre;

    // 1.2) Filtrar los empleados cuyo array `servicios` contenga ese nombre exacto
    return empleados.filter(
      (emp) =>
        Array.isArray(emp.servicios) && emp.servicios.includes(nombreServicio),
    );
  }, [servicio, empleados, servicios]);

  // --- 2) Determinar la sede del empleado automáticamente (por “barrio”) ---
  //     En la petición de empleados tienes: { id, nombre, sede: "Poblado", ... }
  //     En la lista “sedes” el campo que coincide es `barrio: "Poblado"`
  const sedeAsignadaId = useMemo(() => {
    if (!empleado) return null;
    const empObj = empleados.find((e) => e.id === empleado);
    if (!empObj) return null;
    const nombreBarrio = empObj.sede; // ej: "Poblado"
    const sedeObj = sedes.find((sd) => sd.barrio === nombreBarrio);
    return sedeObj ? sedeObj.id : null;
  }, [empleado, empleados, sedes]);

  // Si cambió la sede asignada, notificamos al padre:
  React.useEffect(() => {
    if (sedeAsignadaId !== sede) {
      onChangeSede(index, sedeAsignadaId);
    }
  }, [sedeAsignadaId, sede, index, onChangeSede]);

  // --- 3) Calcular “horasDisponibles” basándonos en:
  //     a) Disponibilidad “general” del empleado, según día de la semana
  //     b) Quitar cualquier franja que choque con un “bloqueo” de fecha exacta
  const horasDisponibles = useMemo(() => {
    if (!empleado || !fecha) return [];

    // 3.1) Convertimos la fecha seleccionada a día de la semana (nombre)
    //     new Date(fecha).getDay() → 0 Domingo, 1 Lunes, … 6 Sábado
    //     En tu backend manejas “lunes”, “martes”, etc. → weekDayName
    const weekdayIndex = fecha.getDay(); // 0=Domingo,1=Lunes,...6=Sábado
    const diasMap = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const diaSeleccionado = diasMap[weekdayIndex];

    // 3.2) Buscamos dentro de `horarios` el objeto de este empleado:
    //      horarios: [ { empleado_id, disponibilidad: [ { dia, bloques: [ { hora_inicio, hora_fin } ] }, ... ] }, ... ]
    const horarioEmpleadoObj = horarios.find((h) => h.empleado_id === empleado);
    if (!horarioEmpleadoObj) return [];

    // 3.3) Dentro de `horarioEmpleadoObj.disponibilidad`, buscamos la entrada
    //      cuyo `.dia === diaSeleccionado`. Esa entrada tiene un array `bloques`.
    const diaDispObj = horarioEmpleadoObj.disponibilidad.find(
      (d) => d.dia.toLowerCase() === diaSeleccionado,
    );
    if (!diaDispObj) return [];

    // 3.4) Obtenemos la lista de bloques de la forma:
    //      [ { hora_inicio: "08:00:00", hora_fin: "12:00:00" }, ... ]
    const bloquesDelDia = Array.isArray(diaDispObj.bloques)
      ? diaDispObj.bloques
      : [];

    // 3.5) Convertimos cada bloque a dos valores numéricos “minutos desde medianoche”:
    const bloquesEnMinutos = bloquesDelDia.map((b) => {
      // b.hora_inicio = "06:00:00"  → ["06","00","00"]
      const [hInicio, mInicio] = b.hora_inicio.split(":").map(Number);
      const [hFin, mFin] = b.hora_fin.split(":").map(Number);
      return {
        startMin: hInicio * 60 + mInicio,
        endMin: hFin * 60 + mFin,
      };
    });

    // 3.6) Ahora filtramos “HORAS_BASE” para quedarnos sólo con las franjas
    //      que *entren completamente* en alguno de esos bloquesEnMinutos:
    const slotsDentroDisponibilidad = HORAS_BASE.filter((horaStr) => {
      const [h, m] = horaStr.split(":").map(Number);
      const comienzoSlot = h * 60 + m;
      const finSlot = comienzoSlot + 30;

      // Debe caber dentro de al menos un bloqueEnMinutos:
      const dentro = bloquesEnMinutos.some(
        ({ startMin, endMin }) => comienzoSlot >= startMin && finSlot <= endMin,
      );
      return dentro;
    });

    // 3.7) Filtrar bloqueos EXACTOS: consultar `bloqueos` para esta fecha y empleado
    //      bloqueos: [ { id, empleado_id, fecha_inicio, fecha_fin, … }, … ]
    //      Filtramos sólo los bloqueos cuya `fecha_inicio` caiga el mismo día.
    const bloqueosEmpEnFecha = bloqueos.filter((b) => {
      if (b.empleado_id !== empleado) return false;
      const dIni = new Date(b.fecha_inicio).toDateString();
      return dIni === fecha.toDateString();
    });

    // 3.8) Convertir cada bloqueo exacto a rangos de minutos:
    const rangosBloqueoEnMinutos = bloqueosEmpEnFecha.map((b) => {
      const dIni = new Date(b.fecha_inicio);
      const dFin = new Date(b.fecha_fin);
      const inicioB = dIni.getHours() * 60 + dIni.getMinutes();
      const finB = dFin.getHours() * 60 + dFin.getMinutes();
      return { startMin: inicioB, endMin: finB };
    });

    // 3.9) Finalmente, retornamos sólo aquellos “slotsDentroDisponibilidad” que NO
    //      se solapen con ningún rangoBloqueo:
    return slotsDentroDisponibilidad.filter((horaStr) => {
      const [h, m] = horaStr.split(":").map(Number);
      const comienzoSlot = h * 60 + m;
      const finSlot = comienzoSlot + 30;
      // Si alguna franja de bloqueos se solapa → descartamos
      const chocca = rangosBloqueoEnMinutos.some(
        ({ startMin, endMin }) => comienzoSlot < endMin && startMin < finSlot,
      );
      return !chocca;
    });
  }, [empleado, fecha, horarios, bloqueos]);

  return (
    <View style={styles.entryContainer}>
      {/** Botón “✕” para eliminar esta fila */}
      <TouchableOpacity
        onPress={() => onRemoveRow(index)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>

      {/** 1) SELECTOR DE SERVICIO */}
      <Text style={styles.label}>Servicio:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={servicio}
          onValueChange={(val) => onChangeServicio(index, val)}
          prompt="Seleccione un servicio"
        >
          <Picker.Item label="-- Seleccione --" value={null} />
          {servicios.map((s) => (
            <Picker.Item key={s.id} label={s.nombre} value={s.id} />
          ))}
        </Picker>
      </View>

      {/** 2) SELECTOR DE ESPECIALISTA (solo si ya hay servicio) */}
      <Text style={styles.label}>Especialista:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={empleado}
          onValueChange={(val) => {
            onChangeEmpleado(index, val);
            // Al cambiar de empleado, reiniciamos la hora
            onChangeHora(index, null);
          }}
          enabled={Boolean(servicio)}
          prompt={
            servicio
              ? "Seleccione un especialista"
              : "Seleccione primero un servicio"
          }
        >
          {!servicio && (
            <Picker.Item label="Seleccione un servicio primero" value={null} />
          )}
          {servicio &&
            (empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((emp) => (
                <Picker.Item key={emp.id} label={emp.nombre} value={emp.id} />
              ))
            ) : (
              <Picker.Item
                label="No hay especialistas disponibles"
                value={null}
              />
            ))}
        </Picker>
      </View>

      {/** 3) SELECTOR DE SEDE (solo lectura, según empleado) */}
      <Text style={styles.label}>Sede:</Text>
      <View style={styles.pickerWrapper}>
        {empleado ? (
          <Picker
            selectedValue={sedeAsignadaId}
            onValueChange={(val) => onChangeSede(index, val)}
            enabled={false}
            prompt="Sede asignada"
          >
            {sedeAsignadaId ? (
              <Picker.Item
                key={sedeAsignadaId}
                label={
                  sedes.find((sd) => sd.id === sedeAsignadaId)?.barrio ||
                  "Desconocida"
                }
                value={sedeAsignadaId}
              />
            ) : (
              <Picker.Item label="Sede no encontrada" value={null} />
            )}
          </Picker>
        ) : (
          <Picker
            selectedValue={null}
            onValueChange={() => {}}
            enabled={false}
            prompt="Seleccione primero un especialista"
          >
            <Picker.Item
              label="Seleccione primero un especialista"
              value={null}
            />
          </Picker>
        )}
      </View>

      {/** 4) DATE PICKER DE FECHA */}
      <Text style={styles.label}>Fecha:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              onChangeFecha(index, date);
            }
          }}
        />
      )}

      {/** 5) SELECTOR DE HORA */}
      <Text style={styles.label}>Hora:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={hora}
          onValueChange={(val) => onChangeHora(index, val)}
          enabled={!!fecha && !!empleado}
          prompt={
            fecha && empleado
              ? "Seleccione una hora"
              : "Seleccione primero especialista y fecha"
          }
        >
          {empleado && fecha && horasDisponibles.length > 0 ? (
            horasDisponibles.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))
          ) : (
            <Picker.Item
              label={
                empleado && fecha
                  ? "No hay horarios disponibles"
                  : "Seleccione primero especialista y fecha"
              }
              value={null}
            />
          )}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.purple.light.hex,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple.dark.hex,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1,
    backgroundColor: "transparent",
    padding: 4,
  },
  removeButtonText: {
    fontSize: 18,
    color: COLORS.purple.dark.hex,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginTop: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: "#fff",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#fff",
  },
});

export default EntryRow;
