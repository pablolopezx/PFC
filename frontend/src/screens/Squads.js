import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl, InputGroup, Form, Row, Col, Container, ListGroup, Card, Pagination } from 'react-bootstrap';
import config from '../config';

const Squads = () => {
  // Estado para la consulta de búsqueda
  const [query, setQuery] = useState('');
  // Estado para almacenar las competiciones
  const [competitions, setCompetitions] = useState([]);
  // Estado para la competición seleccionada
  const [selectedCompetition, setSelectedCompetition] = useState('');
  // Estado para almacenar las sugerencias de equipos
  const [suggestions, setSuggestions] = useState([]);
  // Estado para el equipo seleccionado
  const [selectedTeam, setSelectedTeam] = useState(null);
  // Estado para almacenar los jugadores del equipo seleccionado
  const [players, setPlayers] = useState([]);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para la página actual de equipos
  const [currentPageTeams, setCurrentPageTeams] = useState(1);
  // Estado para la página actual de jugadores
  const [currentPagePlayers, setCurrentPagePlayers] = useState(1);
  // Número de elementos por página
  const itemsPerPage = 5;

  // Efecto para obtener todas las competiciones cuando el componente se monta
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/competiciones/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta');
        }
        return response.json();
      })
      .then(data => {
        setCompetitions(data);
      })
      .catch(error => console.error('Error al obtener las competiciones:', error));
  }, []);

  // Efecto para obtener los equipos cuando se realiza una búsqueda o se selecciona una competición
  useEffect(() => {
    if (query.length > 0 || selectedCompetition === '') {
      const url = selectedCompetition
        ? `${config.API_BASE_URL}/equipos/competicion/${selectedCompetition}/`
        : `${config.API_BASE_URL}/equipos/`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
          }
          return response.json();
        })
        .then(data => {
          // Filtrar equipos por nombre y asegurar que tengan jugadores
          const filteredTeams = data.filter(team =>
            team.nombre.toLowerCase().includes(query.toLowerCase())
          );

          // Verificar que los equipos tengan jugadores
          const teamsWithPlayersPromises = filteredTeams.map(team =>
            fetch(`${config.API_BASE_URL}/jugadores/equipo/${team.id}/`)
              .then(response => response.json())
              .then(players => (players.length > 0 ? team : null))
              .catch(error => {
                console.error(`Error al obtener jugadores para el equipo ${team.id}:`, error);
                return null;
              })
          );

          Promise.all(teamsWithPlayersPromises).then(teams => {
            const teamsWithPlayers = teams.filter(team => team !== null);
            setSuggestions(teamsWithPlayers);
          });
        })
        .catch(error => console.error('Error al obtener los equipos:', error));
    } else {
      setSuggestions([]);
    }
  }, [query, selectedCompetition]);

  // Función para manejar la selección de un equipo
  const handleSelectTeam = (team) => {
    fetch(`${config.API_BASE_URL}/jugadores/equipo/${team.id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta');
        }
        return response.json();
      })
      .then(data => {
        setSelectedTeam(team);
        setPlayers(data);
        setShowModal(true);
        setCurrentPagePlayers(1); // Resetear a la primera página cuando se selecciona un nuevo equipo
      })
      .catch(error => console.error('Error al obtener los jugadores:', error));
  };

  // Obtener equipos para la página actual
  const indexOfLastTeam = currentPageTeams * itemsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - itemsPerPage;
  const currentTeams = suggestions.slice(indexOfFirstTeam, indexOfLastTeam);

  // Obtener jugadores para la página actual
  const indexOfLastPlayer = currentPagePlayers * itemsPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - itemsPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

  // Funciones para cambiar de página
  const paginateTeams = (pageNumber) => setCurrentPageTeams(pageNumber);
  const paginatePlayers = (pageNumber) => setCurrentPagePlayers(pageNumber);

  // Número total de páginas
  const totalPagesTeams = Math.ceil(suggestions.length / itemsPerPage);
  const totalPagesPlayers = Math.ceil(players.length / itemsPerPage);

  return (
    <Container>
      <h1 className="my-4 text-center">Consulta de Plantillas</h1>
      <p className="text-center mb-4">Selecciona una competición y luego busca un equipo para ver los jugadores</p>
      <Row className="mb-3 justify-content-center">
        {/* Selector de competiciones */}
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Form.Control
                as="select"
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
              >
                <option value="">Todas las competiciones</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>{comp.nombre}</option>
                ))}
              </Form.Control>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3 justify-content-center">
        {/* Campo de búsqueda de equipos */}
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <InputGroup>
                <FormControl
                  placeholder="Buscar equipo por nombre..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPageTeams(1); // Resetear a la primera página cuando se busca un nuevo equipo
                  }}
                />
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Lista de sugerencias de equipos */}
      {query.length > 0 && suggestions.length > 0 && (
        <Row className="mb-3 justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <ListGroup className="autocomplete-suggestions">
                  {currentTeams.map(team => (
                    <ListGroup.Item
                      key={team.id}
                      action
                      onClick={() => handleSelectTeam(team)}
                    >
                      {team.nombre}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Pagination className="mt-3 justify-content-center">
                  <Pagination.First
                    onClick={() => paginateTeams(1)}
                    disabled={currentPageTeams === 1}
                  />
                  <Pagination.Prev
                    onClick={() => paginateTeams(currentPageTeams - 1)}
                    disabled={currentPageTeams === 1}
                  />
                  {Array.from({ length: totalPagesTeams }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPageTeams}
                      onClick={() => paginateTeams(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => paginateTeams(currentPageTeams + 1)}
                    disabled={currentPageTeams === totalPagesTeams}
                  />
                  <Pagination.Last
                    onClick={() => paginateTeams(totalPagesTeams)}
                    disabled={currentPageTeams === totalPagesTeams}
                  />
                </Pagination>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {/* Modal para mostrar los jugadores del equipo seleccionado */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTeam ? selectedTeam.nombre : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {currentPlayers.map(player => (
              <ListGroup.Item key={player.id}>
                <div className="d-flex align-items-center">
                  <img
                    src={player.url_imagen}
                    alt={player.nombre}
                    title={player.nombre}
                    className="player-img-small me-2"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                  />
                  <div>
                    <strong>{player.nombre}</strong> ({player.demarcacion}) - ELO: {player.elo}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Pagination className="mt-3 justify-content-center">
            <Pagination.First
              onClick={() => paginatePlayers(1)}
              disabled={currentPagePlayers === 1}
            />
            <Pagination.Prev
              onClick={() => paginatePlayers(currentPagePlayers - 1)}
              disabled={currentPagePlayers === 1}
            />
            {Array.from({ length: totalPagesPlayers }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPagePlayers}
                onClick={() => paginatePlayers(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => paginatePlayers(currentPagePlayers + 1)}
              disabled={currentPagePlayers === totalPagesPlayers}
            />
            <Pagination.Last
              onClick={() => paginatePlayers(totalPagesPlayers)}
              disabled={currentPagePlayers === totalPagesPlayers}
            />
          </Pagination>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Squads;
