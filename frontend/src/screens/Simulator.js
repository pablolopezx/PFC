import React, { useState, useEffect } from 'react';
import campo from '../campo.jpg'; // Asegúrate de que la ruta es correcta
import { Form, Row, Col, Container, Card, InputGroup, FormControl, Button, Modal, ListGroup, Pagination } from 'react-bootstrap';
import config from '../config'; // Asegúrate de importar tu archivo de configuración

const Simulator = () => {
    // Estados del componente
    const [teams, setTeams] = useState([]); // Equipos disponibles
    const [queryLeft, setQueryLeft] = useState(''); // Consulta de búsqueda para el equipo izquierdo
    const [queryRight, setQueryRight] = useState(''); // Consulta de búsqueda para el equipo derecho
    const [filteredTeamsLeft, setFilteredTeamsLeft] = useState([]); // Equipos filtrados para el lado izquierdo
    const [filteredTeamsRight, setFilteredTeamsRight] = useState([]); // Equipos filtrados para el lado derecho
    const [selectedTeamLeft, setSelectedTeamLeft] = useState(''); // Equipo seleccionado para el lado izquierdo
    const [selectedTeamRight, setSelectedTeamRight] = useState(''); // Equipo seleccionado para el lado derecho
    const [playersLeft, setPlayersLeft] = useState([]); // Jugadores del equipo izquierdo
    const [playersRight, setPlayersRight] = useState([]); // Jugadores del equipo derecho
    const [currentPageLeft, setCurrentPageLeft] = useState(1); // Página actual para los jugadores del equipo izquierdo
    const [showSimulationModal, setShowSimulationModal] = useState(false); // Estado del modal de simulación
    const [showPlayerChangeModal, setShowPlayerChangeModal] = useState(false); // Estado del modal de cambio de jugador
    const [currentPageRight, setCurrentPageRight] = useState(1); // Página actual para los jugadores del equipo derecho
    const [result, setResult] = useState(null); // Resultado de la simulación
    const [suggestedTeamsLeft, setSuggestedTeamsLeft] = useState([]); // Equipos sugeridos para el lado izquierdo
    const [suggestedTeamsRight, setSuggestedTeamsRight] = useState([]); // Equipos sugeridos para el lado derecho
    const [selectedPlayer, setSelectedPlayer] = useState(null); // Jugador seleccionado para cambiar
    const [selectedPosition, setSelectedPosition] = useState(''); // Posición seleccionada para cambiar
    const [newPlayer, setNewPlayer] = useState(null); // Nuevo jugador seleccionado
    const [modalQuery, setModalQuery] = useState(''); // Consulta de búsqueda en el modal
    const [modalTeams, setModalTeams] = useState([]); // Equipos en el modal
    const [modalPlayers, setModalPlayers] = useState([]); // Jugadores en el modal
    const [showPlayerList, setShowPlayerList] = useState(false); // Estado para mostrar la lista de jugadores en el modal
    const [modalPage, setModalPage] = useState(1); // Página actual en el modal
    const [totalModalPages, setTotalModalPages] = useState(1); // Total de páginas en el modal
    const modalItemsPerPage = 5; // Número de jugadores por página en el modal

    // Función para manejar el cambio de página en el modal
    const handleModalPageChange = (page) => {
        setModalPage(page);
        const teamId = selectedPosition === 'start' ? selectedTeamLeft : selectedTeamRight;
        fetchAllPlayers(teamId, setModalPlayers, page, modalItemsPerPage);
    };

    // Efecto para obtener los equipos disponibles cuando el componente se monta
    useEffect(() => {
        fetch(`${config.API_BASE_URL}/equipos/`)
            .then(response => response.json())
            .then(data => {
                const teamsWithPlayersPromises = data.map(team =>
                    fetch(`${config.API_BASE_URL}/titulares/${team.id}/`)
                        .then(response => response.json())
                        .then(players => (players.length > 0 ? team : null))
                        .catch(error => {
                            console.error(`Error al obtener jugadores para el equipo ${team.id}:`, error);
                            return null;
                        })
                );

                Promise.all(teamsWithPlayersPromises).then(teams => {
                    const teamsWithPlayers = teams.filter(team => team !== null);
                    setTeams(teamsWithPlayers);
                    setFilteredTeamsLeft(teamsWithPlayers);
                    setFilteredTeamsRight(teamsWithPlayers);
                });

            })
            .catch(error => console.error('Error al obtener los equipos:', error));
    }, []);

    // Efecto para filtrar los equipos disponibles según la consulta de búsqueda para el equipo izquierdo
    useEffect(() => {
        setFilteredTeamsLeft(teams.filter(team => team.nombre.toLowerCase().includes(queryLeft.toLowerCase())));
        setCurrentPageLeft(1);
    }, [queryLeft, teams]);

    // Efecto para filtrar los equipos disponibles según la consulta de búsqueda para el equipo derecho
    useEffect(() => {
        setFilteredTeamsRight(teams.filter(team => team.nombre.toLowerCase().includes(queryRight.toLowerCase())));
        setCurrentPageRight(1);
    }, [queryRight, teams]);

    // Función para obtener los jugadores de un equipo
    const fetchPlayers = (teamId, setPlayers) => {
        fetch(`${config.API_BASE_URL}/titulares/${teamId}/`)
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error('Error al obtener los jugadores:', error));
    };

    // Efecto para obtener los jugadores del equipo izquierdo cuando se selecciona un equipo
    useEffect(() => {
        if (selectedTeamLeft) {
            fetchPlayers(selectedTeamLeft, setPlayersLeft);
        }
    }, [selectedTeamLeft]);

    // Efecto para obtener los jugadores del equipo derecho cuando se selecciona un equipo
    useEffect(() => {
        if (selectedTeamRight) {
            fetchPlayers(selectedTeamRight, setPlayersRight);
        }
    }, [selectedTeamRight]);

    // Función para abrir el modal de simulación
    const handleOpenSimulationModal = () => {
        setShowSimulationModal(true);
        simulateMatch()
    };

    // Función para cerrar el modal de simulación
    const handleCloseSimulationModal = () => {
        setShowSimulationModal(false);
    };

    // Función para obtener todos los jugadores de un equipo
    const fetchAllPlayers = (teamId, setPlayers, page = 1, pageSize = 5) => {
        fetch(`${config.API_BASE_URL}/jugadores/equipo/${teamId}/?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error('Error al obtener los jugadores:', error));
    };

    // Función para abrir el modal de cambio de jugador
    const handleOpenPlayerChangeModal = (player, alignment) => {
        setSelectedPlayer(player);
        setSelectedPosition(alignment);
        setShowPlayerChangeModal(true);

        // Obtener todos los jugadores del equipo seleccionado en el modal
        if (alignment === 'start') {
            fetchAllPlayers(selectedTeamLeft, setModalPlayers, 1, modalItemsPerPage);
        } else {
            fetchAllPlayers(selectedTeamRight, setModalPlayers, 1, modalItemsPerPage);
        }
        setShowPlayerList(false); // Reiniciar para mostrar equipos primero
    };
    {
        // mostrar la lista de jugadores en el modal si showPlayerList es true

        showPlayerList && (
            <>
                <Button variant="secondary" onClick={() => setShowPlayerList(false)}>Volver</Button>
                <ListGroup>
                    {modalPlayers.map(player => (
                        <ListGroup.Item
                            key={player.id}
                            action
                            onClick={() => handleSelectPlayer(player)}
                            active={newPlayer && newPlayer.id === player.id}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={player.url_imagen}
                                        alt={player.nombre}
                                        title={player.nombre}
                                        className="player-img-small me-2"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                    />
                                    {player.nombre}
                                </div>
                                <Button size="sm" onClick={() => handleSelectPlayer(player)}>Seleccionar</Button>
                            </div>
                        </ListGroup.Item>

                    ))}
                </ListGroup>
                <Pagination className="justify-content-center mt-3">
                    {Array.from({ length: Math.ceil(modalPlayers.length / 5) }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === modalPage} onClick={() => setModalPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </>
        )
    }

    // Función para cerrar el modal de cambio de jugador
    const handleClosePlayerChangeModal = () => {
        setShowPlayerChangeModal(false);
        setNewPlayer(null);
        setModalTeams([]);
        setModalPlayers([]);
        setModalQuery('');
    };

    // Función para seleccionar un jugador para el cambio
    const handleSelectPlayer = (player) => {
        setNewPlayer(player);
    };

    // Función para cambiar el jugador seleccionado
    const handleChangePlayer = () => {
        if (!newPlayer) return;

        if (selectedPosition === 'start') {
            setPlayersLeft(playersLeft.map(p => p.id === selectedPlayer.id ? newPlayer : p));
        } else {
            setPlayersRight(playersRight.map(p => p.id === selectedPlayer.id ? newPlayer : p));
        }

        handleClosePlayerChangeModal();
    };

    // Función para seleccionar un equipo para el lado izquierdo
    const handleSelectTeamLeft = (team) => {
        setSelectedTeamLeft(team.id);
        setQueryLeft(team.nombre);
        setSuggestedTeamsLeft([]);
    };

    // Función para seleccionar un equipo para el lado derecho
    const handleSelectTeamRight = (team) => {
        setSelectedTeamRight(team.id);
        setQueryRight(team.nombre);
        setSuggestedTeamsRight([]);
    };

    // Función para manejar el cambio en la búsqueda de equipos en el modal
    const handleSearchChange = (event, querySetter, setSuggestedTeams) => {
        const query = event.target.value.toLowerCase();
        querySetter(query);
        if (query.trim() !== '') {
            const filteredTeams = teams.filter(team => team.nombre.toLowerCase().includes(query));
            setSuggestedTeams(filteredTeams);
        } else {
            setSuggestedTeams([]);
        }
    };

    //Lo mismo para dentro del modal
    const handleModalSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setModalQuery(query);
        if (query.trim() !== '') {
            const filteredTeams = teams.filter(team => team.nombre.toLowerCase().includes(query));
            setModalTeams(filteredTeams);
        } else {
            setModalTeams([]);
        }
    };

    // Función para seleccionar un equipo en el modal
    const handleSelectModalTeam = (team) => {
        fetchPlayers(team.id, setModalPlayers); // Cambiar setModalPlayers por setPlayersRight o setPlayersLeft según corresponda
        setShowPlayerList(true); // Agregar esta línea para mostrar la lista de jugadores en lugar de los equipos
    };

    // Función para renderizar los jugadores en el campo de juego
    const renderPlayers = (players, alignment, isMirror) => {
        // Organizar los jugadores por posición
        const playersByPosition = {
            'Portero': [],
            'Defensa': [],
            'Mediocentro': [],
            'Delantero': []
        };
        // Filtrar y clasificar los jugadores por posición
        players.forEach(player => {
            const { demarcacion, goles, minutos_jugados } = player;
            player.goles_por_90 = minutos_jugados > 0 ? (goles / minutos_jugados) * 90 : 0;
            if (demarcacion.startsWith('Portero')) {
                playersByPosition['Portero'].push(player);
            } else if (demarcacion.startsWith('Defensa') || demarcacion.startsWith('Lateral')) {
                playersByPosition['Defensa'].push(player);
            } else if (demarcacion.startsWith('Medio')) {
                playersByPosition['Mediocentro'].push(player);
            } else if (demarcacion.startsWith('Delantero') || demarcacion.startsWith('Extremo')) {
                playersByPosition['Delantero'].push(player);
            }
        });

        playersByPosition['Defensa'] = playersByPosition['Defensa'].slice(0, 4);
        playersByPosition['Delantero'] = playersByPosition['Delantero'].slice(0, 3);

        // Orden de las posiciones en el campo (izquierdo o derecho)
        const positionsOrder = isMirror
            ? ['Delantero', 'Mediocentro', 'Defensa', 'Portero']
            : ['Portero', 'Defensa', 'Mediocentro', 'Delantero'];

        //renderizar los jugadores en el campo
        return (
            <div className={`team-${alignment} position-absolute top-0 ${alignment}-0 w-50 h-100 d-flex flex-column justify-content-evenly flex-wrap`}>
                {positionsOrder.map(position => (
                    <div key={position} className="line d-flex flex-column align-items-center justify-content-around mx-auto h-100">
                        {playersByPosition[position].map(player =>
                            <img
                                key={player.id}
                                src={player.url_imagen}
                                alt={player.nombre}
                                title={player.nombre}
                                className="player-img m-1"
                                style={{ width: '60%', height: 'auto' }}
                                onClick={() => handleOpenPlayerChangeModal(player, alignment)}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

      // Función para calcular las estadísticas del equipo
    const calculateTeamStats = (players) => {
        let totalElo = 0;
        let totalGoalsPer90 = 0;
        players.forEach(player => {
            totalElo += player.elo;
            totalGoalsPer90 += parseFloat((player.goles / player.minutos) * 90);
        });
        return { totalElo, totalGoalsPer90 };
    };

     // Función para simular un partido entre los equipos seleccionados
    const simulateMatch = () => {
         // Obtener las estadísticas de los equipos
        const statsLeft = calculateTeamStats(playersLeft);
        const statsRight = calculateTeamStats(playersRight);

        // Calcular el resultado simulado
        const eloDifference = statsLeft.totalElo - statsRight.totalElo;
        const eloFactor = eloDifference > 0 ? 1.25 : (eloDifference < 0 ? 0.75 : 1);

        const expectedGoalsLeft = statsLeft.totalGoalsPer90 * eloFactor;
        const expectedGoalsRight = statsRight.totalGoalsPer90 * (2 - eloFactor);

        // Calcula los goles reales asegurándote de que estén dentro de un rango válido
        const actualGoalsLeft = Math.max(0, Math.round(Math.random() * (expectedGoalsLeft / 2) + expectedGoalsLeft / 2));
        const actualGoalsRight = Math.max(0, Math.round(Math.random() * (expectedGoalsRight / 2) + expectedGoalsRight / 2));

        const selectedTeamLeftName = teams.find(team => team.id === selectedTeamLeft)?.nombre;
        const selectedTeamRightName = teams.find(team => team.id === selectedTeamRight)?.nombre;

        // Maneja el caso de empate 
        const resultText = actualGoalsLeft > actualGoalsRight
            ? `${selectedTeamLeftName} ha ganado          Resultado: (${actualGoalsLeft} - ${actualGoalsRight})`
            : (actualGoalsLeft < actualGoalsRight
                ? `${selectedTeamRightName} ha ganado     Resultado:(${actualGoalsRight} - ${actualGoalsLeft})`
                : `Empate (${actualGoalsLeft} - ${actualGoalsLeft})`);

        setShowSimulationModal(true);
        setResult(resultText);
    };
    //mostrar el campo de juego y sobre el los jugadores, además del resto de contenido
    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Simulador</h1>
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <InputGroup className="mb-2">
                                <FormControl
                                    placeholder="Buscar equipo por nombre..."
                                    value={queryLeft}
                                    onChange={(e) => handleSearchChange(e, setQueryLeft, setSuggestedTeamsLeft)}
                                />
                            </InputGroup>
                            {suggestedTeamsLeft.length > 0 && (
                                <Card>
                                    <Card.Body>
                                        <ListGroup className="autocomplete-suggestions">
                                            {suggestedTeamsLeft.map(team => (
                                                <ListGroup.Item
                                                    key={team.id}
                                                    action
                                                    onClick={() => handleSelectTeamLeft(team)}
                                                >
                                                    {team.nombre}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <InputGroup className="mb-2">
                                <FormControl
                                    placeholder="Buscar equipo por nombre..."
                                    value={queryRight}
                                    onChange={(e) => handleSearchChange(e, setQueryRight, setSuggestedTeamsRight)}
                                />
                            </InputGroup>
                            {suggestedTeamsRight.length > 0 && (
                                <Card>
                                    <Card.Body>
                                        <ListGroup className="autocomplete-suggestions">
                                            {suggestedTeamsRight.map(team => (
                                                <ListGroup.Item
                                                    key={team.id}
                                                    action
                                                    onClick={() => handleSelectTeamRight(team)}
                                                >
                                                    {team.nombre}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="text-center mb-4">
                <Col>
                    <Button onClick={simulateMatch} variant="primary" disabled={!selectedTeamLeft || !selectedTeamRight}>Simular</Button>
                </Col>
            </Row>
            <Modal show={showSimulationModal} onHide={handleCloseSimulationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Resultado de la simulación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {result && <p>{result}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSimulationModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPlayerChangeModal} onHide={handleClosePlayerChangeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showPlayerList && (
                        <>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Buscar equipo por nombre..."
                                    value={modalQuery}
                                    onChange={handleModalSearchChange}
                                />
                                <Button variant="primary" onClick={() => setModalQuery('')}>Limpiar</Button>
                            </InputGroup>
                            {modalTeams.map(team => (
                                <ListGroup key={team.id} className="mb-3">
                                    <ListGroup.Item action onClick={() => handleSelectModalTeam(team)}>
                                        {team.nombre}
                                    </ListGroup.Item>
                                </ListGroup>
                            ))}
                        </>
                    )}
                    {showPlayerList && (
                        <>
                            <Button variant="secondary" onClick={() => setShowPlayerList(false)}>Volver</Button>
                            <ListGroup>
                                {modalPlayers.map(player => (
                                    <ListGroup.Item
                                        key={player.id}
                                        action
                                        onClick={() => handleSelectPlayer(player)}
                                        active={newPlayer && newPlayer.id === player.id}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={player.url_imagen}
                                                    alt={player.nombre}
                                                    title={player.nombre}
                                                    className="player-img-small me-2"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                                />
                                                {player.nombre}
                                            </div>
                                            <Button size="sm" onClick={() => handleSelectPlayer(player)}>Seleccionar</Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePlayerChangeModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleChangePlayer} disabled={!newPlayer}>Cambiar</Button>
                </Modal.Footer>
            </Modal>
            <div className="field-container position-relative" style={{ width: '100%', height: '600px' }}>
                <img src={campo} alt="Campo" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {renderPlayers(playersLeft, 'start', false)}
                {renderPlayers(playersRight, 'end', true)}
            </div>
        </Container>
    );
};

export default Simulator;
