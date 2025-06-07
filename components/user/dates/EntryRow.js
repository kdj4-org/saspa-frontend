// src/components/user/dates/EntryRow.jsx

import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../config/Colors";

/**
 * Generamos los “slots” de hora de 30 minutos en:
 *   - 06:00 a 18:00 (inclusive) → 25 franjas: 6:00, 6:30, …, 17:30, 18:00
 */
const HORAS_BASE = Array.from(
  { length: (18 - 6) * 2 + 1 }, // (18-6)*2 slots de media hora, +1 para incluir 18:00
  (_, i) => {
    const totalMin = 6 * 60 + i * 30;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
  },
);

const EntryRow = ({
  index,
  servicio,
  onChangeServicio,
  empleado,
  onChangeEmpleado,
  sede,
  onChangeSede,
  fecha,
  onChangeFecha,
  hora,
  onChangeHora,
  onRemoveRow,
  servicios,
  sedes,
  empleados,
  horarios,
  bloqueos,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 1) Filtrar empleados por servicio seleccionado
  const empleadosFiltrados = useMemo(() => {
    if (!servicio) return [];
    const servicioObj = servicios.find((s) => s.id === servicio);
    if (!servicioObj) return [];
    return empleados.filter(
      (emp) =>
        Array.isArray(emp.servicios) &&
        emp.servicios.includes(servicioObj.nombre),
    );
  }, [servicio, servicios, empleados]);

  // 2) Asignar sede automáticamente según empleado
  const sedeAsignadaId = useMemo(() => {
    if (!empleado) return null;
    const empObj = empleados.find((e) => e.id === empleado);
    const barrio = empObj?.sede;
    const sedeObj = sedes.find((s) => s.barrio === barrio);
    return sedeObj?.id ?? null;
  }, [empleado, empleados, sedes]);

  React.useEffect(() => {
    if (sedeAsignadaId !== sede) {
      onChangeSede(index, sedeAsignadaId);
    }
  }, [sedeAsignadaId, sede, index, onChangeSede]);

  // 3) Calcular horas disponibles excluyendo bloqueos solapados
  const horasDisponibles = useMemo(() => {
    if (!empleado || !fecha) return [];

    // a) preparativos: determinar día, inicioDia y finDia
    const weekdayMap = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const diaNombre = weekdayMap[fecha.getDay()];

    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(inicioDia);
    finDia.setDate(inicioDia.getDate() + 1);

    // b) obtengo nombre del empleado para filtrar bloqueos
    const empObj = empleados.find((e) => e.id === empleado);
    const nombreEmpleado = empObj?.nombre;

    // c) bloqueos que se solapan con este día y este empleado
    const bloqueosEnDia = bloqueos
      .filter((b) => {
        if (b.empleado !== nombreEmpleado) return false;
        const bInicio = new Date(b.fecha_inicio);
        const bFin = new Date(b.fecha_fin);
        return bInicio < finDia && bFin > inicioDia;
      })
      .map((b) => {
        const bi = new Date(b.fecha_inicio);
        const bf = new Date(b.fecha_fin);
        return {
          startMin: bi.getHours() * 60 + bi.getMinutes(),
          endMin: bf.getHours() * 60 + bf.getMinutes(),
        };
      });

    // d) bloques generales del día según disponibilidad
    const horObj = horarios.find((h) => h.empleado_id === empleado);
    const diaDisp =
      horObj?.disponibilidad.find((d) => d.dia.toLowerCase() === diaNombre)
        ?.bloques ?? [];

    const bloquesEnMinutos = diaDisp.map((b) => {
      const [hI, mI] = b.hora_inicio.split(":").map(Number);
      const [hF, mF] = b.hora_fin.split(":").map(Number);
      return {
        startMin: hI * 60 + mI,
        endMin: hF * 60 + mF,
      };
    });

    // e) de HORAS_BASE me quedo solo con las franjas que encajen
    const slotsEnDisp = HORAS_BASE.filter((horaStr) => {
      const [h, m] = horaStr.split(":").map(Number);
      const start = h * 60 + m;
      const end = start + 30;
      return bloquesEnMinutos.some(
        ({ startMin, endMin }) => start >= startMin && end <= endMin,
      );
    });

    // f) finalmente excluyo cualquier slot que choque con bloqueosEnDia
    return slotsEnDisp.filter((horaStr) => {
      const [h, m] = horaStr.split(":").map(Number);
      const start = h * 60 + m;
      const end = start + 30;
      return !bloqueosEnDia.some(
        ({ startMin, endMin }) => start < endMin && startMin < end,
      );
    });
  }, [empleado, fecha, horarios, bloqueos, empleados]);

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
            onChangeHora(index, null);
          }}
          enabled={Boolean(servicio)}
          prompt={servicio ? "Seleccione especialista" : "Seleccione servicio"}
        >
          {!servicio && (
            <Picker.Item label="Seleccione primero un servicio" value={null} />
          )}
          {servicio && empleadosFiltrados.length > 0
            ? empleadosFiltrados.map((emp) => (
                <Picker.Item key={emp.id} label={emp.nombre} value={emp.id} />
              ))
            : servicio && (
                <Picker.Item label="No hay especialistas" value={null} />
              )}
        </Picker>
      </View>

      {/** 3) SELECTOR DE SEDE (solo lectura, según empleado) */}
      <Text style={styles.label}>Sede:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={sedeAsignadaId}
          enabled={false}
          prompt="Sede asignada"
        >
          {sedeAsignadaId ? (
            <Picker.Item
              label={sedes.find((sd) => sd.id === sedeAsignadaId)?.barrio}
              value={sedeAsignadaId}
            />
          ) : (
            <Picker.Item label="–" value={null} />
          )}
        </Picker>
      </View>

      {/** 4) DATE PICKER DE FECHA */}
      <Text style={styles.label}>Fecha:</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) onChangeFecha(index, d);
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
              : "Elija especialista y fecha"
          }
        >
          {horasDisponibles.length > 0 ? (
            horasDisponibles.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))
          ) : (
            <Picker.Item
              label={
                empleado && fecha
                  ? "No hay horarios disponibles"
                  : "Primero especialista y fecha"
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
