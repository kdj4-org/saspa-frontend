import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { PERIODS, generarResumenCitas } from "../../../utils/reportUtils";
import { useCitasEnriquecidas } from "../../../hooks/useCitasEnriquecidas";
import { COLORS } from "../../../config/Colors";

const DatesReport = () => {
  const [periodo, setPeriodo] = useState(PERIODS.WEEKLY);
  const { citas, loadingCitas } = useCitasEnriquecidas();
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const datos = generarResumenCitas(citas, periodo);
    setResumen(datos);
  }, [citas, periodo]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>Reporte de citas</Text>
      <View style={styles.periodContainer}>
        <TouchableOpacity
          onPress={() => setPeriodo(PERIODS.WEEKLY)}
          style={[
            styles.periodButton,
            periodo === PERIODS.WEEKLY && styles.activePeriodButton,
          ]}
        >
          <Text style={styles.periodText}>Últimos 7 días</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPeriodo(PERIODS.MONTHLY)}
          style={[
            styles.periodButton,
            periodo === PERIODS.MONTHLY && styles.activePeriodButton,
          ]}
        >
          <Text style={styles.periodText}>Este mes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPeriodo(PERIODS.YEARLY)}
          style={[
            styles.periodButton,
            periodo === PERIODS.YEARLY && styles.activePeriodButton,
          ]}
        >
          <Text style={styles.periodText}>Este año</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportContainer}>
        {resumen && (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Especialistas más seleccionados:</Text>
              {resumen.especialistas.map((item, index) => (
                <Text key={index} style={styles.value}>
                  {index + 1}. {item.nombre} ({item.cantidad} citas)
                </Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Servicios más solicitados:</Text>
              {resumen.servicios.map((item, index) => (
                <Text key={index} style={styles.value}>
                  {index + 1}. {item.nombre} ({item.cantidad} citas)
                </Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Sedes más usadas:</Text>
              {resumen.sedes.map((item, index) => (
                <Text key={index} style={styles.value}>
                  {index + 1}. {item.nombre} ({item.cantidad} citas)
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 20,
  },
  periodContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: COLORS.gray.medium.hex,
  },
  activePeriodButton: {
    backgroundColor: COLORS.purple.dark.hex,
  },
  periodText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reportContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.purple.text.hex,
  },
  card: {
    backgroundColor: COLORS.purple.light.hex,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: COLORS.purple.dark.hex,
    borderWidth: 1,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.gray.dark,
  },
  value: {
    fontSize: 16,
    color: COLORS.purple.text.hex,
  },
  logoutButton: {
    backgroundColor: COLORS.purple.text.hex,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DatesReport;
