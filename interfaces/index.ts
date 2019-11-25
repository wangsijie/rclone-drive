// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type User = {
  id: number
  name: string
}

export interface RCloneFile {
  name: string;
  time?: string;
  type?: string;
  size?: number;
  icon: 'folder' | 'file';
  isDir: boolean;
  path: string;
}
