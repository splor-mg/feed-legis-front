import { useState } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const cards = files.map(filename => {
    const content = fs.readFileSync(path.join(dataDir, filename), 'utf-8');
    const json = JSON.parse(content);
    return {
      ...json,
      filename,
    };
  });
  return { props: { cards } };
}

function Card({ card, onLike, onDislike, userId }) {
  const [liked, setLiked] = useState(card.up_votes?.includes(userId));
  const [disliked, setDisliked] = useState(card.down_votes?.includes(userId));
  const [upVotes, setUpVotes] = useState(card.up_votes?.length || 0);
  const [downVotes, setDownVotes] = useState(card.down_votes?.length || 0);
  const [loading, setLoading] = useState(false);

  async function handleVote(type) {
    if (!userId) return;
    setLoading(true);
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: card.filename, userId, voteType: type }),
    });
    const data = await res.json();
    setUpVotes(Array.isArray(data.up_votes) ? data.up_votes.length : 0);
    setDownVotes(Array.isArray(data.down_votes) ? data.down_votes.length : 0);
    setLiked(type === 'up');
    setDisliked(type === 'down');
    setLoading(false);
    if (type === 'up' && onLike) onLike();
    if (type === 'down' && onDislike) onDislike();
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
      marginBottom: '36px',
      padding: '36px',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '4px' }}>
        <div style={{ fontWeight: 700, fontSize: '20px', color: '#1a237e', letterSpacing: '0.01em' }}>{card.institution_name}</div>
        <div style={{ flex: 1 }} />
        <div style={{ color: '#555', fontSize: '15px', fontWeight: 500, textAlign: 'right', minWidth: '180px' }}><b>Data Publicação:</b> {card.publication_date}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '0px' }}>
        <div style={{ color: '#222', fontSize: '19px', fontWeight: 600 }}><b>Título:</b> {card.publication_title}</div>
        <div style={{ flex: 1 }} />
        <div style={{ minWidth: '200px', textAlign: 'right' }}>
          <a href={card.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0', fontWeight: 500, textDecoration: 'underline', fontSize: '15px' }}>
            Link para a Publicação
          </a>
        </div>
      </div>
      <div style={{ color: '#333', fontSize: '16.5px', lineHeight: 1.7, whiteSpace: 'pre-line', background: '#f7f8fa', borderRadius: '8px', padding: '14px 18px' }}><b>Resumo:</b> <br />{card.short_summary}</div>
      <div style={{ color: '#333', fontSize: '16.5px', lineHeight: 1.7, whiteSpace: 'pre-line', background: '#f7f8fa', borderRadius: '8px', padding: '14px 18px' }}><b>Justificativa:</b> <br />{card.classification_reason}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '2px' }}>
        <div style={{ color: '#444', fontSize: '15px' }}><b>tags:</b> {card.tags && card.tags.length > 0 ? card.tags.join(', ') : '-'}</div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => handleVote('up')}
          aria-label={liked ? 'Desmarcar relevante' : 'Marcar como relevante'}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            outline: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            fontSize: '22px',
            transition: 'transform 0.1s',
            marginRight: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <img
            src="/images/thumbs_up.png"
            alt={liked ? 'Curtido' : 'Curtir'}
            style={{
              width: 36,
              height: 36,
              opacity: liked ? 1 : 0.4,
              filter: liked ? 'none' : 'grayscale(80%)',
              transition: 'opacity 0.2s, filter 0.2s',
            }}
          />
          <span style={{ marginLeft: 6, fontWeight: 600, color: '#388e3c', fontSize: 16 }}>{upVotes}</span>
        </button>
        <button
          onClick={() => handleVote('down')}
          aria-label={disliked ? 'Desmarcar não relevante' : 'Marcar como não relevante'}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            outline: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            fontSize: '22px',
            transition: 'transform 0.1s',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <img
            src="/images/thumbs_down.png"
            alt={disliked ? 'Não relevante' : 'Marcar como não relevante'}
            style={{
              width: 36,
              height: 36,
              opacity: disliked ? 1 : 0.4,
              filter: disliked ? 'none' : 'grayscale(80%)',
              transition: 'opacity 0.2s, filter 0.2s',
            }}
          />
          <span style={{ marginLeft: 6, fontWeight: 600, color: '#d32f2f', fontSize: 16 }}>{downVotes}</span>
        </button>
      </div>
    </div>
  );
}

function LikeToast({ show, type }) {
  return (
    <div style={{
      position: 'fixed',
      right: '32px',
      bottom: show ? '32px' : '0px',
      opacity: show ? 1 : 0,
      pointerEvents: 'none',
      background: '#fff',
      color: type === 'like' ? '#388e3c' : '#d32f2f',
      border: `1.5px solid ${type === 'like' ? '#b2dfdb' : '#ffcdd2'}`,
      borderRadius: '12px',
      boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
      padding: '18px 32px',
      fontSize: '17px',
      fontWeight: 500,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'opacity 0.7s, bottom 0.7s',
    }}>
      <img
        src={type === 'like' ? '/images/thumbs_up.png' : '/images/thumbs_down.png'}
        alt={type === 'like' ? 'Curtido' : 'Não relevante'}
        style={{ width: 32, height: 32, marginRight: 10, verticalAlign: 'middle' }}
      />
      {type === 'like' ? 'Publicação marcada como relevante' : 'Publicação marcada como não relevante'}
    </div>
  );
}

export default function Home({ cards }) {
  const [activeTab, setActiveTab] = useState('related');
  const [showLikeToast, setShowLikeToast] = useState(false);
  const [likeType, setLikeType] = useState('like');
  const { isSignedIn, user } = useUser();
  const userId = user?.id;
  const tabs = [
    { label: 'Relacionado', value: 'related' },
    { label: 'Não Relacionado', value: 'not_related' },
  ];
  const filteredCards = cards.filter(card => card.classification === activeTab);

  function handleLike() {
    setLikeType('like');
    setShowLikeToast(true);
    setTimeout(() => setShowLikeToast(false), 2200);
  }
  function handleDislike() {
    setLikeType('dislike');
    setShowLikeToast(true);
    setTimeout(() => setShowLikeToast(false), 2200);
  }

  return (
    <div style={{ /* maxWidth: '950px', */ width: '100%', margin: 0, padding: '32px 0', background: '#f5f6fa', minHeight: '100vh', fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingRight: 32 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSignedIn ? (
            <>
              <span style={{ fontSize: '15px', color: '#333' }}>
                Bem-vindo, {user.firstName || (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || 'usuário'}!
              </span>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button style={{
                padding: '8px 18px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Entrar
              </button>
            </SignInButton>
          )}
        </div>
      </div>
      <h1 style={{ fontSize: '2.2rem', color: '#222', marginBottom: '36px', textAlign: 'center' }}>Documentos Legislativos</h1>
      <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', marginBottom: '32px', gap: '8px', justifyContent: 'center' }}>
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: '12px 32px',
              border: 'none',
              background: activeTab === tab.value ? '#007bff' : '#f8f9fa',
              color: activeTab === tab.value ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '17px',
              fontWeight: activeTab === tab.value ? 'bold' : 'normal',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              transition: 'all 0.3s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {filteredCards.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: '18px', marginTop: '40px' }}>Nenhum documento nesta aba.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCards.map((card) => (
            <Card card={card} key={card.filename} onLike={handleLike} onDislike={handleDislike} userId={userId} />
          ))}
        </div>
      )}
      <LikeToast show={showLikeToast} type={likeType} />
    </div>
  );
}
