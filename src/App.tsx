import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import useSocket from './hooks/useSocket';

function App() {
  const [query, setQuery] = useState<string>(''); //This state is used for the textfield(search field)
  const [chats, setChats] = useState<any>([]); //This state is use to display the chats between the current_user and AI
  const [error, setError] = useState(''); //This state is used to display error in case when socket is not connected
  const [loader, setLoader] = useState(false); //Loader state to show the Loading response card after sending the request to backend
  const socket = useSocket(process.env.REACT_APP_HOST_BACKEND || ""); //custom hook to connect with client socket with server 

  // Create a ref to the chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  //This method is called when we click on search button
  const onSearch = () => {
    //first checks if the client socket is connected else will throw the error
    if (socket) {
      // Sets the loader to true
      setLoader(true);
      // deep copying the chats state into new variable
      let newChat = JSON.parse(JSON.stringify(chats));
      // pushing the new query asked by current user to chats array
      newChat.push({
        role: 'user',
        content: query
      });
      setChats(newChat);
      // after clicking on search emptying the textfield state
      setQuery('');
      // sending the recent query message to the server using socket.emit() method
      socket.emit('message', newChat);
    } else {
      // if socket is not connected then throw this error
      setError('Client Socket is disconnected');
    }
  }

  useEffect(() => {
    if (socket) {
      // Appends the message recieved from open ai server to the chats state array
      socket.on('message', (message) => {
        console.log('meesage', message);
        let newChat = JSON.parse(JSON.stringify(chats));
        newChat.push({
          role: 'assistant',
          content: message.choices[0]?.message.content
        });
        setChats(newChat);
        setLoader(false);
      })
    } else {
      // if socket is not connected then throw this error
      setError('Client Socket is disconnected');
    }
  }, [socket, chats])

  // This useEffect will ensures that user always remain at the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="App">
      <Container sx={{ my: 2 }}>
        <Typography variant='h3' sx={{ my: 4 }}>Chat Bot Application</Typography>
        {/* Parent Card */}
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
          {/* This card content will render the messages in cards */}
          <CardContent
            ref={chatContainerRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* looping over the chats and if the author of chat is user i.e, current then they are displyed on left else if the chat is from the server
             then they are displayed on right */}
            {chats.map((chat: { role: string; content: string }, index: number) => (
              <Card
                key={index}
                sx={{
                  display: 'flex',
                  alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start',
                  background: chat.role === 'user' ? 'whitesmoke' : 'rgb(0,60,0,0.7)',
                  color: chat.role === 'user' ? 'black' : 'white',
                  margin: 2,
                  padding: 2,
                  overflow: 'visible',
                  maxWidth: '50%',
                  height: 'auto',
                  wordBreak: 'break-word',
                  marginBottom: 1, // Adds space between each message
                }}
              >
                {chat.content}
              </Card>
            ))}
          </CardContent>

          {/* Input area which is stick to the bottom of parent card and contains a textfield, search button and "Loading Response..." card */}
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
