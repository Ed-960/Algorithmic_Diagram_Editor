import React from 'react';
import { FooterProps } from '../../../../interfaces/interfaces';

const Footer = ({
  handleSaveScenario,
  handleLoadScenario,
  clearField,
}: FooterProps) => {
  return (
    <div className='footer'>
      <button className='footer_btn' onClick={handleSaveScenario}>
        Save Scenario
      </button>
      <button className='footer_btn' onClick={handleLoadScenario}>
        Run Scenario
      </button>
      <button className='footer_btn' onClick={clearField}>
        Clear Field
      </button>
    </div>
  );
};

export default Footer;
