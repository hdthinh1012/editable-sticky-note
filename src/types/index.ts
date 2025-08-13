export interface Note {
  id: number;
  content: string;
}

export interface EditableStickyNoteProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  shadowRoot?: ShadowRoot | null;
}

export interface TinyMCEConfig {
  height?: number;
  menubar?: boolean;
  plugins?: string[];
  toolbar?: string;
  content_style?: string;
  setup?: (editor: any) => void;
}
