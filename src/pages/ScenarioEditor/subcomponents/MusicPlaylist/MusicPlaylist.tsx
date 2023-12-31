import { useState } from 'react';
import { Music, MusicPlaylistProps } from '../../../../interfaces/interfaces';
import './musicPlaylist.scss';

const MusicPlaylist = ({
  handlePlayStop,
  play,
  allow,
  scenario,
  setScenario,
  setSelectedMusic,
  handlePlayMusic,
}: MusicPlaylistProps) => {
  const handleMusicItemClick = (musicId: number): void => {
    const music = scenario.musicPlaylist.find((music) => music.id === musicId);
    setSelectedMusic(music || null);
    setSelectedItemId(musicId);
    allow && handlePlayMusic(); // Воспроизводим новую музыку при выборе
  };

  const handleMusicSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const newMusic: Music = {
        id: scenario.musicPlaylist.length + 1,
        name: file.name,
        file,
      };

      setScenario((prevScenario) => ({
        ...prevScenario,
        musicPlaylist: [...prevScenario.musicPlaylist, newMusic],
      }));
    }
  };

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  return (
    <div className='music-box'>
      <h2>Upload a music</h2>
      <input type='file' accept='audio/*' onChange={handleMusicSelect} />
      <div className='playlist'>
        <h3>Playlist</h3>
        <div className='playlist_ovelflow'>
          {scenario.musicPlaylist.map((music) => (
            <div
              className={`music-item ${
                selectedItemId === music.id ? 'selected' : ''
              }`}
              key={music.id}
              draggable
              onClick={() => handleMusicItemClick(music.id)}
              style={{
                backgroundColor: selectedItemId === music.id ? '#969696' : '',
              }}
            >
              {music.name}
            </div>
          ))}
        </div>
        <div className='btns'>
          <button className='footer_btn' onClick={play}>
            Play
          </button>
          <button className='footer_btn' onClick={handlePlayStop}>
            Pause
          </button>
        </div>
      </div>
      <div className='property-palette'></div>
    </div>
  );
};

export default MusicPlaylist;
