import React, { useEffect, useRef, useState } from 'react';
import {
  Component,
  Connection,
  Music,
  Scenario,
  Variable,
} from '../../interfaces/interfaces';
import { getComponentIcon, getComponentLabel } from '../helpers/helpers';
import './scenarioEditor.scss';
/* eslint-disable react-hooks/exhaustive-deps */
import uniqid from 'uniqid';
import Footer from './subcomponents/Footer/Footer';
import Field from './subcomponents/Field/Field';
import ComponentPalette from './subcomponents/ComponentPalette/ComponentPalette';
import MusicPlaylist from './subcomponents/MusicPlaylist/MusicPlaylist';
import Popup from './subcomponents/PopUp/Popup';

const ScenarioEditor: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>({
    id: 1,
    name: 'Example',
    variables: [
      { id: 1, type: 'int', val: 'var1' },
      { id: 2, type: 'string', val: 'var2' },
    ],
    components: [],
    musicPlaylist: [],
    connections: [],
  });

  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [isSchema, setIsSchema] = useState(false);
  const [allowPlayMusic, setAllowPlayMusic] = useState(false);
  const handleSaveScenario = (): void => {
    const jsonScenario = JSON.stringify(scenario);
    alert(jsonScenario);
    // Отправка jsonScenario на бэкенд
  };

  const handleLoadScenario = (): void => {
    alert('Сценарий загружен');
    willSchemaWork();
    if (allow) handlePlayMusic();
  };

  const handleComponentDrop = (
    componentType: string,
    x: number,
    y: number
  ): void => {
    const newComponent: Component = {
      id: uniqid(),
      type: componentType,
      x: x - 70,
      y: y - 10,
      name: getComponentLabel(componentType),
      musicId: componentType === 'play_sound' ? selectedMusic?.id : undefined,
    };

    setScenario((prevScenario) => ({
      ...prevScenario,
      components: [...prevScenario.components, newComponent],
    }));

    setSelectedComponent(newComponent);
  };
  const handleDragStart = (
    event: React.MouseEvent<HTMLDivElement>,
    component: Component
  ): void => {
    setSelectedComponent(component);
    setIsDragging(true);
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleDrag = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (isDragging && selectedComponent) {
      const x = event.clientX - offset.x;
      const y = event.clientY - offset.y;
      const updatedComponent = { ...selectedComponent, x, y };

      setScenario((prevScenario) => ({
        ...prevScenario,
        components: prevScenario.components.map((c) =>
          c.id === updatedComponent.id ? updatedComponent : c
        ),
      }));
      setSelectedComponents((prevSelectedComponents) => {
        return prevSelectedComponents.map((c) =>
          c.id === updatedComponent.id ? updatedComponent : c
        );
      });
    }
  };

  const handleDragStop = (): void => {
    setIsDragging(false);
    setSelectedComponent(null);
    // drawConnection();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const componentType = event.dataTransfer.getData('text/plain');
    const x = event.clientX - offset.x;
    const y = event.clientY - offset.y;
    if (componentType !== '') {
      handleComponentDrop(componentType, x, y);
    }
  };

  const handleBlockClick = (
    componentId: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const component = scenario.components.find((c) => c.id === componentId);
    if (event.button === 2) {
      event.preventDefault();
      if (component) {
        setSelectedComponent(component);
        setSelectedComponents((prevSelectedComponents) => {
          const updatedComponents = [...prevSelectedComponents];

          const existingIndex = prevSelectedComponents.findIndex(
            (c) => c.id === componentId
          );

          if (existingIndex !== -1) {
            // Component already exists, move it to the end
            const existingComponent = updatedComponents.splice(
              existingIndex,
              1
            )[0];
            updatedComponents.push(existingComponent);
          } else {
            // Component doesn't exist, add it to the end
            updatedComponents.push(component);
          }

          return updatedComponents;
        });
      }
    }
  };

  const handlePlayMusic = (): void => {
    if (isMusicPlaying) {
      alert('уже играет одна музыка');
    }
    if (!isMusicPlaying && selectedMusic && selectedMusic.file) {
      const audio = new Audio(URL.createObjectURL(selectedMusic.file));
      audio.play();
      setSelectedMusic((prevMusic: any) => ({
        ...prevMusic,
        isPlaying: true,
      }));
      setIsMusicPlaying(true);
      audio.addEventListener('ended', () => {
        setIsMusicPlaying(false);
      });
    }
  };

  // stop music
  // ...
  const allow = isSchema && allowPlayMusic;

  // assingment
  const handleBlockDoubleClick = (componentId: string): void => {
    const component = scenario.components.find((c) => c.id === componentId);
    if (component?.type === 'assignment') {
      const var1Value = prompt('Введите значение переменной var1:');
      const var1Type = prompt('Введите тип переменной var1: int либо string');
      const var2Value = prompt(
        'Введите значение переменной var2: либо int либо string'
      );
      const var2Type = prompt('Введите тип переменной var2:');

      if (var1Value !== null && var2Value !== null) {
        const newVariables: Variable[] = [
          { id: 1, type: var1Type, val: var1Value },
          { id: 2, type: var2Type, val: var2Value },
        ];

        setScenario((prevScenario) => ({
          ...prevScenario,
          variables: newVariables,
        }));
      }
    }
  };

  // connection
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const connectionCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawConnection = (): void => {
    const canvas = connectionCanvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канваса

    if (selectedComponents.length < 2) {
      return;
    }

    const newConnections: Connection[] = [];
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    for (let i = 1; i < selectedComponents.length; i++) {
      const componentA = selectedComponents[i - 1];
      const componentB = selectedComponents[i];

      const startX = componentA.x;
      const startY = componentA.y - 80;
      const endX = componentB.x;
      const endY = componentB.y - 80;

      // Создание объекта Connection
      const connection: Connection = {
        from: {
          id: componentA.id.toString(),
          name: componentA.name,
        },
        to: {
          id: componentB.id.toString(),
          name: componentB.name,
        },
      };

      newConnections.push(connection);

      // Обновление массива connections
      setScenario((prevScenario) => ({
        ...prevScenario,
        connections: newConnections,
      }));

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawConnection();
  }, [selectedComponents]);

  // blocke schema
  function willSchemaWork() {
    let startCount = 0;
    let finishCount = 0;
    let startId = null;
    let finishId = null;
    let comparisonResult = true;

    for (let i = 0; i < scenario.connections.length; i++) {
      const connection = scenario.connections[i];
      const { from, to } = connection;
      if (from.name === 'Start' || to.name === 'Start') {
        if (startId === null || startId === from.id || startId === to.id) {
          startCount = 1;
          startId = from.id || to.id;
        } else {
          startCount++;
        }
      }
      if (from.name === 'Finish' || to.name === 'Finish') {
        if (finishId === null || finishId === from.id || finishId === to.id) {
          finishCount = 1;
          finishId = from.id || to.id;
        } else {
          finishCount++;
        }
      }
      if (startCount > 1 || finishCount > 1) {
        alert(
          'Ошибка: Больше одного стартового или финишного компонента: false.'
        );
        setIsSchema(false);
      }
      if (from.name === 'Comparison' || to.name === 'Comparison') {
        const var1 = scenario.variables[0];
        const var2 = scenario.variables[1];

        // Проверка условия сравнения
        if (var1.type === var2.type && var2.type === 'int') {
          if (+var1.val >= +var2.val) {
            comparisonResult = comparisonResult && true;
          } else {
            comparisonResult = false;
            break;
          }
        } else if (var1.type === var2.type && var2.type === 'string') {
          if (var1.val >= var2.val) {
            comparisonResult = comparisonResult && true;
          } else {
            comparisonResult = false;
            break;
          }
        } else {
          break;
        }
      } else if (from.name === 'Play Sound' || to.name === 'Play Sound') {
        setAllowPlayMusic(true);
      } else {
        setAllowPlayMusic(false);
      }
    }

    if (startCount === 1 && finishCount === 1 && comparisonResult) {
      alert(
        'Оба стартовый и финишный компоненты присутствуют и все условия сравнения выполнены: true.'
      );
      setIsSchema(true);
    } else {
      alert(
        'Стартовый или финишный компонент отсутствует или условия сравнения не выполнены: false.'
      );
      setIsSchema(false);
    }
  }

  function getComponentBackgroundColor(component: Component) {
    if (isSchema) {
      if (component.name === 'Start') {
        return '#2fff5c';
      } else if (component.name === 'Finish') {
        return '#e25050';
      }
    }

    if (selectedComponent && selectedComponent.id === component.id) {
      return 'lightblue';
    }

    return 'white';
  }

  const clearField = () => {
    setSelectedComponents([]);
    setScenario((prevScenario) => ({
      ...prevScenario,
      components: [],
      connections: [],
      variables: [],
    }));
    setSelectedComponent(null);
    setIsSchema(false);
  };

  //popup
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className='main'>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
      <h1 className='mainTitle'>Algorithmic Diagram Editor</h1>
      <div className='container'>
        <div>
          <Field
            selectedComponent={selectedComponent}
            scenario={scenario}
            setScenario={setScenario}
            selectedComponents={selectedComponents}
            setSelectedComponents={setSelectedComponents}
            connectionCanvasRef={connectionCanvasRef}
            setSelectedComponent={setSelectedComponent}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            handleDrag={handleDrag}
            handleDragStop={handleDragStop}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
          <Footer
            handleSaveScenario={handleSaveScenario}
            handleLoadScenario={handleLoadScenario}
            clearField={clearField}
          />
        </div>
        <div className='sidebar'>
          <ComponentPalette />
          <MusicPlaylist
            isPlaying={selectedMusic?.isPlaying}
            scenario={scenario}
            setScenario={setScenario}
            setSelectedMusic={setSelectedMusic}
          />
        </div>
      </div>
      {scenario.components.map((component) => (
        <div
          className='block'
          key={component.id}
          style={{
            backgroundColor: getComponentBackgroundColor(component),
            position: 'absolute',
            left: component.x,
            top: component.y,
          }}
          draggable
          onMouseDown={(event) => handleDragStart(event, component)}
          onMouseUp={handleDragStop}
          onContextMenu={(event) => handleBlockClick(component.id, event)}
          onDoubleClick={() => handleBlockDoubleClick(component.id)}
        >
          <div>{getComponentIcon(component.type)}</div>
          <div className='block_name'>{component.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioEditor;
