import React, { useState, useEffect } from 'react';
import api from './services/api';

import './App.css';

import Header from './components/Header';

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setProjects(response.data);
    })
  })

  async function handleAddProject() {
    const response = await api.post('repositories', {
      title: `New Project five`,
      url: `https://github.com/title`,
      techs: [
      "React",
      "ReactNative",
      "AngularJS",
      "TypeScript"
    ]
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  async function handleRemoveProject() {
    const id = '94b52373-adef-4fe4-b4ea-590287690adb';
    const indexProject = projects.findIndex(project => project.id === id);
    const project = projects[indexProject];
    const response = await api.delete(`repositories${id}`);

    if (response.status === 204) {
      projects = projects.splice(indexProject, 1);
    }
  }

  return (
    <>
      <Header title="Projects" />
      <ul>
        {projects.map(project => <li key={project.id}>Projeto { project.title } Id: { project.id }</li>)}
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar Projeto</button>
      <button type="button" onClick={handleRemoveProject}>Remover Projeto</button>
    </>
  );
}

export default App;