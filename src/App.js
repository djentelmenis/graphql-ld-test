import React, { useState } from 'react';
import { Client } from 'graphql-ld';
import { QueryEngineComunica } from 'graphql-ld-comunica';

import logo from './logo.svg';
import './App.css';

const getData = async (actor) => {
  // Define a JSON-LD context
  const context = {
    '@context': {
      Film: 'http://dbpedia.org/ontology/Film',
      label: { '@id': 'http://www.w3.org/2000/01/rdf-schema#label', '@language': 'en' },
      starring: 'http://dbpedia.org/ontology/starring',
    },
  };

  // Create a GraphQL-LD client based on a client-side Comunica engine over 3 sources
  const comunicaConfig = {
    sources: [
      'http://dbpedia.org/sparql',
      'https://ruben.verborgh.org/profile/',
      'https://fragments.linkedsoftwaredependencies.org/npm',
    ],
  };
  const client = new Client({ context, queryEngine: new QueryEngineComunica(comunicaConfig) });

  // Define a query
  const query = `
  {
    id @single
    ... on Film {
      starring(label: "${actor}") @single
    }
  }
  `;

  // Execute the query
  const { data } = await client.query({ query });

  return data;
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actor, setActor] = useState('');

  const handleClick = () => {
    console.log('Retrieving data...');
    setLoading(true);
    getData(actor).then((data) => {
      setData(data);
      setLoading(false);
      console.log('Retrieved data:');
      console.table(data);
    });
  };

  const loadingClass = loading ? 'loading' : '';

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className={`App-logo ${loadingClass}`} alt="logo" />
        <div className="input-wrapper">
          <input placeholder="Enter actor name" onChange={(e) => setActor(e.target.value)}></input>
          <button onClick={() => handleClick()}>Get movies</button>
        </div>
        <div className="data-wrapper">
          {data &&
            data.map((d) => (
              <div key={d.id}>
                <a href={d.id}>{d.id.split('/').slice(-1)[0]}</a>
              </div>
            ))}
        </div>
      </header>
    </div>
  );
};

export default App;
