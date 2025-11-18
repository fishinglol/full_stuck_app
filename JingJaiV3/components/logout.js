import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Logout = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onLogout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default Logout;