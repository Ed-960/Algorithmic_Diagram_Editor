import { Music, MusicPlaylistProps } from '../../../../interfaces/interfaces';

const MusicPlaylist = ({
  scenario,
  setScenario,
  setSelectedMusic,
  isPlaying,
}: MusicPlaylistProps) => {
  const handleMusicItemClick = (musicId: number): void => {
    const music = scenario.musicPlaylist.find((music) => music.id === musicId);
    setSelectedMusic(music || null);
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

  return (
    <div className='music-box'>
      <h2>Upload a music</h2>
      <input type='file' accept='audio/*' onChange={handleMusicSelect} />
      <div className='playlist'>
        <h3>Playlist</h3>
        <div className='playlist_ovelflow'>
          {scenario.musicPlaylist.map((music) => (
            <div
              className='music-item'
              key={music.id}
              draggable
              onClick={() => handleMusicItemClick(music.id)}
              style={{ backgroundColor: isPlaying ? '#969696' : '#e9e9e9' }}
            >
              {music.name}
            </div>
          ))}
        </div>
      </div>
      <div className='property-palette'></div>
    </div>
  );
};

export default MusicPlaylist;