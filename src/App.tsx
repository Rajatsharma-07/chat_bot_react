import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './App.css';
import useSocket from './hooks/useSocket';

function App() {
  const [query, setQuery] = useState<string>('');
  const [chats, setChats] = useState<any>([]);
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const socket = useSocket(process.env.REACT_APP_HOST_BACKEND || "");
  const onSearch = () => {
    if (socket) {
      setLoader(true);
      let newChat = JSON.parse(JSON.stringify(chats));
      newChat.push({
        user: 'current',
        message: query
      });
      setChats(newChat);
      setQuery('');
      socket.emit('message', chats);
    } else {
      setError('Something went wrong!')
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        let newChat = JSON.parse(JSON.stringify(chats));
        newChat.push({
          user: 'AI',
          message: message
        });
        setChats(newChat);
        setLoader(false);
      })
    }
  }, [socket, chats])

  return (
    <div className="App">
      <Container sx={{ my: 2 }}>
        <Typography variant='h3' sx={{ my: 4 }}>Chat Bot Application</Typography>
        <Card
          sx={{
            border: '2px solid green',
            borderRadius: '20px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            background: 'rgba(0, 200, 0, 0.1)',
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {chats.map((chat: { user: string; message: string }, index: number) => (
              <Card
                key={index}
                sx={{
                  display: 'flex',
                  alignSelf: chat.user === 'current' ? 'flex-end' : 'flex-start',
                  background: chat.user === 'current' ? 'whitesmoke' : 'rgb(0,60,0,0.7)',
                  color: chat.user === 'current' ? 'black' : 'white',
                  margin: 2,
                  padding: 2,
                  overflow: 'visible',
                  maxWidth: '50%',
                  height: 'auto',
                  wordBreak: 'break-word',
                  marginBottom: 1, // Adds space between each message
                }}
              >
                  {chat.message}
              </Card>
            ))}
          </CardContent>

          {/* Input area */}
          <Stack spacing={2} sx={{ padding: 2 }}>
            {loader && (
              <Card
                sx={{
                  py: 2,
                  textAlign: 'center',
                  width: 'auto',
                  background: 'whitesmoke',
                }}
              >
                Loading Response...
              </Card>
            )}
            <Stack spacing={2} direction="row">
              <TextField
                error={error !== ''}
                placeholder="Ask me something..."
                fullWidth
                type="text"
                multiline
                value={query}
                sx={{
                  background: 'rgba(255, 253, 208, 0.5)',
                  color: 'white',
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setQuery(e.target.value)
                }
              />
              <Button variant="contained" size="small" color="success" onClick={onSearch}>
                Search
              </Button>
            </Stack>
          </Stack>
        </Card>

      </Container>
    </div>
  );

}

export default App;
