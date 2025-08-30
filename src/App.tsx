import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Clock, Trophy, Users, RotateCcw } from 'lucide-react';

// Tipos TypeScript
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Movie {
  id: string;
  title: string;
  year: string;
  description: string;
  questions: Question[];
}

interface PlayerAnswer {
  player1?: number;
  player2?: number;
}

interface GameState {
  currentMovie: string | null;
  currentQuestion: number;
  player1Score: number;
  player2Score: number;
  player1Name: string;
  player2Name: string;
  timeLeft: number;
  isTimeUp: boolean;
  showCorrectAnswer: boolean;
  playerAnswers: PlayerAnswer;
  gamePhase: 'menu' | 'playing' | 'results';
}

// Base de datos de preguntas
const MOVIES: Movie[] = [
  {
    id: 'conjuro1',
    title: 'El Conjuro',
    year: '2013',
    description: 'El caso de la familia Perron - Bathsheba Sherman en Rhode Island',
    questions: [
      {
        question: '¿En qué año se mudó la familia Perron a la casa embrujada de Rhode Island?',
        options: ['1970', '1971', '1972', '1973'],
        correctAnswer: 1
      },
      {
        question: '¿Cuál es el nombre de la bruja que habitaba la casa antes que los Perron?',
        options: ['Bathsheba Sherman', 'Abigail Williams', 'Rebecca Towne', 'Bridget Bishop'],
        correctAnswer: 0
      },
      {
        question: '¿Cómo murió Bathsheba Sherman según la investigación de los Warren?',
        options: ['Quemada en la hoguera', 'Se ahorcó en el árbol del patio', 'Asesinada por los vecinos', 'Murió de vejez'],
        correctAnswer: 1
      },
      {
        question: '¿Cuál de las hijas Perron fue la más afectada por la posesión?',
        options: ['Andrea', 'Nancy', 'Christine', 'Carolyn (la madre)'],
        correctAnswer: 3
      },
      {
        question: '¿Qué objeto utilizó Lorraine Warren para comunicarse con los espíritus?',
        options: ['Tabla Ouija', 'Péndulo', 'Espejo', 'Sus propias visiones'],
        correctAnswer: 3
      },
      {
        question: '¿En qué habitación de la casa ocurrían los fenómenos más intensos?',
        options: ['El ático', 'El sótano', 'La sala principal', 'El dormitorio principal'],
        correctAnswer: 1
      },
      {
        question: '¿Qué hizo finalmente que Bathsheba liberara a Carolyn Perron?',
        options: ['Un exorcismo católico', 'El amor maternal de Carolyn por sus hijas', 'Agua bendita', 'Oraciones en latín'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'conjuro2',
    title: 'El Conjuro 2',
    year: '2016',
    description: 'El caso Enfield - La familia Hodgson y la aparición de Valak',
    questions: [
      {
        question: '¿En qué ciudad de Inglaterra ocurre el caso de El Conjuro 2?',
        options: ['Londres', 'Manchester', 'Enfield', 'Birmingham'],
        correctAnswer: 2
      },
      {
        question: '¿Cuál es el nombre del espíritu principal que atormentaba a la familia Hodgson?',
        options: ['Bill Wilkins', 'Maurice Grosse', 'Harry Price', 'Johnny Hodgson'],
        correctAnswer: 0
      },
      {
        question: '¿Qué edad tenía Janet Hodgson, la niña principalmente afectada por la posesión?',
        options: ['10 años', '11 años', '12 años', '13 años'],
        correctAnswer: 1
      },
      {
        question: '¿Cómo se llama la entidad demoníaca que Ed Warren pinta en sus visiones?',
        options: ['Bathsheba', 'Valak', 'La Llorona', 'Annabelle'],
        correctAnswer: 1
      },
      {
        question: '¿Qué juguete se mueve solo en la casa de los Hodgson como evidencia paranormal?',
        options: ['Un coche de control remoto', 'Una pelota de fútbol', 'Un tren eléctrico', 'Una muñeca'],
        correctAnswer: 0
      },
      {
        question: '¿Qué le sucede a Ed Warren durante la investigación que casi lo mata?',
        options: ['Es poseído', 'Sufre un ataque cardíaco', 'Cae desde gran altura', 'Es atacado por un demonio'],
        correctAnswer: 2
      },
      {
        question: '¿Cómo logran finalmente expulsar al espíritu de Bill Wilkins?',
        options: ['Con agua bendita', 'Convenciéndolo de que debe irse', 'Con un exorcismo completo', 'Quemando sus pertenencias'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'conjuro3',
    title: 'El Conjuro 3: El Diablo Me Obligó a Hacerlo',
    year: '2021',
    description: 'El caso de Arne Johnson - Primera defensa legal por posesión demoníaca',
    questions: [
      {
        question: '¿Cuál es el nombre completo del joven que alegó posesión demoníaca como defensa legal?',
        options: ['Arne Cheyenne Johnson', 'Arne David Johnson', 'David Cheyenne Johnson', 'David Arne Glatzel'],
        correctAnswer: 0
      },
      {
        question: '¿A quién asesinó Arne Johnson mientras estaba supuestamente poseído?',
        options: ['Su vecino', 'Su casero Alan Bono', 'Su hermano', 'Un extraño'],
        correctAnswer: 1
      },
      {
        question: '¿Cómo se llamaba el niño que fue exorcizado antes de que Arne fuera poseído?',
        options: ['David Johnson', 'David Glatzel', 'Michael Glatzel', 'Daniel Glatzel'],
        correctAnswer: 1
      },
      {
        question: '¿Qué encontraron los Warren que explicaba la fuente de la maldición?',
        options: ['Un libro satánico', 'Un altar con un tótem maldito', 'Una muñeca vudú', 'Un espejo encantado'],
        correctAnswer: 1
      },
      {
        question: '¿Quién era la satanista que había lanzado la maldición?',
        options: ['Una bruja local', 'Isla Kastner', 'Una vecina envidiosa', 'La abuela de David'],
        correctAnswer: 1
      },
      {
        question: '¿Qué le pasa a Lorraine Warren durante la investigación de este caso?',
        options: ['Pierde temporalmente sus poderes', 'Es poseída brevemente', 'Casi muere por la maldición', 'Se desmaya repetidas veces'],
        correctAnswer: 2
      },
      {
        question: '¿Cuál fue el veredicto final del juicio de Arne Johnson?',
        options: ['Inocente por posesión demoníaca', 'Culpable de asesinato en primer grado', 'Culpable de homicidio involuntario', 'Declarado mentalmente incompetente'],
        correctAnswer: 2
      }
    ]
  }
];

const QUESTION_TIME = 15; // 8 segundos por pregunta

export default function ConjuroTrivia() {
  const [gameState, setGameState] = useState<GameState>({
    currentMovie: null,
    currentQuestion: 0,
    player1Score: 0,
    player2Score: 0,
    player1Name: '',
    player2Name: '',
    timeLeft: QUESTION_TIME,
    isTimeUp: false,
    showCorrectAnswer: false,
    playerAnswers: {},
    gamePhase: 'menu'
  });

  // Timer effect
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && gameState.timeLeft > 0 && !gameState.isTimeUp) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && !gameState.isTimeUp) {
      setGameState(prev => ({
        ...prev,
        isTimeUp: true,
        showCorrectAnswer: true
      }));
    }
  }, [gameState.timeLeft, gameState.isTimeUp, gameState.gamePhase]);

  // Auto advance to next question
  useEffect(() => {
    if (gameState.showCorrectAnswer) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 3000); // Show answer for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [gameState.showCorrectAnswer]);

  const startGame = (movieId: string) => {
    if (!gameState.player1Name.trim() || !gameState.player2Name.trim()) {
      alert('Por favor, ingresa los nombres de ambos jugadores');
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentMovie: movieId,
      currentQuestion: 0,
      player1Score: 0,
      player2Score: 0,
      timeLeft: QUESTION_TIME,
      isTimeUp: false,
      showCorrectAnswer: false,
      playerAnswers: {},
      gamePhase: 'playing'
    }));
  };

  const handleAnswer = (player: 'player1' | 'player2', answerIndex: number) => {
    if (gameState.isTimeUp) return;

    setGameState(prev => ({
      ...prev,
      playerAnswers: {
        ...prev.playerAnswers,
        [player]: answerIndex
      }
    }));

    // Check if both players have answered
    const newAnswers = {
      ...gameState.playerAnswers,
      [player]: answerIndex
    };

    if (newAnswers.player1 !== undefined && newAnswers.player2 !== undefined) {
      // Both answered, show correct answer immediately
      setGameState(prev => ({
        ...prev,
        isTimeUp: true,
        showCorrectAnswer: true,
        playerAnswers: newAnswers
      }));
    }
  };

  const nextQuestion = () => {
    if (!gameState.currentMovie) return;

    const movie = MOVIES.find(m => m.id === gameState.currentMovie)!;
    const currentQ = movie.questions[gameState.currentQuestion];
    
    // Calculate scores
    let newPlayer1Score = gameState.player1Score;
    let newPlayer2Score = gameState.player2Score;

    if (gameState.playerAnswers.player1 === currentQ.correctAnswer) {
      newPlayer1Score++;
    }
    if (gameState.playerAnswers.player2 === currentQ.correctAnswer) {
      newPlayer2Score++;
    }

    if (gameState.currentQuestion >= movie.questions.length - 1) {
      // Game finished
      setGameState(prev => ({
        ...prev,
        player1Score: newPlayer1Score,
        player2Score: newPlayer2Score,
        gamePhase: 'results'
      }));
    } else {
      // Next question
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        player1Score: newPlayer1Score,
        player2Score: newPlayer2Score,
        timeLeft: QUESTION_TIME,
        isTimeUp: false,
        showCorrectAnswer: false,
        playerAnswers: {}
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentMovie: null,
      currentQuestion: 0,
      player1Score: 0,
      player2Score: 0,
      player1Name: '',
      player2Name: '',
      timeLeft: QUESTION_TIME,
      isTimeUp: false,
      showCorrectAnswer: false,
      playerAnswers: {},
      gamePhase: 'menu'
    });
  };

  const getCurrentMovie = () => {
    return MOVIES.find(m => m.id === gameState.currentMovie);
  };

  const getCurrentQuestion = () => {
    const movie = getCurrentMovie();
    return movie?.questions[gameState.currentQuestion];
  };

  const getWinner = () => {
    if (gameState.player1Score > gameState.player2Score) {
      return { winner: gameState.player1Name, score: gameState.player1Score, loserScore: gameState.player2Score };
    } else if (gameState.player2Score > gameState.player1Score) {
      return { winner: gameState.player2Name, score: gameState.player2Score, loserScore: gameState.player1Score };
    } else {
      return { winner: 'Empate', score: gameState.player1Score, loserScore: gameState.player2Score };
    }
  };

  // MENU PHASE
  if (gameState.gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-background dark p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary mb-2 font-serif tracking-wider drop-shadow-2xl">
              EL CONJURO
            </h1>
            <p className="text-xl text-muted-foreground mb-6">Trivia de Terror • 2 Jugadores</p>
            
            {/* Player inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="space-y-2">
                <label className="text-primary font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jugador 1
                </label>
                <Input
                  placeholder="Nombre del Jugador 1"
                  value={gameState.player1Name}
                  onChange={(e: { target: { value: any; }; }) => setGameState(prev => ({ ...prev, player1Name: e.target.value }))}
                  className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-primary font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jugador 2
                </label>
                <Input
                  placeholder="Nombre del Jugador 2"
                  value={gameState.player2Name}
                  onChange={(e: { target: { value: any; }; }) => setGameState(prev => ({ ...prev, player2Name: e.target.value }))}
                  className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Movie Selection */}
          <div className="grid gap-6 md:grid-cols-3">
            {MOVIES.map((movie) => (
              <Card key={movie.id} className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="text-primary text-xl font-serif">
                    {movie.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    <Badge variant="secondary" className="mb-2 bg-secondary text-secondary-foreground">{movie.year}</Badge>
                    <br />
                    {movie.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => startGame(movie.id)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:scale-105 transition-transform shadow-lg"
                    disabled={!gameState.player1Name.trim() || !gameState.player2Name.trim()}
                  >
                    Jugar Trivia • 7 Preguntas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reglas del Juego
              </CardTitle>
            </CardHeader>
            <CardContent className="text-card-foreground space-y-2">
              <p>• Cada pregunta tiene <strong className="text-primary">8 segundos</strong> para responder</p>
              <p>• Ambos jugadores deben hacer click en su respuesta</p>
              <p>• Cada respuesta correcta suma <strong className="text-primary">+1 punto</strong></p>
              <p>• Al finalizar las 7 preguntas se mostrará el ganador</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // PLAYING PHASE
  if (gameState.gamePhase === 'playing') {
    const movie = getCurrentMovie();
    const question = getCurrentQuestion();

    if (!movie || !question) return null;

    return (
      <div className="min-h-screen bg-background dark p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with scores and timer */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <h3 className="text-primary font-semibold">{gameState.player1Name}</h3>
              <div className="text-2xl font-bold text-foreground">{gameState.player1Score}</div>
            </div>
            
            <div className="text-center">
              <h2 className="text-primary font-serif text-2xl mb-2">{movie.title}</h2>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Pregunta {gameState.currentQuestion + 1} de {movie.questions.length}
              </Badge>
            </div>

            <div className="text-center">
              <h3 className="text-primary font-semibold">{gameState.player2Name}</h3>
              <div className="text-2xl font-bold text-foreground">{gameState.player2Score}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold transition-colors duration-300 ${
              gameState.timeLeft <= 3 ? 'text-destructive animate-pulse' : 'text-foreground'
            }`}>
              {gameState.timeLeft}
            </div>
            <p className="text-muted-foreground mt-2">
              {gameState.isTimeUp ? 'Tiempo agotado!' : 'segundos restantes'}
            </p>
          </div>

          {/* Question */}
          <Card className="mb-8 bg-card border-border shadow-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6 text-center">
                {question.question}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => {
                  let buttonClass = "p-4 text-left transition-all min-h-[60px] flex items-center border-2";
                  
                  if (gameState.showCorrectAnswer) {
                    if (index === question.correctAnswer) {
                      buttonClass += " bg-green-500/20 text-green-500 border-green-500/50 shadow-green-500/20 shadow-lg";
                    } else if (gameState.playerAnswers.player1 === index || gameState.playerAnswers.player2 === index) {
                      buttonClass += " bg-destructive/20 text-destructive border-destructive/50";
                    } else {
                      buttonClass += " bg-muted text-muted-foreground border-border opacity-60";
                    }
                  } else {
                    if (gameState.playerAnswers.player1 === index || gameState.playerAnswers.player2 === index) {
                      buttonClass += " bg-primary/20 text-primary border-primary/50 shadow-primary/20 shadow-lg";
                    } else {
                      buttonClass += " bg-card hover:bg-accent text-card-foreground border-border hover:border-primary/30";
                    }
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        // Determine which player is clicking
                        if (gameState.playerAnswers.player1 === undefined) {
                          handleAnswer('player1', index);
                        } else if (gameState.playerAnswers.player2 === undefined) {
                          handleAnswer('player2', index);
                        }
                      }}
                      disabled={gameState.isTimeUp || (gameState.playerAnswers.player1 !== undefined && gameState.playerAnswers.player2 !== undefined)}
                      className={buttonClass}
                      variant="outline"
                    >
                      <span className="font-semibold mr-3 text-primary">{String.fromCharCode(65 + index)})</span>
                      {option}
                    </Button>
                  );
                })}
              </div>

              {/* Player answer indicators */}
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-primary">
                  {gameState.player1Name}: {gameState.playerAnswers.player1 !== undefined ? 
                    `Opción ${String.fromCharCode(65 + gameState.playerAnswers.player1)}` : 
                    'Sin responder'}
                </div>
                <div className="text-primary">
                  {gameState.player2Name}: {gameState.playerAnswers.player2 !== undefined ? 
                    `Opción ${String.fromCharCode(65 + gameState.playerAnswers.player2)}` : 
                    'Sin responder'}
                </div>
              </div>
            </CardContent>
          </Card>

          {gameState.showCorrectAnswer && (
            <div className="text-center">
              <p className="text-green-500 font-semibold text-lg mb-2">
                ✅ Respuesta correcta: {String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}
              </p>
              <p className="text-muted-foreground">Siguiente pregunta en unos segundos...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // RESULTS PHASE
  if (gameState.gamePhase === 'results') {
    const result = getWinner();

    return (
      <div className="min-h-screen bg-background dark p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full bg-card border-border shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8" />
              {result.winner === 'Empate' ? '¡Empate!' : '¡Ganador!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {result.winner !== 'Empate' ? (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{result.winner}</h3>
                <p className="text-card-foreground">
                  {result.score} puntos vs {result.loserScore} puntos
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Empate Técnico</h3>
                <p className="text-card-foreground">
                  Ambos jugadores: {result.score} puntos
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-card-foreground">
                <span>{gameState.player1Name}:</span>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{gameState.player1Score}/7</Badge>
              </div>
              <div className="flex justify-between text-card-foreground">
                <span>{gameState.player2Name}:</span>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{gameState.player2Score}/7</Badge>
              </div>
            </div>

            <Button 
              onClick={resetGame}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
              Volver al Menú Principal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}