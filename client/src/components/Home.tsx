import { quickCards, releases } from '../data/home'

type HomeProps = { onOpenPlaylist: () => void }

function Home({ onOpenPlaylist }: HomeProps) {
  return (
    <section className="home">
      <div className="content-filters">
        <button className="content-button">All</button><button className="content-button">Music</button><button className="content-button">Podcasts</button>
      </div>
      <div className="quick-play">
        {quickCards.map((card) => (
          <button className="quick-card" key={card.title}>
            <img src={`https://picsum.photos/seed/${card.seed}/100`} alt={card.title} /><span>{card.title}</span>
          </button>
        ))}
      </div>
      <div className="section-heading"><h1>Pre-save upcoming releases</h1><button type="button">Show all</button></div>
      <div className="upcoming-release">
        {releases.map((release) => (
          <button className="upcoming-card" key={release.title}>
            <img src={`https://picsum.photos/seed/${release.seed}/350`} alt={release.title} />
            <span>{release.title}</span><span className="upcoming-title">{release.artist}</span>
          </button>
        ))}
      </div>
      <div className="section-heading"><h1>Rock musics for you</h1><button type="button">Show all</button></div>
      <div className="upcoming-release">
        <button className="upcoming-card" onClick={onOpenPlaylist}>
          <img src="https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84ca966977380ba83ad20f968e" alt="Rock Mix" />
          <span>Rock Mix</span><span className="upcoming-title">Playlist • Spotify</span>
        </button>
      </div>
    </section>
  )
}

export default Home
