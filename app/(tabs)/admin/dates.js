import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Screen } from "../../../components/Screen";
import DatesItem from "../../../components/admin/dates/DatesItem";
import { useCitasEnriquecidas } from "../../../hooks/useCitasEnriquecidas";
import { COLORS } from "../../../config/Colors";
import { SortAlphaUpIcon, SortAlphaDownIcon } from "../../../components/Icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatesStateFiltersModal from "../../../components/admin/dates/DatesStateFiltersModal";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import OperationStatusModal from "../../../components/ui/OperationStatusModal";
import { DATE_STATES } from "../../../config/DateStates";
import { DATE_ACTIONS } from "../../../config/DateActions";

export default function DatesPage() {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [invertedOrder, setInvertedOrder] = useState(false);
  const {
    citas,
    loadingCitas,
    errorCitas,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    finishAppointment,
  } = useCitasEnriquecidas();
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersActive, setFiltersActive] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [status, setStatus] = useState("success");
  const [pendingAction, setPendingAction] = useState(null);
  const [actionName, setActionName] = useState("unknownAction");

  useEffect(() => {
    applyFilters(citas);
  }, [citas, selectedStatus, selectedDate, searchQuery, invertedOrder]);

  useEffect(() => {
    if (errorCitas) {
      Alert.alert(
        "Error al cargar las citas",
        "Ocurrió un problema al obtener la lista de citas. Por favor, intenta nuevamente más tarde.",
        [{ text: "OK" }],
      );
    }
  }, [errorCitas]);

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setIsFilterModalVisible(false);
    setFiltersActive(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = (event, selected) => {
    hideDatePicker();
    if (selected) {
      setSelectedDate(selected);
      setFiltersActive(true);
    }
  };

  const toggleOrder = () => {
    setInvertedOrder(!invertedOrder);
    setFiltersActive(true);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setFiltersActive(true);
  };

  const clearFilters = () => {
    setSelectedStatus("");
    setSelectedDate(null);
    setSearchQuery("");
    setInvertedOrder(false);
    setFiltersActive(false);
  };

  const applyFilters = useCallback(
    (currentCitas) => {
      let filtered = [...currentCitas];

      if (selectedStatus) {
        filtered = filtered.filter((cita) => cita.estado === selectedStatus);
      }

      if (selectedDate) {
        const selectedDateStart = new Date(selectedDate);
        selectedDateStart.setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(selectedDate);
        selectedDateEnd.setHours(23, 59, 59, 999);

        filtered = filtered.filter((cita) => {
          const citaDate = new Date(cita.fecha);
          citaDate.setHours(
            parseInt(cita.hora.split(":")[0]),
            parseInt(cita.hora.split(":")[1]),
            0,
            0,
          );
          return citaDate >= selectedDateStart && citaDate <= selectedDateEnd;
        });
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (cita) =>
            cita.servicioNombre?.toLowerCase().includes(lowerQuery) ||
            cita.clienteNombre?.toLowerCase().includes(lowerQuery) ||
            cita.empleadoNombre?.toLowerCase().includes(lowerQuery) ||
            cita.sedeNombre?.toLowerCase().includes(lowerQuery),
        );
      }

      if (invertedOrder) {
        filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      } else {
        filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      }

      setFilteredCitas(filtered);
    },
    [selectedStatus, selectedDate, searchQuery, invertedOrder],
  );

  const getStatusText = () => {
    switch (selectedStatus) {
      case DATE_STATES.PENDING:
        return "(En espera)";
      case DATE_STATES.APPROVED:
        return "(Aceptada)";
      case DATE_STATES.REJECTED:
        return "(Rechazada)";
      case DATE_STATES.CANCELED:
        return "(Cancelada)";
      case DATE_STATES.FINISHED:
        return "(Terminada)";
      default:
        return "";
    }
  };

  const getFormattedDate = () => {
    if (selectedDate) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return `(${selectedDate.toLocaleDateString(undefined, options)})`;
    }
    return "";
  };

  const handleAction = async (actionFn, citaId) => {
    setConfirmationVisible(false);
    try {
      const res = await actionFn(citaId);
      if (res?.mensaje) {
        setStatus("success");
      } else {
        console.log("error", res);
        setStatus("failure");
      }
    } catch (e) {
      console.log("error", e);
      setStatus("failure");
    } finally {
      setStatusModalVisible(true);
    }
  };

  const confirmAction = (actionFn, citaId, actionName) => {
    setActionName(actionName);
    setPendingAction(() => () => handleAction(actionFn, citaId));
    setConfirmationVisible(true);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Citas</Text>
        </View>

        <View style={styles.searchAndOrderContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicio, especialista o sede"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={toggleOrder} style={styles.orderButton}>
            {invertedOrder ? (
              <SortAlphaDownIcon size={24} color={COLORS.purple.text.hex} />
            ) : (
              <SortAlphaUpIcon size={24} color={COLORS.purple.text.hex} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilterModal}
          >
            <Text style={styles.filterButtonText}>
              Estado {getStatusText()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateFilterButton}
            onPress={showDatePicker}
          >
            <Text style={styles.dateFilterButtonText}>
              Fecha {getFormattedDate()}
            </Text>
          </TouchableOpacity>
          {(selectedStatus !== "" ||
            selectedDate !== null ||
            searchQuery !== "") && (
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersButtonText}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>

        <DatesStateFiltersModal
          isVisible={isFilterModalVisible}
          onClose={toggleFilterModal}
          selectedStatus={selectedStatus}
          handleStatusFilter={handleStatusFilter}
        />

        {isDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}

        {loadingCitas ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando citas...</Text>
          </View>
        ) : errorCitas ? (
          <View style={styles.errorContainer}></View>
        ) : (
          <FlatList
            data={filteredCitas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DatesItem
                cita={item}
                onApprove={() =>
                  confirmAction(
                    approveAppointment,
                    item.id.toString(),
                    DATE_ACTIONS.APPROVE,
                  )
                }
                onReject={() =>
                  confirmAction(rejectAppointment, item.id, DATE_ACTIONS.REJECT)
                }
                onCancel={() =>
                  confirmAction(cancelAppointment, item.id, DATE_ACTIONS.CANCEL)
                }
                onFinish={() =>
                  confirmAction(finishAppointment, item.id, DATE_ACTIONS.FINISH)
                }
              />
            )}
            ListEmptyComponent={
              filtersActive ? (
                <Text style={styles.emptyText}>
                  No hay citas con los filtros aplicados.
                </Text>
              ) : (
                <Text style={styles.emptyText}>No hay citas disponibles.</Text>
              )
            }
          />
        )}

        <ConfirmationModal
          isVisible={confirmationVisible}
          onClose={() => setConfirmationVisible(false)}
          onConfirm={pendingAction}
          textCancel="No ejecutar acción"
          textApprove="Ejecutar acción"
          message={`¿Estás seguro de que quieres ${actionName} la cita?`}
        />

        <OperationStatusModal
          isVisible={statusModalVisible}
          onClose={() => setStatusModalVisible(false)}
          status={status}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.purple.background.hex,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  searchAndOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
  },
  orderButton: {
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 5,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: COLORS.purple.middle.hex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
    marginBottom: 8,
  },
  filterButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  dateFilterButton: {
    backgroundColor: COLORS.purple.middle.hex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
    marginBottom: 8,
  },
  dateFilterButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.gray.medium.hex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
    marginBottom: 8,
  },
  clearFiltersButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purple.background.hex,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purple.background.hex,
  },
});
