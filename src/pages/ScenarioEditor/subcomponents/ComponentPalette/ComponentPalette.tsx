import React from 'react';
import {
  componentPalette,
  getComponentIcon,
  getComponentLabel,
} from '../../../helpers/helpers';

const ComponentPalette = () => {
  const handleComponentPaletteDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    componentType: string
  ): void => {
    event.dataTransfer.setData('text/plain', componentType);
  };

  return (
    <div className='component-palette'>
      <h2>Components</h2>
      {componentPalette.map((componentType) => (
        <div
          className='component'
          key={componentType}
          draggable
          onDragStart={(event) =>
            handleComponentPaletteDragStart(event, componentType)
          }
        >
          <button type='button' className='component-boxes'>
            <div>{getComponentIcon(componentType)}</div>
            <span>{getComponentLabel(componentType)}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ComponentPalette;
