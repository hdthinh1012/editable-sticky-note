export interface Note {
  id: number;
  content: string;
}

export interface EditableStickyNoteProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

export interface EditorJSData {
  time?: number;
  blocks: Array<{
    id?: string;
    type: string;
    data: any;
  }>;
  version?: string;
}
