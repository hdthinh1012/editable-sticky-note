import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import Checklist from '@editorjs/checklist';
import { EditableStickyNoteProps, EditorJSData } from '../types';

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
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
  background: #fafafa;

  /* EditorJS Styling Overrides */
  .codex-editor {
    background: transparent;
  }

  .codex-editor__redactor {
    padding: 0;
  }

  .ce-block__content {
    max-width: none;
    margin: 0;
  }

  .ce-paragraph {
    font-size: 14px;
    line-height: 1.6;
    color: #2d3436;
  }

  .ce-header {
    color: #2d3436;
  }

  .ce-quote {
    border-left: 3px solid #00b894;
    background: rgba(0, 184, 148, 0.1);
  }

  .ce-list {
    color: #2d3436;
  }

  .ce-checklist__item-text {
    color: #2d3436;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (max-width: 768px) {
    max-height: 300px;
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

  border-color: #e6e6e6;
  &:hover {
    background: #e6e6e6;
  }
`;

const EditableStickyNote: React.FC<EditableStickyNoteProps> = ({ 
  initialContent = '', 
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>(initialContent);
  const [displayContent, setDisplayContent] = useState<string>('Click to add a note...');
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (noteContent) {
      // Convert EditorJS data to display text
      try {
        const data: EditorJSData = JSON.parse(noteContent);
        if (data.blocks && data.blocks.length > 0) {
          const textContent = data.blocks
            .map(block => {
              switch (block.type) {
                case 'paragraph':
                  return block.data.text;
                case 'header':
                  return block.data.text;
                case 'list':
                  return block.data.items.join('\n• ');
                case 'quote':
                  return `"${block.data.text}"`;
                case 'checklist':
                  return block.data.items.map((item: any) => 
                    `${item.checked ? '✓' : '○'} ${item.text}`
                  ).join('\n');
                default:
                  return block.data.text || '';
              }
            })
            .join('\n\n');
          setDisplayContent(textContent || 'Click to add a note...');
        }
      } catch (e) {
        // If it's not JSON, treat as plain text
        setDisplayContent(noteContent || 'Click to add a note...');
      }
    } else {
      setDisplayContent('Click to add a note...');
    }
  }, [noteContent]);

  const initializeEditor = async (): Promise<void> => {
    if (editorInstanceRef.current || !editorRef.current) {
      return;
    }

    const editor = new EditorJS({
      holder: editorRef.current,
      tools: {
        header: {
          class: Header as any,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph as any,
          inlineToolbar: true,
          config: {
            placeholder: 'Start writing...'
          }
        },
        list: {
          class: List as any,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: Checklist as any,
          inlineToolbar: true,
        },
        quote: {
          class: Quote as any,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        marker: {
          class: Marker as any,
          shortcut: 'CMD+SHIFT+M',
        },
        code: {
          class: CodeTool as any,
          shortcut: 'CMD+SHIFT+C',
        },
        delimiter: Delimiter as any,
        inlineCode: {
          class: InlineCode as any,
          shortcut: 'CMD+SHIFT+M',
        },
        linkTool: {
          class: LinkTool as any,
          config: {
            endpoint: 'http://localhost:8008/fetchUrl', // You'll need to implement this endpoint
          }
        },
        embed: {
          class: Embed as any,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
        table: {
          class: Table as any,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        warning: {
          class: Warning as any     ,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
          },
        },
        image: {
          class: Image as any,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // You'll need to implement this endpoint
              byUrl: 'http://localhost:8008/fetchUrl',
            }
          }
        },
        raw: Raw as any,
      },
      data: noteContent ? JSON.parse(noteContent) : {},
      placeholder: 'Start writing your note...',
    });

    await editor.isReady;
    editorInstanceRef.current = editor;
  };

  const handleNoteClick = async (): Promise<void> => {
    setIsEditing(true);
    // Wait for the next render cycle to ensure the editor container is in the DOM
    setTimeout(() => {
      initializeEditor();
    }, 0);
  };

  const handleSave = async (): Promise<void> => {
    if (editorInstanceRef.current) {
      try {
        const savedData = await editorInstanceRef.current.save();
        const jsonContent = JSON.stringify(savedData);
        setNoteContent(jsonContent);
        
        // Call the onSave callback if provided
        if (onSave) {
          onSave(jsonContent);
        }
        
        // Clean up editor
        if (editorInstanceRef.current.destroy) {
          editorInstanceRef.current.destroy();
        }
        editorInstanceRef.current = null;
        setIsEditing(false);
      } catch (error) {
        console.error('Saving failed:', error);
      }
    }
  };

  const handleCancel = (): void => {
    // Clean up editor
    if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
      editorInstanceRef.current.destroy();
    }
    editorInstanceRef.current = null;
    setIsEditing(false);
  };

  return (
    <StickyNoteContainer $isEditing={isEditing}>
      {!isEditing ? (
        <StickyNoteDisplay onClick={handleNoteClick}>
          <StickyNoteContent>
            {displayContent}
          </StickyNoteContent>
        </StickyNoteDisplay>
      ) : (
        <StickyNoteEditor>
          <EditorContainer ref={editorRef} />
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
