import { useState } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

function Home() {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [newsData, setNewsData] = useState({
    0: [
      { id: 1, title: "New JavaScript framework released", upvotes: 15, downvotes: 3, votes: {} },
      { id: 2, title: "React 19 beta now available", upvotes: 42, downvotes: 8, votes: {} },
      { id: 3, title: "Web development trends for 2024", upvotes: 28, downvotes: 5, votes: {} },
      { id: 4, title: "CSS Grid vs Flexbox comparison", upvotes: 33, downvotes: 12, votes: {} },
    ],
    1: [
      { id: 5, title: "AI tools for developers", upvotes: 67, downvotes: 15, votes: {} },
      { id: 6, title: "GitHub Copilot review", upvotes: 89, downvotes: 22, votes: {} },
      { id: 7, title: "Machine learning in web apps", upvotes: 45, downvotes: 18, votes: {} },
      { id: 8, title: "ChatGPT for coding assistance", upvotes: 76, downvotes: 31, votes: {} },
    ],
    2: [
      { id: 9, title: "Next.js performance tips", upvotes: 52, downvotes: 7, votes: {} },
      { id: 10, title: "Server-side rendering guide", upvotes: 38, downvotes: 9, votes: {} },
      { id: 11, title: "Static site generation benefits", upvotes: 41, downvotes: 6, votes: {} },
      { id: 12, title: "Deploying to Vercel tutorial", upvotes: 29, downvotes: 4, votes: {} },
    ]
  });

  const handleVote = (tabIndex, newsId, voteType) => {
    if (!isSignedIn) {
      alert('Please sign in to vote!');
      return;
    }

    const userId = user.id;
    const currentNews = newsData[tabIndex].find(news => news.id === newsId);

    // Check if user already voted on this news
    if (currentNews.votes[userId]) {
      const previousVote = currentNews.votes[userId];

      // If same vote, remove it (toggle)
      if (previousVote === voteType) {
        setNewsData(prevData => ({
          ...prevData,
          [tabIndex]: prevData[tabIndex].map(news => {
            if (news.id === newsId) {
              const newVotes = { ...news.votes };
              delete newVotes[userId];
              return {
                ...news,
                [voteType]: news[voteType] - 1,
                votes: newVotes
              };
            }
            return news;
          })
        }));
        return;
      }

      // If different vote, change it
      setNewsData(prevData => ({
        ...prevData,
        [tabIndex]: prevData[tabIndex].map(news => {
          if (news.id === newsId) {
            return {
              ...news,
              [previousVote]: news[previousVote] - 1,
              [voteType]: news[voteType] + 1,
              votes: { ...news.votes, [userId]: voteType }
            };
          }
          return news;
        })
      }));
      return;
    }

    // New vote
    setNewsData(prevData => ({
      ...prevData,
      [tabIndex]: prevData[tabIndex].map(news => {
        if (news.id === newsId) {
          return {
            ...news,
            [voteType]: news[voteType] + 1,
            votes: { ...news.votes, [userId]: voteType }
          };
        }
        return news;
      })
    }));
  };

  const getUserVote = (news) => {
    if (!isSignedIn) return null;
    return news.votes[user?.id] || null;
  };

  const tabs = [
    { name: "Technology", index: 0 },
    { name: "AI & ML", index: 1 },
    { name: "Web Development", index: 2 }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header with Authentication */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>
          News Voting System
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSignedIn ? (
            <>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Welcome, {user.firstName || user.emailAddresses[0].emailAddress}!
              </span>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Sign In to Vote
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.index}
            onClick={() => setActiveTab(tab.index)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === tab.index ? '#007bff' : '#f8f9fa',
              color: activeTab === tab.index ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.index ? 'bold' : 'normal',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              marginRight: '4px',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontSize: '16px', fontWeight: 'bold' }}>
                News
              </th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontSize: '16px', fontWeight: 'bold', width: '200px' }}>
                Vote
              </th>
            </tr>
          </thead>
          <tbody>
            {newsData[activeTab].map((news) => {
              const userVote = getUserVote(news);
              return (
                <tr key={news.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    {news.title}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handleVote(activeTab, news.id, 'upvotes')}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: userVote === 'upvotes' ? '#155724' : '#28a745',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: isSignedIn ? 'pointer' : 'not-allowed',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          opacity: isSignedIn ? 1 : 0.6
                        }}
                        disabled={!isSignedIn}
                      >
                        👍 {news.upvotes}
                      </button>
                      <button
                        onClick={() => handleVote(activeTab, news.id, 'downvotes')}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: userVote === 'downvotes' ? '#721c24' : '#dc3545',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: isSignedIn ? 'pointer' : 'not-allowed',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          opacity: isSignedIn ? 1 : 0.6
                        }}
                        disabled={!isSignedIn}
                      >
                        👎 {news.downvotes}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!isSignedIn && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>
              Sign in to vote on news articles and track your voting history!
            </p>
            <SignInButton mode="modal">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                Sign In Now
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </div>
  );
}

// Define que Home é a saída padrão
export default Home;
