import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Editor } from '@tinymce/tinymce-react';
import { EditableStickyNoteProps } from '../types';
import BundledEditor from '../BundleEditor';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StickyNoteContainer = styled.div<{ $isEditing: boolean }>`
  width: 300px;
  min-height: 200px;
  background: linear-gradient(135deg, #f5f5f5 0%,rgb(184, 150, 150) 100%);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
  margin: ${props => props.$isEditing ? '10px 60px 10px -40px' : '10px'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0 0 10px 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 280px;
    margin: ${props => props.$isEditing ? '-40px 5px 5px 5px' : '5px'};
  }
`;

const StickyNoteDisplay = styled.div`
  padding: 20px;
  cursor: pointer;
  height: 100%;
  min-height: 180px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const StickyNoteContent = styled.div`
  color: #2d3436;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 100%;
  max-height: 160px;
  overflow-y: auto;

  &:empty::before {
    content: 'Click to add a note...';
    color: #636e72;
    font-style: italic;
  }

  /* Handle HTML content from TinyMCE */
  p {
    margin: 0.5em 0;
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0.5em 0;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const StickyNoteEditor = styled.div`
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  min-height: 300px;
  width: 400px;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 320px;
    padding: 10px;
  }
`;

const EditorContainer = styled.div`
  margin-bottom: 15px;
  
  /* TinyMCE Shadow DOM Support */
  .tox {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .tox .tox-editor-header {
    border-radius: 4px 4px 0 0;
  }

  .tox .tox-edit-area {
    border-radius: 0 0 4px 4px;
  }

  .tox-tinymce {
    border: 1px solid #e0e0e0 !important;
    border-radius: 4px;
  }

  /* Ensure TinyMCE works in shadow DOM */
  .tox .tox-menu {
    z-index: 10000 !important;
  }

  .tox .tox-collection {
    z-index: 10000 !important;
  }

  @media (max-width: 768px) {
    .tox-tinymce {
      max-width: 100%;
    }
  }
`;

const EditorControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(Button)`
  background: #dc143c;
  color: white;
  border-color: #dc143c;
  &:hover {
    background: #b8111f;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #1a1a1a;
  border-color: #e6e6e6;

  &:hover {
    background: #e6e6e6;
  }
`;

const EditableStickyNote: React.FC<EditableStickyNoteProps> = ({ 
  initialContent = '', 
  onSave,
  shadowRoot = null
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>(initialContent);
  const [displayContent, setDisplayContent] = useState<string>('Click to add a note...');
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (noteContent) {
      // Convert HTML content to display text, preserving some formatting
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = noteContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      setDisplayContent(textContent.trim() || 'Click to add a note...');
    } else {
      setDisplayContent('Click to add a note...');
    }
  }, [noteContent]);

  // TinyMCE configuration optimized for shadow DOM
  const editorConfig = {
    height: 200,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: `
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        font-size: 14px; 
        line-height: 1.6;
        color: #2d3436;
        margin: 8px;
      }
      p { margin: 0.5em 0; }
      ul, ol { margin: 0.5em 0; padding-left: 1.5em; }
      h1, h2, h3, h4, h5, h6 { margin: 0.5em 0; }
    `,
    branding: false,
    resize: false,
    elementpath: false,
    statusbar: false,
    uploadcare_public_key: '4bc12f546ea367ed4b4d',
    // Shadow DOM support configuration
    ...(shadowRoot && {
      target_node: shadowRoot,
      setup: (editor: any) => {
        // Ensure dialogs and menus work within shadow DOM
        editor.on('init', () => {
          const editorContainer = editor.getContainer();
          if (shadowRoot && shadowRoot.contains(editorContainer)) {
            // Set up proper containment within shadow root
            editor.getBody().style.outline = 'none';
          }
        });
      }
    })
  };

  const handleNoteClick = (): void => {
    setIsEditing(true);
  };

  const handleSave = (): void => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setNoteContent(content);
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(content);
      }
      
      setIsEditing(false);
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleEditorChange = (content: string): void => {
    // Optional: Handle real-time content changes
  };

  return (
    <StickyNoteContainer $isEditing={isEditing}>
      {!isEditing ? (
        <StickyNoteDisplay onClick={handleNoteClick}>
          <StickyNoteContent 
            dangerouslySetInnerHTML={
              noteContent ? { __html: noteContent } : undefined
            }
          >
            {!noteContent && 'Click to add a note...'}
          </StickyNoteContent>
        </StickyNoteDisplay>
      ) : (
        <StickyNoteEditor>
          <EditorContainer>
            <BundledEditor
              licenseKey='gpl'
              onInit={(evt: any, editor: any) => editorRef.current = editor}
              initialValue={noteContent}
              init={editorConfig}
              onEditorChange={handleEditorChange}
            />
          </EditorContainer>
          <EditorControls>
            <SaveButton onClick={handleSave}>
              Save
            </SaveButton>
            <CancelButton onClick={handleCancel}>
              Cancel
            </CancelButton>
          </EditorControls>
        </StickyNoteEditor>
      )}
    </StickyNoteContainer>
  );
};

export default EditableStickyNote;