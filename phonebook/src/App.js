import axios from 'axios';
import { useEffect, useState } from 'react'
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import phonebookService from './services/phonebookService';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchedName, setSearchedName] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const filteredPersons = searchedName != "" ? persons.filter(person => person.name.toLowerCase().includes(searchedName.toLowerCase())) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter searchedName={searchedName} setSearchedName={setSearchedName} />
      <PersonForm persons={persons} setPersons={setPersons} setNotification={setNotification} />
      <Persons filteredPersons={filteredPersons} persons={persons} setPersons={setPersons} setNotification={setNotification} />
    </div>
  )
}

export default App