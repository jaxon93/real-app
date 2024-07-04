import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.107:3000';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null); // State to manage editing user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, { name, email, password });
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = async (userId) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${userId}`, { name, email, password });
      fetchUsers(); // Refresh the user list after edit
      setName('');
      setEmail('');
      setPassword('');
      setEditingUser(null); // Clear editing state
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setEditingUser(user.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => startEditing(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => deleteUser(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {editingUser ? (
        <Button title="Update User" onPress={() => editUser(editingUser)} />
      ) : (
        <Button title="Add User" onPress={addUser} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default App;
