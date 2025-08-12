import React, { useState } from 'react';
import styled from 'styled-components';
import EditableStickyNote from './components/EditableStickyNote';
import { Note } from './types';

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const AppHeader = styled.header`
  margin-bottom: 40px;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 0 20px;
    }
  }
`;

const NotesContainer = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AddNoteButton = styled.button`
  width: 300px;
  height: 200px;
  border: 3px dashed rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  margin: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 180px;
    font-size: 16px;
  }
`;

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: '' },
    { id: 2, content: '' },
    { id: 3, content: '' }
  ]);

  const handleNoteSave = (noteId: number, content: string): void => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, content } 
          : note
      )
    );
    console.log(`Note ${noteId} saved:`, content);
  };

  const addNewNote = (): void => {
    const newId = Math.max(...notes.map(n => n.id)) + 1;
    setNotes(prevNotes => [...prevNotes, { id: newId, content: '' }]);
  };

  return (
    <AppContainer>
      <AppHeader>
        <h1>Editable Sticky Notes</h1>
        <p>Click on any note to start editing with rich text features!</p>
      </AppHeader>
      
      <NotesContainer>
        {notes.map(note => (
          <EditableStickyNote
            key={note.id}
            initialContent={note.content}
            onSave={(content) => handleNoteSave(note.id, content)}
          />
        ))}
        
        <AddNoteButton onClick={addNewNote}>
          + Add New Note
        </AddNoteButton>
      </NotesContainer>
    </AppContainer>
  );
};

export default App;
