import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api';
import { Link } from 'react-router-dom';

import logoImage from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';
import { StorageKeys } from '../../enums/StorageKeys';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageWithRepositories = localStorage.getItem(StorageKeys.gitRepositories)

    if (storageWithRepositories) {
      return JSON.parse(storageWithRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleRepository(event : FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      return setInputError('Digite o autor/nome do repositório');
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');

    } catch(err) {
      setInputError('Não foi possível retornar este repositorio');
    }
  }

  return (
    <>
      <img src={logoImage} alt="Github Explorer"/>
      <Title>Explore repositórios no Github.</Title>

      <Form hasError={!!inputError} onSubmit={handleRepository}>
        <input
          value={newRepo}
          onChange={(event) => setNewRepo(event.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      { inputError && <Error>{ inputError }</Error> }

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}/>
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;