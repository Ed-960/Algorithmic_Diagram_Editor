import { useState } from 'react';
import { FieldProps } from '../../../../interfaces/interfaces';
import trash from './../../../../assets/trash.svg';

const Field = ({
  selectedComponent,
  scenario,
  setScenario,
  selectedComponents,
  setSelectedComponents,
  connectionCanvasRef,
  setSelectedComponent,
  isDragging,
  setIsDragging,
  handleDrag,
  handleDragStop,
  handleDragOver,
  handleDrop,
}: FieldProps) => {
  // remove
  const [isOverTrashCan, setIsOverTrashCan] = useState(false);

  const handleDragOverTrashCan = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    event.preventDefault();
    setIsOverTrashCan(true);
  };

  const handleDropOnTrashCan = (): void => {
    if (selectedComponent) {
      const updatedComponents = scenario.components.filter(
        (component) => component.id !== selectedComponent.id
      );

      // Удаление связей, содержащих удаленный компонент
      const updatedConnections = scenario.connections.filter(
        (connection) =>
          connection.from.id !== selectedComponent.id.toString() &&
          connection.to.id !== selectedComponent.id.toString()
      );

      const updatedSelectedComponents = selectedComponents.filter(
        (component) => component.id !== selectedComponent.id
      );
      setScenario((prevScenario) => ({
        ...prevScenario,
        components: updatedComponents,
        connections: updatedConnections,
      }));

      setSelectedComponents(updatedSelectedComponents);

      if (updatedComponents.length === 1) {
        setSelectedComponents([]);
      }
      setSelectedComponent(null);
    }
    setIsOverTrashCan(false);
    setIsDragging(false);
  };

  return (
    <div
      className='field'
      onMouseMove={handleDrag}
      onMouseUp={handleDragStop}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas
        id='connection-canvas'
        ref={connectionCanvasRef}
        className='connection-canvas'
        width='600'
        height='400'
      />
      {isDragging && (
        <div
          className={`trash-can ${isOverTrashCan ? 'trash-can-active' : ''}`}
          onDragOver={handleDragOverTrashCan}
          onDrop={handleDropOnTrashCan}
        >
          <img src={trash} alt='trash' />
        </div>
      )}
    </div>
  );
};

export default Field;
