import { useEffect } from 'react';
import { PopupProps } from '../../../../interfaces/interfaces';
import './popup.scss';

const Popup = ({ showPopup, setShowPopup }: PopupProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setShowPopup]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        setShowPopup(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Instructions</h2>
            <div className='instructions'>
              &nbsp; <b>To move</b> the blocks, you need to click and drag them
              with the left mouse button, and when you release the button, the
              component is placed on the canvas. <br /> <br />
              &nbsp; <b>To connect</b> any two components, you need to
              right-click on each of them. <br /> <br />
              &nbsp; <b>To successfully run</b> the circuit, several conditions
              must be met:
              <ul>
                <li>
                  The presence of "start" and "finish" components: These two
                  components should exist, and any other components should be
                  positioned between them.
                </li>
                <li>
                  If there are "comparison" and "assignment" blocks:
                  Double-click on "assignment" one to enter variable values. If
                  the first variable is greater than or equal to the second
                  variable, the circuit will execute; otherwise, it will not.
                </li>
                <li>
                  If there is a "play music" component: You can upload music and
                  select from a playlist by clicking on it. After successfully
                  running the circuit, the music will play. If you don't click
                  on music item, it won't play, on this case you can click it
                  then try tu run it again.
                </li>
              </ul>
              <div className='note'>
                &nbsp; Note: We can not complete the circuit loop; it is assumed
                to be closed for the purpose of demonstration. This is simply to
                showcase the operation of a linear circuit.
              </div>
            </div>

            <button onClick={handleClosePopup}>Understood</button>
          </div>
        </div>
      )}
      {/* Rest of your app */}
    </div>
  );
};

export default Popup;
