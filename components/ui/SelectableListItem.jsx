import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const SelectableListItem = ({ item, isSelected, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.item, isSelected && styles.selectedItem]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text>{item.nombre}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: COLORS.purple.middle.hex,
  },
});

export default SelectableListItem;
