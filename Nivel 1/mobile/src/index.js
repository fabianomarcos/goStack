import React, { userEffect, userState } from 'react';
import { SafeAreaView, StyleSheet, Text, StatusBar, FlatList, TouchableOpacity } from 'react-native'

import api from './server/api';

export default function App() {
  const [repositories, setRepositories] = userState([]);
  const [counter, setCounter] = userState(5);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddProject() {
    setCounter(counter++);
    const response = await api.post('repositories', {
      title: `Projeto ${counter}`,
      url: `https://github.com/Rocketseat/u`,
      techs: ['ionic', 'angularJs'],
      likes: 0
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1"></StatusBar>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={( {item: repository }) => (
            <Text style={styles.repository}>{repository.title}</Text>
          )}
        />

        <TouchableOpacity style={styles.button}
          onPress={handleAddProject}>
          <Text style={styles.buttonText}>Adicionar projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  repositories: {
    color: '#fff',
    fontSize: 20,
  },

  button: {
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});