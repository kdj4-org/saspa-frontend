import React from "react";
import { TextInput, StyleSheet } from "react-native";

const SearchBar = ({ value, onChangeText, placeholder }) => (
  <TextInput
    style={styles.search}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
  />
);

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "white",
  },
});

export default SearchBar;
